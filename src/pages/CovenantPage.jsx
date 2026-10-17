import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import CovenantCard from '../components/covenant/CovenantCard';
import CTASection from '../components/common/CTASection';
import './CovenantPage.scss';

export default function CovenantPage() {
  const [covenant, setCovenant] = useState(cmsService.getCovenant());
  const [syncStatus, setSyncStatus] = useState(cmsService.getStatus());

  useEffect(() => {
    const unsubCovenant = cmsService.subscribe('covenant', setCovenant);
    const unsubStatus = cmsService.subscribe('__status__', setSyncStatus);
    return () => {
      unsubCovenant();
      unsubStatus();
    };
  }, []);

  const handleRetry = () => {
    cmsService.initRemoteSync(true).catch(() => {});
  };

  const title = covenant?.title || 'The Covenant';
  const subtitle = covenant?.subtitle || 'Foundational Engineering Principles';
  const description =
    covenant?.description ||
    'The Covenant represents MurtiHub\'s sacred institutional commitment to our clients, our engineering discipline, and the digital systems we bring into reality.';
  const principles = Array.isArray(covenant?.principles) ? covenant.principles : [];

  return (
    <div className="covenant-page-root">
      {/* Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <span className="banner-eyebrow">{title}</span>
          <h1 className="banner-title text-display">{subtitle}</h1>
          <p className="banner-desc lead-paragraph">{description}</p>
        </div>
      </section>

      {/* The 4 Foundational Principles */}
      <section className="section section-light covenant-principles-section">
        <div className="container">
          {syncStatus.isError && (
            <div className="cms-status-banner cms-error" role="alert" style={{ marginBottom: '2rem' }}>
              <AlertCircle size={18} />
              <span>Failed to load covenant from MongoDB: {syncStatus.error}</span>
              <button type="button" className="retry-btn" onClick={handleRetry}>
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {principles.length > 0 ? (
            <div className="covenant-grid">
              {principles.map((principle, index) => (
                <CovenantCard key={principle.number || index} principle={principle} index={index} />
              ))}
            </div>
          ) : syncStatus.isLoading ? (
            <div className="cms-section-loading" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }} />
              <p>Loading covenant principles from MongoDB...</p>
            </div>
          ) : (
            <div className="cms-section-empty" style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <p>No covenant principles currently stored in the database.</p>
            </div>
          )}
        </div>
      </section>

      {/* Institutional Guarantee Box */}
      <section className="section section-surface guarantee-box-section">
        <div className="container">
          <div className="covenant-guarantee-panel">
            <div className="panel-inner">
              <span className="guarantee-badge">The Sovereign Oath</span>
              <h2 className="text-h2">Uncompromising Architectural Guarantee</h2>
              <p className="lead-paragraph">
                "We solemnly affirm that no software shall be shipped under the MurtiHub banner that
                contains intentional architectural debt, obscure dependencies, or proprietary locks.
                Our craft is dedicated to the digital sovereignty of our partners."
              </p>
              <div className="guarantee-seal">
                <span className="seal-text">MurtiHub Technologies // Verified Constitution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Hold Us To The Covenant"
        description="Initiate an engagement with a technology firm that stakes its reputation on verifiable engineering principles."
      />
    </div>
  );
}
