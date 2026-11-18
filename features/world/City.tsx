'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Tier } from './store';
import { useWorldUniforms } from './uniforms';
import { windowMaterial } from './windowMaterial';

/** Seeded PRNG so the city is identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** River Ostra (fictional) runs north–south west of the tower. */
export const RIVER = { x0: -460, x1: -150 };

type Bld = { x: number; z: number; w: number; d: number; h: number; tone: number };

function layout(tier: Tier) {
  const R = mulberry32(23);
  const out: Bld[] = [];
  const pitch = 64;
  const span = tier === 'low' ? 900 : 1300;
  for (let gx = -span; gx <= span; gx += pitch)
    for (let gz = -span; gz <= span; gz += pitch) {
      // river, quay park and the tower's own plot stay open
      if (gx > RIVER.x0 - 40 && gx < RIVER.x1 + 40) continue;
      if (gx > RIVER.x1 && gx < -40 && Math.abs(gz) < 260) continue;
      if (Math.abs(gx) < 60 && Math.abs(gz) < 60) continue;
      const dist = Math.hypot(gx, gz);
      if (dist > span) continue;
      const n = 1 + Math.floor(R() * 3);
      for (let i = 0; i < n; i++) {
        const w = 14 + R() * 26;
        const d = 14 + R() * 26;
        const x = gx + (R() - 0.5) * (pitch - 16 - w * 0.5);
        const z = gz + (R() - 0.5) * (pitch - 16 - d * 0.5);
        // denser and taller east (the business district), lower on the far bank
        // low near the quay, a few towers further east; Aurelia (143 m) stays the tallest nearby
        const east = gx > 0 ? 1 : 0.5;
        const near = Math.min(1, dist / 600);
        const tall = R() < 0.05 * east * near ? 50 + R() * 70 : 0;
        const h = (9 + R() * R() * 34) * east * (0.6 + 0.4 * near) + tall;
        out.push({ x, z, w, d, h, tone: R() });
      }
    }
  return out;
}

export function City({ tier }: { tier: Tier }) {
  const u = useWorldUniforms();
  const blds = useMemo(() => layout(tier), [tier]);
  const ref = useRef<THREE.InstancedMesh>(null);

  const mat = useMemo(() => windowMaterial({ color: '#ffffff', uniforms: u.city, floor: 3.3, bay: 2.8 }), [u]);
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), []);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    const tones = ['#d8d0c3', '#b9b2a7', '#8e8a84', '#cbbba4', '#6f6c68', '#e4dccd'];
    blds.forEach((b, i) => {
      o.position.set(b.x, 0, b.z);
      o.scale.set(b.w, b.h, b.d);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, c.set(tones[Math.floor(b.tone * tones.length)]));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere();
  }, [blds]);

  const lamps = useMemo(() => {
    const pts: [number, number][] = [];
    // the quay promenade lamps, every 18 m, and the bridge
    for (let z = -620; z <= 620; z += 18) pts.push([RIVER.x1 + 6, z], [RIVER.x0 - 6, z]);
    for (let x = RIVER.x0; x <= RIVER.x1; x += 16) pts.push([x, -330], [x, -322]);
    for (let x = -120; x <= 1200; x += 22) pts.push([x, 72], [x, -72]);
    return pts;
  }, []);
  const lampRef = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = lampRef.current;
    if (!m) return;
    const o = new THREE.Object3D();
    lamps.forEach(([x, z], i) => {
      o.position.set(x, 6, z);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [lamps]);

  return (
    <group>
      {/* ground */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
        <planeGeometry args={[6000, 6000]} />
        <meshStandardMaterial color="#4a443d" roughness={0.96} />
      </mesh>
      {/* quay park on the east bank */}
      <mesh rotation-x={-Math.PI / 2} position={[(RIVER.x1 - 40) / 2 - 10, 0.01, 0]}>
        <planeGeometry args={[RIVER.x1 * -1 - 50, 520]} />
        <meshStandardMaterial color="#56603f" roughness={1} />
      </mesh>
      {/* promenade */}
      <mesh rotation-x={-Math.PI / 2} position={[RIVER.x1 + 8, 0.03, 0]}>
        <planeGeometry args={[16, 3000]} />
        <meshStandardMaterial color="#b9ae9c" roughness={0.9} />
      </mesh>
      {/* river Ostra */}
      <Water />
      {/* bridge */}
      <mesh position={[(RIVER.x0 + RIVER.x1) / 2, 5, -326]}>
        <boxGeometry args={[RIVER.x1 - RIVER.x0 + 40, 1.6, 16]} />
        <meshStandardMaterial color="#cfc6b6" roughness={0.8} />
      </mesh>

      <instancedMesh ref={ref} args={[geo, mat, blds.length]} frustumCulled={false} />
      <instancedMesh ref={lampRef} args={[undefined, undefined, lamps.length]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshBasicMaterial color="#ffcf8f" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Water() {
  const normal = useMemo(() => {
    // tiling ripple normal map drawn once on a canvas
    const s = 256;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d') as CanvasRenderingContext2D;
    const img = g.createImageData(s, s);
    const R = mulberry32(7);
    const waves = Array.from({ length: 14 }, () => ({ kx: Math.round((R() - 0.5) * 12), kz: Math.round((R() - 0.5) * 24), p: R() * 6.28, a: 0.3 + R() }));
    for (let y = 0; y < s; y++)
      for (let x = 0; x < s; x++) {
        let dx = 0;
        let dz = 0;
        for (const w of waves) {
          const ph = ((w.kx * x + w.kz * y) / s) * Math.PI * 2 + w.p;
          dx += Math.cos(ph) * w.kx * w.a;
          dz += Math.cos(ph) * w.kz * w.a;
        }
        const i = (y * s + x) * 4;
        img.data[i] = 128 + dx * 2.2;
        img.data[i + 1] = 128 + dz * 2.2;
        img.data[i + 2] = 255;
        img.data[i + 3] = 255;
      }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(30, 120);
    return t;
  }, []);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[(RIVER.x0 + RIVER.x1) / 2, -0.6, 0]}>
      <planeGeometry args={[RIVER.x1 - RIVER.x0, 6000]} />
      <meshPhysicalMaterial
        color="#24292a"
        roughness={0.07}
        metalness={0}
        normalMap={normal}
        normalScale={new THREE.Vector2(0.18, 0.18)}
        envMapIntensity={1.6}
        clearcoat={1}
        clearcoatRoughness={0.04}
      />
    </mesh>
  );
}
