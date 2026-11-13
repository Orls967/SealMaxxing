import { describe, expect, it } from 'vitest';
import { CAR_LIST, CARS } from '@/content/cars';
import { METRIC_BY_ID } from '@/content/metrics';
import { cellFor, compareMetric, normalise, rankCells } from './compare';

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
