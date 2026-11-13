import type { Car } from '@/content/types';

/**
 * Parameters of the synthesised engine note. Cylinder count and maximum revs come from the
 * car's published specs; everything else is an assumption of the sound model, NOT
 * manufacturer data. The UI labels the result as a synthetic illustration.
 */
export type SoundProfile =
  | {
      kind: 'ice';
      cylinders: number;
      idleRpm: number;
      maxRpm: number;
      turbo: boolean;
      /** Hybrid: a faint motor whine rides on top of the engine. */
      electric: boolean;
    }
  | { kind: 'ev' };

const IDLE_RPM = 1000;

export function soundProfileFor(car: Car): SoundProfile {
  const cylinders = car.specs.cylinders?.value;
  const maxRpm = car.specs.engineMaxRpm?.value;
  if (cylinders === undefined || maxRpm === undefined) return { kind: 'ev' };
  return {
    kind: 'ice',
    cylinders,
    idleRpm: IDLE_RPM,
    maxRpm,
    turbo: car.kind === 'phev' || car.kind === 'ice',
    electric: car.specs.motorPowerKw !== undefined,
  };
}

/** Firing frequency of a four-stroke engine: each cylinder fires once every two revolutions. */
export const firingHz = (rpm: number, cylinders: number): number => (rpm / 60) * (cylinders / 2);

/** Revs for a throttle level between 0 (idle) and 1 (limiter). */
export function rpmAt(level: number, idleRpm: number, maxRpm: number): number {
  const l = Math.min(1, Math.max(0, level));
  return idleRpm + (maxRpm - idleRpm) * l;
}

export interface Response {
  /** Seconds to rev from idle to the limiter with the pedal down. */
  riseS: number;
  /** Seconds to fall back to idle after lifting. */
  fallS: number;
}

export const RESPONSE: Record<SoundProfile['kind'], Response> = {
  ice: { riseS: 1.6, fallS: 1.1 },
  ev: { riseS: 2.4, fallS: 1.4 },
};

/** Advances the throttle level by dt seconds: up while the pedal is held, down when released. */
export function stepLevel(level: number, pedal: boolean, dt: number, r: Response): number {
  const d = Math.max(0, dt);
  const next = pedal ? level + d / r.riseS : level - d / r.fallS;
  return Math.min(1, Math.max(0, next));
}
