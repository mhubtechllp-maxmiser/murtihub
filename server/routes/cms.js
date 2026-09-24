import express from 'express';
import Project from '../models/Project.js';
import Stat from '../models/Stat.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/cms
// @desc    Get dynamic CMS collections (projects and stats only)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [projects, stats] = await Promise.all([
      Project.find().sort({ id: 1 }).lean(),
      Stat.find().lean(),
    ]);

    return res.json({
      success: true,
      data: {
        projects: projects || [],
        trust_stats: stats || [],
      },
    });
  } catch (error) {
    console.error('[CMS Route GET / error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/cms/:key
// @desc    Get specific CMS collection by key
// @access  Public
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    if (key === 'projects') {
      const projects = await Project.find().sort({ id: 1 }).lean();
      return res.json({ success: true, key, data: projects });
    }

    if (key === 'trust_stats') {
      const stats = await Stat.find().lean();
      return res.json({ success: true, key, data: stats });
    }

    return res.json({ success: true, key, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/cms/:key
// @desc    Update CMS dataset (only projects and stats are stored in MongoDB)
// @access  Protected (Super Admin & Editor)
router.put('/:key', protect, requireRole('superadmin', 'editor'), async (req, res) => {
  try {
    const { key } = req.params;
    const { data } = req.body;

    if (data === undefined) {
      return res.status(400).json({ success: false, message: 'Missing "data" field in request body' });
    }

    if (key === 'projects') {
      if (Array.isArray(data)) {
        const slugs = data.map((p) => p.slug || p.id).filter(Boolean);
        await Project.deleteMany({ slug: { $nin: slugs } });

        for (const proj of data) {
          const slug = proj.slug || proj.id;
          await Project.findOneAndUpdate(
            { slug },
            { ...proj, slug },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      }
      return res.json({
        success: true,
        message: 'Projects successfully synchronized in MongoDB projects collection',
        key,
        data,
      });
    }

    if (key === 'trust_stats') {
      if (Array.isArray(data)) {
        const ids = data.map((s) => s.id).filter(Boolean);
        await Stat.deleteMany({ id: { $nin: ids } });

        for (const stat of data) {
          await Stat.findOneAndUpdate(
            { id: stat.id },
            stat,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      }
      return res.json({
        success: true,
        message: 'Statistics successfully synchronized in MongoDB stats collection',
        key,
        data,
      });
    }

    return res.json({
      success: true,
      message: `${key} is handled statically or client-side; not stored in MongoDB.`,
      key,
      data,
    });
  } catch (error) {
    console.error(`[CMS Route PUT /${req.params.key} error]:`, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;