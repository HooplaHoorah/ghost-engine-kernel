// Add better summary reporting inside generateDemoPack
// Track failures:
const failed = [];

// when one fails:
// failed.push(p.label);

// after loop:
if (failed.length === 0) {
  setGenPackStatus(`Saved (${items.length}/3) backups`);
} else {
  setGenPackStatus(`Saved (${items.length}/3) backups — failed: ${failed.join(", ")}`, true);
}

// Optionally render a list:
const listEl = document.getElementById("genPackFailures");
if (listEl) {
  listEl.innerHTML = failed.map(x => `<li>${x}</li>`).join("");
}
