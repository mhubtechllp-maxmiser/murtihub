import React, { useState, useEffect } from 'react';
import { cmsService } from '../services/cmsService';
import LeaderProfile from '../components/leadership/LeaderProfile';
import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../components/common/CTASection';
import './LeadershipPage.scss';

export default function LeadershipPage() {
  const [leadership, setLeadership] = useState(cmsService.getLeadership());

  useEffect(() => {
    const unsub = cmsService.subscribe('leadership', setLeadership);
    return unsub;
  }, []);

  const leaders = leadership?.leaders || (leadership?.leader ? [leadership.leader] : []);

  return (
    <div className="leadership-page-root">
      {/* Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <span className="banner-eyebrow">Stewardship // Executive Governance</span>
          <h1 className="banner-title text-display">
            Executive Leadership&#10;& Stewardship.
          </h1>
          <p className="banner-desc lead-paragraph">
            Guided by institutional values, ethical advocacy, and long-horizon engineering commitments
            for ambitious organizations worldwide.
          </p>
        </div>
      </section>

      {/* Leadership Profile */}
      <section className="section section-light leader-showcase-section">
        <div className="container">
          <div className="leaders-grid-showcase">
            {leaders.map((leader, index) => (
              <LeaderProfile
                key={leader.id || leader.name || index}
                leader={leader}
                index={index}
                mode="full"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Governance Philosophy */}
      <section className="section section-surface governance-philosophy-section">
        <div className="container">
          <SectionHeading
            eyebrow="Institutional Governance"
            title="The Three Mandates Of Stewardship"
            subtitle="Ethical Integrity • Unyielding Craftsmanship • Client Advocacy"
            description="Our governance philosophy ensures that MurtiHub never compromises engineering craftsmanship for short-term expedience."
          />

          <div className="mandates-grid">
            <div className="mandate-card">
              <span className="mandate-num">Mandate 01</span>
              <h3 className="mandate-title">Unconditional IP Transfer</h3>
              <p className="mandate-desc">
                We believe enterprise clients must hold complete sovereignty over their software
                assets. MurtiHub assigns all source code, cryptographic credentials, and architecture
                blueprints unconditionally.
              </p>
            </div>

            <div className="mandate-card">
              <span className="mandate-num">Mandate 02</span>
              <h3 className="mandate-title">Partner Accountability</h3>
              <p className="mandate-desc">
                Clients do not interact with mid-tier account representatives. Every project is directly
                steered by designated partners and senior systems architects invested in institutional
                success.
              </p>
            </div>

            <div className="mandate-card">
              <span className="mandate-num">Mandate 03</span>
              <h3 className="mandate-title">Generational Longevity</h3>
              <p className="mandate-desc">
                Software must outlive transient technological fads. We build modular, deterministic
                cores that scale for decades without requiring catastrophic rewrite cycles.
              </p>
            </div>
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
