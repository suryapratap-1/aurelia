'use client';

import { Environment } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Amenities } from './Amenities';
import { Apartment } from './Apartment';
import { City } from './City';
import { Furniture } from './Furniture';
import { useMaterials } from './materials';
import { Rig } from './Rig';
import { emit, rail, type Tier, world } from './store';
import { Tower } from './Tower';
import { createWorldUniforms, UniformsContext } from './uniforms';

/** The HDRI's sun sits at u≈0.60; this turns it to due west (−x), where the river is. */
const ENV_ROTATION = new THREE.Euler(0, 2.513, 0);
const SUN_DIR = new THREE.Vector3(-1, 0.2, 0.08).normalize();

function Sun({ tier }: { tier: Tier }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const l = light.current;
    if (!l) return;
    scene.add(l.target);
    return () => {
      scene.remove(l.target);
    };
  }, [scene]);
  useFrame(() => {
    const l = light.current;
    if (!l) return;
    // the shadow frustum follows the camera, snapped to whole metres to avoid shimmer
    const f = camera.position;
    l.target.position.set(Math.round(f.x), Math.round(f.y), Math.round(f.z));
    l.position.copy(l.target.position).addScaledVector(SUN_DIR, 70);
  });
  const size = 22;
  return (
    <directionalLight
      ref={light}
      color="#ffc48a"
      intensity={5.5}
      castShadow={tier !== 'low'}
      shadow-mapSize={tier === 'high' ? [2048, 2048] : [1024, 1024]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.02}
      shadow-camera-left={-size}
      shadow-camera-right={size}
      shadow-camera-top={size}
      shadow-camera-bottom={-size}
      shadow-camera-near={1}
      shadow-camera-far={160}
    />
  );
}

function Worldly({ tier }: { tier: Tier }) {
  const m = useMaterials();
  return (
    <>
      <Tower m={m} />
      <Apartment m={m} />
      <Suspense fallback={null}>
        <Furniture m={m} />
        <Amenities m={m} />
      </Suspense>
      <City tier={tier} />
    </>
  );
}

/** Render on demand: only while a 3D section is on screen and something is still moving. */
function Demand() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    let lastPx = 0;
    let lastPy = 0;
    let settle = 0;
    let readyAt = performance.now();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (rail.visible <= 0 || document.hidden) return;
      // keep drawing while assets arrive, and for a moment after
      if (!world.ready || performance.now() - readyAt < 2500) {
        if (!world.ready) readyAt = performance.now();
        invalidate();
        return;
      }
      const moving = Math.abs(rail.target - rail.current) > 1e-4 || rail.px !== lastPx || rail.py !== lastPy || rail.snap || rail.swinging;
      if (moving) settle = 20;
      lastPx = rail.px;
      lastPy = rail.py;
      if (settle > 0) {
        settle--;
        invalidate();
      }
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);
  return null;
}

/** Loading progress from three's default manager (outside React render, so no store updates mid-render). */
function Progress() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const mgr = THREE.DefaultLoadingManager;
    let timer = 0;
    const settle = () => {
      clearTimeout(timer);
      // "done" only after loading has been quiet for a moment (models arrive after textures)
      timer = window.setTimeout(() => {
        world.progress = 1;
        world.ready = true;
        emit();
        invalidate();
      }, 600);
    };
    mgr.onStart = () => clearTimeout(timer);
    mgr.onProgress = (_url, loaded, total) => {
      clearTimeout(timer);
      world.progress = Math.max(world.progress, Math.min(0.99, loaded / Math.max(total, 1)));
      emit();
      invalidate();
    };
    mgr.onLoad = settle;
    // everything may already be cached
    settle();
    return () => {
      clearTimeout(timer);
      mgr.onStart = mgr.onProgress = mgr.onLoad = undefined as never;
    };
  }, [invalidate]);
  return null;
}

function Effects({ tier }: { tier: Tier }) {
  if (tier === 'low')
    return (
      <EffectComposer multisampling={0}>
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <SMAA />
      </EffectComposer>
    );
  return (
    <EffectComposer multisampling={tier === 'high' ? 4 : 0} enableNormalPass={false}>
      <N8AO aoRadius={1.1} intensity={2.2} distanceFalloff={0.6} halfRes={tier !== 'high'} quality={tier === 'high' ? 'medium' : 'low'} />
      <Bloom mipmapBlur luminanceThreshold={1.1} intensity={0.25} radius={0.6} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.32} darkness={0.42} />
      <SMAA />
    </EffectComposer>
  );
}

export default function Scene({ tier }: { tier: Tier }) {
  const uniforms = useMemo(createWorldUniforms, []);
  const dpr: [number, number] = tier === 'high' ? [1, 2] : tier === 'mid' ? [1, 1.5] : [1, 1];
  return (
    <UniformsContext.Provider value={uniforms}>
      <Canvas
        frameloop="demand"
        dpr={dpr}
        shadows={tier !== 'low' ? 'percentage' : false}
        camera={{ fov: 30, near: 0.1, far: 4000, position: [-300, 18, 150] }}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.NoToneMapping; // tone mapping happens in the post chain
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.fog = new THREE.Fog('#d8bda2', 700, 3600);
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <UniformsContext.Provider value={uniforms}>
          <Suspense fallback={null}>
            <Environment
              files="/hdri/qwantani_sunset_puresky_1k.hdr"
              background
              backgroundRotation={ENV_ROTATION}
              environmentRotation={ENV_ROTATION}
              environmentIntensity={0.42}
            />
            <Worldly tier={tier} />
            <Effects tier={tier} />
          </Suspense>
          <Sun tier={tier} />
          <hemisphereLight args={['#fde6cf', '#4a4038', 0.12]} />
          <Rig />
          <Demand />
          <Progress />
        </UniformsContext.Provider>
      </Canvas>
    </UniformsContext.Provider>
  );
}
