import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import {
    createInitialWorld,
    tick,
    Rng,
    type WorldState,
    type InputEvent,
    type KernelEvent
} from '@ghost-engine/kernel';
import type { LevelspecV0 } from '@ghost-engine/protocol';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal Loader
function loadLevelSpec(filePath: string): LevelspecV0 {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as LevelspecV0;
}

function render(state: WorldState) {
    console.clear();
    console.log(chalk.green('--- GE Doom Refactored (Kernel) ---'));
    console.log(`Tick: ${state.tick} | Seed: ${state.seed}`);

    // Create a composite buffer for rendering
    // Kernel has grid, but entities overlay grid.
    const displayGrid = state.grid.map(row => [...row]);

    // Overlay entities
    for (const ent of state.entities) {
        const row = displayGrid[ent.pos.y];
        if (row && ent.pos.x < row.length) {
            let char = '?';
            if (ent.kind === 'player') char = chalk.yellow('P');
            else if (ent.kind === 'enemy') char = chalk.magenta('M');
            else if (ent.kind === 'pickup' && ent.subkind === 'key') char = chalk.cyan('K');
            else if (ent.kind === 'prop') char = 'I';

            row[ent.pos.x] = char;
        }
    }

    for (const row of displayGrid) {
        console.log(row.join('').replace(/#/g, chalk.gray('#')).replace(/D/g, chalk.red('D')).replace(/E/g, chalk.green('E')));
    }
}

function main() {
    const args = process.argv.slice(2);
    const levelSpecIdx = args.indexOf('--levelSpec');
    if (levelSpecIdx === -1 || levelSpecIdx + 1 >= args.length) {
        console.error('Usage: ge-doom --levelSpec <path>');
        process.exit(1);
    }
    const levelPath = args[levelSpecIdx + 1];
    if (!levelPath) {
        console.error('Missing level path');
        process.exit(1);
    }
    const spec = loadLevelSpec(levelPath);

    // Initialize Kernel
    let state = createInitialWorld(spec.seed, spec);
    const rng = new Rng(spec.seed);

    // Render loop
    while (true) {
        render(state);

        const key = readlineSync.keyIn('', { hideEchoBack: true, limit: 'wasdq' });
        if (key === 'q') break;

        const player = state.entities.find(e => e.kind === 'player');
        if (!player) {
            console.log("Player gone!"); // Should not happen unless dead/removed
            break;
        }

        const dirs: Record<string, [number, number]> = { w: [0, -1], a: [-1, 0], s: [0, 1], d: [1, 0] };

        if (dirs[key]) {
            const [dx, dy] = dirs[key];

            const input: InputEvent = {
                type: 'MOVE',
                entityId: player.id,
                dx,
                dy
            };

            const res = tick(state, input, rng);
            state = res.state;

            // Handle events for UI feedback
            for (const ev of res.events) {
                if (ev.type === 'KEY_COLLECTED') {
                    // readlineSync captures input, so clean logs might be messy.
                    // Ideally we log in render() based on flag, but this works for MVP.
                    console.log(chalk.cyan("Picked up Key!"));
                    readlineSync.keyInPause('Press any key to continue...');
                }
                if (ev.type === 'DOOR_OPENED') {
                    // console.log("Opened door.");
                }
                if (ev.type === 'GAME_OVER') {
                    console.log(chalk.red("GAME OVER"));
                    process.exit(0);
                }
                if (ev.type === 'WIN') {
                    console.log(chalk.green("YOU WIN!"));
                    process.exit(0);
                }
            }
        }
    }
}

main();
