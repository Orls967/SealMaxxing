import { Link } from 'react-router-dom';
import { CAR_MARKS } from '@/content/carMarks';
import { METRIC_BY_ID, type MetricId } from '@/content/metrics';
import type { Car } from '@/content/types';
import { UI } from '@/content/ui';
import { cellFor } from '@/lib/compare';
import { MetricValue } from './MetricValue';

const KEY: MetricId[] = ['powerTotalKw', 'kerbKg', 'zeroTo100S', 'lengthMm'];

/** Summary card for one car: identity, era, key figures and the way into Bedah. */
export function CarCard({ car }: { car: Car }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4">
      <header className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-1.5 h-3 w-3 shrink-0 rounded-full border border-line"
          style={{ background: CAR_MARKS[car.id].color }}
        />
        <div>
          <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-wide">{car.name}</h3>
          <p className="text-sm text-muted">
            {car.kindLabel} · {car.years}
          </p>
        </div>
      </header>
      <p className="text-sm text-text">{car.role}</p>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
        {KEY.map((id) => {
          const m = METRIC_BY_ID[id];
          return (
            <div key={id}>
              <dt className="text-xs text-muted">{m.label}</dt>
              <dd className="text-sm">
                <MetricValue cell={cellFor(car, m)} unit={m.unit} digits={m.digits} compact />
              </dd>
            </div>
          );
        })}
      </dl>
      <Link
        to={`/bedah/${car.id}`}
        className="mt-auto rounded bg-accent px-3 py-2 text-center text-sm font-semibold text-text hover:bg-accent-dim"
      >
        {UI.garage.open}
      </Link>
    </article>
  );
}
