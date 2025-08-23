
// Import express for creating the app and handling routes
import express from "express";
// Import cors for enabling Cross-Origin Resource Sharing
import cors from "cors";
// Import helmet for setting secure HTTP headers
import helmet from "helmet";
// Import morgan for HTTP request logging
import morgan from "morgan";
// Import path for working with file and directory paths
import path from "path";
// Import fileURLToPath to get the current file path in ES modules
import { fileURLToPath } from "url";


// Import route modules for different API endpoints
import authRoutes from "./routes/authRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import presenceRoutes from "./routes/presenceRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";


// Create the Express application instance
const app = express();


// 🛠 Serve uploaded files statically from the /uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


// 🔐 Apply security, CORS, body parsing, and logging middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({  origin: "*", credentials: true })); // Allow all origins (for testing)
app.use(express.json({ limit: "1mb" })); // Parse JSON bodies up to 1MB
app.use(morgan("dev")); // Log HTTP requests


// 🚏 Mount API route handlers
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/conversations", conversationRoutes); // Conversation routes
app.use("/api/messages", messageRoutes); // Message routes
app.use("/api/uploads", uploadRoutes); // File upload routes
app.use("/api/presence", presenceRoutes); // Presence/online users routes


// Health check endpoint
app.get("/health", (_req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "dev" })
);


// Export the app instance for use in server.js or tests
export default app;
