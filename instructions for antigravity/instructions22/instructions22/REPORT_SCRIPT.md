# Demo Readiness Report Script

## File
Create: `scripts/demo-readiness-report.js`

## Usage
```bash
API_BASE_URL=https://<alb> node scripts/demo-readiness-report.js
```
Optional flags:
- `--reusePack` : do not generate backups; only print pack loading guidance
- `--noPack` : skip pack generation entirely

## Output sections
- HEALTHZ
- MINI SMOKE
- DEMO PACK LINKS
- FINAL STATUS

## Acceptance
- One command produces:
  - health JSON + pass/fail
  - a completed jobId + share link
  - 3 backup links + JSON blob (unless skipped)
  - pluginVersion printed
- Non-zero exit if any section fails.

See `templates/demo-readiness-report.js`.

