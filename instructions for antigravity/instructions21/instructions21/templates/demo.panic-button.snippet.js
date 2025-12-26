// Panic button wiring (demo.js)
const DEMO_PACK_KEY = "ghost:demoPack";

function readDemoPack() {
  try { return JSON.parse(localStorage.getItem(DEMO_PACK_KEY) || "null"); } catch { return null; }
}

function setOpenBackupStatus(msg, isError=false) {
  const el = document.getElementById("openBackupStatus");
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? "crimson" : "";
  if (msg) setTimeout(() => { if (el.textContent === msg) el.textContent = ""; }, 2000);
}

function refreshBackupButtons() {
  const pack = readDemoPack();
  const newestBtn = document.getElementById("openNewestBackup");
  const randBtn = document.getElementById("openRandomBackup");
  const has = Boolean(pack?.items?.length);

  if (newestBtn) newestBtn.disabled = !has;
  if (randBtn) randBtn.disabled = !has;
}

function wireOpenBackupButtons(loadJobById) {
  const newestBtn = document.getElementById("openNewestBackup");
  const randBtn = document.getElementById("openRandomBackup");

  newestBtn?.addEventListener("click", () => {
    const pack = readDemoPack();
    const it = pack?.items?.[0];
    if (!it?.jobId) return setOpenBackupStatus("No backups saved", true);
    setOpenBackupStatus(`Loading: ${it.label}`);
    loadJobById(it.jobId);
  });

  randBtn?.addEventListener("click", () => {
    const pack = readDemoPack();
    const items = pack?.items || [];
    if (!items.length) return setOpenBackupStatus("No backups saved", true);
    const it = items[Math.floor(Math.random() * items.length)];
    setOpenBackupStatus(`Loading: ${it.label}`);
    loadJobById(it.jobId);
  });

  refreshBackupButtons();
}

// Call `refreshBackupButtons()` after:
// - saving backups (Save button)
// - clearing backups
// - generating demo pack
