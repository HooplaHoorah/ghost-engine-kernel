# Optional UI: Backup Links Panel

## Goal
Keep backup links visible inside `/demo` without needing a terminal.

## Behavior
- Panel shows list of backup links stored in localStorage key `ghost:demoPack`
- Each item has:
  - label
  - seed
  - createdAt (human readable)
  - link to `/demo?jobId=...`
- Buttons:
  - “Load” (navigate by setting `?jobId=`) or just link click
  - “Copy” (reuse copy-to-clipboard helper)
  - “Clear backups”

## Data format
```json
{
  "createdAt": "ISO",
  "items": [
    {"label":"3 rooms key door","seed":12345,"jobId":"..."},
    ...
  ]
}
```

The CLI script can print this JSON so a presenter can paste it into localStorage (optional), or you can add a small UI form to paste JSON.

See `templates/demo.backup-panel.html` and `templates/demo.backup-panel.snippet.js`.

