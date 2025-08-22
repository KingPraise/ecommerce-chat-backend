import "dotenv/config";
import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket/socket.js";

const port = process.env.PORT || 4000;

// 1️⃣ Create HTTP server from Express
const server = http.createServer(app);

// 2️⃣ Init socket on top of HTTP server
const io = initSocket(server);

// 3️⃣ Share io with app (for controllers/middleware use)
app.set("io", io);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    server.listen(port, () =>
      console.log(`🚀 Server running at http://localhost:${port}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
};

start();
