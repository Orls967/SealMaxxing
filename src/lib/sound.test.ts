import { describe, expect, it } from 'vitest';
import { CARS } from '@/content/cars';
import { RESPONSE, firingHz, rpmAt, soundProfileFor, stepLevel } from './sound';

describe('sound', () => {
  it('derives the firing frequency from revs and cylinder count', () => {
    expect(firingHz(6000, 12)).toBe(600);
    expect(firingHz(6000, 8)).toBe(400);
    expect(firingHz(0, 8)).toBe(0);
  });

  it('maps the throttle level onto the rev range and clamps it', () => {
    expect(rpmAt(0, 1000, 9000)).toBe(1000);
    expect(rpmAt(1, 1000, 9000)).toBe(9000);
    expect(rpmAt(0.5, 1000, 9000)).toBe(5000);
    expect(rpmAt(2, 1000, 9000)).toBe(9000);
    expect(rpmAt(-1, 1000, 9000)).toBe(1000);
  });

  it('builds each profile from published specs: no engine means an electric note', () => {
    expect(soundProfileFor(CARS.seal)).toEqual({ kind: 'ev' });
    const laf = soundProfileFor(CARS.laferrari);
    expect(laf).toMatchObject({ kind: 'ice', cylinders: 12, turbo: false, electric: true });
    expect(soundProfileFor(CARS.p1)).toMatchObject({
      kind: 'ice',
      cylinders: 8,
      turbo: true,
      electric: true,
    });
    expect(soundProfileFor(CARS.senna)).toMatchObject({
      kind: 'ice',
      cylinders: 8,
      turbo: true,
      electric: false,
    });
    if (laf.kind === 'ice') expect(laf.maxRpm).toBe(CARS.laferrari.specs.engineMaxRpm?.value);
  });

  it('revs up while the pedal is held and falls back when released, within 0..1', () => {
    const r = RESPONSE.ice;
    expect(stepLevel(0, true, r.riseS / 2, r)).toBeCloseTo(0.5);
    expect(stepLevel(0.9, true, 10, r)).toBe(1);
    expect(stepLevel(1, false, r.fallS / 4, r)).toBeCloseTo(0.75);
    expect(stepLevel(0.1, false, 10, r)).toBe(0);
    expect(stepLevel(0.4, true, -1, r)).toBe(0.4);
  });
});
