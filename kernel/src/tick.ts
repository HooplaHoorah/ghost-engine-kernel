import { Rng } from './rng.js';
import type { InputEvent, KernelEvent, TickResult, WorldEntity, WorldState } from './world.js';

export function tick(prev: WorldState, input: InputEvent | null, rng: Rng): TickResult {
    let state: WorldState = {
        ...prev,
        tick: prev.tick + 1,
        entities: prev.entities.map((e) => ({ ...e, pos: { ...e.pos } })),
        grid: prev.grid.map((row) => [...row]),
        flags: { ...prev.flags },
    };

    const events: KernelEvent[] = [];

    if (input) {
        switch (input.type) {
            case 'MOVE': {
                const ent = state.entities.find((e) => e.id === input.entityId);
                if (ent) {
                    const nx = ent.pos.x + input.dx;
                    const ny = ent.pos.y + input.dy;

                    // Grid bounds check
                    if (ny >= 0 && ny < state.grid.length && nx >= 0 && nx < state.grid[ny]!.length) {
                        const cell = state.grid[ny]![nx];

                        if (cell === '#') {
                            // Blocked
                        } else if (cell === 'D') {
                            // Door
                            if (state.flags['hasKey']) {
                                state.grid[ny]![nx] = '.'; // Open door
                                events.push({ type: 'DOOR_OPENED', x: nx, y: ny });
                                // Update position
                                ent.pos.x = nx;
                                ent.pos.y = ny;
                                events.push({ type: 'MOVED', entityId: ent.id, pos: { ...ent.pos } });
                            } else {
                                // Locked
                            }
                        } else if (cell === 'M') { // Technically M is not in grid anymore unless buildGrid adds it. We rely on Entity list.
                            // But if 'M' was in grid (from old runtime), treat as non-blocking but deadly?
                            // Currently buildGrid does NOT add 'M'.
                            ent.pos.x = nx;
                            ent.pos.y = ny;
                            events.push({ type: 'MOVED', entityId: ent.id, pos: { ...ent.pos } });
                        } else if (cell === '.' || cell === 'P' || cell === 'E' || cell === 'K') {
                            // 'K' is not in grid either in my new buildGrid. 'P' and 'E' are. 'P' is just "floor".
                            ent.pos.x = nx;
                            ent.pos.y = ny;
                            events.push({ type: 'MOVED', entityId: ent.id, pos: { ...ent.pos } });
                        }
                    }
                }
                break;
            }
            case 'DAMAGE': {
                // .. keep existing logic ..
                break;
            }
            case 'SPAWN_ENEMY': {
                // .. keep existing logic ..
                break;
            }
        }
    }

    // Post-move interactions (Pickup keys, collide with enemies)
    const player = state.entities.find(e => e.kind === 'player');
    if (player) {
        // Check collision with other entities
        const others = state.entities.filter(e => e.id !== player.id);
        for (const other of others) {
            if (other.pos.x === player.pos.x && other.pos.y === player.pos.y) {
                if (other.kind === 'pickup' && other.subkind === 'key') {
                    // Collect key
                    state.flags['hasKey'] = true;
                    // Remove key
                    state.entities = state.entities.filter(e => e.id !== other.id);
                    events.push({ type: 'KEY_COLLECTED', keyId: other.id });
                } else if (other.kind === 'enemy') {
                    events.push({ type: 'GAME_OVER', reason: 'Slain by enemy' });
                }
            }
        }

        // Check Exit
        const row = state.grid[player.pos.y];
        if (row) {
            const cell = row[player.pos.x];
            if (cell === 'E') {
                events.push({ type: 'WIN' });
            }
        }
    }

    return { state, events };
}
