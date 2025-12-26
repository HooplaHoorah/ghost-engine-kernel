# Run Warmup button (Demo UI)

## Goal
Let judges run the “is it alive?” flow without a terminal.

## Behavior
When clicked:
1) Set status to “warming up…” and disable buttons
2) POST /generate-scene with:
   - plugin: doom-bridge
   - seed: 12345
   - prompt: "Three rooms, locked exit, key"
3) On success:
   - update URL to `/demo?jobId=<id>` (history.replaceState)
   - begin polling/rendering using existing poll loop
4) On failure:
   - show an error banner and re-enable UI

## UX Notes
- The warmup button should be near the Generate button.
- Consider adding a small tooltip: “Runs a deterministic test job to confirm the system is ready.”

