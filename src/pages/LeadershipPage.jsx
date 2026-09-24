import React, { useState, useEffect } from 'react';
import { cmsService } from '../services/cmsService';
import LeaderProfile from '../components/leadership/LeaderProfile';
import CTASection from '../components/common/CTASection';
import './LeadershipPage.scss';

export default function LeadershipPage() {
  const [leadership, setLeadership] = useState(cmsService.getLeadership());

  useEffect(() => {
    const unsub = cmsService.subscribe('leadership', setLeadership);
    return () => { unsub(); };
  }, []);

  const leaders = leadership?.leaders || [];

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
          <div className="leaders-grid-showcase">
            {leaders.map((leader, index) => (
              <LeaderProfile
                key={leader.id || index}
                leader={leader}
                index={index}
              />
            ))}
          </div>
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