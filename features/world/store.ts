/**
 * Mutable, frame-rate state shared by the DOM (scroll) and the 3D world.
 * Kept outside React so scroll never causes re-renders.
 */
export type Tier = 'high' | 'mid' | 'low';

type Listener = () => void;

export const rail = {
  /** Fractional index into `shots`, set by ScrollTrigger. */
  target: 0,
  /** Damped value the camera actually uses. */
  current: 0,
  /** Jump instead of easing on the next frame (after the canvas was hidden). */
  snap: true,
  /** Number of 3D sections currently on screen. */
  visible: 0,
  /** A door-swing cut is playing. */
  swinging: false,
  /** Pointer in −1…1 for a small parallax. */
  px: 0,
  py: 0,
  /** Camera position, for the mini plan. */
  cx: 0,
  cy: 0,
  cz: 0,
  /** Camera heading on the plan (radians). */
  heading: 0,
};

export const world = {
  tier: 'high' as Tier,
  ready: false,
  progress: 0,
  webgl: true,
  /** `?shot=<id>` pins the camera to one shot (review and still rendering). */
  debugShot: null as number | null,
};

const listeners = new Set<Listener>();
export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
export function emit() {
  for (const fn of listeners) fn();
}

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'high';
  const coarse = matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (saveData || cores <= 4 || mem <= 4) return 'low';
  if (coarse || innerWidth < 900) return 'mid';
  return 'high';
}

export function hasWebGL2() {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}
