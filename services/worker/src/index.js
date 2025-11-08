import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    methods: ["GET"],
  })
);

app.options("*", cors());

app.use((req, res, next) => {
  if (req.method !== "GET") {
    res.set("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }
  next();
});

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, svc: "worker" });
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`worker listening on ${port}`);
});
