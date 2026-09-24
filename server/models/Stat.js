import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    number: { type: mongoose.Schema.Types.Mixed, required: true },
    suffix: { type: String, default: '+' },
    label: { type: String, required: true },
    description: { type: String, default: '' },
  },
  {
    collection: 'stats',
    timestamps: true,
  }
);

export default mongoose.models.Stat || mongoose.model('Stat', StatSchema);