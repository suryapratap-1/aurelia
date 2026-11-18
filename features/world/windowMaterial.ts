import * as THREE from 'three';

export type WindowUniforms = { uLit: { value: number }; uGlow: { value: number } };

/**
 * A facade material that draws a grid of windows from world position, so boxes of any size
 * read as buildings. Lit windows are chosen by a hash per window; `uLit` raises the share at dusk.
 */
export function windowMaterial(opts: { color?: THREE.ColorRepresentation; floor?: number; bay?: number; uniforms: WindowUniforms; roughness?: number }) {
  const m = new THREE.MeshStandardMaterial({ color: opts.color ?? '#ffffff', roughness: opts.roughness ?? 0.85, metalness: 0 });
  const floorH = (opts.floor ?? 3.4).toFixed(3);
  const bay = (opts.bay ?? 2.6).toFixed(3);
  m.onBeforeCompile = (s) => {
    s.uniforms.uLit = opts.uniforms.uLit;
    s.uniforms.uGlow = opts.uniforms.uGlow;
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN; varying float vSeed;').replace(
      '#include <project_vertex>',
      `#include <project_vertex>
        vec4 wp4 = vec4(transformed, 1.0);
        vec3 nn = objectNormal;
        vec4 o4 = vec4(0.0, 0.0, 0.0, 1.0);
        #ifdef USE_INSTANCING
          wp4 = instanceMatrix * wp4; nn = mat3(instanceMatrix) * nn; o4 = instanceMatrix * o4;
        #endif
        vWP = (modelMatrix * wp4).xyz;
        vWN = normalize(mat3(modelMatrix) * nn);
        o4 = modelMatrix * o4;
        vSeed = fract(sin(dot(o4.xz, vec2(12.9898, 78.233))) * 43758.5453);`,
    );
    s.fragmentShader = s.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uLit; uniform float uGlow;
        varying vec3 vWP; varying vec3 vWN; varying float vSeed;
        float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float side = 1.0 - step(0.5, abs(vWN.y));
        vec2 tg = normalize(vec2(-vWN.z, vWN.x) + 1e-5);
        float u = dot(vWP.xz, tg) / ${bay};
        float v = vWP.y / ${floorH};
        vec2 cell = vec2(floor(u), floor(v));
        vec2 f = fract(vec2(u, v));
        float win = side * step(0.1, f.x) * step(f.x, 0.9) * step(0.2, f.y) * step(f.y, 0.9) * step(4.0, vWP.y);
        float r = h21(cell + vSeed * 91.7);
        float lit = win * step(r, uLit * (0.55 + 0.6 * vSeed));
        vec3 glassCol = mix(vec3(0.33, 0.37, 0.4), vec3(0.62, 0.66, 0.68), h21(cell * 1.7 + 2.3));
        diffuseColor.rgb = mix(diffuseColor.rgb, glassCol * (1.0 - 0.75 * uLit), win * 0.85);
        vec3 warm = mix(vec3(1.0, 0.72, 0.42), vec3(1.0, 0.86, 0.66), h21(cell.yx + 3.1));
        vec3 winGlow = warm * lit * (0.35 + 0.65 * h21(cell + 7.7)) * uGlow;`,
      )
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += winGlow;')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = mix(roughnessFactor, 0.12, win);');
  };
  m.customProgramCacheKey = () => `win-${floorH}-${bay}`;
  return m;
}
