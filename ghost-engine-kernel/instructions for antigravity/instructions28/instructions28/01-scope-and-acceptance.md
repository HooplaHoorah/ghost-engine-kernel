# Scope + Acceptance

## Scope (MVP)
- Add a new page: `/play` (served by orchestrator, static HTML + JS is fine).
- Page accepts `job` (query param): `/play?job=<jobId>`.
- Page calls orchestrator `GET /status/<jobId>` to obtain artifact URL(s).
- Page downloads LevelSpec JSON (prefer presigned URL) and launches a simple playable loop in-browser:
  - Render map (ASCII in <pre> OR Canvas).
  - Player movement (W/A/S/D or arrow keys).
  - Basic interactions: walls, key, door/locked exit, exit.

## Acceptance (Stage “wow” baseline)
- From `/demo` after successful generation, user can click **Play (Browser)** and immediately play in the browser.
- If LevelSpec fetch fails (CORS or 403), Play page shows a clear fallback:
  - Download link (via orchestrator) and the working CLI command.
- Play page displays:
  - job id
  - seed (if known)
  - plugin
  - SHA-256 hash of the LevelSpec JSON
- No regressions:
  - Existing CLI Play command remains available.
  - Rate limiting behavior remains friendly.

## Out of scope (for MVP)
- Full 3D renderer, textures, sounds
- Networking / multi-user
