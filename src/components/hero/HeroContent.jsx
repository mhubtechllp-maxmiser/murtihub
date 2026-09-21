import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown, Play } from 'lucide-react';
import './HeroContent.scss';

export default function HeroContent({ slides = [], currentIndex = 0 }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl
        .fromTo('.hc-eyebrow-row', { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo('.hc-headline-line', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.0, stagger: 0.18 }, '-=0.3')
        .fromTo('.hc-body', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
        .fromTo('.hc-cta-group .hc-btn', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 }, '-=0.3')
        .fromTo('.hc-vision-card', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8 }, '-=0.4')
        .fromTo('.hc-scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hc-root" ref={containerRef}>
      {/* ── Main Content Grid ────────────────────────────────── */}
      <div className="hc-main-grid">
        {/* Left column — text content */}
        <div className="hc-left-col">
          {/* Eyebrow directly above headline with tight spacing */}
          <div className="hc-eyebrow-row">
            <span className="hc-eyebrow-dot" aria-hidden="true" />
            <span className="hc-eyebrow-text">Engineering A More Open Tomorrow</span>
            <span className="hc-eyebrow-line" aria-hidden="true" />
          </div>

          <h1 className="hc-headline" aria-label="Ideas Today Impact Tomorrow">
            <span className="hc-headline-line">Ideas Today</span>
            <span className="hc-headline-line">Impact</span>
            <span className="hc-headline-line">Tomorrow</span>
          </h1>

          <p className="hc-body">
            MurtiHub Technologies builds digital solutions, scalable systems, and
            future-ready products that empower businesses to grow, innovate and lead.
          </p>

          <div className="hc-cta-group">
            <Link to="/contact" className="hc-btn hc-btn-primary">
              Let's Build Together <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/projects" className="hc-btn hc-btn-outline">
              Explore Our Work <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Right side — Vision Card matching design */}
        <div className="hc-right-col">
          <div className="hc-vision-card">
            {/* Left section of card */}
            <div className="hc-card-left">
              <div className="hc-card-eyebrow-wrap">
                <span className="hc-card-dot" aria-hidden="true" />
                <span className="hc-card-eyebrow">Our Vision</span>
              </div>
              <h3 className="hc-card-title">
                Technology<br />
                for a more open<br />
                tomorrow.
              </h3>
              <div className="hc-card-accent-line" aria-hidden="true" />
            </div>

            {/* Vertical divider */}
            <div className="hc-card-vdivider" aria-hidden="true" />

            {/* Right section of card */}
            <div className="hc-card-right">
              <button className="hc-card-play-btn" aria-label="Watch Our Story">
                <span className="hc-play-ring">
                  <Play size={18} fill="#ffffff" color="#ffffff" className="hc-play-icon" aria-hidden="true" />
                </span>
              </button>
              <span className="hc-card-play-label">
                Watch<br />Our Story
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────── */}
      <div className="hc-bottom-bar">
        <div className="hc-scroll-cue">
          <span className="hc-scroll-circle">
            <ChevronDown size={14} aria-hidden="true" />
          </span>
          <span className="hc-scroll-text">Scroll To Explore</span>
          <span className="hc-scroll-line" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
