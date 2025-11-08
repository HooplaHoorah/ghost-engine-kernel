// services/orchestrator/index.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();

// Always respect Cloud Run's injected port
const port = parseInt(process.env.PORT, 10) || 8080;

// CORS: GET only + preflight
app.use(
  cors({
    origin: '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
  })
);
app.options('*', cors());

// Parse JSON bodies (future-proofing)
app.use(express.json());

// ESM-safe __dirname and static /status dashboard
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/status', express.static(path.join(__dirname, 'public')));

// --- Agent toggle (optional UX) ---
const AGENT_MODE = (process.env.AGENT_MODE || 'off').toLowerCase();

// Health (Cloud Run probe)
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'ghost-orchestrator' });
});

// Root
app.get('/', (_req, res) => {
  res.status(200).json({ service: 'ghost-orchestrator', status: 'ready' });
});

// Agent ping (404 when off, 200 when on)
app.get('/agent/ping', (_req, res) => {
  if (AGENT_MODE === 'on' || AGENT_MODE === 'true') {
    return res.status(200).json({ ok: true, agent: 'on' });
  }
  return res.status(404).json({ ok: false, agent: 'off' });
});

// Cloud Run requires binding to 0.0.0.0:$PORT
app.listen(port, '0.0.0.0', () => {
  console.log(`orchestrator listening on ${port} (agent=${AGENT_MODE})`);
});
