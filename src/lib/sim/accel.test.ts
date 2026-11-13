import { describe, expect, it } from 'vitest';
import { CARS } from '@/content/cars';
import { engineTorque, gearTops, simulateAccel } from './accel';
import { accelInputFor } from './params';

const run = (id: keyof typeof CARS) => simulateAccel(accelInputFor(CARS[id]), 30);

describe('acceleration model', () => {
  it('the AWD electric car leads off the line, then falls far behind', () => {
    const seal = run('seal');
    const senna = run('senna');
    const at = (r: typeof seal, t: number) => r.samples[Math.round(t * 100)]!.x;
    // Instant electric thrust on four wheels: ahead of all three hypercars for the first second.
    for (const id of ['laferrari', 'p1', 'senna'] as const) {
      expect(at(seal, 0.5)).toBeGreaterThan(at(run(id), 0.5));
      expect(at(seal, 1)).toBeGreaterThan(at(run(id), 1));
      expect(at(run(id), 3)).toBeGreaterThan(at(seal, 3));
    }
    expect(at(senna, 8) - at(seal, 8)).toBeGreaterThan(60);
  });
  it('respects a limited top speed and reports unreachable speeds as null', () => {
    const seal = run('seal');
    expect(Math.max(...seal.samples.map((s) => s.v))).toBeLessThanOrEqual(180.001);
    expect(seal.toSpeed(200)).toBeNull();
    expect(seal.toDistance(402)).not.toBeNull();
  });
  it('distance never decreases and speed only dips slightly during a shift', () => {
    const r = run('laferrari');
    for (let i = 1; i < r.samples.length; i++) {
      expect(r.samples[i]!.v).toBeGreaterThan(r.samples[i - 1]!.v - 0.05);
      expect(r.samples[i]!.x).toBeGreaterThanOrEqual(r.samples[i - 1]!.x);
    }
  });
  it('torque curve passes through the peak-torque and peak-power points', () => {
    const e = accelInputFor(CARS.senna).engine!;
    expect(engineTorque(e, e.torqueRpm)).toBeCloseTo(e.torqueNm);
    expect((engineTorque(e, e.powerRpm) * e.powerRpm * 2 * Math.PI) / 60 / 1000).toBeCloseTo(e.powerKw);
  });
  it('spaces gears geometrically up to just past top speed', () => {
    const e = accelInputFor(CARS.p1).engine!;
    const tops = gearTops(e, 350);
    expect(tops).toHaveLength(7);
    expect(tops[0]).toBeCloseTo(e.firstGearKmh);
    expect(tops[6]).toBeCloseTo(364);
    expect(tops[2]! / tops[1]!).toBeCloseTo(tops[1]! / tops[0]!);
  });
});
