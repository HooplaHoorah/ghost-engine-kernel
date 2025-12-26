# Integration notes

## 1) Add script to repo
- Copy `templates/demo-readiness-report.js` to `scripts/demo-readiness-report.js`
- Ensure Node 18+ (Node 20 in CI)

## 2) Optional: Add GitHub workflow
- Copy `templates/github-actions.demo-readiness-report.yml` to `.github/workflows/demo-readiness-report.yml`
- Set `secrets.API_BASE_URL` to staging ALB base URL

## 3) Usage
```bash
API_BASE_URL=https://<alb> node scripts/demo-readiness-report.js
```

Flags:
- `--noPack`
- `--reusePack`

