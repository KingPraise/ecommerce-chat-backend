import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // /uploads/abc123.png or https://...
    filename: { type: String },
    mimeType: { type: String },
    size: { type: Number }, // bytes
    kind: { type: String, enum: ["image", "doc"], default: "doc" },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String }, // optional if attachments present
    attachments: { type: [attachmentSchema], default: [] },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Guard: require either content or at least one attachment
messageSchema.pre("save", function (next) {
  if (!this.content && (!this.attachments || this.attachments.length === 0)) {
    return next(new Error("Message must include content or attachments"));
  }
  next();
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
