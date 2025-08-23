
// Import the mongoose library for MongoDB object modeling
import mongoose from "mongoose";


// Define the schema for a conversation
const conversationSchema = new mongoose.Schema(
  {
    // Array of user IDs participating in the conversation
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    // You can add more fields here, e.g., lastMessage, if needed
  },
  // Enable automatic createdAt and updatedAt timestamps
  { timestamps: true }
);


// Create the Conversation model, or use existing if already compiled
const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);


// Export the Conversation model for use in other files
export default Conversation;
