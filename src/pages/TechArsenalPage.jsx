import React, { useState, useEffect } from 'react';
import { cmsService } from '../services/cmsService';
import TechModuleGrid from '../components/tech/TechModuleGrid';
import CTASection from '../components/common/CTASection';
import './TechArsenalPage.scss';

export default function TechArsenalPage() {
  const [arsenalData, setArsenalData] = useState(cmsService.getTechArsenal());

  useEffect(() => {
    const unsub = cmsService.subscribe('tech_arsenal', setArsenalData);
    return () => unsub();
  }, []);

  const { heading, subheading, description } = arsenalData || {};

  return (
    <div className="tech-arsenal-page-root">
      {/* Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <span className="banner-eyebrow">{heading}</span>
          <h1 className="banner-title text-display">{subheading}</h1>
          <p className="banner-desc lead-paragraph">{description}</p>
        </div>
      </section>

      {/* High-Density Technical Modules */}
      <section className="section section-light tech-modules-section">
        <div className="container">
          <TechModuleGrid />
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Custom Runtime Or Benchmark Inquiry"
        description="Discuss your latency requirements, protocol specifications, or distributed database needs with our systems architects."
      />
    </div>
  );
}
