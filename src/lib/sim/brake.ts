import { downforceKg, type DownforceSpec } from './downforce';

const G = 9.81;
const KMH = 3.6;

export interface BrakeInput {
  massKg: number;
  /** Tyre grip under braking (model parameter). */
  mu: number;
  /** Brake system limit in g. */
  capG: number;
  downforce: DownforceSpec | null;
}

export interface BrakeResult {
  distanceM: number;
  timeS: number;
  /** Peak deceleration in g. */
  peakG: number;
  /** Stopping distance with downforce switched off, to show its contribution. */
  distanceNoAeroM: number;
  samples: { t: number; v: number; x: number }[];
}

function run(inp: BrakeInput, fromKmh: number, aero: boolean) {
  const dt = 0.001;
  let v = fromKmh / KMH;
  let x = 0;
  let t = 0;
  let peak = 0;
  const samples = [{ t: 0, v: fromKmh, x: 0 }];
  let i = 0;
  while (v > 0 && t < 60) {
    const df = aero ? downforceKg(inp.downforce, v * KMH) : 0;
    // deceleration = μ × (g + downforce ÷ mass), limited by brake capacity
    const a = Math.min(inp.mu * (G + (df * G) / inp.massKg), inp.capG * G);
    peak = Math.max(peak, a / G);
    const next = Math.max(0, v - a * dt);
    x += ((v + next) / 2) * dt;
    v = next;
    t += dt;
    if (++i % 10 === 0 || v === 0) samples.push({ t, v: v * KMH, x });
  }
  return { distanceM: x, timeS: t, peakG: peak, samples };
}

export function simulateBrake(inp: BrakeInput, fromKmh: number): BrakeResult {
  const withAero = run(inp, fromKmh, true);
  return { ...withAero, distanceNoAeroM: run(inp, fromKmh, false).distanceM };
}
