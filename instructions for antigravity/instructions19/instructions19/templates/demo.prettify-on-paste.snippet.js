// Prettify-on-paste / blur for #backupJson
function wirePrettifyBackupJson() {
  const ta = document.getElementById("backupJson");
  if (!ta) return;

  const status = (msg, isError=false) => {
    const el = document.getElementById("backupStatus");
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? "crimson" : "";
    if (msg) setTimeout(() => { if (el.textContent === msg) el.textContent = ""; }, 2000);
  };

  const prettify = () => {
    const raw = ta.value || "";
    if (!raw.trim()) return;
    try {
      const obj = JSON.parse(raw);
      ta.value = JSON.stringify(obj, null, 2);
      status("Valid JSON");
    } catch {
      status("Invalid JSON", true);
    }
  };

  ta.addEventListener("paste", () => setTimeout(prettify, 0));
  ta.addEventListener("blur", prettify);
}
