'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

let registered = false;
export function registerGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The page's smooth scroller, if one is running (none under reduced motion). */
export const scroller: { lenis: Lenis | null } = { lenis: null };

export function scrollToY(y: number, immediate = false) {
  if (scroller.lenis) scroller.lenis.scrollTo(y, { immediate, duration: 1.6 });
  else window.scrollTo({ top: y, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function scrollToEl(el: Element | string) {
  const node = typeof el === 'string' ? document.querySelector(el) : el;
  if (!node) return;
  const y = node.getBoundingClientRect().top + window.scrollY;
  scrollToY(y);
}

/** Registry of scroll offsets for journey stops, so the floor plan can jump into the sequence. */
export const stopOffsets = new Map<string, () => number>();
