/* Minimal Ghost Engine demo UI (no build step). */
const $ = (id) => document.getElementById(id);

const base =
  window.GHOST_API_BASE ||
  (location.origin.includes("http") ? location.origin : "");

$("base").textContent = base || "(set window.GHOST_API_BASE)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(path, opts = {}) {
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { "content-type": "application/json", ...(opts.headers || {}) },
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { res, text, json };
}

function setStatus(s) { $("status").textContent = s; }

function renderSteps(steps = []) {
  const tbody = $("steps").querySelector("tbody");
  tbody.innerHTML = "";
  for (const st of steps) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${st.name ?? ""}</td>
      <td>${st.status ?? ""}</td>
      <td>${st.durationMs ?? ""}</td>
      <td>${st.summary ?? ""}</td>
    `;
    tbody.appendChild(tr);
  }
}

function renderArtifacts(result = {}) {
  const el = $("artifacts");
  el.innerHTML = "";

  const add = (label, href, fallbackText) => {
    const div = document.createElement("div");
    div.className = "item";
    if (href) {
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = label;
      div.appendChild(a);
    } else {
      div.textContent = `${label}: ${fallbackText || "—"}`;
    }
    el.appendChild(div);
  };

  add("sceneGraph", result.sceneGraphUrl, result.sceneGraph ? "inline JSON" : "—");
  add("asciiMinimap", result.asciiMinimapUrl, result.asciiMinimap ? "inline text" : "—");
  add("levelSpec", result.levelSpecUrl, result.levelSpec ? "inline JSON" : "—");
}

async function run() {
  $("go").disabled = true;
  setStatus("starting…");

  const prompt = $("prompt").value.trim();
  const plugin = $("plugin").value;
  const seedRaw = $("seed").value.trim();
  const seed = seedRaw ? Number(seedRaw) : undefined;

  const body = { prompt, plugin };
  if (Number.isFinite(seed)) body.seed = seed;

  const gen = await api("/generate-scene", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!gen.res.ok) {
    setStatus(`generate failed: ${gen.res.status}`);
    $("raw").textContent = gen.text;
    $("go").disabled = false;
    return;
  }

  const jobId = gen.json?.jobId || gen.json?.id;
  if (!jobId) {
    setStatus("missing jobId");
    $("raw").textContent = JSON.stringify(gen.json, null, 2);
    $("go").disabled = false;
    return;
  }

  setStatus(`job: ${jobId} (polling…)`);

  const maxMs = 120000;
  const start = Date.now();
  let status = null;

  while (Date.now() - start < maxMs) {
    const s = await api(`/status/${jobId}`, { method: "GET" });
    if (!s.res.ok) {
      setStatus(`status failed: ${s.res.status}`);
      $("raw").textContent = s.text;
      break;
    }
    status = s.json || {};
    $("raw").textContent = JSON.stringify(status, null, 2);

    renderSteps(status.steps || []);

    const r = status.result || {};
    if (r.asciiMinimap) $("minimap").textContent = r.asciiMinimap;
    renderArtifacts(r);

    if (status.status === "done" || status.status === "failed") {
      setStatus(`${status.status} • job: ${jobId}`);
      break;
    }
    await sleep(1200);
  }

  if (!status) setStatus("no status payload");
  $("go").disabled = false;
}

$("go").addEventListener("click", run);
