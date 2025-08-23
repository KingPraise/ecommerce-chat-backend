
// Import multer for handling file uploads
import multer from "multer";
// Import path for working with file and directory paths
import path from "path";
// Import fs for interacting with the file system
import fs from "fs";
// Import crypto for generating unique file names
import crypto from "crypto";


// Define the directory where uploaded files will be stored
const UPLOAD_DIR = path.join(process.cwd(), "uploads");


// Create the uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}


// Configure multer storage to save files to disk with unique names
const storage = multer.diskStorage({
  // Set the destination directory for uploads
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  // Generate a unique filename using random bytes and preserve the original extension
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = crypto.randomBytes(16).toString("hex");
    cb(null, `${base}${ext}`); // unique name
  },
});


// Set of allowed MIME types for uploads (images and documents)
const ALLOWED_MIME = new Set([
  // images
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  // docs
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);


// Multer file filter to allow only files with allowed MIME types
function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME.has(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported file type"), false);
}


// Export the configured multer instance for use in routes
export const upload = multer({
  storage, // storage engine
  fileFilter, // file filter function
  limits: { fileSize: 10 * 1024 * 1024 }, // limit file size to 10MB
});
