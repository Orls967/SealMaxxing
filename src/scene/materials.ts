import * as THREE from 'three';

/** Shared clipping planes: empty = no cut. Mutated by the Cut tool. */
export const CLIP_PLANES: THREE.Plane[] = [];
export const CUT_PLANE = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

export const PALETTE = {
  bg: '#08080a',
  black: '#0a0a0c',
  red: '#e11d2e',
  redDeep: '#8f0f1a',
  white: '#f2f2f3',
  grey: '#8b8b94',
};

type Std = THREE.MeshStandardMaterialParameters;
type Phys = THREE.MeshPhysicalMaterialParameters;

const std = (p: Std) => new THREE.MeshStandardMaterial({ clippingPlanes: CLIP_PLANES, ...p });
const phys = (p: Phys) => new THREE.MeshPhysicalMaterial({ clippingPlanes: CLIP_PLANES, ...p });

const DEFS = {
  paint: () => phys({ color: '#0b0b0e', metalness: 0.6, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.06 }),
  paintRed: () => phys({ color: '#c8101f', metalness: 0.5, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 }),
  carbon: () => std({ color: '#1d1d22', metalness: 0.35, roughness: 0.45 }),
  glass: () =>
    phys({ color: '#16090b', metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1, side: THREE.DoubleSide }),
  rubber: () => std({ color: '#111113', metalness: 0, roughness: 0.9 }),
  plastic: () => std({ color: '#17171a', metalness: 0.1, roughness: 0.7 }),
  metal: () => std({ color: '#a9a9b2', metalness: 0.9, roughness: 0.35 }),
  steel: () => std({ color: '#5c5c66', metalness: 0.85, roughness: 0.45 }),
  dark: () => std({ color: '#2b2b31', metalness: 0.6, roughness: 0.5 }),
  ceramic: () => std({ color: '#3a3a40', metalness: 0.3, roughness: 0.6 }),
  red: () => std({ color: PALETTE.red, metalness: 0.4, roughness: 0.4 }),
  redDeep: () => std({ color: PALETTE.redDeep, metalness: 0.5, roughness: 0.45 }),
  cell: () => std({ color: '#5a0d15', metalness: 0.6, roughness: 0.4 }),
  seat: () => std({ color: '#1a1a1d', metalness: 0, roughness: 0.75 }),
  light: () => std({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 2.2 }),
  tail: () => std({ color: '#ff1a2c', emissive: '#ff1a2c', emissiveIntensity: 2.4 }),
  screen: () => std({ color: '#200609', emissive: '#e11d2e', emissiveIntensity: 0.55, roughness: 0.2 }),
  flow: () =>
    new THREE.MeshBasicMaterial({ color: '#ff4654', transparent: true, opacity: 0.4, depthWrite: false, clippingPlanes: CLIP_PLANES }),
  volume: () =>
    new THREE.MeshBasicMaterial({ color: '#f2f2f3', transparent: true, opacity: 0.14, depthWrite: false, clippingPlanes: CLIP_PLANES }),
} satisfies Record<string, () => THREE.Material>;

export type MatKey = keyof typeof DEFS;

const base = new Map<string, THREE.Material>();
const hi = new Map<string, THREE.Material>();
const ghosts = new Map<string, THREE.Material>();

export function mat(key: MatKey): THREE.Material {
  let m = base.get(key);
  if (!m) {
    m = DEFS[key]();
    base.set(key, m);
  }
  return m;
}

/** Highlighted variant: same surface with a red glow. */
export function matHi(key: MatKey): THREE.Material {
  let m = hi.get(key);
  if (!m) {
    m = DEFS[key]();
    if (m instanceof THREE.MeshStandardMaterial) {
      m.emissive = new THREE.Color(PALETTE.red);
      m.emissiveIntensity = key === 'light' || key === 'tail' ? 2.4 : 0.55;
      if (key === 'glass') m.opacity = 0.75;
    } else if (m instanceof THREE.MeshBasicMaterial) {
      m.opacity = Math.min(1, m.opacity * 2);
    }
    hi.set(key, m);
  }
  return m;
}

/** X-ray material: bright at grazing angles, nearly invisible face-on. */
export function matGhost(color: string = PALETTE.white, strength = 1): THREE.Material {
  const k = `${color}:${strength}`;
  let m = ghosts.get(k);
  if (!m) {
    m = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uStrength: { value: strength } },
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; uniform float uStrength;
        varying vec3 vN; varying vec3 vV;
        void main() {
          float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
          float a = (0.035 + pow(f, 2.2) * 0.55) * uStrength;
          gl_FragColor = vec4(uColor, a);
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    ghosts.set(k, m);
  }
  return m;
}

/** Red unlit back faces: makes a cut through a closed shell read as a filled section. */
export const CUT_CAP = new THREE.MeshBasicMaterial({
  color: PALETTE.redDeep,
  side: THREE.BackSide,
  clippingPlanes: CLIP_PLANES,
});

export interface ArchSpec {
  frontX: number;
  rearX: number;
  frontR: number;
  rearR: number;
  y: number;
  zMin: number;
}

/** Adds a fragment discard inside the wheel-arch circles so wheels show through the body side. */
export function withArches<T extends THREE.Material>(m: T, a: ArchSpec): T {
  const c = m.clone() as T;
  c.onBeforeCompile = (shader) => {
    shader.uniforms.uArchF = { value: new THREE.Vector3(a.frontX, a.y, a.frontR) };
    shader.uniforms.uArchR = { value: new THREE.Vector3(a.rearX, a.y, a.rearR) };
    shader.uniforms.uArchZ = { value: a.zMin };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vArchP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvArchP = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vArchP; uniform vec3 uArchF; uniform vec3 uArchR; uniform float uArchZ;',
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        if (abs(vArchP.z) > uArchZ && (distance(vArchP.xy, uArchF.xy) < uArchF.z || distance(vArchP.xy, uArchR.xy) < uArchR.z)) discard;`,
      );
  };
  c.customProgramCacheKey = () => `arch:${a.frontX}:${a.rearX}:${a.frontR}:${a.rearR}:${a.y}:${a.zMin}`;
  return c;
}
