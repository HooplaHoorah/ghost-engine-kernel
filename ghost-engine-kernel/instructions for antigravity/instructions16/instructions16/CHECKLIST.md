# Checklist — Definition of Done (Slice 11 / instructions16)

## Copy share link
- [ ] Button exists in /demo UI near job metadata
- [ ] Copies `${origin}/demo?jobId=<id>` when jobId known
- [ ] Shows “Copied!” confirmation
- [ ] Has fallback if clipboard API fails

## Last successful job fallback
- [ ] On successful job render, saves jobId to localStorage key `ghost:lastGoodJobId`
- [ ] On generate/poll failure, UI shows “Load last success” button if key exists
- [ ] Clicking it loads and renders that job (updates URL to `?jobId=`)
- [ ] Works even after refresh (persisted)

