import { describe, expect, it } from 'vitest';
import { CAR_LIST, CARS } from '@/content/cars';
import { METRIC_BY_ID } from '@/content/metrics';
import { cellFor, compareMetric, derivedCell, normalise, rankCells } from './compare';
import { DERIVED } from './derived';
import { fmt, fmtSourced, kwToPs } from './format';

describe('compare', () => {
  it('reports absent parts as absent, never as zero', () => {
    const cell = cellFor(CARS.senna, METRIC_BY_ID.batteryKwh);
    expect(cell.kind).toBe('absent');
    expect(cellFor(CARS.seal, METRIC_BY_ID.fuelTankL).kind).toBe('absent');
  });
  it('picks the highest power and lowest 0–100', () => {
    expect(compareMetric(CAR_LIST, METRIC_BY_ID.powerTotalKw).best).toEqual(['laferrari']);
    expect(compareMetric(CAR_LIST, METRIC_BY_ID.zeroTo100S).best.sort()).toEqual(['p1', 'senna']);
  });
  it('declares no winner when measurement bases differ', () => {
    const r = compareMetric(CAR_LIST, METRIC_BY_ID.evRangeKm);
    expect(r.best).toEqual([]);
    expect(r.noWinner).toBe('mixed-basis');
  });
  it('treats "pada N km/jam" bases as the same kind of basis', () => {
    const r = compareMetric(CAR_LIST, METRIC_BY_ID.downforceKg);
    expect(r.noWinner).not.toBe('no-direction');
  });
  it('declares no winner for directionless metrics or single values', () => {
    expect(compareMetric(CAR_LIST, METRIC_BY_ID.lengthMm).noWinner).toBe('no-direction');
    expect(rankCells([{ kind: 'unknown', carId: 'seal' }], 'higher').noWinner).toBe('single');
  });
  it('normalises to 0..1 with 1 as best', () => {
    expect(normalise([10, 5, null], 'higher')).toEqual([1, 0.5, null]);
    expect(normalise([2, 4], 'lower')).toEqual([1, 0.5]);
  });
});

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

describe('format', () => {
  it('uses Indonesian separators', () => {
    expect(fmt(4800)).toBe('4.800');
    expect(fmt(82.56, 2)).toBe('82,56');
  });
  it('adds qualifier prefixes and keeps years unseparated', () => {
    expect(
      fmtSourced({ value: 3, qualifier: 'lessThan', sources: ['spec'], verified: false }, 'dtk', 1),
    ).toBe('< 3,0 dtk');
    expect(fmtSourced({ value: 2013, sources: ['spec'], verified: true }, '')).toBe('2013');
  });
  it('converts kW to PS', () => {
    expect(kwToPs(588)).toBe(799);
    expect(kwToPs(390)).toBe(530);
  });
});
