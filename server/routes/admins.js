import express from 'express';
import User from '../models/User.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes here require superadmin privileges
router.use(protect);
router.use(requireRole('superadmin'));

// @route   GET /api/admins
// @desc    List all admin users
// @access  Super Admin
router.get('/', async (req, res) => {
  try {
    const admins = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, admins });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admins
// @desc    Create a new admin user with designated role
// @access  Super Admin
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const validRoles = ['superadmin', 'editor', 'viewer'];
    const assignedRole = validRoles.includes(role) ? role : 'editor';

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An admin with this email already exists' });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: `Admin created successfully with role ${assignedRole}`,
      admin: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admins/:id
// @desc    Update admin role or status
// @access  Super Admin
router.put('/:id', async (req, res) => {
  try {
    const { role, isActive, name } = req.body;
    const adminToUpdate = await User.findById(req.params.id);

    if (!adminToUpdate) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Guard: Prevent deactivating the last active superadmin
    if (adminToUpdate.role === 'superadmin' && (isActive === false || (role && role !== 'superadmin'))) {
      const activeSuperAdmins = await User.countDocuments({ role: 'superadmin', isActive: true });
      if (activeSuperAdmins <= 1 && adminToUpdate.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot demote or deactivate the last remaining Super Admin',
        });
      }
    }

    if (name) adminToUpdate.name = name.trim();
    if (role && ['superadmin', 'editor', 'viewer'].includes(role)) adminToUpdate.role = role;
    if (typeof isActive === 'boolean') adminToUpdate.isActive = isActive;

    await adminToUpdate.save();

    return res.json({
      success: true,
      message: 'Admin updated successfully',
      admin: adminToUpdate,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admins/:id
// @desc    Delete an admin account
// @access  Super Admin
router.delete('/:id', async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own Super Admin account' });
    }

    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (admin.role === 'superadmin') {
      const superAdminCount = await User.countDocuments({ role: 'superadmin' });
      if (superAdminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the only Super Admin account' });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Admin account deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

