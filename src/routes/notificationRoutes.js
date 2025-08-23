
// Import the Router function from express to create routes
import { Router } from "express";
// Import the authentication middleware to protect routes
import { requireAuth } from "../middleware/authMiddleware.js";
// Import the Notification model for interacting with notifications
import Notification from "../models/Notification.js";


// Create a new router instance
const router = Router();


// Route to get all notifications for the logged-in user (protected)
router.get("/", requireAuth, async (req, res) => {
  // Find notifications for the user, sorted by newest first
  const notifs = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  // Respond with the list of notifications
  res.json(notifs);
});


// Route to mark a notification as read (protected)
router.post("/:id/read", requireAuth, async (req, res) => {
  // Update the notification's read status to true for the given user and notification ID
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true }
  );
  // Respond with a success message
  res.json({ success: true });
});


// Export the router to be used in the main app
export default router;
