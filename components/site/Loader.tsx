'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { subscribe, world } from '@/features/world/store';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * The loader is the entry door drawn as on the plan: its swing arc opens with real load progress,
 * then the whole page swings open about the same hinge. It can always be skipped.
 */
export function Loader() {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  const enter = useCallback(() => {
    if (done.current) return;
    done.current = true;
    document.documentElement.dataset.entered = '1';
    dispatchEvent(new Event('aurelia:enter'));
    if (prefersReducedMotion()) {
      setGone(true);
      return;
    }
    setLeaving(true);
    setTimeout(() => setGone(true), 1400);
  }, []);

  useEffect(() => {
    const update = () => {
      setProgress(world.progress);
      if (world.ready) setTimeout(enter, 350);
    };
    const off = subscribe(update);
    if (world.debugShot !== null) enter();
    // never hold the visitor: after 7 s the page opens and loading continues behind it
    const cap = setTimeout(enter, 7000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') enter();
    };
    addEventListener('keydown', onKey);
    return () => {
      off();
      clearTimeout(cap);
      removeEventListener('keydown', onKey);
    };
  }, [enter]);

  if (gone) return null;
  const a = (Math.PI / 2) * Math.min(1, progress);
  // hinge at (40, 160); the leaf turns from closed (pointing up the wall) to open (pointing into the room)
  const R = 110;
  const lx = 40 + Math.sin(a) * R;
  const ly = 160 - Math.cos(a) * R;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ivory text-ink"
      style={{
        clipPath: leaving ? 'circle(0% at 0% 100%)' : 'circle(150vmax at 0% 100%)',
        transition: 'clip-path 1.3s cubic-bezier(0.7, 0, 0.2, 1)',
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-8 px-6 text-center">
        <svg viewBox="0 0 200 200" className="h-44 w-44" aria-hidden="true">
          {/* the wall and its opening */}
          <path d="M40 10 V50 M40 160 V190" stroke="currentColor" strokeWidth="6" />
          <path d="M10 160 H40" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          {/* swing arc: dashed, as on a drawing */}
          <path
            d={`M40 50 A ${R} ${R} 0 0 1 ${lx.toFixed(2)} ${ly.toFixed(2)}`}
            stroke="var(--color-bronze)"
            strokeWidth="1.4"
            strokeDasharray="4 4"
            fill="none"
          />
          {/* the leaf */}
          <line x1="40" y1="160" x2={lx} y2={ly} stroke="var(--color-bronze)" strokeWidth="3" />
          <circle cx="40" cy="160" r="3.2" fill="currentColor" />
        </svg>
        <div>
          <p className="font-display text-[1.6rem] leading-tight">Residence 23W</p>
          <p className="label mt-2">{progress < 1 ? 'Drawing the residence' : 'Opening'}</p>
        </div>
        <button type="button" onClick={enter} className="link-line pb-1 text-[0.95rem] font-medium">
          Open the door now
        </button>
      </div>
    </div>
  );
}
