'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { amenities } from '@/data/site';
import { railRanges } from '@/features/world/shots';
import { subscribe, world } from '@/features/world/store';
import { useWorldSection } from '@/features/world/useWorldSection';
import { scrollToY } from '@/lib/motion';

const range = railRanges.amenities;
const N = amenities.length;

export function Amenities() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    setWebgl(world.webgl);
    return subscribe(() => setWebgl(world.webgl));
  }, []);
  const onProgress = useCallback((idx: number) => {
    const k = Math.max(0, Math.min(N - 1, Math.round(idx - range[0])));
    setActive((a) => (a === k ? a : k));
  }, []);
  useWorldSection(ref, range, { start: 'top top', end: 'bottom bottom', onProgress });

  const jump = (k: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + (k / (N - 1)) * (el.offsetHeight - window.innerHeight));
  };
  const a = amenities[active];

  return (
    <section ref={ref} id="amenities" aria-labelledby="amenities-title" className="relative z-10" style={{ height: `${N * 110}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden text-paper">
        {!webgl && <Image src={`/stills/${a.shot}.webp`} alt="" fill sizes="100vw" className="object-cover" />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/10 to-transparent" aria-hidden="true" />
        <div className="wrap relative grid h-full grid-cols-12 content-end gap-x-6 pb-[8vh] pt-28 md:content-between">
          <div className="col-span-12 md:col-span-5">
            <p className="label !text-paper/75 mb-4">Amenities</p>
            <h2 id="amenities-title" className="text-[length:var(--text-title)]">
              The roof and the podium are&nbsp;shared.
            </h2>
            <ol className="mt-8 hidden space-y-1 md:block">
              {amenities.map((x, k) => (
                <li key={x.shot}>
                  <button
                    type="button"
                    onClick={() => jump(k)}
                    aria-current={k === active ? 'step' : undefined}
                    className="group flex items-baseline gap-4 py-1 text-left text-[1.15rem] text-paper/60 transition-colors aria-[current=step]:text-paper"
                  >
                    <span className="h-px w-6 translate-y-[-0.3em] bg-current transition-all duration-500 group-aria-[current=step]:w-12" />
                    {x.title}
                    <span className="label !text-current opacity-70">{x.level}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="col-span-12 mt-10 md:col-span-4 md:col-start-9 md:mt-0 md:self-end" aria-live="polite">
            <p className="label !text-paper/75">{a.level}</p>
            <p key={a.shot} className="mt-3 animate-[rise_.9s_var(--ease-settle)_both] font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-none">
              {a.title}
            </p>
            <p key={`${a.shot}b`} className="mt-4 animate-[rise_.9s_.08s_var(--ease-settle)_both] leading-snug text-paper/90">
              {a.body}
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[0.92rem] text-paper/80 tnum">
              {a.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ul className="sr-only">
        {amenities.map((x) => (
          <li key={x.shot}>
            {x.title}, {x.level}: {x.body} {x.facts.join(', ')}.
          </li>
        ))}
      </ul>
    </section>
  );
}
