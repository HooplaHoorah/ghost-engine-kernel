# Patch notes for `--md` mode

## Add flag
At top:
```js
const md = hasFlag("--md");
```

## Add printer helpers
```js
const out = [];
const p = (s="") => out.push(s);

function h1(t){ md ? p(`# ${t}`) : console.log(`=== ${t} ===`); }
function h2(t){ md ? p(`\n## ${t}`) : console.log(`=== ${t} ===`); }
function ok(t){ md ? p(`- ✅ ${t}`) : console.log(t); }
function fail(t){ md ? p(`- ❌ ${t}`) : console.error(t); }
function code(lang, txt){
  if (!md) { console.log(txt); return; }
  p(`\n\\`\`\`${lang}`);
  p(txt);
  p("\\`\`\`");
}
```

Then, in md mode, replace console.log/console.error usage with p()/ok()/fail()/code().

At end of main():
```js
if (md) console.log(out.join("\n"));
```

## Suggested structure
- Title (h1)
- metadata bullets (API, time, pluginVersion)
- Section headings (h2) with ok/fail bullets
- health json as code("json", JSON.stringify(hzJson,null,2))
- demo pack json as code("json", JSON.stringify(pack,null,2))
