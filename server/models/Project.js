import mongoose from 'mongoose';

const MetricSchema = new mongoose.Schema(
  {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    sub: { type: String, default: '' },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    title: { type: String, default: '' },
    status: { type: String, default: 'Live' },
    gridSpan: { type: String, default: 'span-6' },
    image: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    overview: { type: String, default: '' },
    challenge: { type: String, default: '' },
    engineeringApproach: { type: String, default: '' },
    architecture: { type: String, default: '' },
    metrics: [MetricSchema],
    stack: [{ type: String }],
    outcome: { type: String, default: '' },
    relatedProjects: [{ type: String }],
  },
  {
    collection: 'projects',
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);