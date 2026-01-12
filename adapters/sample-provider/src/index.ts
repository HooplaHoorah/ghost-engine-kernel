import { Rng } from '@ghost-engine/kernel';
import type { LevelspecV0 } from '@ghost-engine/protocol';

export function generateLevelSpec(prompt: string, seed: number): LevelspecV0 {
    const rng = new Rng(seed);

    const w = rng.int(8, 15);
    const h = rng.int(8, 15);

    // Generate a single room for simplicity in this MVP provider
    const rooms: LevelspecV0['rooms'] = [
        { id: 'main-hall', x: 0, y: 0, w, h, theme: 'default' }
    ];

    const entities: NonNullable<LevelspecV0['entities']> = [];

    // Place random enemies
    const enemyCount = rng.int(1, 3);
    for (let i = 0; i < enemyCount; i++) {
        entities.push({
            id: `enemy-${i}`,
            type: 'enemy',
            roomId: 'main-hall',
            x: rng.int(2, w - 2),
            y: rng.int(2, h - 2)
        });
    }

    // Place random keys
    entities.push({
        id: 'key-1',
        type: 'key',
        roomId: 'main-hall',
        x: rng.int(2, w - 2),
        y: rng.int(2, h - 2)
    });

    return {
        version: '0',
        seed,
        units: 'tile',
        tiles: { size: 32 },
        rooms,
        connections: [],
        entities,
        spawn: {
            roomId: 'main-hall',
            x: 1,
            y: 1
        },
        exit: {
            roomId: 'main-hall',
            x: w - 2,
            y: h - 2
        },
        // Meta fields
        prompt // Adding extra field not in schema strictly but allowed by additionalProperties
    } as LevelspecV0;
}
