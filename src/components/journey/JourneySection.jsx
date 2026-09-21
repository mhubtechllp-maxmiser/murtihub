import React, { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journeyStages } from '../../data/journeyStages';
import './JourneySection.scss';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function JourneySection() {
  const [activeStage, setActiveStage] = useState(0);
  const sectionRef = useRef(null);
  const pinContainerRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const visualRef = useRef(null);
  const lineFillRef = useRef(null);
  const dotRef = useRef(null);
  const scrollTriggerInstance = useRef(null);
  const currentStageRef = useRef(0);

  const stage = journeyStages[activeStage] || journeyStages[0];

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // ── Desktop & Tablet: Pinned ScrollTrigger with 4-stage progression ───────
    mm.add('(min-width: 769px)', () => {
      // 1. Initial entry reveal
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 2. Pinned multi-stage progression on scroll
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${journeyStages.length * 800}`,
        pin: pinContainerRef.current,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const rawIdx = Math.floor(progress * journeyStages.length);
          const nextIndex = Math.min(Math.max(rawIdx, 0), journeyStages.length - 1);

          // Update line fill & dot height continuously with scroll scrub
          if (lineFillRef.current) {
            lineFillRef.current.style.height = `${Math.min(progress * 100, 100)}%`;
          }
          if (dotRef.current) {
            dotRef.current.style.top = `${Math.min(progress * 100, 100)}%`;
          }

          // Trigger stage switch when crossing stage boundaries
          if (currentStageRef.current !== nextIndex) {
            currentStageRef.current = nextIndex;
            setActiveStage(nextIndex);

            // Subtle, editorial text swap animation
            if (contentRef.current) {
              const swapEls = contentRef.current.querySelectorAll('.jp-anim-swap');
              gsap.fromTo(
                swapEls,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.03 }
              );
            }

            // Animate tech image swap
            if (visualRef.current) {
              const imgEl = visualRef.current.querySelector('.jp-tech-img');
              if (imgEl) {
                gsap.fromTo(
                  imgEl,
                  { opacity: 0, scale: 0.96 },
                  { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
                );
              }
            }
          }
        },
      });

      scrollTriggerInstance.current = st;

      // 3. Subtle parallax on visual container during pin
      gsap.to('.jp-tech-img', {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${journeyStages.length * 800}`,
          scrub: 1,
        },
      });
    });

    // ── Mobile: Natural scroll with simple reveal ─────────────────────────────
    mm.add('(max-width: 768px)', () => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => mm.revert();
  }, []);

  // Handle manual navigation clicks (syncs scroll position)
  const handlePillarChange = (idx) => {
    if (idx === activeStage) return;

    if (scrollTriggerInstance.current && window.innerWidth > 768) {
      const st = scrollTriggerInstance.current;
      const targetProgress = (idx + 0.15) / journeyStages.length;
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      setActiveStage(idx);
      currentStageRef.current = idx;
      if (contentRef.current) {
        const swapEls = contentRef.current.querySelectorAll('.jp-anim-swap');
        gsap.fromTo(
          swapEls,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.03 }
        );
      }
    }
  };

  return (
    <section className="jp-section" ref={sectionRef} aria-label="MurtiHub Institutional Pillars">
      <div className="jp-pin-container" ref={pinContainerRef}>
        <div
          className={`jp-card-wrapper jp-theme-${stage.theme} jp-stage-${activeStage + 1}`}
          ref={cardRef}
        >
          {/* Subtle background ambient radial light */}
          <div className="jp-ambient-glow" aria-hidden="true" />
          <div className="jp-grid-pattern" aria-hidden="true" />

          {/* ── 1. LEFT SIDEBAR ──────────────────────────────────────── */}
          <aside className="jp-sidebar" aria-label="Section Pillar Indicator">
            {/* Large translucent number */}
            <div className="jp-sidebar-num" aria-hidden="true">
              {stage.number}
            </div>

            {/* Thin vertical line with blue indicator dot */}
            <div className="jp-sidebar-axis">
              <div className="jp-sidebar-line-track">
                <div
                  className="jp-sidebar-line-fill"
                  ref={lineFillRef}
                  style={{ height: `${((activeStage + 1) / journeyStages.length) * 100}%` }}
                />
                <span
                  className="jp-sidebar-dot"
                  ref={dotRef}
                  style={{ top: `${((activeStage + 0.5) / journeyStages.length) * 100}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Bottom vertical label */}
            <div className="jp-sidebar-tag" aria-hidden="true">
              <span>Our Pillars</span>
            </div>
          </aside>

          {/* ── 2. MAIN EDITORIAL CONTENT ────────────────────────────── */}
          <div className="jp-main-content" ref={contentRef}>
            {/* Mobile-only compact pill badge */}
            <div className="jp-mobile-pillar-badge" aria-hidden="true">
              <span className="jp-mb-num">{stage.number}</span>
              <span className="jp-mb-slash">/</span>
              <span className="jp-mb-label">Our Pillars</span>
            </div>

            {/* Eyebrow in electric blue */}
            <p className="jp-focus-tag jp-anim-swap">{stage.focus}</p>

            {/* Main Display Heading */}
            <h2 className="jp-heading jp-anim-swap">{stage.title}</h2>

            {/* Italic Serif Subtitle */}
            <h3 className="jp-subtitle jp-anim-swap">{stage.subtitle}</h3>

            {/* Editorial Paragraph */}
            <p className="jp-description jp-anim-swap">{stage.description}</p>

            {/* Subtle Quote Panel */}
            <blockquote className="jp-quote-panel jp-anim-swap">
              <span className="jp-quote-mark" aria-hidden="true">“</span>
              <p className="jp-quote-text">{stage.accentPhrase}</p>
            </blockquote>

            {/* Premium Pill-Shaped Navy CTA */}
            <div className="jp-actions">
              <Link to="/about" className="jp-cta-btn">
                <span>Read Institutional Philosophy</span>
                <ArrowRight size={15} className="jp-cta-arrow" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* ── 3. RIGHT ARCHITECTURAL VISUAL AREA ───────────────────── */}
          <div className="jp-visual-area" ref={visualRef}>
            {/* Upper-right vertical navigation */}
            <nav className="jp-pillar-nav" aria-label="Pillars Navigation">
              {journeyStages.map((st, idx) => {
                const isActive = idx === activeStage;
                return (
                  <button
                    key={st.number}
                    type="button"
                    className={`jp-pillar-nav-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => handlePillarChange(idx)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className="jp-nav-dot" aria-hidden="true" />
                    <span className="jp-nav-label">{st.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* Transparent 3D Tech Architectural Visual (Generated via Gemini) */}
            <div className="jp-arch-container" aria-hidden="true">
              <img
                src={stage.image}
                alt={`${stage.title} Architectural Infrastructure`}
                className="jp-tech-img"
                loading="eager"
              />

              {/* Holographic schematic overlay markings */}
              <div className="jp-tech-overlay">
                <span className="jp-coord-tag">SEC.ARCH // 0{activeStage + 1}</span>
                <span className="jp-diag-line" />
              </div>
            </div>

            {/* Bottom-right tagline */}
            <div className="jp-bottom-tagline" aria-hidden="true">
              <span>Building A</span>
              <span>More Human</span>
              <span>Tomorrow</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
