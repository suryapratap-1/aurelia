'use client';

import { createElement, type ReactNode, useEffect, useRef } from 'react';
import { prefersReducedMotion, registerGsap } from '@/lib/motion';

/**
 * A heading that swings up into place when it enters: rotated slightly about its bottom-left
 * corner, like a door closing to the wall. Visible by default (no JS, reduced motion).
 */
export function Reveal({ as = 'div', children, className, id }: { as?: 'h2' | 'h3' | 'p' | 'div'; children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = registerGsap();
    // a context reverts cleanly (StrictMode runs effects twice in development)
    const ctx = gsap.context(() => {
      gsap.from(el, {
        rotate: 4,
        yPercent: 30,
        autoAlpha: 0,
        transformOrigin: '0% 100%',
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);
  return createElement(as, { ref, className, id }, children);
}
