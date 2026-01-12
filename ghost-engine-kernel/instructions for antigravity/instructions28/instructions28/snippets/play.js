// Minimal scaffolding for /play page (fill in to match your API + LevelSpec)
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const jobId = params.get("job");

$("job").textContent = jobId || "—";

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2,"0")).join("");
}

async function getStatus(id) {
  const res = await fetch(`/status/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`status ${res.status}`);
  return await res.json();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  return await res.json();
}

// TODO: implement a tiny renderer that matches your LevelSpec
function renderAscii(levelSpec) {
  return `Loaded LevelSpec v${levelSpec.version || "?"}\nKeys: ${Object.keys(levelSpec).join(", ")}`;
}

async function main() {
  if (!jobId) {
    $("status").textContent = "Missing job id. Open from /demo: /play?job=<id>";
    return;
  }

  $("status").textContent = "Fetching job status…";

  // Poll until terminal
  let status;
  for (let i=0; i<30; i++) {
    status = await getStatus(jobId);
    if (status?.state === "succeeded" || status?.status === "succeeded" || status?.done) break;
    $("status").textContent = `Job not ready yet… retrying (${i+1}/30)`;
    await sleep(500);
  }

  const levelUrl =
    status?.artifacts?.levelSpecUrl ||
    status?.result?.artifacts?.levelSpecUrl ||
    status?.levelSpecUrl;

  if (!levelUrl) {
    $("status").textContent = "No LevelSpec URL found in status payload.";
    return;
  }

  $("status").textContent = "Downloading LevelSpec…";
  try {
    const json = await fetchJson(levelUrl);
    const raw = JSON.stringify(json);
    $("hash").textContent = await sha256Hex(raw);
    $("view").textContent = renderAscii(json);
    $("status").textContent = "Loaded. Implement renderer + controls next.";
  } catch (e) {
    console.error(e);
    $("status").textContent = "Could not fetch LevelSpec (possible CORS). Try proxy.";
    $("retry").style.display = "inline-block";
    $("proxy").style.display = "inline-block";

    $("retry").onclick = () => location.reload();
    $("proxy").onclick = async () => {
      $("status").textContent = "Loading via proxy…";
      const json = await fetchJson(`/artifact/${encodeURIComponent(jobId)}/levelSpec`);
      const raw = JSON.stringify(json);
      $("hash").textContent = await sha256Hex(raw);
      $("view").textContent = renderAscii(json);
      $("status").textContent = "Loaded via proxy.";
    };
  }
}

main().catch(err => {
  console.error(err);
  $("status").textContent = String(err?.message || err);
});
