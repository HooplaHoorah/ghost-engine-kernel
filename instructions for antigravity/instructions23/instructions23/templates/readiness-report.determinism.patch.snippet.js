// Add near top: parse flag
const determinism = hasFlag("--determinism");

// Helper to run determinism test
import { spawnSync } from "node:child_process";

function runDeterminism() {
  const r = spawnSync(process.execPath, ["scripts/backend-determinism-test.js"], {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const out = (r.stdout || "") + (r.stderr || "");
  return { code: r.status ?? 1, out };
}

// In main(), add section:
if (determinism) {
  console.log("=== DETERMINISM ===");
  const d = runDeterminism();
  if (d.code === 0) {
    console.log("DETERMINISM: PASS\n");
  } else {
    failed.push("DETERMINISM");
    console.log("DETERMINISM: FAIL");
    console.log(d.out.slice(0, 300));
    console.log("");
  }
}
