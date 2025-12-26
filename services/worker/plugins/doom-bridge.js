const Ajv = require("ajv");
const schema = require("../schemas/levelspec.v0.schema.json");

function mulberry32(a) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const ajv = new Ajv();
const validate = ajv.compile(schema);

module.exports = {
    name: () => 'doom-bridge',
    emit: (sceneGraph, context) => {
        // 1. Initialize PRNG with seed
        const seed = sceneGraph.meta.seed || 12345;
        const rng = mulberry32(seed);
        const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min;

        // 2. Map Rooms
        // We'll place rooms in a simple grid for determinism based on index
        // Layout: logical grid, just expanding outwards
        const rooms = sceneGraph.rooms.map((r, i) => {
            // Simple layout: linear or spiral? 
            // Let's do linear for simplicity of V0
            // Or slightly randomized grid coords based on seed + index

            // Actually, let's just make them 6x4 and place them sequentially 
            // with some gap.
            const width = 6;
            const height = 4;
            const gap = 2;

            // Simple "dungeon line"
            return {
                id: r.id,
                x: i * (width + gap),
                y: 0,
                w: width,
                h: height,
                theme: sceneGraph.meta.theme || 'stone'
            };
        });

        // 3. Connections
        const connections = [];
        const entities = [];
        // We need to infer connections from sceneGraph.rooms[].connections
        // This is often an adjacency list.
        // Spec example: { "from": "r1", "to": "r2", "type": "door", "locked": true, "keyId": "k1" }

        // To avoid duplicates (R1->R2 vs R2->R1), we can sort IDs
        const processedEdges = new Set();

        sceneGraph.rooms.forEach(room => {
            if (!room.connections) return;
            room.connections.forEach(targetId => {
                const [u, v] = [room.id, targetId].sort();
                const edgeKey = `${u}-${v}`;
                if (processedEdges.has(edgeKey)) return;
                processedEdges.add(edgeKey);

                // For Slice 6, let's make the door to the last room (Exit) locked if possible
                const isExitDoor = (v === sceneGraph.rooms[sceneGraph.rooms.length - 1].id);
                const locked = isExitDoor && sceneGraph.rooms.length > 2;

                connections.push({
                    from: u,
                    to: v,
                    type: 'door',
                    locked: locked,
                    keyId: locked ? 'k1' : undefined
                });

                // If it's a locked door, we need a key entity in a different room
                if (locked) {
                    // We'll place a key in room 0 (Spawn) for simplicity or room 1
                    const keyRoomId = sceneGraph.rooms[0].id;
                    entities.push({
                        id: 'k1',
                        type: 'key',
                        roomId: keyRoomId,
                        x: 5, // absolute or relative? Mapping rules say absolute preferred
                        y: 2
                    });
                }
            });
        });

        // 4. Entities & Items
        if (sceneGraph.entities) {
            sceneGraph.entities.forEach(e => {
                entities.push({
                    id: e.id,
                    type: 'enemy',
                    subtype: e.props?.archetype || 'imp',
                    roomId: e.roomId,
                    x: randInt(1, 4), // Logic to stay inside room bounds
                    y: randInt(1, 2)
                });
            });
        }

        if (sceneGraph.items) {
            sceneGraph.items.forEach(item => {
                // Check if it's a key for a locked door? 
                // For now just generic item
                entities.push({
                    id: item.id,
                    type: 'item', // or 'key' if type is keycard
                    subtype: item.type,
                    roomId: item.roomId,
                    x: randInt(1, 4),
                    y: randInt(1, 2)
                });
            });
        }

        // 5. Spawn & Exit
        // Naively: Spawn in first room, Exit in last room
        const spawnRx = rooms.length > 0 ? rooms[0] : null;
        const exitRx = rooms.length > 0 ? rooms[rooms.length - 1] : null;

        const levelSpec = {
            version: "0",
            seed: seed,
            units: "tile",
            tiles: { size: 64 },
            rooms: rooms,
            connections: connections,
            entities: entities,
            spawn: spawnRx ? { roomId: spawnRx.id, x: 1, y: 1 } : null,
            exit: exitRx ? { roomId: exitRx.id, x: 1, y: 1 } : null
        };

        // 6. Generate Preview
        // Simple text based preview of room layout
        const asciiPreview = rooms.map(r => `[${r.id}]`).join("--");

        // 7. Validate
        const valid = validate(levelSpec);
        if (!valid) {
            console.error("LevelSpec validation failed:", validate.errors);
            throw new Error("Generated LevelSpec is invalid: " + JSON.stringify(validate.errors));
        }

        return {
            sceneGraph, // Pass through original or modified sceneGraph
            levelSpec,
            levelPreviewAscii: asciiPreview,
            // We still want minimap for the main UI? Or doom-bridge replaces stub?
            // stub returned asciiMinimap. Providing both is good.
            asciiMinimap: asciiPreview
        };
    }
};
