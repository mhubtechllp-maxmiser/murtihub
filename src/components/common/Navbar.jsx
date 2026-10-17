import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { mainNavigation } from '../../data/navigation';
import MobileMenu from './MobileMenu';
import './Navbar.scss';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brand, setBrand] = useState(cmsService.getBrand());
  const [navData, setNavData] = useState(cmsService.getNavigation());
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const unsubBrand = cmsService.subscribe('brand', setBrand);
    const unsubNav = cmsService.subscribe('navigation', setNavData);

    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      unsubBrand();
      unsubNav();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = navData?.main || mainNavigation;

  return (
    <>
      <header
        className={`navbar-header ${isScrolled ? 'is-scrolled' : ''} ${
          !isHomePage ? 'navbar-always-solid' : ''
        }`}
      >
        <div className="navbar-container">
          {/* Brand Logo & Name */}
          <Link to="/" className="navbar-brand" aria-label={`${brand.companyName || 'MurtiHub Technologies'} Home`}>
            <div className="brand-emblem-wrap">
              <img
                src="/images/MHLOGO.png"
                alt="MurtiHub Technologies Logo"
                className="brand-emblem"
                width="42"
                height="42"
              />
            </div>
            <div className="brand-titles">
              <span className="brand-name">{brand.shortName || 'MurtiHub'}</span>
              <span className="brand-sub">Technologies</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="navbar-nav" aria-label="Main Navigation">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'is-active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action / CTA */}
          <div className="navbar-actions">
            <Link to="/contact" className="btn btn-primary btn-sm nav-cta">
              <span>Let's Build</span>
              <ArrowRight size={14} className="btn-hover-arrow" aria-hidden="true" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navItems}
      />
    </>
  );
}
