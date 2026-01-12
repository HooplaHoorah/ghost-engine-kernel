# Warmup script (`scripts/warmup.js`)

## Goal
One command that a presenter runs before going on stage to confirm:
- backend is alive
- deps are reachable
- generation works
- presigned URLs work (if configured)
- provides a ready-to-show share link

## Behavior
- GET `/healthz` and print JSON
- POST `/generate-scene` with:
  - plugin `doom-bridge`
  - prompt: short and stable (e.g., “Three rooms, locked exit, key”)
  - seed: fixed (12345)
- poll until done (max 120s)
- print:
  - jobId
  - seed
  - share link: `${API_BASE_URL}/demo?jobId=${jobId}`
- optionally validate artifact URLs (reuse same functions from smoke enhancements)

## Usage
```bash
API_BASE_URL=https://<alb> node scripts/warmup.js
```

See `templates/warmup.js`.

