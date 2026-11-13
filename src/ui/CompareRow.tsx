import type { CarId } from '@/content/ids';
import type { Car } from '@/content/types';
import { UI } from '@/content/ui';
import type { RowResult } from '@/lib/compare';
import { MarkSwatch, markFill } from './charts/ChartDefs';
import { MetricValue } from './MetricValue';

interface Props {
  label: string;
  unit: string;
  digits?: number;
  cars: Car[];
  result: RowResult;
  note?: string;
}

/**
 * One metric across the selected cars: bars on a shared axis, value, unit and measurement
 * basis. A winner is marked only when `result.best` says one may be declared.
 */
export function CompareRow({ label, unit, digits, cars, result, note }: Props) {
  const byCar = new Map<CarId, Car>(cars.map((c) => [c.id, c]));
  return (
    <section aria-label={label} className="rounded-lg border border-line bg-surface p-3">
      <h3 className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-semibold">
        <span>
          {label}
          {unit && <span className="font-normal text-muted"> ({unit})</span>}
        </span>
        {note && <span className="text-xs font-normal text-muted">{note}</span>}
      </h3>
      <ul className="mt-2 flex flex-col gap-2">
        {result.cells.map((cell) => {
          const car = byCar.get(cell.carId);
          if (!car) return null;
          const frac = cell.kind === 'value' && result.max > 0 ? Math.max(0, cell.data.value) / result.max : 0;
          return (
            <li key={cell.carId} className="grid grid-cols-12 items-center gap-x-2 gap-y-1">
              <span className="col-span-12 flex items-center gap-2 text-sm sm:col-span-2">
                <MarkSwatch id={car.id} />
                {car.short}
              </span>
              <span className="col-span-5 sm:col-span-5">
                {cell.kind === 'value' ? (
                  <svg role="presentation" width="100%" height="14" className="block overflow-hidden rounded bg-surface-2">
                    <rect width={`${frac * 100}%`} height="14" fill={markFill(car.id)} />
                  </svg>
                ) : (
                  <span aria-hidden="true" className="block h-3.5 rounded border border-dashed border-line" />
                )}
              </span>
              <span className="col-span-7 text-sm sm:col-span-5">
                <MetricValue cell={cell} unit={unit} digits={digits} best={result.best.includes(cell.carId)} />
              </span>
            </li>
          );
        })}
      </ul>
      {result.noWinner === 'mixed-basis' && <p className="mt-2 text-xs text-warn">{UI.common.noWinnerBasis}</p>}
    </section>
  );
}
