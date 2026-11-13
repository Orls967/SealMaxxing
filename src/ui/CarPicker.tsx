import { CAR_LIST } from '@/content/cars';
import type { CarId } from '@/content/ids';
import { UI } from '@/content/ui';
import { MarkSwatch } from './charts/ChartDefs';

/** Chooses 2–4 cars. The last two cannot be unchecked. */
export function CarPicker({ cars, onToggle }: { cars: CarId[]; onToggle: (id: CarId) => void }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">
        {UI.compare.cars}. {UI.compare.carsHint}
      </legend>
      {CAR_LIST.map((c) => {
        const on = cars.includes(c.id);
        return (
          <label
            key={c.id}
            className={`flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm ${on ? 'border-accent bg-surface-2 text-text' : 'border-line text-muted'}`}
          >
            <input
              type="checkbox"
              checked={on}
              disabled={on && cars.length <= 2}
              onChange={() => onToggle(c.id)}
            />
            <MarkSwatch id={c.id} />
            {c.short}
          </label>
        );
      })}
    </fieldset>
  );
}
