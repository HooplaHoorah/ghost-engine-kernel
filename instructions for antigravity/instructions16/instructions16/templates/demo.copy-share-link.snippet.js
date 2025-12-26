// Copy share link snippet (demo.js)
function buildShareLink(jobId) {
  const u = new URL(window.location.href);
  u.pathname = u.pathname.replace(/\/$/, "") || "/demo";
  if (jobId) u.searchParams.set("jobId", jobId);
  return u.toString();
}

async function copyTextToClipboard(text) {
  // modern
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  // legacy fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  return ok;
}

function wireCopyShareLink(getCurrentJobId) {
  const btn = document.getElementById("copyShare");
  const statusEl = document.getElementById("copyShareStatus");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const jobId = getCurrentJobId?.();
    const link = buildShareLink(jobId);
    try {
      const ok = await copyTextToClipboard(link);
      statusEl.textContent = ok ? "Copied!" : "Copy failed";
      setTimeout(() => (statusEl.textContent = ""), 1500);
    } catch (e) {
      statusEl.textContent = "Copy failed";
      setTimeout(() => (statusEl.textContent = ""), 1500);
    }
  });
}
