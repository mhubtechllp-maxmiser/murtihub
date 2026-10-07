import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown, Play, X } from 'lucide-react';
import './HeroContent.scss';

export default function HeroContent({ slides = [], currentIndex = 0 }) {
  const containerRef = useRef(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const currentSlide = slides[currentIndex] || slides[0] || {};
  const headlineLines = currentSlide.headlineLines || (currentSlide.headline ? [currentSlide.headline] : ['MurtiHub']);
  const visionTitleLines = currentSlide.visionTitle || ['Technology', 'for a more open', 'tomorrow.'];

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!isVideoModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsVideoModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isVideoModalOpen]);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl
        .fromTo('.hc-eyebrow-row', { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo('.hc-headline-line', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, '-=0.3')
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
          <div key={`slide-text-${currentIndex}`} className="hc-slide-text-block">
            {/* Eyebrow directly above headline with tight spacing */}
            <div className="hc-eyebrow-row">
              <span className="hc-eyebrow-dot" aria-hidden="true" />
              <span className="hc-eyebrow-text">{currentSlide.eyebrow || 'Engineering A More Open Tomorrow'}</span>
              <span className="hc-eyebrow-line" aria-hidden="true" />
            </div>

            <h1 className="hc-headline" aria-label={headlineLines.join(' ')}>
              {headlineLines.map((line, idx) => (
                <span key={idx} className="hc-headline-line">{line}</span>
              ))}
            </h1>

            <p className="hc-body">
              {currentSlide.description || 'MurtiHub Technologies builds digital solutions, scalable systems, and future-ready products that empower businesses to grow, innovate and lead.'}
            </p>
          </div>

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
            <div key={`slide-vision-${currentIndex}`} className="hc-card-left hc-card-content-anim">
              <div className="hc-card-eyebrow-wrap">
                <span className="hc-card-dot" aria-hidden="true" />
                <span className="hc-card-eyebrow">{currentSlide.visionEyebrow || 'Our Vision'}</span>
              </div>
              <h3 className="hc-card-title">
                {visionTitleLines.map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < visionTitleLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h3>
              <div className="hc-card-accent-line" aria-hidden="true" />
            </div>

            {/* Vertical divider */}
            <div className="hc-card-vdivider" aria-hidden="true" />

            {/* Right section of card */}
            <div className="hc-card-right">
              <button
                type="button"
                className="hc-card-play-btn"
                aria-label="Watch Our Story"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <span className="hc-play-ring">
                  <Play size={18} fill="#ffffff" color="#ffffff" className="hc-play-icon" aria-hidden="true" />
                </span>
              </button>
              <button
                type="button"
                className="hc-card-play-label"
                onClick={() => setIsVideoModalOpen(true)}
                aria-label="Watch Our Story"
              >
                Watch<br />Our Story
              </button>
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

      {/* ── Video Popup Modal ────────────────────────────────── */}
      {isVideoModalOpen &&
        createPortal(
          <div
            className="hc-video-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Watch Our Story"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <div
              className="hc-video-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hc-video-modal-header">
                <div className="hc-video-modal-tag">
                  <span className="hc-video-modal-tag-dot" aria-hidden="true" />
                  <span className="hc-video-modal-tag-text">MurtiHub &bull; Our Story</span>
                </div>
                <button
                  type="button"
                  className="hc-video-modal-close"
                  onClick={() => setIsVideoModalOpen(false)}
                  aria-label="Close video"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="hc-video-player-frame">
                <video
                  className="hc-video-player"
                  src="/intro.mp4"
                  controls
                  autoPlay
                  playsInline
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}