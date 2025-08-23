
// Import the express library to create routes
import express from "express";
// Import the authentication middleware to protect routes
import { requireAuth } from "../middleware/authMiddleware.js";
// Import the message controller functions
import { sendMessage, getMessages } from "../controllers/messageController.js";


// Create a new router instance
const router = express.Router();


// Route to send a new message (protected)
router.post("/", requireAuth, sendMessage);
// Route to get all messages for a conversation (protected)
router.get("/:conversationId", requireAuth, getMessages);


// Export the router to be used in the main app
export default router;
