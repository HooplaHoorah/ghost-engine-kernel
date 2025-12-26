# Stage Hardening

## A) Health endpoints
Add `GET /healthz` to Orchestrator:
- 200 if process is healthy
- optionally include:
  - DDB reachable? (best-effort)
  - S3 reachable? (best-effort)
  - worker callback token configured?
Return structured JSON for quick checks.

Optionally add `GET /readyz` that checks dependencies strictly.

## B) Warm-up playbook
Before presenting:
1) Open CloudWatch dashboard
2) Hit `/healthz`
3) Run one `doom-bridge` generation and confirm it completes
4) Verify `/demo?jobId=<id>` works
5) Keep 2 backup job links ready

## C) Failure UX
- If generation fails, demo UI should show:
  - error message
  - “Retry” and “Replay last success” buttons
- If presigned URLs fail, show inline fallback message if possible

## D) Offline fallback plan
- Keep 2–3 LevelSpec files checked into a `demo-levels/` folder for GE Doom
- If network is down, load a local LevelSpec and still show “Prompt → Play” concept
