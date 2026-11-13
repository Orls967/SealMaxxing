import { useCallback, useEffect, useMemo, useState } from 'react';
import type * as THREE from 'three';
import type { CarId, PartId } from '@/content/ids';
import { CameraRig, type CamPreset } from './CameraRig';
import { CarModel } from './CarModel';
import type { DisplayState } from './display';
import { applyCut, type CutAxis } from './dissect/cut';
import type { Livery } from '@/lib/viewState';
import { SHAPES } from './procedural/shapes';
import { Stage } from './Stage';
import { Studio } from './Studio';

export interface DissectSceneProps {
  label: string;
  carId: CarId;
  part: PartId | null;
  system: DisplayState['system'];
  xray: boolean;
  peel: number;
  /** 0..100 */
  explode: number;
  cut: CutAxis | null;
  cutPos: number;
  cam: CamPreset;
  camNonce: number;
  livery: Livery;
  instant: boolean;
  onSelect: (id: PartId | null) => void;
}

/** One car with the four dissect tools applied. */
export function DissectScene(p: DissectSceneProps) {
  const s = SHAPES[p.carId];
  const [focus, setFocus] = useState<THREE.Vector3 | null>(null);
  const display = useMemo<DisplayState>(
    () => ({ part: p.part, system: p.system, xray: p.xray, peel: p.peel }),
    [p.part, p.system, p.xray, p.peel],
  );
  useEffect(() => {
    applyCut(p.carId, p.cut, p.cutPos);
    return () => applyCut(p.carId, null, 0);
  }, [p.carId, p.cut, p.cutPos]);
  useEffect(() => setFocus(null), [p.carId, p.cam, p.camNonce]);
  const { onSelect } = p;
  const select = useCallback((id: PartId) => onSelect(id), [onSelect]);
  const onFocus = useCallback((pt: THREE.Vector3) => setFocus(pt.clone()), []);
  const spread = 1 + (p.explode / 100) * 0.9;
  return (
    <Stage label={p.label} onMiss={() => onSelect(null)}>
      <Studio span={4} shadows={p.explode === 0 && p.peel === 0} />
      <CarModel
        key={p.carId}
        carId={p.carId}
        display={display}
        explode={p.explode / 100}
        livery={p.livery}
        cut={p.cut !== null}
        instant={p.instant}
        onSelect={select}
        onFocus={onFocus}
      />
      <CameraRig
        preset={p.cam}
        nonce={p.camNonce}
        target={[s.L / 2 - s.fo, 0.5, 0]}
        distance={7.6 * spread}
        focus={focus}
        instant={p.instant}
      />
    </Stage>
  );
}
