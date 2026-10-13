# Windows scanner agent

This Rust service runs on the Windows computer connected to the scanner. It
discovers WIA scanners, invokes NAPS2, and returns the scanned document image.
The website's Node.js server functions handle Gemini extraction, cropping,
student-field mapping, duplicate checks, object storage, and database writes.

## Install and run (installer)

Run **ScannerAgentSetup-Rust.exe** (from `installer-output/`). The installer:
- Places `ScannerAgent.exe` under `%LOCALAPPDATA%\ScannerAgent\`
- Copies `.env.example` as `.env` (only if `.env` does not already exist)
- Adds `ScannerAgent.exe` to the Windows run-at-login registry key
- Optionally launches the agent immediately after installation

After installation, open `%LOCALAPPDATA%\ScannerAgent\.env` in a text editor
and fill in your configuration (see below), then restart the agent.

## Install and run (manual / development)

1. Install NAPS2 on Windows and confirm `NAPS2.Console.exe` is available. The
   default path is `C:\Program Files\NAPS2\NAPS2.Console.exe`.
2. [Install Rust](https://rustup.rs/) and build a release binary:

   ```powershell
   cargo build --release
   Copy-Item .env.example .env
   ```

3. In `.env`, set `SCANNER_AGENT_TOKEN` to a random secret of at least 32
   characters, set `MOSQUE_APP_ORIGINS` to the exact deployed website origin
   plus any local development origin, and adjust `NAPS2_CONSOLE_PATH` if needed.
4. Run the service (binds to loopback only):

   ```powershell
   .\target\release\scanner-agent.exe
   ```

5. Open **Create student from document** in the website and enter the same
   scanner token in the dialog. The token is kept only in page memory.

The website calls `GET /health`, `GET /scanners`, then `POST /scan` with
`{"scanner_id":"..."}`. Scanner-list and scan requests require the
`X-Scanner-Agent-Token` header. The agent checks the browser origin and local
host, permits one scan at a time, has a bounded NAPS2 timeout, and caps images
at 15 MB. It does not log scan contents or the token.

When a hosted HTTPS website first contacts a localhost service, Chrome may
show a Local Network Access permission prompt. The user must allow the site to
reach the local scanner agent; the site cannot grant this browser permission
itself.

## Releasing a new version

The GitHub Actions workflow (`.github/workflows/scanner-agent.yml`) builds the
Rust binary and packages the installer automatically on every push to `main`
that touches files under `scanner-agent/`. **The build runs on every push, but
a GitHub Release is only created when you push a version tag.**

To publish a new installer to the stable download URL used by the website:

```bash
git tag scanner-agent-v1.0.1
git push origin scanner-agent-v1.0.1
```

This triggers the same build, then creates a GitHub Release named
`scanner-agent-v1.0.1` with `ScannerAgentSetup-Rust.exe` attached. The stable
download URL never changes:

```
https://github.com/amimardev/mosque_app/releases/latest/download/ScannerAgentSetup-Rust.exe
```

The website's **agent not installed** dialog always points to this URL, so
users automatically get the latest installer without any frontend changes.

## Troubleshooting

- If health reports `token_configured: false`, set a 32-character-or-longer
  `SCANNER_AGENT_TOKEN` and restart the agent.
- If the site is blocked by CORS, add its exact origin (scheme and host, no
  trailing slash) to `MOSQUE_APP_ORIGINS` and restart the agent.
- If NAPS2 cannot find devices, verify the scanner is installed as a WIA device
  and that `NAPS2.Console.exe --listdevices --driver wia` works.
- For a missing executable, set `NAPS2_CONSOLE_PATH` to its actual location.
