# /healthz preflight for Demo Pack generation

## Behavior
Before generating any pack jobs:
- GET `/healthz`
- if request fails or returns non-200:
  - show status “Health check failed” and abort
- if `configured.JOBS_TABLE_NAME` is true and `checks.ddb` is false:
  - show “DynamoDB check failed” and abort
- if `configured.ARTIFACTS_BUCKET` is true and `checks.s3` is false:
  - show “S3 check failed” and abort

## UX
- Show the health JSON in the raw/debug area if available.
- Keep controls re-enabled after abort.

