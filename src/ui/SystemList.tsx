import { SYSTEM_IDS, SYSTEM_PARTS, type CarId, type PartId, type SystemId } from '@/content/ids';
import { PART_LABEL, SYSTEM_LABEL } from '@/content/labels';
import { PARTS } from '@/content/parts';
import { UI } from '@/content/ui';

interface Props {
  carId: CarId;
  part: PartId | null;
  system: SystemId | null;
  onPart: (id: PartId) => void;
  onSystem: (id: SystemId) => void;
}

/** Keyboard-reachable equivalent of everything clickable in the 3D view. */
export function SystemList({ carId, part, system, onPart, onSystem }: Props) {
  return (
    <nav aria-label={UI.dissect.systems} className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-lg font-bold uppercase tracking-wide">{UI.dissect.systems}</h2>
        <p className="text-xs text-muted">{UI.dissect.systemsHint}</p>
      </div>
      {SYSTEM_IDS.map((s) => (
        <section key={s} aria-label={SYSTEM_LABEL[s]}>
          <button
            type="button"
            onClick={() => onSystem(s)}
            aria-pressed={system === s && !part}
            title={UI.dissect.showInModel}
            className={`w-full rounded px-2 py-1 text-left text-sm font-semibold uppercase tracking-wide ${system === s && !part ? 'bg-accent text-text' : 'text-accent-text hover:bg-surface-2'}`}
          >
            {SYSTEM_LABEL[s]}
          </button>
          <ul className="mt-1 flex flex-col">
            {SYSTEM_PARTS[s].map((p) => {
              const absent = PARTS[carId][p].presence.kind === 'absent';
              const active = part === p;
              return (
                <li key={p}>
                  <button
                    type="button"
                    data-part={p}
                    onClick={() => onPart(p)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-left text-sm ${active ? 'bg-surface-2 text-text ring-1 ring-accent' : 'text-text hover:bg-surface-2'}`}
                  >
                    <span className={absent ? 'text-muted' : ''}>{PART_LABEL[p]}</span>
                    {absent && (
                      <span className="shrink-0 rounded border border-line px-1 text-xs text-muted">
                        {UI.dissect.absentTag}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
