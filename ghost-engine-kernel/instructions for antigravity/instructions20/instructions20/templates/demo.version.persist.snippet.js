// Persist pluginVersion (demo.js)
const LAST_PV_KEY = "ghost:lastPluginVersion";

function restorePluginVersion() {
  try {
    const pv = localStorage.getItem(LAST_PV_KEY);
    if (pv) window.__LAST_PLUGIN_VERSION__ = pv;
  } catch {}
}

function persistPluginVersion(pv) {
  if (!pv) return;
  window.__LAST_PLUGIN_VERSION__ = pv;
  try { localStorage.setItem(LAST_PV_KEY, pv); } catch {}
}

// On page load:
// restorePluginVersion();
// renderVersionStamp();

// When a job completes:
// const pv = status.result?.pluginVersion || status.result?.metadata?.pluginVersion;
// persistPluginVersion(pv);
// renderVersionStamp();
