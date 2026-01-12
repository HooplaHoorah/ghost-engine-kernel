// runtime.js - Minimal GE Doom runtime loader MVP
// Usage: node runtime.js --levelSpec <path>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import readlineSync from 'readline-sync';
import chalk from 'chalk';

// Resolve schema path (relative to this file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, '../services/worker/schemas/levelspec.v0.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

/** LevelSpecLoader ------------------------------------------------------- */
function loadLevelSpec(filePath) {
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const spec = JSON.parse(raw);
        const ajv = new Ajv({ allErrors: true });
        const validate = ajv.compile(schema);
        const valid = validate(spec);
        if (!valid) {
            const msgs = validate.errors.map(e => `${e.instancePath} ${e.message}`).join('; ');
            throw new Error(`LevelSpec validation failed: ${msgs}`);
        }
        return spec;
    } catch (e) {
        throw new Error(`Failed to load LevelSpec: ${e.message}`);
    }
}

/** LevelBuilder ---------------------------------------------------------- */
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
    for (const conn of spec.connections) {
        carveDoor(conn);
    }

    // Place entities
    const entityMap = {};
    for (const e of spec.entities) {
        const char = e.type === 'key' ? 'K' : e.type === 'enemy' ? 'M' : 'I';
        const gx = e.x + 1;
        const gy = e.y + 1;
        grid[gy][gx] = char;
        entityMap[`${gx},${gy}`] = { ...e, char };
    }

    // Place spawn and exit
    const sp = spec.spawn;
    grid[sp.y + 1][sp.x + 1] = 'P';
    const ex = spec.exit;
    grid[ex.y + 1][ex.x + 1] = 'E';

    return { grid, spec, entityMap };
}

/** Simple game loop ------------------------------------------------------ */
function startGame(level) {
    let { grid, spec, entityMap } = level;
    let playerPos = { x: spec.spawn.x + 1, y: spec.spawn.y + 1 };
    let hasKey = false;
    const dirs = { w: [0, -1], a: [-1, 0], s: [0, 1], d: [1, 0] };

    function render() {
        console.clear();
        console.log(chalk.green('--- GE Doom MVP ---'));
        for (let y = 0; y < grid.length; y++) {
            let line = '';
            for (let x = 0; x < grid[y].length; x++) {
                const cell = grid[y][x];
                if (x === playerPos.x && y === playerPos.y) {
                    line += chalk.yellow('P');
                } else if (cell === '#') {
                    line += chalk.gray('#');
                } else if (cell === 'D') {
                    line += chalk.red('D');
                } else if (cell === 'K') {
                    line += chalk.cyan('K');
                } else if (cell === 'M') {
                    line += chalk.magenta('M');
                } else if (cell === 'E') {
                    line += chalk.green('E');
                } else {
                    line += cell;
                }
            }
            console.log(line);
        }
        console.log('\nControls: W A S D to move. Q to quit.');
        if (hasKey) console.log(chalk.cyan('You have the key'));
    }

    while (true) {
        render();
        const key = readlineSync.keyIn('', { hideEchoBack: true, limit: 'wasdq' });
        if (key === 'q') {
            console.log('Quit.');
            break;
        }
        const [dx, dy] = dirs[key];
        const nx = playerPos.x + dx;
        const ny = playerPos.y + dy;
        const target = grid[ny][nx];
        if (target === '#') continue; // wall
        if (target === 'D') {
            if (hasKey) {
                // open door
                grid[ny][nx] = '.';
                console.log('You unlocked a door.');
            } else {
                console.log('The door is locked. Find the key.');
                continue;
            }
        }
        // Move player
        playerPos = { x: nx, y: ny };
        // Interactions
        if (target === 'K') {
            hasKey = true;
            console.log('Picked up a key!');
        }
        if (target === 'M') {
            console.log('You were slain by an enemy. Game over.');
            break;
        }
        if (target === 'E') {
            console.log('You reached the exit. You win!');
            break;
        }
    }
}

/** CLI entry ------------------------------------------------------------ */
function main() {
    const args = process.argv.slice(2);
    const levelSpecIdx = args.indexOf('--levelSpec');
    if (levelSpecIdx === -1 || levelSpecIdx + 1 >= args.length) {
        console.error('Usage: node runtime.js --levelSpec <path>');
        process.exit(1);
    }
    const levelPath = args[levelSpecIdx + 1];
    try {
        const spec = loadLevelSpec(levelPath);
        const level = buildLevel(spec);
        startGame(level);
    } catch (e) {
        console.error(chalk.red('Error loading level:'), e.message);
        console.log('Returning to menu...');
        // In a real game you would switch to the main menu screen.
        process.exit(0);
    }
}

main();
