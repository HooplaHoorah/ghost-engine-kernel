import express from "express";
const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, svc: "worker" });
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`worker listening on ${port}`);
});
