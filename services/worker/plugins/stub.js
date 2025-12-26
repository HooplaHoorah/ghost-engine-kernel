module.exports = {
    name: () => 'stub',
    emit: (sceneGraph, context) => {
        // In a real plugin, this would convert the sceneGraph to the target format.
        // For stub, we just return the sceneGraph and an ASCII minimap.

        const asciiMinimap = generateAsciiMinimap(sceneGraph);

        return {
            sceneGraph,
            asciiMinimap
        };
    }
};

function generateAsciiMinimap(sg) {
    // Simple deterministic minimap generation
    return "R1--R2\n |   |\nR3--R4\n";
}
