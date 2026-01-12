# Ghost Engine — instructions15
## Slice 10: Presentation Mode (Demo UI Presets + Run Warmup Button) + Warmup Script Polish

Slice 9 delivered:
- Smoke-test artifact URL validation (`scripts/smoke.mjs`)
- `scripts/warmup.js` command for stage checks

Slice 10 adds judge-friendly polish:
1) A curated “Presentation (fast + reliable)” preset group in `/demo`
2) A “Run Warmup” button in the demo UI (no terminal required)
3) Minor enhancements to `scripts/warmup.js` output and failure reporting

### Outcomes
- Demos are repeatable with one click (preset + seed auto-filled).
- Non-technical judges can run an end-to-end warmup from the browser.
- Warmup script prints pluginVersion and preserves share link even if validation fails.

### Contents
- `SLICE10_PLAN.md`
- `DEMO_PRESETS.md`
- `RUN_WARMUP_BUTTON.md`
- `WARMUP_SCRIPT_POLISH.md`
- `CHECKLIST.md`
- `templates/` (UI patch snippets)

