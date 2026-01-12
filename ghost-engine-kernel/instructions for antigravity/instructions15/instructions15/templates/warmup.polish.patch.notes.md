# warmup.js polish patch notes

## Add pluginVersion printing
After done:
- `const pv = r.pluginVersion || r.metadata?.pluginVersion || done.pluginVersion;`
- print if present

## Preserve share link even on validation failure
Wrap URL validations in try/catch and track `hadValidationError = true`.

Example:
```js
let hadValidationError = false;
try { await assertJsonUrl("levelSpecUrl", r.levelSpecUrl); }
catch (e) {
  hadValidationError = true;
  console.warn("WARN:", e.message);
}
...
console.log("share:", `${base}/demo?jobId=${jobId}`);
process.exit(hadValidationError ? 1 : 0);
```

Include artifact name + status + truncated URL in the warning.

