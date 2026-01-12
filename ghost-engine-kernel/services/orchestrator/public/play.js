// GE DOOM Web Runtime (MVP) via play.js

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const jobId = params.get("job");

$("job").textContent = jobId || "—";

/** Utilities */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function sha256Hex(text) {
    const enc = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getStatus(id) {
    const res = await fetch(`/status/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`status ${res.status}`);
    return await res.json();
}

async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    return await res.json();
}

/** Level Logic (Adapted from ge-doom/runtime.js) */
function buildLevel(spec) {
    // Determine grid extents
    let maxX = 0, maxY = 0;
    for (const r of spec.rooms) {
        maxX = Math.max(maxX, r.x + r.w);
        maxY = Math.max(maxY, r.y + r.h);
    }
    const width = maxX + 2; // extra border
    const height = maxY + 2;

    // Initialize solid walls '#'
    const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => '#'));

    // Carve rooms (empty floor '.')
    for (const r of spec.rooms) {
        for (let y = r.y; y < r.y + r.h; y++) {
            for (let x = r.x; x < r.x + r.w; x++) {
                grid[y + 1][x + 1] = '.'; // offset by 1 for outer border
            }
        }
    }

    // Helper to find shared wall between two rooms (deterministic)
    function carveDoor(conn) {
        const from = spec.rooms.find(r => r.id === conn.from);
        const to = spec.rooms.find(r => r.id === conn.to);
        if (!from || !to) return;
        // Determine overlap on x or y axis
        const xOverlap = Math.max(0, Math.min(from.x + from.w, to.x + to.w) - Math.max(from.x, to.x));
        const yOverlap = Math.max(0, Math.min(from.y + from.h, to.y + to.h) - Math.max(from.y, to.y));
        if (xOverlap > 0) {
            // vertical shared wall
            const doorX = Math.max(from.x, to.x) + Math.floor(xOverlap / 2);
            const doorY = (from.y + from.h === to.y) ? from.y + from.h : to.y + to.h; // bottom of upper room
            grid[doorY + 1][doorX + 1] = conn.locked ? 'D' : '.'; // D = locked door
        } else if (yOverlap > 0) {
            // horizontal shared wall
            const doorY = Math.max(from.y, to.y) + Math.floor(yOverlap / 2);
            const doorX = (from.x + from.w === to.x) ? from.x + from.w : to.x + to.w; // right side of left room
            grid[doorY + 1][doorX + 1] = conn.locked ? 'D' : '.';
        } else {
            // No direct adjacency – create a simple corridor of length 1 between centers
            const cx1 = Math.floor(from.x + from.w / 2);
            const cy1 = Math.floor(from.y + from.h / 2);
            const cx2 = Math.floor(to.x + to.w / 2);
            const cy2 = Math.floor(to.y + to.h / 2);
            const doorX = Math.floor((cx1 + cx2) / 2);
            const doorY = Math.floor((cy1 + cy2) / 2);
            grid[doorY + 1][doorX + 1] = conn.locked ? 'D' : '.';
        }
    }

    // Carve doors from connections
    if (spec.connections) {
        for (const conn of spec.connections) {
            carveDoor(conn);
        }
    }

    // Place entities
    const entityMap = {};
    if (spec.entities) {
        for (const e of spec.entities) {
            const char = e.type === 'key' ? 'K' : e.type === 'enemy' ? 'M' : 'I';
            const gx = e.x + 1;
            const gy = e.y + 1;
            // Don't overwrite if not floor? actually entities sit on floor.
            // But we want to see them on map.
            // We will store them in grid for simple rendering.
            grid[gy][gx] = char;
            entityMap[`${gx},${gy}`] = { ...e, char };
        }
    }

    // Place spawn and exit
    if (spec.spawn) {
        const sp = spec.spawn;
        grid[sp.y + 1][sp.x + 1] = 'P'; // Initially P
    }

    if (spec.exit) {
        const ex = spec.exit;
        grid[ex.y + 1][ex.x + 1] = 'E';
    }

    return { grid, spec, entityMap };
}

/** Game State */
let gameState = {
    grid: [],
    playerPos: { x: 0, y: 0 },
    hasKey: false,
    message: "Welcome to GE DOOM!",
    won: false,
    lost: false
};

function renderGame() {
    if (!gameState.grid.length) return;

    let output = "";
    // output += gameState.message + "\n\n";

    for (let y = 0; y < gameState.grid.length; y++) {
        let line = "";
        for (let x = 0; x < gameState.grid[y].length; x++) {
            const cell = gameState.grid[y][x];

            if (x === gameState.playerPos.x && y === gameState.playerPos.y) {
                line += "@"; // Player
            } else {
                line += cell;
            }
        }
        output += line + "\n";
    }

    // Status line
    let status = `Keys: ${gameState.hasKey ? "[/]" : "[ ]"} | ${gameState.message}`;
    if (gameState.won) status = "★ VICTORY! ★  Refresh to replay.";
    if (gameState.lost) status = "† DIED †  Refresh to retry.";

    $("view").textContent = output + "\n" + status;
}

function handleInput(key) {
    if (gameState.won || gameState.lost) return;

    const dirs = {
        "w": [0, -1], "a": [-1, 0], "s": [0, 1], "d": [1, 0],
        "ArrowUp": [0, -1], "ArrowLeft": [-1, 0], "ArrowDown": [0, 1], "ArrowRight": [1, 0]
    };

    const move = dirs[key.toLowerCase()] || dirs[key];
    if (!move) return;

    const [dx, dy] = move;
    const nx = gameState.playerPos.x + dx;
    const ny = gameState.playerPos.y + dy;

    // Bounds check
    if (ny < 0 || ny >= gameState.grid.length || nx < 0 || nx >= gameState.grid[0].length) return;

    const target = gameState.grid[ny][nx];

    if (target === '#') {
        gameState.message = "Oof! A wall.";
        renderGame();
        return;
    }

    if (target === 'D') {
        if (gameState.hasKey) {
            gameState.grid[ny][nx] = '.'; // Open door
            gameState.message = "Unlocked the door.";
        } else {
            gameState.message = "Locked. Need a key.";
            renderGame();
            return; // Blocked
        }
    }

    // Move
    gameState.playerPos = { x: nx, y: ny };
    gameState.message = "";

    // Check new tile interactions
    const newTile = gameState.grid[ny][nx]; // Re-read in case we just opened a door

    if (newTile === 'K') {
        gameState.hasKey = true;
        gameState.grid[ny][nx] = '.'; // Remove key
        gameState.message = "Got the key!";
    }

    if (newTile === 'M') {
        gameState.lost = true;
        gameState.message = "You were eaten by a Grue (Monster).";
    }

    if (newTile === 'E') {
        gameState.won = true;
        gameState.message = "You escaped!";
    }

    renderGame();
}


/** Boot Protocol */
async function main() {
    if (!jobId) {
        $("status").textContent = "Missing job id. Open from /demo: /play?job=<id>";
        return;
    }

    $("status").textContent = "Fetching job status…";

    // Poll until terminal
    let status;
    for (let i = 0; i < 30; i++) {
        status = await getStatus(jobId);
        if (status?.state === "succeeded" || status?.status === "succeeded" || status?.done || status?.state === "done") break;
        $("status").textContent = `Job not ready yet… retrying (${i + 1}/30)`;
        await sleep(500);
    }

    const levelUrl =
        status?.artifacts?.levelSpecUrl ||
        status?.result?.artifacts?.levelSpecUrl ||
        status?.result?.levelSpecUrl ||
        status?.levelSpecUrl;

    if (status?.input?.seed) $("seed").textContent = status.input.seed;

    // Direct Inline Load
    if (!levelUrl && status?.result?.levelSpec) {
        $("status").textContent = "Loaded inline LevelSpec.";
        const json = status.result.levelSpec;
        const raw = JSON.stringify(json);
        $("hash").textContent = await sha256Hex(raw);

        const level = buildLevel(json);
        gameState.grid = level.grid;
        if (json.spawn) {
            gameState.playerPos = { x: json.spawn.x + 1, y: json.spawn.y + 1 };
        }

        $("status").textContent = "Playing";
        renderGame();
        window.addEventListener("keydown", (e) => handleInput(e.key));
        return;
    }

    if (!levelUrl) {
        $("status").textContent = "No LevelSpec URL found in status payload.";
        return;
    }

    $("status").textContent = "Downloading LevelSpec…";

    const loadGame = async (url) => {
        try {
            const json = await fetchJson(url);
            const raw = JSON.stringify(json);
            $("hash").textContent = await sha256Hex(raw);

            const level = buildLevel(json);
            // Init State
            gameState.grid = level.grid;
            if (json.spawn) {
                gameState.playerPos = { x: json.spawn.x + 1, y: json.spawn.y + 1 };
            }

            $("status").textContent = "Playing";
            renderGame();

            // Bind controls
            window.addEventListener("keydown", (e) => handleInput(e.key));

        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    try {
        await loadGame(levelUrl);
    } catch (e) {
        console.warn("Direct fetch failed, falling back to proxy:", e);
        $("status").textContent = "Direct fetch blocked; using proxy…";

        try {
            await loadGame(`/artifact/${encodeURIComponent(jobId)}/levelSpec`);
            $("status").textContent = "Loaded via proxy.";
        } catch (proxyErr) {
            console.error(proxyErr);
            $("status").textContent = "Could not fetch LevelSpec (proxy failed).";
            $("retry").style.display = "inline-block";
            $("proxy").style.display = "inline-block";

            $("retry").onclick = () => location.reload();
            $("proxy").onclick = async () => {
                $("status").textContent = "Loading via proxy…";
                await loadGame(`/artifact/${encodeURIComponent(jobId)}/levelSpec`);
                $("status").textContent = "Playing (via proxy)";
                $("proxy").style.display = "none";
                $("retry").style.display = "none";
            };
        }
    }
}

main().catch(err => {
    console.error(err);
    $("status").textContent = String(err?.message || err);
});
