
// Import the Router function from express to create routes
import { Router } from "express";
// Import the authentication middleware to protect routes
import { requireAuth } from "../middleware/authMiddleware.js";
// Import the configured multer upload instance
import { upload } from "../config/upload.js";


// Create a new router instance
const router = Router();


// Route to upload a single file (protected)
router.post("/single", requireAuth, upload.single("file"), (req, res) => {
  // Get the uploaded file from the request
  const file = req.file;
  // Respond with file details and storage info
  res.status(201).json({
    url: `/uploads/${file.filename}`,
    filename: file.originalname,
    storedAs: file.filename,
    mimeType: file.mimetype,
    size: file.size,
  });
});


// Route to upload multiple files (protected, up to 5 files)
router.post("/multiple", requireAuth, upload.array("files", 5), (req, res) => {
  // Map uploaded files to a response format
  const files = (req.files || []).map((f) => ({
    url: `/uploads/${f.filename}`,
    filename: f.originalname,
    storedAs: f.filename,
    mimeType: f.mimetype,
    size: f.size,
  }));
  // Respond with an array of file details
  res.status(201).json({ files });
});


// Export the router to be used in the main app
export default router;
