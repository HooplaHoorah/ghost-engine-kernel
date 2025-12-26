# Determinism Regression Test (CI + local)

## Script
Add: `scripts/backend-determinism-test.js`

Behavior:
- generate doom-bridge job with a fixed seed
- replay it to produce a second job
- download LevelSpec for both
- canonicalize JSON and sha256 hash
- assert equal

## CI wiring options
### Option A: nightly + manual only (recommended)
- Run nightly via cron, plus workflow_dispatch:
  - avoids slowing every push

### Option B: on main pushes
- Run after deploy or against a stable env if fast and reliable

## Tips
- Use a dedicated env (staging) so determinism test doesn’t fight prod load limits.
- Keep seed fixed (e.g., 777).
- Keep prompt fixed and simple.

See `templates/backend-determinism-test.js` and `templates/github-actions.determinism.yml`.
