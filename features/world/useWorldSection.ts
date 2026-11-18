'use client';

import { type RefObject, useEffect } from 'react';
import { registerGsap } from '@/lib/motion';
import { rail, world } from './store';

/**
 * Binds a section's scroll progress to a range of camera shots.
 * While the section is on screen the 3D layer is shown and the rail follows scroll.
 */
export function useWorldSection(
  ref: RefObject<HTMLElement | null>,
  range: readonly [number, number],
  opts: { start?: string; end?: string; onProgress?: (index: number) => void } = {},
) {
  const { start = 'top bottom', end = 'bottom top', onProgress } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el || world.debugShot !== null) return;
    const { ScrollTrigger } = registerGsap();
    let on = false;
    const setOn = (v: boolean) => {
      if (v === on) return;
      on = v;
      rail.visible += v ? 1 : -1;
      document.documentElement.dataset.world = rail.visible > 0 ? 'on' : 'off';
    };
    let prog: ReturnType<typeof ScrollTrigger.create> | undefined;
    // visibility: any part of the section on screen
    const vis = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        if (self.isActive) {
          // entering from an opaque section: jump straight to this section's shot
          if (rail.visible === 0) rail.snap = true;
          rail.target = range[0] + (range[1] - range[0]) * (prog?.progress ?? 0);
        }
        setOn(self.isActive);
      },
    });
    // progress through the shots
    prog = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      onUpdate: (self) => {
        const idx = range[0] + (range[1] - range[0]) * self.progress;
        rail.target = idx;
        onProgress?.(idx);
      },
      onToggle: (self) => {
        if (self.isActive) {
          const idx = range[0] + (range[1] - range[0]) * self.progress;
          rail.target = idx;
        }
      },
    });
    if (vis.isActive) {
      rail.snap = true;
      setOn(true);
      rail.target = range[0] + (range[1] - range[0]) * prog.progress;
    }
    const p = prog;
    return () => {
      vis.kill();
      p.kill();
      setOn(false);
    };
  }, [ref, range, start, end, onProgress]);
}
