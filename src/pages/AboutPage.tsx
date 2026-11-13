import { CAR_LIST } from '@/content/cars';
import { METRIC_BY_ID, METRIC_IDS } from '@/content/metrics';
import { UI } from '@/content/ui';
import { fmtSourced } from '@/lib/format';
import { priceView } from '@/lib/price';

export default function AboutPage() {
  const pending = CAR_LIST.map((c) => ({
    car: c,
    items: [
      ...METRIC_IDS.flatMap((id) => {
        const v = c.specs[id];
        const m = METRIC_BY_ID[id];
        return v && !v.verified ? [`${m.label}: ${fmtSourced(v, m.unit, m.digits)}`] : [];
      }),
      ...(c.price.verified ? [] : [`${UI.data.price}: ${priceView(c.price).original}`]),
    ],
  }));
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-4">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide">{UI.about.title}</h1>
      {UI.about.sections.map((s) => (
        <section key={s.h}>
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-accent-text">{s.h}</h2>
          <p className="text-text">{s.p}</p>
        </section>
      ))}
      <section>
        <h2 className="font-display text-xl font-bold uppercase tracking-wide text-warn">
          {UI.about.unverifiedTitle}
        </h2>
        <p className="text-sm text-muted">{UI.about.unverifiedLead}</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {pending.map(({ car, items }) => (
            <div key={car.id} className="rounded-lg border border-line bg-surface p-3">
              <h3 className="font-semibold">{car.name}</h3>
              <ul className="tnum mt-1 list-disc pl-5 text-sm text-text">
                {items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
