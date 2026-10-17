import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortTitle: { type: String, default: '' },
    cardLayout: { type: String, default: 'standard' },
    description: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    tags: [{ type: String }],
    capabilities: [{ type: String }],
    engineeringApproach: { type: String, default: '' },
    technologies: [{ type: String }],
    relatedProjects: [{ type: String }],
    coverImage: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  {
    collection: 'services',
    timestamps: true,
  }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
