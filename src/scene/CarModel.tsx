import { Suspense, useCallback, useMemo, useState } from 'react';
import type * as THREE from 'three';
import type { CarId, PartId } from '@/content/ids';
import { PARTS } from '@/content/parts';
import { partMode, type DisplayState } from './display';
import { ExplodeAnimator } from './dissect/ExplodeAnimator';
import { GlbBody, type ModelInfo } from './glb/GlbBody';
import { ModelBoundary } from './glb/ModelBoundary';
import type { Livery } from '@/lib/viewState';
import { PALETTE } from './materials';
import { CarCtx, type CarContext, type PartEntry } from './prim';
import { CarBody } from './procedural/CarBody';
import { CarInternals } from './procedural/CarInternals';
import { LAYOUTS } from './procedural/layouts';
import { SHAPES } from './procedural/shapes';

export interface CarModelProps {
  carId: CarId;
  display?: DisplayState;
  /** Explode target, 0..1. */
  explode?: number;
  /** `factory` = reference colour of each car, `theme` = the black-and-red theme livery. */
  livery?: Livery;
  /** Ghost colour, used to tell cars apart when they are stacked. */
  tint?: string;
  /** `exterior` skips everything hidden behind the body: for views that never open the car. */
  detail?: 'full' | 'exterior';
  cut?: boolean;
  instant?: boolean;
  position?: [number, number, number];
  onSelect?: (id: PartId) => void;
  onFocus?: (point: THREE.Vector3) => void;
}

const NO_DISPLAY: DisplayState = {};

/**
 * One procedural car at true scale. Origin: centre of the front axle on the ground,
 * +X towards the rear, +Y up. Every part is a group named `<systemId>__<partId>__<index>`.
 */
export function CarModel({
  carId,
  display = NO_DISPLAY,
  explode = 0,
  livery = 'factory',
  tint = PALETTE.white,
  detail = 'full',
  cut = false,
  instant = false,
  position,
  onSelect,
  onFocus,
}: CarModelProps) {
  const registry = useMemo(() => ({ parts: new Set<PartEntry>(), explodeT: { current: explode } }), []); // eslint-disable-line react-hooks/exhaustive-deps -- created once; the animator owns explodeT afterwards
  const ctx = useMemo<CarContext>(
    () => ({
      carId,
      tint,
      parts: registry.parts,
      explodeT: registry.explodeT,
      modeOf: (id) => partMode(id, display),
      present: (id) => PARTS[carId][id].presence.kind === 'present',
      onSelect,
      onFocus,
    }),
    [carId, tint, registry, display, onSelect, onFocus],
  );
  const s = SHAPES[carId];
  const lay = LAYOUTS[carId];
  const paint = livery === 'theme' ? 'paint' : s.paint;
  // Parts supplied by the loaded model file; null while the procedural body stands in.
  const [model, setModel] = useState<ModelInfo | null>(null);
  const onParts = useCallback((m: ModelInfo | null) => setModel(m), []);
  // The schematic internals follow the axles measured on the loaded model, so brakes and
  // suspension sit inside its wheels even where the model's proportions differ slightly.
  const inner = useMemo(
    () =>
      model && Number.isFinite(model.wheelbaseM) && Number.isFinite(model.frontOverhangM)
        ? { ...s, wb: model.wheelbaseM, fo: model.frontOverhangM }
        : s,
    [s, model],
  );
  // A loaded model brings its own cabin, and its glass is clear: while the car is shut (body
  // solid, nothing exploded) the schematic internals would only show through and clash.
  const closed = model !== null && partMode('body-panels', display) === 'solid' && explode === 0;
  const procedural = <CarBody s={s} lay={lay} paint={paint} cut={cut} />;
  return (
    <CarCtx.Provider value={ctx}>
      <group position={position}>
        <ModelBoundary fallback={procedural}>
          <Suspense fallback={procedural}>
            <GlbBody carId={carId} paint={paint} onParts={onParts} />
          </Suspense>
        </ModelBoundary>
        <CarInternals
          s={inner}
          lay={lay}
          exteriorOnly={detail === 'exterior' || closed}
          fromModel={model?.parts ?? null}
        />
        <ExplodeAnimator target={explode} instant={instant} />
      </group>
    </CarCtx.Provider>
  );
}
