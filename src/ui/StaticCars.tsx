import { CARS } from '@/content/cars';
import type { CarId } from '@/content/ids';
import { UI } from '@/content/ui';

/** Fallback when WebGL is unavailable: pre-rendered pictures of the illustrative models. */
export function StaticCars({ cars }: { cars: readonly CarId[] }) {
  return (
    <div className="flex h-full flex-col gap-2 overflow-auto bg-surface p-3">
      <div role="status" className="rounded border border-warn p-2 text-sm text-text">
        <strong className="text-warn">{UI.common.noWebglTitle}.</strong> {UI.common.noWebgl}
      </div>
      <div className={`grid flex-1 gap-2 ${cars.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {cars.map((id) => (
          <figure
            key={id}
            className="flex flex-col items-center justify-center rounded border border-line bg-bg p-2"
          >
            <img
              src={`./static/${id}.webp`}
              alt={UI.common.staticAlt(CARS[id].name)}
              className="max-h-64 w-full object-contain"
              loading="lazy"
            />
            <figcaption className="text-xs text-muted">{CARS[id].name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
