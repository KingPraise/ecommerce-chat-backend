import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// We'll import onlineUsers map directly
import { onlineUsers } from "../socket/socket.js";



router.get("/online-users", requireAuth, (req, res) => {
  res.json({ online: Array.from(onlineUsers.keys()) });
});

export default router;
