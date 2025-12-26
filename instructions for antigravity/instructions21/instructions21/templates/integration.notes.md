# Integration notes

1) Add `demo.panic-button.html` near the Backup Links panel header in index.html.

2) In demo.js:
- reuse your existing `loadJobById(jobId)` function (which updates URL + polls + renders)
- add the snippet functions above
- on DOM ready call:
  - `wireOpenBackupButtons(loadJobById);`

3) Ensure button state stays correct:
- after `renderBackupPanel(...)` runs, call `refreshBackupButtons()`
- after Save backups, Clear backups, and Generate Demo Pack, call `refreshBackupButtons()`

