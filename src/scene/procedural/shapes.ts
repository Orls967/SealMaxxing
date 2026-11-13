import type { CarId } from '@/content/ids';

/** Profile control point: t (0 nose → 1 tail), bottom, belt, roof heights (m), half-width factor (0..1). */
export type ProfilePoint = [t: number, bottom: number, belt: number, roof: number, hw: number];

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
  /** Greenhouse width relative to the body at the belt, and at the roof. */
  ghBelt: number;
  ghRoof: number;
  /** Door spans as t ranges. */
  doors: [number, number][];
  /** Paint roof strip t range, or null for an all-glass roof. */
  roof: [number, number] | null;
}

const inch = 0.0254;
/** Tyre outer radius from width (mm), aspect (%) and rim (in). */
const tyreR = (w: number, aspect: number, rim: number) => (rim * inch) / 2 + (w / 1000) * (aspect / 100);

export const SHAPES: Record<CarId, CarShape> = {
  seal: {
    L: 4.8, W: 1.875, H: 1.46, wb: 2.92, fo: 0.9,
    wheelRF: tyreR(235, 45, 19), wheelRR: tyreR(235, 45, 19),
    tireWF: 0.235, tireWR: 0.235, rimRF: 9.5 * inch, rimRR: 9.5 * inch,
    profile: [
      [0, 0.42, 0.52, 0.52, 0.55],
      [0.03, 0.24, 0.66, 0.66, 0.84],
      [0.1, 0.17, 0.78, 0.78, 0.97],
      [0.2, 0.16, 0.87, 0.87, 1],
      [0.3, 0.16, 0.95, 0.96, 1],
      [0.42, 0.16, 0.98, 1.36, 1],
      [0.53, 0.16, 0.98, 1.46, 1],
      [0.66, 0.16, 0.99, 1.42, 1],
      [0.8, 0.17, 1.01, 1.2, 0.99],
      [0.9, 0.2, 1.02, 1.04, 0.96],
      [0.97, 0.28, 0.98, 0.98, 0.86],
      [1, 0.44, 0.8, 0.8, 0.62],
    ],
    ghBelt: 0.86, ghRoof: 0.62,
    doors: [[0.31, 0.5], [0.505, 0.68]],
    roof: null,
  },
  laferrari: {
    L: 4.702, W: 1.992, H: 1.116, wb: 2.65, fo: 1.1,
    wheelRF: tyreR(265, 30, 19), wheelRR: tyreR(345, 30, 20),
    tireWF: 0.265, tireWR: 0.345, rimRF: 9.5 * inch, rimRR: 10 * inch,
    profile: [
      [0, 0.2, 0.3, 0.3, 0.42],
      [0.04, 0.11, 0.42, 0.42, 0.78],
      [0.14, 0.1, 0.56, 0.56, 0.97],
      [0.24, 0.1, 0.66, 0.66, 1],
      [0.32, 0.1, 0.7, 0.74, 0.95],
      [0.43, 0.1, 0.72, 1.09, 0.9],
      [0.5, 0.1, 0.74, 1.116, 0.9],
      [0.62, 0.1, 0.8, 1.02, 0.95],
      [0.74, 0.11, 0.86, 0.9, 1],
      [0.88, 0.14, 0.86, 0.86, 1],
      [0.97, 0.22, 0.8, 0.8, 0.93],
      [1, 0.36, 0.66, 0.66, 0.74],
    ],
    ghBelt: 0.74, ghRoof: 0.5,
    doors: [[0.35, 0.57]],
    roof: [0.43, 0.6],
  },
  p1: {
    L: 4.588, W: 1.946, H: 1.188, wb: 2.67, fo: 1.05,
    wheelRF: tyreR(245, 35, 19), wheelRR: tyreR(315, 30, 20),
    tireWF: 0.245, tireWR: 0.315, rimRF: 9.5 * inch, rimRR: 10 * inch,
    profile: [
      [0, 0.22, 0.32, 0.32, 0.45],
      [0.04, 0.12, 0.44, 0.44, 0.8],
      [0.14, 0.11, 0.58, 0.58, 0.98],
      [0.25, 0.11, 0.7, 0.7, 1],
      [0.32, 0.11, 0.74, 0.8, 0.94],
      [0.42, 0.11, 0.76, 1.15, 0.88],
      [0.5, 0.11, 0.78, 1.188, 0.88],
      [0.62, 0.11, 0.84, 1.1, 0.94],
      [0.75, 0.12, 0.9, 0.96, 1],
      [0.9, 0.16, 0.9, 0.9, 1],
      [0.97, 0.26, 0.84, 0.84, 0.92],
      [1, 0.4, 0.7, 0.7, 0.7],
    ],
    ghBelt: 0.72, ghRoof: 0.46,
    doors: [[0.34, 0.56]],
    roof: [0.44, 0.62],
  },
  senna: {
    L: 4.744, W: 1.958, H: 1.229, wb: 2.67, fo: 1.14,
    wheelRF: tyreR(245, 35, 19), wheelRR: tyreR(315, 30, 20),
    tireWF: 0.245, tireWR: 0.315, rimRF: 9.5 * inch, rimRR: 10 * inch,
    profile: [
      [0, 0.16, 0.26, 0.26, 0.6],
      [0.04, 0.1, 0.4, 0.4, 0.86],
      [0.14, 0.1, 0.58, 0.58, 0.99],
      [0.25, 0.1, 0.7, 0.7, 1],
      [0.32, 0.1, 0.74, 0.82, 0.93],
      [0.42, 0.1, 0.76, 1.19, 0.86],
      [0.5, 0.1, 0.78, 1.229, 0.86],
      [0.61, 0.1, 0.84, 1.14, 0.92],
      [0.73, 0.11, 0.88, 0.94, 1],
      [0.88, 0.15, 0.86, 0.86, 1],
      [0.96, 0.26, 0.78, 0.78, 0.94],
      [1, 0.38, 0.64, 0.64, 0.78],
    ],
    ghBelt: 0.72, ghRoof: 0.46,
    doors: [[0.34, 0.56]],
    roof: [0.44, 0.6],
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
    (2 * u3 - 3 * u2 + 1) * p1[col] + (u3 - 2 * u2 + u) * h * m1 + (-2 * u3 + 3 * u2) * p2[col] + (u3 - u2) * h * m2
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
