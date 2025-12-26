# Generate Demo Pack Button (Client-side)

## Goal
Generate backup links with one click, no terminal, no devtools.

## Presets (same as CLI)
1) 3 rooms + key + locked exit (seed 12345)
2) 4 rooms + ambush (seed 333)
3) hub + spokes (seed 444)

## Behavior
- Sequential generation (avoid concurrency guardrails)
- Poll each job to done
- Save pack to localStorage:
  - key: `ghost:demoPack`
- Re-render backup panel immediately

## UX
- Show progress text:
  - “Generating 1/3…”, “Generating 2/3…”, etc.
- On completion:
  - “Demo Pack saved (3 links)” or “Saved (2/3) with warnings”

See `templates/demo.generate-pack.button.html` and `templates/demo.generate-pack.button.snippet.js`.

