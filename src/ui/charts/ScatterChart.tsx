import { scaleLinear } from 'd3-scale';
import { CARS } from '@/content/cars';
import type { CarId } from '@/content/ids';
import { UI } from '@/content/ui';
import { fmt } from '@/lib/format';
import { markFill } from './ChartDefs';

export interface ScatterPoint {
  carId: CarId;
  x: number;
  y: number;
  verified: boolean;
}

const W = 640;
const H = 320;
const M = { l: 56, r: 24, t: 14, b: 40 };

/** Power against weight with direct labels and guide lines of equal power-to-weight. */
export function ScatterChart({ title, xLabel, yLabel, points, note }: { title: string; xLabel: string; yLabel: string; points: ScatterPoint[]; note: string }) {
  const xMax = Math.max(...points.map((p) => p.x)) * 1.12;
  const yMax = Math.max(...points.map((p) => p.y)) * 1.15;
  const x = scaleLinear().domain([0, xMax]).range([M.l, W - M.r]);
  const y = scaleLinear().domain([0, yMax]).range([H - M.b, M.t]);
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
        {[200, 400].map((ratio) => {
          // y = ratio (kW/ton) × x (kg) ÷ 1000
          const xe = Math.min(xMax, (yMax * 1000) / ratio);
          return (
            <g key={ratio}>
              <line x1={x(0)} y1={y(0)} x2={x(xe)} y2={y((ratio * xe) / 1000)} className="stroke-accent-dim" strokeDasharray="4 4" />
              <text x={x(xe) - 4} y={y((ratio * xe) / 1000) + 14} textAnchor="end" className="fill-muted text-xs">
                {fmt(ratio)} kW/ton
              </text>
            </g>
          );
        })}
        <text x={(M.l + W - M.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted text-xs">
          {xLabel}
        </text>
        <text x={12} y={(M.t + H - M.b) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(M.t + H - M.b) / 2})`} className="fill-muted text-xs">
          {yLabel}
        </text>
        {points.map((p) => (
          <g key={p.carId}>
            <circle cx={x(p.x)} cy={y(p.y)} r={8} fill={markFill(p.carId)} className="stroke-bg" strokeWidth={1.5} />
            <text x={x(p.x) + 12} y={y(p.y) + 4} className="fill-text text-xs font-semibold">
              {CARS[p.carId].short}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-muted">{note}</p>
      <details className="mt-1">
        <summary className="cursor-pointer text-xs text-muted">{UI.common.tableOf(title)}</summary>
        <table className="tnum mt-1 w-full text-left text-xs">
          <thead>
            <tr>
              <th scope="col" className="pr-3 font-medium text-muted">
                {UI.common.car}
              </th>
              <th scope="col" className="pr-3 font-medium">
                {xLabel}
              </th>
              <th scope="col" className="pr-3 font-medium">
                {yLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.carId} className="border-t border-line">
                <th scope="row" className="pr-3 font-normal">
                  {CARS[p.carId].short}
                </th>
                <td className="pr-3">
                  {fmt(p.x)} {!p.verified && <span className="text-warn">({UI.common.unverified})</span>}
                </td>
                <td className="pr-3">{fmt(p.y)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
