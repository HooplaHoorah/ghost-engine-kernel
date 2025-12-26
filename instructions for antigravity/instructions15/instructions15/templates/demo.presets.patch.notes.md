# Demo preset patch notes (demo.js / index.html)

## Data model suggestion
In `demo.js`, define presets like:
```js
const PRESETS = [
  { group:"Presentation (fast + reliable)", label:"3 rooms + key + locked exit", seed:12345, plugin:"doom-bridge", prompt:"A tiny dungeon with 3 rooms and a key behind a locked door." },
  ...
];
```

## UI rendering
If presets are in a <select>, render group headers via <optgroup>:
```html
<select id="preset"></select>
```
```js
const sel = document.getElementById("preset");
const groups = new Map();
for (const p of PRESETS) {
  if (!groups.has(p.group)) {
    const og = document.createElement("optgroup");
    og.label = p.group;
    sel.appendChild(og);
    groups.set(p.group, og);
  }
  const opt = document.createElement("option");
  opt.value = p.label;
  opt.textContent = p.label;
  opt.dataset.preset = JSON.stringify(p);
  groups.get(p.group).appendChild(opt);
}
sel.addEventListener("change", () => {
  const opt = sel.selectedOptions[0];
  const p = JSON.parse(opt.dataset.preset);
  document.getElementById("prompt").value = p.prompt;
  document.getElementById("plugin").value = p.plugin;
  document.getElementById("seed").value = String(p.seed);
});
```

If you already have presets implemented, just add these 5 and ensure they set prompt/plugin/seed.

