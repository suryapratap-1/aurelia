'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PlanSvg, px } from '@/components/plan/PlanSvg';
import { journeyStops } from '@/data/site';
import { railRanges } from '@/features/world/shots';
import { rail, subscribe, world } from '@/features/world/store';
import { useWorldSection } from '@/features/world/useWorldSection';
import { scrollToY, stopOffsets } from '@/lib/motion';

const range = railRanges.journey;
const N = journeyStops.length;

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [webgl, setWebgl] = useState(true);
  const dot = useRef<SVGGElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((idx: number) => {
    const k = Math.round(idx - range[0]);
    setActive((a) => (a === k ? a : Math.max(0, Math.min(N - 1, k))));
    if (bar.current) bar.current.style.transform = `scaleY(${(idx - range[0]) / (range[1] - range[0])})`;
  }, []);
  useWorldSection(ref, range, { start: 'top top', end: 'bottom bottom', onProgress });

  useEffect(() => {
    setWebgl(world.webgl);
    return subscribe(() => setWebgl(world.webgl));
  }, []);

  // register each stop's scroll offset so the floor plan can jump into the walk-through
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    journeyStops.forEach((s, k) => {
      stopOffsets.set(s.shot, () => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return top + (k / (N - 1)) * (el.offsetHeight - window.innerHeight);
      });
    });
  }, []);

  // the camera's position on the mini plan
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const g = dot.current;
      if (!g || rail.visible === 0) return;
      const inside = rail.cy > 70 && rail.cy < 82 && rail.cx > -16 && rail.cx < 6;
      g.style.opacity = inside ? '1' : '0';
      if (!inside) return;
      const [x, y] = px(rail.cx, rail.cz);
      // plan heading: screen X = −z, screen Y = x
      const deg = (Math.atan2(Math.cos(rail.heading), -Math.sin(rail.heading)) * 180) / Math.PI;
      g.setAttribute('transform', `translate(${x} ${y}) rotate(${deg})`);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  const stop = journeyStops[active];

  return (
    <section ref={ref} id="journey" aria-labelledby="journey-title" className="relative z-10" style={{ height: `${N * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden text-paper">
        {!webgl && <Image src={`/stills/${stop.shot}.webp`} alt="" fill sizes="100vw" className="object-cover" />}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/60 to-transparent" aria-hidden="true" />

        <h2 id="journey-title" className="sr-only">
          Walk through Residence 23W
        </h2>

        {/* caption: the current stop */}
        <div className="wrap absolute inset-x-0 bottom-[8vh]">
          <div className="max-w-[30rem]" aria-live="polite">
            <p className="label !text-paper/80 tnum">
              {stop.level}{' '}
              <span className="opacity-60">
                · {active + 1} of {N}
              </span>
            </p>
            <p key={stop.shot} className="mt-3 animate-[rise_.9s_var(--ease-settle)_both] font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[0.98]">
              {stop.title}
            </p>
            <p key={`${stop.shot}b`} className="mt-4 max-w-[36ch] animate-[rise_.9s_.08s_var(--ease-settle)_both] text-[1.06rem] leading-snug text-paper/90">
              {stop.body}
            </p>
          </div>
        </div>

        {/* where am I: the plan, with the camera on it */}
        <div className="absolute right-4 top-24 hidden w-[15rem] text-paper md:block lg:right-8 lg:w-[17rem]">
          <PlanSvg compact className="h-auto w-full text-charcoal opacity-90 drop-shadow-sm" title="Your position on the plan">
            <g ref={dot} style={{ opacity: 0, transition: 'opacity .4s' }}>
              <path d="M0 0 L60 -26 A 64 64 0 0 1 60 26 Z" fill="var(--color-bronze)" opacity="0.35" />
              <circle r="9" fill="var(--color-bronze)" stroke="var(--color-paper)" strokeWidth="3" />
            </g>
          </PlanSvg>
        </div>

        {/* progress through the walk */}
        <div className="absolute bottom-[8vh] right-4 top-[45vh] w-px bg-paper/25 lg:right-8" aria-hidden="true">
          <div ref={bar} className="h-full w-full origin-top bg-paper" style={{ transform: 'scaleY(0)' }} />
        </div>

        {/* skip: the sequence is long; let people leave it in one action */}
        <button
          type="button"
          onClick={() => {
            const el = ref.current;
            if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY + el.offsetHeight);
          }}
          className="link-line absolute bottom-[3vh] right-4 pb-0.5 text-[0.88rem] font-medium lg:right-8"
        >
          Skip the walk-through
        </button>
      </div>

      {/* the full sequence as text, for screen readers and search */}
      <ol className="sr-only">
        {journeyStops.map((s) => (
          <li key={s.shot}>
            {s.level}: {s.title}. {s.body}
          </li>
        ))}
      </ol>
    </section>
  );
}
