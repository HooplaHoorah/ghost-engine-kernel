# One-Button Workflow (stage demo)

## Recommended: CLI fetcher + auto-launch
Create a small script `ge-fetch` that:
1) calls Ghost Engine API `GET /status/:jobId`
2) gets `result.levelSpecUrl` (or `result.levelSpec` inline)
3) downloads and saves to:
   - `GE_DOOM/Levels/incoming/<jobId>.levelSpec.json`
4) launches GE Doom with arg:
   - `--levelSpec <path>`
   - or writes `latest.json` and game auto-loads newest

### Inputs
- `API_BASE_URL` (env var)
- `JOB_ID` (arg)
- `GE_DOOM_PATH` (env var or default relative path)

### Outputs
- printed path saved
- non-zero exit code on failure

See `templates/ge-fetch.js` and `templates/ge-fetch.py`.

## Alternative: watched folder
If you already have a content hot-reload system:
- game watches `Levels/incoming/`
- `/demo` provides “Download LevelSpec” (already)
- dropping file triggers load

