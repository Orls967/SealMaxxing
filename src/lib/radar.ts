import type { CarId } from '@/content/ids';
import type { Car } from '@/content/types';
import { normalise } from './compare';
import { DERIVED } from './derived';
import { simulateBrake } from './sim/brake';
import { downforceKg, downforceSpecFor } from './sim/downforce';
import { MODEL, brakeInputFor } from './sim/params';

export const RADAR_KEYS = ['accel', 'top', 'ratio', 'downforce', 'braking', 'daily'] as const;
export type RadarKey = (typeof RADAR_KEYS)[number];

export interface RadarRow {
  key: RadarKey;
  /** 0..1, 1 = best among the given cars; null = does not apply to that car. */
  values: Partial<Record<CarId, number | null>>;
}

const mean = (xs: (number | null)[]): number | null => {
  const ok = xs.filter((x): x is number => x !== null);
  return ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : null;
};

/** Normalised profile: each axis is scaled to the best car. Braking and downforce come from the simple model. */
export function radarProfile(cars: Car[]): RadarRow[] {
  const ratio = DERIVED.find((d) => d.id === 'powerPerTonneKw');
  const col = (raw: (number | null)[], better: 'higher' | 'lower') => normalise(raw, better);
  const seats = col(
    cars.map((c) => c.specs.seats?.value ?? null),
    'higher',
  );
  const cargo = col(
    cars.map((c) => c.specs.cargoL?.value ?? null),
    'higher',
  );
  const axes: Record<RadarKey, (number | null)[]> = {
    accel: col(
      cars.map((c) => c.specs.zeroTo100S?.value ?? null),
      'lower',
    ),
    top: col(
      cars.map((c) => c.specs.topSpeedKmh?.value ?? null),
      'higher',
    ),
    ratio: col(
      cars.map((c) => ratio?.get(c)?.value ?? null),
      'higher',
    ),
    downforce: col(
      cars.map((c) => {
        const spec = downforceSpecFor(c, MODEL[c.id].downforceCapped);
        return spec ? downforceKg(spec, 200) : null;
      }),
      'higher',
    ),
    braking: col(
      cars.map((c) => simulateBrake(brakeInputFor(c), 100).distanceM),
      'lower',
    ),
    daily: cars.map((_, i) => mean([seats[i] ?? null, cargo[i] ?? null])),
  };
  return RADAR_KEYS.map((key) => ({
    key,
    values: Object.fromEntries(cars.map((c, i) => [c.id, axes[key][i] ?? null])),
  }));
}
