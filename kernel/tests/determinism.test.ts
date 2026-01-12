import { describe, expect, it } from 'vitest';
import { createInitialWorld, type InputEvent } from '../src/world.js';
import { runAndRecord, replay } from '../src/replay.js';

describe('kernel determinism', () => {
    it('same seed + same inputs => identical replay log', () => {
        const seed = 1337;
        const inputs: (InputEvent | null)[] = [
            { type: 'MOVE', entityId: 'player-1', dx: 1, dy: 0 },
            { type: 'SPAWN_ENEMY', at: { x: 2, y: 2 } },
            null,
            { type: 'DAMAGE', entityId: 'enemy-2', amount: 3 } // may no-op; still deterministic
        ];

        const w1 = createInitialWorld(seed);
        const w2 = createInitialWorld(seed);

        const log1 = runAndRecord(w1, inputs);
        const log2 = runAndRecord(w2, inputs);

        expect(log1).toEqual(log2);
        expect(replay(createInitialWorld(seed), log1)).toBe(true);
    });
});
