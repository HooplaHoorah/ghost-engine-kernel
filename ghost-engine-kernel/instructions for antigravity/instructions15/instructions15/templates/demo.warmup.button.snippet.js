// Run Warmup button snippet (demo.js)
// Assumes you add a button: <button id="warmup">Run Warmup</button>

async function runWarmup() {
  const btn = document.getElementById("warmup");
  const go = document.getElementById("go");
  btn.disabled = true;
  go.disabled = true;
  setStatus("warming up…");

  const body = { prompt: "Three rooms, locked exit, key", plugin: "doom-bridge", seed: 12345 };
  const gen = await api("/generate-scene", { method:"POST", body: JSON.stringify(body) });
  if (!gen.res.ok) {
    setStatus(`warmup failed: ${gen.res.status}`);
    document.getElementById("raw").textContent = gen.text;
    btn.disabled = false;
    go.disabled = false;
    return;
  }

  const jobId = gen.json?.jobId || gen.json?.id;
  if (!jobId) {
    setStatus("warmup missing jobId");
    btn.disabled = false;
    go.disabled = false;
    return;
  }

  // Update URL so it is shareable
  const u = new URL(window.location.href);
  u.searchParams.set("jobId", jobId);
  window.history.replaceState({}, "", u.toString());

  // Reuse existing polling by calling your existing run/poll function,
  // or set a global jobId and let your polling code pick it up.
  setStatus(`job: ${jobId} (polling…)`);

  // If your code has a function like pollJob(jobId), call it here:
  // await pollJob(jobId);

  btn.disabled = false;
  go.disabled = false;
}
document.getElementById("warmup")?.addEventListener("click", runWarmup);
