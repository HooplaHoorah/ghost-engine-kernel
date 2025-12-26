# Open newest backup

## HTML
Add near Backup Links panel title:
- `<button id="openNewestBackup" type="button">Open newest backup</button>`
Optional:
- `<button id="openRandomBackup" type="button">Open random backup</button>`

## JS
- Implement helpers:
  - `readDemoPack()` (you already have this from Slice 12/13)
  - `wireOpenNewestBackup(loadJobById)`
- On click:
  - read pack
  - pick jobId
  - call loadJobById(jobId)

- Recompute enabled/disabled state after:
  - saving pack
  - clearing pack
  - generating pack

See `templates/demo.panic-button.html` and `templates/demo.panic-button.snippet.js`.

