'use client';

import { RoundedBox, useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { CEILING } from '@/data/residence';
import { F } from './Apartment';
import type { Materials } from './materials';
import { boxGeo } from './materials';

export const modelUrls = [
  'mid_century_lounge_chair',
  'modern_arm_chair_01',
  'modern_coffee_table_02',
  'modern_ceiling_lamp_01',
  'potted_plant_01',
  'potted_plant_02',
  'potted_plant_04',
  'ceramic_vase_01',
  'ceramic_vase_03',
  'brass_vase_01',
  'outdoor_table_chair_set_01',
  'Ottoman_01',
  'modern_wooden_cabinet',
  'side_table_01',
].map((n) => `/models/${n}.glb`);

type V3 = [number, number, number];

/** A Poly Haven model, cloned so it can be placed many times. Positions are on the residence floor. */
export function Model({
  name,
  at,
  rot = 0,
  s = 1,
  y = F,
  shadow = true,
}: {
  name: string;
  at: [number, number];
  rot?: number;
  s?: number;
  y?: number;
  shadow?: boolean;
}) {
  const { scene } = useGLTF(`/models/${name}.glb`);
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = shadow;
        mesh.receiveShadow = true;
      }
    });
    return c;
  }, [scene, shadow]);
  return <primitive object={obj} position={[at[0], y, at[1]]} rotation-y={rot} scale={s} />;
}

const PI = Math.PI;

/** A low modern sofa: walnut plinth, linen seat and back cushions. Local: back at z = 0, seat towards +z. */
export function Sofa({ m, at, rot, y = F, len = 2.8 }: { m: Materials; at: [number, number]; rot: number; y?: number; len?: number }) {
  const n = 3;
  const cw = (len - 0.36) / n;
  return (
    <group position={[at[0], y, at[1]]} rotation-y={rot}>
      <mesh position={[0, 0.06, 0.48]} geometry={boxGeo(len - 0.1, 0.12, 0.86, 1)} material={m.walnut} castShadow receiveShadow />
      <RoundedBox args={[len, 0.24, 1.0]} radius={0.06} smoothness={4} position={[0, 0.24, 0.5]} material={m.charcoalFabric} castShadow receiveShadow />
      {Array.from({ length: n }, (_, i) => (
        <RoundedBox
          key={i}
          args={[cw - 0.02, 0.17, 0.78]}
          radius={0.07}
          smoothness={5}
          position={[-len / 2 + 0.18 + cw * (i + 0.5), 0.44, 0.58]}
          material={m.linen}
          castShadow
          receiveShadow
        />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <RoundedBox
          key={i}
          args={[cw - 0.03, 0.46, 0.2]}
          radius={0.08}
          smoothness={5}
          position={[-len / 2 + 0.18 + cw * (i + 0.5), 0.66, 0.18]}
          rotation-x={-0.12}
          material={m.linen}
          castShadow
        />
      ))}
      <RoundedBox args={[len, 0.42, 0.16]} radius={0.06} smoothness={4} position={[0, 0.55, 0.08]} material={m.charcoalFabric} castShadow />
      {[-1, 1].map((sgn) => (
        <RoundedBox
          key={sgn}
          args={[0.18, 0.4, 1.0]}
          radius={0.07}
          smoothness={4}
          position={[sgn * (len / 2 - 0.09), 0.5, 0.5]}
          material={m.charcoalFabric}
          castShadow
        />
      ))}
      <RoundedBox
        args={[0.46, 0.4, 0.14]}
        radius={0.06}
        smoothness={4}
        position={[-len / 2 + 0.55, 0.72, 0.36]}
        rotation={[-0.25, 0.25, 0]}
        material={m.wool}
        castShadow
      />
    </group>
  );
}

function Bed({ m, at, rot, w = 1.9 }: { m: Materials; at: [number, number]; rot: number; w?: number }) {
  // local: headboard at z = 0, bed extends towards +z
  return (
    <group position={[at[0], F, at[1]]} rotation-y={rot}>
      <mesh position={[0, 0.16, 1.12]} geometry={boxGeo(w + 0.1, 0.3, 2.2, 1)} material={m.walnut} castShadow receiveShadow />
      <RoundedBox args={[w, 0.26, 2.04]} radius={0.06} smoothness={4} position={[0, 0.43, 1.1]} material={m.linen} castShadow receiveShadow />
      <RoundedBox args={[w + 0.08, 0.07, 1.4]} radius={0.03} smoothness={4} position={[0, 0.58, 1.48]} material={m.wool} castShadow />
      {[-0.45, 0.45].map((x) => (
        <RoundedBox
          key={x}
          args={[0.72, 0.16, 0.42]}
          radius={0.07}
          smoothness={4}
          position={[x * (w / 1.9), 0.66, 0.36]}
          rotation-x={-0.35}
          material={m.linen}
          castShadow
        />
      ))}
      <RoundedBox args={[w + 0.6, 1.25, 0.1]} radius={0.04} smoothness={4} position={[0, 0.63, 0.02]} material={m.charcoalFabric} castShadow />
      {[-1, 1].map((sgn) => (
        <group key={sgn} position={[sgn * (w / 2 + 0.55), 0, 0.32]}>
          <mesh position={[0, 0.26, 0]} geometry={boxGeo(0.5, 0.5, 0.42, 1)} material={m.walnut} castShadow />
          <mesh position={[0, 0.62, 0]} material={m.bronze}>
            <cylinderGeometry args={[0.05, 0.07, 0.22, 24]} />
          </mesh>
          <mesh position={[0, 0.82, 0]} material={m.lamp}>
            <cylinderGeometry args={[0.13, 0.16, 0.2, 32, 1, true]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Oak frame, linen seat: a plain modern dining chair. Local: faces +z. */
function DiningChair({ m, at, rot }: { m: Materials; at: [number, number]; rot: number }) {
  return (
    <group position={[at[0], F, at[1]]} rotation-y={rot}>
      {[-0.2, 0.2].map((x) =>
        [-0.2, 0.2].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.22, z]} material={m.oak} castShadow>
            <boxGeometry args={[0.035, 0.44, 0.035]} />
          </mesh>
        )),
      )}
      <RoundedBox args={[0.47, 0.07, 0.46]} radius={0.025} smoothness={3} position={[0, 0.47, 0]} material={m.linen} castShadow receiveShadow />
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.68, -0.21]} rotation-x={-0.08} material={m.oak} castShadow>
          <boxGeometry args={[0.035, 0.42, 0.035]} />
        </mesh>
      ))}
      <mesh position={[0, 0.8, -0.225]} rotation-x={-0.08} geometry={boxGeo(0.44, 0.14, 0.03, 1)} material={m.oak} castShadow />
    </group>
  );
}

/** Bronze ring frame and walnut seat. */
function BarStool({ m, at }: { m: Materials; at: [number, number] }) {
  return (
    <group position={[at[0], F, at[1]]}>
      <mesh position={[0, 0.72, 0]} material={m.walnut} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.05, 40]} />
      </mesh>
      {[0, 1, 2, 3].map((k) => {
        const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={k}
            position={[Math.cos(a) * 0.15, 0.35, Math.sin(a) * 0.15]}
            rotation={[Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12]}
            material={m.darkBronze}
            castShadow
          >
            <cylinderGeometry args={[0.012, 0.012, 0.72, 10]} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.26, 0]} rotation-x={Math.PI / 2} material={m.darkBronze}>
        <torusGeometry args={[0.18, 0.009, 8, 40]} />
      </mesh>
    </group>
  );
}

function Rug({ m, at, size, rot = 0 }: { m: Materials; at: [number, number]; size: [number, number]; rot?: number }) {
  return (
    <RoundedBox
      args={[size[0], 0.012, size[1]]}
      radius={0.005}
      smoothness={2}
      position={[at[0], F + 0.008, at[1]]}
      rotation-y={rot}
      material={m.wool}
      receiveShadow
    />
  );
}

function Kitchen({ m }: { m: Materials }) {
  return (
    <group>
      {/* island, 2.6 m of white marble with waterfall ends; it faces the dining table */}
      <group position={[-4.8, F, 3.2]}>
        <mesh position={[0, 0.45, 0]} geometry={boxGeo(0.9, 0.86, 2.5, 1)} material={m.walnut} castShadow receiveShadow />
        <mesh position={[0, 0.9, 0]} geometry={boxGeo(1.05, 0.04, 2.6, 1.4)} material={m.marble} castShadow receiveShadow />
        <mesh position={[0, 0.45, -1.28]} geometry={boxGeo(1.05, 0.9, 0.04, 1.4)} material={m.marble} castShadow />
        <mesh position={[0, 0.45, 1.28]} geometry={boxGeo(1.05, 0.9, 0.04, 1.4)} material={m.marble} castShadow />
      </group>
      {[2.4, 3.2, 4.0].map((z) => (
        <BarStool key={z} m={m} at={[-5.75, z]} />
      ))}
      <Model name="ceramic_vase_01" at={[-4.8, 3.9]} y={F + 0.92} />
      {/* back run on the hall wall: base units, marble worktop, walnut wall */}
      <group position={[-4.05, F, 4.6]}>
        <mesh position={[0, 0.44, 0]} geometry={boxGeo(3.9, 0.86, 0.66, 1)} material={m.walnut} castShadow receiveShadow />
        <mesh position={[0, 0.89, 0.0]} geometry={boxGeo(3.9, 0.035, 0.68, 1.4)} material={m.marble} />
        <mesh position={[0, 1.95, 0.3]} geometry={boxGeo(3.9, 2.05, 0.06, 1.2)} material={m.walnut} />
        <mesh position={[0, 1.5, 0.12]} geometry={boxGeo(3.6, 0.03, 0.3, 1)} material={m.walnut} castShadow />
        <mesh position={[-0.9, 0.91, 0]} material={m.black}>
          <boxGeometry args={[0.75, 0.01, 0.52]} />
        </mesh>
        <mesh position={[0.9, 0.9, -0.05]} material={m.steel}>
          <boxGeometry args={[0.6, 0.012, 0.42]} />
        </mesh>
        <mesh position={[0.9, 1.08, 0.2]} rotation-x={0.2} material={m.bronze}>
          <cylinderGeometry args={[0.012, 0.012, 0.36, 12]} />
        </mesh>
        <Model name="ceramic_vase_03" at={[-1.6, 0.15]} y={1.52} />
        <Model name="brass_vase_01" at={[1.5, 0.1]} y={0.905} s={0.6} />
      </group>
    </group>
  );
}

function Tub({ m, at, rot }: { m: Materials; at: [number, number]; rot: number }) {
  const geo = useMemo(() => {
    const rr = (w: number, h: number, r: number) => {
      const s = new THREE.Shape();
      s.moveTo(-w / 2 + r, -h / 2);
      s.lineTo(w / 2 - r, -h / 2);
      s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      s.lineTo(w / 2, h / 2 - r);
      s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      s.lineTo(-w / 2 + r, h / 2);
      s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      s.lineTo(-w / 2, -h / 2 + r);
      s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      return s;
    };
    const outer = rr(1.75, 0.82, 0.38);
    const inner = rr(1.6, 0.67, 0.32);
    outer.holes.push(inner as unknown as THREE.Path);
    const g = new THREE.ExtrudeGeometry(outer, { depth: 0.5, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 6, curveSegments: 48 });
    g.rotateX(-PI / 2);
    return g;
  }, []);
  return (
    <group position={[at[0], F + 0.04, at[1]]} rotation-y={rot}>
      <mesh geometry={geo} material={m.porcelain} castShadow receiveShadow />
      <RoundedBox args={[1.62, 0.1, 0.7]} radius={0.04} position={[0, 0.06, 0]} material={m.porcelain} />
    </group>
  );
}

function Vanity({ m, at, rot, len = 1.6, basins = 2 }: { m: Materials; at: [number, number]; rot: number; len?: number; basins?: number }) {
  // local: wall at z = 0, vanity projects towards +z
  return (
    <group position={[at[0], F, at[1]]} rotation-y={rot}>
      <mesh position={[0, 0.62, 0.26]} geometry={boxGeo(len, 0.36, 0.5, 1)} material={m.walnut} castShadow />
      <mesh position={[0, 0.82, 0.27]} geometry={boxGeo(len + 0.04, 0.04, 0.54, 1.2)} material={m.marble} />
      {Array.from({ length: basins }, (_, i) => {
        const x = basins === 1 ? 0 : (i - (basins - 1) / 2) * (len / basins);
        return (
          <group key={i} position={[x, 0.84, 0.3]}>
            <mesh position={[0, 0.06, 0]} material={m.porcelain}>
              <cylinderGeometry args={[0.2, 0.15, 0.12, 48]} />
            </mesh>
            <mesh position={[0, 0.2, -0.2]} rotation-x={PI / 2} material={m.bronze}>
              <cylinderGeometry args={[0.012, 0.012, 0.18, 12]} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 1.55, 0.015]} material={m.mirror}>
        <boxGeometry args={[len, 0.9, 0.02]} />
      </mesh>
    </group>
  );
}

function Shower({ m, glass, head }: { m: Materials; glass: { at: V3; size: V3 }; head: V3 }) {
  return (
    <group>
      <mesh position={glass.at} material={m.balustrade}>
        <boxGeometry args={glass.size} />
      </mesh>
      <mesh position={head} material={m.bronze}>
        <cylinderGeometry args={[0.15, 0.15, 0.012, 40]} />
      </mesh>
    </group>
  );
}

function Wardrobe({ m, at, rot, len }: { m: Materials; at: [number, number]; rot: number; len: number }) {
  return (
    <group position={[at[0], F, at[1]]} rotation-y={rot}>
      <mesh position={[0, 1.3, 0.3]} geometry={boxGeo(len, 2.6, 0.6, 1.2)} material={m.walnut} castShadow />
      {Array.from({ length: Math.floor(len / 0.6) }, (_, i) => (
        <mesh key={i} position={[-len / 2 + 0.6 * (i + 1), 1.3, 0.61]} material={m.black}>
          <boxGeometry args={[0.006, 2.5, 0.01]} />
        </mesh>
      ))}
    </group>
  );
}

/** A painting made in code: ochre and bronze fields on linen. */
function Painting({ at, rot, size }: { at: V3; rot: number; size: [number, number] }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 640;
    const g = c.getContext('2d') as CanvasRenderingContext2D;
    g.fillStyle = '#e9e1d3';
    g.fillRect(0, 0, 512, 640);
    const fields: [string, number, number, number, number][] = [
      ['#b9875a', 40, 60, 432, 250],
      ['#3b322b', 40, 330, 432, 22],
      ['#8a6a45', 40, 380, 300, 200],
      ['#d2b48f', 360, 380, 112, 200],
    ];
    for (const [col, x, y, w, h] of fields) {
      g.globalAlpha = 0.92;
      g.fillStyle = col;
      for (let i = 0; i < 26; i++) g.fillRect(x + Math.sin(i) * 2, y + i * (h / 26), w + Math.cos(i * 1.7) * 3, h / 26 + 1);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <group position={at} rotation-y={rot}>
      <mesh>
        <boxGeometry args={[size[0] + 0.06, size[1] + 0.06, 0.04]} />
        <meshStandardMaterial color="#2a2622" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={size} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Furniture({ m }: { m: Materials }) {
  return (
    <group>
      {/* foyer */}
      <group position={[-1.95, F, -2.28]}>
        <mesh position={[0, 0.82, 0]} geometry={boxGeo(1.1, 0.06, 0.36, 1)} material={m.walnut} castShadow />
        <mesh position={[-0.5, 0.4, 0]} material={m.bronze}>
          <boxGeometry args={[0.03, 0.8, 0.3]} />
        </mesh>
        <mesh position={[0.5, 0.4, 0]} material={m.bronze}>
          <boxGeometry args={[0.03, 0.8, 0.3]} />
        </mesh>
        <mesh position={[0, 1.65, -0.15]} rotation-x={PI / 2} material={m.mirror}>
          <cylinderGeometry args={[0.42, 0.42, 0.02, 64]} />
        </mesh>
      </group>
      <Model name="brass_vase_01" at={[-1.7, -2.3]} y={F + 0.85} s={0.7} />

      {/* living */}
      <Rug m={m} at={[-8.9, -2.4]} size={[3.6, 2.8]} />
      <Sofa m={m} at={[-6.9, -2.4]} rot={-PI / 2} len={3.0} />
      <Model name="modern_coffee_table_02" at={[-9.0, -2.4]} />
      <Model name="ceramic_vase_03" at={[-9.2, -2.2]} y={F + 0.37} />
      <Model name="mid_century_lounge_chair" at={[-10.6, -4.3]} rot={PI * 0.3} />
      <Model name="mid_century_lounge_chair" at={[-10.6, -0.5]} rot={PI * 0.7} />
      <Model name="side_table_01" at={[-7.4, -4.0]} />
      <Model name="potted_plant_01" at={[-11.35, -5.0]} s={1.15} />
      <Model name="modern_wooden_cabinet" at={[-9.0, -5.22]} />
      <Model name="potted_plant_04" at={[-9.6, -5.2]} y={F + 0.68} />
      <Painting at={[-4.07, F + 1.6, -4.0]} rot={-PI / 2} size={[1.1, 1.4]} />

      {/* dining: seats eight */}
      <group position={[-9.5, F, 2.75]}>
        <mesh position={[0, 0.74, 0]} geometry={boxGeo(2.6, 0.05, 1.05, 1.2)} material={m.oak} castShadow receiveShadow />
        {[-0.95, 0.95].map((x) => (
          <mesh key={x} position={[x, 0.36, 0]} material={m.darkBronze} castShadow>
            <boxGeometry args={[0.06, 0.72, 0.8]} />
          </mesh>
        ))}
      </group>
      {[-10.4, -9.5, -8.6].flatMap((x) => [
        <DiningChair key={`a${x}`} m={m} at={[x, 2.0]} rot={0} />,
        <DiningChair key={`b${x}`} m={m} at={[x, 3.5]} rot={PI} />,
      ])}
      <DiningChair m={m} at={[-11.1, 2.75]} rot={PI / 2} />
      <DiningChair m={m} at={[-7.9, 2.75]} rot={-PI / 2} />
      <Model name="modern_ceiling_lamp_01" at={[-10.1, 2.75]} y={F + CEILING - 1.17} shadow={false} />
      <Model name="modern_ceiling_lamp_01" at={[-8.9, 2.75]} y={F + CEILING - 1.17} shadow={false} />
      <Model name="ceramic_vase_01" at={[-9.5, 2.75]} y={F + 0.765} s={0.8} />

      <Kitchen m={m} />

      {/* primary suite */}
      <Rug m={m} at={[-8.4, -7.9]} size={[3.4, 3.0]} />
      <Bed m={m} at={[-8.4, -5.56]} rot={PI} w={1.95} />
      <Model name="modern_arm_chair_01" at={[-11.1, -10.9]} rot={PI * 0.25} />
      <Model name="potted_plant_02" at={[-4.6, -11.4]} rot={1} />
      <Wardrobe m={m} at={[-0.02, -6.75]} rot={-PI / 2} len={2.2} />
      <Wardrobe m={m} at={[-3.2, -7.98]} rot={0} len={1.4} />
      <Tub m={m} at={[-1.9, -11.15]} rot={0} />
      <Vanity m={m} at={[-3.98, -10.0]} rot={PI / 2} len={1.8} />

      {/* bedroom two: the corner room */}
      <Rug m={m} at={[-9.3, 9.0]} size={[2.8, 3.2]} rot={PI / 2} />
      <Bed m={m} at={[-7.06, 9.0]} rot={-PI / 2} w={1.8} />
      <Model name="potted_plant_02" at={[-11.4, 11.4]} />

      {/* bedroom three: desk under the south window */}
      <Bed m={m} at={[-2.56, 9.4]} rot={-PI / 2} w={1.6} />
      <group position={[-5.6, F, 11.45]}>
        <mesh position={[0, 0.74, 0]} geometry={boxGeo(1.5, 0.04, 0.65, 1)} material={m.oak} castShadow />
        {[-0.7, 0.7].map((x) => (
          <mesh key={x} position={[x, 0.36, 0]} material={m.darkBronze}>
            <boxGeometry args={[0.04, 0.72, 0.6]} />
          </mesh>
        ))}
      </group>
      <Model name="modern_arm_chair_01" at={[-5.6, 10.6]} rot={PI} />

      {/* family bath */}
      <Vanity m={m} at={[-0.02, 7.8]} rot={-PI / 2} len={1.4} basins={1} />
      <Shower m={m} glass={{ at: [-1.6, F + 1.1, 10.4], size: [1.8, 2.2, 0.02] }} head={[-1.25, F + 2.3, 11.3]} />

      {/* powder room */}
      <Vanity m={m} at={[-0.02, -4.0]} rot={-PI / 2} len={0.8} basins={1} />

      {/* balcony */}
      <Model name="outdoor_table_chair_set_01" at={[-13.3, -0.6]} rot={PI / 2} />
      <Model name="potted_plant_02" at={[-14.1, -4.9]} />
      <Model name="Ottoman_01" at={[-13.4, 2.2]} />
    </group>
  );
}

for (const u of modelUrls) useGLTF.preload(u);
