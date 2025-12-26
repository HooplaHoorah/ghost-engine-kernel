# Smoke test: validate artifact URLs

## Goal
If the system returns presigned S3 URLs, smoke should verify they work.
This prevents stage demos from failing due to IAM/presign/config drift.

## Where
Update `scripts/smoke.mjs`.

## Validation rules
For each URL field present in `status.result`:

### JSON artifacts
- `sceneGraphUrl`
- `levelSpecUrl`

Checks:
- fetch URL → HTTP 200
- body length > 0
- JSON.parse succeeds

### Text artifacts
- `asciiMinimapUrl`
- `levelPreviewAsciiUrl`

Checks:
- fetch URL → HTTP 200
- body length > 0

## Failure reporting
If any fetch fails:
- print the URL field name and URL (or truncated)
- print HTTP status + first 200 chars of body (if available)
- exit non-zero

## Fallback
If URL is absent:
- assert inline `sceneGraph` or `levelSpec` exists (depending on plugin)
- assert inline `asciiMinimap` or `levelPreviewAscii` exists when expected

See `templates/smoke.artifact.validation.snippet.mjs`.

