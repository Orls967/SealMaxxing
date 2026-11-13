import { describe, expect, it } from 'vitest';
import { CAR_LIST } from '@/content/cars';
import { RADAR_KEYS, radarProfile } from './radar';

const p = radarProfile(CAR_LIST);
const row = (k: (typeof RADAR_KEYS)[number]) => p.find((r) => r.key === k)!.values;

describe('radar profile', () => {
  it('has every axis with values in 0..1 or null', () => {
    expect(p.map((r) => r.key)).toEqual([...RADAR_KEYS]);
    for (const r of p)
      for (const v of Object.values(r.values)) {
        if (v === null) continue;
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
  });
  it('downforce is not applicable to the Seal instead of zero', () => {
    expect(row('downforce').seal).toBeNull();
    expect(row('downforce').senna).toBe(1);
  });
  it('the sedan wins daily practicality and the hypercars win acceleration', () => {
    expect(row('daily').seal).toBe(1);
    expect(row('accel').seal).toBeLessThan(1);
    expect(row('accel').p1).toBe(1);
  });
});
