# Integration notes

1) In `index.html` (demo UI), add `demo.backup-paste.html` inside the backup panel.
2) In `demo.js`:
   - ensure you have `renderBackupPanel(loadJobById)` already wired (Slice 12)
   - add the snippet functions above
   - after DOM init, call:
     - `renderBackupPanel(loadJobById);`
     - `wireBackupPasteUI(loadJobById, renderBackupPanel);`

3) Keep the existing “Clear backups” button; it should call `renderBackupPanel(loadJobById)` after clearing.
