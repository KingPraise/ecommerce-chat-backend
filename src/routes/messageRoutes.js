import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

// REST API routes for messages
router.post("/", requireAuth, sendMessage);
router.get("/:conversationId", requireAuth, getMessages);

export default router;
