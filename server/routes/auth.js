import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendPasswordResetOtpEmail } from '../services/mailService.js';

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'murtihub_fallback_secret', {
    expiresIn: '7d',
  });
};

// @route   POST /api/auth/login
// @desc    Authenticate admin & return JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your admin account has been deactivated' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('[Auth Route] Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Initiate password reset, generate 6-digit OTP and send via Zoho Mail
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide registered administrator email' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No administrator account found with this email address' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This administrator account is deactivated. Contact super administrator.' });
    }

    // Generate genuine 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Dispatch via Zoho Mail
    const mailResult = await sendPasswordResetOtpEmail({
      to: user.email,
      name: user.name,
      otp,
    });

    return res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${user.email}. Please check your inbox and spam folder.`,
      email: user.email,
      simulated: !!mailResult?.simulated,
    });
  } catch (error) {
    console.error('[Auth Route] Forgot-password error:', error);
    return res.status(500).json({ success: false, message: 'Server error initiating password recovery' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Verify OTP and update user password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, verification code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Select OTP fields which are hidden by default
    const user = await User.findOne({ email: cleanEmail }).select('+resetPasswordOtp +resetPasswordOtpExpires');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Administrator account not found' });
    }

    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return res.status(400).json({ success: false, message: 'No pending password reset request found. Please request a new code.' });
    }

    if (user.resetPasswordOtpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new code.' });
    }

    if (user.resetPasswordOtp !== cleanOtp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please check and try again.' });
    }

    // Set new password (pre('save') automatically hashes it)
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    console.log(`[Auth Route] Password successfully reset for administrator: ${user.email}`);

    return res.json({
      success: true,
      message: 'Password successfully updated! You can now log in with your new credentials.',
    });
  } catch (error) {
    console.error('[Auth Route] Reset-password error:', error);
    return res.status(500).json({ success: false, message: 'Server error resetting password' });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged in admin user
// @access  Private
router.get('/me', protect, async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

// @route   POST /api/auth/change-password
// @desc    Change current admin's password
// @desc    Change current admin's password from dashboard
// @access  Private
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    console.error('[Auth Route] Change-password error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating password' });
  }
});

export default router;

