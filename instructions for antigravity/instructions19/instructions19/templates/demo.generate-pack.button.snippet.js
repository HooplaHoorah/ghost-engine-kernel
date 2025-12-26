// Client-side demo pack generation (demo.js)
const DEMO_PACK_KEY = "ghost:demoPack";

const DEMO_PACK_PRESETS = [
  { label:"3 rooms + key + locked exit", seed:12345, prompt:"A tiny dungeon with 3 rooms and a key behind a locked door.", plugin:"doom-bridge" },
  { label:"4 rooms + ambush", seed:333, prompt:"Four small rooms; place an enemy guarding the path to the exit.", plugin:"doom-bridge" },
  { label:"hub + spokes", seed:444, prompt:"A hub room connected to three side rooms; key in one side room; exit in another.", plugin:"doom-bridge" },
];

function setGenPackStatus(msg, isError=false) {
  const el = document.getElementById("genPackStatus");
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? "crimson" : "";
}

async function generateOne(preset) {
  const body = { prompt: preset.prompt, plugin: preset.plugin, seed: preset.seed };
  const gen = await api("/generate-scene", { method:"POST", body: JSON.stringify(body) });
  if (!gen.res.ok) throw new Error(`generate ${gen.res.status}: ${gen.text}`);
  const jobId = gen.json?.jobId || gen.json?.id;
  if (!jobId) throw new Error("missing jobId");
  await pollJob(jobId); // reuse your existing poller that resolves on done or throws on failed/timeout
  return jobId;
}

async function generateDemoPack(renderBackupPanel, loadJobById) {
  const btn = document.getElementById("genPack");
  const warmupBtn = document.getElementById("warmup");
  const goBtn = document.getElementById("go");
  btn.disabled = true;
  if (warmupBtn) warmupBtn.disabled = true;
  if (goBtn) goBtn.disabled = true;

  const createdAt = new Date().toISOString();
  const items = [];
  let hadError = false;

  try {
    for (let i=0;i<DEMO_PACK_PRESETS.length;i++) {
      const p = DEMO_PACK_PRESETS[i];
      setGenPackStatus(`Generating ${i+1}/3… ${p.label}`);
      try {
        const jobId = await generateOne(p);
        items.push({ label:p.label, seed:p.seed, jobId });
      } catch (e) {
        hadError = true;
        console.warn("pack item failed:", e);
      }
    }

    const pack = { createdAt, items };
    localStorage.setItem(DEMO_PACK_KEY, JSON.stringify(pack, null, 2));
    // If you have textarea, keep it in sync:
    const ta = document.getElementById("backupJson");
    if (ta) ta.value = JSON.stringify(pack, null, 2);

    renderBackupPanel(loadJobById);
    setGenPackStatus(hadError ? `Saved (${items.length}/3) with warnings` : `Saved (${items.length}/3)`);
  } catch (e) {
    setGenPackStatus("Demo Pack failed", true);
    console.error(e);
  } finally {
    btn.disabled = false;
    if (warmupBtn) warmupBtn.disabled = false;
    if (goBtn) goBtn.disabled = false;
  }
}

document.getElementById("genPack")?.addEventListener("click", () => {
  // Provide your real functions here:
  // generateDemoPack(renderBackupPanel, loadJobById);
});
