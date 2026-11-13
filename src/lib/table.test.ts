import { describe, expect, it } from 'vitest';
import { CAR_LIST } from '@/content/cars';
import { METRICS } from '@/content/metrics';
import { DERIVED } from './derived';
import { buildRows, filterRows, sortRows } from './table';

const rows = buildRows(CAR_LIST);

describe('table rows', () => {
  it('has one row per stored and derived metric, each with a cell per car', () => {
    expect(rows).toHaveLength(METRICS.length + DERIVED.length);
    for (const r of rows) expect(r.result.cells).toHaveLength(4);
  });
  it('filters by text and group', () => {
    expect(filterRows(rows, 'baterai', null).map((r) => r.id)).toEqual(expect.arrayContaining(['batteryKwh', 'batteryKg', 'batteryWhPerKg']));
    expect(filterRows(rows, '', 'brakes').every((r) => r.group === 'brakes')).toBe(true);
    expect(filterRows(rows, 'zzz', null)).toHaveLength(0);
  });
  it('sorts by a car value and keeps rows without a value last', () => {
    const sorted = sortRows(rows, 'seal');
    const firstMissing = sorted.findIndex((r) => r.result.cells[0]!.kind !== 'value');
    expect(sorted.slice(firstMissing).every((r) => r.result.cells[0]!.kind !== 'value')).toBe(true);
    expect(sortRows(rows, null)).toBe(rows);
  });
  it('carries track-only variants without ranking them', () => {
    const power = rows.find((r) => r.id === 'powerTotalKw')!;
    expect(power.extreme.laferrari?.kind).toBe('value');
    expect(power.extreme.seal).toBeUndefined();
    expect(power.result.best).toEqual(['laferrari']);
  });
});
