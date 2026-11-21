// Turns the raw downloaded car models (model/glb/<id>.glb, local only) into the compact,
// part-split files the app loads (public/models/<id>.glb).
//
//   node scripts/build-models.mjs [id ...]
//
// For every car it: flattens the scene to world space, turns it nose-first along -X at true
// length with the front axle at x = 0 and the tyres on y = 0, sorts every triangle into one of
// the app's parts, drops badges and plates, simplifies, and writes meshopt-compressed GLB whose
// nodes are named <systemId>__<partId>__<index>.
import { Document, NodeIO, PropertyType } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { dedup, meshopt, prune, simplify, weld } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { mkdir, stat } from 'node:fs/promises';
import { bake, bounds } from './lib/bake.mjs';

const inch = 0.0254;
const tyreR = (w, aspect, rim) => (rim * inch) / 2 + (w / 1000) * (aspect / 100);

/**
 * lengthM comes from the published length. `front` is the source axis the nose points along.
 * `paint` lists the source materials that are body colour; `drop` removes badges and plates.
 * `doors` are [x0, x1] spans in metres behind the front axle. `wing` marks the rear-wing zone.
 */
const CARS = {
  seal: {
    lengthM: 4.8,
    front: '+z',
    wheelR: [tyreR(235, 45, 19), tyreR(235, 45, 19)],
    rimR: [9.5 * inch, 9.5 * inch],
    tireW: [0.235, 0.235],
    paint: [/^vc_/],
    // Vertex-coloured model: the paint is the colour nearest to this (sRGB 0–255).
    paintColor: [70, 85, 135],
    // Dark faces of the greenhouse above this height are glass (the model has no glass material).
    darkGlassY: 1.0,
    drop: [],
    doors: [
      [0.62, 1.56],
      [1.58, 2.5],
    ],
    doorY: [0.3, 1.0],
    cabin: [0.75, 3.3],
    wing: null,
    target: 65000,
  },
  laferrari: {
    lengthM: 4.702,
    front: '+x',
    wheelR: [tyreR(265, 30, 19), tyreR(345, 30, 20)],
    rimR: [9.5 * inch, 10 * inch],
    tireW: [0.265, 0.345],
    // The downloaded LaFerrari is painted black; its red material is the brake calipers.
    paint: [/^Standard_5$/],
    // Factory colour scheme keeps the roof black.
    roofY: 1.0,
    drop: [/badge/i, /^wireframe_color_0xE0C6571$/, /^wireframe_color_0x8606062$/],
    doors: [[0.62, 1.7]],
    doorY: [0.22, 0.82],
    cabin: [0.4, 2.1],
    wing: { back: 0.4, y: 0.84 },
    target: 65000,
  },
  p1: {
    lengthM: 4.588,
    front: '-z',
    wheelR: [tyreR(245, 35, 19), tyreR(315, 30, 20)],
    rimR: [9.5 * inch, 10 * inch],
    tireW: [0.245, 0.315],
    paint: [/^material_13$/],
    // The maker's emblem on the nose (x is measured back from the nose).
    dropBoxes: [{ x: [0, 0.45], y: [0.4, 0.85], z: [-0.08, 0.08], mat: /^(metal|DISK)$/ }],
    drop: [/^yellow$/],
    doors: [[0.6, 1.62]],
    doorY: [0.24, 0.86],
    cabin: [0.4, 2.1],
    wing: { back: 0.4, y: 0.7 },
    target: 65000,
  },
  senna: {
    lengthM: 4.744,
    front: '+z',
    wheelR: [tyreR(245, 35, 19), tyreR(315, 30, 20)],
    rimR: [9.5 * inch, 10 * inch],
    tireW: [0.245, 0.315],
    paint: [/^body$/, /^orng$/, /^material$/],
    // shine.001 is the maker's badge on the nose and tail.
    drop: [/^plate$/, /^shine\.001$/],
    // The badges' clear covers stay behind once the badges are gone.
    dropBoxes: [
      { x: [0, 0.5], y: [0.3, 0.95], z: [-0.1, 0.1], mat: /^luscent$/ },
      { x: [4.2, 4.8], y: [0.3, 1.0], z: [-0.12, 0.12], mat: /^luscent$/ },
    ],
    doors: [[0.6, 1.6]],
    doorY: [0.24, 0.86],
    cabin: [0.4, 2.1],
    wing: { back: 0.75, y: 0.97 },
    target: 65000,
  },
};

const SYSTEM = {
  'body-panels': 'body',
  doors: 'body',
  glass: 'body',
  lights: 'body',
  wheels: 'wheels',
  tires: 'wheels',
  'rear-wing': 'aero',
  'front-aero': 'aero',
};

/** Splits a group that only has vertex colours into one group per colour. */
function splitByVertexColour(groups) {
  const out = [];
  for (const g of groups) {
    if (!g.vcol) {
      out.push(g);
      continue;
    }
    const by = new Map();
    for (let t = 0; t < g.pos.length / 9; t++) {
      const c = [g.vcol[t * 9], g.vcol[t * 9 + 1], g.vcol[t * 9 + 2]];
      const key = c.map((v) => (v >> 3).toString(16).padStart(2, '0')).join('');
      let b = by.get(key);
      if (!b) by.set(key, (b = { srgb: c, color: [...c.map((v) => (v / 255) ** 2.2), 1], pos: [] }));
      for (let k = 0; k < 9; k++) b.pos.push(g.pos[t * 9 + k]);
    }
    for (const [key, b] of by)
      out.push({
        name: `vc_${key}`,
        srgb: b.srgb,
        color: b.color,
        doubleSided: true,
        blend: false,
        emissive: false,
        pos: new Float32Array(b.pos),
        nrm: null,
      });
  }
  return out;
}

/**
 * Finds one wheel from the underside profile of the car's outer band: the lowest point of every
 * 1 cm slice along the car. Under a tyre that profile is the bottom of a circle; splitters and
 * sills are flat, so the circle of the tyre's radius that fits best marks the axle.
 */
function fitWheel(groups, b1, midX, midZ, halfW, half, rData) {
  const BIN = 0.01;
  const x0 = half === 0 ? b1.min[0] : midX;
  const nb = Math.ceil((half === 0 ? midX - b1.min[0] : b1.max[0] - midX) / BIN) + 1;
  const prof = new Float64Array(nb).fill(Infinity);
  for (const g of groups)
    for (let i = 0; i < g.pos.length; i += 3) {
      const x = g.pos[i];
      if ((x < midX ? 0 : 1) !== half) continue;
      if (Math.abs(g.pos[i + 2] - midZ) < halfW * 0.6) continue;
      const k = Math.floor((x - x0) / BIN);
      if (k >= 0 && k < nb && g.pos[i + 1] < prof[k]) prof[k] = g.pos[i + 1];
    }
  // A model shipped without tyres leaves an empty arch: a long run of slices with nothing low.
  // The arch then gives the axle, and the wheel centre sits one radius plus a small gap below it.
  const floor = Math.min(...prof.filter(Number.isFinite));
  // A 3-slice median hides single stray parts (an exhaust tip, a brake line) inside the arch.
  const med = prof.map((_, k) => {
    const w = [prof[k - 1] ?? prof[k], prof[k], prof[k + 1] ?? prof[k]].sort((p, q) => p - q);
    return w[1];
  });
  let run = [0, -1];
  for (let a = 0; a < nb; a++) {
    let e = a;
    while (e < nb && med[e] > floor + 0.3) e++;
    if (e - a > run[1] - run[0] + 1) run = [a, e - 1];
    a = e;
  }
  if ((run[1] - run[0] + 1) * BIN > 1.4 * rData) {
    const mid = Math.round((run[0] + run[1]) / 2);
    const top = med[mid];
    return { cost: 0, x: x0 + (mid + 0.5) * BIN, y: top - rData - 0.04, r: rData, noTyre: true };
  }
  let best = { cost: Infinity, x: 0, y: 0, r: rData, noTyre: false };
  for (let r = rData * 0.9; r <= rData * 1.1; r += 0.005) {
    const span = Math.round((0.7 * r) / BIN);
    for (let c = span; c < nb - span; c++) {
      if (!Number.isFinite(prof[c])) continue;
      const y0 = prof[c];
      let cost = 0;
      let used = 0;
      for (let d = -span; d <= span; d++) {
        const v = prof[c + d];
        if (!Number.isFinite(v)) {
          cost += 0.01;
          continue;
        }
        const dx = d * BIN;
        const e = v - (y0 + r - Math.sqrt(r * r - dx * dx));
        cost += e * e;
        used++;
      }
      cost /= Math.max(1, used);
      if (cost < best.cost) best = { cost, x: x0 + (c + 0.5) * BIN, y: y0 + r, r, noTyre: false };
    }
  }
  return best;
}

/** Rotates, scales and shifts everything into car space; returns the measured geometry. */
function normalise(groups, cfg) {
  const b0 = bounds(groups);
  const along = cfg.front.endsWith('z') ? 2 : 0;
  const s = cfg.lengthM / b0.size[along];
  // Source axes → car axes (nose towards -X, Y up), always a pure rotation about Y.
  const M = { '+z': [0, -1, 1, 0], '-z': [0, 1, -1, 0], '+x': [-1, 0, 0, -1], '-x': [1, 0, 0, 1] }[cfg.front];
  for (const g of groups)
    for (const arr of [g.pos, g.nrm]) {
      if (!arr) continue;
      const k = arr === g.pos ? s : 1;
      for (let i = 0; i < arr.length; i += 3) {
        const x = arr[i];
        const z = arr[i + 2];
        arr[i] = (M[0] * x + M[1] * z) * k;
        arr[i + 1] *= k;
        arr[i + 2] = (M[2] * x + M[3] * z) * k;
      }
    }
  const b1 = bounds(groups);
  const midX = (b1.min[0] + b1.max[0]) / 2;
  const midZ = (b1.min[2] + b1.max[2]) / 2;
  const halfW = b1.size[2] / 2;
  const fit = [0, 1].map((h) => fitWheel(groups, b1, midX, midZ, halfW, h, cfg.wheelR[h]));
  const xf = fit[0].x;
  const xr = fit[1].x;
  const ground = (fit[0].y - fit[0].r + fit[1].y - fit[1].r) / 2;
  let zT = 0;
  for (const g of groups)
    for (let i = 0; i < g.pos.length; i += 3) {
      const h = g.pos[i] < midX ? 0 : 1;
      const d = Math.hypot(g.pos[i] - fit[h].x, g.pos[i + 1] - fit[h].y);
      if (Math.abs(d - fit[h].r) < 0.015) zT = Math.max(zT, Math.abs(g.pos[i + 2] - midZ));
    }
  for (const g of groups)
    for (let i = 0; i < g.pos.length; i += 3) {
      g.pos[i] -= xf;
      g.pos[i + 1] -= ground;
      g.pos[i + 2] -= midZ;
    }
  const b = bounds(groups);
  return {
    wheelbase: xr - xf,
    tyreZ: zT,
    frontOverhang: -b.min[0],
    tailX: b.max[0],
    size: b.size,
    bounds: b,
    tyreR: fit.map((f) => f.r),
    noTyre: fit.some((f) => f.noTyre),
  };
}

const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

/** Decides which app part a triangle belongs to; null drops it. */
function classify(g, cx, cy, cz, cfg, geo, isPaint) {
  if (cfg.drop.some((r) => r.test(g.name))) return null;
  const fromNose = cx + geo.frontOverhang;
  for (const b of cfg.dropBoxes ?? [])
    if (
      b.mat.test(g.name) &&
      fromNose >= b.x[0] &&
      fromNose <= b.x[1] &&
      cy >= b.y[0] &&
      cy <= b.y[1] &&
      cz >= b.z[0] &&
      cz <= b.z[1]
    )
      return null;
  const az = Math.abs(cz);
  // Paint never belongs to a wheel: near the arches it is the fender lip.
  for (let a = 0; a < (geo.noTyre || isPaint ? 0 : 2); a++) {
    const xa = a === 0 ? 0 : geo.wheelbase;
    const R = geo.tyreR[a];
    const d = Math.hypot(cx - xa, cy - R);
    if (az > geo.tyreZ - cfg.tireW[a] - 0.05 && d < R + 0.03) {
      if (d > cfg.rimR[a] * 0.97) return 'tires';
      // Brake hardware behind the spokes is drawn by the app's own schematic parts.
      if (d < cfg.rimR[a] * 0.8 && az < geo.tyreZ - 0.075) return null;
      return 'wheels';
    }
  }
  const inCabin = cx > cfg.cabin[0] && cx < cfg.cabin[1];
  if (g.blend) return inCabin && cy > 0.45 ? 'glass' : 'lights';
  if (cfg.darkGlassY && inCabin && cy > cfg.darkGlassY && lum(g.color) < 0.004) return 'glass';
  if (g.emissive || /light|emit|lamp/i.test(g.name)) return inCabin && az < 0.5 ? 'body-panels' : 'lights';
  if (cfg.wing && cx > geo.tailX - cfg.wing.back && cy > cfg.wing.y) return 'rear-wing';
  if (cy < 0.17 && cx < -geo.frontOverhang + 0.3 && !isPaint) return 'front-aero';
  if (isPaint && az > geo.tyreZ * 0.62 && cy > cfg.doorY[0] && cy < cfg.doorY[1])
    for (const [x0, x1] of cfg.doors) if (cx > x0 && cx < x1) return 'doors';
  return 'body-panels';
}

/**
 * Makes triangle winding consistent across each connected surface, then turns each surface so
 * it faces outwards (positive signed volume). Needed for models that ship without normals.
 */
function orient(pos) {
  const n = pos.length / 9;
  const ids = new Map();
  const vid = new Int32Array(n * 3);
  for (let v = 0; v < n * 3; v++) {
    const k = `${Math.round(pos[v * 3] * 1e5)},${Math.round(pos[v * 3 + 1] * 1e5)},${Math.round(pos[v * 3 + 2] * 1e5)}`;
    let id = ids.get(k);
    if (id === undefined) ids.set(k, (id = ids.size));
    vid[v] = id;
  }
  const N = ids.size + 1;
  const edges = new Map();
  for (let t = 0; t < n; t++)
    for (let e = 0; e < 3; e++) {
      const a = vid[t * 3 + e];
      const b = vid[t * 3 + ((e + 1) % 3)];
      const k = Math.min(a, b) * N + Math.max(a, b);
      const l = edges.get(k);
      if (l) l.push(t);
      else edges.set(k, [t]);
    }
  const dir = (t, a, b) => {
    for (let e = 0; e < 3; e++) if (vid[t * 3 + e] === a && vid[t * 3 + ((e + 1) % 3)] === b) return 1;
    return -1;
  };
  const flip = new Int8Array(n);
  const comp = new Int32Array(n).fill(-1);
  let comps = 0;
  for (let s0 = 0; s0 < n; s0++) {
    if (comp[s0] >= 0) continue;
    const c = comps++;
    comp[s0] = c;
    const queue = [s0];
    while (queue.length) {
      const t = queue.pop();
      for (let e = 0; e < 3; e++) {
        const a = vid[t * 3 + e];
        const b = vid[t * 3 + ((e + 1) % 3)];
        // Edge a→b as currently drawn on t (after any flip of t).
        const [ea, eb] = flip[t] ? [b, a] : [a, b];
        const list = edges.get(Math.min(a, b) * N + Math.max(a, b));
        if (!list || list.length !== 2) continue;
        for (const o of list) {
          if (o === t || comp[o] >= 0) continue;
          comp[o] = c;
          // A consistent neighbour walks the shared edge the other way.
          flip[o] = dir(o, ea, eb) === 1 ? 1 : 0;
          queue.push(o);
        }
      }
    }
  }
  const vol = new Float64Array(comps);
  const cen = new Float64Array(comps * 4);
  for (let t = 0; t < n; t++)
    for (let v = 0; v < 3; v++) {
      const c = comp[t];
      for (let a = 0; a < 3; a++) cen[c * 4 + a] += pos[t * 9 + v * 3 + a];
      cen[c * 4 + 3]++;
    }
  for (let t = 0; t < n; t++) {
    const c = comp[t];
    const o = [0, 1, 2].map((a) => cen[c * 4 + a] / cen[c * 4 + 3]);
    const p = (v) => [0, 1, 2].map((a) => pos[t * 9 + v * 3 + a] - o[a]);
    const [A, B, C] = flip[t] ? [p(0), p(2), p(1)] : [p(0), p(1), p(2)];
    vol[c] +=
      A[0] * (B[1] * C[2] - B[2] * C[1]) -
      A[1] * (B[0] * C[2] - B[2] * C[0]) +
      A[2] * (B[0] * C[1] - B[1] * C[0]);
  }
  for (let t = 0; t < n; t++) {
    if ((flip[t] === 1) === vol[comp[t]] >= 0) continue;
    // Swap the 2nd and 3rd vertex.
    for (let a = 0; a < 3; a++) {
      const i1 = t * 9 + 3 + a;
      const i2 = t * 9 + 6 + a;
      const tmp = pos[i1];
      pos[i1] = pos[i2];
      pos[i2] = tmp;
    }
  }
}

/** Smooth normals for geometry that came without any, keeping edges sharper than 40° crisp. */
function creasedNormals(pos) {
  const n = pos.length / 9;
  const face = new Float32Array(n * 3);
  const key = (i) =>
    `${Math.round(pos[i] * 2000)},${Math.round(pos[i + 1] * 2000)},${Math.round(pos[i + 2] * 2000)}`;
  const at = new Map();
  for (let t = 0; t < n; t++) {
    const p = t * 9;
    const ux = pos[p + 3] - pos[p];
    const uy = pos[p + 4] - pos[p + 1];
    const uz = pos[p + 5] - pos[p + 2];
    const vx = pos[p + 6] - pos[p];
    const vy = pos[p + 7] - pos[p + 1];
    const vz = pos[p + 8] - pos[p + 2];
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1;
    face.set([nx / l, ny / l, nz / l], t * 3);
    for (let c = 0; c < 3; c++) {
      const k = key(p + c * 3);
      const list = at.get(k);
      if (list) list.push(t);
      else at.set(k, [t]);
    }
  }
  const out = new Float32Array(pos.length);
  const cos = Math.cos((40 * Math.PI) / 180);
  for (let t = 0; t < n; t++)
    for (let c = 0; c < 3; c++) {
      const i = t * 9 + c * 3;
      let x = 0;
      let y = 0;
      let z = 0;
      for (const o of at.get(key(i))) {
        const d =
          face[t * 3] * face[o * 3] + face[t * 3 + 1] * face[o * 3 + 1] + face[t * 3 + 2] * face[o * 3 + 2];
        if (d < cos) continue;
        x += face[o * 3];
        y += face[o * 3 + 1];
        z += face[o * 3 + 2];
      }
      // Rounded so corners that share a smooth surface get identical normals and can be welded
      // into one vertex, which is what lets the simplifier reduce the mesh at all.
      const l = Math.hypot(x, y, z) || 1;
      const q = (v) => Math.round((v / l) * 12) / 12;
      const nx = q(x);
      const ny = q(y);
      const nz = q(z);
      const m = Math.hypot(nx, ny, nz) || 1;
      out.set([nx / m, ny / m, nz / m], i);
    }
  return out;
}

async function build(id) {
  const cfg = CARS[id];
  const src = `model/glb/${id}.glb`;
  const baked = await bake(src);
  for (const g of baked.groups) if (!g.nrm) orient(g.pos);
  const groups = splitByVertexColour(baked.groups);
  const geo = normalise(groups, cfg);
  const near = (g) => (g.srgb ? Math.hypot(...g.srgb.map((v, k) => v - cfg.paintColor[k])) : Infinity);
  const paintGroup = cfg.paintColor ? [...groups].sort((a, b) => near(a) - near(b))[0] : null;
  const paintOf = (g) => cfg.paint.some((r) => r.test(g.name)) && (!paintGroup || g === paintGroup);

  // PROBE="x0,x1,y0,y1,z0,z1" (metres; x measured back from the nose) lists what lies in a box.
  if (process.env.PROBE) {
    const [x0, x1, y0, y1, z0, z1] = process.env.PROBE.split(',').map(Number);
    const hits = new Map();
    for (const g of groups)
      for (let t = 0; t < g.pos.length / 9; t++) {
        const p = t * 9;
        const cx = (g.pos[p] + g.pos[p + 3] + g.pos[p + 6]) / 3 + geo.frontOverhang;
        const cy = (g.pos[p + 1] + g.pos[p + 4] + g.pos[p + 7]) / 3;
        const cz = (g.pos[p + 2] + g.pos[p + 5] + g.pos[p + 8]) / 3;
        if (cx < x0 || cx > x1 || cy < y0 || cy > y1 || cz < z0 || cz > z1) continue;
        hits.set(g.name, (hits.get(g.name) ?? 0) + 1);
      }
    console.log(id, JSON.stringify(Object.fromEntries([...hits].sort((a, b) => b[1] - a[1]))));
    return;
  }

  // part → side → material → triangles
  const buckets = new Map();
  const sided = new Set(['doors', 'wheels', 'tires']);
  let dropped = 0;
  for (const g of groups) {
    const nrm = g.nrm ?? creasedNormals(g.pos);
    const isPaint = paintOf(g);
    for (let t = 0; t < g.pos.length / 9; t++) {
      const p = t * 9;
      const cx = (g.pos[p] + g.pos[p + 3] + g.pos[p + 6]) / 3;
      const cy = (g.pos[p + 1] + g.pos[p + 4] + g.pos[p + 7]) / 3;
      const cz = (g.pos[p + 2] + g.pos[p + 5] + g.pos[p + 8]) / 3;
      const part = classify(g, cx, cy, cz, cfg, geo, isPaint);
      if (!part) {
        dropped++;
        continue;
      }
      const side = sided.has(part) ? (cz >= 0 ? 0 : 1) : 0;
      const roof = isPaint && cfg.roofY && cy > cfg.roofY;
      const mat = isPaint && !roof ? 'paint' : roof ? 'roof' : g.name;
      const k = `${part}|${side}|${mat}`;
      let b = buckets.get(k);
      if (!b) buckets.set(k, (b = { part, side, mat, g, isPaint, pos: [], nrm: [] }));
      for (let q = 0; q < 9; q++) {
        b.pos.push(g.pos[p + q]);
        b.nrm.push(nrm[p + q]);
      }
    }
  }

  const doc = new Document();
  doc.createBuffer();
  // Measured on the model, so the app's schematic internals can line up with its wheels.
  const scene = doc.createScene(id).setExtras({
    wheelbaseM: +geo.wheelbase.toFixed(4),
    frontOverhangM: +geo.frontOverhang.toFixed(4),
    lengthM: cfg.lengthM,
    hasWheels: !geo.noTyre,
  });
  const mats = new Map();
  const material = (b) => {
    let m = mats.get(b.mat);
    if (!m) {
      m = doc
        .createMaterial(b.mat)
        .setBaseColorFactor(b.mat === 'roof' ? [0.01, 0.01, 0.01, 1] : b.g.color)
        .setRoughnessFactor(0.5)
        .setMetallicFactor(0.2);
      if (b.g.blend) m.setAlphaMode('BLEND');
      if (b.g.emissive) m.setEmissiveFactor([1, 1, 1]);
      if (b.g.doubleSided) m.setDoubleSided(true);
      mats.set(b.mat, m);
    }
    return m;
  };
  const nodes = new Map();
  const counts = {};
  for (const b of buckets.values()) {
    const nk = `${b.part}|${b.side}`;
    let node = nodes.get(nk);
    if (!node) {
      node = doc.createNode(`${SYSTEM[b.part]}__${b.part}__${b.side}`).setMesh(doc.createMesh(nk));
      scene.addChild(node);
      nodes.set(nk, node);
    }
    const prim = doc
      .createPrimitive()
      .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(b.pos)))
      .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(b.nrm)))
      .setMaterial(material(b));
    node.getMesh().addPrimitive(prim);
    counts[b.part] = (counts[b.part] ?? 0) + b.pos.length / 9;
  }
  const total = Object.values(counts).reduce((a, c) => a + c, 0);
  await MeshoptEncoder.ready;
  await MeshoptSimplifier.ready;
  doc.createExtension(EXTMeshoptCompression).setRequired(true);
  doc.createExtension(KHRMeshQuantization).setRequired(true);
  await doc.transform(
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: Math.min(1, cfg.target / total), error: 0.0015 }),
    // Materials are matched by name in the app (`paint`, `roof`), so they must not be merged.
    dedup({ propertyTypes: [PropertyType.ACCESSOR, PropertyType.MESH] }),
    prune(),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  );
  await mkdir('public/models', { recursive: true });
  const out = `public/models/${id}.glb`;
  await new NodeIO()
    .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
    .registerDependencies({ 'meshopt.encoder': MeshoptEncoder })
    .write(out, doc);
  let after = 0;
  for (const m of doc.getRoot().listMeshes())
    for (const p of m.listPrimitives()) after += (p.getIndices()?.getCount() ?? 0) / 3;
  const r = (v) => +v.toFixed(3);
  console.log(
    JSON.stringify({
      id,
      sizeM: geo.size.map(r),
      wheelbaseM: r(geo.wheelbase),
      frontOverhangM: r(geo.frontOverhang),
      tyreOuterZ: r(geo.tyreZ),
      tyreR: geo.tyreR.map(r),
      trianglesIn: total,
      trianglesOut: Math.round(after),
      dropped,
      parts: counts,
      bytes: (await stat(out)).size,
    }),
  );
}

const ids = process.argv.slice(2);
for (const id of ids.length ? ids : Object.keys(CARS)) await build(id);
