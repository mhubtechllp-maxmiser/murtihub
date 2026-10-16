import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { projectsData } from '../../src/data/projectsData.js';
import { leadershipData } from '../../src/data/leadershipData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function sync() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map((c) => c.name));

  for (const coll of collections) {
    if (coll.name.includes('content') || coll.name.includes('cms')) {
      await mongoose.connection.db.collection(coll.name).updateOne(
        { key: 'projects' },
        { $set: { data: projectsData, updatedAt: new Date() } }
      );
      await mongoose.connection.db.collection(coll.name).updateOne(
        { key: 'leadership' },
        { $set: { data: leadershipData, updatedAt: new Date() } }
      );
      console.log(`Updated projects and leadership in ${coll.name}`);
    }
  }

  if (collections.some((c) => c.name === 'projects')) {
    await mongoose.connection.db.collection('projects').deleteMany({});
    await mongoose.connection.db.collection('projects').insertMany(projectsData);
    console.log('Replaced projects collection with official 5 projectsData items');
  }

  if (collections.some((c) => c.name === 'leaders')) {
    for (const l of leadershipData.leaders) {
      await mongoose.connection.db.collection('leaders').updateOne(
        { id: l.id },
        { $set: { image: l.image } }
      );
    }
    console.log('Updated leaders collection');
  }

  await mongoose.disconnect();
  console.log('Sync complete!');
}

sync().catch(console.error);
