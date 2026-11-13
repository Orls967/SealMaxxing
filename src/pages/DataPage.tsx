import { useMemo, useState } from 'react';
import { CAR_LIST } from '@/content/cars';
import { METRIC_GROUPS, type CarId } from '@/content/ids';
import { GROUP_LABEL } from '@/content/labels';
import { SOURCES } from '@/content/sources';
import { UI } from '@/content/ui';
import { cellText, toCsv } from '@/lib/csv';
import { radarProfile } from '@/lib/radar';
import { downforceKg, downforceSpecFor } from '@/lib/sim/downforce';
import { MODEL } from '@/lib/sim/params';
import { buildRows, filterRows, sortRows } from '@/lib/table';
import { useView } from '@/store/view';
import { LineChart, type Series } from '@/ui/charts/LineChart';
import { RadarChart } from '@/ui/charts/RadarChart';
import { ScatterChart, type ScatterPoint } from '@/ui/charts/ScatterChart';
import { CompareRow } from '@/ui/CompareRow';
import { DataTable } from '@/ui/DataTable';
import { downloadText } from '@/ui/downloadText';

const CARS_ALL = CAR_LIST;
const SPEEDS = Array.from({ length: 36 }, (_, i) => i * 10);
/** Byte-order mark so spreadsheet apps read the CSV as UTF-8. */
const BOM = String.fromCharCode(0xfeff);
const FIELD = 'rounded border border-line bg-surface-2 px-2 py-1 text-sm text-text';

export default function DataPage() {
  const query = useView((s) => s.query);
  const group = useView((s) => s.group);
  const extreme = useView((s) => s.extreme);
  const metric = useView((s) => s.metric);
  const set = useView((s) => s.set);
  const [sortBy, setSortBy] = useState<CarId | null>(null);

  const all = useMemo(() => buildRows(CARS_ALL), []);
  const rows = useMemo(() => sortRows(filterRows(all, query, group), sortBy), [all, query, group, sortBy]);
  const chartRow = all.find((r) => r.id === metric) ?? all.find((r) => r.id === 'powerTotalKw');
  const unverified = all.reduce(
    (n, r) => n + r.result.cells.filter((c) => c.kind === 'value' && !c.data.verified).length,
    0,
  );

  const radar = useMemo(
    () => radarProfile(CARS_ALL).map((r) => ({ label: UI.data.radarAxes[r.key], values: r.values })),
    [],
  );
  const scatter = useMemo(
    () =>
      CARS_ALL.flatMap((c): ScatterPoint[] => {
        const m = c.specs.kerbKg;
        const p = c.specs.powerTotalKw;
        return m && p ? [{ carId: c.id, x: m.value, y: p.value, verified: m.verified && p.verified }] : [];
      }),
    [],
  );
  const dfSeries = useMemo(
    () =>
      CARS_ALL.map((c): Series => {
        const spec = downforceSpecFor(c, MODEL[c.id].downforceCapped);
        return spec
          ? { carId: c.id, points: SPEEDS.map((v) => [v, downforceKg(spec, v)]) }
          : { carId: c.id, points: [], absent: UI.dissect.absentTag };
      }),
    [],
  );

  const exportCsv = () => {
    const labels = { absent: UI.common.absent, unknown: UI.common.unknown, unverified: UI.common.unverified };
    const ext = extreme ? CARS_ALL.filter((c) => c.extreme) : [];
    const head = [
      UI.common.metric,
      ...CARS_ALL.map((c) => `${c.name} (${c.years})`),
      ...ext.map((c) => `${c.extreme?.name ?? ''} (${UI.common.trackOnly})`),
    ];
    const body = rows.map((r) => [
      r.unit ? `${r.label} (${r.unit})` : r.label,
      ...r.result.cells.map((c) => cellText(c, r.unit, r.digits, labels)),
      ...ext.map((c) => {
        const cell = r.extreme[c.id];
        return cell ? cellText(cell, r.unit, r.digits, { ...labels, unknown: '' }) : '';
      }),
    ]);
    downloadText('sealmaxxing-data.csv', 'text/csv;charset=utf-8', `${BOM}${toCsv([head, ...body])}`);
  };

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide">{UI.data.title}</h1>
        <p className="text-sm text-muted">{UI.data.lead}</p>
        <p className="mt-1 text-xs text-warn">{UI.data.unverifiedCount(unverified)}</p>
      </header>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-line bg-surface p-3 text-sm">
        <label className="flex flex-col gap-1">
          {UI.data.search}
          <input
            type="search"
            className={FIELD}
            value={query}
            onChange={(e) => set({ query: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1">
          {UI.data.group}
          <select
            className={FIELD}
            value={group ?? ''}
            onChange={(e) => set({ group: e.target.value || null })}
          >
            <option value="">{UI.common.all}</option>
            {METRIC_GROUPS.map((g) => (
              <option key={g} value={g}>
                {GROUP_LABEL[g]}
              </option>
            ))}
            <option value="derived">{UI.data.derived}</option>
          </select>
        </label>
        <label className="flex items-center gap-2 py-1">
          <input type="checkbox" checked={extreme} onChange={(e) => set({ extreme: e.target.checked })} />
          {UI.data.extreme}
        </label>
        <button
          type="button"
          onClick={exportCsv}
          className="ml-auto rounded bg-accent px-3 py-1.5 font-semibold text-text hover:bg-accent-dim"
        >
          {UI.data.export}
        </button>
      </div>

      <DataTable cars={CARS_ALL} rows={rows} extreme={extreme} sortBy={sortBy} onSort={setSortBy} />

      <section aria-labelledby="grafik" className="flex flex-col gap-3">
        <h2 id="grafik" className="font-display text-2xl font-bold uppercase tracking-wide">
          {UI.data.charts}
        </h2>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-sm">
              {UI.data.chartMetric}
              <select
                className={FIELD}
                value={chartRow?.id ?? ''}
                onChange={(e) => set({ metric: e.target.value })}
              >
                {all.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            {chartRow && (
              <CompareRow
                label={chartRow.label}
                unit={chartRow.unit}
                digits={chartRow.digits}
                cars={CARS_ALL}
                result={chartRow.result}
                note={chartRow.note}
              />
            )}
          </div>
          <ScatterChart
            title={UI.data.scatter}
            xLabel={UI.data.weight}
            yLabel={UI.data.power}
            points={scatter}
            note={UI.data.scatterNote}
          />
          <RadarChart
            title={UI.data.radar}
            axes={radar}
            cars={CARS_ALL.map((c) => c.id)}
            note={`${UI.data.radarNote} ${UI.data.dailyNote}`}
          />
          <div className="flex flex-col gap-1">
            <LineChart
              title={UI.data.downforce}
              xLabel={UI.duel.axisSpeed}
              yLabel={UI.duel.axisForce}
              series={dfSeries}
              tableXs={[100, 150, 200, 250, 300, 350]}
            />
            <p className="text-xs text-muted">
              <span className="rounded border border-line px-1">{UI.common.estimate}</span>{' '}
              {UI.data.downforceNote}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="sumber">
        <h2 id="sumber" className="mb-2 font-display text-2xl font-bold uppercase tracking-wide">
          {UI.data.sourcesTitle}
        </h2>
        <ul className="grid gap-x-6 gap-y-1 text-sm md:grid-cols-2">
          {Object.entries(SOURCES).map(([id, s]) => (
            <li key={id}>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text underline decoration-accent underline-offset-2"
                >
                  {s.title}
                </a>
              ) : (
                <span className="text-text">{s.title}</span>
              )}
              <span className="text-muted">
                {' '}
                · {s.publisher} · {UI.data.accessed} {s.accessed}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
