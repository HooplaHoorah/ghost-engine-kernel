# /healthz endpoint (Orchestrator)

## Add endpoint
`GET /healthz` should return JSON like:

```json
{
  "ok": true,
  "time": "2025-12-25T00:00:00.000Z",
  "env": "dev",
  "configured": {
    "JOBS_TABLE_NAME": true,
    "ARTIFACTS_BUCKET": true,
    "INTERNAL_TOKEN": true
  }
}
```

## Optional best-effort pings
- DDB: DescribeTable or a 1-item read
- S3: HeadBucket

If you add pings, keep them time-bounded so health stays fast.

## Acceptance
- 200 always when process is healthy
- JSON output is stable (useful for stage scripts and quick checks)

See `templates/healthz.route.snippet.ts`.
