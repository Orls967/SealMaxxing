import type { CarId } from '@/content/ids';
import type { Car } from '@/content/types';
import type { AccelInput } from './accel';
import type { BrakeInput } from './brake';
import { downforceSpecFor } from './downforce';

/**
 * Model parameters. These are NOT manufacturer data: they are assumptions of the simple
 * model, and `mu` / `eff` are calibrated so 0–100 and 0–200 km/h land within ±5% of the
 * claims (see params.test.ts). The UI labels every result "model sederhana".
 */
export interface ModelParams {
  drive: 'awd' | 'rwd';
  mu: number;
  eff: number;
  drivenFraction: number;
  cgHeightM: number;
  /** Drag area Cd × A (m²), estimated. */
  cdA: number;
  crr: number;
  downforceCapped: boolean;
  downforceDriven: number;
  engine: {
    powerRpm: number;
    torqueRpm: number;
    firstGearKmh: number;
    shiftS: number;
    launchRpm: number;
  } | null;
  motorBaseKmh: number;
  muBrake: number;
  brakeCapG: number;
}

export const DRIVER_KG = 75;

export const MODEL: Record<CarId, ModelParams> = {
  seal: {
    drive: 'awd',
    mu: 0.8,
    eff: 0.9,
    drivenFraction: 1,
    cgHeightM: 0.5,
    cdA: 0.52,
    crr: 0.011,
    downforceCapped: false,
    downforceDriven: 0.5,
    engine: null,
    motorBaseKmh: 62,
    muBrake: 1.0,
    brakeCapG: 1.1,
  },
  laferrari: {
    drive: 'rwd',
    mu: 1.3,
    eff: 0.84,
    drivenFraction: 0.59,
    cgHeightM: 0.42,
    cdA: 0.66,
    crr: 0.012,
    downforceCapped: false,
    downforceDriven: 0.6,
    engine: { powerRpm: 9000, torqueRpm: 6750, firstGearKmh: 92, shiftS: 0.06, launchRpm: 4500 },
    motorBaseKmh: 70,
    muBrake: 1.2,
    brakeCapG: 2,
  },
  p1: {
    drive: 'rwd',
    mu: 1.38,
    eff: 0.81,
    drivenFraction: 0.58,
    cgHeightM: 0.43,
    cdA: 0.68,
    crr: 0.012,
    downforceCapped: true,
    downforceDriven: 0.6,
    engine: { powerRpm: 7500, torqueRpm: 4000, firstGearKmh: 84, shiftS: 0.06, launchRpm: 3500 },
    motorBaseKmh: 60,
    muBrake: 1.22,
    brakeCapG: 2,
  },
  senna: {
    drive: 'rwd',
    mu: 1.38,
    eff: 0.82,
    drivenFraction: 0.58,
    cgHeightM: 0.43,
    cdA: 0.75,
    crr: 0.012,
    downforceCapped: true,
    downforceDriven: 0.6,
    engine: { powerRpm: 7250, torqueRpm: 5500, firstGearKmh: 82, shiftS: 0.06, launchRpm: 3500 },
    motorBaseKmh: 0,
    muBrake: 1.25,
    brakeCapG: 2.2,
  },
};

const need = (car: Car, v: number | undefined, what: string): number => {
  if (v === undefined) throw new Error(`${car.id}: missing ${what} for the simulation`);
  return v;
};

/** Builds the acceleration model input from the car's published specs plus the model parameters. */
export function accelInputFor(car: Car, p: ModelParams = MODEL[car.id]): AccelInput {
  const s = car.specs;
  const powerTotalKw = need(car, s.powerTotalKw?.value, 'powerTotalKw');
  const enginePowerKw = s.enginePowerKw?.value;
  const motorKw = s.motorPowerKw?.value;
  return {
    massKg: need(car, s.kerbKg?.value, 'kerbKg') + DRIVER_KG,
    drive: p.drive,
    drivenFraction: p.drivenFraction,
    cgHeightM: p.cgHeightM,
    wheelbaseM: need(car, s.wheelbaseMm?.value, 'wheelbaseMm') / 1000,
    mu: p.mu,
    eff: p.eff,
    cdA: p.cdA,
    crr: p.crr,
    powerTotalKw,
    topSpeedKmh: need(car, s.topSpeedKmh?.value, 'topSpeedKmh'),
    downforce: downforceSpecFor(car, p.downforceCapped),
    downforceDriven: p.downforceDriven,
    engine:
      p.engine && enginePowerKw
        ? {
            powerKw: enginePowerKw,
            torqueNm: need(car, s.engineTorqueNm?.value, 'engineTorqueNm'),
            redlineRpm: need(car, s.engineMaxRpm?.value, 'engineMaxRpm'),
            gears: need(car, s.gears?.value, 'gears'),
            ...p.engine,
          }
        : null,
    motor: motorKw ? { powerKw: motorKw, baseKmh: p.motorBaseKmh } : null,
  };
}

export function brakeInputFor(car: Car, p: ModelParams = MODEL[car.id]): BrakeInput {
  return {
    massKg: need(car, car.specs.kerbKg?.value, 'kerbKg') + DRIVER_KG,
    mu: p.muBrake,
    capG: p.brakeCapG,
    downforce: downforceSpecFor(car, p.downforceCapped),
  };
}
