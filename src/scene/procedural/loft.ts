import * as THREE from 'three';
import { stationAt, type CarShape } from './shapes';

const spow = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);

interface Ring {
  x: number;
  yc: number;
  hy: number;
  hzBottom: number;
  hzTop: number;
}

/** Lofts superellipse rings along X. theta 0 = +Z side, 90° = top. */
function loft(rings: Ring[], e: number, theta0: number, theta1: number, segs: number, grow = 0): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  const closed = Math.abs(theta1 - theta0 - Math.PI * 2) < 1e-6;
  const cols = segs + 1;
  for (const r of rings) {
    for (let j = 0; j <= segs; j++) {
      const th = theta0 + ((theta1 - theta0) * j) / segs;
      const s = spow(Math.sin(th), e);
      const c = spow(Math.cos(th), e);
      const hz = THREE.MathUtils.lerp(r.hzBottom, r.hzTop, (s + 1) / 2);
      pos.push(r.x, r.yc + (r.hy + grow) * s, (hz + grow) * c);
    }
  }
  for (let i = 0; i < rings.length - 1; i++) {
    for (let j = 0; j < segs; j++) {
      const a = i * cols + j;
      const b = (i + 1) * cols + j;
      idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  if (closed) {
    // Weld the seam so normals are smooth across it.
    const p = g.getAttribute('position');
    for (let i = 0; i < rings.length; i++) p.setXYZ(i * cols + segs, p.getX(i * cols), p.getY(i * cols), p.getZ(i * cols));
  }
  g.computeVertexNormals();
  if (closed) {
    const nrm = g.getAttribute('normal');
    for (let i = 0; i < rings.length; i++) {
      const a = i * cols;
      const b = a + segs;
      const x = nrm.getX(a) + nrm.getX(b);
      const y = nrm.getY(a) + nrm.getY(b);
      const z = nrm.getZ(a) + nrm.getZ(b);
      const l = Math.hypot(x, y, z) || 1;
      nrm.setXYZ(a, x / l, y / l, z / l);
      nrm.setXYZ(b, x / l, y / l, z / l);
    }
  }
  return g;
}

const ts = (t0: number, t1: number, n: number) => Array.from({ length: n + 1 }, (_, i) => t0 + ((t1 - t0) * i) / n);

function lowerRings(s: CarShape, t0: number, t1: number, n: number): Ring[] {
  const rings = ts(t0, t1, n).map((t) => {
    const st = stationAt(s, t);
    return { x: st.x, yc: (st.bottom + st.belt) / 2, hy: (st.belt - st.bottom) / 2, hzBottom: st.hw * 0.97, hzTop: st.hw };
  });
  return rings;
}

function capped(rings: Ring[]): Ring[] {
  const a = rings[0]!;
  const b = rings[rings.length - 1]!;
  const shrink = (r: Ring, dx: number): Ring => ({ x: r.x + dx, yc: r.yc, hy: r.hy * 0.15, hzBottom: r.hzBottom * 0.15, hzTop: r.hzTop * 0.15 });
  return [shrink(a, -0.03), ...rings, shrink(b, 0.03)];
}

/** Lower body shell: bottom to beltline. */
export function bodyGeometry(s: CarShape): THREE.BufferGeometry {
  return loft(capped(lowerRings(s, 0, 1, 96)), 0.42, -Math.PI / 2, Math.PI * 1.5, 56);
}

function greenhouseRings(s: CarShape, t0: number, t1: number, n: number): Ring[] {
  return ts(t0, t1, n).map((t) => {
    const st = stationAt(s, t);
    const lo = st.belt - 0.06;
    return {
      x: st.x,
      yc: (lo + st.roof) / 2,
      hy: Math.max(0.01, (st.roof - lo) / 2),
      hzBottom: st.hw * s.ghBelt,
      hzTop: st.hw * s.ghRoof,
    };
  });
}

/** t range where the roof rises above the belt. */
export function cabinRange(s: CarShape): [number, number] {
  let a = 1;
  let b = 0;
  for (const t of ts(0, 1, 200)) {
    const st = stationAt(s, t);
    if (st.roof - st.belt > 0.02) {
      a = Math.min(a, t);
      b = Math.max(b, t);
    }
  }
  return [a, b];
}

export function greenhouseGeometry(s: CarShape): THREE.BufferGeometry {
  const [a, b] = cabinRange(s);
  return loft(greenhouseRings(s, a, b, 48), 0.62, -Math.PI / 2, Math.PI * 1.5, 40);
}

/** Painted roof strip on top of the greenhouse. */
export function roofGeometry(s: CarShape, t0: number, t1: number): THREE.BufferGeometry {
  return loft(greenhouseRings(s, t0, t1, 16), 0.62, Math.PI * 0.2, Math.PI * 0.8, 16, 0.006);
}

/** Door skin: a side band of the lower body, slightly proud. side = 1 (right, +Z) or -1. */
export function doorGeometry(s: CarShape, t0: number, t1: number, side: 1 | -1): THREE.BufferGeometry {
  const a = side === 1 ? -0.32 * Math.PI : Math.PI * 0.72;
  const b = side === 1 ? 0.28 * Math.PI : Math.PI * 1.32;
  return loft(lowerRings(s, t0, t1, 18), 0.42, a, b, 14, 0.006);
}
