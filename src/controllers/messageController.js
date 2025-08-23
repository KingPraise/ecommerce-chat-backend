
// Import the Message model for handling message data
import Message from "../models/Message.js";
// Import the Conversation model for updating conversation info
import Conversation from "../models/Conversation.js";


// Controller to send a new message in a conversation
export const sendMessage = async (req, res) => {
  try {
    // Destructure message details from the request body
    const { conversationId, content, attachments } = req.body; // attachments: [{url, filename, mimeType, size, kind}]
    // Get the sender's user ID from the authenticated user
    const sender = req.user.id;

    // Create a new message document in the database
    const msg = await Message.create({
      conversation: conversationId,
      sender,
      content,
      attachments: attachments || [],
      readBy: [sender], // Mark the sender as having read the message
    });

    // Update the conversation's lastMessage field with the new message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: msg._id,
    });

    // Emit the new message to all connected clients (basic broadcast)
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

    // Respond with the created message
    res.status(201).json(msg);
  } catch (err) {
    // Log and respond with an error if something goes wrong
    console.error("Failed to send message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};


// Controller to get all messages for a conversation
export const getMessages = async (req, res) => {
  try {
    // Get the conversation ID from the request parameters
    const { conversationId } = req.params;

    // Find all messages for the conversation, sorted by creation time (oldest to newest)
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 }) // oldest → newest
      .populate("sender", "name email"); // Optionally populate sender details

    // Respond with the list of messages
    res.status(200).json(messages);
  } catch (err) {
    // Log and respond with an error if something goes wrong
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
