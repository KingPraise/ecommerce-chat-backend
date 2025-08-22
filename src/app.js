import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import presenceRoutes from "./routes/presenceRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

// 🛠 for serving uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// 🔐 security + logging + body parsing
app.use(helmet());
app.use(cors({  origin: "*", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// 🚏 API routes
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/presence", presenceRoutes);

// Health check
app.get("/health", (_req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "dev" })
);

export default app;
