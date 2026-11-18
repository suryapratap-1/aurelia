'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { shotIndex, shots } from './shots';
import { rail } from './store';
import { useWorldUniforms } from './uniforms';

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

type Run = { a: number; b: number; pos: THREE.CatmullRomCurve3; look: THREE.CatmullRomCurve3 };

/** Splits the shot list into continuous runs (a cut starts a new run) and builds one spline per run. */
function buildRuns(): Run[] {
  const runs: Run[] = [];
  let a = 0;
  for (let i = 1; i <= shots.length; i++) {
    if (i === shots.length || shots[i].cut) {
      const s = shots.slice(a, i);
      const pts = s.length === 1 ? [s[0], s[0]] : s;
      runs.push({
        a,
        b: i - 1,
        pos: new THREE.CatmullRomCurve3(
          pts.map((x) => new THREE.Vector3(...x.pos)),
          false,
          'centripetal',
        ),
        look: new THREE.CatmullRomCurve3(
          pts.map((x) => new THREE.Vector3(...x.look)),
          false,
          'centripetal',
        ),
      });
      a = i;
    }
  }
  return runs;
}

export function Rig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const u = useWorldUniforms();
  const runs = useMemo(buildRuns, []);
  const runOf = useMemo(() => shots.map((_, i) => runs.findIndex((r) => i >= r.a && i <= r.b)), [runs]);
  const tmpP = useMemo(() => new THREE.Vector3(), []);
  const tmpL = useMemo(() => new THREE.Vector3(), []);
  const swingEl = useRef<HTMLElement | null>(null);
  const reducedMotion = useMemo(() => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    swingEl.current = document.getElementById('swing');
  }, []);

  /** The run the camera is in, and the time-based swing that covers a cut between runs. */
  const shown = useRef({ run: -1, swingStart: -1 });
  const SWING = 1.0;

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const S = shown.current;
    const snapping = rail.snap;
    if (rail.snap) {
      rail.current = rail.target;
      rail.snap = false;
    } else {
      rail.current = THREE.MathUtils.damp(rail.current, rail.target, 3.2, d);
      if (Math.abs(rail.current - rail.target) < 1e-4) rail.current = rail.target;
    }
    const n = shots.length;
    const c = THREE.MathUtils.clamp(rail.current, 0, n - 1);
    const i = Math.min(Math.floor(c), n - 2);
    const t = c - i;
    // the run the scroll position asks for (across a cut, the far side from the midpoint on)
    const want = runOf[shots[i + 1].cut ? (t < 0.5 ? i : i + 1) : i];

    // a cut never follows the scroll position directly: it plays a fixed-length swing and
    // switches runs while the screen is covered, so it can never be left half-closed
    let cover = 0;
    let hinge = 0;
    const now = performance.now() / 1000;
    if (S.run < 0 || snapping || reducedMotion) S.run = want;
    if (want !== S.run && S.swingStart < 0) S.swingStart = now;
    if (S.swingStart >= 0) {
      const p = (now - S.swingStart) / SWING;
      if (p >= 0.5) S.run = want;
      if (p >= 1) S.swingStart = -1;
      else {
        const q = p < 0.5 ? p * 2 : (1 - p) * 2;
        cover = q < 1 ? 1 - (1 - q) ** 3 : 1;
        hinge = p < 0.5 ? 0 : 1;
      }
    }
    rail.swinging = S.swingStart >= 0;

    // sample the shown run's spline, clamped to its own shots; rest at each stop (dwell)
    const r = runs[S.run];
    const cc = THREE.MathUtils.clamp(c, r.a, r.b);
    const ii = r.b === r.a ? r.a : Math.min(Math.floor(cc), r.b - 1);
    const e = smooth(0.12, 0.88, cc - ii);
    const k = r.b === r.a ? 0 : (ii - r.a + e) / (r.b - r.a);
    r.pos.getPoint(k, tmpP);
    r.look.getPoint(k, tmpL);
    const A = shots[ii];
    const B = shots[Math.min(ii + 1, r.b)];
    const fov = THREE.MathUtils.lerp(A.fov, B.fov, e);
    const dusk = THREE.MathUtils.lerp(A.dusk, B.dusk, e);

    // a little parallax from the pointer, more outside than in
    const inside = tmpP.y > 70 && tmpP.y < 80 && tmpP.x < 6 && tmpP.x > -15;
    const amp = inside ? 0.25 : 2.5;
    tmpL.x += rail.px * amp;
    tmpL.y -= rail.py * amp * 0.5;

    camera.position.copy(tmpP);
    camera.lookAt(tmpL);
    rail.cx = tmpP.x;
    rail.cy = tmpP.y;
    rail.cz = tmpP.z;
    rail.heading = Math.atan2(tmpL.z - tmpP.z, tmpL.x - tmpP.x);
    if (Math.abs(camera.fov - fov) > 1e-3) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // time of day
    u.city.uLit.value = 0.03 + 0.62 * dusk * dusk;
    u.tower.uLit.value = 0.08 + 0.55 * dusk * dusk;
    u.city.uGlow.value = u.tower.uGlow.value = 0.5 + 2.6 * dusk;
    scene.backgroundIntensity = 1 - 0.5 * dusk * dusk;
    scene.environmentIntensity = 0.42 * (1 - 0.45 * dusk * dusk);
    u.lamps.value = smooth(0.3, 0.95, dusk);
    gl.toneMappingExposure = 1.0 - 0.18 * dusk;

    // the front door swings open as you step from the corridor to the foyer
    const c0 = shotIndex.corridor;
    u.door.value = smooth(c0 + 0.15, c0 + 0.8, c);

    const el = swingEl.current;
    if (el) {
      el.style.setProperty('--swing', cover.toFixed(3));
      el.style.setProperty('--hinge', `${hinge}`);
      el.style.visibility = cover > 0.001 ? 'visible' : 'hidden';
    }
  });

  return null;
}
