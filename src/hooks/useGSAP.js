import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook to safely create and clean up GSAP animations within a React component.
 * Uses gsap.context for full cleanup on component unmount.
 */
export function useGSAP(callback, dependencies = []) {
  const scopeRef = useRef(null);

  useLayoutEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      callback(gsap, ScrollTrigger, prefersReducedMotion);
    }, scopeRef);

    return () => ctx.revert(); // clean up all animations & ScrollTriggers created in context
  }, dependencies);

  return scopeRef;
}

export { gsap, ScrollTrigger };

