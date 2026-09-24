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
  const [heroIndex, setHeroIndex] = useState(0);
  const displayedServices = services.slice(0, 3);
  const displayedProjects = projects.slice(0, 3);

  useEffect(() => {
    const unsubSlides = cmsService.subscribe('hero_slides', setSlides);
    const unsubServices = cmsService.subscribe('services', setServices);
    const unsubProjects = cmsService.subscribe('projects', setProjects);
    return () => {
      unsubSlides();
      unsubServices();
      unsubProjects();
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

          <ServiceGrid services={displayedServices} />
        </div>
      </section>


            {/* 6. Proven Production Realities (Featured Projects) */}
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

          <ProjectShowcase projects={displayedProjects} />
        </div>
      </section>

      {/* 8. Technical Engagement CTA */}
      <CTASection />
    </div>
  );
}

