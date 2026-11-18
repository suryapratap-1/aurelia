'use client';

import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';

const T = (name: string, map: string) => `/textures/${name}_${map}_1k.webp`;

const sets = {
  parquet: ['herringbone_parquet', ['diff', 'nor_gl', 'arm']],
  plaster: ['white_plaster_02', ['diff', 'nor_gl', 'rough']],
  marble: ['marble_01', ['diff', 'nor_gl', 'rough']],
  walnut: ['smoked_walnut_veneer', ['diff', 'nor_gl', 'arm']],
  oak: ['white_oak_veneer', ['diff', 'nor_gl', 'arm']],
  stone: ['grey_cartago_02', ['diff', 'nor_gl', 'arm']],
  deck: ['wood_floor_deck', ['diff', 'nor_gl', 'arm']],
  facade: ['concrete_tile_facade', ['diff', 'nor_gl', 'arm']],
} as const;

type SetName = keyof typeof sets;

const urls: Record<string, string> = {};
for (const [k, [name, maps]] of Object.entries(sets)) for (const m of maps) urls[`${k}_${m}`] = T(name, m);

export const textureUrls = Object.values(urls);

/** Every surface material of the development, built once and shared. */
export function useMaterials() {
  const tex = useTexture(urls) as Record<string, THREE.Texture>;
  const aniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  return useMemo(() => {
    for (const [k, t] of Object.entries(tex)) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = Math.min(8, aniso);
      t.colorSpace = k.endsWith('_diff') ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.needsUpdate = true;
    }
    const pbr = (s: SetName, o: THREE.MeshPhysicalMaterialParameters = {}) => {
      const has = (m: string) => tex[`${s}_${m}`] ?? null;
      return new THREE.MeshPhysicalMaterial({
        map: has('diff'),
        normalMap: has('nor_gl'),
        roughnessMap: has('arm') ?? has('rough'),
        aoMap: has('arm'),
        ...o,
      });
    };

    const m = {
      parquet: pbr('parquet', { roughness: 0.62, normalScale: new THREE.Vector2(0.6, 0.6), clearcoat: 0.25, clearcoatRoughness: 0.35 }),
      plaster: new THREE.MeshStandardMaterial({ color: '#efe8dd', roughness: 0.93, normalMap: tex.plaster_nor_gl, normalScale: new THREE.Vector2(0.12, 0.12) }),
      ceiling: new THREE.MeshStandardMaterial({ color: '#f1ece3', roughness: 0.96 }),
      marble: pbr('marble', { roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.12 }),
      walnut: pbr('walnut', { color: '#b7a596', roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
      oak: pbr('oak', { roughness: 0.6 }),
      stone: pbr('stone', { color: '#d9d3ca', roughness: 0.7, normalScale: new THREE.Vector2(0.5, 0.5) }),
      deck: pbr('deck', { roughness: 0.75 }),
      facade: pbr('facade', { color: '#efe8dc', roughness: 0.85 }),
      bronze: new THREE.MeshPhysicalMaterial({ color: '#8a6a45', metalness: 1, roughness: 0.32 }),
      darkBronze: new THREE.MeshPhysicalMaterial({ color: '#3a2f25', metalness: 1, roughness: 0.4 }),
      precast: new THREE.MeshStandardMaterial({ color: '#e9e2d6', roughness: 0.8 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#c4ccca',
        metalness: 0.15,
        roughness: 0.03,
        transparent: true,
        opacity: 0.3,
        envMapIntensity: 2.2,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      balustrade: new THREE.MeshPhysicalMaterial({
        color: '#dfe7e4',
        roughness: 0.05,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      mirror: new THREE.MeshPhysicalMaterial({ color: '#c9ccca', metalness: 1, roughness: 0.03 }),
      porcelain: new THREE.MeshPhysicalMaterial({ color: '#f6f3ee', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.06 }),
      linen: new THREE.MeshPhysicalMaterial({ color: '#ece6dc', roughness: 0.9, sheen: 1, sheenRoughness: 0.8, sheenColor: '#ffffff' }),
      wool: new THREE.MeshPhysicalMaterial({ color: '#b3a38c', roughness: 1, sheen: 1, sheenRoughness: 0.9, sheenColor: '#efe4d3' }),
      charcoalFabric: new THREE.MeshPhysicalMaterial({ color: '#45403a', roughness: 0.95, sheen: 0.6, sheenRoughness: 0.8 }),
      lamp: new THREE.MeshStandardMaterial({ color: '#fff3dc', emissive: '#ffd9a3', emissiveIntensity: 2.4 }),
      black: new THREE.MeshStandardMaterial({ color: '#141312', roughness: 0.5 }),
      rubber: new THREE.MeshStandardMaterial({ color: '#2a2826', roughness: 0.95 }),
      steel: new THREE.MeshPhysicalMaterial({ color: '#b8b6b2', metalness: 1, roughness: 0.28 }),
      leaf: new THREE.MeshStandardMaterial({ color: '#4c5a3a', roughness: 0.85 }),
      lawn: new THREE.MeshStandardMaterial({ color: '#5d6a43', roughness: 1 }),
      soil: new THREE.MeshStandardMaterial({ color: '#3d3329', roughness: 1 }),
    };
    return m;
  }, [tex, aniso]);
}

export type Materials = ReturnType<typeof useMaterials>;

/** Rescale a geometry's UVs so 1 UV unit = `size` metres (world-scaled texturing). */
export function worldUV<T extends THREE.BufferGeometry>(g: T, u: number, v: number, size: number): T {
  const uv = g.getAttribute('uv') as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * u) / size, (uv.getY(i) * v) / size);
  uv.needsUpdate = true;
  // aoMap reads the first UV set in three r15x+ only if 'uv1' is absent; mirror it explicitly.
  g.setAttribute('uv1', uv.clone());
  return g;
}

/** A box whose UVs are scaled per face to world metres (for walls, slabs, joinery). */
export function boxGeo(w: number, h: number, d: number, size = 1) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.getAttribute('uv') as THREE.BufferAttribute;
  // BoxGeometry face order: +x, −x, +y, −y, +z, −z; 4 verts each.
  const faces: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++)
    for (let i = 0; i < 4; i++) {
      const k = f * 4 + i;
      uv.setXY(k, (uv.getX(k) * faces[f][0]) / size, (uv.getY(k) * faces[f][1]) / size);
    }
  g.setAttribute('uv1', uv.clone());
  return g;
}
