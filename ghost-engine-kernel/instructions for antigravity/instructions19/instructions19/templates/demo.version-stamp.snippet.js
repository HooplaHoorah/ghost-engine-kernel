// Version stamp rendering (demo.js)
function renderVersionStamp() {
  const el = document.getElementById("versionStamp");
  if (!el) return;
  const origin = window.location.origin;
  const pv = window.__LAST_PLUGIN_VERSION__ || "";
  const sha = window.__BUILD_SHA__ || "";
  const parts = [`API: ${origin}`];
  if (pv) parts.push(`pluginVersion: ${pv}`);
  if (sha) parts.push(`build: ${sha}`);
  el.textContent = parts.join(" • ");
}

// Call renderVersionStamp() on page load and after you set __LAST_PLUGIN_VERSION__
//
// When job completes, set:
// window.__LAST_PLUGIN_VERSION__ = status.result?.pluginVersion || status.result?.metadata?.pluginVersion || "";
// renderVersionStamp();
