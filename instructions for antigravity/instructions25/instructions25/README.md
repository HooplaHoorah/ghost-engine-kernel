# instructions25 — Browser Demo Run + Walkthrough Report (for Antigravity)

This bundle is a **runbook** for executing a Ghost Engine demo **via the browser** and returning a high-signal walkthrough report.

## What you will do
1) Preflight the environment (local or deployed).
2) Run a full **/demo** browser walkthrough (Warmup → Generate → Replay → Share → Play/Launch).
3) Run the supporting CLI health checks (readiness + determinism).
4) Return a **Walkthrough Report** using the included template.

## Files
- `00-quickstart.md` — fastest path to “demo working”
- `01-preflight.md` — environment + checks
- `02-browser-demo-walkthrough.md` — click-by-click demo script
- `03-troubleshooting.md` — common failure modes
- `04-walkthrough-report-template.md` — report to send back
- `05-data-to-capture.md` — what evidence to collect
- `06-determinism-check.md` — determinism / replay expectations
- `scripts/commands.sh` — copy/paste command snippets

## Principle
Prefer **signal over prose**. If anything fails, capture **exact URL(s), timestamps, jobId(s), and error text**.
