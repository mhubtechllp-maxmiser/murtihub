import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import { verifyMailConnection } from './services/mailService.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admins.js';
import contactRoutes from './routes/contact.js';
import cmsRoutes from './routes/cms.js';
import uploadRoutes from './routes/upload.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Vite dev server & production origin
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded media files statically
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/upload', uploadRoutes);

// Seed Default Super Admin if none exists
const seedInitialSuperAdmin = async () => {
  try {
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@murtihub.co.in';
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@MurtiHub2026';

      await User.create({
        name: 'MurtiHub Super Admin',
        email: defaultEmail,
        password: defaultPassword,
        role: 'superadmin',
        isActive: true,
      });

      console.log('===========================================================');
      console.log(' [SEED] Initial Super Admin Created:');
      console.log(` Email:    ${defaultEmail}`);
      console.log(` Password: ${defaultPassword}`);
      console.log(` Role:     superadmin`);
      console.log('===========================================================');
    } else {
      console.log(`[Database] Found ${adminCount} existing admin account(s).`);
    }
  } catch (error) {
    console.error('[Database Seed Error]:', error.message);
  }
};

// Start Server
const startServer = async () => {
  try {
    console.log('[Server] Connecting to MongoDB Atlas...');
    const conn = await connectDB();

    if (conn) {
      await seedInitialSuperAdmin();
    }

    // Check Zoho SMTP connection status
    verifyMailConnection();

    app.listen(PORT, () => {
      console.log(`[Server] MurtiHub Backend running on port ${PORT} (http://localhost:${PORT})`);
    });
  } catch (error) {
    console.error('[Server Error]:', error);
  }
};

startServer();

