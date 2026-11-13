import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { UI } from '@/content/ui';
import { ChartDefs } from './charts/ChartDefs';

const LINKS = [
  { to: '/', label: UI.nav.garage, end: true },
  { to: '/bedah/seal', label: UI.nav.dissect, match: '/bedah' },
  { to: '/banding', label: UI.nav.compare },
  { to: '/data', label: UI.nav.data },
  { to: '/adu', label: UI.nav.duel },
  { to: '/glosarium', label: UI.nav.glossary },
  { to: '/tentang', label: UI.nav.about },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <ChartDefs />
      <a href="#isi" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-accent focus:p-2 focus:text-text">
        {UI.app.skip}
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-4 px-4 py-2">
          <NavLink to="/" className="flex shrink-0 items-baseline gap-2 font-display text-xl font-bold uppercase tracking-wide">
            <span>
              Car<span className="text-accent-text">Some</span>
            </span>
          </NavLink>
          <nav aria-label={UI.nav.label} className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1 py-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={'end' in l}
                className={({ isActive }) =>
                  `shrink-0 rounded px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-accent text-text' : 'text-muted hover:bg-surface-2 hover:text-text'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="isi" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-line px-4 py-4 text-center text-xs text-muted">{UI.app.footer}</footer>
    </div>
  );
}
