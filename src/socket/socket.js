import { Server } from "socket.io";
import Message from "../models/Message.js"; // ✅ import Message model

// Map to track online users { userId: socketId }
const onlineUsers = new Map();

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for testing
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // ensure both work for testing
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Step 1: Register userId
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`✅ User ${userId} registered with socket ${socket.id}`);
      socket.broadcast.emit("userOnline", { userId });
    });

    // Step 2: Handle message delivery
    socket.on("sendMessage", ({ conversationId, senderId, recipientId, text }) => {
      console.log(`📨 Message from ${senderId} to ${recipientId}: ${text}`);
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", {
          conversationId,
          senderId,
          text,
          createdAt: new Date(),
        });
      }
    });

    // Step 2b: Typing indicators
    socket.on("typing", ({ conversationId, senderId, recipientId }) => {
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("typing", { conversationId, senderId });
      }
    });

    socket.on("stopTyping", ({ conversationId, senderId, recipientId }) => {
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("stopTyping", { conversationId, senderId });
      }
    });

    // Step 3: Disconnect cleanup
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          socket.broadcast.emit("userOffline", { userId });
        }
      }
    });

    // Step 4: Read receipts
    socket.on("markRead", async ({ conversationId, userId, recipientId }) => {
      try {
        await Message.updateMany(
          { conversation: conversationId, readBy: { $ne: userId } },
          { $push: { readBy: userId } }
        );
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("messagesRead", { conversationId, userId });
        }
      } catch (err) {
        console.error("❌ Error in markRead:", err);
      }
    });
  });

  return io;
}

export { onlineUsers };
