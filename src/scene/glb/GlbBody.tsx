import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { z } from 'zod';
import { isPartId, type CarId, type PartId } from '@/content/ids';
import { doubleSided, mat, matAdopted, matGhost, matHi, type MatKey } from '../materials';
import { Geo, Part, useCar, useMode } from '../prim';

export const modelUrl = (carId: CarId): string => `${import.meta.env.BASE_URL}models/${carId}.glb`;

interface Piece {
  geometry: THREE.BufferGeometry;
  /**
   * Placement relative to the model root. Compressed files store positions quantised and put
   * the scale back on the node, so this must be applied for the geometry to sit at true size.
   */
  matrix: THREE.Matrix4;
  /** Source material name; `paint` follows the livery. */
  name: string;
  color: THREE.Color;
  blend: boolean;
  emissive: boolean;
  doubleSided: boolean;
}

/** Measured on the model by scripts/build-models.mjs and stored in the file. */
export interface ModelInfo {
  parts: ReadonlySet<PartId>;
  wheelbaseM: number;
  frontOverhangM: number;
}

interface Section {
  part: PartId;
  mirror: boolean;
  pieces: Piece[];
}

const EXTRAS = z.object({ wheelbaseM: z.number().positive(), frontOverhangM: z.number().positive() });

const NODE = /^([a-z]+)__([a-z-]+)__(\d+)$/;

/** Groups the meshes of a built model by the part named in each node (`<system>__<part>__<i>`). */
function sections(scene: THREE.Object3D): Section[] {
  const out: Section[] = [];
  scene.updateMatrixWorld(true);
  const toRoot = new THREE.Matrix4().copy(scene.matrixWorld).invert();
  for (const node of scene.children) {
    const m = NODE.exec(node.name);
    const part = m?.[2];
    if (!m || !isPartId(part)) continue;
    const pieces: Piece[] = [];
    node.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const src: unknown = o.material;
      if (!(src instanceof THREE.MeshStandardMaterial) || !(o.geometry instanceof THREE.BufferGeometry))
        return;
      pieces.push({
        geometry: o.geometry,
        matrix: new THREE.Matrix4().multiplyMatrices(toRoot, o.matrixWorld),
        name: src.name,
        color: src.color,
        blend: src.transparent,
        emissive: src.emissive.r + src.emissive.g + src.emissive.b > 0.05,
        doubleSided: src.side === THREE.DoubleSide,
      });
    });
    out.push({ part, mirror: m[3] === '1', pieces });
  }
  return out;
}

/** Picks the app material for a piece of the model, or null to adopt the model's own colour. */
function keyFor(part: PartId, p: Piece, paint: MatKey): MatKey | null {
  if (p.name === 'paint') return paint;
  if (part === 'tires') return 'rubber';
  if (part === 'glass') return 'glass';
  if (part === 'lights') {
    if (p.blend) return 'lampCover';
    if (p.color.r > 0.45 && p.color.g < 0.2) return 'tail';
    if (p.emissive) return 'light';
  }
  return p.blend ? 'glass' : null;
}

function PieceMesh({ part, piece, paint }: { part: PartId; piece: Piece; paint: MatKey }) {
  const mode = useMode();
  const { tint } = useCar();
  const key = keyFor(part, piece, paint);
  const chosen =
    mode === 'ghost'
      ? matGhost(tint)
      : key
        ? mode === 'hi'
          ? matHi(key)
          : mat(key)
        : matAdopted(piece.name, piece.color, mode === 'hi');
  const material = piece.doubleSided && mode !== 'ghost' ? doubleSided(chosen) : chosen;
  return (
    <group matrix={piece.matrix} matrixAutoUpdate={false}>
      <Geo geometry={piece.geometry} material={material} />
    </group>
  );
}

/**
 * Exterior of one car from its built model file. Suspends while the file loads; the parent
 * shows the procedural body meanwhile and whenever the file cannot be loaded.
 */
export function GlbBody({
  carId,
  paint,
  onParts,
}: {
  carId: CarId;
  paint: MatKey;
  /** Reports which parts the model provides, so their schematic stand-ins are not drawn twice. */
  onParts: (info: ModelInfo | null) => void;
}) {
  const { scene } = useGLTF(modelUrl(carId));
  const list = useMemo(() => sections(scene), [scene]);
  useEffect(() => {
    const extras = EXTRAS.safeParse(scene.userData);
    onParts({
      parts: new Set(list.map((s) => s.part)),
      wheelbaseM: extras.success ? extras.data.wheelbaseM : NaN,
      frontOverhangM: extras.success ? extras.data.frontOverhangM : NaN,
    });
    return () => onParts(null);
  }, [list, scene, onParts]);
  return (
    <>
      {list.map((s, i) => (
        <Part key={i} id={s.part} mirror={s.mirror}>
          {s.pieces.map((p, j) => (
            <PieceMesh key={j} part={s.part} piece={p} paint={paint} />
          ))}
        </Part>
      ))}
    </>
  );
}
