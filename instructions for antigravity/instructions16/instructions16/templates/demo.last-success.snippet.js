// Last-success fallback snippet (demo.js)
const LAST_GOOD_KEY = "ghost:lastGoodJobId";

function saveLastGoodJobId(jobId) {
  if (!jobId) return;
  try { localStorage.setItem(LAST_GOOD_KEY, jobId); } catch {}
}

function getLastGoodJobId() {
  try { return localStorage.getItem(LAST_GOOD_KEY); } catch { return null; }
}

function showLoadLastSuccess(onLoadJobId) {
  const last = getLastGoodJobId();
  const wrap = document.getElementById("errorActions");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (!last) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = `Load last success (…${String(last).slice(-4)})`;
  btn.addEventListener("click", () => onLoadJobId(last));
  wrap.appendChild(btn);
}

// Call this when a job is successfully rendered
// saveLastGoodJobId(jobId);

// Call this when generate/poll fails to offer recovery
// showLoadLastSuccess(async (jobId) => {
//   const u = new URL(window.location.href);
//   u.searchParams.set("jobId", jobId);
//   history.replaceState({}, "", u.toString());
//   await pollAndRender(jobId); // reuse your existing loader
// });
