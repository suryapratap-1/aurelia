import { floorY, LEVEL } from '@/data/residence';

/** Eye height above the residence floor. */
const F = floorY(LEVEL);
const EYE = F + 1.6;
const ROOF = floorY(43);
const PODIUM = floorY(4);

export type Shot = {
  id: string;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  /** Hard cut from the previous shot (covered by the door-swing wipe). */
  cut?: boolean;
  /** 0 = late afternoon, 1 = dusk: drives city lights and interior lamps. */
  dusk: number;
};

export const shots: Shot[] = [
  // ——— hero
  { id: 'hero', pos: [-235, 12, 118], look: [-22, 80, -62], fov: 28, dusk: 0.1 },

  // ——— journey: arrival
  { id: 'approach', pos: [-190, 30, 95], look: [0, 72, 0], fov: 30, dusk: 0.2 },
  { id: 'facade', pos: [-46, 77.6, 14], look: [-12, 76.4, -2], fov: 32, dusk: 0.3 },
  { id: 'corridor', pos: [3.4, EYE, -0.5], look: [-4, EYE - 0.15, -0.5], fov: 42, dusk: 0.35, cut: true },
  { id: 'foyer', pos: [-1.1, EYE, -0.6], look: [-12, EYE - 0.5, -1.8], fov: 42, dusk: 0.38 },
  { id: 'living', pos: [-4.6, EYE, 0.2], look: [-10.5, EYE - 1.0, -4.6], fov: 42, dusk: 0.42 },
  { id: 'dining', pos: [-6.0, EYE, -2.4], look: [-10.2, EYE - 0.9, 3.6], fov: 42, dusk: 0.47 },
  { id: 'kitchen', pos: [-10.8, EYE, 2.6], look: [-3.0, EYE - 0.7, 3.4], fov: 42, dusk: 0.52 },
  { id: 'hall', pos: [-6.5, EYE, 4.4], look: [-6.5, EYE - 0.2, 9.0], fov: 42, dusk: 0.55 },
  { id: 'bedroom2', pos: [-8.2, EYE + 0.1, 5.6], look: [-11.4, EYE - 0.55, 10.6], fov: 48, dusk: 0.6 },
  { id: 'bedroom3', pos: [-5.1, EYE, 6.9], look: [-3.6, EYE - 0.8, 11.6], fov: 44, dusk: 0.64 },
  { id: 'bath2', pos: [-1.25, EYE, 6.0], look: [-1.25, EYE - 0.6, 11.6], fov: 46, dusk: 0.68 },
  { id: 'primary', pos: [-4.7, EYE, -7.3], look: [-10.6, EYE - 0.9, -9.8], fov: 46, dusk: 0.73, cut: true },
  { id: 'primaryBath', pos: [-1.0, EYE, -8.45], look: [-2.5, EYE - 0.75, -11.6], fov: 50, dusk: 0.78 },
  { id: 'balcony', pos: [-12.4, EYE + 0.1, 2.6], look: [-40, EYE - 7, -16], fov: 44, dusk: 0.86, cut: true },
  { id: 'outside', pos: [-120, 60, 70], look: [-8, 82, -6], fov: 30, dusk: 1 },

  // ——— amenities
  { id: 'pool', pos: [-3.5, ROOF + 2.0, 13.5], look: [-8.5, ROOF - 0.4, -6], fov: 40, dusk: 0.55, cut: true },
  { id: 'lounge', pos: [2.3, ROOF + 1.5, -3.0], look: [8.2, ROOF + 0.6, -8.6], fov: 46, dusk: 0.6, cut: true },
  { id: 'terrace', pos: [1.9, ROOF + 1.6, 2.9], look: [8.4, ROOF + 0.4, 8.6], fov: 46, dusk: 0.65, cut: true },
  { id: 'garden', pos: [-17.6, PODIUM + 2.2, 18.5], look: [-16, PODIUM + 0.4, -8], fov: 44, dusk: 0.5, cut: true },
  { id: 'gym', pos: [13.6, PODIUM + 1.7, -7.0], look: [17.5, PODIUM + 0.9, -17], fov: 46, dusk: 0.5, cut: true },
];

export const shotIndex = Object.fromEntries(shots.map((s, i) => [s.id, i])) as Record<string, number>;

export const railRanges = {
  hero: [shotIndex.hero, shotIndex.hero],
  journey: [shotIndex.approach, shotIndex.outside],
  amenities: [shotIndex.pool, shotIndex.gym],
} as const;
