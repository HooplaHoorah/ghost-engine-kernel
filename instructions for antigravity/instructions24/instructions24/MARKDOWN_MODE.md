# Markdown mode (`--md`)

## Usage
```bash
API_BASE_URL=https://<alb> node scripts/demo-readiness-report.js --determinism --md
```

## Output rules
- Headings:
  - `#` for top title
  - `##` for sections
- Success/failure bullets:
  - `- ✅ PASS ...`
  - `- ❌ FAIL ...`
- Links printed as plain URLs:
  - `https://.../demo?jobId=...`
- JSON pack printed in a fenced code block:
  ```json
  { ... }
  ```

## Notes
- Avoid printing raw health JSON unless requested; in Markdown mode, summarize health and include the JSON in a collapsible-ish code block (just a code block).
- Keep default mode unchanged.

