
// Import the express library to create routes
import express from "express";
// Import the authentication middleware to protect routes
import { requireAuth } from "../middleware/authMiddleware.js";


// Create a new router instance
const router = express.Router();


// Import the onlineUsers map directly from the socket module
import { onlineUsers } from "../socket/socket.js";




// Route to get the list of currently online users (protected)
router.get("/online-users", requireAuth, (req, res) => {
  // Respond with an array of online user IDs
  res.json({ online: Array.from(onlineUsers.keys()) });
});


// Export the router to be used in the main app
export default router;
