import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const notifs = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notifs);
});

router.post("/:id/read", requireAuth, async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true }
  );
  res.json({ success: true });
});

export default router;
