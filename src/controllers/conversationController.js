
// Import the Conversation model for handling conversation data
import Conversation from "../models/Conversation.js";
// Import the Message model for handling message data
import Message from "../models/Message.js";
// Import the notify utility for sending notifications
import { notify } from "../utils/notify.js"; // 🔔 import notify util


// Start a new conversation (or reuse if it already exists)
export const startConversation = async (req, res) => {
  try {
    // Log the authenticated user and request body for debugging
    console.log("🟢 req.user:", req.user);
    console.log("🟢 req.body:", req.body);
    // Extract participant IDs from the request body
    const { participantIds } = req.body; // array of userIds
    // Get the current user's ID from the request
    const userId = req.user.id;

    // Always include the current user in the conversation
    if (!participantIds.includes(userId)) {
      participantIds.push(userId);
    }

    // Check if a conversation with the same participants already exists
    let convo = await Conversation.findOne({
      participants: { $all: participantIds, $size: participantIds.length },
    });

    // If no conversation exists, create a new one
    if (!convo) {
      convo = await Conversation.create({ participants: participantIds });

      // 🔔 Notify all other participants about the new conversation
      const io = req.app.get("io"); // Get the socket.io instance from app.js
      for (const participant of participantIds) {
        // Don't notify the user who started the conversation
        if (participant.toString() !== userId) {
          await notify(io, participant, "NEW_CONVERSATION", {
            conversationId: convo._id,
            startedBy: userId,
          });
        }
      }
    }

    // Respond with the conversation object
    res.status(201).json(convo);
  } catch (err) {
    // Log and respond with an error if something goes wrong
    console.error("❌ startConversation error:", err);
    res.status(500).json({ error: "Failed to start conversation" });
  }
};


// Get all conversations for the logged-in user
export const getUserConversations = async (req, res) => {
  try {
    // Get the current user's ID from the request
    const userId = req.user.id;
    // Find all conversations where the user is a participant
    const convos = await Conversation.find({ participants: userId })
      // Populate participant details (name, email, role)
      .populate("participants", "name email role")
      // Populate the last message in each conversation
      .populate("lastMessage");

    // Respond with the list of conversations
    res.json(convos);
  } catch (err) {
    // Log and respond with an error if something goes wrong
    console.error("❌ getUserConversations error:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};
