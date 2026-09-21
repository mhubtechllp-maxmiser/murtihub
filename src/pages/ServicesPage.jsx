import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../components/common/CTASection';
import './ServicesPage.scss';

export default function ServicesPage() {
  const [services, setServices] = useState(cmsService.getServices());

  useEffect(() => {
    const unsub = cmsService.subscribe('services', setServices);
    return () => unsub();
  }, []);

  return (
    <div className="services-page-root">
      {/* Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <span className="banner-eyebrow">MurtiHub Practice // Digital Disciplines</span>
          <h1 className="banner-title text-display">
            Our Services
          </h1>
          <p className="banner-desc lead-paragraph">
            We deliver end-to-end Agentic & Generative AI solutions, high-performance web development,
            distributed applications, CMS platforms, enterprise CRMs, and institutional UI/UX design.
          </p>
        </div>
      </section>

      {/* Detailed Editorial Services List */}
      <section className="section section-light services-list-section">
        <div className="container">
          <div className="services-editorial-stream">
            {services.map((service, index) => {
              // Alternating: one card dark, one card light
              const isDark = index % 2 === 0;
              return (
                <article
                  key={service.id || service.slug}
                  className={`service-editorial-entry ${isDark ? 'is-dark-variant' : 'is-light-variant'}`}
                >
                  <div className="entry-header">
                    <div className="entry-meta">
                      <span className="entry-number">{service.id}</span>
                      <span className="entry-tier">Institutional Discipline</span>
                    </div>
                    <div className="entry-tags">
                      {service.tags.map((tag) => (
                        <span key={tag} className="tag-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="entry-content-grid">
                    <div className="entry-left">
                      <h2 className="entry-title text-h2">{service.title}</h2>
                      <p className="entry-lead lead-paragraph">{service.description}</p>
                      <p className="entry-long">{service.longDescription}</p>

                      <div className="entry-cta">
                        <Link to="/contact" className="btn btn-primary">
                          <span>Initiate Consultation</span>
                          <ArrowRight size={15} className="btn-hover-arrow" />
                        </Link>
                      </div>
                    </div>

                  <div className="entry-right">
                    <div className="capabilities-box">
                      <h4 className="capabilities-title">Core Architectural Capabilities</h4>
                      <ul className="capabilities-list">
                        {service.capabilities.map((cap, cIdx) => (
                          <li key={cIdx} className="capability-item">
                            <Check size={16} className="text-accent" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="tech-stack-row">
                      <span className="stack-label">Specialized Technologies:</span>
                      <div className="stack-pills">
                        {service.technologies.map((tech) => (
                          <span key={tech} className="tech-pill">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Commission An Architectural Engagement"
        description="Partner with our senior engineering squad to design and deploy your mission-critical software systems."
      />
    </div>
  );
}

