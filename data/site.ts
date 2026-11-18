/**
 * Page content. Aurelia Residences, Ostra Quay and every figure here are fictional (concept project).
 */
import { BALCONY_AREA, INTERNAL_AREA, roomById } from './residence';

export const nav = [
  { id: 'residence', label: 'Residence' },
  { id: 'journey', label: 'Walk through' },
  { id: 'plan', label: 'Plan' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'location', label: 'Location' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'details', label: 'Details' },
] as const;

export type Stop = { shot: string; level: string; title: string; body: string };

const r = roomById;

/** Captions for the walk-through, in camera order (ids match features/world/shots.ts). */
export const journeyStops: Stop[] = [
  {
    shot: 'approach',
    level: 'Ostra Quay',
    title: 'From the far bank',
    body: 'Forty-two levels on a three-level podium. The tower faces due west across a 300 m reach of the river, so the living rooms look at water and sky, not at a neighbour.',
  },
  {
    shot: 'facade',
    level: 'Level 23, west face',
    title: 'Residence 23W',
    body: `The west half of level 23: ${INTERNAL_AREA} m² inside, glass on three sides, and a ${Math.round(BALCONY_AREA)} m² balcony you can see from here.`,
  },
  {
    shot: 'corridor',
    level: 'Level 23, lift lobby',
    title: 'The front door',
    body: 'Solid walnut, 2.7 m tall, on three bronze hinges. Keep scrolling and it opens.',
  },
  { shot: 'foyer', level: 'Foyer · 16 m²', title: r.foyer.name, body: r.foyer.note },
  { shot: 'living', level: 'Living · 48 m²', title: r.living.name, body: r.living.note },
  { shot: 'dining', level: 'Dining · 22.5 m²', title: r.dining.name, body: r.dining.note },
  { shot: 'kitchen', level: 'Kitchen · 17.5 m²', title: r.kitchen.name, body: r.kitchen.note },
  {
    shot: 'hall',
    level: 'Bedroom hall',
    title: 'Two bedrooms and a bath',
    body: 'A short hall off the kitchen leads to bedrooms two and three and the family bath, away from the living floor.',
  },
  { shot: 'bedroom2', level: 'Bedroom two · 35 m²', title: r.bedroom2.name, body: r.bedroom2.note },
  { shot: 'bedroom3', level: 'Bedroom three · 24.75 m²', title: r.bedroom3.name, body: r.bedroom3.note },
  { shot: 'bath2', level: 'Family bath · 17.5 m²', title: r.bath2.name, body: r.bath2.note },
  { shot: 'primary', level: 'Primary suite · 52 m²', title: r.primary.name, body: r.primary.note },
  { shot: 'primaryBath', level: 'Primary bath · 16 m²', title: r.primaryBath.name, body: r.primaryBath.note },
  { shot: 'balcony', level: 'Balcony · 22 m²', title: r.balcony.name, body: r.balcony.note },
  {
    shot: 'outside',
    level: 'Dusk',
    title: 'The lights come on',
    body: 'From the front door to the balcony rail is 14.6 m in a straight line. By the time you reach it, the city across the river has switched on.',
  },
];

export const amenities = [
  {
    shot: 'pool',
    level: 'Roof · Level 43',
    title: 'Pool',
    body: 'Twenty metres long, set against the west parapet so the water runs to the edge and the river carries on below it. Six loungers face the sunset.',
    facts: ['20 × 7.5 m', '1.35 m deep', 'Bronze overflow lip'],
  },
  {
    shot: 'lounge',
    level: 'Roof · Level 43',
    title: 'Residents’ lounge',
    body: 'A glass room on the north side of the roof with a sofa, two armchairs and a pantry. Book it for an evening, or use it when nobody has.',
    facts: ['10.2 × 9.2 m', 'Glass on four sides', 'Seats twelve'],
  },
  {
    shot: 'terrace',
    level: 'Roof · Level 43',
    title: 'Roof terrace',
    body: 'Two tables under a pergola of 22 bronze slats, which throws striped shade until about four in the afternoon.',
    facts: ['22 bronze slats', '2.9 m clear', 'Planted edges'],
  },
  {
    shot: 'garden',
    level: 'Podium · Level 4',
    title: 'Garden',
    body: 'Lawns wrap the west and south sides of the tower on the podium roof, with clipped hedges, planted beds and a 30 m water rill along the path.',
    facts: ['30 m rill', 'Two lawns', 'Benches every 4 m'],
  },
  {
    shot: 'gym',
    level: 'Podium · Level 4',
    title: 'Gym',
    body: 'A glazed pavilion in the north-east corner of the garden: three treadmills face the trees, and the back wall is mirror from floor to ceiling.',
    facts: ['6.8 × 13 m', 'Mirror wall', 'Free weights to 32 kg'],
  },
] as const;

export type Place = { id: string; name: string; kind: string; minutes: number; at: [number, number] };

/** The fictional district. Map coordinates are in the SVG's 1000 × 700 space. */
export const places: Place[] = [
  { id: 'park', name: 'Quay Park', kind: 'Park', minutes: 1, at: [430, 360] },
  { id: 'promenade', name: 'River promenade', kind: 'Walk', minutes: 2, at: [404, 280] },
  { id: 'market', name: 'Ostra Market Hall', kind: 'Food', minutes: 6, at: [640, 250] },
  { id: 'school', name: 'Quay Primary School', kind: 'School', minutes: 8, at: [700, 470] },
  { id: 'station', name: 'Ostra Quay station', kind: 'Rail', minutes: 7, at: [760, 330] },
  { id: 'bridge', name: 'Lantern Bridge', kind: 'Crossing', minutes: 9, at: [300, 150] },
  { id: 'clinic', name: 'Quayside Clinic', kind: 'Health', minutes: 5, at: [600, 420] },
  { id: 'gallery', name: 'Boathouse Gallery', kind: 'Culture', minutes: 5, at: [418, 520] },
];

export const specs = [
  {
    group: 'The residence',
    rows: [
      ['Residence', '23W, level 23 of 42'],
      ['Internal area', `${INTERNAL_AREA} m²`],
      ['Balcony', `${Math.round(BALCONY_AREA)} m², west`],
      ['Bedrooms', 'Three, each with a window'],
      ['Bathrooms', 'Two, plus a powder room'],
      ['Ceiling height', '3.0 m clear'],
      ['Aspect', 'West, north and south'],
    ],
  },
  {
    group: 'Schedule of finishes',
    rows: [
      ['FL-01 · Living floors', 'Oak herringbone, 70 × 420 mm blocks, oiled'],
      ['FL-02 · Wet rooms', 'Honed grey limestone, 600 × 600 mm'],
      ['WK-01 · Kitchen island', 'White marble, 2.6 m slab with waterfall ends'],
      ['JN-01 · Joinery', 'Smoked walnut veneer, push-to-open'],
      ['DR-01 · Entry door', 'Solid walnut, 2.7 m, three bronze hinges'],
      ['DR-02 · Internal doors', 'White oak, 2.4 m, full height to the lintel'],
      ['GL-01 · Facade', 'Floor-to-ceiling glass with bronze fins at 1.5 m'],
      ['IR-01 · Ironmongery', 'Patinated bronze throughout'],
    ],
  },
  {
    group: 'The building',
    rows: [
      ['Levels', '42 on a three-level podium'],
      ['Floor to floor', '3.4 m'],
      ['Roof, level 43', 'Pool, lounge, terrace'],
      ['Podium, level 4', 'Garden, gym'],
      ['Status', 'Fictional concept: no price, no planning, no sales'],
    ],
  },
] as const;

export type Render = { src: string; w: number; h: number; alt: string; caption: string };

/** Stills rendered from the live model (scripts/render-stills.mjs). */
export const renders: Render[] = [
  {
    src: '/renders/hero.webp',
    w: 2400,
    h: 1500,
    alt: 'The tower at sunset seen from across the river, with the city behind it.',
    caption: 'The tower from the far bank, late afternoon',
  },
  {
    src: '/renders/living.webp',
    w: 2400,
    h: 1500,
    alt: 'The living room: a sofa facing west glass, two lounge chairs and a rug on oak herringbone.',
    caption: 'Living room, facing the river',
  },
  {
    src: '/renders/kitchen.webp',
    w: 2400,
    h: 1500,
    alt: 'A white marble kitchen island with three stools and smoked walnut joinery behind.',
    caption: 'Kitchen island, 2.6 m of marble',
  },
  {
    src: '/renders/dining.webp',
    w: 2400,
    h: 1500,
    alt: 'An oak dining table for eight under two pendant lamps beside the west glass.',
    caption: 'Dining, seats eight',
  },
  {
    src: '/renders/primary.webp',
    w: 2400,
    h: 1500,
    alt: 'The primary bedroom with a low walnut bed and glass on two sides.',
    caption: 'Primary bedroom, the north-west corner',
  },
  {
    src: '/renders/primaryBath.webp',
    w: 2400,
    h: 1500,
    alt: 'A freestanding bath under a window in a limestone bathroom.',
    caption: 'Primary bath, the tub under the north window',
  },
  { src: '/renders/balcony.webp', w: 2400, h: 1500, alt: 'The balcony at dusk with a table and chairs and the river below.', caption: 'Balcony at dusk' },
  {
    src: '/renders/pool.webp',
    w: 2400,
    h: 1500,
    alt: 'The rooftop pool running to the west edge of the tower with loungers beside it.',
    caption: 'Roof pool, level 43',
  },
  {
    src: '/renders/facade.webp',
    w: 2400,
    h: 1500,
    alt: 'The west face of the tower at level 23, with the residence visible through the glass and the balcony in front.',
    caption: 'Level 23, west face',
  },
];
