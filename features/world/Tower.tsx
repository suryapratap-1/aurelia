'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { floorY, LEVEL } from '@/data/residence';
import type { Materials } from './materials';
import { boxGeo } from './materials';
import { useWorldUniforms } from './uniforms';
import { windowMaterial } from './windowMaterial';

const HALF = 12;
const BASE = floorY(4); // podium roof
const ROOF = floorY(43);
const H = ROOF - BASE;

function useInstances(ref: React.RefObject<THREE.InstancedMesh | null>, mats: THREE.Matrix4[]) {
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    mats.forEach((x, i) => {
      m.setMatrixAt(i, x);
    });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [ref, mats]);
}

const M = (x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) =>
  new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(sx, sy, sz));

export function Tower({ m }: { m: Materials }) {
  const u = useWorldUniforms();

  // floor volumes behind the glass (other homes), lit by the window shader
  const volMat = useMemo(() => windowMaterial({ color: '#a89c8c', uniforms: u.tower, floor: 3.4, bay: 1.5, roughness: 0.9 }), [u]);
  const volumes = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    for (let n = 4; n <= 42; n++) {
      const y = floorY(n) + 1.5;
      if (n === LEVEL) out.push(M(8.4, y, 0, 6.6, 3.0, 23.2));
      else out.push(M(0, y, 0, 23.2, 3.0, 23.2));
    }
    return out;
  }, []);
  const volRef = useRef<THREE.InstancedMesh>(null);
  useInstances(volRef, volumes);

  const slabs = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    for (let n = 4; n <= 43; n++) out.push(M(0, floorY(n) - 0.2, 0, 24.9, 0.4, 24.9));
    return out;
  }, []);
  const slabRef = useRef<THREE.InstancedMesh>(null);
  useInstances(slabRef, slabs);

  const fins = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = -HALF + i * 1.5;
      out.push(M(-HALF - 0.17, BASE + H / 2, t, 0.3, H, 0.05));
      out.push(M(HALF + 0.17, BASE + H / 2, t, 0.3, H, 0.05));
      out.push(M(t, BASE + H / 2, -HALF - 0.17, 0.05, H, 0.3));
      out.push(M(t, BASE + H / 2, HALF + 0.17, 0.05, H, 0.3));
    }
    return out;
  }, []);
  const finRef = useRef<THREE.InstancedMesh>(null);
  useInstances(finRef, fins);

  // west balconies on every level (ours is modelled in detail separately)
  const balconies = useMemo(() => {
    const slab: THREE.Matrix4[] = [];
    const glass: THREE.Matrix4[] = [];
    for (let n = 5; n <= 42; n++) {
      if (n === LEVEL) continue;
      const y = floorY(n);
      slab.push(M(-13.3, y - 0.15, -1.25, 2.6, 0.3, 8.5));
      glass.push(M(-14.58, y + 0.55, -1.25, 0.02, 1.1, 8.5));
    }
    return { slab, glass };
  }, []);
  const balSlabRef = useRef<THREE.InstancedMesh>(null);
  const balGlassRef = useRef<THREE.InstancedMesh>(null);
  useInstances(balSlabRef, balconies.slab);
  useInstances(balGlassRef, balconies.glass);

  const unit = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const podiumMat = useMemo(() => windowMaterial({ color: '#e6ddcf', uniforms: u.tower, floor: 3.4, bay: 3.2 }), [u]);

  return (
    <group>
      {/* podium: lobby glass at street level, stone above */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[38.6, 4.6, 38.6]} />
        <meshStandardMaterial color="#3a2e24" emissive="#ffb977" emissiveIntensity={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, (4.6 + BASE) / 2, 0]} material={podiumMat}>
        <boxGeometry args={[40, BASE - 4.6, 40]} />
      </mesh>
      <mesh position={[0, BASE - 0.15, 0]} geometry={boxGeo(40.6, 0.3, 40.6, 2)} material={m.precast} />

      {/* tower */}
      <instancedMesh ref={volRef} args={[unit, volMat, volumes.length]} />
      <instancedMesh ref={slabRef} args={[unit, m.precast, slabs.length]} castShadow receiveShadow />
      <instancedMesh ref={finRef} args={[unit, m.darkBronze, fins.length]} castShadow />
      <instancedMesh ref={balSlabRef} args={[unit, m.precast, balconies.slab.length]} />
      <instancedMesh ref={balGlassRef} args={[unit, m.balustrade, balconies.glass.length]} />
      <mesh position={[0, BASE + H / 2, 0]} material={m.glass} renderOrder={2}>
        <boxGeometry args={[24, H, 24]} />
      </mesh>

      {/* crown: roof parapet glass and lift overrun */}
      <mesh position={[0, ROOF + 0.6, -HALF]} material={m.balustrade}>
        <boxGeometry args={[24.9, 1.2, 0.03]} />
      </mesh>
      <mesh position={[0, ROOF + 0.6, HALF]} material={m.balustrade}>
        <boxGeometry args={[24.9, 1.2, 0.03]} />
      </mesh>
      <mesh position={[HALF, ROOF + 0.6, 0]} material={m.balustrade}>
        <boxGeometry args={[0.03, 1.2, 24.9]} />
      </mesh>
      <mesh position={[3.4, ROOF + 2.1, 0.2]} geometry={boxGeo(4.2, 4.2, 3.6, 2)} material={m.facade} castShadow />
    </group>
  );
}
