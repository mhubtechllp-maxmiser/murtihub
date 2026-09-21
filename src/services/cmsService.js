// ============================================================================
// MURTIHUB TECHNOLOGIES — CMS DATA SERVICE & REACTIVITY (MONGODB SYNC)
// ============================================================================

import { brandData } from '../data/brand';
import { initialHeroSlides } from '../data/heroSlides';
import { trustStats } from '../data/trustStats';
import { journeyStages } from '../data/journeyStages';
import { servicesData } from '../data/servicesData';
import { projectsData } from '../data/projectsData';
import { architectureData } from '../data/architectureData';
import { leadershipData } from '../data/leadershipData';
import { covenantData } from '../data/covenantData';
import { techArsenalData } from '../data/techArsenalData';
import { api } from './api';

const STORAGE_KEY_PREFIX = 'murtihub_cms_v5_';

function getStored(key, defaultValue) {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading CMS key ${key}:`, e);
    return defaultValue;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    notifyListeners(key, value);
  } catch (e) {
    console.error(`Error saving CMS key ${key}:`, e);
  }
}

// Reactivity listeners
const listeners = new Map();

function notifyListeners(key, value) {
  if (listeners.has(key)) {
    listeners.get(key).forEach((cb) => cb(value));
  }
  if (listeners.has('*')) {
    listeners.get('*').forEach((cb) => cb(key, value));
  }
}

// Map of default initial fallback datasets
const defaultDatasets = {
  brand: brandData,
  hero_slides: initialHeroSlides,
  trust_stats: trustStats,
  journey_stages: journeyStages,
  services: servicesData,
  projects: projectsData,
  architecture: architectureData,
  leadership: leadershipData,
  covenant: covenantData,
  tech_arsenal: techArsenalData,
};

export const cmsService = {
  // Subscribers
  subscribe(key, callback) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);
    return () => {
      listeners.get(key)?.delete(callback);
    };
  },

  // Sync all CMS keys from MongoDB on initial mount
  async initRemoteSync() {
    try {
      const res = await api.cms.getAll();
      if (res.success && res.data) {
        Object.entries(res.data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setStored(key, value);
          }
        });
      }
    } catch (err) {
      console.log('[CMS Sync] Using local cache / baseline data (backend offline or uninitialized)');
    }
  },

  // Async helper to save key locally and sync to MongoDB
  async persistKey(key, data) {
    setStored(key, data);
    try {
      await api.cms.update(key, data);
    } catch (err) {
      console.warn(`[CMS API] Failed to sync ${key} to MongoDB:`, err.message);
    }
  },

  // Brand Data
  getBrand() {
    return getStored('brand', brandData);
  },
  async updateBrand(newData) {
    const current = this.getBrand();
    const updated = { ...current, ...newData };
    await this.persistKey('brand', updated);
    return updated;
  },

  // Hero Slides
  getHeroSlides() {
    return getStored('hero_slides', initialHeroSlides);
  },
  async saveHeroSlides(slides) {
    await this.persistKey('hero_slides', slides);
    return slides;
  },
  async addHeroSlide(newSlide) {
    const current = this.getHeroSlides();
    const slide = {
      id: `slide-${Date.now()}`,
      image: newSlide.image || '/images/hero/hero-1.jpg',
      alt: newSlide.alt || 'MurtiHub Technology Workspace',
      caption: newSlide.caption || 'Institutional Digital Systems',
    };
    const updated = [...current, slide];
    await this.persistKey('hero_slides', updated);
    return updated;
  },
  async updateHeroSlide(id, updatedFields) {
    const current = this.getHeroSlides();
    const updated = current.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    await this.persistKey('hero_slides', updated);
    return updated;
  },
  async deleteHeroSlide(id) {
    const current = this.getHeroSlides();
    if (current.length <= 1) {
      alert('At least one hero slide must remain published.');
      return current;
    }
    const updated = current.filter((s) => s.id !== id);
    await this.persistKey('hero_slides', updated);
    return updated;
  },

  // Trust Statistics
  getTrustStats() {
    return getStored('trust_stats', trustStats);
  },
  async updateTrustStats(stats) {
    await this.persistKey('trust_stats', stats);
    return stats;
  },
  async addTrustStat(newStat) {
    const current = this.getTrustStats();
    const stat = {
      id: `stat-${Date.now()}`,
      number: newStat.number || 10,
      suffix: newStat.suffix || '+',
      label: newStat.label || 'New Milestone',
      description: newStat.description || 'Institutional metric description.',
    };
    const updated = [...current, stat];
    await this.persistKey('trust_stats', updated);
    return updated;
  },
  async deleteTrustStat(id) {
    const current = this.getTrustStats();
    if (current.length <= 1) {
      alert('At least one statistic must remain.');
      return current;
    }
    const updated = current.filter((s) => s.id !== id);
    await this.persistKey('trust_stats', updated);
    return updated;
  },

  // Journey Stages
  getJourneyStages() {
    return getStored('journey_stages', journeyStages);
  },

  // Services (Dynamic)
  getServices() {
    return getStored('services', servicesData);
  },
  getServiceBySlug(slug) {
    const services = this.getServices();
    return services.find((s) => s.slug === slug || s.id === slug);
  },
  async saveServices(services) {
    await this.persistKey('services', services);
    return services;
  },
  async addService(newSvc) {
    const current = this.getServices();
    const nextNum = current.length + 1;
    const formattedId = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    const slug = newSvc.slug || newSvc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const service = {
      id: formattedId,
      slug,
      title: newSvc.title || 'New Engineering Service',
      shortTitle: newSvc.shortTitle || newSvc.title || 'Engineering Service',
      cardLayout: newSvc.cardLayout || 'vertical-panel',
      description: newSvc.description || 'Institutional service description.',
      longDescription: newSvc.longDescription || newSvc.description || '',
      tags: Array.isArray(newSvc.tags) ? newSvc.tags : (newSvc.tags ? newSvc.tags.split(',').map((s) => s.trim()) : ['Enterprise']),
      capabilities: Array.isArray(newSvc.capabilities) ? newSvc.capabilities : [],
      technologies: Array.isArray(newSvc.technologies) ? newSvc.technologies : [],
      engineeringApproach: newSvc.engineeringApproach || '',
      relatedProjects: newSvc.relatedProjects || [],
    };
    const updated = [...current, service];
    await this.persistKey('services', updated);
    return updated;
  },
  async updateService(slug, updatedFields) {
    const services = this.getServices();
    const index = services.findIndex((s) => s.slug === slug || s.id === slug);
    if (index !== -1) {
      services[index] = { ...services[index], ...updatedFields };
      await this.persistKey('services', [...services]);
      return services[index];
    }
    return null;
  },
  async deleteService(slug) {
    const services = this.getServices();
    if (services.length <= 1) {
      alert('At least one service must remain published.');
      return services;
    }
    const updated = services.filter((s) => s.slug !== slug && s.id !== slug);
    await this.persistKey('services', updated);
    return updated;
  },

  // Projects (Dynamic)
  getProjects() {
    return getStored('projects', projectsData);
  },
  getProjectBySlug(slug) {
    const projects = this.getProjects();
    return projects.find((p) => p.slug === slug || p.id === slug);
  },
  async saveProjects(projects) {
    await this.persistKey('projects', projects);
    return projects;
  },
  async addProject(newProj) {
    const current = this.getProjects();
    const nextNum = current.length + 1;
    const formattedId = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    const slug = newProj.slug || newProj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const project = {
      id: formattedId,
      slug,
      name: newProj.name || 'New Project',
      title: newProj.title || 'Institutional System Deployment',
      status: newProj.status || 'Live',
      gridSpan: newProj.gridSpan || 'span-6',
      image: newProj.image || '/images/hero/hero-1.jpg',
      liveUrl: newProj.liveUrl || 'https://murtihub.co.in',
      description: newProj.description || 'Institutional project summary description.',
      overview: newProj.overview || newProj.description || '',
      challenge: newProj.challenge || '',
      engineeringApproach: newProj.engineeringApproach || '',
      architecture: newProj.architecture || '',
      metrics: Array.isArray(newProj.metrics) ? newProj.metrics : [
        { value: '100%', label: 'Delivery Integrity', sub: 'Verified' },
      ],
      stack: Array.isArray(newProj.stack) ? newProj.stack : (newProj.stack ? newProj.stack.split(',').map((s) => s.trim()) : ['React', 'Node.js']),
      outcome: newProj.outcome || '',
      relatedProjects: newProj.relatedProjects || [],
    };
    const updated = [...current, project];
    await this.persistKey('projects', updated);
    return updated;
  },
  async updateProject(slug, updatedFields) {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.slug === slug || p.id === slug);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updatedFields };
      await this.persistKey('projects', [...projects]);
      return projects[index];
    }
    return null;
  },
  async deleteProject(slug) {
    const projects = this.getProjects();
    if (projects.length <= 1) {
      alert('At least one project must remain published.');
      return projects;
    }
    const updated = projects.filter((p) => p.slug !== slug && p.id !== slug);
    await this.persistKey('projects', updated);
    return updated;
  },

  // Architecture Data
  getArchitecture() {
    return getStored('architecture', architectureData);
  },

  // Leadership Data
  getLeadership() {
    const stored = getStored('leadership', null);
    if (!stored) return leadershipData;
    return {
      ...leadershipData,
      ...stored,
      leaders: stored.leaders || (stored.leader ? [stored.leader] : leadershipData.leaders),
      leader: (stored.leaders && stored.leaders[0]) || stored.leader || leadershipData.leader,
      ethosPillars: stored.ethosPillars || leadershipData.ethosPillars,
    };
  },
  async updateLeadership(data) {
    const leaders = data.leaders || (data.leader ? [data.leader] : []);
    const updated = {
      ...leadershipData,
      ...data,
      leaders,
      leader: leaders[0] || data.leader || leadershipData.leader,
      ethosPillars: data.ethosPillars || leadershipData.ethosPillars,
    };
    await this.persistKey('leadership', updated);
    return updated;
  },
  async addLeader(newLeader) {
    const current = this.getLeadership();
    const leaders = current.leaders || [];
    const leaderId = newLeader.id || newLeader.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const leader = {
      id: leaderId,
      name: newLeader.name || 'Executive Partner',
      title: newLeader.title || 'Senior Designated Partner',
      role: newLeader.role || 'Partner | Engineering',
      image: newLeader.image || '/images/leader.jpg',
      bio: Array.isArray(newLeader.bio) ? newLeader.bio : [newLeader.bio || 'Executive profile biography.'],
      values: newLeader.values || [],
      quotes: newLeader.quotes || {
        about: 'Engineering systems with institutional integrity.',
        leadership: 'True technical leadership eliminates complexity.',
      },
    };
    const updated = {
      ...current,
      leaders: [...leaders, leader],
    };
    await this.persistKey('leadership', updated);
    return updated;
  },
  async deleteLeader(leaderId) {
    const current = this.getLeadership();
    const leaders = current.leaders || [];
    if (leaders.length <= 1) {
      alert('At least one leader profile must remain.');
      return current;
    }
    const updated = {
      ...current,
      leaders: leaders.filter((l) => l.id !== leaderId),
    };
    await this.persistKey('leadership', updated);
    return updated;
  },

  // Covenant Data
  getCovenant() {
    return getStored('covenant', covenantData);
  },

  // Tech Arsenal
  getTechArsenal() {
    return getStored('tech_arsenal', techArsenalData);
  },

  // Contact Submissions
  async getSubmissions() {
    try {
      const res = await api.contact.list();
      if (res.success && res.submissions) {
        setStored('contact_submissions', res.submissions);
        return res.submissions;
      }
    } catch (err) {
      console.log('[Submissions] Loading cached submissions:', err.message);
    }
    return getStored('contact_submissions', []);
  },

  async submitContactForm(formData) {
    try {
      const res = await api.contact.submit(formData);
      return res;
    } catch (err) {
      console.error('[Contact Form API Error]:', err);
      // Fallback local save
      const submissions = getStored('contact_submissions', []);
      const newSubmission = {
        _id: `local-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        projectType: formData.projectType,
        message: formData.message,
        status: 'Unread',
        createdAt: new Date().toISOString(),
      };
      setStored('contact_submissions', [newSubmission, ...submissions]);
      return { success: true, message: 'Message saved locally (offline mode)' };
    }
  },

  async markSubmissionHandled(id) {
    try {
      await api.contact.updateStatus(id, 'Handled');
    } catch (err) {
      console.warn('Could not update status on backend:', err.message);
    }
    const submissions = getStored('contact_submissions', []);
    const updated = submissions.map((sub) =>
      (sub._id === id || sub.id === id) ? { ...sub, status: 'Handled' } : sub
    );
    setStored('contact_submissions', updated);
    return updated;
  },

  async deleteSubmission(id) {
    try {
      await api.contact.delete(id);
    } catch (err) {
      console.warn('Could not delete on backend:', err.message);
    }
    const submissions = getStored('contact_submissions', []);
    const updated = submissions.filter((sub) => sub._id !== id && sub.id !== id);
    setStored('contact_submissions', updated);
    return updated;
  },

  // Reset to initial baseline
  resetToDefaults() {
    Object.keys(defaultDatasets).forEach((k) => {
      localStorage.removeItem(STORAGE_KEY_PREFIX + k);
    });
    notifyListeners('*', null);
  },
};

// Initiate background sync on file load
if (typeof window !== 'undefined') {
  cmsService.initRemoteSync();
}
