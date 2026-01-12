# Version stamp in demo UI

## Goal
Make debugging and screenshots easier.

## Display
In the footer or under Job Metadata, show:
- API: `<origin>`
- pluginVersion: from last completed job (if present)
- build SHA: if present as `window.__BUILD_SHA__` or meta tag

## Source of pluginVersion
When a job completes and you parse status payload:
- check `status.result.pluginVersion` or `status.result.metadata.pluginVersion`
- store as `window.__LAST_PLUGIN_VERSION__` and render it

See `templates/demo.version-stamp.html` and `templates/demo.version-stamp.snippet.js`.

