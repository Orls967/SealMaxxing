import { NavLink } from 'react-router-dom';
import { CAR_LIST } from '@/content/cars';
import { UI } from '@/content/ui';

/** Switches the dissected car while keeping the current view (part, tools) in the URL. */
export function CarTabs({ search }: { search: string }) {
  return (
    <nav aria-label={UI.dissect.pickCar} className="flex gap-1 overflow-x-auto">
      {CAR_LIST.map((c) => (
        <NavLink
          key={c.id}
          to={`/bedah/${c.id}${search}`}
          className={({ isActive }) =>
            `shrink-0 rounded px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-surface-2 text-text ring-1 ring-accent' : 'text-muted hover:bg-surface-2 hover:text-text'}`
          }
        >
          {c.short}
        </NavLink>
      ))}
    </nav>
  );
}
