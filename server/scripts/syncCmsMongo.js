/**
 * SAFE READ-ONLY CMS DATABASE AUDIT SCRIPT
 *
 * NOTE: Destructive automatic overwrite logic has been completely removed.
 * MongoDB is the single source of truth. This script only reads and logs
 * the document counts for each CMS collection without modifying any data.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function auditCmsDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  console.log('[CMS Audit] Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`[CMS Audit] Connected successfully to database: "${mongoose.connection.name}"`);

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\n[CMS Audit] Active Collections:');

  for (const coll of collections) {
    const count = await mongoose.connection.db.collection(coll.name).countDocuments();
    console.log(`  - ${coll.name}: ${count} document(s)`);
  }

  const siteContents = await mongoose.connection.db.collection('site_contents').find().toArray();
  console.log('\n[CMS Audit] site_contents keys:', siteContents.map((s) => s.key));

  await mongoose.disconnect();
  console.log('\n[CMS Audit] Audit completed safely without any modifications.');
}

auditCmsDatabase().catch((err) => {
  console.error('[CMS Audit Error]:', err.message);
  process.exit(1);
});
