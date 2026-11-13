import { Link, NavLink, useParams } from 'react-router-dom';
import { CARS } from '@/content/cars';
import { SYSTEM_COMPARISON, PART_COMPARISON } from '@/content/comparisons';
import { SYSTEM_IDS, SYSTEM_PARTS, isSystemId } from '@/content/ids';
import { PART_LABEL, SYSTEM_LABEL } from '@/content/labels';
import { METRICS, METRIC_BY_ID, type Metric, type MetricId } from '@/content/metrics';
import { PARTS } from '@/content/parts';
import { UI } from '@/content/ui';
import { compareMetric, derivedCell, rankCells } from '@/lib/compare';
import { DERIVED } from '@/lib/derived';
import { ANCHORS, DEFAULT_VIEW, LAYOUTS, serializeView, toggleCar } from '@/lib/viewState';
import { CompareScene } from '@/scene/compare/CompareScene';
import { hasWebgl } from '@/scene/webgl';
import { useView } from '@/store/view';
import { CarPicker } from '@/ui/CarPicker';
import { CompareRow } from '@/ui/CompareRow';
import { StaticCars } from '@/ui/StaticCars';
import { useReducedMotion } from '@/ui/useReducedMotion';

const OVERALL: MetricId[] = ['powerTotalKw', 'kerbKg', 'zeroTo100S', 'zeroTo200S', 'topSpeedKmh', 'lengthMm', 'heightMm'];
const chip = (active: boolean) =>
  `shrink-0 rounded border px-2 py-1 text-sm font-medium ${active ? 'border-accent bg-accent text-text' : 'border-line bg-surface-2 text-text hover:border-accent'}`;

export default function ComparePage() {
  const { systemId } = useParams();
  const system = isSystemId(systemId) ? systemId : null;
  const carIds = useView((s) => s.cars);
  const layout = useView((s) => s.layout);
  const anchor = useView((s) => s.anchor);
  const sync = useView((s) => s.sync);
  const xray = useView((s) => s.xray);
  const set = useView((s) => s.set);
  const reduced = useReducedMotion();
  const cars = carIds.map((id) => CARS[id]);
  const names = cars.map((c) => c.short).join(', ');
  const keep = serializeView({ ...DEFAULT_VIEW, cars: carIds, layout, anchor, sync, xray: true });
  const keepPlain = serializeView({ ...DEFAULT_VIEW, cars: carIds, layout, anchor, sync });
  const metrics: Metric[] = system ? METRICS.filter((m) => m.group === system) : OVERALL.map((id) => METRIC_BY_ID[id]);
  const ratio = DERIVED.find((d) => d.id === 'powerPerTonneKw');

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide">
          {UI.compare.title}
          {system && <span className="text-accent-text">: {SYSTEM_LABEL[system]}</span>}
        </h1>
        <p className="text-sm text-muted">{UI.compare.lead}</p>
      </header>

      <nav aria-label={UI.compare.system} className="-mx-1 flex gap-1 overflow-x-auto px-1 py-1">
        <NavLink to={`/banding${keepPlain ? `?${keepPlain}` : ''}`} end className={chip(system === null)}>
          {UI.compare.allSystems}
        </NavLink>
        {SYSTEM_IDS.map((s) => (
          <NavLink key={s} to={`/banding/${s}?${keep}`} className={chip(system === s)} aria-current={system === s ? 'page' : undefined}>
            {SYSTEM_LABEL[s]}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-line bg-surface p-3 text-sm">
        <CarPicker cars={carIds} onToggle={(id) => set({ cars: toggleCar(carIds, id) })} />
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">{UI.compare.layout}</legend>
          {LAYOUTS.map((l) => (
            <button key={l} type="button" className={chip(layout === l)} aria-pressed={layout === l} onClick={() => set({ layout: l })}>
              {UI.compare[l]}
            </button>
          ))}
        </fieldset>
        {layout === 'overlay' ? (
          <label className="flex items-center gap-2">
            {UI.compare.anchor}
            <select
              className="rounded border border-line bg-surface-2 px-2 py-1 text-text"
              value={anchor}
              onChange={(e) => set({ anchor: ANCHORS.find((a) => a === e.target.value) ?? 'front' })}
            >
              {ANCHORS.map((a) => (
                <option key={a} value={a}>
                  {UI.compare.anchors[a]}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={sync} onChange={(e) => set({ sync: e.target.checked })} />
              {UI.compare.sync}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={xray} onChange={(e) => set({ xray: e.target.checked })} />
              {UI.compare.xray}
            </label>
          </>
        )}
      </div>

      <div>
        <div className="h-80 overflow-hidden rounded-lg border border-line md:h-112">
          {hasWebgl() ? (
            <CompareScene
              label={UI.compare.canvas(names, system ? SYSTEM_LABEL[system] : '')}
              cars={carIds}
              layout={layout}
              anchor={anchor}
              sync={sync}
              system={system}
              xray={xray}
              instant={reduced}
            />
          ) : (
            <StaticCars cars={carIds} />
          )}
        </div>
        <p className="mt-1 text-xs text-muted">
          {UI.common.illustration} <span className="md:hidden">{UI.compare.swipe}</span>
        </p>
      </div>

      {system && (
        <section aria-labelledby="ringkas" className="rounded-lg border border-accent-dim bg-surface p-4">
          <h2 id="ringkas" className="text-xs font-semibold uppercase tracking-wide text-accent-text">
            {UI.compare.summary}
          </h2>
          <p className="mt-1 text-lg text-text">{SYSTEM_COMPARISON[system]}</p>
        </section>
      )}

      <section aria-labelledby="baris">
        <h2 id="baris" className="mb-2 font-display text-2xl font-bold uppercase tracking-wide">
          {system ? UI.compare.rows : UI.compare.overall}
        </h2>
        {metrics.length === 0 ? (
          <p className="text-sm text-muted">{UI.compare.noRows}</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {metrics.map((m) => (
              <CompareRow key={m.id} label={m.label} unit={m.unit} digits={m.digits} cars={cars} result={compareMetric(cars, m)} />
            ))}
            {!system && ratio && (
              <CompareRow
                label={ratio.label}
                unit={ratio.unit}
                digits={ratio.digits}
                cars={cars}
                note={ratio.note}
                result={rankCells(cars.map((c) => derivedCell(c, ratio)), ratio.better)}
              />
            )}
          </div>
        )}
      </section>

      {system && (
        <section aria-labelledby="bagian">
          <h2 id="bagian" className="mb-2 font-display text-2xl font-bold uppercase tracking-wide">
            {UI.compare.parts}
          </h2>
          <div className="flex flex-col gap-4">
            {SYSTEM_PARTS[system].map((p) => (
              <article key={p} className="rounded-lg border border-line bg-surface p-3">
                <h3 className="font-semibold text-text">{PART_LABEL[p]}</h3>
                <p className="text-sm text-muted">{PART_COMPARISON[p]}</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {cars.map((c) => {
                    const t = PARTS[c.id][p];
                    return (
                      <li key={c.id} className="flex flex-col gap-1 rounded border border-line bg-surface-2 p-2">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold">{c.short}</span>
                          {t.presence.kind === 'absent' && <span className="rounded border border-line px-1 text-xs text-muted">{UI.dissect.absentTag}</span>}
                        </span>
                        <span className="text-sm text-text">{t.presence.kind === 'absent' ? t.presence.reason : t.summary}</span>
                        <Link to={`/bedah/${c.id}?part=${p}&xray=1`} className="mt-auto text-xs text-accent-text underline underline-offset-2">
                          {UI.compare.openInDissect}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
