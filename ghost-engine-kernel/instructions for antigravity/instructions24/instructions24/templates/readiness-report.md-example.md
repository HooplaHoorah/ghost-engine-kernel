# Ghost Engine Demo Readiness Report

- API_BASE_URL: https://example.com
- Time: 2025-12-25T00:00:00.000Z
- pluginVersion: 0.1.0

## Healthz
- ✅ PASS

```json
{ "ok": true, "configured": { "JOBS_TABLE_NAME": true }, "checks": { "ddb": true } }
```

## Mini smoke
- ✅ PASS
- Artifacts verified: 3/3 OK
- Job: abc123
- Share: https://example.com/demo?jobId=abc123

## Demo pack
- ✅ Saved 3 backups
- https://example.com/demo?jobId=...
- https://example.com/demo?jobId=...
- https://example.com/demo?jobId=...

```json
{ "createdAt":"...", "items":[{"label":"...","seed":12345,"jobId":"..."}] }
```

## Determinism
- ✅ PASS

## Final status
- ✅ READY
