import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Award, Lock, Users } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../components/common/CTASection';
import { cmsService } from '../services/cmsService';
import './AboutPage.scss';

export default function AboutPage() {
  const [brand, setBrand] = useState(cmsService.getBrand());
  const [leadership, setLeadership] = useState(cmsService.getLeadership());

  useEffect(() => {
    const unsubBrand = cmsService.subscribe('brand', setBrand);
    const unsubLeadership = cmsService.subscribe('leadership', setLeadership);
    return () => { unsubBrand(); unsubLeadership(); };
  }, []);

  const leader = (leadership?.leaders && leadership.leaders[0]) || leadership?.leader || {};
  const ethosPillars = leadership?.ethosPillars || [];
  const leaderQuote = leader?.quotes?.about || leader?.quotes?.leadership || 'Engineering systems with institutional integrity.';

  const aboutStats = [
    { value: '2026', label: 'Incorporated Enterprise', sub: 'Est. 2026' },
    { value: brand.incorporationYear || '2026', label: brand.legalStructure || 'Incorporated Enterprise', sub: `Est. ${brand.incorporationYear || '2026'}` },
    { value: '100%', label: 'Client Sovereignty', sub: '100% IP Ownership' },
    { value: '99.99%', label: 'Availability SLA', sub: 'Uptime Benchmark' }
  ];

  return (
    <div className="about-page-root">
      {/* Page Header Banner (Full-Width Static Hero Background) */}
      <section className="page-header-banner about-header-banner about-hero-static-section" aria-label="About MurtiHub Technologies">
        {/* Full-width static background visual */}
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
            <div className="banner-status-pill">
              <span className="pulsing-beacon" aria-hidden="true" />
              <span className="pill-text">Origin // Identity // Covenant</span>
              <span className="pill-divider" aria-hidden="true">·</span>
              <span className="pill-coord">Est. 2026</span>
            </div>

            <h1 className="banner-title text-display">
              Engineering <span className="title-gradient">Digital Sovereignty</span> For An Open Tomorrow.
            </h1>

            <div className="banner-accent-spine" aria-hidden="true">
              <div className="accent-line" />
              <div className="accent-dot" />
            </div>

            <p className="banner-desc lead-paragraph">
              MurtiHub Technologies is a premier digital engineering firm. We design, build, and
              scale mission-critical software systems, distributed platforms, and high-concurrency
              digital architectures for ambitious enterprises globally.
            </p>

            <div className="banner-credentials-strip">
              <div className="credential-chip">
                <ShieldCheck size={18} className="chip-icon" />
                <div className="chip-meta">
                  <strong className="chip-title">100% Client IP</strong>
                  <span className="chip-sub">Unconditional Ownership</span>
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
                  <strong className="chip-title">Executive Peer</strong>
                  <span className="chip-sub">Direct Partner Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Provenance Statistics */}
      <section className="about-stats-strip">
        <div className="container">
          <div className="about-stats-grid">
            {aboutStats.map((stat, idx) => (
              <div key={idx} className="about-stat-box">
                <span className="box-sub">{stat.sub}</span>
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
              <span className="technical-label">Institutional Provenance</span>
              <h2 className="narrative-title text-h2">
                Craftsmanship over commodity. We build systems that endure.
              </h2>
            </div>

            <div className="narrative-right">
              <p className="lead-paragraph">
                MurtiHub Technologies was founded on an unyielding principle: enterprise technology
                must be engineered with mathematical precision and lasting institutional permanence,
                not ephemeral hype cycles.
              </p>
              <p>
                In an era where disposable SaaS wrappers and bloated commodity frameworks dominate,
                ambitious organizations routinely find themselves burdened by escalating technical
                debt, opaque vendor locks, and fragile dependencies.
              </p>
              <p>
                MurtiHub restores sovereign craftsmanship. From multi-bitrate streaming CDNs and
                zero-trust cryptographic gateways to deterministic WebGL physics and multi-vendor
                escrow ledgers, we write software from first principles. Our code belongs 100% to our
                clients, backed by verified benchmarks and enduring institutional stewardship.
              </p>

              <div className="narrative-pillars">
                <div className="pillar-bullet">
                  <Lock size={18} className="text-accent" />
                  <div>
                    <strong>Cryptographic Sovereign Boundaries</strong>
                    <p>Zero implicit trust. End-to-end mTLS v1.3 encryption across every perimeter.</p>
                  </div>
                </div>
                <div className="pillar-bullet">
                  <Users size={18} className="text-accent" />
                  <div>
                    <strong>Partner-Led Technical Governance</strong>
                    <p>Direct engagement with senior architects and designated partners.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Ethos & Pillars */}
      <section className="section section-surface about-ethos-section">
        <div className="container">
          <SectionHeading
            eyebrow="Organizational Ethos"
            title="Engineering With Purpose."
            subtitle="Absolute Transparency • 100% Client IP Ownership • Executive Partnership"
            description="Our three non-negotiable operational commitments to every enterprise engagement."
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

          {/* Founder Quote */}
          <div className="founder-quote-banner">
            <blockquote className="editorial-quote">
              <p>"{leader.quotes.about}"</p>
              <p>"{leaderQuote}"</p>
              <footer className="founder-tag">
                <strong>{leader.name}</strong>
                <span>Founder & Chairperson, MurtiHub Technologies</span>
                <span>{leader.title || 'Founder & Chairperson, MurtiHub Technologies'}</span>
              </footer>
            </blockquote>

            <div className="leadership-link-wrap">
              <Link to="/leadership" className="btn btn-outline">
                <span>View Executive Leadership</span>
                <ArrowRight size={14} className="btn-hover-arrow" />
              </Link>
            </div>
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
