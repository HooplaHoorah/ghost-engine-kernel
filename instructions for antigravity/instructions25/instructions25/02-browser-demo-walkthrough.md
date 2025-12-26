# 02 — Browser Demo Walkthrough Script (click-by-click)

> Goal: produce a clean, repeatable story: **Prompt → Generate → Artifact → Replay/Determinism → Play**

## Step 0 — Start screen capture (recommended)
If possible, record the screen (or at least take screenshots at key moments).

## Step 1 — Open demo UI
- Navigate to `{BASE_URL}/demo`
- Confirm the UI loads fully.
Record:
- load time (rough)
- any console errors (if you can check DevTools)

## Step 2 — Warmup
- Click **Warmup**
Expected:
- UI reports warmup success (or at least no error)
Record:
- warmup duration
- any warnings

## Step 3 — “Primary Wow” generation run (doom-bridge)
Inputs:
- Plugin: `doom-bridge`
- Use a **preset** if available, otherwise paste a prompt like:

> “Generate a compact DOOM-like level: one locked door, one key, 2 enemies, 1 exit, tight corridors, start near a hallway.”

Actions:
- Click **Generate**
Watch:
- step timeline/progress
- job id and seed (if shown)

Expected:
- Completion state is “succeeded”
- Artifact links appear (LevelSpec JSON at minimum)

Record:
- jobId
- seed
- plugin
- total time to completion
- artifact URLs shown (you can redact domain if needed, but include filenames/paths)

## Step 4 — Share link + open in new tab
- Click **Share link**
- Open share link in a new tab/window
Expected:
- It loads the same job / result state

Record:
- share link format
- whether it works without being logged in

## Step 5 — Replay / determinism check (same seed)
- Use **Replay** action (or equivalent)
Expected:
- New job created with same seed (or explicitly “replayed”)
- Output should match (see determinism notes in `06-determinism-check.md`)

Record:
- replay jobId
- whether seed matches
- whether LevelSpec matches (byte-equal or semantically equal; details below)

## Step 6 — Play / Launch
If UI supports Play/Launch:
- Click it and confirm runtime launches

If UI only offers download:
- download LevelSpec JSON
- run runtime from CLI:

```bash
node ge-doom/runtime.js path/to/levelspec.json
```

Expected:
- You can move with WASD
- Locked door blocks exit until key collected
- Exit triggers a win condition
- Enemies exist (even simple)

Record:
- whether it launches
- any control / collision bugs
- any obvious improvements that would amplify “DOOM vibe”

## Step 7 — One “failure-tolerant” run
Do one run with an intentionally odd prompt to see how system behaves:
> “Make a weird maze with lots of dead ends and a distant key.”

Goal:
- validate guardrails and that the system fails gracefully.

Record:
- whether it fails cleanly with a helpful message or produces something workable.

## Done
Proceed to `04-walkthrough-report-template.md` and fill it out.
