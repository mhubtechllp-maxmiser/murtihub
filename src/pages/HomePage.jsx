import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import HeroCarousel from '../components/hero/HeroCarousel';
import HeroContent from '../components/hero/HeroContent';
import StatStrip from '../components/common/StatStrip';
import JourneySection from '../components/journey/JourneySection';
import SectionHeading from '../components/common/SectionHeading';
import ServiceGrid from '../components/services/ServiceGrid';
import ProjectShowcase from '../components/projects/ProjectShowcase';
import CTASection from '../components/common/CTASection';
import './HomePage.scss';

export default function HomePage() {
  const [slides, setSlides] = useState(cmsService.getHeroSlides() || []);
  const [services, setServices] = useState(cmsService.getServices() || []);
  const [projects, setProjects] = useState(cmsService.getProjects() || []);
  const [syncStatus, setSyncStatus] = useState(cmsService.getStatus());
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const unsubSlides = cmsService.subscribe('hero_slides', (val) => setSlides(val || []));
    const unsubServices = cmsService.subscribe('services', (val) => setServices(val || []));
    const unsubProjects = cmsService.subscribe('projects', (val) => setProjects(val || []));
    const unsubStatus = cmsService.subscribe('__status__', setSyncStatus);

    return () => {
      unsubSlides();
      unsubServices();
      unsubProjects();
      unsubStatus();
    };
  }, []);

  // Auto-advance carousel every 7s if slides exist
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides]);

  const handleRetry = () => {
    cmsService.initRemoteSync(true).catch(() => {});
  };

  const displayedServices = Array.isArray(services) ? services.slice(0, 4) : [];
  const displayedProjects = Array.isArray(projects) ? projects.slice(0, 4) : [];

  return (
    <div className="home-page-root">
      {/* Real-time API Connection Error Notice */}
      {syncStatus.isError && (
        <aside className="cms-status-banner cms-error" role="alert">
          <div className="container">
            <div className="status-banner-inner">
              <AlertCircle size={18} />
              <span>
                Unable to synchronize live website content from MongoDB database: {syncStatus.error}
              </span>
              <button type="button" className="retry-btn" onClick={handleRetry}>
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 1. Full-Width Cinematic Hero Section */}
      <section className="home-hero-section" aria-label="Hero Introduction">
        {slides && slides.length > 0 ? (
          <>
            <HeroCarousel slides={slides} currentIndex={heroIndex} />
            <HeroContent slides={slides} currentIndex={heroIndex} />
          </>
        ) : (
          <div className="hero-loading-state">
            <div className="hero-cinematic-overlay" />
            <div className="container hero-loading-container">
              {syncStatus.isLoading ? (
                <div className="loading-indicator">
                  <div className="loading-spinner" />
                  <p>Loading live platform data from MongoDB...</p>
                </div>
              ) : (
                <div className="empty-indicator">
                  <p>No active hero slides published in MongoDB.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. Institutional Trust Statistics Strip */}
      <StatStrip />

      {/* 3. Four-Stage Journey Storytelling */}
      <JourneySection />

      {/* 4. Digital Engineering Services */}
      <section className="section section-light home-services-section" aria-label="Digital Engineering Disciplines">
        <div className="container">
          <SectionHeading
            eyebrow="Capabilities & Disciplines"
            title="Our Proposed Services"
            alignment="split"
            action={
              <Link to="/services" className="btn btn-outline services-toggle-btn">
                <span>View Our Services</span>
                <ArrowRight size={15} className="btn-hover-arrow" />
              </Link>
            }
          />

          {displayedServices.length > 0 ? (
            <ServiceGrid services={displayedServices} />
          ) : syncStatus.isLoading ? (
            <div className="cms-section-loading">
              <div className="loading-spinner" />
              <p>Loading published services from database...</p>
            </div>
          ) : (
            <div className="cms-section-empty">
              <p>No services currently published in MongoDB.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Proven Production Realities (Featured Projects) */}
      <section className="section section-light home-projects-section" aria-label="Production Case Studies">
        <div className="container">
          <SectionHeading
            eyebrow="Proven Production Realities"
            title="Our Published Work"
            alignment="split"
            action={
              <Link to="/projects" className="btn btn-outline projects-toggle-btn">
                <span>View All Projects</span>
                <ArrowRight size={15} className="btn-hover-arrow" />
              </Link>
            }
          />

          {displayedProjects.length > 0 ? (
            <ProjectShowcase projects={displayedProjects} />
          ) : syncStatus.isLoading ? (
            <div className="cms-section-loading">
              <div className="loading-spinner" />
              <p>Loading verified projects from database...</p>
            </div>
          ) : (
            <div className="cms-section-empty">
              <p>No production projects currently published in MongoDB.</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. Technical Engagement CTA */}
      <CTASection />
    </div>
  );
}
