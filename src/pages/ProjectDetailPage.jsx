import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Cpu, Code2, CheckCircle2, Layers } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import CTASection from '../components/common/CTASection';
import './ProjectDetailPage.scss';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = cmsService.getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const allProjects = cmsService.getProjects();
  const related = allProjects.filter((p) =>
    project.relatedProjects ? project.relatedProjects.includes(p.slug) : false
  );

  return (
    <div className="project-detail-root">
      {/* 1. Project Hero */}
      <section className="project-hero-header">
        <div className="container">
          <div className="breadcrumb-nav">
            <Link to="/projects" className="breadcrumb-back">
              <ArrowLeft size={14} />
              <span>All Projects</span>
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-curr">{project.name}</span>
          </div>

          <div className="project-hero-meta">
            <span className="hero-proj-id">Case Study // {project.id}</span>
            <div className={`status-beacon ${project.status?.toUpperCase() === 'DEPLOYED' ? 'status-deployed' : ''}`}>
              <span>{project.status}</span>
            </div>
          </div>

          <span className="hero-inst-name">{project.name}</span>
          <h1 className="project-hero-title text-display">{project.title}</h1>
          <p className="project-hero-lead lead-paragraph">{project.description}</p>
        </div>
      </section>

      {/* Flagship Media & Key Metrics Strip */}
      <section className="project-media-section">
        <div className="container">
          <div className="project-hero-image-frame">
            <img src={project.image} alt={project.title} className="project-detail-img" />
          </div>

          {project.metrics && (
            <div className="project-metrics-banner">
              <div className="metrics-banner-grid">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="metric-box">
                    <span className="m-val">{m.value}</span>
                    <span className="m-key">{m.label}</span>
                    <span className="m-sub">{m.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Overview, Challenge & Engineering Approach */}
      <section className="section section-light project-deepdive-section">
        <div className="container">
          <div className="deepdive-grid">
            <div className="deepdive-main">
              {/* Overview */}
              <div className="deepdive-block">
                <span className="technical-label">Project Overview</span>
                <h2 className="deepdive-heading text-h2">Architectural Mission</h2>
                <p className="lead-paragraph">{project.overview}</p>
              </div>

              {/* Challenge */}
              <div className="deepdive-block">
                <span className="technical-label">The Technical Challenge</span>
                <h3 className="deepdive-heading text-h2">Engineering Constraints & Friction</h3>
                <p className="deepdive-body">{project.challenge}</p>
              </div>

              {/* Engineering Approach */}
              <div className="deepdive-block">
                <span className="technical-label">Engineering Approach</span>
                <h3 className="deepdive-heading text-h2">First-Principles Solution</h3>
                <p className="deepdive-body">{project.engineeringApproach}</p>
              </div>

              {/* Architecture */}
              <div className="deepdive-block">
                <span className="technical-label">System Topology</span>
                <h3 className="deepdive-heading text-h2">Underlying Infrastructure</h3>
                <p className="deepdive-body">{project.architecture}</p>
              </div>

              {/* Outcome */}
              <div className="deepdive-block outcome-block">
                <span className="technical-label">Measured Outcome</span>
                <h3 className="deepdive-heading text-h2">Institutional Impact</h3>
                <p className="deepdive-body">{project.outcome}</p>
              </div>
            </div>

            {/* Sidebar with Tech Stack */}
            <aside className="deepdive-sidebar">
              <div className="sidebar-card">
                <span className="sidebar-tag">System Specifications</span>
                <h4 className="sidebar-title">Production Technology Stack</h4>

                <ul className="stack-items-list">
                  {project.stack.map((item, idx) => (
                    <li key={idx} className="stack-item">
                      <Layers size={16} className="text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="sovereignty-badge">
                  <ShieldCheck size={18} className="text-accent" />
                  <div>
                    <strong>100% Client IP Sovereignty</strong>
                    <p>Proprietary architecture owned unconditionally by client.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 3. Related Production Projects */}
      {related.length > 0 && (
        <section className="section section-surface related-showcase-section">
          <div className="container">
            <div className="related-header">
              <span className="technical-label">Explore Peer Platforms</span>
              <h2 className="text-h2">Related Production Realities</h2>
            </div>

            <div className="related-grid">
              {related.map((p) => (
                <article key={p.slug} className="related-card">
                  <div className="related-img-box">
                    <img src={p.image} alt={p.name} />
                    <span className="related-tag">{p.status}</span>
                  </div>
                  <div className="related-text">
                    <span className="related-inst">{p.name}</span>
                    <h4 className="related-title">{p.title}</h4>
                    <p className="related-desc">{p.description}</p>
                    <Link to={`/projects/${p.slug}`} className="link-editorial">
                      <span>View Case Study</span>
                      <ArrowRight size={14} className="btn-hover-arrow" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection
        title={`Commission An Architecture Like ${project.name}`}
        description="Let's engineer a high-concurrency platform tailored to your institutional mission."
      />
    </div>
  );
}

