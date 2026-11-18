'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { rail } from '@/features/world/store';
import { prefersReducedMotion, registerGsap, scroller } from '@/lib/motion';

/** One clock: Lenis, GSAP and ScrollTrigger share GSAP's ticker. Native scroll under reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      rail.px = (e.clientX / innerWidth) * 2 - 1;
      rail.py = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener('pointermove', onPointer, { passive: true });
    // keyboard, anchor and programmatic jumps bypass the smooth scroller: update triggers directly
    const onNative = () => ScrollTrigger.update();
    addEventListener('scroll', onNative, { passive: true });

    if (prefersReducedMotion()) {
      return () => {
        removeEventListener('pointermove', onPointer);
        removeEventListener('scroll', onNative);
      };
    }
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, anchors: true });
    scroller.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroller.lenis = null;
      removeEventListener('pointermove', onPointer);
      removeEventListener('scroll', onNative);
    };
  }, []);
  return null;
}
