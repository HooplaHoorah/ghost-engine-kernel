import type { LevelspecV0 } from '@ghost-engine/protocol';

export function buildGrid(spec: LevelspecV0): string[][] {
    // Determine grid extents
    let maxX = 0;
    let maxY = 0;
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
                grid[y + 1]![x + 1] = '.'; // offset by 1 for outer border
            }
        }
    }

    // Carve doors from connections
    if (spec.connections) {
        for (const conn of spec.connections) {
            const from = spec.rooms.find((r) => r.id === conn.from);
            const to = spec.rooms.find((r) => r.id === conn.to);
            if (!from || !to) continue;

            // Determine overlap on x or y axis
            const xOverlap = Math.max(0, Math.min(from.x + from.w, to.x + to.w) - Math.max(from.x, to.x));
            const yOverlap = Math.max(0, Math.min(from.y + from.h, to.y + to.h) - Math.max(from.y, to.y));

            if (xOverlap > 0) {
                // vertical shared wall
                const doorX = Math.max(from.x, to.x) + Math.floor(xOverlap / 2);
                const doorY = from.y + from.h === to.y ? from.y + from.h : to.y + to.h; // bottom of upper room
                grid[doorY + 1]![doorX + 1] = conn.locked ? 'D' : '.'; // D = locked door
            } else if (yOverlap > 0) {
                // horizontal shared wall
                const doorY = Math.max(from.y, to.y) + Math.floor(yOverlap / 2);
                const doorX = from.x + from.w === to.x ? from.x + from.w : to.x + to.w; // right side of left room
                grid[doorY + 1]![doorX + 1] = conn.locked ? 'D' : '.';
            } else {
                // No direct adjacency – create a simple corridor of length 1 between centers
                const cx1 = Math.floor(from.x + from.w / 2);
                const cy1 = Math.floor(from.y + from.h / 2);
                const cx2 = Math.floor(to.x + to.w / 2);
                const cy2 = Math.floor(to.y + to.h / 2);
                const doorX = Math.floor((cx1 + cx2) / 2);
                const doorY = Math.floor((cy1 + cy2) / 2);
                grid[doorY + 1]![doorX + 1] = conn.locked ? 'D' : '.';
            }
        }
    }

    if (spec.exit) {
        grid[spec.exit.y + 1]![spec.exit.x + 1] = 'E';
    }

    if (spec.spawn) {
        grid[spec.spawn.y + 1]![spec.spawn.x + 1] = 'P';
    }

    return grid;
}
