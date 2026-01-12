# instructions27 — Merge + Deploy + 429 Hardening + Deployed Walkthrough

This bundle picks up after PR `fix/demo-hardening-v2`.

Goals:
1) Merge + deploy safely.
2) Run a deployed browser walkthrough on the ALB.
3) Eliminate demo-killing **429 rate-limit** surprises via UI debounce + better messaging.
4) Polish **Play** command for reliability (redirect-safe) + Windows variant.

Contents:
- `merge-deploy-checklist.md`
- `deployed-walkthrough.md`
- `rate-limit-hardening.md`
- `play-command-polish.md`
- `report-template-deployed.md`
- `snippets/` (drop-in UI patterns)
