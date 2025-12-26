# instructions26 — Demo hardening + Browser walkthrough (Antigravity)

This bundle updates the demo instructions based on the latest walkthrough findings:
- Worker default port conflict (worker & orchestrator both defaulted to 8080)
- `/demo` UI gaps: missing **Warmup** + **Play** buttons; **Replay** button unresponsive
- Determinism verified for same seed ✅

## What to do (order of operations)
1. Apply **Fix 1**: worker default port → 8081 (no manual env var required).
2. Apply **Fix 2**: `/demo` UI: Replay works + Warmup restored (or docs updated) + Play action added (or explicit local launch instructions shown).
3. Re-run the **Browser Demo Walkthrough** and fill out the report template.

Everything you need is in:
- `runbook.md` (how to run the demo)
- `fix-plan.md` (what to change + acceptance checks)
- `preflight.sh` (optional helper; safe to run)
- `walkthrough-report-template.md` (paste back to ChatGPT when done)
