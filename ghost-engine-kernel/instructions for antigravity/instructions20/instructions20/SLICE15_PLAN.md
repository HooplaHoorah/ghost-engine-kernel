# Slice 15 Plan — Tiny hardening pass

## A) /healthz preflight before generating pack
When “Generate Demo Pack” is clicked:
- call `GET /healthz`
- if response not OK, show error and abort
- if configured deps are present and checks indicate failure:
  - `configured.JOBS_TABLE_NAME && checks.ddb === false` -> abort
  - `configured.ARTIFACTS_BUCKET && checks.s3 === false` -> abort

This prevents wasting time generating jobs when the environment is misconfigured.

## B) Pack progress summary + failed labels
During generation:
- show “Generating 1/3…”, etc.
After completion:
- show “Saved 3/3” or “Saved 2/3 (failed: X)”, etc.
- list failed preset labels below status line or in a small <ul>.

## C) Persist pluginVersion
- On job done: store `localStorage["ghost:lastPluginVersion"] = pluginVersion`
- On load: read it and set `window.__LAST_PLUGIN_VERSION__` before rendering stamp.

