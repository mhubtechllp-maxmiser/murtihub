import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { footerNavigation } from '../../data/navigation';
import './Footer.scss';

export default function Footer() {
  const [brand, setBrand] = useState(cmsService.getBrand());

  useEffect(() => {
    const unsub = cmsService.subscribe('brand', setBrand);
    return unsub;
  }, []);

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        {/* Top Branding Strip */}
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <div className="footer-emblem-wrap">
                <img
                  src="/images/MHLOGO.png"
                  alt="MurtiHub Technologies Logo"
                  className="footer-emblem"
                />
              </div>
              <div className="footer-brand-titles">
                <span className="footer-brand-name">{brand.companyName || 'MurtiHub Technologies'}</span>
                <span className="footer-tagline">{brand.tagline || 'Next-Gen Technology Architecture'}</span>
              </div>
            </Link>
            <p className="footer-manifesto">
              Ideas today, impact tomorrow. Architecting institutional software systems, distributed
              platforms, and mathematically verified runtimes with complete client IP sovereignty.
            </p>
          </div>

          {/* Sitemaps */}
          <div className="footer-links-col">
            <h4 className="footer-column-title">Navigation</h4>
            <ul className="footer-nav-list">
              {footerNavigation.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="footer-link">
                    <span>{item.label}</span>
                    <ArrowUpRight size={12} className="footer-link-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Inquiries */}
          <div className="footer-inquiries-col">
            <h4 className="footer-column-title">Direct Inquiries</h4>
            <p className="footer-inquiry-note">
              Direct partner consultation with senior systems architects.
            </p>
            <a href={`mailto:${brand.email || 'enquiry@murtihub.co.in'}`} className="footer-email-btn">
              <Mail size={16} />
              <span>{brand.email || 'enquiry@murtihub.co.in'}</span>
            </a>
            <div className="footer-sla-badge">
              <span className="sla-dot"></span>
              <span>SLA Response: {brand.responseSLA || '< 24 Business Hours'}</span>
            </div>
          </div>
        </div>

        <div className="hairline-dark footer-hairline"></div>

        {/* Bottom Copyright & Ethos Strip */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            {brand.copyright || '© 2026 MurtiHub Technologies. All Rights Reserved.'}
          </p>
          <div className="footer-motto">
            <span className="motto-diamond">◆</span>
            <span>{brand.motto || 'Ideas today, impact tomorrow'}</span>
          </div>
          <div className="footer-meta">
            <span>{brand.legalStructure || 'Limited Liability Partnership'} • Est. {brand.incorporationYear || '2026'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
