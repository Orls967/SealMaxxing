import type { CarId } from '@/content/ids';
import type { MatKey } from '../materials';

/** Profile control point: t (0 nose → 1 tail), bottom, belt, roof heights (m), half-width factor (0..1). */
export type ProfilePoint = [t: number, bottom: number, belt: number, roof: number, hw: number];

/** Keeps a patch cell at (u, v): u runs nose → tail, v from the flank up towards the centre line. */
export type Mask = (u: number, v: number) => boolean;

/** Local push of the body surface towards its axis (depth > 0) or away from it (depth < 0). */
export interface Dent {
  t: [number, number];
  /** Angle range in degrees on the right flank: -90 floor, 0 flank, 90 centre line of the top. */
  a: [number, number];
  depth: number;
  soft?: number;
}

/** `body` follows the livery; `accent` is red on the theme livery and carbon otherwise. */
export type PaintRef = MatKey | 'body' | 'accent';

export interface PatchDef {
  part: 'body-panels' | 'lights' | 'glass' | 'doors';
  k: PaintRef;
  t: [number, number];
  a: [number, number];
  mask?: Mask;
  lift?: number;
  /** Drawn once across the centre line instead of mirrored onto both flanks. */
  centre?: boolean;
}

export interface Greenhouse {
  /** Superellipse exponent of the cabin section. */
  e: number;
  /** Cabin width relative to the body at the belt, and at the roof. */
  belt: number;
  roof: number;
  /** Angle of the roof rail that separates side glass from the top. */
  cornerDeg: number;
  /** Windscreen ends and rear glass begins at these t. */
  header: number;
  rearHeader: number;
  /** Side glass ends here; behind it the flank is a solid pillar or buttress. */
  sideEnd: number;
  bPillars: [number, number][];
  mats: Record<'windscreen' | 'side' | 'rear' | 'roof' | 'pillar' | 'deck', PaintRef>;
}

export interface WheelStyle {
  spokes: number;
  /** Spokes drawn as pairs. */
  twin: boolean;
  k: MatKey;
  centreLock: boolean;
}

export interface CarShape {
  /** Overall size, metres. Mirrors content specs (lengthMm etc.). */
  L: number;
  W: number;
  H: number;
  wb: number;
  /** Front overhang: nose to front axle. */
  fo: number;
  wheelRF: number;
  wheelRR: number;
  tireWF: number;
  tireWR: number;
  rimRF: number;
  rimRR: number;
  profile: ProfilePoint[];
  /** Superellipse exponent of the lower body section: lower = boxier. */
  eBody: number;
  /** Floor width relative to the widest point. */
  sill: number;
  /** Extra height of the hood and deck centre line over the shoulders. */
  crown: number;
  /** Clearance between the wheel-arch rim and the fender top. */
  fenderLift: number;
  dents: Dent[];
  patches: PatchDef[];
  gh: Greenhouse;
  wheel: WheelStyle;
  /** Door spans as t ranges. */
  doors: [number, number][];
  /** Factory-style paint, taken from the reference colour of each car. */
  paint: MatKey;
}

const inch = 0.0254;
/** Tyre outer radius from width (mm), aspect (%) and rim (in). */
const tyreR = (w: number, aspect: number, rim: number) => (rim * inch) / 2 + (w / 1000) * (aspect / 100);

const ellipse: Mask = (u, v) => (u - 0.5) ** 2 + (v - 0.5) ** 2 < 0.25;
/** Blade that is full height at the nose end and tapers to a point at the tail end. */
const taperRear: Mask = (u, v) => Math.abs(v - 0.5) < 0.5 * (1 - 0.8 * u);
/** Wedge that opens towards the tail. */
const wedgeRear: Mask = (u, v) => Math.abs(v - 0.5) < 0.12 + 0.38 * u;
const stripes =
  (n: number): Mask =>
  (u, v) =>
    Math.floor(v * n * 2) % 2 === 0 && u > 0.15 && u < 0.9;
const dots =
  (n: number): Mask =>
  (u) =>
    Math.floor(u * n * 2) % 2 === 0;

const SILL: [number, number] = [-76, -50];
const DOOR_A: [number, number] = [-42, 34];

export const SHAPES: Record<CarId, CarShape> = {
  seal: {
    L: 4.8,
    W: 1.875,
    H: 1.46,
    wb: 2.92,
    fo: 0.9,
    wheelRF: tyreR(235, 45, 19),
    wheelRR: tyreR(235, 45, 19),
    tireWF: 0.235,
    tireWR: 0.235,
    rimRF: 9.5 * inch,
    rimRR: 9.5 * inch,
    profile: [
      [0, 0.3, 0.62, 0.62, 0.7],
      [0.03, 0.2, 0.7, 0.7, 0.88],
      [0.1, 0.17, 0.8, 0.8, 0.97],
      [0.2, 0.16, 0.88, 0.88, 1],
      [0.3, 0.16, 0.95, 0.96, 1],
      [0.42, 0.16, 0.98, 1.37, 1],
      [0.53, 0.16, 0.98, 1.46, 1],
      [0.66, 0.16, 0.99, 1.42, 1],
      [0.8, 0.17, 1.01, 1.22, 0.99],
      [0.9, 0.2, 1.03, 1.06, 0.96],
      [0.97, 0.26, 1.0, 1.0, 0.9],
      [1, 0.4, 0.86, 0.86, 0.72],
    ],
    eBody: 0.36,
    sill: 0.94,
    crown: 0.035,
    fenderLift: 0.03,
    dents: [
      // Shoulder crease running the length of the flank, and the scooped lower door.
      { t: [0.1, 0.94], a: [30, 42], depth: -0.014 },
      { t: [0.28, 0.76], a: [-34, -8], depth: 0.022 },
    ],
    patches: [
      { part: 'body-panels', k: 'trim', t: [0.03, 0.97], a: SILL },
      { part: 'body-panels', k: 'intake', t: [0, 0.035], a: [-80, -34] },
      { part: 'body-panels', k: 'intake', t: [0.965, 1], a: [-80, -40] },
      { part: 'body-panels', k: 'intake', t: [0.262, 0.3], a: [-4, 12], mask: wedgeRear },
      { part: 'body-panels', k: 'intake', t: [0.45, 0.482], a: [21, 24.5] },
      { part: 'body-panels', k: 'intake', t: [0.625, 0.657], a: [21, 24.5] },
      { part: 'lights', k: 'lens', t: [0.03, 0.135], a: [43, 60], mask: taperRear },
      { part: 'lights', k: 'light', t: [0.036, 0.12], a: [45, 49], mask: taperRear, lift: 0.008 },
      { part: 'lights', k: 'light', t: [0.008, 0.05], a: [-30, -6], mask: stripes(4), lift: 0.008 },
      { part: 'doors', k: 'body', t: [0.31, 0.5], a: DOOR_A },
      { part: 'doors', k: 'body', t: [0.505, 0.68], a: DOOR_A },
    ],
    gh: {
      e: 0.5,
      belt: 0.86,
      roof: 0.64,
      cornerDeg: 46,
      header: 0.43,
      rearHeader: 0.69,
      sideEnd: 0.8,
      bPillars: [[0.532, 0.55]],
      mats: {
        windscreen: 'glass',
        side: 'glass',
        rear: 'glass',
        roof: 'glassDark',
        pillar: 'body',
        deck: 'body',
      },
    },
    wheel: { spokes: 5, twin: true, k: 'metal', centreLock: false },
    doors: [
      [0.31, 0.5],
      [0.505, 0.68],
    ],
    paint: 'paintSeal',
  },
  laferrari: {
    L: 4.702,
    W: 1.992,
    H: 1.116,
    wb: 2.65,
    fo: 1.1,
    wheelRF: tyreR(265, 30, 19),
    wheelRR: tyreR(345, 30, 20),
    tireWF: 0.265,
    tireWR: 0.345,
    rimRF: 9.5 * inch,
    rimRR: 10 * inch,
    profile: [
      [0, 0.2, 0.34, 0.34, 0.5],
      [0.04, 0.11, 0.44, 0.44, 0.8],
      [0.14, 0.1, 0.56, 0.56, 0.97],
      [0.24, 0.1, 0.64, 0.64, 1],
      [0.32, 0.1, 0.69, 0.74, 0.96],
      [0.42, 0.1, 0.72, 1.08, 0.9],
      [0.5, 0.1, 0.75, 1.116, 0.9],
      [0.62, 0.1, 0.82, 1.03, 0.95],
      [0.74, 0.11, 0.88, 0.92, 1],
      [0.88, 0.14, 0.88, 0.88, 1],
      [0.97, 0.22, 0.82, 0.82, 0.94],
      [1, 0.36, 0.68, 0.68, 0.76],
    ],
    eBody: 0.45,
    sill: 0.9,
    crown: 0,
    fenderLift: 0.035,
    dents: [
      // Hood valley between the fenders, and the deep channel feeding the side radiators.
      { t: [0.02, 0.31], a: [68, 90], depth: 0.05 },
      { t: [0.38, 0.72], a: [-28, 30], depth: 0.1 },
    ],
    patches: [
      { part: 'body-panels', k: 'accent', t: [0.02, 0.98], a: SILL },
      { part: 'body-panels', k: 'intake', t: [0, 0.075], a: [-52, 22], mask: ellipse },
      {
        part: 'body-panels',
        k: 'intake',
        t: [0.1, 0.215],
        a: [74, 88.5],
        mask: (u, v) => v > 0.1 + 0.55 * u,
      },
      { part: 'body-panels', k: 'intake', t: [0.55, 0.7], a: [-20, 28], mask: wedgeRear },
      { part: 'body-panels', k: 'intake', t: [0.955, 1], a: [-70, 30] },
      { part: 'lights', k: 'lens', t: [0.05, 0.19], a: [46, 62], mask: ellipse },
      { part: 'lights', k: 'light', t: [0.075, 0.15], a: [51, 57], mask: ellipse, lift: 0.008 },
      { part: 'doors', k: 'body', t: [0.35, 0.57], a: DOOR_A },
    ],
    gh: {
      e: 0.5,
      belt: 0.74,
      roof: 0.5,
      cornerDeg: 46,
      header: 0.44,
      rearHeader: 0.58,
      sideEnd: 0.6,
      bPillars: [],
      mats: {
        windscreen: 'glass',
        side: 'glass',
        rear: 'glass',
        roof: 'paint',
        pillar: 'paint',
        deck: 'body',
      },
    },
    wheel: { spokes: 5, twin: true, k: 'metal', centreLock: false },
    doors: [[0.35, 0.57]],
    paint: 'paintRed',
  },
  p1: {
    L: 4.588,
    W: 1.946,
    H: 1.188,
    wb: 2.67,
    fo: 1.05,
    wheelRF: tyreR(245, 35, 19),
    wheelRR: tyreR(315, 30, 20),
    tireWF: 0.245,
    tireWR: 0.315,
    rimRF: 9.5 * inch,
    rimRR: 10 * inch,
    profile: [
      [0, 0.22, 0.34, 0.34, 0.5],
      [0.04, 0.12, 0.45, 0.45, 0.82],
      [0.14, 0.11, 0.58, 0.58, 0.98],
      [0.25, 0.11, 0.69, 0.69, 1],
      [0.32, 0.11, 0.74, 0.8, 0.95],
      [0.42, 0.11, 0.76, 1.15, 0.9],
      [0.5, 0.11, 0.78, 1.188, 0.9],
      [0.62, 0.11, 0.84, 1.1, 0.95],
      [0.75, 0.12, 0.9, 0.96, 1],
      [0.9, 0.16, 0.9, 0.9, 1],
      [0.97, 0.26, 0.84, 0.84, 0.92],
      [1, 0.4, 0.7, 0.7, 0.7],
    ],
    eBody: 0.47,
    sill: 0.9,
    crown: 0.01,
    fenderLift: 0.035,
    dents: [
      // The scallop that runs from the front wheel through the door into the side intake.
      { t: [0.3, 0.7], a: [-36, 26], depth: 0.12 },
      { t: [0.1, 0.24], a: [64, 84], depth: 0.02 },
    ],
    patches: [
      { part: 'body-panels', k: 'accent', t: [0.02, 0.98], a: SILL },
      { part: 'body-panels', k: 'intake', t: [0, 0.07], a: [-62, 6] },
      { part: 'body-panels', k: 'intake', t: [0.12, 0.2], a: [66, 82], mask: ellipse },
      { part: 'body-panels', k: 'intake', t: [0.36, 0.69], a: [-34, 4], mask: wedgeRear },
      { part: 'body-panels', k: 'intake', t: [0.94, 1], a: [-70, 62] },
      {
        part: 'lights',
        k: 'lens',
        t: [0.035, 0.16],
        a: [38, 62],
        // Crescent that hooks down at the nose end.
        mask: (u, v) => ellipse(u, v) && (v > 0.45 || u < 0.45),
      },
      { part: 'lights', k: 'light', t: [0.05, 0.14], a: [52, 57], mask: taperRear, lift: 0.008 },
      { part: 'doors', k: 'body', t: [0.34, 0.56], a: [4, 34] },
    ],
    gh: {
      e: 0.5,
      belt: 0.72,
      roof: 0.46,
      cornerDeg: 46,
      header: 0.43,
      rearHeader: 0.58,
      sideEnd: 0.6,
      bPillars: [],
      mats: {
        windscreen: 'glass',
        side: 'glass',
        rear: 'intake',
        roof: 'glassDark',
        pillar: 'paint',
        deck: 'body',
      },
    },
    wheel: { spokes: 10, twin: false, k: 'dark', centreLock: false },
    doors: [[0.34, 0.56]],
    paint: 'paintP1',
  },
  senna: {
    L: 4.744,
    W: 1.958,
    H: 1.229,
    wb: 2.67,
    fo: 1.14,
    wheelRF: tyreR(245, 35, 19),
    wheelRR: tyreR(315, 30, 20),
    tireWF: 0.245,
    tireWR: 0.315,
    rimRF: 9.5 * inch,
    rimRR: 10 * inch,
    profile: [
      [0, 0.16, 0.28, 0.28, 0.62],
      [0.04, 0.1, 0.4, 0.4, 0.86],
      [0.14, 0.1, 0.57, 0.57, 0.99],
      [0.25, 0.1, 0.69, 0.69, 1],
      [0.32, 0.1, 0.74, 0.82, 0.94],
      [0.42, 0.1, 0.76, 1.19, 0.88],
      [0.5, 0.1, 0.78, 1.229, 0.88],
      [0.61, 0.1, 0.84, 1.14, 0.93],
      [0.73, 0.11, 0.88, 0.94, 1],
      [0.88, 0.15, 0.86, 0.86, 1],
      [0.96, 0.26, 0.78, 0.78, 0.94],
      [1, 0.38, 0.64, 0.64, 0.78],
    ],
    eBody: 0.45,
    sill: 0.9,
    crown: 0,
    fenderLift: 0.035,
    dents: [
      { t: [0.03, 0.32], a: [68, 90], depth: 0.045 },
      { t: [0.46, 0.72], a: [-28, 30], depth: 0.09 },
    ],
    patches: [
      { part: 'body-panels', k: 'accent', t: [0.02, 0.98], a: SILL },
      { part: 'body-panels', k: 'intake', t: [0, 0.085], a: [-66, 34] },
      {
        part: 'body-panels',
        k: 'carbon',
        t: [0.085, 0.345],
        a: [62, 90],
        // Carbon centre section: a narrow spine at the nose widening into the windscreen.
        mask: (u, v) => v > 0.78 - 0.7 * u * u,
      },
      { part: 'body-panels', k: 'intake', t: [0.2, 0.275], a: [50, 60], mask: ellipse },
      { part: 'body-panels', k: 'intake', t: [0.56, 0.71], a: [-18, 30], mask: wedgeRear },
      { part: 'body-panels', k: 'carbon', t: [0.7, 0.96], a: [66, 90] },
      { part: 'body-panels', k: 'intake', t: [0.945, 1], a: [-70, 64] },
      { part: 'lights', k: 'light', t: [0.04, 0.105], a: [38, 43], mask: dots(5), lift: 0.008 },
      { part: 'glass', k: 'glass', t: [0.385, 0.53], a: [-22, 8], mask: ellipse, lift: 0.009 },
      { part: 'doors', k: 'body', t: [0.34, 0.56], a: DOOR_A },
    ],
    gh: {
      e: 0.5,
      belt: 0.72,
      roof: 0.46,
      cornerDeg: 46,
      header: 0.43,
      rearHeader: 0.58,
      sideEnd: 0.6,
      bPillars: [],
      mats: {
        windscreen: 'glass',
        side: 'glass',
        rear: 'intake',
        roof: 'carbon',
        pillar: 'carbon',
        deck: 'body',
      },
    },
    wheel: { spokes: 9, twin: false, k: 'dark', centreLock: true },
    doors: [[0.34, 0.56]],
    paint: 'paintSenna',
  },
};

export interface Station {
  x: number;
  bottom: number;
  belt: number;
  roof: number;
  hw: number;
}

/** Cubic Hermite through the profile points with finite-difference tangents. */
function interp(points: ProfilePoint[], t: number, col: 1 | 2 | 3 | 4): number {
  const n = points.length;
  let i = 0;
  while (i < n - 2 && t > points[i + 1]![0]) i++;
  const p0 = points[Math.max(0, i - 1)]!;
  const p1 = points[i]!;
  const p2 = points[i + 1]!;
  const p3 = points[Math.min(n - 1, i + 2)]!;
  const h = p2[0] - p1[0];
  const u = h === 0 ? 0 : Math.min(1, Math.max(0, (t - p1[0]) / h));
  const slope = (a: ProfilePoint, b: ProfilePoint) => (b[0] === a[0] ? 0 : (b[col] - a[col]) / (b[0] - a[0]));
  const m1 = i === 0 ? slope(p1, p2) : slope(p0, p2);
  const m2 = i + 2 > n - 1 ? slope(p1, p2) : slope(p1, p3);
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    (2 * u3 - 3 * u2 + 1) * p1[col] +
    (u3 - 2 * u2 + u) * h * m1 +
    (-2 * u3 + 3 * u2) * p2[col] +
    (u3 - u2) * h * m2
  );
}

export function stationAt(s: CarShape, t: number): Station {
  const bottom = interp(s.profile, t, 1);
  const belt = Math.max(bottom + 0.04, interp(s.profile, t, 2));
  return {
    x: t * s.L - s.fo,
    bottom,
    belt,
    roof: Math.max(belt, interp(s.profile, t, 3)),
    hw: Math.max(0.05, interp(s.profile, t, 4)) * (s.W / 2),
  };
}

/** t for a car-space x. */
export const tOf = (s: CarShape, x: number): number => (x + s.fo) / s.L;
