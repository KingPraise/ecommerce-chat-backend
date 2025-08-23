
// Import the Server class from socket.io to create a WebSocket server
import { Server } from "socket.io";
// Import the Message model for updating message read status
import Message from "../models/Message.js"; // ✅ import Message model


// Map to track online users: { userId: socketId }
const onlineUsers = new Map();


// Function to initialize the Socket.IO server
export function initSocket(server) {
  // Create a new Socket.IO server instance with CORS and transport options
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for testing
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // Ensure both work for testing
  });

  // Listen for new client connections
  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Step 1: Register userId with the socket
    socket.on("register", (userId) => {
      // Map the userId to the socket.id
      onlineUsers.set(userId, socket.id);
      console.log(`✅ User ${userId} registered with socket ${socket.id}`);
      // Notify other clients that this user is online
      socket.broadcast.emit("userOnline", { userId });
    });

    // Step 2: Handle message delivery between users
    socket.on("sendMessage", ({ conversationId, senderId, recipientId, text }) => {
      console.log(`📨 Message from ${senderId} to ${recipientId}: ${text}`);
      // Get the recipient's socket ID
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        // Send the message to the recipient if they are online
        io.to(recipientSocketId).emit("receiveMessage", {
          conversationId,
          senderId,
          text,
          createdAt: new Date(),
        });
      }
    });

    // Step 2b: Typing indicators (user is typing)
    socket.on("typing", ({ conversationId, senderId, recipientId }) => {
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("typing", { conversationId, senderId });
      }
    });

    // Step 2c: Typing indicators (user stopped typing)
    socket.on("stopTyping", ({ conversationId, senderId, recipientId }) => {
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("stopTyping", { conversationId, senderId });
      }
    });

    // Step 3: Handle client disconnect and cleanup
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          // Remove the user from the online users map
          onlineUsers.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          // Notify other clients that this user is offline
          socket.broadcast.emit("userOffline", { userId });
        }
      }
    });

    // Step 4: Read receipts (mark messages as read)
    socket.on("markRead", async ({ conversationId, userId, recipientId }) => {
      try {
        // Update all messages in the conversation to mark as read by this user
        await Message.updateMany(
          { conversation: conversationId, readBy: { $ne: userId } },
          { $push: { readBy: userId } }
        );
        // Notify the recipient that messages have been read
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("messagesRead", { conversationId, userId });
        }
      } catch (err) {
        // Log any errors that occur
        console.error("❌ Error in markRead:", err);
      }
    });
  });

  // Return the Socket.IO server instance
  return io;
}


// Export the onlineUsers map for use in other modules
export { onlineUsers };
