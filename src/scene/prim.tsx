import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { PART_SYSTEM, type CarId, type PartId } from '@/content/ids';
import type { Mode } from './display';
import { EXPLODE, type V3 } from './explode';
import { mat, matGhost, matHi, type MatKey } from './materials';

export interface PartEntry {
  id: PartId;
  g: THREE.Group;
  /** Offset in metres at 100% explode. */
  d: V3;
  /** Home centre in car space; filled lazily by the explode animator. */
  c?: THREE.Vector3;
}

export interface CarContext {
  carId: CarId;
  tint: string;
  /** Live registry of mounted part groups; the explode animator moves them without React state. */
  parts: Set<PartEntry>;
  /** Current animated explode amount, 0..1. */
  explodeT: { current: number };
  modeOf: (id: PartId) => Mode;
  present: (id: PartId) => boolean;
  onSelect?: (id: PartId) => void;
  onFocus?: (point: THREE.Vector3) => void;
}

export const CarCtx = createContext<CarContext | null>(null);
const ModeCtx = createContext<{ mode: Mode; tint: string }>({ mode: 'solid', tint: '#ffffff' });

export function useCar(): CarContext {
  const c = useContext(CarCtx);
  if (!c) throw new Error('CarCtx missing');
  return c;
}

const setCursor = (v: string) => {
  document.body.style.cursor = v;
};

/**
 * One selectable part. `dir` overrides the default explode direction; `mirror` flips its Z
 * so left/right halves of the same part fly apart symmetrically.
 */
export function Part({
  id,
  dir,
  mirror,
  children,
}: {
  id: PartId;
  dir?: V3;
  mirror?: boolean;
  children: ReactNode;
}) {
  const c = useCar();
  const base = c.modeOf(id);
  const [hover, setHover] = useState(false);
  const mode: Mode = hover && base === 'solid' && c.onSelect ? 'hi' : base;
  const ctx = useMemo(() => ({ mode, tint: c.tint }), [mode, c.tint]);
  const ref = useRef<THREE.Group>(null);
  const visible = c.present(id) && base !== 'hidden';
  const d = dir ?? EXPLODE[id];
  const dx = d[0];
  const dy = d[1];
  const dz = d[2] * (mirror ? -1 : 1);
  const { parts, explodeT } = c;
  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    let n = 0;
    for (const e of parts) if (e.id === id) n++;
    g.name = `${PART_SYSTEM[id]}__${id}__${n}`;
    const t = explodeT.current;
    g.position.set(dx * t, dy * t, dz * t);
    const entry: PartEntry = { id, g, d: [dx, dy, dz] };
    parts.add(entry);
    return () => {
      parts.delete(entry);
    };
  }, [parts, explodeT, id, dx, dy, dz, visible]);
  if (!visible) return null;
  const select = c.onSelect;
  const focus = c.onFocus;
  return (
    <ModeCtx.Provider value={ctx}>
      <group
        ref={ref}
        onClick={
          select
            ? (e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                select(id);
              }
            : undefined
        }
        onDoubleClick={
          focus
            ? (e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                focus(e.point);
              }
            : undefined
        }
        onPointerOver={
          select ? (e) => (e.stopPropagation(), setCursor('pointer'), setHover(true)) : undefined
        }
        onPointerOut={select ? () => (setCursor(''), setHover(false)) : undefined}
      >
        {children}
      </group>
    </ModeCtx.Provider>
  );
}

export function useMat(k: MatKey): THREE.Material {
  const { mode, tint } = useContext(ModeCtx);
  if (mode === 'ghost') return matGhost(tint);
  return mode === 'hi' ? matHi(k) : mat(k);
}

const NO_RAY = () => undefined;
const RAY = THREE.Mesh.prototype.raycast;
/** Ghosted parts must not swallow clicks meant for the parts behind them. */
function useRay() {
  return useContext(ModeCtx).mode === 'ghost' ? NO_RAY : RAY;
}

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const UNIT_CYL = new THREE.CylinderGeometry(1, 1, 1, 32);
const UNIT_SPH = new THREE.SphereGeometry(1, 24, 16);
const UNIT_TORUS = new THREE.TorusGeometry(1, 0.12, 10, 32);
const AXIS_ROT: Record<'x' | 'y' | 'z', V3> = {
  x: [0, 0, Math.PI / 2],
  y: [0, 0, 0],
  z: [Math.PI / 2, 0, 0],
};

interface Common {
  k: MatKey;
  p?: V3;
  r?: V3;
}

export function Box({ k, p, r, s }: Common & { s: V3 }) {
  return (
    <mesh geometry={UNIT_BOX} material={useMat(k)} position={p} rotation={r} scale={s} raycast={useRay()} />
  );
}

export function Cyl({
  k,
  p,
  rad,
  h,
  axis = 'y',
}: Omit<Common, 'r'> & { rad: number; h: number; axis?: 'x' | 'y' | 'z' }) {
  return (
    <mesh
      geometry={UNIT_CYL}
      material={useMat(k)}
      position={p}
      rotation={AXIS_ROT[axis]}
      scale={[rad, h, rad]}
      raycast={useRay()}
    />
  );
}

export function Sph({ k, p, s }: Common & { s: V3 }) {
  return <mesh geometry={UNIT_SPH} material={useMat(k)} position={p} scale={s} raycast={useRay()} />;
}

/** Torus lying around the given axis. */
export function Ring({ k, p, rad, axis = 'z' }: Omit<Common, 'r'> & { rad: number; axis?: 'x' | 'y' | 'z' }) {
  const rot: V3 = axis === 'z' ? [0, 0, 0] : axis === 'x' ? [0, Math.PI / 2, 0] : [Math.PI / 2, 0, 0];
  return (
    <mesh
      geometry={UNIT_TORUS}
      material={useMat(k)}
      position={p}
      rotation={rot}
      scale={rad}
      raycast={useRay()}
    />
  );
}

const Y = new THREE.Vector3(0, 1, 0);
/** Straight rod between two points. */
export function Rod({ k, a, b, rad = 0.012 }: { k: MatKey; a: V3; b: V3; rad?: number }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const l = dir.length();
    return {
      pos: va.clone().add(vb).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(Y, dir.normalize()),
      len: l,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tuples are compared by value
  }, [a[0], a[1], a[2], b[0], b[1], b[2]]);
  return (
    <mesh
      geometry={UNIT_CYL}
      material={useMat(k)}
      position={pos}
      quaternion={quat}
      scale={[rad, len, rad]}
      raycast={useRay()}
    />
  );
}

/** Smooth tube through points. */
export function Tube({ k, pts, rad = 0.03 }: { k: MatKey; pts: V3[]; rad?: number }) {
  const key = pts.flat().join(',');
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, pts.length * 10, rad, 10, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures pts by value
  }, [key, rad]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <mesh geometry={geo} material={useMat(k)} raycast={useRay()} />;
}

/** Mesh with caller-owned geometry and an explicit material. */
export function Geo({
  geometry,
  material,
  p,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  p?: V3;
}) {
  return <mesh geometry={geometry} material={material} position={p} raycast={useRay()} />;
}

export function useMode(): Mode {
  return useContext(ModeCtx).mode;
}
