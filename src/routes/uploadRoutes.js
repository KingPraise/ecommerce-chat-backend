import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { upload } from "../config/upload.js";

const router = Router();

// Single file
router.post("/single", requireAuth, upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(201).json({
    url: `/uploads/${file.filename}`,
    filename: file.originalname,
    storedAs: file.filename,
    mimeType: file.mimetype,
    size: file.size,
  });
});

// Multiple files (optional)
router.post("/multiple", requireAuth, upload.array("files", 5), (req, res) => {
  const files = (req.files || []).map((f) => ({
    url: `/uploads/${f.filename}`,
    filename: f.originalname,
    storedAs: f.filename,
    mimeType: f.mimetype,
    size: f.size,
  }));
  res.status(201).json({ files });
});

export default router;
