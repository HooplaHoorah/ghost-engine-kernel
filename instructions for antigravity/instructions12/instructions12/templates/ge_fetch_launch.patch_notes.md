# ge-fetch --launch patch notes

Enhance your existing `scripts/ge-fetch.js`:

## Add CLI flag parsing
- detect `--launch`
- optionally accept `--outDir` override

## Add env vars
- `GE_DOOM_BIN` (required when --launch)
- `GE_DOOM_ARGS` (optional string, split on spaces)

## Spawn
Use `child_process.spawn` or `spawnSync`:
- args: `["--levelSpec", savedPath, ...extraArgs]`
- stdio: inherit

## Behavior
- If `--launch` present and `GE_DOOM_BIN` missing:
  - print friendly error and exit 2
- Always print saved path before launching
