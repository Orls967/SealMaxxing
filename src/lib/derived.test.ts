import { describe, expect, it } from 'vitest';
import { CARS } from '@/content/cars';
import { derivedCell } from './compare';
import { DERIVED } from './derived';

describe('derived', () => {
  const get = (id: string) => DERIVED.find((d) => d.id === id)!;
  it('computes power per tonne from kerb weight', () => {
    const v = get('powerPerTonneKw').get(CARS.p1)!;
    expect(v.value).toBeCloseTo(674 / 1.49, 3);
  });
  it('Senna matches P1 on power per tonne with far less power; Seal is lowest', () => {
    const f = (id: 'seal' | 'p1' | 'senna') => get('powerPerTonneKw').get(CARS[id])!.value;
    expect(Math.abs(f('senna') - f('p1')) / f('p1')).toBeLessThan(0.02);
    expect(f('seal')).toBeLessThan(f('p1') / 2);
  });
  it('electric share is 100% for the BEV and 0 for the pure ICE car', () => {
    expect(get('electricSharePct').get(CARS.seal)!.value).toBe(100);
    expect(get('electricSharePct').get(CARS.senna)!.value).toBe(0);
  });
  it('is unverified when any input is unverified', () => {
    expect(get('powerPerTonneKw').get(CARS.senna)!.verified).toBe(false);
  });
  it('reports a derived metric as absent when its input does not exist on the car', () => {
    expect(derivedCell(CARS.senna, get('batteryWhPerKg')).kind).toBe('absent');
    expect(derivedCell(CARS.seal, get('batteryWhPerKg')).kind).toBe('unknown');
    expect(derivedCell(CARS.p1, get('batteryWhPerKg')).kind).toBe('value');
  });
  it('returns null when an input is missing', () => {
    expect(get('batteryWhPerKg').get(CARS.senna)).toBeNull();
  });
});
