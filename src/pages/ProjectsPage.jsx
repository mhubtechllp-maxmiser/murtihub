import React, { useState, useEffect } from 'react';
import { cmsService } from '../services/cmsService';
import SectionHeading from '../components/common/SectionHeading';
import ProjectShowcase from '../components/projects/ProjectShowcase';
import CTASection from '../components/common/CTASection';
import './ProjectsPage.scss';

export default function ProjectsPage() {
  const [projects, setProjects] = useState(cmsService.getProjects());

  useEffect(() => {
    const unsub = cmsService.subscribe('projects', setProjects);
    return () => unsub();
  }, []);

  return (
    <div className="projects-page-root">
      {/* Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <span className="banner-eyebrow">Portfolio // Our Published Work</span>
          <h1 className="banner-title text-display">
            Our Published&#10;Work.
          </h1>
          <p className="banner-desc lead-paragraph">
            Every platform documented here is active in production, architected with deterministic
            discipline, and operating with sovereign client ownership.
          </p>
        </div>
      </section>

      {/* Projects Editorial Showcase */}
      <section className="section section-light projects-showcase-section">
        <div className="container">
          <ProjectShowcase projects={projects} />
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Commission Your System Architecture"
        description="Partner with our systems engineers to build your next high-concurrency platform."
      />
    </div>
  );
}

