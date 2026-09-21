import React from 'react';
import { architectureData } from '../data/architectureData';
import SectionHeading from '../components/common/SectionHeading';
import TopologyVisualizer from '../components/architecture/TopologyVisualizer';
import DisciplinesBlock from '../components/architecture/DisciplinesBlock';
import CTASection from '../components/common/CTASection';
import './ArchitecturePage.scss';

export default function ArchitecturePage() {
  const { heading, mainTitle, description, pillars } = architectureData;

  return (
    <div className="architecture-page-root">
      {/* Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <span className="banner-eyebrow">{heading}</span>
          <h1 className="banner-title text-display">{mainTitle}</h1>
          <p className="banner-desc lead-paragraph">{description}</p>
        </div>
      </section>

      {/* Triad Pillars */}
      <section className="architecture-pillars-section">
        <div className="container">
          <div className="pillars-cards-grid">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="arch-pillar-card">
                <span className="pillar-num">0{idx + 1}</span>
                <h3 className="pillar-label">{pillar.label}</h3>
                <p className="pillar-detail">{pillar.detail}</p>
                <div className="pillar-underline"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Topology Visualizer */}
      <section className="section section-dark architecture-visual-section">
        <div className="container">
          <div className="visual-header">
            <span className="technical-label text-blue-300">Live System Schematic</span>
            <h2 className="text-h2 text-white">Cryptographic Mesh & Perimeter Ingress</h2>
            <p className="lead-paragraph text-slate-300">
              Interactive schematic demonstrating deterministic packet flow from global edge ingress
              through zero-trust reverse proxies to immutable ACID persistence tiers.
            </p>
          </div>

          <TopologyVisualizer />
        </div>
      </section>

      {/* Disciplines & High-Concurrency Indicators */}
      <section className="section section-light disciplines-section">
        <div className="container">
          <DisciplinesBlock theme="light" />
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Audit Or Commission Your System Topology"
        description="Our senior infrastructure architects can review your current topologies or design a sovereign zero-trust architecture from first principles."
      />
    </div>
  );
}
