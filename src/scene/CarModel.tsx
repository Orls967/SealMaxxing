import { useMemo } from 'react';
import type * as THREE from 'three';
import type { CarId, PartId } from '@/content/ids';
import { PARTS } from '@/content/parts';
import { partMode, type DisplayState } from './display';
import { ExplodeAnimator } from './dissect/ExplodeAnimator';
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
  return (
    <CarCtx.Provider value={ctx}>
      <group position={position}>
        <CarBody s={s} lay={lay} paint={livery === 'theme' ? 'paint' : s.paint} cut={cut} />
        <CarInternals s={s} lay={lay} exteriorOnly={detail === 'exterior'} />
        <ExplodeAnimator target={explode} instant={instant} />
      </group>
    </CarCtx.Provider>
  );
}
