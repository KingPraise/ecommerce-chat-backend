
// Import the jsonwebtoken library for creating JWT tokens
import jwt from "jsonwebtoken";


// Function to generate a JWT token for a user
export const generateToken = (user) => {
  // Sign a JWT with the user's id and role, using the secret and 7-day expiry
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
