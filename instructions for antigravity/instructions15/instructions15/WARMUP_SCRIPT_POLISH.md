# Warmup script polish (`scripts/warmup.js`)

## Add output fields
After job completes:
- print jobId
- seed (actual seed from response if provided)
- plugin + pluginVersion (if present)
- share link

## URL validation failure behavior
If an artifact URL fails validation:
- print a warning with:
  - artifact name
  - HTTP status
  - truncated URL (e.g., first 80 chars)
- DO NOT exit immediately; continue to print share link and exit 1 at end.

This preserves usability: even if validation fails, you still get the jobId and link to inspect.

