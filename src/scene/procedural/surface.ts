import * as THREE from 'three';
import { stationAt, type CarShape, type Mask } from './shapes';

const RAD = Math.PI / 180;
const spow = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);
const smooth = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};
/** Smooth window: 1 inside [x0, x1], falling to 0 at the edges. */
function bell(x: number, x0: number, x1: number, soft = 0.6): number {
  const s = (soft * (x1 - x0)) / 2;
  if (s <= 0) return x >= x0 && x <= x1 ? 1 : 0;
  return smooth(x0, x0 + s, x) * (1 - smooth(x1 - s, x1, x));
}
/** Angle folded onto the right-hand side, so one definition shapes both flanks. */
const fold = (deg: number) => (deg > 90 ? 180 - deg : deg);

/** Side columns up to this angle can be cut by a wheel arch; above it the fender covers the wheel. */
const ARCH_SIDE_DEG = 38;
const ARCH_GAP = 0.045;

export interface Arch {
  x: number;
  y: number;
  r: number;
}
export const arches = (s: CarShape): Arch[] => [
  { x: 0, y: s.wheelRF, r: s.wheelRF + ARCH_GAP },
  { x: s.wb, y: s.wheelRR, r: s.wheelRR + ARCH_GAP },
];
export const archInnerZ = (s: CarShape) => s.W / 2 - Math.max(s.tireWF, s.tireWR) - 0.09;

export interface SurfPoint {
  x: number;
  y: number;
  z: number;
  /** True when the raw point fell inside a wheel arch and was moved onto its rim. */
  inside: boolean;
}

/**
 * Body surface. t: 0 nose → 1 tail. deg: -90 bottom centre, 0 right flank, 90 top centre,
 * 180 left flank, 270 bottom centre again. `cap` < 1 shrinks the section to close an end.
 */
export function bodyPoint(s: CarShape, t: number, deg: number, cap = 1, dx = 0): SurfPoint {
  const st = stationAt(s, t);
  const yc = (st.bottom + st.belt) / 2;
  const hy = (st.belt - st.bottom) / 2;
  const sn = spow(Math.sin(deg * RAD), s.eBody);
  const cs = spow(Math.cos(deg * RAD), s.eBody);
  const hz = THREE.MathUtils.lerp(st.hw * s.sill, st.hw, (sn + 1) / 2);
  let x = st.x + dx;
  let y = yc + hy * sn * cap;
  let z = hz * cs * cap;
  if (cap < 1) return { x, y, z, inside: false };
  const a = fold(deg);
  if (sn > 0) y += s.crown * (1 - Math.min(1, Math.abs(cs)) ** 2);
  for (const d of s.dents) {
    const w = bell(t, d.t[0], d.t[1], d.soft) * bell(a, d.a[0], d.a[1], d.soft);
    if (w <= 0) continue;
    const ry = y - yc;
    const len = Math.hypot(ry, z) || 1;
    y -= (d.depth * w * ry) / len;
    z -= (d.depth * w * z) / len;
  }
  let inside = false;
  const az = Math.abs(z);
  for (const ar of arches(s)) {
    const u = x - ar.x;
    if (Math.abs(u) > ar.r * 1.9) continue;
    if (a > ARCH_SIDE_DEG) {
      // Fender: the top surface rises to clear the wheel, fading towards the car's centre line.
      const circ = Math.sqrt(Math.max(0, 1 - (u / ar.r) ** 2));
      const hump = (1 + Math.cos((Math.PI * u) / (ar.r * 1.9))) / 2;
      const target = ar.y + ar.r * Math.max(circ, hump * 0.96) + s.fenderLift;
      const wz = smooth(0.42, 0.74, az / st.hw);
      if (target > y) y += wz * (target - y);
    } else if (az > archInnerZ(s)) {
      const ry = y - ar.y;
      const len = Math.hypot(u, ry);
      if (len < ar.r) {
        inside = true;
        const k = len < 1e-4 ? 0 : ar.r / len;
        x = ar.x + (len < 1e-4 ? 0 : u * k);
        y = ar.y + (len < 1e-4 ? ar.r : ry * k);
      }
    }
  }
  return { x, y, z, inside };
}

function grid(
  n: number,
  m: number,
  at: (i: number, j: number) => SurfPoint,
  keep: (i: number, j: number) => boolean,
): THREE.BufferGeometry {
  const pos = new Float32Array((n + 1) * (m + 1) * 3);
  const inside = new Uint8Array((n + 1) * (m + 1));
  const cols = m + 1;
  for (let i = 0; i <= n; i++)
    for (let j = 0; j <= m; j++) {
      const p = at(i, j);
      const k = i * cols + j;
      pos[k * 3] = p.x;
      pos[k * 3 + 1] = p.y;
      pos[k * 3 + 2] = p.z;
      inside[k] = p.inside ? 1 : 0;
    }
  const idx: number[] = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      const a = i * cols + j;
      const b = a + cols;
      // A quad lying wholly inside a wheel arch is the opening itself.
      if (inside[a]! + inside[b]! + inside[a + 1]! + inside[b + 1]! === 4) continue;
      if (!keep(i, j)) continue;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const ALL = () => true;

/** Closed lower body shell with the wheel arches cut out of the mesh. */
export function bodyGeometry(s: CarShape, nT = 150, nA = 88): THREE.BufferGeometry {
  // Two shrinking rings at each end close the nose and the tail.
  const caps: [number, number][] = [
    [0.1, -0.035],
    [0.62, -0.022],
  ];
  const rings = nT + 1 + caps.length * 2;
  const g = grid(
    rings - 1,
    nA,
    (i, j) => {
      const deg = -90 + (360 * j) / nA;
      if (i < caps.length) return bodyPoint(s, 0, deg, caps[i]![0], caps[i]![1]);
      const k = i - caps.length;
      if (k > nT) {
        const c = caps[caps.length - 1 - (k - nT - 1)]!;
        return bodyPoint(s, 1, deg, c[0], -c[1]);
      }
      return bodyPoint(s, k / nT, deg);
    },
    ALL,
  );
  weldSeam(g, rings, nA + 1);
  return g;
}

/** Averages normals across the seam column so the closed loft shades smoothly. */
function weldSeam(g: THREE.BufferGeometry, rings: number, cols: number) {
  const nrm = g.getAttribute('normal');
  for (let i = 0; i < rings; i++) {
    const a = i * cols;
    const b = a + cols - 1;
    const x = nrm.getX(a) + nrm.getX(b);
    const y = nrm.getY(a) + nrm.getY(b);
    const z = nrm.getZ(a) + nrm.getZ(b);
    const l = Math.hypot(x, y, z) || 1;
    nrm.setXYZ(a, x / l, y / l, z / l);
    nrm.setXYZ(b, x / l, y / l, z / l);
  }
}

/** Pushes every vertex out along its normal. */
function inflate(g: THREE.BufferGeometry, by: number): THREE.BufferGeometry {
  const p = g.getAttribute('position');
  const n = g.getAttribute('normal');
  for (let i = 0; i < p.count; i++)
    p.setXYZ(i, p.getX(i) + n.getX(i) * by, p.getY(i) + n.getY(i) * by, p.getZ(i) + n.getZ(i) * by);
  return g;
}

export interface PatchSpec {
  t: [number, number];
  a: [number, number];
  mask?: Mask;
  lift?: number;
}

/**
 * A panel lying on the body surface, slightly proud of it: door skins, lamps, intakes, trim.
 * side 1 = as defined (right flank), -1 = mirrored to the left.
 */
export function patchGeometry(s: CarShape, spec: PatchSpec, side: 1 | -1 = 1): THREE.BufferGeometry {
  const [t0, t1] = spec.t;
  const [a0, a1] = spec.a;
  const mask = spec.mask;
  // Masked panels need a fine grid so their outline does not stair-step.
  const fine = mask ? 3.2 : 1;
  const n = Math.min(200, Math.max(6, Math.ceil((t1 - t0) * 280 * fine)));
  const m = Math.min(150, Math.max(6, Math.ceil(((a1 - a0) / 2) * fine)));
  const g = grid(
    n,
    m,
    (i, j) => {
      const v = side === 1 ? j / m : 1 - j / m;
      const deg = a0 + (a1 - a0) * v;
      return bodyPoint(s, t0 + ((t1 - t0) * i) / n, side === 1 ? deg : 180 - deg);
    },
    mask
      ? (i, j) => {
          const v = (j + 0.5) / m;
          return mask((i + 0.5) / n, side === 1 ? v : 1 - v);
        }
      : ALL,
  );
  return inflate(g, spec.lift ?? 0.005);
}

/** t range where the roof rises above the belt. */
export function cabinRange(s: CarShape): [number, number] {
  let a = 1;
  let b = 0;
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const st = stationAt(s, t);
    if (st.roof - st.belt > 0.02) {
      a = Math.min(a, t);
      b = Math.max(b, t);
    }
  }
  return [a, b];
}

export function cabinPoint(s: CarShape, t: number, deg: number): SurfPoint {
  const st = stationAt(s, t);
  const lo = st.belt - 0.07;
  const hy = Math.max(0.01, (st.roof - lo) / 2);
  const sn = spow(Math.sin(deg * RAD), s.gh.e);
  const cs = spow(Math.cos(deg * RAD), s.gh.e);
  const hz = THREE.MathUtils.lerp(st.hw * s.gh.belt, st.hw * s.gh.roof, (sn + 1) / 2);
  return { x: st.x, y: (lo + st.roof) / 2 + hy * sn, z: hz * cs, inside: false };
}

export const CABIN_ZONES = ['windscreen', 'side', 'rear', 'roof', 'pillar', 'deck'] as const;
export type CabinZone = (typeof CABIN_ZONES)[number];

/** Which panel of the greenhouse a point belongs to. */
export function cabinZone(s: CarShape, t: number, deg: number): CabinZone {
  const g = s.gh;
  const a = fold(deg);
  const side = a < g.cornerDeg - 4;
  const corner = !side && a < g.cornerDeg + 5;
  if (t < g.header) return corner ? 'pillar' : side ? 'side' : 'windscreen';
  if (t > g.rearHeader) {
    if (corner) return 'pillar';
    if (side) return t > g.sideEnd ? 'deck' : 'side';
    return 'rear';
  }
  if (corner) return 'pillar';
  if (side) return g.bPillars.some(([p0, p1]) => t >= p0 && t <= p1) ? 'pillar' : 'side';
  return 'roof';
}

/** The greenhouse as separate panels sharing one surface. */
export function cabinGeometries(s: CarShape, nT = 90, nA = 72): Record<CabinZone, THREE.BufferGeometry> {
  const [c0, c1] = cabinRange(s);
  const d0 = -28;
  const d1 = 208;
  const at = (i: number, j: number) => cabinPoint(s, c0 + ((c1 - c0) * i) / nT, d0 + ((d1 - d0) * j) / nA);
  const zoneOf = (i: number, j: number) =>
    cabinZone(s, c0 + ((c1 - c0) * (i + 0.5)) / nT, d0 + ((d1 - d0) * (j + 0.5)) / nA);
  const out = {} as Record<CabinZone, THREE.BufferGeometry>;
  for (const z of CABIN_ZONES) {
    out[z] = grid(nT, nA, at, (i, j) => zoneOf(i, j) === z);
    // Opaque panels sit a few millimetres proud so their edges read as trim around the glass.
    if (z === 'pillar' || z === 'roof' || z === 'deck') inflate(out[z], 0.004);
  }
  return out;
}

/** Open half-cylinder lining a wheel well, so the arch opening does not show the far side. */
export function linerGeometry(s: CarShape, ar: Arch, side: 1 | -1): THREE.BufferGeometry {
  const z0 = archInnerZ(s);
  const z1 = s.W / 2 - 0.03;
  const g = new THREE.CylinderGeometry(
    ar.r + 0.012,
    ar.r + 0.012,
    z1 - z0,
    28,
    1,
    true,
    Math.PI / 2,
    Math.PI,
  );
  g.rotateX(Math.PI / 2);
  g.translate(ar.x, ar.y, (side * (z0 + z1)) / 2);
  return g;
}

export function linerWallGeometry(s: CarShape, ar: Arch, side: 1 | -1): THREE.BufferGeometry {
  const g = new THREE.CircleGeometry(ar.r + 0.012, 28, 0, Math.PI);
  g.translate(ar.x, ar.y, side * archInnerZ(s));
  return g;
}
