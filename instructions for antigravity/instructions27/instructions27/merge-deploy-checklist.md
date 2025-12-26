# Merge + Deploy Checklist

## 0) Before merge
- [ ] PR branch: `fix/demo-hardening-v2`
- [ ] CI checks green (build/test)
- [ ] Confirm worker default port is now 8081 (local) and does not affect ECS (ECS uses containerPort mapping).

## 1) Merge
- [ ] Merge PR to main (or your release branch)
- [ ] Confirm the merge commit hash

## 2) CI/CD deploy verification (AWS)
- [ ] GitHub Actions run: build + push + deploy succeeded
- [ ] ECS services updated (orchestrator + worker) and are stable (desired == running)
- [ ] ALB target groups healthy

## 3) Smoke
- [ ] `GET /healthz` returns 200 on ALB
- [ ] `/demo` loads
- [ ] `/docs` loads (or `/openapi.json` returns 200)
- [ ] Generate succeeds once (Doom preset)
