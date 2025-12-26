# instructions28 — In-Browser Play (GE DOOM Web MVP)

Context: Deployed demo is stage-signed-off (Warmup → Generate → Replay → Play command).
Next milestone: make **Play happen in the browser** (same tab/new tab), without breaking the kernel contract.

Primary objective:
- From `/demo`, after Generate, clicking **Play (Browser)** opens `/play?job=<id>` and runs a lightweight GE DOOM web runtime.
- Keep LevelSpec v0 as the contract. No changes required to generation semantics.

Secondary objective:
- Show LevelSpec hash + seed + plugin on the Play page for credibility & determinism demos.

This bundle provides:
- Implementation plan (minimal backend changes)
- Web runtime MVP spec (ASCII/Canvas)
- CORS-safe fallback plan
- Acceptance tests + report template
- Starter snippets for play.html + play.js
