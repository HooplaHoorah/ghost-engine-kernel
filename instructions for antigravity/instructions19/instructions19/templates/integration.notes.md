# Integration notes

## 1) Button placement
Add `demo.generate-pack.button.html` next to Generate/Warmup controls.

## 2) Implement generateDemoPack wiring
- Ensure you have these existing functions in demo.js:
  - `api(path, opts)` returning {res, text, json}
  - `pollJob(jobId)` that resolves when done and throws on failed/timeout
  - `renderBackupPanel(loadJobById)`
  - `loadJobById(jobId)`

Then in the click handler:
```js
document.getElementById("genPack")?.addEventListener("click", () => {
  generateDemoPack(renderBackupPanel, loadJobById);
});
```

## 3) Prettify-on-paste
After DOM init:
- call `wirePrettifyBackupJson();`

## 4) Version stamp
- add `demo.version-stamp.html` near footer
- call `renderVersionStamp()` on load
- when a job finishes, set `window.__LAST_PLUGIN_VERSION__` from result and re-render.

