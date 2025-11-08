import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
const port = parseInt(process.env.PORT, 10) || 8080;

// CORS: GET + preflight
app.use(cors({ origin: "*", methods: ["GET"], allowedHeaders: ["Content-Type"] }));
app.options("*", cors());

// JSON (future-proofing)
app.use(express.json());

// ESM-safe __dirname + static /status
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use("/status", express.static(path.join(__dirname, "public")));

// Health + root
app.get("/health", (_req, res) => res.status(200).json({ ok: true, service: "ghost-orchestrator" }));
app.get("/",       (_req, res) => res.status(200).json({ service: "ghost-orchestrator", status: "ready" }));

app.listen(port, "0.0.0.0", () => console.log(`orchestrator listening on ${port}`));
