
// Import the User model for interacting with user data in MongoDB
import User from "../models/User.js";
// Import the function to generate JWT tokens
import { generateToken } from "../utils/generateToken.js";


// Controller for user signup/registration
export const signup = async (req, res) => {
  try {
    // Destructure user details from the request body
    const { name, email, password, role } = req.body;

    // Check if a user with the same email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists, return a 400 error
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user in the database
    const user = await User.create({ name, email, password, role });

    // Respond with the new user's details and a JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: error.message });
  }
};


// Controller for user login/authentication
export const login = async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    // If user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Respond with user details and a JWT token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user),
      });
    } else {
      // If authentication fails, return 401 error
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: error.message });
  }
};
