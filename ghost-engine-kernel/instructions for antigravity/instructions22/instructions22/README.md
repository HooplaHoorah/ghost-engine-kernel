# Ghost Engine — instructions22
## Slice 17: Demo Readiness Report (CLI) + Optional On-Demand GitHub Action

Slice 16 added the “panic button” for instant backup loading.
Slice 17 adds a single command that produces a **paste-ready readiness report** for judges/Slack/email.

### Outcomes
1) `scripts/demo-readiness-report.js` prints:
   - `/healthz` JSON (and a simple OK/FAIL summary)
   - pluginVersion + optional build SHA (if available from env or response)
   - runs a mini smoke (generate one deterministic doom-bridge job + validate artifact URLs)
   - generates a 3-link demo pack OR reuses existing demo pack (configurable)
   - prints share links + a JSON blob of the pack
2) Exits non-zero if any critical checks fail, but still prints partial results.
3) (Optional) GitHub Action workflow to run the report on demand against staging and upload logs as artifacts.

### Contents
- `SLICE17_PLAN.md`
- `REPORT_SCRIPT.md`
- `OPTIONAL_GITHUB_ACTION.md`
- `CHECKLIST.md`
- `templates/` (script + workflow)

