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
  floor: '#0c0c0f',
};

type Std = THREE.MeshStandardMaterialParameters;
type Phys = THREE.MeshPhysicalMaterialParameters;

const std = (p: Std) => new THREE.MeshStandardMaterial({ clippingPlanes: CLIP_PLANES, ...p });
const phys = (p: Phys) => new THREE.MeshPhysicalMaterial({ clippingPlanes: CLIP_PLANES, ...p });

const DEFS = {
  paint: () =>
    phys({ color: '#0b0b0e', metalness: 0.6, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.06 }),
  paintRed: () =>
    phys({ color: '#c8101f', metalness: 0.5, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 }),
  // Factory-style colours taken from the reference pictures of each car.
  paintSeal: () =>
    phys({ color: '#51667d', metalness: 0.65, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08 }),
  paintP1: () =>
    phys({ color: '#8e0d16', metalness: 0.7, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.05 }),
  paintSenna: () =>
    phys({ color: '#e2491b', metalness: 0.35, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06 }),
  carbon: () => std({ color: '#1d1d22', metalness: 0.35, roughness: 0.45 }),
  /** Openings: grilles, ducts, meshes. */
  intake: () => std({ color: '#050506', metalness: 0.1, roughness: 0.85 }),
  trim: () => std({ color: '#121215', metalness: 0.2, roughness: 0.6 }),
  lampCover: () =>
    phys({
      color: '#c9ccd2',
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.28,
      clearcoat: 1,
      depthWrite: false,
    }),
  lens: () => phys({ color: '#0d0d10', metalness: 0.4, roughness: 0.08, clearcoat: 1 }),
  liner: () => std({ color: '#060607', metalness: 0, roughness: 1, side: THREE.DoubleSide }),
  glassDark: () =>
    phys({
      color: '#050507',
      metalness: 0.5,
      roughness: 0.04,
      transparent: true,
      opacity: 0.92,
      clearcoat: 1,
      side: THREE.DoubleSide,
    }),
  glass: () =>
    phys({
      color: '#0b0a0d',
      metalness: 0.35,
      roughness: 0.04,
      transparent: true,
      opacity: 0.8,
      clearcoat: 1,
      side: THREE.DoubleSide,
    }),
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
    new THREE.MeshBasicMaterial({
      color: '#ff4654',
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      clippingPlanes: CLIP_PLANES,
    }),
  floor: () =>
    new THREE.MeshStandardMaterial({
      color: PALETTE.floor,
      metalness: 0,
      roughness: 1,
      envMapIntensity: 0.2,
    }),
  strip: () => new THREE.MeshBasicMaterial({ color: PALETTE.red, toneMapped: false }),
  volume: () =>
    new THREE.MeshBasicMaterial({
      color: '#f2f2f3',
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      clippingPlanes: CLIP_PLANES,
    }),
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

const twoSided = new Map<THREE.Material, THREE.Material>();

/** The same material drawn from both sides, for models whose faces are not consistently wound. */
export function doubleSided(m: THREE.Material): THREE.Material {
  let d = twoSided.get(m);
  if (!d) {
    d = m.clone();
    d.side = THREE.DoubleSide;
    twoSided.set(m, d);
  }
  return d;
}

const adopted = new Map<string, THREE.Material>();

/**
 * Material for a surface that arrives with a downloaded model: keeps the model's own colour,
 * but is built here so it obeys the cut tool and gets the same highlight as every other part.
 */
export function matAdopted(name: string, color: THREE.Color, highlighted: boolean): THREE.Material {
  const k = `${name}:${color.getHexString()}:${highlighted ? 1 : 0}`;
  let m = adopted.get(k);
  if (!m) {
    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);
    // Near-black parts are trim and carbon; pale neutral ones are bare metal.
    const metal = hsl.s < 0.12 && hsl.l > 0.3;
    const made = std({
      color: hsl.l < 0.02 ? color.clone().setScalar(0.012) : color,
      metalness: metal ? 0.85 : 0.25,
      roughness: metal ? 0.35 : hsl.l < 0.08 ? 0.55 : 0.5,
    });
    if (highlighted) {
      made.emissive = new THREE.Color(PALETTE.red);
      made.emissiveIntensity = 0.55;
    }
    m = made;
    adopted.set(k, m);
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
          float a = (0.012 + pow(f, 3.0) * 0.26) * uStrength;
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

/** Thin connector lines drawn from each exploded part back to where it belongs. */
export const EXPLODE_LINE = new THREE.LineBasicMaterial({
  color: PALETTE.red,
  transparent: true,
  opacity: 0.55,
  depthWrite: false,
});
