# Copy Share Link Button

## Placement
- In the “Job Metadata” card (or near jobId display), add:
  - `Copy share link` button

## Behavior
- If `jobId` is currently known:
  - build URL: `${origin}/demo?jobId=${jobId}`
- Else:
  - copy `window.location.href` (best-effort)
- Copy to clipboard via `navigator.clipboard.writeText(...)`.
- Show toast/inline text “Copied!” and auto-hide after 1500ms.

## Fallback
If clipboard API fails:
- Select text in a hidden input and use `document.execCommand("copy")` (legacy)
- Or show the URL in a textbox for manual copy.

See `templates/demo.copy-share-link.snippet.js` and `templates/demo.copy-share-link.html`.

