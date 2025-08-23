
// Import dotenv to load environment variables from .env file
import "dotenv/config";
// Import http to create the HTTP server
import http from "http";
// Import the Express app instance
import app from "./app.js";
// Import the function to connect to MongoDB
import { connectDB } from "./config/db.js";
// Import the function to initialize Socket.IO
import { initSocket } from "./socket/socket.js";


// Set the server port from environment or default to 4000
const port = process.env.PORT || 4000;


// 1️⃣ Create HTTP server from the Express app
const server = http.createServer(app);


// 2️⃣ Initialize Socket.IO on top of the HTTP server
const io = initSocket(server);


// 3️⃣ Share the io instance with the app (for controllers/middleware use)
app.set("io", io);


// Function to start the server and connect to the database
const start = async () => {
  try {
    // Connect to MongoDB using the provided URI
    await connectDB(process.env.MONGODB_URI);
    // Start the HTTP server and listen on the specified port
    server.listen(port, () =>
      console.log(`🚀 Server running at http://localhost:${port}`)
    );
  } catch (err) {
    // Log and exit if server fails to start
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
};


// Start the server
start();
