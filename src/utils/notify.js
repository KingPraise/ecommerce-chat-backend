import Notification from "../models/Notification.js";

// persist + emit
export async function notify(io, userId, type, data) {
  const notif = await Notification.create({ user: userId, type, data });

  // emit directly to user's socket room
  io.to(userId.toString()).emit("notification", {
    id: notif._id,
    type,
    data,
    createdAt: notif.createdAt,
  });

  return notif;
}
