'use client';

import { useEffect, useRef } from 'react';
import { shotIndex } from '@/features/world/shots';
import { useWorldSection } from '@/features/world/useWorldSection';
import { prefersReducedMotion, registerGsap } from '@/lib/motion';

const range = [shotIndex.hero, shotIndex.hero + 0.3] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useWorldSection(ref, range, { start: 'top top', end: 'bottom top' });

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = registerGsap();
    const lines = el.querySelectorAll('[data-line]');
    const rest = el.querySelectorAll('[data-rise]');
    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 105 });
      gsap.set(rest, { autoAlpha: 0, y: 18 });
    });
    const play = () =>
      ctx.add(() => {
        gsap
          .timeline({ delay: 0.15 })
          .to(lines, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.09 })
          .to(rest, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, '-=1.1');
      });
    if (document.documentElement.dataset.entered === '1') play();
    else addEventListener('aurelia:enter', play, { once: true });
    return () => {
      removeEventListener('aurelia:enter', play);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative z-10 h-[100svh] min-h-[38rem] text-paper">
      {/* legibility: a soft shade at the foot of the frame only */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal/55 to-transparent" aria-hidden="true" />
      <div className="wrap relative flex h-full flex-col justify-end pb-[9vh]">
        <p data-rise className="label !text-paper/80 mb-6">
          Aurelia Residences · Ostra Quay · a fictional concept
        </p>
        <h1 id="hero-title" className="max-w-[12ch] text-[length:var(--text-display)] leading-[0.92]">
          <span className="line-mask">
            <span data-line className="block">
              Twenty-three
            </span>
          </span>
          <span className="line-mask">
            <span data-line className="block">
              floors above
            </span>
          </span>
          <span className="line-mask">
            <span data-line className="block">
              the&nbsp;river.
            </span>
          </span>
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p data-rise className="max-w-[34ch] text-[1.125rem] leading-snug text-paper/90">
            Residence 23W: three bedrooms, 288 m², glass on three sides. Walk through it room by room, before a single wall is built.
          </p>
          <div data-rise className="flex flex-wrap items-center gap-5">
            <a href="#journey" className="btn-door">
              Walk through the residence
            </a>
            <a href="#plan" className="link-line pb-1 font-medium">
              See the plan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
