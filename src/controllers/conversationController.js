import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { notify } from "../utils/notify.js"; // 🔔 import notify util

// Start new conversation (or reuse if exists)
export const startConversation = async (req, res) => {
  try {
    console.log("🟢 req.user:", req.user);
    console.log("🟢 req.body:", req.body);
    const { participantIds } = req.body; // array of userIds
    const userId = req.user.id;

    // include current user always
    if (!participantIds.includes(userId)) {
      participantIds.push(userId);
    }

    // check if conversation already exists (simple check)
    let convo = await Conversation.findOne({
      participants: { $all: participantIds, $size: participantIds.length },
    });

    if (!convo) {
      convo = await Conversation.create({ participants: participantIds });

      // 🔔 notify all other participants
      const io = req.app.get("io"); // socket.io instance from app.js
      for (const participant of participantIds) {
        if (participant.toString() !== userId) {
          await notify(io, participant, "NEW_CONVERSATION", {
            conversationId: convo._id,
            startedBy: userId,
          });
        }
      }
    }

    res.status(201).json(convo);
  } catch (err) {
    console.error("❌ startConversation error:", err);
    res.status(500).json({ error: "Failed to start conversation" });
  }
};

// Get all conversations for logged-in user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const convos = await Conversation.find({ participants: userId })
      .populate("participants", "name email role")
      .populate("lastMessage");

    res.json(convos);
  } catch (err) {
    console.error("❌ getUserConversations error:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};
