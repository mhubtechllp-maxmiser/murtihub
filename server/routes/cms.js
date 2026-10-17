import express from 'express';
import Project from '../models/Project.js';
import Stat from '../models/Stat.js';
import Leader from '../models/Leader.js';
import HeroSlide from '../models/HeroSlide.js';
import Service from '../models/Service.js';
import SiteContent from '../models/SiteContent.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/cms
// @desc    Get all dynamic CMS collections from MongoDB
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [projects, stats, leaders, heroSlides, services, siteDocs] = await Promise.all([
      Project.find().sort({ id: 1 }).lean(),
      Stat.find().lean(),
      Leader.find().lean(),
      HeroSlide.find({ isPublished: true }).sort({ order: 1 }).lean(),
      Service.find({ isPublished: true }).sort({ order: 1 }).lean(),
      SiteContent.find().lean(),
    ]);

    const siteMap = {};
    if (siteDocs && siteDocs.length > 0) {
      siteDocs.forEach((doc) => {
        siteMap[doc.key] = doc.data;
      });
    }

    return res.json({
      success: true,
      data: {
        projects: projects || [],
        trust_stats: stats || [],
        leadership: { leaders: leaders || [] },
        hero_slides: heroSlides || [],
        services: services || [],
        ...siteMap,
      },
    });
  } catch (error) {
    console.error('[CMS Route GET / error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/cms/:key
// @desc    Get specific CMS collection by key from MongoDB
// @access  Public
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    if (key === 'projects') {
      const projects = await Project.find().sort({ id: 1 }).lean();
      return res.json({ success: true, key, data: projects || [] });
    }

    if (key === 'trust_stats') {
      const stats = await Stat.find().lean();
      return res.json({ success: true, key, data: stats || [] });
    }

    if (key === 'leadership') {
      const leaders = await Leader.find().lean();
      return res.json({ success: true, key, data: { leaders: leaders || [] } });
    }

    if (key === 'hero_slides') {
      const slides = await HeroSlide.find({ isPublished: true }).sort({ order: 1 }).lean();
      return res.json({ success: true, key, data: slides || [] });
    }

    if (key === 'services') {
      const services = await Service.find({ isPublished: true }).sort({ order: 1 }).lean();
      return res.json({ success: true, key, data: services || [] });
    }

    const siteDoc = await SiteContent.findOne({ key }).lean();
    if (siteDoc) {
      return res.json({ success: true, key, data: siteDoc.data });
    }

    return res.json({ success: true, key, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/cms/:key
// @desc    Update CMS dataset (authorized intentional save action)
// @access  Protected (Super Admin & Editor)
router.put('/:key', protect, requireRole('superadmin', 'editor'), async (req, res) => {
  try {
    const { key } = req.params;
    const { data } = req.body;

    if (data === undefined || data === null) {
      return res.status(400).json({ success: false, message: 'Missing "data" field in request body' });
    }

    if (key === 'projects') {
      if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ success: false, message: 'Projects update requires a non-empty array of projects' });
      }
      const slugs = data.map((p) => p.slug || p.id).filter(Boolean);
      if (slugs.length > 0) {
        await Project.deleteMany({ slug: { $nin: slugs } });
      }

      for (const proj of data) {
        const slug = proj.slug || proj.id;
        await Project.findOneAndUpdate(
          { slug },
          { ...proj, slug },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      return res.json({
        success: true,
        message: 'Projects successfully synchronized in MongoDB projects collection',
        key,
        data,
      });
    }

    if (key === 'trust_stats') {
      if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ success: false, message: 'Trust stats update requires a non-empty array of statistics' });
      }
      const ids = data.map((s) => s.id).filter(Boolean);
      if (ids.length > 0) {
        await Stat.deleteMany({ id: { $nin: ids } });
      }

      for (const stat of data) {
        await Stat.findOneAndUpdate(
          { id: stat.id },
          stat,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      return res.json({
        success: true,
        message: 'Statistics successfully synchronized in MongoDB stats collection',
        key,
        data,
      });
    }

    if (key === 'leadership') {
      const leaderList = Array.isArray(data) ? data : (data.leaders || []);
      if (!Array.isArray(leaderList) || leaderList.length === 0) {
        return res.status(400).json({ success: false, message: 'Leadership update requires a non-empty list of executive leaders' });
      }
      const ids = leaderList.map((l) => l.id).filter(Boolean);
      if (ids.length > 0) {
        await Leader.deleteMany({ id: { $nin: ids } });
      }

      for (const leader of leaderList) {
        await Leader.findOneAndUpdate(
          { id: leader.id },
          leader,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      return res.json({
        success: true,
        message: 'Leadership profiles successfully synchronized in MongoDB leaders collection',
        key,
        data: { leaders: leaderList },
      });
    }

    if (key === 'hero_slides') {
      if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ success: false, message: 'Hero slides update requires a non-empty array of slides' });
      }
      const ids = data.map((s) => s.id).filter(Boolean);
      if (ids.length > 0) {
        await HeroSlide.deleteMany({ id: { $nin: ids } });
      }

      for (let i = 0; i < data.length; i++) {
        const slide = data[i];
        const slideId = slide.id || `slide-${i + 1}`;
        await HeroSlide.findOneAndUpdate(
          { id: slideId },
          { ...slide, id: slideId, order: slide.order ?? i + 1 },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      return res.json({
        success: true,
        message: 'Hero slides successfully synchronized in MongoDB hero_slides collection',
        key,
        data,
      });
    }

    if (key === 'services') {
      if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ success: false, message: 'Services update requires a non-empty array of services' });
      }
      const slugs = data.map((s) => s.slug || s.id).filter(Boolean);
      if (slugs.length > 0) {
        await Service.deleteMany({ slug: { $nin: slugs } });
      }

      for (let i = 0; i < data.length; i++) {
        const service = data[i];
        const slug = service.slug || service.id;
        await Service.findOneAndUpdate(
          { slug },
          { ...service, slug, order: service.order ?? i + 1 },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      return res.json({
        success: true,
        message: 'Services successfully synchronized in MongoDB services collection',
        key,
        data,
      });
    }

    await SiteContent.findOneAndUpdate(
      { key },
      { key, data, updatedBy: req.user ? req.user.email : 'admin' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      success: true,
      message: `CMS key "${key}" saved in MongoDB site_contents collection.`,
      key,
      data,
    });
  } catch (error) {
    console.error(`[CMS Route PUT /${req.params.key} error]:`, error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;