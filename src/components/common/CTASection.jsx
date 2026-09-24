import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Clock, ShieldCheck } from 'lucide-react';
import { brandData } from '../../data/brand';
import './CTASection.scss';

export default function CTASection({
  eyebrow = 'Initiate Technical Engagement',
  title = "Let's Build What Comes Next.",
  description = "Have an idea, system or digital challenge? Let's engineer the next step. Direct partner consultation with senior systems architects.",
  theme = 'dark'
}) {
  return (
    <section className="cta-section-wrapper" aria-label="Initiate Engagement">
      <div className={`cta-card theme-${theme}`}>
        <div className="cta-card-glow" aria-hidden="true" />
        <div className="cta-band-grid">
          <div className="cta-content">
            <span className="cta-eyebrow">{eyebrow}</span>
            <h2 className="cta-title text-h1">{title}</h2>
            <p className="cta-description lead-paragraph">{description}</p>

            <div className="cta-guarantees">
              <div className="guarantee-item">
                <Clock size={15} className="guarantee-icon" />
                <span>Response SLA: {brandData.responseSLA}</span>
              </div>
              <div className="guarantee-item">
                <ShieldCheck size={15} className="guarantee-icon" />
                <span>100% Sovereign IP Ownership</span>
              </div>
            </div>
          </div>

          <div className="cta-actions">
            <Link to="/contact" className="btn btn-primary cta-action-btn">
              <span>Initiate Engagement</span>
              <ArrowRight size={16} className="btn-hover-arrow" />
            </Link>

            <a href={`mailto:${brandData.email}`} className="cta-direct-email">
              <Mail size={16} />
              <span>{brandData.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}