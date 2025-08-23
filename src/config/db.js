
// Import the mongoose library for MongoDB object modeling
import mongoose from "mongoose";


// Asynchronous function to connect to MongoDB
export async function connectDB(uri) {
  // Enable strict query mode for Mongoose (prevents unknown fields in queries)
  mongoose.set("strictQuery", true);
  // Connect to MongoDB using the provided URI, with autoIndex enabled for automatic index creation
  await mongoose.connect(uri, { autoIndex: true });
  // Log a success message when connected
  console.log("✅ MongoDB connected");
}
