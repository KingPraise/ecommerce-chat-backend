import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, attachments } = req.body; // attachments: [{url, filename, mimeType, size, kind}]
    const sender = req.user.id;

    const msg = await Message.create({
      conversation: conversationId,
      sender,
      content,
      attachments: attachments || [],
      readBy: [sender],
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: msg._id,
    });

    // emit to recipients (basic broadcast for now)
    const io = req.app.get("io");
    if (io) {
      io.emit("newMessage", {
        conversationId,
        sender,
        content: msg.content,
        attachments: msg.attachments,
        createdAt: msg.createdAt,
        _id: msg._id,
      });
    }

    res.status(201).json(msg);
  } catch (err) {
    console.error("Failed to send message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 }) // oldest → newest
      .populate("sender", "name email"); // optional: show sender details

    res.status(200).json(messages);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
