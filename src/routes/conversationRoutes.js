
// Import the express library to create routes
import express from "express";
// Import the authentication middleware to protect routes
import { requireAuth } from "../middleware/authMiddleware.js";
// Import the conversation controller functions
import {
  startConversation,
  getUserConversations,
} from "../controllers/conversationController.js";


// Create a new router instance
const router = express.Router();


// Route to start a new conversation (protected)
router.post("/", requireAuth, startConversation);
// Route to get all conversations for the logged-in user (protected)
router.get("/", requireAuth, getUserConversations);


// Export the router to be used in the main app
export default router;
