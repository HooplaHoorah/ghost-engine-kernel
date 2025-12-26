# 01 — Preflight Checklist

> Goal: prove you’re pointing at the right Orchestrator and that Worker + storage are healthy enough to demo.

## 1) Identify the base URL
Set:
- `{BASE_URL}` = Orchestrator root (no trailing slash)

Examples:
- Local: `http://localhost:8080`
- Deployed: `https://<alb-dns-name>`

Record this in the report.

## 2) Health endpoints
Open in browser:
- `{BASE_URL}/healthz`
- `{BASE_URL}/openapi.json` (should load JSON)
- `{BASE_URL}/docs` (if enabled)

Record:
- status code
- notable flags / warnings
- any missing deps (DDB/S3) and whether demo still proceeds

## 3) Confirm /demo exists
Open:
- `{BASE_URL}/demo`

If 404:
- you are likely hitting the wrong service/port, or the route isn’t in that build.

## 4) (Optional) Verify worker connectivity
If the UI shows “worker unreachable” or jobs never start:
- capture the message
- if you have access, check service health in ECS / local logs.

## 5) Environment notes (write down)
- local vs deployed
- git commit SHA (if available)
- any env overrides you set (API_BASE_URL, etc.)
