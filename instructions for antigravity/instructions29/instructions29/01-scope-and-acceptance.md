# 01 — Scope & Acceptance (Option B)

## Scope
- Identify the **ALB DNS name** (from Terraform outputs)
- Confirm the ALB is **publicly reachable** (no VPN, no SSO, no IP allow-list)
- Verify these endpoints on the deployed env:
  - `GET /healthz`
  - `GET /openapi.json` (and optionally `/docs`)
  - `GET /demo` (loads)
  - `GET /play` and `GET /play.js` (assets served)
  - `POST /generate-scene`
  - `GET /status/:jobId` until done
  - `GET /artifact/:jobId/levelSpec` (proxy path)

## Acceptance Criteria
- You can open `http://<alb_dns_name>/demo` in an incognito window from a normal internet connection.
- `curl -sS http://<alb_dns_name>/healthz` returns JSON with `"ok": true`.
- You can generate a job and produce:
  - a **Demo share link**: `http://<alb_dns_name>/demo?jobId=<jobId>`
  - a **Play link**: `http://<alb_dns_name>/play?job=<jobId>`
- `GET /artifact/<jobId>/levelSpec` returns valid JSON (LevelSpec).
- You provide the ALB base URL + outputs/logs in a report (template provided).
