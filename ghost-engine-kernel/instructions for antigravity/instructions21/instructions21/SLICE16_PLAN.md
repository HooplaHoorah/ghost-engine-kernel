# Slice 16 Plan — Panic Button

## A) Add “Open newest backup” button
Place in Backup Links panel header area.

Behavior:
- Read pack from localStorage key `ghost:demoPack`.
- Determine newest backup:
  - simplest: take `items[0]` (since demo-pack is generated in order), or
  - choose based on most recent `createdAt` if multiple packs are supported.
- Call existing `loadJobById(jobId)` (or equivalent) that updates URL + polls + renders.

## B) Visibility/disable rules
- If no pack exists or items empty:
  - hide button or set disabled=true
  - show tooltip or status: “No backups saved.”

## C) Optional: “Open random backup”
- Picks random item from items array.
- Useful for showing variety while staying stage-safe.

