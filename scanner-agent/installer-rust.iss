[Setup]
AppId={{7A4A6723-C48E-4EA5-8461-6F09E168B8DB}
AppName=Scanner Agent
AppVersion=1.0.0
AppPublisher=Mosque Student Scanner
DefaultDirName={localappdata}\ScannerAgent
DefaultGroupName=Scanner Agent
DisableProgramGroupPage=yes
OutputDir=installer-output
OutputBaseFilename=ScannerAgentSetup-Rust
Compression=lzma
SolidCompression=yes
PrivilegesRequired=lowest

[Files]
Source: "target\release\scanner-agent.exe"; DestDir: "{app}"; DestName: "ScannerAgent.exe"; Flags: ignoreversion
Source: ".env.example"; DestDir: "{app}"; DestName: ".env"; Flags: ignoreversion

[Icons]
Name: "{group}\Scanner Agent"; Filename: "{app}\ScannerAgent.exe"

[Registry]
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "ScannerAgent"; ValueData: """{app}\ScannerAgent.exe"""; Flags: uninsdeletevalue

[Run]
Filename: "{app}\ScannerAgent.exe"; Description: "Start Scanner Agent"; Flags: nowait postinstall skipifsilent
