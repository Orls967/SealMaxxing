import { CAR_MARKS } from '@/content/carMarks';
import { CARS } from '@/content/cars';
import type { CarId } from '@/content/ids';
import { UI } from '@/content/ui';
import { fmt } from '@/lib/format';

export interface RadarAxis {
  label: string;
  /** Normalised 0..1 per car; null = not applicable to that car. */
  values: Partial<Record<CarId, number | null>>;
}

const S = 360;
const C = S / 2;
const R = 118;
const DASH: Record<CarId, string> = { seal: '', laferrari: '8 4', p1: '2 4', senna: '10 3 2 3' };

/** Normalised profile per car. Not-applicable axes sit at the centre and are named in the table. */
export function RadarChart({
  title,
  axes,
  cars,
  note,
}: {
  title: string;
  axes: RadarAxis[];
  cars: CarId[];
  note: string;
}) {
  const n = axes.length;
  const pt = (i: number, v: number): [number, number] => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [C + Math.cos(a) * R * v, C + Math.sin(a) * R * v];
  };
  return (
    <figure className="rounded-lg border border-line bg-surface p-3">
      <figcaption className="mb-1 text-sm font-semibold">{title}</figcaption>
      <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-label={title} className="mx-auto w-full max-w-md">
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <polygon
            key={r}
            points={axes.map((_, i) => pt(i, r).join(',')).join(' ')}
            fill="none"
            className="stroke-line"
          />
        ))}
        {axes.map((ax, i) => {
          const [x, y] = pt(i, 1.2);
          const [ex, ey] = pt(i, 1);
          return (
            <g key={ax.label}>
              <line x1={C} y1={C} x2={ex} y2={ey} className="stroke-line" />
              <text x={x} y={y + 4} textAnchor="middle" className="fill-muted text-xs">
                {ax.label}
              </text>
            </g>
          );
        })}
        {cars.map((id) => (
          <polygon
            key={id}
            points={axes.map((ax, i) => pt(i, ax.values[id] ?? 0).join(',')).join(' ')}
            fill={CAR_MARKS[id].color}
            fillOpacity={0.08}
            stroke={CAR_MARKS[id].color}
            strokeWidth={2}
            strokeDasharray={DASH[id]}
          />
        ))}
      </svg>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {cars.map((id) => (
          <li key={id} className="flex items-center gap-1">
            <svg aria-hidden="true" width="26" height="8">
              <line
                x1="0"
                y1="4"
                x2="26"
                y2="4"
                stroke={CAR_MARKS[id].color}
                strokeWidth="2.5"
                strokeDasharray={DASH[id]}
              />
            </svg>
            {CARS[id].short}
          </li>
        ))}
      </ul>
      <p className="mt-1 text-xs text-muted">{note}</p>
      <details className="mt-1">
        <summary className="cursor-pointer text-xs text-muted">{UI.common.tableOf(title)}</summary>
        <div className="overflow-x-auto">
          <table className="tnum mt-1 w-full text-left text-xs">
            <thead>
              <tr>
                <th scope="col" className="pr-3 font-medium text-muted">
                  {UI.common.metric}
                </th>
                {cars.map((id) => (
                  <th key={id} scope="col" className="pr-3 font-medium">
                    {CARS[id].short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {axes.map((ax) => (
                <tr key={ax.label} className="border-t border-line">
                  <th scope="row" className="pr-3 font-normal text-muted">
                    {ax.label}
                  </th>
                  {cars.map((id) => {
                    const v = ax.values[id];
                    return (
                      <td key={id} className="pr-3">
                        {v === null || v === undefined ? UI.dissect.absentTag : fmt(v, 2)}
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
