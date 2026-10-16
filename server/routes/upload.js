import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect, requireRole } from '../middleware/auth.js';
import {
  uploadToCloudinary,
  fetchCloudinaryMedia,
  deleteFromCloudinary,
  isCloudinaryConfigured,
} from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Helper to safely ensure directory on writable filesystems (e.g. local dev / VPS)
const ensureUploadsDir = () => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    return false;
  }
};

// @route   POST /api/upload
// @desc    Upload an image asset to Cloudinary (or fallback to local /uploads)
// @access  Protected (Super Admin & Editor)
router.post('/', protect, requireRole('superadmin', 'editor'), async (req, res) => {
  try {
    const { image, filename, folder = 'murtihub' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    // 1. If Cloudinary is configured, upload directly to Cloudinary
    if (isCloudinaryConfigured()) {
      try {
        const cleanBase = filename
          ? path.basename(filename, path.extname(filename)).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
          : `asset_${Date.now()}`;

        const uploadResult = await uploadToCloudinary(image, {
          folder: folder || 'murtihub',
          public_id: `${cleanBase}_${Date.now()}`,
          resource_type: 'image',
        });

        console.log(`[Upload - Cloudinary] Asset uploaded successfully: ${uploadResult.secure_url}`);

        return res.status(201).json({
          success: true,
          url: uploadResult.secure_url,
          filename: `${uploadResult.public_id}.${uploadResult.format}`,
          public_id: uploadResult.public_id,
          format: uploadResult.format,
          size: uploadResult.bytes,
          width: uploadResult.width,
          height: uploadResult.height,
          storage: 'cloudinary',
        });
      } catch (cloudinaryErr) {
        console.error('[Upload - Cloudinary Error]:', cloudinaryErr);
        return res.status(500).json({
          success: false,
          message: `Cloudinary upload failed: ${cloudinaryErr.message || 'Check your Cloudinary credentials'}`,
          error: cloudinaryErr.message,
        });
      }
    }

    // 2. If running on Vercel/serverless and Cloudinary is NOT configured
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (isServerless) {
      return res.status(400).json({
        success: false,
        message:
          'Cloudinary credentials are not configured in Vercel Environment Variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      });
    }

    // 3. Local fallback (for local development without Cloudinary)
    ensureUploadsDir();

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
      buffer = Buffer.from(image, 'base64');
    }

    const cleanName = filename
      ? path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase()
      : `asset${extension}`;

    const timestamp = Date.now();
    const finalFilename = `${timestamp}-${cleanName}`;
    const filePath = path.join(UPLOADS_DIR, finalFilename);

    fs.writeFileSync(filePath, buffer);

    console.log(`[Upload - Local Fallback] Image saved: ${finalFilename} (${(buffer.length / 1024).toFixed(1)} KB)`);

    return res.status(201).json({
      success: true,
      url: `/uploads/${finalFilename}`,
      filename: finalFilename,
      size: buffer.length,
      storage: 'local',
    });
  } catch (error) {
    console.error('[Upload Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process image upload',
      error: error.message,
    });
  }
});

// @route   GET /api/upload
// @desc    Fetch / list uploaded media from Cloudinary (or local fallback)
// @access  Protected (Super Admin & Editor)
router.get('/', protect, requireRole('superadmin', 'editor'), async (req, res) => {
  try {
    const { folder = 'murtihub', max_results = 50, next_cursor } = req.query;

    if (isCloudinaryConfigured()) {
      const data = await fetchCloudinaryMedia({
        folder,
        max_results,
        next_cursor,
      });

      return res.json({
        success: true,
        storage: 'cloudinary',
        media: data.resources,
        next_cursor: data.next_cursor,
        total_count: data.total_count,
      });
    }

    // Local fallback
    ensureUploadsDir();
    const files = fs.readdirSync(UPLOADS_DIR);
    const media = files
      .filter((file) => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file))
      .map((file) => {
        const stats = fs.statSync(path.join(UPLOADS_DIR, file));
        return {
          public_id: file,
          url: `/uploads/${file}`,
          secure_url: `/uploads/${file}`,
          format: path.extname(file).replace('.', ''),
          bytes: stats.size,
          created_at: stats.birthtime.toISOString(),
          storage: 'local',
        };
      })
      .reverse();

    return res.json({
      success: true,
      storage: 'local',
      media,
      next_cursor: null,
      total_count: media.length,
    });
  } catch (error) {
    console.error('[Fetch Media Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch media assets',
    });
  }
});

// @route   DELETE /api/upload
// @desc    Delete media asset by public_id
// @access  Protected (Super Admin & Editor)
router.delete('/', protect, requireRole('superadmin', 'editor'), async (req, res) => {
  try {
    const { public_id } = req.body || req.query;

    if (!public_id) {
      return res.status(400).json({ success: false, message: 'public_id is required' });
    }

    if (isCloudinaryConfigured()) {
      await deleteFromCloudinary(public_id);
      return res.json({ success: true, message: 'Asset deleted from Cloudinary' });
    }

    // Local deletion
    const filePath = path.join(UPLOADS_DIR, path.basename(public_id));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res.json({ success: true, message: 'Asset deleted locally' });
  } catch (error) {
    console.error('[Delete Media Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete media asset',
    });
  }
});

export default router;
