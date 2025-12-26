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
  try { json = JSON.parse(text); } catch { }
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

  // Copy Buttons
  if (result.levelSpec) {
    const btn = document.createElement("button");
    btn.textContent = "Copy LevelSpec";
    btn.style.marginLeft = "10px";
    btn.onclick = () => navigator.clipboard.writeText(JSON.stringify(result.levelSpec, null, 2));
    el.appendChild(btn);
  }
}

function updateMeta(status) {
  if (!status) return;
  $("meta-card").style.display = "block";
  $("meta-jobid").textContent = status.jobId || status.id;
  $("meta-state").textContent = status.state || status.status;
  $("meta-seed").textContent = status.input?.seed ?? status.result?.levelSpec?.seed ?? "—";
  $("meta-plugin").textContent = status.plugin || "—";
  $("meta-version").textContent = status.result?.pluginVersion || "—";

  // Share Link
  const link = $("share-link");
  const url = new URL(location.href);
  url.searchParams.set("jobId", status.jobId || status.id);
  link.href = url.toString();
  $("share-link-box").style.display = "inline";

  // Replay Button
  const replayBtn = $("replay");
  replayBtn.style.display = "inline-block";
  // Remove old listeners by simple assignment
  replayBtn.onclick = async () => {
    // Direct replay without confirm for smoother demo flow
    await replayJob(status.jobId || status.id);
  };

  // Play Button
  const playBtn = $("play");
  if (status.result?.levelSpecUrl) {
    playBtn.style.display = "inline-block";
    playBtn.onclick = () => {
      const cmd = `curl -L "${status.result.levelSpecUrl}" -o level.json && node ge-doom/runtime.js --levelSpec level.json`;
      // prompt to allow copy-paste
      prompt("Run this in your terminal to play (Mac/Linux):", cmd);
    };
  } else {
    playBtn.style.display = "none";
  }
}


// Helper to handle rate limits
async function handleRateLimit(res, buttonId) {
  const retryAfter = res.headers.get("Retry-After");
  const delaySec = retryAfter ? parseInt(retryAfter, 10) : 3;
  setStatus(`Rate limited (429). Retrying in ${delaySec}s...`);

  $(buttonId).disabled = true;
  await sleep(delaySec * 1000);
  setStatus("Ready to retry.");
  $(buttonId).disabled = false;
}

async function replayJob(originalId) {
  const btnId = "replay";
  $(btnId).disabled = true;
  $("go").disabled = true;
  setStatus(`Replaying ${originalId}...`);

  const gen = await api(`/jobs/${originalId}/replay`, { method: "POST" });

  if (gen.res.status === 429) {
    await handleRateLimit(gen.res, btnId);
    // Auto-retry or just let user click again? Instructions say "Auto re-enable".
    // Let's just return and let user click again to avoid infinite loops.
    // But re-enable 'go' too.
    $("go").disabled = false;
    return;
  }

  if (!gen.res.ok) {
    setStatus(`Replay failed: ${gen.res.status}`);
    $(btnId).disabled = false;
    $("go").disabled = false;
    return;
  }

  const newId = gen.json.jobId;
  if (newId) {
    // Reset and poll new job
    await poll(newId);
  }
  $(btnId).disabled = false; // Re-enable replay button eventually
}


async function poll(jobId) {
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

    updateMeta(status);

    const r = status.result || {};
    if (r.asciiMinimap) $("minimap").textContent = r.asciiMinimap;
    renderArtifacts(r);

    if (status.state === "done" || status.state === "failed" || status.status === "done" || status.status === "failed") {
      setStatus(`${status.state || status.status} • job: ${jobId}`);
      break;
    }
    await sleep(1200);
  }

  if (!status) setStatus("no status payload");
  $("go").disabled = false;
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

  if (gen.res.status === 429) {
    await handleRateLimit(gen.res, "go");
    return;
  }

  if (!gen.res.ok) {
    setStatus(`generate failed: ${gen.res.status}`);
    const err = gen.json?.error || gen.text;
    alert("Error: " + err); // Guardrail friendly error
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

  await poll(jobId);
}

// Init
window.addEventListener("load", () => {
  // Preset handler
  $("preset").addEventListener("change", (e) => {
    if (e.target.value) $("prompt").value = e.target.value;
  });

  // Check URL
  const params = new URLSearchParams(location.search);
  const jid = params.get("jobId");
  if (jid) {
    poll(jid);
  }
});


$("warmup").addEventListener("click", async () => {
  const btn = $("warmup");
  btn.disabled = true;
  setStatus("Warming up...");
  try {
    const res = await api("/healthz");
    if (res.res.ok) {
      const info = res.json || {};
      const msg = `Warmup OK. Checks: DDB=${info.checks?.ddb}, S3=${info.checks?.s3}`;
      setStatus(msg);
      $("raw").textContent = JSON.stringify(info, null, 2);
    } else {
      setStatus(`Warmup failed: ${res.res.status}`);
    }
  } catch (e) {
    setStatus(`Warmup error: ${e.message}`);
  }
  btn.disabled = false;
});

$("go").addEventListener("click", run);
