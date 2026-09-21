import { useState, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animates a numeric counter smoothly when scrolled into view.
 */
export function useCounter(targetValue, duration = 1.6) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(targetValue);
      return;
    }

    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: targetValue,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          setCount(Math.floor(obj.val));
        },
        onComplete: () => {
          setCount(targetValue);
        }
      });
    });

    return () => ctx.revert();
  }, [targetValue, duration]);

  return [count, elementRef];
}

