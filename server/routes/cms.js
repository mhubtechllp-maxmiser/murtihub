import express from 'express';
import SiteContent from '../models/SiteContent.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/cms
// @desc    Get all CMS datasets in one payload
// @access  Public
router.get('/', async (req, res) => {
  try {
    const docs = await SiteContent.find();
    const cmsMap = {};
    docs.forEach((doc) => {
      cmsMap[doc.key] = doc.data;
    });
    return res.json({ success: true, data: cmsMap });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/cms/:key
// @desc    Get specific CMS dataset by key
// @access  Public
router.get('/:key', async (req, res) => {
  try {
    const doc = await SiteContent.findOne({ key: req.params.key });
    if (!doc) {
      return res.status(404).json({ success: false, message: `No content found for key: ${req.params.key}` });
    }
    return res.json({ success: true, key: doc.key, data: doc.data, updatedAt: doc.updatedAt });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/cms/:key
// @desc    Update or create CMS dataset
// @access  Protected (Super Admin & Editor)
router.put('/:key', protect, requireRole('superadmin', 'editor'), async (req, res) => {
  try {
    const { data } = req.body;
    if (data === undefined) {
      return res.status(400).json({ success: false, message: 'Missing "data" field in request body' });
    }

    const updated = await SiteContent.findOneAndUpdate(
      { key: req.params.key },
      {
        key: req.params.key,
        data,
        updatedBy: req.user ? req.user.email : 'admin',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      success: true,
      message: `Content for ${req.params.key} successfully saved to database`,
      key: updated.key,
      data: updated.data,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    console.error(`[CMS Route] Error saving ${req.params.key}:`, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/cms/seed
// @desc    Bulk seed or update initial site content
// @access  Protected (Super Admin only)
router.post('/seed', protect, requireRole('superadmin'), async (req, res) => {
  try {
    const payload = req.body; // { key: data, ... }
    const results = [];

    for (const [key, data] of Object.entries(payload)) {
      const doc = await SiteContent.findOneAndUpdate(
        { key },
        { key, data, updatedBy: 'seeder' },
        { upsert: true, new: true }
      );
      results.push(doc.key);
    }

    return res.json({
      success: true,
      message: `Seeded ${results.length} CMS sections`,
      keys: results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

