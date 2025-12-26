// Add counters at top of section (mini smoke or pack aggregate)
let attempted = 0;
let passed = 0;

async function checkJson(name, url) {
  if (!url) return;
  attempted++;
  await assertJsonUrl(name, url);
  passed++;
}

async function checkText(name, url) {
  if (!url) return;
  attempted++;
  await assertTextUrl(name, url);
  passed++;
}

// Use in validations:
await checkJson("levelSpecUrl", r.levelSpecUrl);
await checkJson("sceneGraphUrl", r.sceneGraphUrl);
await checkText("asciiMinimapUrl", r.asciiMinimapUrl);
await checkText("levelPreviewAsciiUrl", r.levelPreviewAsciiUrl);

// After validations print:
console.log(`Artifacts verified: ${passed}/${attempted} OK`);
