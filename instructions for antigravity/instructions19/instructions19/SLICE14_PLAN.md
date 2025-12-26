# Slice 14 Plan — Zero-terminal demo

## A) Generate Demo Pack button (client-side)
Add a button in `/demo` near warmup/presets:
- Label: “Generate Demo Pack (3 backups)”
On click:
1) disable relevant controls (Generate, Warmup, Demo Pack)
2) run 3 sequential generations using the same presets/seeds as scripts/demo-pack.js
3) poll each job to done
4) build pack JSON `{createdAt, items:[{label, seed, jobId}]}`
5) save to localStorage key `ghost:demoPack`
6) render backup panel
7) show success message + keep links clickable

If a job fails, continue and store successes, but show a warning and exit UI state gracefully.

## B) Prettify-on-paste
For the textarea `#backupJson`:
- on paste and/or blur:
  - try JSON.parse
  - if valid, pretty print (JSON.stringify with 2 spaces)
  - do not save automatically
  - show inline status (“Valid JSON”) or error (“Invalid JSON”)

## C) Version stamp
Add a small footer line that shows:
- API base (derived from window.location.origin or from config)
- pluginVersion (from latest completed job result if present)
- optional commit SHA if injected as `window.__BUILD_SHA__`

