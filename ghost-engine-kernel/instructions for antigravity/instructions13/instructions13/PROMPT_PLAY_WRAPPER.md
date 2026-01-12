# prompt-play wrapper (generate → poll → fetch → launch)

## File
Create: `scripts/prompt-play.js`

## Example usage
```bash
API_BASE_URL=https://<alb> GE_DOOM_EXEC="node ge-doom/runtime.js" \
node scripts/prompt-play.js --prompt "Three rooms, locked exit, key" --seed 12345 --launch
```

## Behavior
1) POST `/generate-scene` with `{prompt, plugin, seed}`
2) Poll `GET /status/:id` until `done` or `failed` (max 120s)
3) Spawn `node scripts/ge-fetch.js <jobId> [--launch]`

## Acceptance
- One command takes you from prompt to playable runtime with no copy/paste of jobId.
- On failure, prints the status payload and exits non-zero.

See `templates/prompt-play.js`.
