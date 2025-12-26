# Finish ge-fetch --launch

## Requirements
- `node scripts/ge-fetch.js <jobId> --launch` should:
  - download/save LevelSpec to `Levels/incoming/<jobId>.levelSpec.json`
  - launch GE Doom runtime using `GE_DOOM_EXEC`
  - pass `--levelSpec <savedPath>` to runtime
  - inherit stdio

## Environment
- `API_BASE_URL` (required)
- `GE_DOOM_DIR` (optional, default ".")
- `GE_DOOM_EXEC` (required for --launch)
  - examples:
    - `GE_DOOM_EXEC="node ge-doom/runtime.js"`
    - `GE_DOOM_EXEC="node ./ge-doom/runtime.js"`
    - `GE_DOOM_EXEC="/absolute/path/to/ge-doom-runtime"` (future)

## Notes
- Parse GE_DOOM_EXEC safely:
  - simplest: split on whitespace but respect quotes
  - acceptable shortcut: require user to avoid spaces in paths (or document quoting expectations)

## Acceptance
- Command prints saved path and then launches runtime showing the ASCII level.
- If GE_DOOM_EXEC missing, exit with code 2 and a friendly error.

See `templates/ge-fetch.launch.snippet.js`.
