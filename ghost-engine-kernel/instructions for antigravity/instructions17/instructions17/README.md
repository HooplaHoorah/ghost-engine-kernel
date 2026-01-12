# Ghost Engine — instructions17
## Slice 12: Demo Pack (Generate 3 Backup Links) + Optional UI Backup Panel

Slice 11 delivered copy-share + last-success recovery.
Slice 12 adds a presenter superpower: **pre-baked backup demos**.

### Outcomes
1) `scripts/demo-pack.js` generates 3 “presentation” jobs (fixed seeds), waits for completion, and prints 3 share links.
2) Uses `/healthz` preflight and reports readiness.
3) Handles guardrails (429/503) with retry/backoff.
4) (Optional) `/demo` UI can show a “Backup Links” panel that lists the last generated pack links from localStorage.

### Contents
- `SLICE12_PLAN.md`
- `DEMO_PACK_SCRIPT.md`
- `OPTIONAL_UI_BACKUP_PANEL.md`
- `CHECKLIST.md`
- `templates/` (script + UI snippets)

