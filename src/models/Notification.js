
// Import the mongoose library for MongoDB object modeling
import mongoose from "mongoose";


// Define the schema for a notification
const notificationSchema = new mongoose.Schema(
  {
    // Reference to the user who receives the notification
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Type of notification (e.g., "NEW_CONVERSATION", "ASSIGNMENT")
    type: { type: String, required: true },
    // Additional data payload (e.g., conversationId, messageId, etc.)
    data: { type: Object, default: {} },
    // Whether the notification has been read
    read: { type: Boolean, default: false },
  },
  // Enable automatic createdAt and updatedAt timestamps
  { timestamps: true }
);


// Create the Notification model, or use existing if already compiled
const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);


// Export the Notification model for use in other files
export default Notification;
