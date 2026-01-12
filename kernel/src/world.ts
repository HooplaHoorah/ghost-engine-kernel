import type { LevelspecV0 } from '@ghost-engine/protocol';
import { buildGrid } from './grid.js';

export type Vec2 = { x: number; y: number };

export type EntityId = string;

export type WorldEntity = {
    id: EntityId;
    kind: 'player' | 'enemy' | 'pickup' | 'prop';
    subkind?: string; // e.g. 'key'
    pos: Vec2;
    hp?: number;
};

export type WorldState = {
    /** Version of the kernel state shape (not the protocol version) */
    version: '0.1.0';
    tick: number;
    /** seed used to initialize RNG; stored for provenance */
    seed: number;
    entities: WorldEntity[];
    /** 2D grid of static map. outer array is Y, inner is X. char codes */
    grid: string[][];

    // Game state flags
    flags: Record<string, boolean>; // e.g. { 'hasKey': true }
};

export type InputEvent =
    | { type: 'MOVE'; entityId: EntityId; dx: number; dy: number }
    | { type: 'DAMAGE'; entityId: EntityId; amount: number }
    | { type: 'SPAWN_ENEMY'; at: Vec2 }
    | { type: 'INTERACT'; entityId: EntityId }; // added for doors?

export type KernelEvent =
    | { type: 'MOVED'; entityId: EntityId; pos: Vec2 }
    | { type: 'DAMAGED'; entityId: EntityId; hp: number }
    | { type: 'SPAWNED'; entityId: EntityId }
    | { type: 'DOOR_OPENED'; x: number; y: number }
    | { type: 'KEY_COLLECTED'; keyId: string }
    | { type: 'GAME_OVER'; reason: string }
    | { type: 'WIN' };

export type TickResult = {
    state: WorldState;
    events: KernelEvent[];
};

export function createInitialWorld(seed: number, level?: LevelspecV0): WorldState {
    let grid: string[][] = [];
    let entities: WorldEntity[] = [];

    if (level) {
        grid = buildGrid(level);
        if (level.spawn) {
            entities.push({ id: 'player-1', kind: 'player', pos: { x: level.spawn.x + 1, y: level.spawn.y + 1 }, hp: 100 });
        }
        if (level.entities) {
            for (const e of level.entities) {
                entities.push({
                    id: e.id,
                    kind: e.type === 'key' ? 'pickup' : e.type === 'enemy' ? 'enemy' : 'prop',
                    subkind: e.type,
                    pos: { x: e.x + 1, y: e.y + 1 },
                    hp: e.type === 'enemy' ? 10 : undefined
                });
            }
        }
    } else {
        // Default/Test world
        grid = [['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']];
        entities = [{ id: 'player-1', kind: 'player', pos: { x: 1, y: 1 }, hp: 100 }];
    }

    return {
        version: '0.1.0',
        tick: 0,
        seed,
        entities,
        grid,
        flags: {},
    };
}
