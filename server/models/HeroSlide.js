import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    mobileImage: { type: String, default: '' },
    alt: { type: String, default: 'MurtiHub Technologies' },
    eyebrow: { type: String, default: 'Engineering A More Open Tomorrow' },
    headlineLines: [{ type: String }],
    description: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Start a project' },
    ctaUrl: { type: String, default: '/contact' },
    secondaryCtaLabel: { type: String, default: 'View our work' },
    secondaryCtaUrl: { type: String, default: '/projects' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  {
    collection: 'hero_slides',
    timestamps: true,
  }
);

export default mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);
