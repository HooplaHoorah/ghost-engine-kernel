# Play Command Polish (Reliable + Cross-platform)

Runtime expects a local file, so download then run.

## Bash (macOS/Linux/Git Bash)
Use `-L` in case of redirects:
```bash
curl -L "<PRESIGNED_URL>" -o level.json && node ge-doom/runtime.js --levelSpec level.json
```

## Windows PowerShell
```powershell
Invoke-WebRequest -Uri "<PRESIGNED_URL>" -OutFile "level.json"
node ge-doom/runtime.js --levelSpec level.json
```

## Optional: helper script
If you have `scripts/ge-fetch.js --launch`, prefer showing that:
```bash
node scripts/ge-fetch.js --launch "<PRESIGNED_URL>"
```
