import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect, requireRole } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// @route   POST /api/upload
// @desc    Upload an image asset (base64 encoded) and save to /uploads
// @access  Protected (Super Admin & Editor)
router.post('/', protect, requireRole('superadmin', 'editor'), async (req, res) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    // Match data URI pattern e.g. "data:image/jpeg;base64,..."
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    let buffer;
    let extension = '.jpg';

    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');

      if (mimeType === 'image/png') extension = '.png';
      else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') extension = '.jpg';
      else if (mimeType === 'image/webp') extension = '.webp';
      else if (mimeType === 'image/svg+xml') extension = '.svg';
      else if (mimeType === 'image/gif') extension = '.gif';
    } else {
      // Plain base64 string
      buffer = Buffer.from(image, 'base64');
    }

    // Generate clean unique filename
    const cleanName = filename
      ? path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase()
      : `asset${extension}`;

    const timestamp = Date.now();
    const finalFilename = `${timestamp}-${cleanName}`;
    const filePath = path.join(UPLOADS_DIR, finalFilename);

    // Save to disk
    fs.writeFileSync(filePath, buffer);

    console.log(`[Upload] Image saved: ${finalFilename} (${(buffer.length / 1024).toFixed(1)} KB)`);

    return res.status(201).json({
      success: true,
      url: `/uploads/${finalFilename}`,
      filename: finalFilename,
      size: buffer.length,
    });
  } catch (error) {
    console.error('[Upload Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process image upload',
      error: error.message,
    });
  }
});

export default router;

