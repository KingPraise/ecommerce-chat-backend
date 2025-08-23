
// Import the mongoose library for MongoDB object modeling
import mongoose from "mongoose";


// Define the schema for message attachments
const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // File URL (local or remote)
    filename: { type: String }, // Original file name
    mimeType: { type: String }, // MIME type of the file
    size: { type: Number }, // File size in bytes
    kind: { type: String, enum: ["image", "doc"], default: "doc" }, // Type of attachment
  },
  { _id: false } // Do not create a separate _id for each attachment
);


// Define the schema for a chat message
const messageSchema = new mongoose.Schema(
  {
    // Reference to the conversation this message belongs to
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    // Reference to the user who sent the message
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Text content of the message (optional if attachments are present)
    content: { type: String },
    // Array of attachments (files, images, etc.)
    attachments: { type: [attachmentSchema], default: [] },
    // Array of user IDs who have read the message
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  // Enable automatic createdAt and updatedAt timestamps
  { timestamps: true }
);


// Pre-save hook: require either content or at least one attachment
messageSchema.pre("save", function (next) {
  if (!this.content && (!this.attachments || this.attachments.length === 0)) {
    // If neither content nor attachments are present, throw an error
    return next(new Error("Message must include content or attachments"));
  }
  next();
});


// Create the Message model, or use existing if already compiled
const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);


// Export the Message model for use in other files
export default Message;
