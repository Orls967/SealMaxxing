import { Fragment } from 'react';
import type { CarId } from '@/content/ids';
import { GROUP_LABEL } from '@/content/labels';
import type { Car } from '@/content/types';
import { UI } from '@/content/ui';
import type { RowGroup, TableRow } from '@/lib/table';
import { MarkSwatch } from './charts/ChartDefs';
import { MetricValue } from './MetricValue';
import { SourceBadge } from './SourceBadge';

interface Props {
  cars: Car[];
  rows: TableRow[];
  extreme: boolean;
  sortBy: CarId | null;
  onSort: (id: CarId | null) => void;
}

const groupLabel = (g: RowGroup): string => (g === 'derived' ? UI.data.derived : GROUP_LABEL[g]);
const TH = 'border-b border-line bg-surface px-3 py-2 text-left align-bottom text-sm';
const TD = 'border-b border-line px-3 py-2 align-top text-sm';

/** Master table: rows = metrics grouped by system, columns = cars with their production years. */
export function DataTable({ cars, rows, extreme, sortBy, onSort }: Props) {
  const ext = extreme ? cars.filter((c) => c.extreme) : [];
  const span = 1 + cars.length + ext.length;
  const groups: RowGroup[] = [];
  for (const r of rows) if (sortBy === null && !groups.includes(r.group)) groups.push(r.group);
  const sections: { group: RowGroup | null; rows: TableRow[] }[] =
    sortBy === null ? groups.map((g) => ({ group: g, rows: rows.filter((r) => r.group === g) })) : [{ group: null, rows }];
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse">
        <caption className="sr-only">{UI.data.lead}</caption>
        <thead>
          <tr>
            <th scope="col" className={TH}>
              {UI.common.metric}
            </th>
            {cars.map((c) => (
              <th key={c.id} scope="col" className={TH} aria-sort={sortBy === c.id ? 'descending' : 'none'}>
                <span className="flex items-center gap-2 font-semibold">
                  <MarkSwatch id={c.id} />
                  {c.short}
                </span>
                <span className="block text-xs font-normal text-muted">{c.years}</span>
                <button
                  type="button"
                  aria-pressed={sortBy === c.id}
                  onClick={() => onSort(sortBy === c.id ? null : c.id)}
                  className={`mt-1 rounded border px-1 text-xs font-normal ${sortBy === c.id ? 'border-accent text-accent-text' : 'border-line text-muted hover:text-text'}`}
                >
                  {sortBy === c.id ? UI.data.sortNone : UI.data.sortBy(c.short)}
                </button>
              </th>
            ))}
            {ext.map((c) => (
              <th key={c.id} scope="col" className={TH}>
                <span className="block font-semibold">{c.extreme?.name}</span>
                <span className="rounded border border-warn px-1 text-xs font-normal text-warn">{UI.common.trackOnly}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortBy === null && (
            <>
              <tr>
                <th scope="row" className={`${TD} text-left font-medium`}>
                  {UI.data.price}
                </th>
                {cars.map((c) => (
                  <td key={c.id} className={TD}>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{c.price.value}</span>
                      <SourceBadge verified={c.price.verified} />
                    </span>
                  </td>
                ))}
                {ext.map((c) => (
                  <td key={c.id} className={`${TD} text-muted`}>
                    {c.extreme?.note}
                  </td>
                ))}
              </tr>
            </>
          )}
          {sections.map((sec) => (
            <Fragment key={sec.group ?? 'sorted'}>
              {sec.group && (
                <tr>
                  <th scope="colgroup" colSpan={span} className="border-b border-line bg-surface-2 px-3 py-1 text-left text-xs font-semibold uppercase tracking-wide text-accent-text">
                    {groupLabel(sec.group)}
                    {sec.group === 'derived' && <span className="ml-2 font-normal normal-case text-muted">{UI.data.derivedNote}</span>}
                  </th>
                </tr>
              )}
              {sec.rows.map((r) => (
                <tr key={r.id}>
                  <th scope="row" className={`${TD} text-left font-medium`}>
                    {r.label}
                    {r.unit && <span className="font-normal text-muted"> ({r.unit})</span>}
                    {r.note && <span className="block text-xs font-normal text-muted">{r.note}</span>}
                    {r.result.noWinner === 'mixed-basis' && <span className="block text-xs font-normal text-warn">{UI.common.noWinnerBasis}</span>}
                  </th>
                  {r.result.cells.map((cell) => (
                    <td key={cell.carId} className={TD}>
                      <MetricValue cell={cell} unit={r.unit} digits={r.digits} best={r.result.best.includes(cell.carId)} ps={r.id !== 'dcChargeKw'} />
                    </td>
                  ))}
                  {ext.map((c) => {
                    const cell = r.extreme[c.id];
                    return (
                      <td key={c.id} className={TD}>
                        {cell?.kind === 'value' ? <MetricValue cell={cell} unit={r.unit} digits={r.digits} /> : <span className="text-muted">–</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </Fragment>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={span} className={`${TD} text-muted`}>
                {UI.data.empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
