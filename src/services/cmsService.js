// ============================================================================
// MURTIHUB TECHNOLOGIES — STRICT MONGODB-BACKED CMS DATA SERVICE
// ============================================================================
// Single source of truth: MongoDB Atlas (Database: MurtihubNew)
// Automatic mock fallbacks and mock database writes have been removed.
// ============================================================================

import { api } from './api';
import { mainNavigation, footerNavigation } from '../data/navigation';
import { journeyStages as staticJourneyStages } from '../data/journeyStages';
import { architectureData as staticArchitectureData } from '../data/architectureData';
import { techArsenalData as staticTechArsenalData } from '../data/techArsenalData';

const CACHE_PREFIX = 'murtihub_cms_db_v1_';
const OLD_STORAGE_PREFIX = 'murtihub_cms_v16_';

// Purge any legacy mock cache saved in earlier builds
if (typeof window !== 'undefined') {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(OLD_STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    // Ignore storage access errors
  }
}

// In-memory state holding real MongoDB CMS content
const cmsState = {
  projects: null,
  trust_stats: null,
  leadership: null,
  hero_slides: null,
  services: null,
  brand: null,
  covenant: null,
  navigation: null,
  seo: null,
  journey_stages: null,
  architecture: null,
  tech_arsenal: null,
};

// Sync lifecycle status
const syncStatus = {
  isLoading: true,
  isInitialized: false,
  isError: false,
  error: null,
  lastSyncedAt: null,
};

// Reactivity listeners
const listeners = new Map();

function notifyListeners(key, value) {
  if (listeners.has(key)) {
    listeners.get(key).forEach((cb) => {
      try {
        cb(value);
      } catch (e) {
        console.error(`Error in CMS subscriber for "${key}":`, e);
      }
    });
  }
  if (listeners.has('*')) {
    listeners.get('*').forEach((cb) => {
      try {
        cb(key, value);
      } catch (e) {
        console.error('Error in wildcard CMS subscriber:', e);
      }
    });
  }
}

function getCached(key) {
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
}

function setCached(key, value) {
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(CACHE_PREFIX + key);
    } else {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`[CMS Cache] Could not cache key "${key}":`, e.message);
  }
}

// Seed in-memory state from verified previous DB cache if available
if (typeof window !== 'undefined') {
  [
    'projects',
    'trust_stats',
    'leadership',
    'hero_slides',
    'services',
    'brand',
    'covenant',
    'navigation',
    'seo',
    'journey_stages',
    'architecture',
    'tech_arsenal',
  ].forEach((key) => {
    const cached = getCached(key);
    if (cached !== null) {
      cmsState[key] = cached;
    }
  });
}

let activeSyncPromise = null;

export const cmsService = {
  // Subscribe to updates for a specific key, or '*' for any change
  subscribe(key, callback) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);
    return () => {
      listeners.get(key)?.delete(callback);
    };
  },

  // Get current sync lifecycle status
  getStatus() {
    return { ...syncStatus };
  },

  // Sync all CMS collections from MongoDB
  async initRemoteSync(force = false) {
    if (activeSyncPromise && !force) {
      return activeSyncPromise;
    }

    syncStatus.isLoading = true;
    syncStatus.isError = false;
    syncStatus.error = null;
    notifyListeners('__status__', syncStatus);

    activeSyncPromise = (async () => {
      try {
        const res = await api.cms.getAll();
        if (res && res.success && res.data) {
          const data = res.data;

          cmsState.projects = Array.isArray(data.projects) ? data.projects : [];
          cmsState.trust_stats = Array.isArray(data.trust_stats) ? data.trust_stats : [];
          cmsState.leadership = data.leadership && Array.isArray(data.leadership.leaders)
            ? data.leadership
            : { leaders: Array.isArray(data.leadership) ? data.leadership : [] };
          cmsState.hero_slides = Array.isArray(data.hero_slides) ? data.hero_slides : [];
          cmsState.services = Array.isArray(data.services) ? data.services : [];
          cmsState.brand = data.brand || null;
          cmsState.covenant = data.covenant || null;
          cmsState.navigation = data.navigation || null;
          cmsState.seo = data.seo || null;
          cmsState.journey_stages = data.journey_stages || null;
          cmsState.architecture = data.architecture || null;
          cmsState.tech_arsenal = data.tech_arsenal || null;

          // Cache verified database responses for offline resilience
          Object.entries(cmsState).forEach(([key, val]) => {
            if (val !== null && val !== undefined) {
              setCached(key, val);
              notifyListeners(key, val);
            }
          });

          syncStatus.isLoading = false;
          syncStatus.isInitialized = true;
          syncStatus.isError = false;
          syncStatus.lastSyncedAt = Date.now();
          notifyListeners('*', cmsState);
          notifyListeners('__status__', syncStatus);
          return { success: true, data: cmsState };
        } else {
          throw new Error(res?.message || 'Invalid CMS response structure from MongoDB');
        }
      } catch (err) {
        console.error('[CMS Sync Error]: Failed to fetch website content from MongoDB:', err.message);
        syncStatus.isLoading = false;
        syncStatus.isError = true;
        syncStatus.error = err.message || 'Failed to connect to backend CMS service';
        notifyListeners('__status__', syncStatus);
        throw err;
      } finally {
        activeSyncPromise = null;
      }
    })();

    return activeSyncPromise;
  },

  // Authorized intentional save action to MongoDB
  async persistKey(key, data) {
    if (data === undefined || data === null) {
      throw new Error(`Cannot persist undefined or null data for key "${key}"`);
    }

    // Call backend PUT /api/cms/:key (protected with JWT & RBAC)
    const res = await api.cms.update(key, data);
    if (!res || !res.success) {
      throw new Error(res?.message || `Failed to update "${key}" in MongoDB`);
    }

    // Update in-memory state and cache upon confirmed persistence
    cmsState[key] = data;
    setCached(key, data);
    notifyListeners(key, data);
    notifyListeners('*', cmsState);

    return res;
  },

  // ==========================================
  // BRAND STANDARDS
  // ==========================================
  getBrand() {
    return (
      cmsState.brand || {
        companyName: 'MurtiHub Technologies',
        shortName: 'MurtiHub',
        tagline: 'Engineering A More Open Tomorrow',
        headline: 'Ideas Today\nImpact Tomorrow',
        description:
          'We build digital solutions, scalable web systems, and modern products that help businesses innovate and grow.',
        email: 'enquiry@murtihub.co.in',
        responseSLA: '< 24 Hours',
        incorporationYear: '2026',
        legalStructure: 'Incorporated Enterprise',
        copyright: '© 2026 MurtiHub Technologies. All rights reserved.',
        motto: 'Craftsmanship over commodity',
      }
    );
  },
  async updateBrand(newData) {
    const current = this.getBrand();
    const updated = { ...current, ...newData };
    await this.persistKey('brand', updated);
    return updated;
  },

  // ==========================================
  // HERO SLIDES (Dynamic from MongoDB hero_slides)
  // ==========================================
  getHeroSlides() {
    return cmsState.hero_slides;
  },
  async updateHeroSlides(slides) {
    await this.persistKey('hero_slides', slides);
    return slides;
  },

  // ==========================================
  // EXECUTIVE LEADERSHIP (Dynamic from MongoDB leaders)
  // ==========================================
  getLeadership() {
    return cmsState.leadership;
  },
  async updateLeadership(newLeadershipData) {
    await this.persistKey('leadership', newLeadershipData);
    return newLeadershipData;
  },

  // ==========================================
  // TRUST STATISTICS (Dynamic from MongoDB stats)
  // ==========================================
  getTrustStats() {
    return cmsState.trust_stats;
  },
  async updateTrustStats(stats) {
    await this.persistKey('trust_stats', stats);
    return stats;
  },
  async addTrustStat(newStat) {
    const current = this.getTrustStats() || [];
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
    const current = this.getTrustStats() || [];
    if (current.length <= 1) {
      throw new Error('At least one statistic must remain published.');
    }
    const updated = current.filter((s) => s.id !== id);
    await this.persistKey('trust_stats', updated);
    return updated;
  },

  // ==========================================
  // SERVICES (Dynamic from MongoDB services)
  // ==========================================
  getServices() {
    return cmsState.services;
  },
  getServiceBySlug(slug) {
    const services = this.getServices();
    if (!services || !Array.isArray(services)) return null;
    return services.find((s) => s.slug === slug || s.id === slug) || null;
  },
  async updateServices(services) {
    await this.persistKey('services', services);
    return services;
  },

  // ==========================================
  // PROJECTS (Dynamic from MongoDB projects)
  // ==========================================
  getProjects() {
    return cmsState.projects;
  },
  getProjectBySlug(slug) {
    const projects = this.getProjects();
    if (!projects || !Array.isArray(projects)) return null;
    return projects.find((p) => p.slug === slug || p.id === slug) || null;
  },
  async saveProjects(projects) {
    await this.persistKey('projects', projects);
    return projects;
  },
  async addProject(newProj) {
    const current = this.getProjects() || [];
    const nextNum = current.length + 1;
    const formattedId = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    const slug =
      newProj.slug ||
      newProj.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const project = {
      id: formattedId,
      slug,
      name: newProj.name || 'New Project',
      title: newProj.title || 'Institutional System Deployment',
      status: newProj.status || 'Live',
      gridSpan: newProj.gridSpan || 'span-12',
      image: newProj.image || '/images/hero/hero-bg.webp',
      liveUrl: newProj.liveUrl || 'https://murtihub.co.in',
      description: newProj.description || 'Institutional project summary description.',
      overview: newProj.overview || newProj.description || '',
      challenge: newProj.challenge || '',
      engineeringApproach: newProj.engineeringApproach || '',
      architecture: newProj.architecture || '',
      metrics: Array.isArray(newProj.metrics)
        ? newProj.metrics
        : [{ value: '100%', label: 'Delivery Integrity', sub: 'Verified' }],
      stack: Array.isArray(newProj.stack)
        ? newProj.stack
        : newProj.stack
        ? newProj.stack.split(',').map((s) => s.trim())
        : ['React', 'Node.js'],
      outcome: newProj.outcome || '',
      relatedProjects: newProj.relatedProjects || [],
    };
    const updated = [...current, project];
    await this.persistKey('projects', updated);
    return updated;
  },
  async updateProject(slug, updatedFields) {
    const projects = this.getProjects() || [];
    const index = projects.findIndex((p) => p.slug === slug || p.id === slug);
    if (index !== -1) {
      const updatedList = [...projects];
      updatedList[index] = { ...updatedList[index], ...updatedFields };
      await this.persistKey('projects', updatedList);
      return updatedList[index];
    }
    throw new Error(`Project with slug "${slug}" not found in database.`);
  },
  async deleteProject(slug) {
    const projects = this.getProjects() || [];
    if (projects.length <= 1) {
      throw new Error('At least one project must remain published.');
    }
    const updated = projects.filter((p) => p.slug !== slug && p.id !== slug);
    await this.persistKey('projects', updated);
    return updated;
  },

  // ==========================================
  // COVENANT (Dynamic from MongoDB site_contents)
  // ==========================================
  getCovenant() {
    return cmsState.covenant;
  },
  async updateCovenant(covenantData) {
    await this.persistKey('covenant', covenantData);
    return covenantData;
  },

  // ==========================================
  // NAVIGATION (Dynamic from MongoDB site_contents)
  // ==========================================
  getNavigation() {
    return (
      cmsState.navigation || {
        main: mainNavigation,
        footer: footerNavigation,
      }
    );
  },
  async updateNavigation(navigationData) {
    await this.persistKey('navigation', navigationData);
    return navigationData;
  },

  // ==========================================
  // ARCHITECTURE & TECH ARSENAL & JOURNEY
  // ==========================================
  getJourneyStages() {
    return cmsState.journey_stages || staticJourneyStages;
  },
  getArchitecture() {
    return cmsState.architecture || staticArchitectureData;
  },
  getTechArsenal() {
    return cmsState.tech_arsenal || staticTechArsenalData;
  },

  // ==========================================
  // CONTACT SUBMISSIONS (Strict Real API)
  // ==========================================
  async getSubmissions() {
    const res = await api.contact.list();
    if (res && res.success && res.submissions) {
      return res.submissions;
    }
    return [];
  },

  async submitContactForm(formData) {
    // Submit directly to MongoDB backend without fake offline saving
    const res = await api.contact.submit(formData);
    return res;
  },

  async markSubmissionHandled(id) {
    await api.contact.updateStatus(id, 'Handled');
    return this.getSubmissions();
  },

  async deleteSubmission(id) {
    await api.contact.delete(id);
    return this.getSubmissions();
  },

  // Clear local cache without resetting to mock datasets
  clearCache() {
    if (typeof window !== 'undefined') {
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(CACHE_PREFIX) || key.startsWith(OLD_STORAGE_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {
        // Ignore
      }
    }
    notifyListeners('*', null);
  },
};

// Initiate remote database sync on file load
if (typeof window !== 'undefined') {
  cmsService.initRemoteSync().catch((err) => {
    console.warn('[CMS Service] Initial MongoDB sync deferred:', err.message);
  });
}
