# Optional GitHub Action (on demand)

## File
Add: `.github/workflows/demo-readiness-report.yml`

Trigger:
- workflow_dispatch only

Steps:
- checkout
- setup node 20
- npm ci
- run readiness report
- upload stdout log as artifact

Secrets:
- API_BASE_URL (staging)

See `templates/github-actions.demo-readiness-report.yml`.

