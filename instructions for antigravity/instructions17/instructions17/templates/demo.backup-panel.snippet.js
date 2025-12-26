// Optional: render backup links from localStorage["ghost:demoPack"]
const DEMO_PACK_KEY = "ghost:demoPack";

function readDemoPack() {
  try { return JSON.parse(localStorage.getItem(DEMO_PACK_KEY) || "null"); } catch { return null; }
}

function renderBackupPanel(onLoadJobId) {
  const pack = readDemoPack();
  const meta = document.getElementById("backupMeta");
  const list = document.getElementById("backupList");
  const clearBtn = document.getElementById("backupClear");
  if (!meta || !list || !clearBtn) return;

  list.innerHTML = "";
  if (!pack?.items?.length) {
    meta.textContent = "No backups saved.";
  } else {
    meta.textContent = `Pack created: ${pack.createdAt}`;
    for (const it of pack.items) {
      const a = document.createElement("a");
      a.href = `/demo?jobId=${it.jobId}`;
      a.textContent = `${it.label} (seed ${it.seed})`;
      a.style.display = "block";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        onLoadJobId(it.jobId);
      });
      list.appendChild(a);
    }
  }

  clearBtn.onclick = () => {
    try { localStorage.removeItem(DEMO_PACK_KEY); } catch {}
    renderBackupPanel(onLoadJobId);
  };
}

// To save a pack from CLI output, paste JSON into devtools:
//
// localStorage.setItem("ghost:demoPack", JSON.stringify(<PASTE_JSON>));
//
// Then call renderBackupPanel(loadJobById).
