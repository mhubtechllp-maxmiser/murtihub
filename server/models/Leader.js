import mongoose from 'mongoose';

const LeaderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    role: { type: String, default: '' },
    image: { type: String, default: '/images/leader.jpg' },
    bio: { type: mongoose.Schema.Types.Mixed, default: [] },
    quotes: {
      about: { type: String, default: '' },
      leadership: { type: String, default: '' },
    },
    values: { type: Array, default: [] },
  },
  {
    collection: 'leaders',
    timestamps: true,
  }
);

export default mongoose.models.Leader || mongoose.model('Leader', LeaderSchema);