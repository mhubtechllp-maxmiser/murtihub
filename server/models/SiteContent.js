import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    updatedBy: {
      type: String,
      default: 'system',
    },
  },
  {
    collection: 'site_contents',
    timestamps: true,
  }
);

export default mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema);
