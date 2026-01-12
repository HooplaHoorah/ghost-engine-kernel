# Demo UI (minimal browser page)

## Target UX
A single page that:
- lets user enter prompt (+ optional seed)
- submits `POST /generate-scene`
- polls `GET /status/:id`
- displays steps + durations
- shows ASCII minimap
- shows artifact links (presigned URLs) and “Copy JSON”

## Recommended implementation (simple)
Serve a static page at `/demo` from the Orchestrator.

### Orchestrator route (Express-style pseudocode)
```ts
app.get("/demo", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "demo", "index.html"));
});
app.use("/demo", express.static(path.join(__dirname, "..", "public", "demo")));
```

Alternatively, host `demo/` in S3/CloudFront and point it at the API base URL.

## Files included in this bundle
See `demo/` for:
- `index.html`
- `demo.js`
- `styles.css`

### How it works
- `demo.js` reads API base URL from:
  1) `window.GHOST_API_BASE` if injected, else
  2) same origin (assumes demo is served by Orchestrator)
- It renders steps and artifacts; if `sceneGraphUrl` exists, it uses it; else it uses inline JSON.

