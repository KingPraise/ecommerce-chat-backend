
// Import the jsonwebtoken library for verifying JWT tokens
import jwt from "jsonwebtoken";
// Import the User model for fetching user data from the database
import User from "../models/User.js";



// Middleware to verify JWT and authenticate the user
export const requireAuth = async (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // If no token or token does not start with 'Bearer ', deny access
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token, exclude password field
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User not found" });

    // Attach the user object to the request for downstream use
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Log error and respond with unauthorized if token is invalid or expired
    console.error(err);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};


// Middleware to check if the user has one of the required roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    // If the user's role is not in the allowed roles, deny access
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: insufficient role" });
    }
    // Otherwise, proceed to the next middleware or route handler
    next();
  };
};
