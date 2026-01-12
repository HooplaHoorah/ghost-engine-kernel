# Backup Panel: Paste JSON UI

## UI additions (HTML)
Add inside `#backupPanel`:
- a textarea
- a Save button
- a status text span/div

## JS additions (demo.js)
Add a handler:
- reads textarea
- parses and validates
- saves to localStorage
- re-renders panel and shows “Saved!”

## Acceptance
1) Run: `node scripts/demo-pack.js`
2) Copy the printed JSON
3) Paste into textarea in `/demo`
4) Click “Save backups”
5) Backup links appear; clicking loads jobs.

See `templates/demo.backup-paste.html` and `templates/demo.backup-paste.snippet.js`.

