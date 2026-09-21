import React from 'react';
import { covenantData } from '../data/covenantData';
import CovenantCard from '../components/covenant/CovenantCard';
import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../components/common/CTASection';
import './CovenantPage.scss';

export default function CovenantPage() {
  const { title, subtitle, description, principles } = covenantData;

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
          <div className="covenant-grid">
            {principles.map((principle, index) => (
              <CovenantCard key={principle.number} principle={principle} index={index} />
            ))}
          </div>
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

