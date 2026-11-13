import { Link } from 'react-router-dom';
import { CAR_LIST } from '@/content/cars';
import { STORIES } from '@/content/comparisons';
import { CAR_IDS } from '@/content/ids';
import { UI } from '@/content/ui';
import { GarageScene } from '@/scene/GarageScene';
import { hasWebgl } from '@/scene/webgl';
import { useView } from '@/store/view';
import { CarCard } from '@/ui/CarCard';
import { StaticCars } from '@/ui/StaticCars';
import { useReducedMotion } from '@/ui/useReducedMotion';

const MODULES = [
  { to: '/bedah/seal', title: UI.nav.dissect, text: UI.garage.moduleDissect },
  { to: '/banding/energy?xray=1', title: UI.nav.compare, text: UI.garage.moduleCompare },
  { to: '/data', title: UI.nav.data, text: UI.garage.moduleData },
  { to: '/adu', title: UI.nav.duel, text: UI.garage.moduleDuel },
] as const;

export default function GaragePage() {
  const livery = useView((s) => s.livery);
  const set = useView((s) => s.set);
  const reduced = useReducedMotion();
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide md:text-5xl">{UI.garage.title}</h1>
        <p className="mt-1 max-w-3xl text-muted">{UI.garage.lead}</p>
      </header>

      <section aria-label={UI.garage.cars} className="flex flex-col gap-2">
        <div className="h-72 overflow-hidden rounded-lg border border-line md:h-96">
          {hasWebgl() ? (
            <GarageScene label={UI.garage.canvas} paints={{ laferrari: livery === 'factory' ? 'paintRed' : 'paint' }} instant={reduced} />
          ) : (
            <StaticCars cars={CAR_IDS} />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>
            {UI.common.illustration} <span className="rounded border border-line px-1">{UI.common.themeLivery}</span>
          </span>
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" checked={livery === 'factory'} onChange={(e) => set({ livery: e.target.checked ? 'factory' : 'theme' })} />
            {UI.garage.liveryToggle}
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CAR_LIST.map((c) => (
            <CarCard key={c.id} car={c} />
          ))}
        </div>
      </section>

      <section aria-labelledby="mulai">
        <h2 id="mulai" className="mb-2 font-display text-2xl font-bold uppercase tracking-wide">
          {UI.garage.modules}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {MODULES.map((m) => (
            <li key={m.to}>
              <Link to={m.to} className="block h-full rounded-lg border border-line bg-surface p-4 hover:border-accent">
                <span className="font-display text-xl font-bold uppercase tracking-wide text-accent-text">{m.title}</span>
                <span className="mt-1 block text-sm text-text">{m.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cerita">
        <h2 id="cerita" className="mb-2 font-display text-2xl font-bold uppercase tracking-wide">
          {UI.garage.stories}
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STORIES.map((s, i) => (
            <li key={s.id}>
              <Link to={s.to} className="flex h-full gap-3 rounded-lg border border-line bg-surface p-4 hover:border-accent">
                <span aria-hidden="true" className="tnum font-display text-3xl font-bold text-accent-dim">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold text-text">{s.title}</span>
                  <span className="block text-sm text-muted">{s.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
