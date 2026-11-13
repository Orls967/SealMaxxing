import { UI } from '@/content/ui';
import { ADU_MODES } from '@/lib/viewState';
import { useView } from '@/store/view';
import { AccelPanel } from '@/ui/duel/AccelPanel';
import { BrakePanel } from '@/ui/duel/BrakePanel';
import { DownforcePanel } from '@/ui/duel/DownforcePanel';
import { EnergyPanel } from '@/ui/duel/EnergyPanel';
import { useReducedMotion } from '@/ui/useReducedMotion';

export default function DuelPage() {
  const mode = useView((s) => s.mode);
  const dist = useView((s) => s.dist);
  const speed = useView((s) => s.speed);
  const set = useView((s) => s.set);
  const reduced = useReducedMotion();
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide">{UI.duel.title}</h1>
        <p className="text-sm text-muted">{UI.duel.lead}</p>
      </header>
      <div role="tablist" aria-label={UI.duel.title} className="-mx-1 flex gap-1 overflow-x-auto px-1 py-1">
        {ADU_MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            id={`tab-${m}`}
            aria-selected={mode === m}
            aria-controls="panel-adu"
            onClick={() => set({ mode: m, dist: null })}
            className={`shrink-0 rounded border px-3 py-1.5 text-sm font-semibold ${mode === m ? 'border-accent bg-accent text-text' : 'border-line bg-surface-2 text-text hover:border-accent'}`}
          >
            {UI.duel.modes[m]}
          </button>
        ))}
      </div>
      <p className="rounded border border-warn px-3 py-2 text-xs text-text">
        <strong className="text-warn">{UI.common.simpleModel}.</strong> {UI.duel.modelNote}
      </p>
      <div role="tabpanel" id="panel-adu" aria-labelledby={`tab-${mode}`}>
        <h2 className="sr-only">{UI.duel.modes[mode]}</h2>
        {mode === 'accel' && (
          <AccelPanel target={dist} onTarget={(d) => set({ dist: d })} instant={reduced} />
        )}
        {mode === 'brake' && <BrakePanel from={dist} onFrom={(d) => set({ dist: d })} />}
        {mode === 'downforce' && <DownforcePanel speed={speed} onSpeed={(v) => set({ speed: v })} />}
        {mode === 'energy' && <EnergyPanel />}
      </div>
    </div>
  );
}
