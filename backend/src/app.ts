import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err: any, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;