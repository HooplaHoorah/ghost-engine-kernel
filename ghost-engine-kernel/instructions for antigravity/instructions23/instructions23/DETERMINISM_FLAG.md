# Add --determinism flag

## Behavior
If `--determinism` is passed to readiness report:
- run:
  - `node scripts/backend-determinism-test.js`
- If exit code != 0:
  - record failure section `DETERMINISM`
  - include stderr/stdout snippet (first ~300 chars) if available

## Notes
- Use `child_process.spawn` (or spawnSync) with stdio capture.
- Keep the default run fast by leaving determinism off unless requested.

