/**
 * Residence 23W — the single source of truth for the plan.
 * The SVG floor plan, the 3D model and the specification table all read from here.
 * Units: metres. Plan axes: x runs west (−12) → east (0, the lift lobby wall); z runs north (−12) → south (+12).
 * All figures are fictional (concept project).
 */

export type Vec2 = [number, number];
export type Rect = [x0: number, x1: number, z0: number, z1: number];

export type RoomId =
  | 'foyer'
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'pantry'
  | 'primary'
  | 'dressing'
  | 'primaryBath'
  | 'powder'
  | 'coat'
  | 'hall'
  | 'bedroom2'
  | 'bedroom3'
  | 'bath2'
  | 'balcony';

export type Room = {
  id: RoomId;
  name: string;
  rect: Rect;
  /** Finishes, in the order a visitor notices them. */
  finishes: string[];
  note: string;
  /** Journey stop that shows this room, if any. */
  stop?: string;
  /** Hide from the room list (circulation and stores). */
  minor?: boolean;
};

export const LEVEL = 23;
export const LEVEL_HEIGHT = 3.4;
export const CEILING = 3.0;
export const floorY = (level: number) => (level - 1) * LEVEL_HEIGHT;

export const rooms: Room[] = [
  {
    id: 'foyer',
    name: 'Foyer',
    rect: [-4, 0, -2.5, 1.5],
    finishes: ['Oak herringbone', 'Walnut entry door, 2.7 m', 'Bronze hinges ×3'],
    note: 'The front door opens on to a straight line of sight to the river, 12 m away.',
    stop: 'foyer',
  },
  {
    id: 'living',
    name: 'Living room',
    rect: [-12, -4, -5.5, 0.5],
    finishes: ['Oak herringbone', 'Floor-to-ceiling glass, west', 'Recessed curtain track'],
    note: 'Eight metres of west glass. The sofa faces the river, not a screen.',
    stop: 'living',
  },
  {
    id: 'dining',
    name: 'Dining',
    rect: [-12, -7, 0.5, 5],
    finishes: ['Oak herringbone', 'Pendant point above the table', 'West glass'],
    note: 'Seats eight. In late October the sun reaches the table at about 16:50.',
    stop: 'dining',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    rect: [-7, -2, 1.5, 5],
    finishes: ['White marble island, 2.6 m', 'Smoked walnut joinery', 'Integrated appliances'],
    note: 'The island faces the dining table, so whoever cooks faces the room and the window.',
    stop: 'kitchen',
  },
  {
    id: 'pantry',
    name: 'Pantry & laundry',
    rect: [-2, 0, 1.5, 5],
    finishes: ['Limestone floor', 'Walnut shelving'],
    note: 'Behind the kitchen, with its own door.',
    minor: true,
  },
  {
    id: 'primary',
    name: 'Primary bedroom',
    rect: [-12, -4, -12, -5.5],
    finishes: ['Oak herringbone', 'Glass west and north', 'Blackout track'],
    note: 'A corner room. The bed faces north; the west glass is to your left as you wake.',
    stop: 'primary',
  },
  {
    id: 'dressing',
    name: 'Dressing room',
    rect: [-4, 0, -8, -5.5],
    finishes: ['Smoked walnut wardrobes', 'Oak herringbone'],
    note: 'Between the bedroom and the bath, so clothes never cross the bedroom.',
    minor: true,
  },
  {
    id: 'primaryBath',
    name: 'Primary bath',
    rect: [-4, 0, -12, -8],
    finishes: ['Honed grey limestone', 'Freestanding tub', 'Double marble vanity'],
    note: 'The tub sits under the north window, 75 m above the street.',
    stop: 'primaryBath',
  },
  {
    id: 'powder',
    name: 'Powder room',
    rect: [-1.8, 0, -5.5, -2.5],
    finishes: ['Honed limestone', 'Bronze tap'],
    note: 'Off the foyer, for guests.',
    minor: true,
  },
  {
    id: 'coat',
    name: 'Coats',
    rect: [-4, -1.8, -5.5, -2.5],
    finishes: ['Walnut doors'],
    note: 'Coats and shoes, out of sight of the living room.',
    minor: true,
  },
  {
    id: 'hall',
    name: 'Bedroom hall',
    rect: [-7, -2.5, 5, 6.5],
    finishes: ['Oak herringbone'],
    note: 'Opens off the dining end of the kitchen.',
    minor: true,
  },
  {
    id: 'bedroom2',
    name: 'Bedroom two',
    rect: [-12, -7, 5, 12],
    finishes: ['Oak herringbone', 'Glass west and south'],
    note: 'The second corner room: windows on two sides.',
    stop: 'bedroom2',
  },
  {
    id: 'bedroom3',
    name: 'Bedroom three',
    rect: [-7, -2.5, 6.5, 12],
    finishes: ['Oak herringbone', 'Glass south'],
    note: 'South light all day. Room for a desk under the window.',
    stop: 'bedroom3',
  },
  {
    id: 'bath2',
    name: 'Family bath',
    rect: [-2.5, 0, 5, 12],
    finishes: ['Honed grey limestone', 'Walk-in shower', 'South window'],
    note: 'Off the bedroom hall, shared by bedrooms two and three.',
    stop: 'bath2',
  },
  {
    id: 'balcony',
    name: 'Balcony',
    rect: [-14.6, -12, -5.5, 3],
    finishes: ['Oiled hardwood deck', 'Frameless glass balustrade, 1.1 m'],
    note: 'Opens from the living room through sliding glass. Faces due west.',
    stop: 'balcony',
  },
];

export const roomById = Object.fromEntries(rooms.map((r) => [r.id, r])) as Record<RoomId, Room>;

export const area = (r: Rect) => Math.abs((r[1] - r[0]) * (r[3] - r[2]));
export const dims = (r: Rect) => [Math.abs(r[1] - r[0]), Math.abs(r[3] - r[2])] as const;

/** Internal area = the 12 × 24 m plate. Balcony counted separately. */
export const INTERNAL_AREA = 12 * 24;
export const BALCONY_AREA = area(roomById.balcony.rect);

/** Interior partitions as axis-aligned segments [x1, z1, x2, z2] with door gaps already left out. */
export const walls: [number, number, number, number][] = [
  // living | primary bedroom (door x −6.5…−5.5)
  [-12, -5.5, -6.5, -5.5],
  [-5.5, -5.5, -4, -5.5],
  // primary | dressing + bath (door z −7.2…−6.3)
  [-4, -12, -4, -7.2],
  [-4, -6.3, -4, -5.5],
  // dressing | primary bath (door x −2.5…−1.6)
  [-4, -8, -2.5, -8],
  [-1.6, -8, 0, -8],
  // dressing | coats + powder
  [-4, -5.5, 0, -5.5],
  // coats | powder
  [-1.8, -5.5, -1.8, -2.5],
  // coats, powder | foyer (doors x −3.4…−2.6 and −1.3…−0.5)
  [-4, -2.5, -3.4, -2.5],
  [-2.6, -2.5, -1.3, -2.5],
  [-0.5, -2.5, 0, -2.5],
  // living | coats
  [-4, -5.5, -4, -2.5],
  // pantry (door z 2.8…3.6)
  [-2, 1.5, 0, 1.5],
  [-2, 1.5, -2, 2.8],
  [-2, 3.6, -2, 5],
  // kitchen | hall + family bath (hall opening x −7…−6)
  [-6, 5, 0, 5],
  // dining | bedroom two
  [-12, 5, -7, 5],
  // hall | bedroom two (door z 5.4…6.3)
  [-7, 5, -7, 5.4],
  [-7, 6.3, -7, 12],
  // hall | bedroom three (door x −5.5…−4.6)
  [-7, 6.5, -5.5, 6.5],
  [-4.6, 6.5, -2.5, 6.5],
  // hall | family bath (door z 5.3…6.2)
  [-2.5, 5, -2.5, 5.3],
  [-2.5, 6.2, -2.5, 12],
  // east wall to the lift lobby (front door z −1.05…0.05)
  [0, -12, 0, -1.05],
  [0, 0.05, 0, 12],
];

export type Door = {
  id: string;
  hinge: Vec2;
  /** Unit vector along the closed leaf. */
  closed: Vec2;
  /** Unit vector along the open leaf. */
  open: Vec2;
  width: number;
  label: string;
};

export const doors: Door[] = [
  { id: 'entry', hinge: [0, -1.05], closed: [0, 1], open: [-1, 0], width: 1.1, label: 'Front door' },
  { id: 'primary', hinge: [-6.5, -5.5], closed: [1, 0], open: [0, -1], width: 1.0, label: 'Primary bedroom door' },
  { id: 'dressing', hinge: [-4, -6.3], closed: [0, -1], open: [-1, 0], width: 0.9, label: 'Dressing room door' },
  { id: 'primaryBath', hinge: [-1.6, -8], closed: [-1, 0], open: [0, -1], width: 0.9, label: 'Primary bath door' },
  { id: 'coat', hinge: [-3.4, -2.5], closed: [1, 0], open: [0, 1], width: 0.8, label: 'Coat cupboard door' },
  { id: 'powder', hinge: [-0.5, -2.5], closed: [-1, 0], open: [0, -1], width: 0.8, label: 'Powder room door' },
  { id: 'pantry', hinge: [-2, 2.8], closed: [0, 1], open: [1, 0], width: 0.8, label: 'Pantry door' },
  { id: 'bedroom2', hinge: [-7, 6.3], closed: [0, -1], open: [-1, 0], width: 0.9, label: 'Bedroom two door' },
  { id: 'bedroom3', hinge: [-5.5, 6.5], closed: [1, 0], open: [0, 1], width: 0.9, label: 'Bedroom three door' },
  { id: 'bath2', hinge: [-2.5, 6.2], closed: [0, -1], open: [1, 0], width: 0.9, label: 'Family bath door' },
];

/** Exterior glass lines (west, north, south faces of the residence). */
export const glazing: [number, number, number, number][] = [
  [-12, -12, -12, 12],
  [-12, -12, 0, -12],
  [-12, 12, 0, 12],
];
