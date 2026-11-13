import { describe, expect, it } from 'vitest';
import { CARS } from '@/content/cars';
import { downforceKg, downforceSpecFor, parseRefSpeed } from './downforce';

describe('downforce', () => {
  it('reads the reference speed from the basis text', () => {
    expect(parseRefSpeed('pada 257 km/jam, mode Race')).toBe(257);
    expect(parseRefSpeed('maksimum')).toBeNull();
    expect(parseRefSpeed(undefined)).toBeNull();
  });
  it('reproduces the claim at the reference speed and scales with v²', () => {
    const s = downforceSpecFor(CARS.senna, false)!;
    expect(downforceKg(s, 250)).toBeCloseTo(800);
    expect(downforceKg(s, 125)).toBeCloseTo(200);
    expect(downforceKg(s, 0)).toBe(0);
  });
  it('caps at the claim when active aero limits it', () => {
    const s = downforceSpecFor(CARS.p1, true)!;
    expect(downforceKg(s, 300)).toBe(600);
    expect(downforceKg(s, 128.5)).toBeCloseTo(150);
  });
  it('is absent (null spec, zero force) for a car not designed for downforce', () => {
    expect(downforceSpecFor(CARS.seal, false)).toBeNull();
    expect(downforceKg(null, 200)).toBe(0);
  });
});
