import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import LeaderProfile from '../components/leadership/LeaderProfile';
import CTASection from '../components/common/CTASection';
import './LeadershipPage.scss';

export default function LeadershipPage() {
  const [leadership, setLeadership] = useState(cmsService.getLeadership());
  const [syncStatus, setSyncStatus] = useState(cmsService.getStatus());

  useEffect(() => {
    const unsubLeadership = cmsService.subscribe('leadership', setLeadership);
    const unsubStatus = cmsService.subscribe('__status__', setSyncStatus);
    return () => {
      unsubLeadership();
      unsubStatus();
    };
  }, []);

  const handleRetry = () => {
    cmsService.initRemoteSync(true).catch(() => {});
  };

  const leaders = leadership?.leaders || (Array.isArray(leadership) ? leadership : []);

  return (
    <div className="leadership-page-root">
      {/* Header Banner */}
      <section className="page-header-banner" aria-label="Executive Leadership">
        <div className="container">
          <span className="banner-eyebrow">Stewardship // Executive Governance</span>
          <h1 className="banner-title text-display">
            Executive Leadership & Stewardship.
          </h1>
          <p className="banner-desc lead-paragraph">
            Guided by institutional values, ethical advocacy, and long-horizon engineering commitments
            for ambitious enterprises worldwide.
          </p>
        </div>
      </section>

      {/* Leadership Profile Showcase */}
      <section className="section section-light leader-showcase-section" aria-label="Designated Partners">
        <div className="container">
          {syncStatus.isError && (
            <div className="cms-status-banner cms-error" role="alert" style={{ marginBottom: '2rem' }}>
              <AlertCircle size={18} />
              <span>Failed to load executive leadership from MongoDB: {syncStatus.error}</span>
              <button type="button" className="retry-btn" onClick={handleRetry}>
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {leaders.length > 0 ? (
            <div className="leaders-grid-showcase">
              {leaders.map((leader, index) => (
                <LeaderProfile
                  key={leader.id || index}
                  leader={leader}
                  index={index}
                />
              ))}
            </div>
          ) : syncStatus.isLoading ? (
            <div className="cms-section-loading" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }} />
              <p>Loading executive leadership profiles from MongoDB...</p>
            </div>
          ) : (
            <div className="cms-section-empty" style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
              <p>No executive leadership profiles are currently published in the database.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Schedule An Executive Consultation"
        description="Connect directly with our designated partners to discuss your institutional software requirements."
      />
    </div>
  );
}