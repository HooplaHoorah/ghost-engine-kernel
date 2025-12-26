# Last Successful Job Fallback

## Save last success
When a job reaches `done` and renders successfully:
- `localStorage.setItem("ghost:lastGoodJobId", jobId)`

## Offer fallback on failures
When generation fails (POST error) OR polling ends in `failed` OR polling times out:
- read: `localStorage.getItem("ghost:lastGoodJobId")`
- if present:
  - show “Load last success” button

Click behavior:
- set `jobId` to lastGoodJobId
- update URL to `?jobId=` via history.replaceState
- call existing poll/render function (or reuse the “load by jobId” path)

## UX notes
- Make the fallback button appear next to the error banner, not hidden.
- Include the fallback jobId truncated: e.g. `Load last success (…a1b2)`.

See `templates/demo.last-success.snippet.js` and `templates/demo.last-success.html`.

