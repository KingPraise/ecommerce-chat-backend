
// Import the mongoose library for MongoDB object modeling
import mongoose from "mongoose";
// Import bcryptjs for hashing and comparing passwords
import bcrypt from "bcryptjs";


// Define the schema for a user
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: { type: String, required: true, trim: true },
    // User's email address (must be unique and lowercase)
    email: { type: String, required: true, unique: true, lowercase: true },
    // User's hashed password
    password: { type: String, required: true, minlength: 6 },
    // User's role in the system
    role: {
      type: String,
      enum: ["admin", "agent", "customer", "designer", "merchant"],
      default: "customer",
    },
  },
  // Enable automatic createdAt and updatedAt timestamps
  { timestamps: true }
);


// Pre-save hook: hash the password before saving if it was modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Instance method: compare a plain password to the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


// Create the User model, or use existing if already compiled
const User = mongoose.models.User || mongoose.model("User", userSchema);


// Export the User model for use in other files
export default User;
