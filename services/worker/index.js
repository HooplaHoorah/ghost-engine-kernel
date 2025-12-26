const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());

const plugins = {
    stub: require('./plugins/stub'),
    'doom-bridge': require('./plugins/doom-bridge')
};

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const JOBS_TABLE = process.env.JOBS_TABLE_NAME;
const ARTIFACTS_BUCKET = process.env.ARTIFACTS_BUCKET;

const uploadArtifact = async (jobId, name, data) => {
    if (!ARTIFACTS_BUCKET) return null;
    const key = `jobs/${jobId}/${name}`;
    await s3Client.send(new PutObjectCommand({
        Bucket: ARTIFACTS_BUCKET,
        Key: key,
        Body: typeof data === 'string' ? data : JSON.stringify(data),
        ContentType: typeof data === 'string' ? 'text/plain' : 'application/json'
    }));
    return key;
};

const updateJobStatus = async (jobId, state, extras = {}) => {
    if (!JOBS_TABLE) return;
    try {
        const expr = ["set #s = :s", "updatedAt = :u"];
        const names = { "#s": "state" };
        const values = { ":s": state, ":u": new Date().toISOString() };

        Object.keys(extras).forEach((k, i) => {
            expr.push(`#k${i} = :v${i}`);
            names[`#k${i}`] = k;
            values[`:v${i}`] = extras[k];
        });

        await docClient.send(new UpdateCommand({
            TableName: JOBS_TABLE,
            Key: { jobId },
            UpdateExpression: expr.join(', '),
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values
        }));
    } catch (e) {
        console.error("DDB Update Failed", e);
    }
};

// Helper: Send update to Orchestrator
const sendUpdate = async (url, data) => {
    if (!url) return;
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (process.env.INTERNAL_TOKEN) {
            headers['X-INTERNAL-TOKEN'] = process.env.INTERNAL_TOKEN;
        }

        await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
    } catch (e) {
        console.error("Failed to send update url=" + url, e.message);
    }
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// EMF Helper
const logEMF = (metricName, unit, value, dimensions = {}) => {
    const dims = { env: process.env.SimpleEnv || 'dev', service: 'worker', ...dimensions };
    console.log(JSON.stringify({
        "_aws": {
            "Timestamp": Date.now(),
            "CloudWatchMetrics": [{
                "Namespace": "GhostEngine",
                "Dimensions": [Object.keys(dims)],
                "Metrics": [{ "Name": metricName, "Unit": unit }]
            }]
        },
        ...dims,
        [metricName]: value
    }));
};

const runStep = async (name, fn, context, callbackUrl, jobId) => {
    const start = Date.now();
    // We don't send "running" anymore to /step? Or strict "1 completed event"?
    // Instructions say: "Prefer sending 1 completed event per step"
    // So we skip the start event? Or we just assume orchestator doesn't need start time?
    // "Include: startedAt, endedAt, durationMs" in the completed event.

    // We can still send running updates if we want UI feedback, but idempotency relies on unique stepId.
    // Use name as part of stepId. If we send "running" it has same stepId? That would fail idempotency if key is stepId.
    // So let's only send 'done' event with full stats.

    // await sendUpdate(callbackUrl, {
    //    step: { name, state: 'running', startedAt: new Date().toISOString() }
    // });

    try {
        const result = await fn(context);
        const end = Date.now();
        const duration = end - start;

        logEMF("step_duration_ms", "Milliseconds", duration, { stepName: name });

        const startedAt = new Date(start).toISOString();
        const endedAt = new Date(end).toISOString();

        await sendUpdate(callbackUrl, {
            step: {
                stepId: `${jobId}:${name}`,
                name,
                state: 'done',
                startedAt,
                endedAt,
                durationMs: duration,
                summary: result.summary
            }
        });
        return result.data;
    } catch (e) {
        console.error(`Step ${name} failed:`, e);
        // Failures might be retryable, but here we likely fail the job.
        // We can emit a failed step event.
        await sendUpdate(callbackUrl, {
            step: {
                stepId: `${jobId}:${name}`,
                name,
                state: 'failed',
                error: e.message
            }
        });
        throw e;
    }
};

app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));

app.post('/process', async (req, res) => {
    const startJob = Date.now();
    const { jobId, prompt, plugin: pluginName, params, callbackUrl, seed } = req.body;
    console.log(`[Worker] Processing ${jobId} (plugin: ${pluginName})`);

    const plugin = plugins[pluginName] || plugins.stub;

    try {
        await updateJobStatus(jobId, 'running');

        // Step 1: Parse Prompt
        const parsed = await runStep('parse_prompt', async () => {
            await sleep(500); // Simulate parsing
            return {
                summary: "Parsed instructions",
                data: { theme: params?.theme || 'generic', difficulty: params?.difficulty || 'normal' }
            };
        }, {}, callbackUrl, jobId);

        // Step 2: Select Assets
        const assets = await runStep('select_assets', async () => {
            await sleep(300);
            return {
                summary: "Selected 2 enemy archetypes",
                data: { enemies: ['skeleton', 'slime'] }
            };
        }, {}, callbackUrl, jobId);

        // Step 3: Compose Scene Graph
        const sceneGraph = await runStep('compose_scene_graph', async () => {
            await sleep(600);
            // Create dummy scene graph
            const sg = {
                meta: {
                    seed: params?.seed || seed || 123,
                    theme: parsed.theme,
                    difficulty: parsed.difficulty,
                    size: params?.size || 'medium'
                },
                rooms: [
                    { id: 'R1', name: 'Entrance', tags: ['start'], connections: ['R2'] },
                    { id: 'R2', name: 'Corridor', tags: [], connections: ['R1', 'R3', 'R4'] },
                    { id: 'R3', name: 'Chamber', tags: ['loot'], connections: ['R2'] },
                    { id: 'R4', name: 'Boss Room', tags: ['boss'], connections: ['R2'] }
                ],
                entities: [
                    { id: 'E1', type: assets.enemies[0], roomId: 'R2', props: { aggressive: true } },
                    { id: 'E2', type: assets.enemies[1], roomId: 'R3', props: { hidden: true } }
                ],
                items: [
                    { id: 'I1', type: 'health_potion', roomId: 'R3' }
                ]
            };
            return { summary: `Built graph with ${sg.rooms.length} rooms`, data: sg };
        }, {}, callbackUrl, jobId);

        // Step 4: Emit (Plugin)
        const output = await runStep('emit_level_stub', async () => {
            // Logic would typically live in plugin.emit
            const result = plugin.emit(sceneGraph, {});
            return { summary: "Emitted artifacts", data: result };
        }, {}, callbackUrl, jobId);

        // Slice 2: Persistence
        let finalOutput = output;
        if (ARTIFACTS_BUCKET) {
            const s3Keys = {};
            if (output.sceneGraph) {
                s3Keys.sceneGraphS3Key = await uploadArtifact(jobId, 'sceneGraph.json', output.sceneGraph);
            }
            if (output.asciiMinimap) {
                s3Keys.asciiMinimapS3Key = await uploadArtifact(jobId, 'asciiMinimap.txt', output.asciiMinimap);
            }
            if (output.levelSpec) {
                s3Keys.levelSpecS3Key = await uploadArtifact(jobId, 'levelSpec.json', output.levelSpec);
            }
            if (output.levelPreviewAscii) {
                s3Keys.levelPreviewAsciiS3Key = await uploadArtifact(jobId, 'levelPreviewAscii.txt', output.levelPreviewAscii);
            }
            finalOutput = { ...s3Keys }; // Replace content with keys

            // Mark done in DDB
            await updateJobStatus(jobId, 'done', { result: finalOutput });
        } else {
            // Mark done in DDB
            await updateJobStatus(jobId, 'done', { result: finalOutput });
        }

        // Enrich output with metadata for response
        finalOutput.pluginVersion = "0.1.0"; // Hardcoded for Slice 5

        const jobDuration = Date.now() - startJob;
        logEMF("job_duration_ms", "Milliseconds", jobDuration);

        res.json({ ok: true, output: finalOutput });

    } catch (e) {
        console.error("Job failed", e);
        await updateJobStatus(jobId, 'failed', { error: e.message });
        logEMF("jobs_failed_count", "Count", 1);
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => console.log('worker running on port ' + PORT));
