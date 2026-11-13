import { Link } from 'react-router-dom';
import { CAR_LIST, CARS } from '@/content/cars';
import { PART_COMPARISON } from '@/content/comparisons';
import { PART_SYSTEM, type CarId, type PartId } from '@/content/ids';
import { PART_LABEL, SYSTEM_LABEL } from '@/content/labels';
import { METRIC_BY_ID } from '@/content/metrics';
import { PARTS } from '@/content/parts';
import { UI } from '@/content/ui';
import { cellFor } from '@/lib/compare';
import { MetricValue } from './MetricValue';

const H = 'mt-3 text-xs font-semibold uppercase tracking-wide text-accent-text';

/** Explanation of one part on one car, always next to its counterpart on the other three. */
export function PartPanel({
  carId,
  part,
  onClear,
}: {
  carId: CarId;
  part: PartId | null;
  onClear: () => void;
}) {
  if (!part) return <p className="text-sm text-muted">{UI.dissect.noPart}</p>;
  const car = CARS[carId];
  const text = PARTS[carId][part];
  const system = PART_SYSTEM[part];
  const absent = text.presence.kind === 'absent';
  const facts = text.facts ?? [];
  return (
    <article aria-live="polite">
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            {SYSTEM_LABEL[system]} · {car.short}
          </p>
          <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-wide">
            {PART_LABEL[part]}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded border border-line px-2 py-1 text-xs text-muted hover:border-accent hover:text-text"
        >
          {UI.dissect.clear}
        </button>
      </header>
      {text.presence.kind === 'absent' && (
        <p className="mt-2 rounded border border-line bg-surface-2 p-2 text-sm">
          <strong className="text-accent-text">{UI.dissect.absentHere}.</strong> {text.presence.reason}
        </p>
      )}
      <p className="mt-2 text-sm text-text">{text.summary}</p>
      <h3 className={H}>{absent ? UI.dissect.instead : UI.dissect.how}</h3>
      <p className="text-sm text-text">{text.how}</p>
      <h3 className={H}>{UI.dissect.why}</h3>
      <p className="text-sm text-text">{text.why}</p>
      {facts.length > 0 && (
        <>
          <h3 className={H}>{UI.dissect.facts}</h3>
          <dl className="mt-1 grid grid-cols-2 gap-2">
            {facts.map((f) => {
              const m = METRIC_BY_ID[f];
              return (
                <div key={f}>
                  <dt className="text-xs text-muted">{m.label}</dt>
                  <dd className="text-sm">
                    <MetricValue cell={cellFor(car, m)} unit={m.unit} digits={m.digits} />
                  </dd>
                </div>
              );
            })}
          </dl>
        </>
      )}
      <h3 className={H}>{UI.dissect.strip}</h3>
      <p className="text-sm text-muted">{PART_COMPARISON[part]}</p>
      <ul className="mt-2 flex flex-col gap-2">
        {CAR_LIST.filter((c) => c.id !== carId).map((c) => {
          const other = PARTS[c.id][part];
          const fact = (other.facts ?? facts)[0];
          const m = fact ? METRIC_BY_ID[fact] : null;
          return (
            <li key={c.id} className="rounded border border-line bg-surface-2 p-2">
              <div className="flex items-baseline justify-between gap-2">
                <Link
                  to={`/bedah/${c.id}?part=${part}&xray=1`}
                  className="text-sm font-semibold text-text underline decoration-accent underline-offset-2"
                >
                  {c.short}
                </Link>
                {other.presence.kind === 'absent' && (
                  <span className="rounded border border-line px-1 text-xs text-muted">
                    {UI.dissect.absentTag}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">
                {other.presence.kind === 'absent' ? other.presence.reason : other.summary}
              </p>
              {m && (
                <p className="mt-1 text-xs">
                  <span className="text-muted">{m.label}: </span>
                  <MetricValue cell={cellFor(c, m)} unit={m.unit} digits={m.digits} compact />
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <Link
        to={`/banding/${system}?xray=1`}
        className="mt-3 block rounded bg-accent px-3 py-2 text-center text-sm font-semibold text-text hover:bg-accent-dim"
      >
        {UI.dissect.compareBtn}: {SYSTEM_LABEL[system]}
      </Link>
    </article>
  );
}
