import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import CTASection from '../components/common/CTASection';
import './ServiceDetailPage.scss';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = cmsService.getServiceBySlug(slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const allProjects = cmsService.getProjects();
  const related = allProjects.filter((p) =>
    service.relatedProjects ? service.relatedProjects.includes(p.slug) : false
  );

  return (
    <div className="service-detail-root">
      {/* 1. Service Hero */}
      <section className="service-hero-header">
        <div className="container">
          <div className="breadcrumb-nav">
            <Link to="/services" className="breadcrumb-back">
              <ArrowLeft size={14} />
              <span>All Disciplines</span>
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-curr">{service.shortTitle}</span>
          </div>

          <div className="service-hero-meta">
            <span className="hero-service-number">Discipline // {service.id}</span>
            <div className="hero-service-tags">
              {service.tags.map((tag) => (
                <span key={tag} className="tag-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <h1 className="service-hero-title text-display">{service.title}</h1>
          <p className="service-hero-lead lead-paragraph">{service.description}</p>
        </div>
      </section>

      {/* 2. Overview & Engineering Approach */}
      <section className="section section-light service-overview-section">
        <div className="container">
          <div className="overview-approach-grid">
            {/* Overview */}
            <div className="overview-block">
              <span className="technical-label">Discipline Architecture</span>
              <h2 className="overview-title text-h2">Architectural Overview</h2>
              <p className="overview-body lead-paragraph">{service.longDescription}</p>

              <div className="approach-box">
                <h3 className="approach-title">Deterministic Engineering Approach</h3>
                <p className="approach-text">{service.engineeringApproach}</p>
              </div>
            </div>

            {/* Capabilities Box */}
            <div className="capabilities-sidebar">
              <div className="capabilities-card">
                <span className="capabilities-header-tag">Verifiable Specifications</span>
                <h3 className="capabilities-heading">Technical Capabilities</h3>

                <ul className="capabilities-checklist">
                  {service.capabilities.map((cap, idx) => (
                    <li key={idx} className="capability-check-item">
                      <Check size={16} className="text-accent" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>

                <div className="technologies-subpanel">
                  <span className="technologies-header">Enforced Stack & Runtimes</span>
                  <div className="technologies-tags-row">
                    {service.technologies.map((tech) => (
                      <span key={tech} className="tag-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Related Production Case Studies */}
      {related.length > 0 && (
        <section className="section section-surface related-projects-section">
          <div className="container">
            <div className="related-section-header">
              <span className="technical-label">Production Deployments</span>
              <h2 className="text-h2">Related Case Studies</h2>
              <p className="lead-paragraph">
                Systems utilizing our {service.shortTitle} discipline in live enterprise environments.
              </p>
            </div>

            <div className="related-projects-grid">
              {related.map((p) => (
                <article key={p.slug} className="related-project-item">
                  <div className="related-image-frame">
                    <img src={p.image} alt={p.name} className="related-img" />
                    <div className="related-img-gradient"></div>
                    <span className="related-status-tag">{p.status}</span>
                  </div>

                  <div className="related-details">
                    <span className="related-inst-name">{p.name}</span>
                    <h3 className="related-proj-title">{p.title}</h3>
                    <p className="related-proj-desc">{p.description}</p>

                    <Link to={`/projects/${p.slug}`} className="link-editorial">
                      <span>Examine System Architecture</span>
                      <ArrowRight size={14} className="btn-hover-arrow" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Consultation CTA */}
      <CTASection
        title={`Commission ${service.title}`}
        description="Direct consultation with our senior systems architects to design, benchmark, and deploy this discipline for your organization."
      />
    </div>
  );
}

