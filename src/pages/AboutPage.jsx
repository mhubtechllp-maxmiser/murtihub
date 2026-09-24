import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Award, Users } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../components/common/CTASection';
import './AboutPage.scss';

const ethosPillars = [
  {
    title: 'Ethical Stewardship',
    description: 'Upholding moral integrity, unambiguous client advocacy, and responsible engineering in every deployed system.'
  },
  {
    title: 'Institutional Resilience',
    description: 'Building software architectures and governance frameworks that stand unyielding across generational shifts.'
  },
  {
    title: 'Long-Horizon Value',
    description: 'Prioritizing enduring client sovereignty and computational robustness over short-term expedience.'
  }
];

export default function AboutPage() {
  const [brand, setBrand] = useState(cmsService.getBrand());

  useEffect(() => {
    const unsubBrand = cmsService.subscribe('brand', setBrand);
    return () => { unsubBrand(); };
  }, []);

  const aboutStats = [
    { value: brand.incorporationYear || '2026', label: 'Incorporated Enterprise' },
    { value: '100%', label: 'Client IP Ownership' },
    { value: '99.99%', label: 'Availability SLA' }
  ];

  return (
    <div className="about-page-root">
      {/* Page Header Banner */}
      <section className="page-header-banner about-header-banner about-hero-static-section" aria-label="About MurtiHub Technologies">
        <div className="about-hero-bg-container" aria-hidden="true">
          <img
            src="/images/about/about-hero-bg.jpg"
            alt="MurtiHub Technologies Headquarters Atrium"
            className="about-hero-bg-img"
          />
          <div className="about-hero-overlay" />
          <div className="about-hero-grid-mesh" />
        </div>

        <div className="container about-hero-container">
          <div className="about-hero-content">


            <h1 className="banner-title text-display">
              Digital <span className="title-gradient">Sovereignty.</span>
            </h1>

            <div className="banner-accent-spine" aria-hidden="true">
              <div className="accent-line" />
              <div className="accent-dot" />
            </div>

            <p className="banner-desc lead-paragraph">
              Engineering mission-critical systems and distributed enterprise architectures.
            </p>

            <div className="banner-credentials-strip">
              <div className="credential-chip">
                <ShieldCheck size={18} className="chip-icon" />
                <div className="chip-meta">
                  <strong className="chip-title">Sovereign Code</strong>
                  <span className="chip-sub">Full Client Ownership</span>
                </div>
              </div>
              <div className="credential-chip">
                <Lock size={18} className="chip-icon" />
                <div className="chip-meta">
                  <strong className="chip-title">Zero-Debt</strong>
                  <span className="chip-sub">Deterministic Quality</span>
                </div>
              </div>
              <div className="credential-chip">
                <Award size={18} className="chip-icon" />
                <div className="chip-meta">
                  <strong className="chip-title">Direct Access</strong>
                  <span className="chip-sub">Partner-Led Engineering</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Statistics */}
      <section className="about-stats-strip">
        <div className="container">
          <div className="about-stats-grid">
            {aboutStats.map((stat, idx) => (
              <div key={idx} className="about-stat-box">
                <span className="box-val">{stat.value}</span>
                <span className="box-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin & Founding Narrative */}
      <section className="section section-light about-narrative-section">
        <div className="container">
          <div className="about-narrative-grid">
            <div className="narrative-left">
              <h2 className="narrative-title text-h2">
                Systems That Endure.
              </h2>
            </div>

            <div className="narrative-right">
              <p className="lead-paragraph">
                MurtiHub Technologies is founded on a core principle: enterprise technology
                must be engineered with mathematical precision and lasting permanence,
                not ephemeral hype cycles.
              </p>
              <p>
                We write software from first principles—delivering scalable distributed platforms,
                zero-trust security boundaries, and high-concurrency systems backed by verified
                benchmarks and enduring institutional stewardship.
              </p>

              <div className="narrative-pillars">
                <div className="pillar-bullet">
                  <Lock size={18} className="text-accent" />
                  <div>
                    <strong>Cryptographic Boundaries</strong>
                    <p>End-to-end mTLS encryption and zero-trust perimeter isolation.</p>
                  </div>
                </div>
                <div className="pillar-bullet">
                  <Users size={18} className="text-accent" />
                  <div>
                    <strong>Partner-Led Governance</strong>
                    <p>Direct collaboration with senior architects from architecture to deploy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Ethos */}
      <section className="section section-surface about-ethos-section">
        <div className="container">
          <SectionHeading
            eyebrow="Core Values"
            title="Engineering With Purpose."
            description="Our foundational operational commitments to every enterprise engagement."
          />

          <div className="ethos-cards-grid">
            {ethosPillars.map((pillar, idx) => (
              <div key={idx} className="ethos-pillar-card">
                <span className="pillar-number">0{idx + 1}</span>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-description">{pillar.description}</p>
                <div className="pillar-hairline"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready To Engineer Your Next System?"
        description="Schedule a direct technical consultation with our systems architects to evaluate your architecture."
      />
    </div>
  );
}