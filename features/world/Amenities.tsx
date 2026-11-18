'use client';

import { RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { floorY } from '@/data/residence';
import { Model, Sofa } from './Furniture';
import type { Materials } from './materials';
import { boxGeo, worldUV } from './materials';

const R = floorY(43);
const P = floorY(4);
const PI = Math.PI;

function Deck({ m, x0, x1, z0, z1, y }: { m: Materials; x0: number; x1: number; z0: number; z1: number; y: number }) {
  const w = x1 - x0;
  const d = z1 - z0;
  const geo = useMemo(() => worldUV(new THREE.PlaneGeometry(w, d), w, d, 2), [w, d]);
  return <mesh geometry={geo} material={m.deck} rotation-x={-PI / 2} position={[(x0 + x1) / 2, y, (z0 + z1) / 2]} receiveShadow />;
}

function Lounger({ m, at, rot }: { m: Materials; at: [number, number]; rot: number }) {
  return (
    <group position={[at[0], R, at[1]]} rotation-y={rot}>
      <mesh position={[0, 0.17, 0]} geometry={boxGeo(0.7, 0.06, 1.9, 1)} material={m.oak} castShadow />
      {[-0.3, 0.3].map((x) =>
        [-0.85, 0.85].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.08, z]} material={m.darkBronze}>
            <boxGeometry args={[0.04, 0.16, 0.04]} />
          </mesh>
        )),
      )}
      <RoundedBox args={[0.66, 0.08, 1.25]} radius={0.035} position={[0, 0.25, 0.3]} material={m.linen} castShadow />
      <RoundedBox args={[0.66, 0.08, 0.7]} radius={0.035} position={[0, 0.45, -0.58]} rotation-x={0.75} material={m.linen} castShadow />
    </group>
  );
}

function Planter({
  m,
  at,
  size,
  plant,
  s = 1.4,
  y,
}: {
  m: Materials;
  at: [number, number];
  size: [number, number, number];
  plant?: string;
  s?: number;
  y: number;
}) {
  return (
    <group>
      <mesh position={[at[0], y + size[1] / 2, at[1]]} geometry={boxGeo(size[0], size[1], size[2], 1.5)} material={m.facade} castShadow receiveShadow />
      <mesh position={[at[0], y + size[1] - 0.04, at[1]]} material={m.soil}>
        <boxGeometry args={[size[0] - 0.12, 0.02, size[2] - 0.12]} />
      </mesh>
      {plant && <Model name={plant} at={at} y={y + size[1] - 0.55 * s} s={s} />}
    </group>
  );
}

function Pool({ m }: { m: Materials }) {
  const x0 = -11.7;
  const x1 = -4.2;
  const z0 = -10;
  const z1 = 10;
  const depth = 1.35;
  const basin = useMemo(() => new THREE.MeshStandardMaterial({ color: '#9fb8b0', roughness: 0.6 }), []);
  const water = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#2c5b58',
        roughness: 0.04,
        transparent: true,
        opacity: 0.72,
        envMapIntensity: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
      }),
    [],
  );
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const w = x1 - x0;
  const d = z1 - z0;
  return (
    <group>
      <mesh rotation-x={-PI / 2} position={[cx, R - depth, cz]} material={basin}>
        <planeGeometry args={[w, d]} />
      </mesh>
      <mesh position={[x1, R - depth / 2, cz]} rotation-y={-PI / 2} material={basin}>
        <planeGeometry args={[d, depth]} />
      </mesh>
      <mesh position={[cx, R - depth / 2, z0]} material={basin}>
        <planeGeometry args={[w, depth]} />
      </mesh>
      <mesh position={[cx, R - depth / 2, z1]} rotation-y={PI} material={basin}>
        <planeGeometry args={[w, depth]} />
      </mesh>
      <mesh rotation-x={-PI / 2} position={[cx, R - 0.07, cz]} material={water}>
        <planeGeometry args={[w, d]} />
      </mesh>
      {/* the infinity edge: a bronze lip on the west parapet */}
      <mesh position={[x0 - 0.1, R - 0.1, cz]} material={m.darkBronze}>
        <boxGeometry args={[0.2, 0.08, d]} />
      </mesh>
    </group>
  );
}

function Lounge({ m }: { m: Materials }) {
  const x0 = 1.2;
  const x1 = 11.4;
  const z0 = -11.4;
  const z1 = -2.2;
  const h = 3.2;
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  return (
    <group>
      <mesh position={[cx, R + h + 0.15, cz]} geometry={boxGeo(x1 - x0 + 0.6, 0.3, z1 - z0 + 0.6, 2)} material={m.precast} castShadow />
      {[
        [x0, cz, 0.02, z1 - z0],
        [x1, cz, 0.02, z1 - z0],
        [cx, z0, x1 - x0, 0.02],
        [cx, z1, x1 - x0, 0.02],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, R + h / 2, z]} material={m.balustrade}>
          <boxGeometry args={[w, h, d]} />
        </mesh>
      ))}
      {[
        [x0, z0],
        [x1, z0],
        [x0, z1],
        [x1, z1],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, R + h / 2, z]} material={m.bronze}>
          <boxGeometry args={[0.12, h, 0.12]} />
        </mesh>
      ))}
      <RoundedBox args={[4.2, 0.012, 3.2]} radius={0.004} position={[6.2, R + 0.01, -6.8]} material={m.wool} />
      <Sofa m={m} at={[6.2, -9.4]} rot={0} y={R} />
      <Model name="modern_arm_chair_01" at={[4.4, -5.6]} y={R} rot={PI * 0.8} />
      <Model name="modern_arm_chair_01" at={[8.0, -5.6]} y={R} rot={-PI * 0.8} />
      <Model name="modern_coffee_table_02" at={[6.2, -6.9]} y={R} />
      <Model name="potted_plant_01" at={[10.6, -10.6]} y={R} />
      <Model name="modern_ceiling_lamp_01" at={[5.2, -6.9]} y={R + h - 1.17} shadow={false} />
      <Model name="modern_ceiling_lamp_01" at={[7.2, -6.9]} y={R + h - 1.17} shadow={false} />
    </group>
  );
}

function Terrace({ m }: { m: Materials }) {
  const slats = useMemo(() => Array.from({ length: 22 }, (_, i) => 2.8 + i * 0.4), []);
  return (
    <group>
      {slats.map((z) => (
        <mesh key={z} position={[6.3, R + 2.9, z]} material={m.bronze} castShadow>
          <boxGeometry args={[10, 0.18, 0.05]} />
        </mesh>
      ))}
      {[1.4, 11.2].map((x) =>
        [2.8, 11.2].map((z) => (
          <mesh key={`${x}${z}`} position={[x, R + 1.45, z]} material={m.bronze}>
            <boxGeometry args={[0.1, 2.9, 0.1]} />
          </mesh>
        )),
      )}
      <Model name="outdoor_table_chair_set_01" at={[4.4, 6.0]} y={R} />
      <Model name="outdoor_table_chair_set_01" at={[8.4, 8.4]} y={R} rot={PI / 2} />
      <Planter m={m} at={[11.0, 4.6]} size={[0.8, 0.7, 2.6]} plant="potted_plant_02" s={1.2} y={R} />
      <Planter m={m} at={[2.2, 11.0]} size={[2.4, 0.7, 0.8]} plant="potted_plant_02" s={1.2} y={R} />
    </group>
  );
}

function Rooftop({ m }: { m: Materials }) {
  return (
    <group>
      <Deck m={m} x0={-4.2} x1={12.4} z0={-12.4} z1={12.4} y={R + 0.005} />
      <Deck m={m} x0={-12.4} x1={-4.2} z0={-12.4} z1={-10} y={R + 0.005} />
      <Deck m={m} x0={-12.4} x1={-4.2} z0={10} z1={12.4} y={R + 0.005} />
      <Pool m={m} />
      {[-7.6, -4.4, -1.2, 2.0, 5.2, 8.4].map((z) => (
        <Lounger key={z} m={m} at={[-3.1, z]} rot={-PI / 2} />
      ))}
      <Lounge m={m} />
      <Terrace m={m} />
    </group>
  );
}

function Gym({ m }: { m: Materials }) {
  const x0 = 12.8;
  const x1 = 19.6;
  const z0 = -19.6;
  const z1 = -6.5;
  const h = 4;
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  return (
    <group>
      <mesh rotation-x={-PI / 2} position={[cx, P + 0.01, cz]} material={m.rubber}>
        <planeGeometry args={[x1 - x0, z1 - z0]} />
      </mesh>
      <mesh position={[cx, P + h + 0.15, cz]} geometry={boxGeo(x1 - x0 + 0.4, 0.3, z1 - z0 + 0.4, 2)} material={m.precast} />
      {[
        [x0, cz, 0.02, z1 - z0],
        [cx, z0, x1 - x0, 0.02],
        [cx, z1, x1 - x0, 0.02],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, P + h / 2, z]} material={m.balustrade}>
          <boxGeometry args={[w, h, d]} />
        </mesh>
      ))}
      {/* mirror wall */}
      <mesh position={[x1 - 0.02, P + h / 2, cz]} material={m.mirror}>
        <boxGeometry args={[0.03, h, z1 - z0]} />
      </mesh>
      {/* three treadmills facing the glass */}
      {[-17.5, -15.2, -12.9].map((z) => (
        <group key={z} position={[16.2, P, z]}>
          <RoundedBox args={[0.8, 0.22, 2.0]} radius={0.05} position={[0, 0.14, 0]} material={m.black} castShadow />
          <mesh position={[0, 0.26, 0.05]} material={m.rubber}>
            <boxGeometry args={[0.55, 0.02, 1.6]} />
          </mesh>
          {[-0.36, 0.36].map((x) => (
            <mesh key={x} position={[x, 0.75, -0.85]} rotation-x={0.15} material={m.steel}>
              <boxGeometry args={[0.05, 1.1, 0.05]} />
            </mesh>
          ))}
          <mesh position={[0, 1.3, -0.95]} rotation-x={-0.5} material={m.black}>
            <boxGeometry args={[0.8, 0.05, 0.4]} />
          </mesh>
        </group>
      ))}
      {/* bench and dumbbell rack */}
      <group position={[15.6, P, -9.2]}>
        <RoundedBox args={[0.35, 0.1, 1.3]} radius={0.04} position={[0, 0.45, 0]} material={m.charcoalFabric} castShadow />
        <mesh position={[0, 0.2, 0]} material={m.steel}>
          <boxGeometry args={[0.08, 0.4, 1.0]} />
        </mesh>
      </group>
      <group position={[19.0, P, -12.8]}>
        <mesh position={[0, 0.45, 0]} material={m.darkBronze}>
          <boxGeometry args={[0.5, 0.06, 2.6]} />
        </mesh>
        <mesh position={[0, 0.8, 0]} material={m.darkBronze}>
          <boxGeometry args={[0.5, 0.06, 2.6]} />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <group key={i} position={[0, i % 2 ? 0.88 : 0.53, -1.15 + (i >> 1) * 0.75]}>
            {[-0.13, 0.13].map((x) => (
              <mesh key={x} position={[x, 0, 0]} rotation-z={PI / 2} material={m.black}>
                <cylinderGeometry args={[0.07 + i * 0.004, 0.07 + i * 0.004, 0.09, 24]} />
              </mesh>
            ))}
            <mesh rotation-z={PI / 2} material={m.steel}>
              <cylinderGeometry args={[0.016, 0.016, 0.3, 12]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Garden({ m }: { m: Materials }) {
  const hedges: [number, number, number, number][] = [
    [-16, 0, 1.2, 16],
    [-19.2, -10, 1.0, 14],
    [0, 16, 16, 1.2],
    [-10, 19.2, 14, 1.0],
  ];
  return (
    <group>
      {/* lawns west and south of the tower */}
      <mesh rotation-x={-PI / 2} position={[-16, P + 0.02, 0]} material={m.lawn} receiveShadow>
        <planeGeometry args={[8, 40]} />
      </mesh>
      <mesh rotation-x={-PI / 2} position={[0, P + 0.021, 16]} material={m.lawn} receiveShadow>
        <planeGeometry args={[24, 8]} />
      </mesh>
      {/* stone path and a 30 m water rill */}
      <mesh rotation-x={-PI / 2} position={[-13.6, P + 0.03, 0]} material={m.stone}>
        <planeGeometry args={[1.6, 40]} />
      </mesh>
      <mesh rotation-x={-PI / 2} position={[-17.8, P + 0.035, 2]}>
        <planeGeometry args={[0.6, 30]} />
        <meshPhysicalMaterial color="#1f2a2a" roughness={0.03} clearcoat={1} envMapIntensity={1.6} />
      </mesh>
      {hedges.map(([x, z, w, d], i) => (
        <RoundedBox key={i} args={[w, 1.0, d]} radius={0.35} smoothness={3} position={[x, P + 0.5, z]} material={m.leaf} castShadow />
      ))}
      {[
        [-17, -15],
        [-17, 8],
        [-6, 17],
        [6, 17],
        [-17, 16],
      ].map(([x, z], i) => (
        <Planter key={i} m={m} at={[x, z]} size={[2.2, 0.8, 2.2]} plant="potted_plant_01" s={2.6} y={P} />
      ))}
      {[-8, -4, 0, 4].map((z) => (
        <Model key={z} name="Ottoman_01" at={[-14.8, z]} y={P} rot={PI / 2} />
      ))}
    </group>
  );
}

export function Amenities({ m }: { m: Materials }) {
  return (
    <group>
      <Rooftop m={m} />
      <Garden m={m} />
      <Gym m={m} />
    </group>
  );
}
