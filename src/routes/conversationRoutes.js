import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  startConversation,
  getUserConversations,
} from "../controllers/conversationController.js";

const router = express.Router();

router.post("/", requireAuth, startConversation);
router.get("/", requireAuth, getUserConversations);

export default router;
