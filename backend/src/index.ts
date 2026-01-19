import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import projectRoutes from "./routes/project";
import skillRoutes from "./routes/skill";
import searchRoutes from "./routes/search";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://my-api-playground-sigma.vercel.app",
  "https://my-api-playground-pf37.vercel.app",
  "https://my-api-playground-lzxf.onrender.com",
  "https://my-api-playground-1.onrender.com"
];

// CORS configuration - Allow all origins
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("[Health] GET /health - OK");
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/projects", projectRoutes);
app.use("/skills", skillRoutes);
app.use("/search", searchRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Error]", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.path}`);
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Server running at http://0.0.0.0:${PORT}`);
  console.log(`✓ Health endpoint: http://0.0.0.0:${PORT}/health`);
});
