// Drop-in snippet idea for scripts/ge-fetch.js
import { spawn } from "node:child_process";

function splitCommand(cmd) {
  // Minimal splitter: supports quoted segments.
  const out = [];
  let cur = "";
  let q = null;
  for (let i = 0; i < cmd.length; i++) {
    const ch = cmd[i];
    if (q) {
      if (ch === q) { q = null; continue; }
      cur += ch;
    } else {
      if (ch === '"' || ch === "'") { q = ch; continue; }
      if (ch === " ") {
        if (cur) { out.push(cur); cur = ""; }
      } else cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out;
}

export function launchRuntime(savedPath) {
  const execStr = process.env.GE_DOOM_EXEC;
  if (!execStr) {
    console.error("Missing GE_DOOM_EXEC. Example: GE_DOOM_EXEC=\"node ge-doom/runtime.js\"");
    process.exit(2);
  }
  const parts = splitCommand(execStr);
  const cmd = parts[0];
  const args = parts.slice(1).concat(["--levelSpec", savedPath]);

  console.log("Launching:", cmd, args.join(" "));
  const child = spawn(cmd, args, { stdio: "inherit" });

  child.on("exit", (code) => process.exit(code ?? 0));
}
