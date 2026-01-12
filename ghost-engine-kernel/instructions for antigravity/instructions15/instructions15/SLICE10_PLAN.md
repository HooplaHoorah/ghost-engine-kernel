# Slice 10 Plan — Presentation Mode

## A) Demo presets (fast + reliable)
Add a labeled group to `/demo`:
- “Presentation (fast + reliable)”
Each preset should include:
- prompt (short and deterministic)
- plugin = doom-bridge
- seed (integer)
Selecting a preset auto-fills prompt + seed + plugin.

## B) Run Warmup button
Add a button on `/demo` that:
- runs the same warmup prompt/seed/plugin as `scripts/warmup.js`
- updates URL to `?jobId=...`
- auto-polls and renders results
- disables itself while running
- shows errors clearly

## C) Warmup script polish
Enhance `scripts/warmup.js`:
- Print pluginVersion if returned in result metadata
- Always print share link even if artifact URL validation fails
- On URL validation failure, print which artifact failed and URL (truncated) + continue

