import { CARS } from '@/content/cars';
import type { CarId } from '@/content/ids';
import { MarkSwatch, markFill } from '../charts/ChartDefs';

export interface ModelBar {
  carId: CarId;
  /** null = does not apply to this car; `text` then explains why. */
  value: number | null;
  text: string;
  sub?: string;
}

/** Horizontal bars for model output: same car marks as everywhere, value written next to the bar. */
export function ModelBars({ title, bars }: { title: string; bars: ModelBar[] }) {
  const max = Math.max(1e-9, ...bars.map((b) => b.value ?? 0));
  return (
    <section aria-label={title} className="rounded-lg border border-line bg-surface p-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 flex flex-col gap-2">
        {bars.map((b) => (
          <li key={b.carId} className="grid grid-cols-12 items-center gap-x-2 gap-y-1">
            <span className="col-span-12 flex items-center gap-2 text-sm sm:col-span-2">
              <MarkSwatch id={b.carId} />
              {CARS[b.carId].short}
            </span>
            <span className="col-span-6">
              {b.value === null ? (
                <span aria-hidden="true" className="block h-3.5 rounded border border-dashed border-line" />
              ) : (
                <svg
                  role="presentation"
                  width="100%"
                  height="14"
                  className="block overflow-hidden rounded bg-surface-2"
                >
                  <rect width={`${(b.value / max) * 100}%`} height="14" fill={markFill(b.carId)} />
                </svg>
              )}
            </span>
            <span className="col-span-6 text-sm sm:col-span-4">
              <span className={`tnum ${b.value === null ? 'text-muted' : 'font-semibold'}`}>{b.text}</span>
              {b.sub && <span className="block text-xs text-muted">{b.sub}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
