# Demo Pack Script (`scripts/demo-pack.js`)

## Goal
One command that produces multiple ready-to-open links for stage backup.

## Usage
```bash
API_BASE_URL=https://<alb> node scripts/demo-pack.js
```

## Behavior
- Preflight `/healthz`
- For each preset (3 total):
  - POST `/generate-scene` with `{prompt, plugin:"doom-bridge", seed}`
  - poll `/status/:id` until done (max 120s)
  - validate artifact URLs (best-effort)
- Print:
  - a pretty list of share links
  - and a JSON blob with metadata (for copy/paste into notes)

## Guardrails handling
- Retry generate and replay calls on 429/503 with exponential backoff.

## Acceptance
- Running script yields 3 working `/demo?jobId=` links.
- If one fails, script continues to the next and exits non-zero with summary.

See `templates/demo-pack.js`.

