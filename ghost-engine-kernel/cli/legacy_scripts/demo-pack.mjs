/**
 * Ghost Engine Demo Pack (CloudFront HTTPS)
 * Usage:
 *   node scripts/demo-pack.mjs
 * Optional:
 *   API_BASE_URL="https://d3a3b2mntnsxvl.cloudfront.net" node scripts/demo-pack.mjs
 */
const base = process.env.API_BASE_URL || "https://d3a3b2mntnsxvl.cloudfront.net";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function http(path, opts = {}) {
    const res = await fetch(`${base}${path}`, {
        ...opts,
        headers: {
            ...(opts.headers || {}),
            ...(opts.body ? { "content-type": "application/json" } : {}),
        },
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { }
    return { res, text, json };
}

async function main() {
    console.log(`# Ghost Engine Demo Pack\nBase: ${base}\n`);

    const h = await http("/healthz");
    if (!h.res.ok) throw new Error(`/healthz ${h.res.status}`);
    console.log("healthz:", h.text);

    const gen = await http("/generate-scene", {
        method: "POST",
        body: JSON.stringify({
            prompt: "doom-bridge: tiny test dungeon with a key and locked exit",
            plugin: "doom-bridge",
        }),
    });
    if (!gen.res.ok) throw new Error(`/generate-scene ${gen.res.status} ${gen.text}`);
    const jobId = gen.json?.jobId || gen.json?.id;
    if (!jobId) throw new Error(`Missing jobId: ${gen.text}`);
    console.log("jobId:", jobId);

    let status = null;
    for (let i = 0; i < 80; i++) {
        const s = await http(`/status/${encodeURIComponent(jobId)}`);
        if (!s.res.ok) throw new Error(`/status ${s.res.status} ${s.text}`);
        status = s.json;
        const st = status?.state || status?.status;
        if (st === "done" || st === "succeeded") break;
        if (st === "failed") throw new Error(`job failed: ${JSON.stringify(status)}`);
        await sleep(1500);
    }
    console.log("status:", JSON.stringify(status));

    const lvl = await http(`/artifact/${encodeURIComponent(jobId)}/levelSpec`);
    if (!lvl.res.ok) throw new Error(`/artifact levelSpec ${lvl.res.status} ${lvl.text.slice(0, 200)}`);
    console.log("levelSpec ok:", !!lvl.json);

    console.log("\n## Share Links");
    console.log(`Demo: ${base}/demo?jobId=${jobId}`);
    console.log(`Play: ${base}/play?job=${jobId}`);
}

main().catch((e) => {
    console.error("DEMO PACK FAILED:", e);
    process.exit(1);
});
