# 03 — Troubleshooting (common failure modes)

## /demo is 404
Likely causes:
- wrong base URL / port
- route not present in this build

What to capture:
- exact URL
- response code
- any reverse proxy path rewriting notes

## /healthz is 500 or shows missing deps
If demo is still needed:
- Try generating anyway (some deps are “best effort”)
Capture:
- healthz payload
- which deps failed (S3/DDB/etc.)

## Generate fails immediately
Likely causes:
- worker not reachable
- internal token mismatch (worker → orchestrator callbacks)
- env vars missing

Capture:
- UI error text
- jobId if any
- orchestrator logs around timestamp
- worker logs around timestamp

## Generate “hangs” (stuck in queued/running)
Likely causes:
- worker capacity / ECS task not running
- worker cannot reach orchestrator callback endpoint
- networking / security group rules

Capture:
- status page for job
- step timeline (which step last progressed)
- timestamps

## Artifact links fail (403/404)
Likely causes:
- presign permissions
- object never uploaded
- wrong bucket/key

Capture:
- the URL (can redact signature)
- HTTP status
- object key / filename
- whether status payload shows artifact metadata

## Runtime won’t launch
Likely causes:
- missing `ge-doom/runtime.js`
- invalid LevelSpec schema
- path issues

Capture:
- exact command used
- stack trace
- the LevelSpec JSON snippet around where it fails
