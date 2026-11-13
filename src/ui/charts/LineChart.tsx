import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { CAR_MARKS } from '@/content/carMarks';
import { CARS } from '@/content/cars';
import type { CarId } from '@/content/ids';
import { UI } from '@/content/ui';
import { fmt } from '@/lib/format';

export interface Series {
  carId: CarId;
  points: [number, number][];
  /** Shown instead of a line when the car has nothing to plot. */
  absent?: string;
}

interface Props {
  title: string;
  xLabel: string;
  yLabel: string;
  series: Series[];
  /** X positions listed in the equivalent table. */
  tableXs: number[];
  /** Vertical marker (e.g. the current time or speed). */
  cursor?: number;
  digits?: number;
}

const W = 640;
const H = 300;
const M = { l: 52, r: 86, t: 12, b: 38 };
const DASH: Record<CarId, string> = { seal: '', laferrari: '8 4', p1: '2 4', senna: '10 3 2 3' };

function valueAt(points: [number, number][], x: number): number | null {
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    if (x >= a[0] && x <= b[0]) return b[0] === a[0] ? b[1] : a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
  }
  return null;
}

/** Line chart with direct labels, a dash pattern per car, and an equivalent table. */
export function LineChart({ title, xLabel, yLabel, series, tableXs, cursor, digits = 0 }: Props) {
  const all = series.flatMap((s) => s.points);
  const xMax = Math.max(1, ...all.map((p) => p[0]));
  const yMax = Math.max(1, ...all.map((p) => p[1]));
  const x = scaleLinear().domain([0, xMax]).range([M.l, W - M.r]);
  const y = scaleLinear().domain([0, yMax]).nice().range([H - M.b, M.t]);
  const path = line<[number, number]>()
    .x((p) => x(p[0]))
    .y((p) => y(p[1]));
  // Spread direct labels so they never overlap.
  const labels = series
    .filter((s) => s.points.length > 0)
    .map((s) => ({ id: s.carId, y: y(s.points[s.points.length - 1]![1]) }))
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i++) labels[i]!.y = Math.max(labels[i]!.y, labels[i - 1]!.y + 13);
  return (
    <figure className="rounded-lg border border-line bg-surface p-3">
      <figcaption className="mb-1 text-sm font-semibold">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="w-full">
        {y.ticks(5).map((t) => (
          <g key={t}>
            <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} className="stroke-line" />
            <text x={M.l - 6} y={y(t) + 4} textAnchor="end" className="tnum fill-muted text-xs">
              {fmt(t)}
            </text>
          </g>
        ))}
        {x.ticks(6).map((t) => (
          <text key={t} x={x(t)} y={H - M.b + 16} textAnchor="middle" className="tnum fill-muted text-xs">
            {fmt(t)}
          </text>
        ))}
        <text x={(M.l + W - M.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted text-xs">
          {xLabel}
        </text>
        <text x={12} y={(M.t + H - M.b) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(M.t + H - M.b) / 2})`} className="fill-muted text-xs">
          {yLabel}
        </text>
        {cursor !== undefined && <line x1={x(cursor)} x2={x(cursor)} y1={M.t} y2={H - M.b} className="stroke-accent" strokeDasharray="3 3" />}
        {series.map((s) => (
          <path key={s.carId} d={path(s.points) ?? ''} fill="none" stroke={CAR_MARKS[s.carId].color} strokeWidth={2.5} strokeDasharray={DASH[s.carId]} />
        ))}
        {labels.map((l) => (
          <text key={l.id} x={W - M.r + 6} y={l.y + 4} fill={CAR_MARKS[l.id].color} className="text-xs font-semibold">
            {CARS[l.id].short}
          </text>
        ))}
      </svg>
      <details className="mt-1 text-sm">
        <summary className="cursor-pointer text-xs text-muted">{UI.common.tableOf(title)}</summary>
        <div className="overflow-x-auto">
          <table className="tnum mt-1 w-full text-left text-xs">
            <thead>
              <tr>
                <th scope="col" className="pr-3 font-medium text-muted">
                  {xLabel}
                </th>
                {series.map((s) => (
                  <th key={s.carId} scope="col" className="pr-3 font-medium">
                    {CARS[s.carId].short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableXs.map((tx) => (
                <tr key={tx} className="border-t border-line">
                  <th scope="row" className="pr-3 font-normal text-muted">
                    {fmt(tx)}
                  </th>
                  {series.map((s) => {
                    const v = valueAt(s.points, tx);
                    return (
                      <td key={s.carId} className="pr-3">
                        {s.absent ? s.absent : v === null ? '–' : fmt(v, digits)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
