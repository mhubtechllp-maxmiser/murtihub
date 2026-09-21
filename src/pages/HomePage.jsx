import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Cpu, Code2, Award } from 'lucide-react';
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
  const [slides, setSlides] = useState(cmsService.getHeroSlides());
  const [services, setServices] = useState(cmsService.getServices());
  const [projects, setProjects] = useState(cmsService.getProjects());
  const [leadership, setLeadership] = useState(cmsService.getLeadership());
  const [heroIndex, setHeroIndex] = useState(0);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const displayedServices = showAllServices ? services : services.slice(0, 3);
  const displayedProjects = showAllProjects ? projects : projects.slice(0, 3);

  useEffect(() => {
    const unsubSlides = cmsService.subscribe('hero_slides', setSlides);
    const unsubServices = cmsService.subscribe('services', setServices);
    const unsubProjects = cmsService.subscribe('projects', setProjects);
    const unsubLeadership = cmsService.subscribe('leadership', setLeadership);
    return () => {
      unsubSlides();
      unsubServices();
      unsubProjects();
      unsubLeadership();
    };
  }, []);

  // Auto-advance carousel every 7 s
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const leader = (leadership?.leaders && leadership.leaders[0]) || leadership?.leader || {};
  const ethosPillars = leadership?.ethosPillars || [];
  const leaderQuote = leader?.quotes?.about || leader?.quotes?.leadership || 'Engineering systems with institutional integrity.';

  return (
    <div className="home-page-root">
      {/* 1. Full-Width Cinematic Hero Section */}
      <section className="home-hero-section" aria-label="Hero Introduction">
        <HeroCarousel slides={slides} currentIndex={heroIndex} />
        <HeroContent slides={slides} currentIndex={heroIndex} />
      </section>

      {/* 2. Institutional Trust Statistics Strip */}
      <StatStrip />

      {/* 3. Four-Stage Journey Storytelling */}
      <JourneySection />

      {/* 4. Digital Engineering Services (Asymmetric Mosaic) */}
      <section className="section section-light home-services-section" aria-label="Digital Engineering Disciplines">
        <div className="container">
          <SectionHeading
            eyebrow="Digital Engineering Services"
            title="Digital Engineering&#10;Built For What's Next."
            subtitle="Ideas | Systems | People | A Brighter Tomorrow"
            description="We do not construct disposable commodity software. Every system, interface, and protocol is architected with institutional precision, anticipating scale before the first deploy."
            alignment="split"
          />

          <ServiceGrid services={displayedServices} />

          <div className="services-section-footer">
            {!showAllServices ? (
              <button
                type="button"
                className="btn btn-outline services-toggle-btn"
                onClick={() => setShowAllServices(true)}
              >
                <span>View More Disciplines</span>
                <ArrowRight size={15} className="btn-hover-arrow" />
              </button>
            ) : (
              <div className="services-expanded-footer">
                <button
                  type="button"
                  className="btn btn-outline services-toggle-btn"
                  onClick={() => setShowAllServices(false)}
                >
                  <span>Show Less</span>
                </button>
                <Link to="/services" className="btn btn-primary">
                  <span>Explore All 6 Engineering Disciplines</span>
                  <ArrowRight size={15} className="btn-hover-arrow" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* 6. Proven Production Realities (Featured Projects) */}
      <section className="section section-light home-projects-section" aria-label="Production Case Studies">
        <div className="container">
          <SectionHeading
            eyebrow="Proven Production Realities"
            title="Our Published Work"
            subtitle="Literary Sanctuary • Streaming CDN • Realtime WebGL • Cryptographic Mesh • Escrow Engine"
            description="Explore our sovereign software platforms deployed in production environments across demanding institutional domains."
            alignment="split"
          />

          <ProjectShowcase projects={displayedProjects} />

          <div className="projects-section-footer">
            {!showAllProjects ? (
              <button
                type="button"
                className="btn btn-outline projects-toggle-btn"
                onClick={() => setShowAllProjects(true)}
              >
                <span>View More Published Work</span>
                <ArrowRight size={15} className="btn-hover-arrow" />
              </button>
            ) : (
              <div className="projects-expanded-footer">
                <button
                  type="button"
                  className="btn btn-outline projects-toggle-btn"
                  onClick={() => setShowAllProjects(false)}
                >
                  <span>Show Less</span>
                </button>
                <Link to="/projects" className="btn btn-primary">
                  <span>Explore All {projects.length} Published Works</span>
                  <ArrowRight size={15} className="btn-hover-arrow" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Organizational Ethos & Chairperson Quote */}
      <section className="section section-surface home-ethos-section" aria-label="Organizational Ethos">
        <div className="container">
          <SectionHeading
            eyebrow="Organizational Ethos"
            title="Engineering With Purpose."
            subtitle="Absolute Transparency • 100% Client IP Ownership • Executive Partnership"
            description="Our foundational commitment to ethical software stewardship and long-horizon client value."
            alignment="left"
          />

          <div className="ethos-pillars-grid">
            {ethosPillars.map((item, idx) => (
              <div key={idx} className="ethos-card">
                <span className="ethos-idx">0{idx + 1}</span>
                <h4 className="ethos-title">{item.title}</h4>
                <p className="ethos-desc">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="ethos-quote-block">
            <blockquote className="editorial-quote">
              <p>"{leader.quotes.about}"</p>
              <p>"{leaderQuote}"</p>
              <footer className="ethos-attribution">
                <strong>{leader.name}</strong>
                <span>Founder & Chairperson, MurtiHub Technologies</span>
                <span>{leader.title || 'Founder & Chairperson, MurtiHub Technologies'}</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* 8. Technical Engagement CTA */}
      <CTASection />
    </div>
  );
}

