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
        <div className="footer-rows">
          {/* Row 1: Brand Info */}
          <div className="footer-row footer-row-info">
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
                <span className="footer-tagline">{brand.tagline || 'Engineering A More Open Tomorrow'}</span>
              </div>
            </Link>
            <p className="footer-description">
              {brand.description || 'We build digital solutions, scalable web systems, and modern products that help businesses innovate and grow.'}
            </p>
          </div>

          {/* Row 2: Quick Links */}
          <div className="footer-row footer-row-links">
            <div className="footer-row-label">
              <span className="footer-label-badge">Quick Links</span>
            </div>
            <nav className="footer-nav" aria-label="Footer Navigation">
              <ul className="footer-nav-list">
                {footerNavigation.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="footer-link">
                      <span>{item.label}</span>
                      <ArrowUpRight size={11} className="footer-link-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Row 3: Inquiries */}
          <div className="footer-row footer-row-inquiries">
            <div className="footer-inquiry-meta">
              <span className="footer-label-badge">Inquiries</span>
              <span className="footer-inquiry-note">Have a project or question? Let's talk.</span>
            </div>
            <div className="footer-inquiry-actions">
              <a href={`mailto:${brand.email || 'info@murtihub.co.in'}`} className="footer-email-btn">
                <Mail size={14} />
                <span>{brand.email || 'info@murtihub.co.in'}</span>
              </a>
              <div className="footer-sla-badge">
                <span className="sla-dot"></span>
                <span>Replies within 24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Strip */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            {brand.copyright || '© 2026 MurtiHub Technologies. All rights reserved.'}
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
