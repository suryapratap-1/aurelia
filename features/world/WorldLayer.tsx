'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { shotIndex } from './shots';
import { detectTier, emit, hasWebGL2, rail, type Tier, world } from './store';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

/** The single fixed WebGL canvas behind the 3D sections, plus the door-swing wipe used for cuts. */
export function WorldLayer() {
  const [state, setState] = useState<{ tier: Tier; webgl: boolean } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const webgl = hasWebGL2() && !params.has('no-webgl');
    const forced = params.get('tier') as Tier | null;
    const tier = forced ?? detectTier();
    world.tier = tier;
    world.webgl = webgl;
    document.documentElement.dataset.tier = tier;
    document.documentElement.dataset.gpu = webgl ? 'webgl2' : 'none';
    if (!webgl) {
      world.ready = true;
      world.progress = 1;
      emit();
    }
    const shot = params.get('shot');
    if (shot && shot in shotIndex) {
      world.debugShot = shotIndex[shot];
      rail.target = rail.current = shotIndex[shot];
      rail.snap = true;
      rail.visible = 99;
      document.documentElement.dataset.world = 'on';
      if (params.has('clean')) document.documentElement.dataset.clean = '1';
    }
    // read-only handle for automated review (stills, frame checks)
    (window as unknown as { __aurelia: unknown }).__aurelia = { world, rail };
    setState({ tier, webgl });
  }, []);

  return (
    <>
      <div className="world-layer" aria-hidden="true">
        {state?.webgl && <Scene tier={state.tier} />}
        {state && !state.webgl && <Image src="/stills/hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />}
      </div>
      <div id="swing" aria-hidden="true" className="grid place-items-center">
        <span className="label">Residence 23W</span>
      </div>
    </>
  );
}
