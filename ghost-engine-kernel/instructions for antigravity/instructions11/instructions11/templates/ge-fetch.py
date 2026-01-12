#!/usr/bin/env python3
"""ge-fetch <jobId>
Downloads levelSpec from Ghost Engine and saves to GE Doom incoming folder.

Env:
  API_BASE_URL  (e.g., https://your-alb)
  GE_DOOM_DIR   (path to GE Doom project/build root)
"""
import json, os, sys, pathlib
import urllib.request

def http_json(url: str):
    with urllib.request.urlopen(url) as r:
        if r.status != 200:
            raise RuntimeError(f"HTTP {r.status} for {url}")
        return json.loads(r.read().decode("utf-8"))

def http_text(url: str) -> str:
    with urllib.request.urlopen(url) as r:
        if r.status != 200:
            raise RuntimeError(f"HTTP {r.status} for {url}")
        return r.read().decode("utf-8")

def main():
    base = os.environ.get("API_BASE_URL")
    ge_dir = os.environ.get("GE_DOOM_DIR", ".")
    if not base:
        raise RuntimeError("API_BASE_URL is required")
    if len(sys.argv) < 2:
        raise RuntimeError("Usage: ge-fetch <jobId>")
    job_id = sys.argv[1]

    status = http_json(f"{base}/status/{job_id}")
    if status.get("status") != "done":
        raise RuntimeError(f"Job not done: {status.get('status')}")

    r = status.get("result", {})
    incoming = pathlib.Path(ge_dir) / "Levels" / "incoming"
    incoming.mkdir(parents=True, exist_ok=True)

    if "levelSpecUrl" in r and r["levelSpecUrl"]:
        level_spec = http_text(r["levelSpecUrl"])
    elif "levelSpec" in r and r["levelSpec"]:
        level_spec = json.dumps(r["levelSpec"], indent=2)
    else:
        raise RuntimeError("No levelSpecUrl or inline levelSpec")

    out_path = incoming / f"{job_id}.levelSpec.json"
    out_path.write_text(level_spec, encoding="utf-8")
    print(f"Saved: {out_path}")

    # TODO: launch GE Doom with --levelSpec out_path
    print("Next: launch GE Doom with this file (wire your engine's launch command here).")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("ge-fetch failed:", e, file=sys.stderr)
        sys.exit(1)
