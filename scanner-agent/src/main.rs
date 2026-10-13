#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::net::SocketAddr;
use std::os::windows::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::Arc;
use std::time::Duration;

use axum::extract::State;
use axum::http::{header, HeaderMap, Method, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use base64::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::sync::Mutex;
use tower_http::cors::{AllowOrigin, CorsLayer};
use tracing::{error, info, warn};
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

const MAX_SCAN_BYTES: usize = 15 * 1024 * 1024;
const DEFAULT_NAPS2_PATH: &str = r"C:\Program Files\NAPS2\NAPS2.Console.exe";
const DEFAULT_APP_ORIGINS: &str = "https://mosque-app-pi.vercel.app,http://localhost:3000,http://127.0.0.1:3000";
const CREATE_NO_WINDOW: u32 = 0x08000000;

#[derive(Clone)]
struct AppState {
    allowed_origins: Vec<String>,
    naps2_path: PathBuf,
    scan_lock: Arc<Mutex<()>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Scanner {
    id: String,
    name: String,
}

#[derive(Debug, Deserialize)]
struct ScanRequest {
    scanner_id: String,
}

#[derive(Debug, Serialize)]
struct ScanImage {
    scan_id: String,
    mime_type: String,
    image_base64: String,
}

#[derive(Debug)]
struct AppError {
    status: StatusCode,
    detail: String,
}

impl AppError {
    fn new(status: StatusCode, detail: impl Into<String>) -> Self {
        Self {
            status,
            detail: detail.into(),
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (self.status, Json(json!({ "detail": self.detail }))).into_response()
    }
}

fn require_local_request(headers: &HeaderMap, allowed_origins: &[String]) -> Result<(), AppError> {
    let host = headers
        .get(header::HOST)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_ascii_lowercase();

    let host_name = host
        .split(':')
        .next()
        .unwrap_or("")
        .trim_matches(|c| c == '[' || c == ']');

    if !["127.0.0.1", "localhost", "::1"].contains(&host_name) {
        return Err(AppError::new(StatusCode::FORBIDDEN, "Local requests only"));
    }

    if let Some(origin_header) = headers.get("origin").and_then(|v| v.to_str().ok()) {
        let origin = origin_header.trim_end_matches('/');
        if !allowed_origins.iter().any(|allowed| allowed == origin) {
            return Err(AppError::new(
                StatusCode::FORBIDDEN,
                "Website origin is not allowed",
            ));
        }
    }

    Ok(())
}


fn run_command_with_timeout(
    mut cmd: Command,
    timeout: Duration,
) -> Result<std::process::Output, AppError> {
    cmd.creation_flags(CREATE_NO_WINDOW);
    cmd.stdout(Stdio::piped()).stderr(Stdio::piped());

    let mut child = cmd
        .spawn()
        .map_err(|e| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to spawn process: {e}")))?;

    let start = std::time::Instant::now();
    loop {
        match child.try_wait() {
            Ok(Some(status)) => {
                let stdout = child.stdout.take().map(|mut r| {
                    let mut b = Vec::new();
                    std::io::Read::read_to_end(&mut r, &mut b).ok();
                    b
                }).unwrap_or_default();

                let stderr = child.stderr.take().map(|mut r| {
                    let mut b = Vec::new();
                    std::io::Read::read_to_end(&mut r, &mut b).ok();
                    b
                }).unwrap_or_default();

                return Ok(std::process::Output {
                    status,
                    stdout,
                    stderr,
                });
            }
            Ok(None) => {
                if start.elapsed() >= timeout {
                    let _ = child.kill();
                    return Err(AppError::new(
                        StatusCode::GATEWAY_TIMEOUT,
                        "Process operation timed out",
                    ));
                }
                std::thread::sleep(Duration::from_millis(100));
            }
            Err(e) => {
                return Err(AppError::new(
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("Error waiting for process: {e}"),
                ));
            }
        }
    }
}

fn list_scanners_sync(naps2_path: &Path) -> Result<Vec<Scanner>, AppError> {
    if !naps2_path.is_file() {
        return Err(AppError::new(
            StatusCode::SERVICE_UNAVAILABLE,
            "NAPS2.Console.exe was not found; configure NAPS2_CONSOLE_PATH",
        ));
    }

    let mut cmd = Command::new(naps2_path);
    cmd.args(["--listdevices", "--driver", "wia"]);

    let output = match run_command_with_timeout(cmd, Duration::from_secs(30)) {
        Ok(out) => out,
        Err(e) if e.status == StatusCode::GATEWAY_TIMEOUT => {
            return Err(AppError::new(
                StatusCode::GATEWAY_TIMEOUT,
                "NAPS2 scanner discovery timed out",
            ));
        }
        Err(e) => return Err(e),
    };

    if !output.status.success() {
        return Err(AppError::new(
            StatusCode::BAD_GATEWAY,
            "NAPS2 could not list scanners",
        ));
    }

    let stdout_text = String::from_utf8_lossy(&output.stdout);
    let scanners = stdout_text
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty())
        .map(|name| Scanner {
            id: name.to_string(),
            name: name.to_string(),
        })
        .collect();

    Ok(scanners)
}

fn scan_sync(naps2_path: &Path, scanner_id: &str) -> Result<ScanImage, AppError> {
    let scanners = list_scanners_sync(naps2_path)?;
    if !scanners.iter().any(|s| s.id == scanner_id) {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            "Selected scanner is no longer available",
        ));
    }

    let temp_dir = tempfile::Builder::new()
        .prefix("mosque-scan-")
        .tempdir()
        .map_err(|e| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to create temp dir: {e}")))?;

    let output_file = temp_dir.path().join("document.png");

    let mut cmd = Command::new(naps2_path);
    cmd.args([
        "-o",
        output_file.to_str().unwrap_or("document.png"),
        "--noprofile",
        "--driver",
        "wia",
        "--device",
        scanner_id,
        "--source",
        "glass",
        "--pagesize",
        "a4",
        "--dpi",
        "300",
        "--bitdepth",
        "color",
        "-f",
        "-v",
    ]);

    let output = match run_command_with_timeout(cmd, Duration::from_secs(180)) {
        Ok(out) => out,
        Err(e) if e.status == StatusCode::GATEWAY_TIMEOUT => {
            return Err(AppError::new(
                StatusCode::GATEWAY_TIMEOUT,
                "Scanner operation timed out",
            ));
        }
        Err(e) => return Err(e),
    };

    if !output.status.success() || !output_file.is_file() {
        return Err(AppError::new(
            StatusCode::BAD_GATEWAY,
            "NAPS2 scan failed; check scanner and NAPS2 logs",
        ));
    }

    let image_bytes = fs::read(&output_file)
        .map_err(|e| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to read scan output: {e}")))?;

    if image_bytes.is_empty() || image_bytes.len() > MAX_SCAN_BYTES {
        return Err(AppError::new(
            StatusCode::PAYLOAD_TOO_LARGE,
            "Scanned image is empty or exceeds the 15 MB limit",
        ));
    }

    let mime_type = if image_bytes.starts_with(b"\x89PNG\r\n\x1a\n") {
        "image/png"
    } else if image_bytes.starts_with(b"\xff\xd8\xff") {
        "image/jpeg"
    } else {
        return Err(AppError::new(
            StatusCode::UNSUPPORTED_MEDIA_TYPE,
            "NAPS2 returned an unsupported image format",
        ));
    };

    let base64_data = BASE64_STANDARD.encode(&image_bytes);
    let scan_id = uuid::Uuid::new_v4().to_string();

    Ok(ScanImage {
        scan_id,
        mime_type: mime_type.to_string(),
        image_base64: base64_data,
    })
}

async fn health_handler(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    require_local_request(&headers, &state.allowed_origins)?;
    Ok(Json(json!({
        "ok": true,
        "version": "1.0.0"
    })))
}

async fn scanners_handler(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    require_local_request(&headers, &state.allowed_origins)?;
    let naps2_path = state.naps2_path.clone();

    let scanners = tokio::task::spawn_blocking(move || list_scanners_sync(&naps2_path))
        .await
        .map_err(|e| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Task failure: {e}")))??;

    Ok(Json(json!({ "scanners": scanners })))
}

async fn scan_handler(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(body): Json<ScanRequest>,
) -> Result<Json<ScanImage>, AppError> {
    require_local_request(&headers, &state.allowed_origins)?;

    if body.scanner_id.is_empty() || body.scanner_id.len() > 512 {
        return Err(AppError::new(StatusCode::BAD_REQUEST, "Invalid scanner_id"));
    }

    let lock = state.scan_lock.clone();
    let _guard = match lock.try_lock() {
        Ok(guard) => guard,
        Err(_) => {
            return Err(AppError::new(
                StatusCode::CONFLICT,
                "A scan is already in progress",
            ));
        }
    };

    let naps2_path = state.naps2_path.clone();
    let scanner_id = body.scanner_id;

    let result = tokio::task::spawn_blocking(move || scan_sync(&naps2_path, &scanner_id))
        .await
        .map_err(|e| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, format!("Scan task failure: {e}")))??;

    Ok(Json(result))
}

#[tokio::main]
async fn main() {
    // 1. Locate base directory (adjacent to exe when deployed)
    let base_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."));

    // 2. Load .env
    let exe_env = base_dir.join(".env");
    if exe_env.is_file() {
        let _ = dotenvy::from_path(&exe_env);
    } else {
        let _ = dotenvy::dotenv();
    }

    // 3. Configure logging to agent.log and stdout
    let file_appender = tracing_appender::rolling::never(&base_dir, "agent.log");
    let (non_blocking, _guard) = tracing_appender::non_blocking(file_appender);

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new("info"))
        .with(tracing_subscriber::fmt::layer().with_writer(non_blocking))
        .init();

    info!("Starting Mosque Student Scanner Agent (Rust)");

    // 4. Read configuration
    let configured_origins = std::env::var("MOSQUE_APP_ORIGINS")
        .unwrap_or_else(|_| DEFAULT_APP_ORIGINS.to_string());
    let configured_origins = if configured_origins.trim().is_empty() {
        DEFAULT_APP_ORIGINS.to_string()
    } else {
        configured_origins
    };

    let allowed_origins: Vec<String> = configured_origins
        .split(',')
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .map(|s| s.trim_end_matches('/').to_string())
        .collect();

    let naps2_path = std::env::var("NAPS2_CONSOLE_PATH")
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from(DEFAULT_NAPS2_PATH));

    let port: u16 = std::env::var("SCANNER_AGENT_PORT")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(8765);

    let state = AppState {
        allowed_origins: allowed_origins.clone(),
        naps2_path,
        scan_lock: Arc::new(Mutex::new(())),
    };

    // 5. Build CORS layer
    let mut cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([header::CONTENT_TYPE])
        .max_age(Duration::from_secs(300));

    if allowed_origins.is_empty() {
        cors = cors.allow_origin(AllowOrigin::list([]));
    } else {
        let header_origins: Vec<_> = allowed_origins
            .iter()
            .filter_map(|o| o.parse().ok())
            .collect();
        cors = cors.allow_origin(header_origins);
    }

    // 6. Assemble Router
    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/scanners", get(scanners_handler))
        .route("/scan", post(scan_handler))
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    info!("Binding to {addr}");

    let listener = match tokio::net::TcpListener::bind(addr).await {
        Ok(l) => l,
        Err(e) => {
            error!("Failed to bind to {addr}: {e}");
            return;
        }
    };

    info!("Scanner agent listening on http://{addr}");
    if let Err(e) = axum::serve(listener, app).await {
        error!("Server error: {e}");
    }
}
