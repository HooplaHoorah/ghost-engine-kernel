const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));

app.post('/process', async (req, res) => {
    const { jobId, prompt } = req.body;
    console.log(`[Worker] Received job ${jobId}: "${prompt}"`);

    // Simulate work (e.g., GPU inference)
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log(`[Worker] Finished job ${jobId}`);

    // Return result to Orchestrator
    res.status(200).json({
        jobId,
        ok: true,
        output: {
            image: `https://fake-cdn.com/${jobId}.png`,
            seed: 12345
        }
    });
});

app.listen(PORT, () => console.log('worker running on port ' + PORT));
