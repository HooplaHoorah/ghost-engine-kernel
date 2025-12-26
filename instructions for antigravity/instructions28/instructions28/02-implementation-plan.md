# Implementation Plan (recommended order)

## Step 1 — Add `/play` page (static)
- Create `public/play.html` and `public/play.js` (or similar).
- Ensure orchestrator serves these files (same as demo assets).

### Play page behavior
1) Parse `job` from query string.
2) Call `/status/<job>`:
   - Expect `artifacts.levelSpecUrl` (or whatever the API returns).
3) Attempt `fetch(levelSpecUrl)`:
   - If success: parse JSON → validate basic fields → launch web runtime.
   - If failure likely due to CORS:
     - Show “CORS blocked, using proxy…”
     - Fetch via orchestrator proxy endpoint (Step 2), else show CLI fallback.

## Step 2 — Add an artifact proxy endpoint (CORS-safe)
If S3 presigned URLs do not allow browser fetch due to CORS:

Add:
- `GET /artifact/:jobId/levelSpec`
  - Server-side: look up job → get S3 key (or presigned URL) → stream JSON to browser
  - Set: `Content-Type: application/json`
  - Set: `Cache-Control: no-store`
  - (Same-origin is fine; optional `Access-Control-Allow-Origin`)

## Step 3 — Wire `/demo` Play button to Browser Play
- After generation completes, display two options:
  - **Play (Browser)** → opens `/play?job=<id>`
  - **Play (CLI)** → shows command (keep)

## Step 4 — Web runtime MVP
- Implement `ge-doom/web-runtime.js`:
  - Load LevelSpec grid/rooms/entities
  - Handle keyboard input
  - Render each tick (ASCII or Canvas)

## Step 5 — Determinism credibility UI
- Compute SHA-256 of the downloaded LevelSpec JSON and display it.
- Display the seed and plugin when available.
