
// Import the express library to create routes
import express from "express";
// Import the signup and login controller functions
import { signup, login } from "../controllers/authController.js";


// Create a new router instance
const router = express.Router();


// Route for user signup (registration)
router.post("/signup", signup);
// Route for user login (authentication)
router.post("/login", login);


// Export the router to be used in the main app
export default router;
