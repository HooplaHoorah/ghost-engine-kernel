# Slice 8 Plan — “One command to play”

## A) Finish `ge-fetch --launch`
- Use `GE_DOOM_EXEC` as the launch command (string that may include args)
  - Example: `GE_DOOM_EXEC="node ge-doom/runtime.js"`
- Spawn process with:
  - `--levelSpec <savedPath>`
- Inherit stdio so the ASCII runtime appears immediately

## B) Add `prompt-play` wrapper
Implement `scripts/prompt-play.js`:
- Inputs:
  - `--prompt` (required)
  - `--plugin` (default doom-bridge)
  - `--seed` (optional)
  - `--launch` (optional; if set, use GE_DOOM_EXEC)
- Behavior:
  1) POST `/generate-scene`
  2) poll `/status/:id` until done/failed
  3) call existing `ge-fetch.js <jobId>` (and `--launch` if requested)

## C) Determinism regression test
- Add `scripts/backend-determinism-test.js` (hash compare A vs replay(A))
- Wire into CI:
  - Run on `workflow_dispatch` and nightly schedule OR on main pushes (if stable)

## D) Add `/healthz`
- Lightweight endpoint with JSON output:
  - ok, time, env
  - configured: JOBS_TABLE_NAME, ARTIFACTS_BUCKET, INTERNAL_TOKEN
  - optional best-effort ping of DDB/S3
