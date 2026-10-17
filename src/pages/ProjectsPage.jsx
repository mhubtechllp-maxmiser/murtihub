import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import ProjectShowcase from '../components/projects/ProjectShowcase';
import CTASection from '../components/common/CTASection';
import './ProjectsPage.scss';

export default function ProjectsPage() {
  const [projects, setProjects] = useState(cmsService.getProjects());
  const [syncStatus, setSyncStatus] = useState(cmsService.getStatus());

  useEffect(() => {
    const unsubProjects = cmsService.subscribe('projects', setProjects);
    const unsubStatus = cmsService.subscribe('__status__', setSyncStatus);
    return () => {
      unsubProjects();
      unsubStatus();
    };
  }, []);

  const handleRetry = () => {
    cmsService.initRemoteSync(true).catch(() => {});
  };

  const projectList = Array.isArray(projects) ? projects : [];

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
          {syncStatus.isError && (
            <div className="cms-status-banner cms-error" role="alert" style={{ marginBottom: '2rem' }}>
              <AlertCircle size={18} />
              <span>Failed to load projects from MongoDB: {syncStatus.error}</span>
              <button type="button" className="retry-btn" onClick={handleRetry}>
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {projectList.length > 0 ? (
            <ProjectShowcase projects={projectList} />
          ) : syncStatus.isLoading ? (
            <div className="cms-section-loading" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }} />
              <p>Loading production projects from MongoDB...</p>
            </div>
          ) : (
            <div className="cms-section-empty" style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <p>No production projects are currently published in the database.</p>
            </div>
          )}
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
