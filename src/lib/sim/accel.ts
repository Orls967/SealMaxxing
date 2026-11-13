import { downforceKg, type DownforceSpec } from './downforce';

const G = 9.81;
const RHO = 1.225;
const KMH = 3.6;

export interface EngineInput {
  powerKw: number;
  powerRpm: number;
  torqueNm: number;
  torqueRpm: number;
  redlineRpm: number;
  gears: number;
  /** Road speed at the redline in first gear. */
  firstGearKmh: number;
  /** Time without engine drive during each shift. */
  shiftS: number;
  launchRpm: number;
}

export interface MotorInput {
  powerKw: number;
  /** Below this speed the motor is torque-limited (constant force). */
  baseKmh: number;
}

export interface AccelInput {
  massKg: number;
  drive: 'awd' | 'rwd';
  /** Static weight fraction on the driven axle (RWD only). */
  drivenFraction: number;
  cgHeightM: number;
  wheelbaseM: number;
  /** Tyre grip coefficient (calibrated). */
  mu: number;
  /** Driveline efficiency including losses not modelled (calibrated). */
  eff: number;
  cdA: number;
  crr: number;
  /** Combined system power: the sum of engine and motor never exceeds it. */
  powerTotalKw: number;
  topSpeedKmh: number;
  downforce: DownforceSpec | null;
  /** Share of downforce acting on the driven axle. */
  downforceDriven: number;
  engine: EngineInput | null;
  motor: MotorInput | null;
  /**
   * Seconds for thrust to build from zero to full at launch: clutch take-up and boost for a
   * combustion car, close to nothing for electric motors.
   */
  launchS: number;
}

export interface AccelSample {
  t: number;
  /** km/h */
  v: number;
  /** m */
  x: number;
}

export interface AccelResult {
  /** One sample every 10 ms. */
  samples: AccelSample[];
  /** Seconds to reach a speed (km/h), or null when the car never gets there. */
  toSpeed: (kmh: number) => number | null;
  /** Seconds to cover a distance (m). */
  toDistance: (m: number) => number | null;
}

/** Engine torque approximated from the peak-torque and peak-power points. */
export function engineTorque(e: EngineInput, rpm: number): number {
  const tAtPower = (e.powerKw * 1000) / ((e.powerRpm * 2 * Math.PI) / 60);
  if (rpm <= e.torqueRpm) return e.torqueNm * (0.8 + (0.2 * Math.max(0, rpm)) / e.torqueRpm);
  if (rpm <= e.powerRpm) {
    const f = (rpm - e.torqueRpm) / Math.max(1, e.powerRpm - e.torqueRpm);
    return e.torqueNm + (tAtPower - e.torqueNm) * f;
  }
  const f = Math.min(1, (rpm - e.powerRpm) / Math.max(1, e.redlineRpm - e.powerRpm));
  return tAtPower * (1 - 0.2 * f);
}

/** Road speed (km/h) at the redline for each gear: geometric spacing from first to top. */
export function gearTops(e: EngineInput, topSpeedKmh: number): number[] {
  const last = topSpeedKmh * 1.04;
  return Array.from({ length: e.gears }, (_, i) =>
    e.gears === 1 ? last : e.firstGearKmh * (last / e.firstGearKmh) ** (i / (e.gears - 1)),
  );
}

function engineForce(e: EngineInput, tops: number[], gear: number, v: number): number {
  const top = (tops[gear] ?? 1) / KMH;
  const rpm = Math.max(e.launchRpm, (e.redlineRpm * v) / top);
  if (rpm > e.redlineRpm) return 0;
  return (engineTorque(e, rpm) * ((e.redlineRpm * 2 * Math.PI) / 60)) / top;
}

function interp(samples: AccelSample[], key: 'v' | 'x', target: number): number | null {
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1]!;
    const b = samples[i]!;
    if (b[key] >= target) {
      const span = b[key] - a[key];
      return span <= 0 ? b.t : a.t + ((target - a[key]) / span) * (b.t - a.t);
    }
  }
  return null;
}

/**
 * Straight-line acceleration from rest, 1 ms steps.
 * Thrust = min(traction, drive); resistance = ½ρ·CdA·v² + rolling.
 */
export function simulateAccel(inp: AccelInput, maxT = 45): AccelResult {
  const dt = 0.001;
  const e = inp.engine;
  const tops = e ? gearTops(e, inp.topSpeedKmh) : [];
  const vMax = inp.topSpeedKmh / KMH;
  const samples: AccelSample[] = [{ t: 0, v: 0, x: 0 }];
  let v = 0;
  let x = 0;
  let gear = 0;
  let shiftLeft = 0;
  const steps = Math.round(maxT / dt);
  for (let i = 1; i <= steps; i++) {
    const kmh = v * KMH;
    const df = downforceKg(inp.downforce, kmh) * G;
    let fEngine = 0;
    if (e) {
      // Shift up when the next gear pulls harder, or at the redline.
      while (gear < e.gears - 1 && engineForce(e, tops, gear + 1, v) > engineForce(e, tops, gear, v)) {
        gear++;
        shiftLeft = e.shiftS;
      }
      if (shiftLeft > 0) shiftLeft -= dt;
      else fEngine = engineForce(e, tops, gear, v);
    }
    const m = inp.motor;
    const fMotor = m ? (m.powerKw * 1000) / Math.max(v, m.baseKmh / KMH) : 0;
    const fCap = v > 0.5 ? (inp.powerTotalKw * 1000) / v : Infinity;
    const drive = Math.min(fEngine + fMotor, fCap) * inp.eff;
    const traction =
      inp.drive === 'awd'
        ? inp.mu * (inp.massKg * G + df)
        : (inp.mu * (inp.massKg * G * inp.drivenFraction + df * inp.downforceDriven)) /
          (1 - (inp.mu * inp.cgHeightM) / inp.wheelbaseM);
    const resist = 0.5 * RHO * inp.cdA * v * v + inp.crr * (inp.massKg * G + df);
    const build = inp.launchS > 0 ? Math.min(1, (i * dt) / inp.launchS) : 1;
    const a = v >= vMax ? 0 : (Math.min(traction, drive) * build - resist) / inp.massKg;
    v = Math.min(vMax, Math.max(0, v + a * dt));
    x += v * dt;
    if (i % 10 === 0) samples.push({ t: i * dt, v: v * KMH, x });
  }
  return {
    samples,
    toSpeed: (kmh) => (kmh > inp.topSpeedKmh + 1e-6 ? null : interp(samples, 'v', kmh)),
    toDistance: (m) => interp(samples, 'x', m),
  };
}
