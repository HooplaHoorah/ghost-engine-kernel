// Backup panel paste/save handler (demo.js)
const DEMO_PACK_KEY = "ghost:demoPack";

function setBackupStatus(msg, isError=false) {
  const el = document.getElementById("backupStatus");
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? "crimson" : "";
  if (msg) setTimeout(() => { if (el.textContent === msg) el.textContent = ""; }, 2500);
}

function validatePack(pack) {
  if (!pack || typeof pack !== "object") return "Pack must be an object";
  if (!Array.isArray(pack.items)) return "Pack.items must be an array";
  if (pack.items.length < 1) return "Pack.items must not be empty";
  for (const it of pack.items) {
    if (!it || typeof it !== "object") return "Each item must be an object";
    if (typeof it.jobId !== "string" || it.jobId.trim().length < 1) return "Each item.jobId must be a non-empty string";
    if (typeof it.label !== "string") return "Each item.label must be a string";
    const seed = (typeof it.seed === "string") ? Number(it.seed) : it.seed;
    if (!Number.isFinite(seed)) return "Each item.seed must be a number";
    it.seed = seed; // normalize
  }
  if (!pack.createdAt) pack.createdAt = new Date().toISOString();
  return null;
}

function wireBackupPasteUI(onLoadJobId, renderBackupPanel) {
  const ta = document.getElementById("backupJson");
  const saveBtn = document.getElementById("backupSave");
  if (!ta || !saveBtn) return;

  // Prefill textarea if pack exists
  try {
    const existing = localStorage.getItem(DEMO_PACK_KEY);
    if (existing) ta.value = existing;
  } catch {}

  saveBtn.addEventListener("click", () => {
    const raw = ta.value || "";
    let pack;
    try {
      pack = JSON.parse(raw);
    } catch (e) {
      setBackupStatus("Invalid JSON", true);
      return;
    }
    const err = validatePack(pack);
    if (err) {
      setBackupStatus(err, true);
      return;
    }
    const pretty = JSON.stringify(pack, null, 2);
    try {
      localStorage.setItem(DEMO_PACK_KEY, pretty);
      ta.value = pretty; // normalize in UI
    } catch (e) {
      setBackupStatus("Could not save to localStorage", true);
      return;
    }
    setBackupStatus("Saved!");
    renderBackupPanel(onLoadJobId);
  });
}

// After you have renderBackupPanel(loadJobById) wired, call:
// wireBackupPasteUI(loadJobById, renderBackupPanel);
