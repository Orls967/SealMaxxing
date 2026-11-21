// Reads a GLB and flattens it to world-space triangles grouped by material.
// Node transforms and skinning are applied, so every vertex ends up where the viewer draws it.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

function mul(m, x, y, z) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}
function mulMat(a, b) {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
}

/**
 * @returns {Promise<{ groups: { name: string, color: number[], blend: boolean, emissive: boolean,
 *   pos: Float32Array, nrm: Float32Array | null, vcol: Uint8Array | null }[] }>} one entry per source material; `pos` holds
 *   unindexed triangles (9 floats each), `vcol` one RGB triple per vertex when the mesh has colours.
 */
export async function bake(path) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(path);
  const root = doc.getRoot();
  const groups = new Map();
  const bucket = (mat) => {
    const name = mat ? mat.getName() || `mat${root.listMaterials().indexOf(mat)}` : 'none';
    let g = groups.get(name);
    if (!g) {
      const e = mat ? mat.getEmissiveFactor() : [0, 0, 0];
      g = {
        name,
        color: mat ? mat.getBaseColorFactor() : [1, 1, 1, 1],
        blend: mat ? mat.getAlphaMode() === 'BLEND' : false,
        emissive: e[0] + e[1] + e[2] > 0.05,
        pos: [],
        nrm: [],
        vcol: [],
      };
      groups.set(name, g);
    }
    return g;
  };
  for (const scene of root.listScenes())
    scene.traverse((node) => {
      const mesh = node.getMesh();
      if (!mesh) return;
      const skin = node.getSkin();
      const world = node.getWorldMatrix();
      let jointMats = null;
      if (skin) {
        const ibm = skin.getInverseBindMatrices();
        jointMats = skin.listJoints().map((j, i) => {
          const inv = ibm ? ibm.getElement(i, new Array(16)) : null;
          return inv ? mulMat(j.getWorldMatrix(), inv) : j.getWorldMatrix();
        });
      }
      for (const prim of mesh.listPrimitives()) {
        if (prim.getMode() !== 4) continue;
        const P = prim.getAttribute('POSITION');
        if (!P) continue;
        const J = prim.getAttribute('JOINTS_0');
        const Wt = prim.getAttribute('WEIGHTS_0');
        const C = prim.getAttribute('COLOR_0');
        const N = prim.getAttribute('NORMAL');
        const nv = [0, 0, 0];
        const idx = prim.getIndices();
        const n = idx ? idx.getCount() : P.getCount();
        const g = bucket(prim.getMaterial());
        const p = [0, 0, 0];
        const j4 = [0, 0, 0, 0];
        const w4 = [0, 0, 0, 0];
        const c4 = [0, 0, 0, 0];
        for (let k = 0; k < n; k++) {
          const v = idx ? idx.getScalar(k) : k;
          P.getElement(v, p);
          let out;
          let m0 = world;
          if (jointMats && J && Wt) {
            J.getElement(v, j4);
            Wt.getElement(v, w4);
            out = [0, 0, 0];
            let sum = 0;
            for (let q = 0; q < 4; q++) {
              const w = w4[q];
              if (w <= 0) continue;
              if (w >= Math.max(...w4)) m0 = jointMats[j4[q]];
              const r = mul(jointMats[j4[q]], p[0], p[1], p[2]);
              out[0] += r[0] * w;
              out[1] += r[1] * w;
              out[2] += r[2] * w;
              sum += w;
            }
            if (sum > 0) out = out.map((x) => x / sum);
            else out = mul(world, p[0], p[1], p[2]);
          } else out = mul(world, p[0], p[1], p[2]);
          g.pos.push(out[0], out[1], out[2]);
          if (N) {
            // Rotate the normal with the dominant transform (uniform scale assumed).
            N.getElement(v, nv);
            const a = mul(m0, nv[0], nv[1], nv[2]);
            const o = mul(m0, 0, 0, 0);
            const d = [a[0] - o[0], a[1] - o[1], a[2] - o[2]];
            const l = Math.hypot(d[0], d[1], d[2]) || 1;
            g.nrm.push(d[0] / l, d[1] / l, d[2] / l);
          }
          if (C) {
            C.getElement(v, c4);
            g.vcol.push(Math.round(c4[0] * 255), Math.round(c4[1] * 255), Math.round(c4[2] * 255));
          }
        }
      }
    });
  return {
    groups: [...groups.values()]
      .filter((g) => g.pos.length >= 9)
      .map((g) => ({
        ...g,
        pos: new Float32Array(g.pos),
        nrm: g.nrm.length === g.pos.length ? new Float32Array(g.nrm) : null,
        vcol: g.vcol.length === g.pos.length ? new Uint8Array(g.vcol) : null,
      })),
  };
}

export function bounds(groups) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const g of groups)
    for (let i = 0; i < g.pos.length; i += 3)
      for (let a = 0; a < 3; a++) {
        const v = g.pos[i + a];
        if (v < min[a]) min[a] = v;
        if (v > max[a]) max[a] = v;
      }
  return { min, max, size: max.map((v, a) => v - min[a]) };
}
