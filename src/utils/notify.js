
// Import the Notification model for creating notification records
import Notification from "../models/Notification.js";


// Function to persist a notification and emit it via socket.io
export async function notify(io, userId, type, data) {
  // Create a new notification in the database
  const notif = await Notification.create({ user: userId, type, data });

  // Emit the notification directly to the user's socket room
  io.to(userId.toString()).emit("notification", {
    id: notif._id,
    type,
    data,
    createdAt: notif.createdAt,
  });

  // Return the created notification object
  return notif;
}
