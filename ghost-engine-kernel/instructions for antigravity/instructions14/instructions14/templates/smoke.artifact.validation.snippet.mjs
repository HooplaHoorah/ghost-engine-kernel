// Artifact URL validation helpers (drop into scripts/smoke.mjs)
async function fetchText(url) {
  const res = await fetch(url);
  const text = await res.text();
  return { res, text };
}

async function assertTextUrl(name, url) {
  const { res, text } = await fetchText(url);
  if (!res.ok) {
    throw new Error(`[artifact:${name}] HTTP ${res.status} body=${text.slice(0,200)}`);
  }
  if (!text || text.length < 1) {
    throw new Error(`[artifact:${name}] empty body`);
  }
}

async function assertJsonUrl(name, url) {
  const { res, text } = await fetchText(url);
  if (!res.ok) {
    throw new Error(`[artifact:${name}] HTTP ${res.status} body=${text.slice(0,200)}`);
  }
  if (!text || text.length < 1) {
    throw new Error(`[artifact:${name}] empty body`);
  }
  try {
    JSON.parse(text);
  } catch (e) {
    throw new Error(`[artifact:${name}] invalid JSON: ${(e && e.message) || e}`);
  }
}

// Usage after status done:
//
// const r = status.result || {};
// if (r.sceneGraphUrl) await assertJsonUrl("sceneGraphUrl", r.sceneGraphUrl);
// else if (!r.sceneGraph) throw new Error("missing sceneGraph (url or inline)");
//
// if (r.asciiMinimapUrl) await assertTextUrl("asciiMinimapUrl", r.asciiMinimapUrl);
// else if (!r.asciiMinimap) throw new Error("missing asciiMinimap (url or inline)");
//
// if (r.levelSpecUrl) await assertJsonUrl("levelSpecUrl", r.levelSpecUrl);
// else if (plugin==="doom-bridge" && !r.levelSpec) throw new Error("missing levelSpec");
//
// if (r.levelPreviewAsciiUrl) await assertTextUrl("levelPreviewAsciiUrl", r.levelPreviewAsciiUrl);
