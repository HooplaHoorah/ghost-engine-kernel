# Persist pluginVersion in localStorage

## Key
- `ghost:lastPluginVersion`

## On job done
When you detect job completion and have `pluginVersion`:
- set `window.__LAST_PLUGIN_VERSION__ = pluginVersion`
- `localStorage.setItem("ghost:lastPluginVersion", pluginVersion)`
- call `renderVersionStamp()`

## On page load
- read localStorage key (if present)
- set `window.__LAST_PLUGIN_VERSION__` to that value
- call `renderVersionStamp()`

This ensures the stamp survives refreshes.

