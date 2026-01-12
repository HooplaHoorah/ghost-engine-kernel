# Ghost Engine — instructions16
## Slice 11: Copy Share Link + “Last Successful Job” Fallback (Demo UI)

Slice 10 delivered presentation presets + Run Warmup button + warmup CLI polish.
Slice 11 adds two high-value stage safety features:

### Outcomes
1) **Copy Share Link** button in `/demo` (one click to copy `/demo?jobId=...`).
2) **Last Successful Job** fallback:
   - saves the last *successful* `jobId` in `localStorage`
   - if a generation fails, UI offers “Load last success”

### Contents
- `SLICE11_PLAN.md`
- `COPY_SHARE_LINK.md`
- `LAST_SUCCESS_FALLBACK.md`
- `CHECKLIST.md`
- `templates/` (patch snippets)

