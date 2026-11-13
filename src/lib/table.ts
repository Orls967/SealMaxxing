import type { CarId, MetricGroup } from '@/content/ids';
import { METRIC_BY_ID, METRIC_IDS, type Better } from '@/content/metrics';
import type { Car } from '@/content/types';
import { cellFor, derivedCell, rankCells, type Cell, type RowResult } from './compare';
import { DERIVED } from './derived';

export type RowGroup = MetricGroup | 'derived';

export interface TableRow {
  id: string;
  group: RowGroup;
  label: string;
  unit: string;
  digits: number;
  better: Better;
  note?: string;
  result: RowResult;
  /** Track-only variant values per base car, never ranked. */
  extreme: Partial<Record<CarId, Cell>>;
}

/** Every stored metric plus every derived metric, compared across the given cars. */
export function buildRows(cars: Car[]): TableRow[] {
  const stored = METRIC_IDS.map((id): TableRow => {
    const m = METRIC_BY_ID[id];
    const extreme: Partial<Record<CarId, Cell>> = {};
    for (const c of cars) {
      if (!c.extreme) continue;
      const data = c.extreme.specs[m.id];
      extreme[c.id] = data ? { kind: 'value', carId: c.id, data } : { kind: 'unknown', carId: c.id };
    }
    return {
      id: m.id,
      group: m.group,
      label: m.label,
      unit: m.unit,
      digits: m.digits ?? 0,
      better: m.better,
      result: rankCells(cars.map((c) => cellFor(c, m)), m.better, m.basisSensitive),
      extreme,
    };
  });
  const derived = DERIVED.map(
    (d): TableRow => ({
      id: d.id,
      group: 'derived',
      label: d.label,
      unit: d.unit,
      digits: d.digits,
      better: d.better,
      note: d.note,
      result: rankCells(cars.map((c) => derivedCell(c, d)), d.better),
      extreme: {},
    }),
  );
  return [...stored, ...derived];
}

export function filterRows(rows: TableRow[], query: string, group: string | null): TableRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter((r) => (!group || r.group === group) && (!q || r.label.toLowerCase().includes(q) || r.unit.toLowerCase().includes(q)));
}

/** Sorts by one car's value, largest first; rows where that car has no value keep their order at the end. */
export function sortRows(rows: TableRow[], carId: CarId | null): TableRow[] {
  if (!carId) return rows;
  const val = (r: TableRow): number | null => {
    const c = r.result.cells.find((x) => x.carId === carId);
    return c?.kind === 'value' ? c.data.value : null;
  };
  return rows
    .map((r, i) => ({ r, i, v: val(r) }))
    .sort((a, b) => (a.v === null && b.v === null ? a.i - b.i : a.v === null ? 1 : b.v === null ? -1 : b.v - a.v || a.i - b.i))
    .map((x) => x.r);
}
