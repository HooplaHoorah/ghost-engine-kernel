# Slice 13 Plan — Paste JSON in UI

## A) Add textarea + buttons
In the Backup Links panel, add:
- `<textarea id="backupJson" ...>`
- `Save backups` button
- `Clear backups` button (already exists)
- a status line for parse errors or “Saved!”

## B) Validate pack format
On save:
- JSON.parse textarea
- validate:
  - `items` is an array
  - each item has:
    - `jobId` (string, non-empty)
    - `label` (string)
    - `seed` (number or integer string convertible to number)
  - optional: `createdAt` string
If invalid:
- show inline error (do not throw)

## C) Persist + re-render
- localStorage key: `ghost:demoPack`
- write canonical JSON (pretty printed) back into textarea for visibility
- call existing `renderBackupPanel(...)`

