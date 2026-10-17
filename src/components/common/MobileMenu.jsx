import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import './MobileMenu.scss';

export default function MobileMenu({ isOpen, onClose, navigation }) {
  const [brand, setBrand] = useState(cmsService.getBrand());

  useEffect(() => {
    const unsub = cmsService.subscribe('brand', setBrand);
    return () => unsub();
  }, []);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" role="dialog" aria-modal="true">
      <div className="mobile-menu-panel">
        <div className="mobile-menu-header">
          <Link to="/" onClick={onClose} className="mobile-brand">
            <div className="mobile-emblem-wrap">
              <img
                src="/images/MHLOGO.png"
                alt="MurtiHub Logo"
                className="mobile-emblem"
              />
            </div>
            <div>
              <span className="brand-name">{brand.shortName || 'MurtiHub'}</span>
              <span className="brand-sub">Technologies</span>
            </div>
          </Link>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={onClose}
            aria-label="Close Menu"
          >
            <X size={26} />
          </button>
        </div>

        <nav className="mobile-nav">
          <ul className="mobile-nav-list">
            {navigation.map((item, index) => (
              <li key={item.path} className="mobile-nav-item">
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? 'is-active' : ''}`
                  }
                >
                  <span className="mobile-item-index">0{index + 1}</span>
                  <span className="mobile-item-title">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-sla">
            <ShieldCheck size={16} className="text-accent" />
            <span>99.99% Availability SLA Benchmark</span>
          </div>

          <Link
            to="/contact"
            onClick={onClose}
            className="btn btn-primary mobile-cta-btn"
          >
            <span>Let's Build Together</span>
            <ArrowRight size={16} />
          </Link>

          <a href={`mailto:${brand.email || 'enquiry@murtihub.co.in'}`} className="mobile-email-link">
            <Mail size={14} />
            <span>{brand.email || 'enquiry@murtihub.co.in'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
