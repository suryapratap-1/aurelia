'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CEILING, doors, floorY, LEVEL, roomById, walls } from '@/data/residence';
import type { Materials } from './materials';
import { boxGeo, worldUV } from './materials';
import { useWorldUniforms } from './uniforms';

export const F = floorY(LEVEL);
const WALL_T = 0.12;

const leafAngle = (d: [number, number]) => Math.atan2(-d[1], d[0]);
/** Open angle unwrapped to the short way round from the closed angle. */
const openAngle = (closed: [number, number], open: [number, number]) => {
  const a0 = leafAngle(closed);
  let a1 = leafAngle(open);
  while (a1 - a0 > Math.PI) a1 -= Math.PI * 2;
  while (a1 - a0 < -Math.PI) a1 += Math.PI * 2;
  return [a0, a1] as const;
};

function Floors({ m }: { m: Materials }) {
  const parquet = useMemo(() => worldUV(new THREE.PlaneGeometry(12, 24), 12, 24, 1.6), []);
  const wet = (['primaryBath', 'powder', 'bath2', 'pantry'] as const).map((id) => roomById[id]);
  return (
    <group>
      <mesh geometry={parquet} material={m.parquet} rotation-x={-Math.PI / 2} position={[-6, F + 0.001, 0]} receiveShadow />
      {wet.map((r) => {
        const [x0, x1, z0, z1] = r.rect;
        const w = x1 - x0;
        const d = z1 - z0;
        return (
          <mesh
            key={r.id}
            geometry={worldUV(new THREE.PlaneGeometry(w, d), w, d, 1.2)}
            material={m.stone}
            rotation-x={-Math.PI / 2}
            position={[(x0 + x1) / 2, F + 0.004, (z0 + z1) / 2]}
            receiveShadow
          />
        );
      })}
      {/* ceiling */}
      <mesh material={m.ceiling} rotation-x={Math.PI / 2} position={[-3.5, F + CEILING, -0.5]}>
        <planeGeometry args={[17, 25]} />
      </mesh>
    </group>
  );
}

function Walls({ m }: { m: Materials }) {
  const shadowGap = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 1 }), []);
  const parts = useMemo(
    () =>
      walls.map(([x1, z1, x2, z2]) => {
        const len = Math.hypot(x2 - x1, z2 - z1) + WALL_T;
        const alongX = Math.abs(z2 - z1) < 1e-6;
        return {
          pos: [(x1 + x2) / 2, F + CEILING / 2, (z1 + z2) / 2] as const,
          w: alongX ? len : WALL_T,
          d: alongX ? WALL_T : len,
        };
      }),
    [],
  );
  const lintels = useMemo(
    () =>
      doors.map((d) => {
        const h = d.id === 'entry' ? 2.7 : 2.4;
        const cx = d.hinge[0] + (d.closed[0] * d.width) / 2;
        const cz = d.hinge[1] + (d.closed[1] * d.width) / 2;
        const alongX = d.closed[0] !== 0;
        return {
          id: d.id,
          pos: [cx, F + h + (CEILING - h) / 2, cz] as const,
          w: alongX ? d.width : WALL_T,
          d: alongX ? WALL_T : d.width,
          h: CEILING - h,
        };
      }),
    [],
  );
  return (
    <group>
      {parts.map((p, i) => (
        <group key={i}>
          <mesh position={p.pos as unknown as THREE.Vector3Tuple} geometry={boxGeo(p.w, CEILING, p.d, 2.5)} material={m.plaster} castShadow receiveShadow />
          <mesh position={[p.pos[0], F + 0.012, p.pos[2]]} material={shadowGap}>
            <boxGeometry args={[p.w + 0.02, 0.024, p.d + 0.02]} />
          </mesh>
        </group>
      ))}
      {lintels.map((l) => (
        <mesh key={l.id} position={l.pos as unknown as THREE.Vector3Tuple} geometry={boxGeo(l.w, l.h, l.d, 2.5)} material={m.plaster} />
      ))}
    </group>
  );
}

function Doors({ m }: { m: Materials }) {
  const u = useWorldUniforms();
  const entry = useRef<THREE.Group>(null);
  const e = doors[0];
  const [a0, a1] = openAngle(e.closed, e.open);
  useFrame(() => {
    if (entry.current) entry.current.rotation.y = THREE.MathUtils.lerp(a0, a1 + (a1 > a0 ? -0.1 : 0.1), u.door.value);
  });
  return (
    <group>
      {/* the front door: solid walnut, 2.7 m, three bronze hinges */}
      <group ref={entry} position={[e.hinge[0] - 0.03, F, e.hinge[1]]}>
        <mesh position={[e.width / 2, 1.35, 0]} geometry={boxGeo(e.width - 0.01, 2.7, 0.07, 1.2)} material={m.walnut} castShadow />
        <mesh position={[e.width - 0.12, 1.05, -0.07]} material={m.bronze}>
          <boxGeometry args={[0.025, 0.9, 0.03]} />
        </mesh>
        <mesh position={[e.width - 0.12, 1.05, 0.07]} material={m.bronze}>
          <boxGeometry args={[0.025, 0.9, 0.03]} />
        </mesh>
        {[0.3, 1.35, 2.4].map((y) => (
          <mesh key={y} position={[0.01, y, 0]} material={m.bronze}>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 12]} />
          </mesh>
        ))}
      </group>
      {doors.slice(1).map((d) => {
        const [c0, c1] = openAngle(d.closed, d.open);
        const a = c1 + (c0 - c1) * 0.08;
        return (
          <group key={d.id} position={[d.hinge[0], F, d.hinge[1]]} rotation-y={a}>
            <mesh position={[d.width / 2, 1.2, 0]} geometry={boxGeo(d.width - 0.02, 2.4, 0.045, 1.2)} material={m.oak} castShadow />
            <mesh position={[d.width - 0.1, 1.02, 0.04]} material={m.bronze}>
              <boxGeometry args={[0.14, 0.018, 0.018]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Lift lobby outside the front door. */
function Lobby({ m }: { m: Materials }) {
  return (
    <group>
      <mesh geometry={worldUV(new THREE.PlaneGeometry(5.2, 5), 5.2, 5, 1.2)} material={m.stone} rotation-x={-Math.PI / 2} position={[2.6, F + 0.002, -0.5]} />
      <mesh position={[2.6, F + 1.5, -3.0]} geometry={boxGeo(5.2, 3, 0.1, 1.2)} material={m.walnut} />
      <mesh position={[2.6, F + 1.5, 2.0]} geometry={boxGeo(5.2, 3, 0.1, 1.2)} material={m.walnut} />
      <mesh position={[5.2, F + 1.5, -0.5]} geometry={boxGeo(0.1, 3, 5, 1.2)} material={m.plaster} />
      {/* lift doors */}
      <mesh position={[5.13, F + 1.2, -0.5]} material={m.darkBronze}>
        <boxGeometry args={[0.04, 2.4, 1.3]} />
      </mesh>
      {/* the residence number on the wall beside the door: 23W */}
      <mesh position={[0.08, F + 1.55, -1.6]} material={m.bronze}>
        <boxGeometry args={[0.012, 0.22, 0.34]} />
      </mesh>
    </group>
  );
}

function Balcony({ m }: { m: Materials }) {
  const r = roomById.balcony.rect;
  const w = r[1] - r[0];
  const d = r[3] - r[2];
  const cx = (r[0] + r[1]) / 2;
  const cz = (r[2] + r[3]) / 2;
  return (
    <group>
      <mesh position={[cx, F - 0.15, cz]} geometry={boxGeo(w, 0.3, d, 2)} material={m.precast} receiveShadow />
      <mesh
        geometry={worldUV(new THREE.PlaneGeometry(w, d), w, d, 2)}
        material={m.deck}
        rotation-x={-Math.PI / 2}
        position={[cx, F + 0.005, cz]}
        receiveShadow
      />
      <mesh position={[r[0] + 0.02, F + 0.55, cz]} material={m.balustrade}>
        <boxGeometry args={[0.02, 1.1, d]} />
      </mesh>
      <mesh position={[cx, F + 0.55, r[2] + 0.01]} material={m.balustrade}>
        <boxGeometry args={[w, 1.1, 0.02]} />
      </mesh>
      <mesh position={[cx, F + 0.55, r[3] - 0.01]} material={m.balustrade}>
        <boxGeometry args={[w, 1.1, 0.02]} />
      </mesh>
      <mesh position={[r[0] + 0.02, F + 1.11, cz]} material={m.bronze}>
        <boxGeometry args={[0.05, 0.03, d]} />
      </mesh>
    </group>
  );
}

/** Interior light: lamps that warm up with the dusk value. */
function Lamps({ m }: { m: Materials }) {
  const u = useWorldUniforms();
  const group = useRef<THREE.Group>(null);
  const lamps: [number, number, number, number][] = [
    [-8, F + 2.7, -2.4, 7],
    [-9.5, F + 2.1, 2.75, 5],
    [-4.5, F + 2.7, 3.3, 5],
    [-8, F + 2.7, -8.6, 6],
    [-9.5, F + 2.7, 8.6, 5],
    [-4.7, F + 2.7, 9.3, 4],
    [-1.25, F + 2.7, 8.5, 3],
    [-2, F + 2.7, -10, 4],
    [2.4, F + 2.75, -0.5, 4],
  ];
  const downlights = useMemo(() => {
    const pts: [number, number][] = [];
    for (let x = -10.5; x <= -1; x += 2.4) for (let z = -10.5; z <= 11; z += 2.6) pts.push([x, z]);
    return pts;
  }, []);
  useFrame(() => {
    const k = u.lamps.value;
    group.current?.children.forEach((c, i) => {
      const l = c as THREE.PointLight;
      l.intensity = lamps[i][3] * (0.35 + 0.65 * k);
    });
    m.lamp.emissiveIntensity = 0.6 + 2.4 * k;
  });
  return (
    <group>
      <group ref={group}>
        {lamps.map(([x, y, z], i) => (
          <pointLight key={i} position={[x, y, z]} color="#ffc98f" distance={8} decay={2} intensity={0} />
        ))}
      </group>
      {downlights.map(([x, z], i) => (
        <mesh key={i} position={[x, F + CEILING - 0.004, z]} rotation-x={Math.PI / 2} material={m.lamp}>
          <circleGeometry args={[0.045, 20]} />
        </mesh>
      ))}
      {/* curtain pelmet light along the west glass */}
      <mesh position={[-11.82, F + CEILING - 0.03, -0.5]} material={m.lamp}>
        <boxGeometry args={[0.02, 0.02, 21]} />
      </mesh>
    </group>
  );
}

/** Sheer linen curtains stacked at the ends of the glass. */
function Curtains({ m }: { m: Materials }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.7, CEILING - 0.06, 40, 1);
    const p = g.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 36) * 0.045);
    g.computeVertexNormals();
    return g;
  }, []);
  const mat = useMemo(() => {
    const c = m.linen.clone();
    c.side = THREE.DoubleSide;
    c.transparent = true;
    c.opacity = 0.82;
    return c;
  }, [m]);
  const spots: [number, number, number][] = [
    [-11.75, -5.15, Math.PI / 2],
    [-11.75, 4.6, Math.PI / 2],
    [-11.75, -11.5, Math.PI / 2],
    [-11.75, 11.5, Math.PI / 2],
    [-4.45, 11.75, 0],
    [-11.5, -11.75, 0],
  ];
  return (
    <group>
      {spots.map(([x, z, r], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[x, F + CEILING / 2, z]} rotation-y={r} />
      ))}
    </group>
  );
}

export function Apartment({ m }: { m: Materials }) {
  return (
    <group>
      <Floors m={m} />
      <Walls m={m} />
      <Doors m={m} />
      <Lobby m={m} />
      <Balcony m={m} />
      <Curtains m={m} />
      <Lamps m={m} />
    </group>
  );
}
