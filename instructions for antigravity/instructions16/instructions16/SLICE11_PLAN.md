# Slice 11 Plan — Stage Safety Net

## A) Copy Share Link
Add a button near the job metadata card:
- Label: “Copy share link”
- Copies: current window URL (which should include `?jobId=...`), or constructs one from current jobId.

Also show a small transient confirmation:
- “Copied!” for ~1–2 seconds.

## B) Last Successful Job fallback
On any successful `done` job render:
- write `jobId` to `localStorage` key: `ghost:lastGoodJobId`

On generation failure (or polling failure):
- if `ghost:lastGoodJobId` exists, show a button:
  - “Load last success”
- Clicking it:
  - updates URL to `?jobId=<lastGoodJobId>`
  - triggers existing load/poll/render flow

## C) Acceptance
- Presenter can always recover a demo instantly, even if the latest generation fails.
- Share link can be copied without selecting text or opening devtools.

