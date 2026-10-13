# Windows scanner agent

This Rust service runs locally on the Windows PC connected to the physical scanner. It
discovers WIA scanners, invokes NAPS2, and returns the scanned document image directly to the browser.
The website's server functions handle AI parsing, image cropping, and student saving.

## Security Model

The agent binds strictly to loopback (`127.0.0.1:8765`) and uses browser origin verification (`Origin` header + CORS).
Only requests coming from approved domains (by default `https://mosque-app-pi.vercel.app` and `localhost`) are accepted.
No complex tokens or passwords are required for end users.

## Install and run (Installer)

Run **ScannerAgentSetup-Rust.exe** (from `installer-output/` or downloaded from GitHub Releases). The installer:
- Places `ScannerAgent.exe` under `%LOCALAPPDATA%\ScannerAgent\`
- Pre-configures `.env` automatically with default origins and settings
- Adds `ScannerAgent.exe` to the Windows run-at-login registry key
- Launches the agent immediately after installation

Once installed, it runs silently in the background and is ready to use immediately.

## Install and run (Manual / Development)

1. Install NAPS2 on Windows and confirm `NAPS2.Console.exe` is available (default: `C:\Program Files\NAPS2\NAPS2.Console.exe`).
2. Build release binary:

   ```powershell
   cargo build --release
   Copy-Item .env.example .env
   ```

3. Run the service (binds to loopback `127.0.0.1:8765`):

   ```powershell
   .\target\release\scanner-agent.exe
   ```

## Releasing a new version

The GitHub Actions workflow (`.github/workflows/scanner-agent.yml`) builds the
Rust binary and packages the installer automatically on Windows runners.

To publish a new installer to the permanent download URL:

```bash
git tag scanner-agent-v1.0.1
git push origin scanner-agent-v1.0.1
```

This creates a GitHub Release with `ScannerAgentSetup-Rust.exe` attached. The permanent download URL is:

```
https://github.com/amimardev/mosque_app/releases/latest/download/ScannerAgentSetup-Rust.exe
```

## Troubleshooting

- If the site is blocked by CORS, ensure your website origin (scheme and host, no trailing slash) is included in `MOSQUE_APP_ORIGINS`.
- If NAPS2 cannot find devices, verify the scanner is installed as a WIA device in Windows and that `NAPS2.Console.exe --listdevices --driver wia` works.
- For a custom NAPS2 path, set `NAPS2_CONSOLE_PATH` in `.env`.
