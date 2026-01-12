# Integration notes

## 1) Preflight in Generate Demo Pack
In your existing `generateDemoPack(...)` function:
- call `await healthzPreflight()` before the loop
- if it throws, show status error and abort gracefully (re-enable controls)
- optionally dump `hz` JSON into your debug/raw area

## 2) Summary + failures list
- track `failed` labels
- update status at end with saved N/3 and failures
- optionally add `<ul id="genPackFailures">` under the status span

## 3) Persist pluginVersion
- on load: call `restorePluginVersion()` before `renderVersionStamp()`
- on job done: call `persistPluginVersion(pv)`

