import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../../');

dotenv.config({ path: path.join(rootDir, '.env') });

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
  });
} else if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const config = cloudinary.config();
if (!config.cloud_name || (!config.api_key && !process.env.CLOUDINARY_URL)) {
  console.error('\n❌ ERROR: Cloudinary credentials not configured!');
  console.error('Please configure your Cloudinary credentials in .env:\n');
  console.error('CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.error('CLOUDINARY_API_KEY=your_api_key');
  console.error('CLOUDINARY_API_SECRET=your_api_secret\n');
  process.exit(1);
}

// Media mapping definitions
const leadershipMedia = [
  {
    id: 'rammurti-katiyar',
    localFile: path.join(rootDir, 'public/images/leader.jpg'),
    publicId: 'murtihub/leadership/rammurti-katiyar',
  },
  {
    id: 'rishi-katiyar',
    localFile: path.join(rootDir, 'public/images/leader-2.jpg'),
    publicId: 'murtihub/leadership/rishi-katiyar',
  },
];

const projectsMedia = [
  {
    slug: 'akshar-canvas',
    id: '01',
    localFile: path.join(rootDir, 'public/images/projects/akshar.jpg'),
    publicId: 'murtihub/projects/akshar-canvas',
  },
  {
    slug: 'ghsnap-flix',
    id: '02',
    localFile: path.join(rootDir, 'public/images/projects/ghsnap.jpg'),
    publicId: 'murtihub/projects/ghsnap-flix',
  },
  {
    slug: 'ghgame-zone',
    id: '03',
    localFile: path.join(rootDir, 'public/images/projects/ghgame.jpg'),
    publicId: 'murtihub/projects/ghgame-zone',
  },
  {
    slug: 'sentinel-gateway',
    id: '04',
    localFile: path.join(rootDir, 'public/images/projects/sentinel.jpg'),
    publicId: 'murtihub/projects/sentinel-gateway',
  },
  {
    slug: 'omni-marketplace',
    id: '05',
    localFile: path.join(rootDir, 'public/images/projects/omni.jpg'),
    publicId: 'murtihub/projects/omni-marketplace',
  },
];

async function uploadFile(filePath, publicId, folder) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: Local file not found: ${filePath}`);
    return null;
  }
  console.log(`⏳ Uploading ${path.basename(filePath)} -> Cloudinary: ${publicId}...`);
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    resource_type: 'image',
  });
  console.log(`✅ Uploaded: ${result.secure_url}`);
  return result.secure_url;
}

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 MURTIHUB — SYNC MEDIA TO CLOUDINARY (LEADERSHIP & PROJECTS)');
  console.log(`Cloud Name: ${config.cloud_name}`);
  console.log('====================================================\n');

  const uploadedLeadershipUrls = {};
  const uploadedProjectsUrls = {};

  // 1. Upload Leadership images
  console.log('--- [1/4] Uploading Leadership Images ---');
  for (const item of leadershipMedia) {
    const url = await uploadFile(item.localFile, item.publicId, 'murtihub/leadership');
    if (url) {
      uploadedLeadershipUrls[item.id] = url;
    }
  }

  // 2. Upload Projects images
  console.log('\n--- [2/4] Uploading Project Images ---');
  for (const item of projectsMedia) {
    const url = await uploadFile(item.localFile, item.publicId, 'murtihub/projects');
    if (url) {
      uploadedProjectsUrls[item.slug] = url;
    }
  }

  // 3. Update static files: src/data/leadershipData.js and src/data/projectsData.js
  console.log('\n--- [3/4] Updating Static Data Files ---');
  const leadershipDataPath = path.join(rootDir, 'src/data/leadershipData.js');
  if (fs.existsSync(leadershipDataPath)) {
    let content = fs.readFileSync(leadershipDataPath, 'utf8');
    if (uploadedLeadershipUrls['rammurti-katiyar']) {
      content = content.replace(
        /image:\s*["'][^"']*leader\.jpg["']/,
        `image: "${uploadedLeadershipUrls['rammurti-katiyar']}"`
      );
    }
    if (uploadedLeadershipUrls['rishi-katiyar']) {
      content = content.replace(
        /image:\s*["'][^"']*leader-2\.jpg["']/,
        `image: "${uploadedLeadershipUrls['rishi-katiyar']}"`
      );
    }
    fs.writeFileSync(leadershipDataPath, content, 'utf8');
    console.log(`✅ Updated ${leadershipDataPath} with Cloudinary URLs.`);
  }

  const projectsDataPath = path.join(rootDir, 'src/data/projectsData.js');
  if (fs.existsSync(projectsDataPath)) {
    let content = fs.readFileSync(projectsDataPath, 'utf8');
    for (const [slug, url] of Object.entries(uploadedProjectsUrls)) {
      const regex = new RegExp(`(slug:\\s*["']${slug}["'][\\s\\S]*?image:\\s*["'])[^"']+(["'])`);
      content = content.replace(regex, `$1${url}$2`);
    }
    fs.writeFileSync(projectsDataPath, content, 'utf8');
    console.log(`✅ Updated ${projectsDataPath} with Cloudinary URLs.`);
  }

  // Also update LeadershipPage.jsx fallback images if needed
  const leadershipPagePath = path.join(rootDir, 'src/pages/LeadershipPage.jsx');
  if (
    fs.existsSync(leadershipPagePath) &&
    uploadedLeadershipUrls['rammurti-katiyar'] &&
    uploadedLeadershipUrls['rishi-katiyar']
  ) {
    let lpContent = fs.readFileSync(leadershipPagePath, 'utf8');
    lpContent = lpContent.replace(
      /leaders\[0\]\?\.image \|\| ['"][^'"]+['"]/,
      `leaders[0]?.image || '${uploadedLeadershipUrls['rammurti-katiyar']}'`
    );
    lpContent = lpContent.replace(
      /leaders\[1\]\?\.image \|\| ['"][^'"]+['"]/,
      `leaders[1]?.image || '${uploadedLeadershipUrls['rishi-katiyar']}'`
    );
    fs.writeFileSync(leadershipPagePath, lpContent, 'utf8');
    console.log(`✅ Updated fallback URLs in ${leadershipPagePath}.`);
  }

  // 4. Update MongoDB database records
  console.log('\n--- [4/4] Updating MongoDB Database Records ---');
  if (process.env.MONGODB_URI) {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB.');

      const Leader =
        mongoose.models.Leader ||
        mongoose.model('Leader', new mongoose.Schema({}, { strict: false, collection: 'leaders' }));
      for (const [id, url] of Object.entries(uploadedLeadershipUrls)) {
        const updateResult = await Leader.updateOne({ id }, { $set: { image: url } });
        console.log(
          `MongoDB Leader [${id}] image updated: matched=${updateResult.matchedCount}, modified=${updateResult.modifiedCount}`
        );
      }

      const Project =
        mongoose.models.Project ||
        mongoose.model('Project', new mongoose.Schema({}, { strict: false, collection: 'projects' }));
      for (const [slug, url] of Object.entries(uploadedProjectsUrls)) {
        const updateResult = await Project.updateOne({ slug }, { $set: { image: url } });
        console.log(
          `MongoDB Project [${slug}] image updated: matched=${updateResult.matchedCount}, modified=${updateResult.modifiedCount}`
        );
      }

      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    } catch (dbErr) {
      console.error(
        '⚠️ Could not update MongoDB directly (server might be offline or IP restricted):',
        dbErr.message
      );
    }
  }

  console.log('\n🎉 ALL MEDIA SUCCESSFULLY SYNCED TO CLOUDINARY!');
}

runMigration().catch((err) => {
  console.error('\n❌ Migration Failed:', err);
  process.exit(1);
});
