import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reusable hook for triggering subtle, editorial fade-and-rise animations on scroll.
 */
export function useScrollReveal(options = {}) {
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const {
      y = 30,
      duration = 0.85,
      delay = 0,
      start = 'top 85%',
      stagger = 0,
      ease = 'power2.out'
    } = options;

    const ctx = gsap.context(() => {
      if (stagger > 0 && el.children.length > 0) {
        gsap.fromTo(
          el.children,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            stagger,
            ease,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: 'play none none none'
            }
          }
        );
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, [options.y, options.duration, options.delay, options.start, options.stagger]);

  return elementRef;
}

