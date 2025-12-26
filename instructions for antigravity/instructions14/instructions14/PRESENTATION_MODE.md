# Presentation mode (Demo UI)

## Goal
Make on-stage demos repeatable and low-friction.

## A) Add “Presentation” presets
In `/demo` presets dropdown, add a section header or grouping:
- “Presentation: 3 rooms key door” (seed 12345)
- “Presentation: arena + exit” (seed 222)
- “Presentation: corridor ambush” (seed 333)

If the UI already supports presets, just add a few more that are known to work well.

## B) “Run Warmup” button (optional)
Add a button that:
- calls `/generate-scene` with the warmup prompt/seed/plugin
- updates URL to `?jobId=...`
- auto-renders result

This is optional because `scripts/warmup.js` already exists, but it’s nice for non-technical judges.

