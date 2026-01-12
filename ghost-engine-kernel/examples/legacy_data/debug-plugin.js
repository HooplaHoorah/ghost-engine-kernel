const plugin = require('./services/worker/plugins/doom-bridge.js');

const mockSceneGraph = {
    meta: { seed: 202, theme: 'stone' },
    rooms: [
        { id: 'R1', connections: ['R2'] },
        { id: 'R2', connections: ['R1', 'R3'] },
        { id: 'R3', connections: ['R2'] }
    ],
    entities: [
        { id: 'E1', type: 'enemy', roomId: 'R2', props: { archetype: 'imp' } }
    ],
    items: [
        { id: 'I1', type: 'health_potion', roomId: 'R3' }
    ]
};

try {
    const result = plugin.emit(mockSceneGraph, {});
    console.log('Success!', JSON.stringify(result.levelSpec, null, 2));
} catch (e) {
    console.error('Failed!', e.message);
}
