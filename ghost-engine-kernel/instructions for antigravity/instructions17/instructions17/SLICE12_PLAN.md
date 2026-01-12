# Slice 12 Plan — Demo Pack

## A) CLI script: demo-pack
Add `scripts/demo-pack.js` that:
1) GET `/healthz` and print JSON
2) Generate 3 jobs (doom-bridge) using the top 3 “Presentation” presets:
   - seed 12345: 3 rooms + key + locked exit
   - seed 333: 4 rooms + ambush
   - seed 444: hub + spokes
3) Poll each job until done
4) Validate artifact URLs if present (levelSpecUrl, sceneGraphUrl, ascii/text urls)
5) Print three share links:
   - `${API_BASE_URL}/demo?jobId=<id>`
6) Save pack to `localStorage` (optional via UI) OR print JSON for copy/paste

## B) Optional: Demo UI backup links panel
- Store an array of `{label, jobId, seed, createdAt}` in `localStorage["ghost:demoPack"]`
- Display in UI as clickable links
- Include a “Clear” button

