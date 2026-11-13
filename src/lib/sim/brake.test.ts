import { describe, expect, it } from 'vitest';
import { CARS } from '@/content/cars';
import { simulateBrake } from './brake';
import { brakeInputFor } from './params';

describe('braking model', () => {
  it('matches v²/2μg when there is no downforce', () => {
    const r = simulateBrake({ massKg: 2000, mu: 1, capG: 5, downforce: null }, 100);
    expect(r.distanceM).toBeCloseTo((100 / 3.6) ** 2 / (2 * 9.81), 1);
    expect(r.distanceNoAeroM).toBeCloseTo(r.distanceM, 6);
    expect(r.peakG).toBeCloseTo(1);
  });
  it('downforce shortens the stop, more so from higher speed', () => {
    const inp = brakeInputFor(CARS.senna);
    const r100 = simulateBrake(inp, 100);
    const r200 = simulateBrake(inp, 200);
    expect(r100.distanceM).toBeLessThan(r100.distanceNoAeroM);
    expect(1 - r200.distanceM / r200.distanceNoAeroM).toBeGreaterThan(1 - r100.distanceM / r100.distanceNoAeroM);
  });
  it('is limited by brake capacity', () => {
    const r = simulateBrake({ massKg: 1000, mu: 3, capG: 1.5, downforce: null }, 100);
    expect(r.peakG).toBeCloseTo(1.5);
  });
  it('the heavy sedan needs the longest distance', () => {
    const d = (id: keyof typeof CARS) => simulateBrake(brakeInputFor(CARS[id]), 100).distanceM;
    expect(d('seal')).toBeGreaterThan(d('laferrari'));
    expect(d('laferrari')).toBeGreaterThan(d('senna'));
  });
});
