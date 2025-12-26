# Ghost Engine — instructions24
## Slice 19: Readiness Report Markdown Mode (`--md`) + Polished Paste Output

Slice 18 improved the readiness report with determinism + artifact summaries.
Slice 19 adds a Markdown output mode so the report can be pasted directly into:
- DevPost submissions
- judge emails
- Slack/Discord
- internal docs

### Outcomes
- `scripts/demo-readiness-report.js` supports `--md` flag.
- When enabled, output is well-formatted Markdown:
  - headings
  - ✅/❌ bullets
  - code block for demo-pack JSON
  - plain URLs (clickable in most clients)
- Default output remains unchanged unless `--md` is specified.

### Contents
- `SLICE19_PLAN.md`
- `MARKDOWN_MODE.md`
- `CHECKLIST.md`
- `templates/` (patch notes + helpers)

