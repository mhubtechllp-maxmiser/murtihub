import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import CTASection from '../components/common/CTASection';
import './ServicesPage.scss';

export default function ServicesPage() {
  const [services, setServices] = useState(cmsService.getServices());
  const [syncStatus, setSyncStatus] = useState(cmsService.getStatus());

  useEffect(() => {
    const unsubServices = cmsService.subscribe('services', setServices);
    const unsubStatus = cmsService.subscribe('__status__', setSyncStatus);
    return () => {
      unsubServices();
      unsubStatus();
    };
  }, []);

  const handleRetry = () => {
    cmsService.initRemoteSync(true).catch(() => {});
  };

  const serviceList = Array.isArray(services) ? services : [];

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
          {syncStatus.isError && (
            <div className="cms-status-banner cms-error" role="alert" style={{ marginBottom: '2rem' }}>
              <AlertCircle size={18} />
              <span>Failed to load services from MongoDB: {syncStatus.error}</span>
              <button type="button" className="retry-btn" onClick={handleRetry}>
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {serviceList.length > 0 ? (
            <div className="services-editorial-stream">
              {serviceList.map((service, index) => {
                // Alternating: one card dark, one card light
                const isDark = index % 2 === 0;
                const tags = Array.isArray(service.tags) ? service.tags : [];
                const capabilities = Array.isArray(service.capabilities) ? service.capabilities : [];

                return (
                  <article
                    key={service.id || service.slug}
                    className={`service-editorial-entry ${isDark ? 'is-dark-variant' : 'is-light-variant'}`}
                  >
                    <div className="entry-header">
                      <div className="entry-meta">
                        <span className="entry-number">{service.id || `0${index + 1}`}</span>
                        <span className="entry-tier">Institutional Discipline</span>
                      </div>
                      {tags.length > 0 && (
                        <div className="entry-tags">
                          {tags.map((tag, idx) => (
                            <React.Fragment key={tag}>
                              <span className="entry-tag-text">{tag}</span>
                              {idx < tags.length - 1 && <span className="entry-tag-separator">|</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="entry-content-grid">
                      <div className="entry-left">
                        <h2 className="entry-title text-h2">{service.title || service.name}</h2>
                        <p className="entry-lead lead-paragraph">{service.description}</p>
                        {service.longDescription && (
                          <p className="entry-long">{service.longDescription}</p>
                        )}

                        <div className="entry-cta">
                          <Link to="/contact" className="btn btn-primary">
                            <span>Initiate Consultation</span>
                            <ArrowRight size={15} className="btn-hover-arrow" />
                          </Link>
                        </div>
                      </div>

                      <div className="entry-right">
                        {capabilities.length > 0 && (
                          <div className="capabilities-box">
                            <h4 className="capabilities-title">Core Architectural Capabilities</h4>
                            <ul className="capabilities-list">
                              {capabilities.map((cap, cIdx) => (
                                <li key={cIdx} className="capability-item">
                                  <Check size={16} className="text-accent" />
                                  <span>{cap}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : syncStatus.isLoading ? (
            <div className="cms-section-loading" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }} />
              <p>Loading digital engineering services from MongoDB...</p>
            </div>
          ) : (
            <div className="cms-section-empty" style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <p>No services are currently published in the database.</p>
            </div>
          )}
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
