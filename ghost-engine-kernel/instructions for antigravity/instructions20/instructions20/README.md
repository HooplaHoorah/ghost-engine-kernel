# Ghost Engine — instructions20
## Slice 15: Demo Pack Hardening + Better Progress Summary + Persistent Version Stamp

Slice 14 delivered:
- Generate Demo Pack button (client-side)
- prettify-on-paste for backup JSON
- version stamp (API origin + pluginVersion)

Slice 15 adds tiny but high-value stage hardening:

### Outcomes
1) Demo Pack generation does a **/healthz preflight** and aborts with a clear message if unhealthy.
2) Demo Pack status shows a **final summary** (saved N/3) and lists which presets failed.
3) pluginVersion is **persisted in localStorage** so the version stamp survives refresh.

### Contents
- `SLICE15_PLAN.md`
- `HEALTHZ_PREFLIGHT_FOR_PACK.md`
- `PACK_SUMMARY_IMPROVEMENTS.md`
- `PERSIST_VERSION_STAMP.md`
- `CHECKLIST.md`
- `templates/` (drop-in snippets)

