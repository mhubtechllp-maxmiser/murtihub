import express from 'express';
import ContactSubmission from '../models/ContactSubmission.js';
import { sendContactNotification } from '../services/mailService.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit public contact inquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, company, projectType, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields',
      });
    }

    // 1. Always record in MongoDB first
    const submission = await ContactSubmission.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company ? company.trim() : '',
      projectType: projectType ? projectType.trim() : '',
      message: message.trim(),
      status: 'Unread',
    });

    // 2. Dispatch Zoho email in background (non-blocking)
    sendContactNotification(submission)
      .then(async (result) => {
        if (result.success) {
          submission.emailNotificationSent = true;
          await submission.save();
        } else {
          submission.emailNotificationError = result.error;
          await submission.save();
        }
      })
      .catch((err) => {
        console.error('[Contact Submission] Mail dispatch uncaught error:', err.message);
      });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our executive team will contact you shortly.',
      id: submission._id,
    });
  } catch (error) {
    console.error('[Contact Route] Submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record your inquiry. Please try again or reach out directly.',
      error: error.message,
    });
  }
});

// @route   GET /api/contact
// @desc    List all received inquiries
// @access  Protected (All admins)
router.get('/', protect, async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/contact/:id/status
// @desc    Update inquiry status
// @access  Protected
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Unread', 'Handled', 'Archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const submission = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    return res.json({ success: true, submission });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete inquiry
// @access  Protected (superadmin, editor)
router.delete('/:id', protect, requireRole('superadmin', 'editor'), async (req, res) => {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    return res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

