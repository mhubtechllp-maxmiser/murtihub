import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './HeroCarousel.scss';

export default function HeroCarousel({ slides = [], currentIndex = 0 }) {
  const slidesContainerRef = useRef(null);
  const totalSlides = slides.length;
  const prevIndexRef = useRef(0);

  // Trigger GSAP crossfade whenever currentIndex changes
  useEffect(() => {
    if (!slidesContainerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slideElements = slidesContainerRef.current.querySelectorAll('.hero-slide-item');

    slideElements.forEach((slideEl, index) => {
      const img = slideEl.querySelector('.hero-slide-img');
      if (index === currentIndex) {
        gsap.to(slideEl, {
          opacity: 1,
          duration: prefersReducedMotion ? 0.1 : 1.6,
          ease: 'power2.inOut',
          zIndex: 2,
        });
        if (!prefersReducedMotion && img) {
          gsap.fromTo(
            img,
            { scale: 1.06 },
            { scale: 1.0, duration: 7, ease: 'none' }
          );
        }
      } else {
        gsap.to(slideEl, {
          opacity: 0,
          duration: prefersReducedMotion ? 0.1 : 1.6,
          ease: 'power2.inOut',
          zIndex: 1,
        });
      }
    });

    prevIndexRef.current = currentIndex;
  }, [currentIndex]);

  const formatSlideNum = (num) => String(num + 1).padStart(2, '0');

  return (
    <div className="hero-carousel-root" aria-hidden="true">
      {/* Background Slides */}
      <div className="hero-slides-wrapper" ref={slidesContainerRef}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`hero-slide-item ${idx === 0 ? 'is-initial-active' : ''}`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="hero-slide-img"
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
      </div>

      {/* Multi-stop dark overlay — heavy on left for text, lighter right to reveal architecture */}
      <div className="hero-cinematic-overlay" />

      {/* Subtle grid pattern */}
      <div className="hero-architectural-grid" />

      {/* Slide counter — top right, matching reference */}
      {totalSlides > 1 && (
        <div className="hero-slide-counter">
          <span className="slide-counter-current">{formatSlideNum(currentIndex)}</span>
          <div className="slide-counter-dots">
            {slides.map((_, idx) => (
              <span key={idx} className={`slide-dot ${idx === currentIndex ? 'is-active' : ''}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
