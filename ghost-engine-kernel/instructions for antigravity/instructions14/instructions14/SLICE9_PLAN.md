# Slice 9 Plan — Catch Demo Breakers

## A) Enhance smoke test: artifact URL validation
When a job completes, smoke should validate:
- `sceneGraphUrl` (200, non-empty, JSON parses)
- `levelSpecUrl` (200, non-empty, JSON parses) — if doom-bridge used
- `asciiMinimapUrl` (200, non-empty text)
- `levelPreviewAsciiUrl` (200, non-empty text) — if present

If URLs are absent (demo mode), fallback to inline result checks.

## B) Add warmup command
Create `scripts/warmup.js`:
1) GET `/healthz` and print it
2) POST `/generate-scene` with a stable prompt + plugin doom-bridge + fixed seed (e.g., 12345)
3) poll to done
4) print:
   - jobId
   - seed
   - share link `/demo?jobId=...`
5) optionally fetch artifact URLs to ensure presign is working

## C) Presentation mode (optional but strong)
Add a “Presentation” preset set in `/demo`:
- 3–5 prompts that are known to complete quickly and reliably
- a “Run Warmup” button (client-side) that runs the same prompt/seed and loads the result

