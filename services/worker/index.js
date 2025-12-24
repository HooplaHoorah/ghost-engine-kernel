const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));

app.post('/process', async (req, res) => {
    const { id, prompt } = req.body;
    console.log(`[Worker] Received job ${id}: "${prompt}"`);

    // Simulate work
    setTimeout(() => {
        console.log(`[Worker] Finished job ${id}`);
        // In a real system, we'd update DB or callback
    }, 2000);

    res.status(200).json({ status: 'accepted', message: 'Work started' });
});

app.listen(PORT, () => console.log('worker running on port ' + PORT));
