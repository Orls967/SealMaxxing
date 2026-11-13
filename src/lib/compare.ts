import type { CarId } from '@/content/ids';
import type { Better, Metric } from '@/content/metrics';
import type { Car, Sourced } from '@/content/types';
import type { DerivedMetric } from './derived';

export type Cell =
  | { kind: 'value'; carId: CarId; data: Sourced }
  | { kind: 'absent'; carId: CarId; reason: string }
  | { kind: 'unknown'; carId: CarId };

export function cellFor(car: Car, metric: Pick<Metric, 'id'>): Cell {
  const data = car.specs[metric.id];
  if (data) return { kind: 'value', carId: car.id, data };
  const reason = car.absent[metric.id];
  if (reason) return { kind: 'absent', carId: car.id, reason };
  return { kind: 'unknown', carId: car.id };
}

/** Speed-style bases ("pada 250 km/jam") differ per car but name the same kind of measurement. */
function basisKey(basis: string | undefined): string {
  return (basis ?? '')
    .replace(/[\d.,]+/g, '#')
    .trim()
    .toLowerCase();
}

export interface RowResult {
  cells: Cell[];
  /** Largest value among value cells, for bar scaling. */
  max: number;
  /** Car ids holding the best value; empty when no winner may be declared. */
  best: CarId[];
  /** Why no winner is declared, when applicable. */
  noWinner?: 'mixed-basis' | 'no-direction' | 'single';
}

export function rankCells(cells: Cell[], better: Better, basisSensitive = false): RowResult {
  const values = cells.filter((c): c is Extract<Cell, { kind: 'value' }> => c.kind === 'value');
  const max = values.reduce((m, c) => Math.max(m, c.data.value), 0);
  if (better === 'none') return { cells, max, best: [], noWinner: 'no-direction' };
  if (values.length < 2) return { cells, max, best: [], noWinner: 'single' };
  if (basisSensitive) {
    const keys = new Set(values.map((c) => basisKey(c.data.basis)));
    if (keys.size > 1) return { cells, max, best: [], noWinner: 'mixed-basis' };
  }
  const target =
    better === 'higher'
      ? Math.max(...values.map((c) => c.data.value))
      : Math.min(...values.map((c) => c.data.value));
  return { cells, max, best: values.filter((c) => c.data.value === target).map((c) => c.carId) };
}

export function compareMetric(cars: Car[], metric: Metric): RowResult {
  return rankCells(
    cars.map((c) => cellFor(c, metric)),
    metric.better,
    metric.basisSensitive,
  );
}

/** 0..1 score for radar charts; 1 = best among the given cars. */
export function normalise(values: (number | null)[], better: 'higher' | 'lower'): (number | null)[] {
  const nums = values.filter((v): v is number => v !== null);
  if (nums.length === 0) return values.map(() => null);
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  return values.map((v) => {
    if (v === null) return null;
    if (better === 'higher') return max === 0 ? 0 : v / max;
    return v === 0 ? 1 : min / v;
  });
}

/** Cell for a computed metric: absent when an input does not exist on the car, unknown when one is unpublished. */
export function derivedCell(car: Car, d: DerivedMetric): Cell {
  const data = d.get(car);
  if (data) return { kind: 'value', carId: car.id, data };
  for (const id of d.inputs) {
    const reason = car.absent[id];
    if (reason) return { kind: 'absent', carId: car.id, reason };
  }
  return { kind: 'unknown', carId: car.id };
}
