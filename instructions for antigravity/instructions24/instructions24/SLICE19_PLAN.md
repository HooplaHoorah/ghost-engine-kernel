# Slice 19 Plan — Markdown output for readiness report

## A) Add flag
- Parse `--md`
- If set, switch printer functions to emit Markdown

## B) Minimal refactor
Introduce small helpers:
- `h1(text)`, `h2(text)`
- `ok(text)` -> `- ✅ text`
- `fail(text)` -> `- ❌ text`
- `codeBlock(json)` -> fenced block

Keep logic identical; only output formatting changes.

## C) Report format (suggested)
- `# Ghost Engine Demo Readiness Report`
- metadata line: API_BASE_URL, time, pluginVersion, build SHA (if available)
- sections:
  - `## Healthz`
  - `## Mini smoke`
  - `## Demo pack`
  - `## Determinism` (if flag on)
  - `## Final status`
- include demo pack JSON as a fenced code block

