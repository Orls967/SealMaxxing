import { describe, expect, it } from 'vitest';
import { CAR_LIST, CARS } from '@/content/cars';
import { simulateAccel } from './accel';
import { accelInputFor, brakeInputFor, DRIVER_KG } from './params';

describe('simulation calibration', () => {
  it.each(CAR_LIST)('$id: modelled 0–100 and 0–200 are within ±5% of the claims', (car) => {
    const r = simulateAccel(accelInputFor(car), 30);
    const t100 = r.toSpeed(100);
    expect(t100).not.toBeNull();
    expect(Math.abs(t100! / car.specs.zeroTo100S!.value - 1)).toBeLessThan(0.05);
    const claim200 = car.specs.zeroTo200S?.value;
    if (claim200 === undefined) {
      // No claim because the car never gets there: the model must agree.
      expect(r.toSpeed(200)).toBeNull();
    } else {
      expect(Math.abs(r.toSpeed(200)! / claim200 - 1)).toBeLessThan(0.05);
    }
  });
  it('0–300 lands within 10% of the claims without being calibrated to them', () => {
    for (const id of ['laferrari', 'p1', 'senna'] as const) {
      const car = CARS[id];
      const t = simulateAccel(accelInputFor(car), 40).toSpeed(300)!;
      expect(Math.abs(t / car.specs.zeroTo300S!.value - 1)).toBeLessThan(0.1);
    }
  });
  it('builds inputs from published specs plus a driver', () => {
    const inp = accelInputFor(CARS.p1);
    expect(inp.massKg).toBe(1490 + DRIVER_KG);
    expect(inp.engine?.gears).toBe(7);
    expect(inp.motor?.powerKw).toBe(132);
    expect(accelInputFor(CARS.seal).engine).toBeNull();
    expect(accelInputFor(CARS.senna).motor).toBeNull();
    expect(brakeInputFor(CARS.seal).downforce).toBeNull();
  });
});
