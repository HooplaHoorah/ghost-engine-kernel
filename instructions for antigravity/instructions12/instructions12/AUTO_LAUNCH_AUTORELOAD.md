# Auto-Launch / Auto-Reload Workflows

## Option A: Auto-launch via CLI (`ge-fetch --launch`)
Enhance `scripts/ge-fetch.js`:
- Add flag `--launch`
- Accept env vars:
  - `GE_DOOM_BIN` (path to executable)
  - `GE_DOOM_ARGS` (optional extra args)
- After saving file, run:
  - `GE_DOOM_BIN --levelSpec <savedPath>` (plus GE_DOOM_ARGS)

### Acceptance criteria
- Single command runs end-to-end:
  - `API_BASE_URL=... GE_DOOM_BIN=... node scripts/ge-fetch.js <jobId> --launch`
- Game opens directly into the generated level

## Option B: Auto-reload watched folder
Implement in GE Doom:
- Watch `Levels/incoming/` for newest `*.levelSpec.json`
- On change/new file:
  - validate + load into the game
  - optionally auto-restart level

### Acceptance criteria
- Running `ge-fetch <jobId>` while game is open causes the game to load that level automatically

## Recommended stage setup
- Use Auto-launch for “wow”
- Use Auto-reload for rapid iteration during development
