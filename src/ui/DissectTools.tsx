import { MAX_LAYER } from '@/content/ids';
import { UI } from '@/content/ui';
import { CAM_PRESETS, CUT_AXES, type CamPreset, type ViewState } from '@/lib/viewState';

interface Props {
  view: Pick<ViewState, 'peel' | 'explode' | 'cut' | 'cutPos' | 'xray' | 'cam'>;
  onChange: (patch: Partial<ViewState>) => void;
  onCamera: (preset: CamPreset) => void;
  onReset: () => void;
}

const btn = (active: boolean) =>
  `rounded border px-2 py-1 text-xs font-medium ${active ? 'border-accent bg-accent text-text' : 'border-line bg-surface-2 text-text hover:border-accent'}`;

/** The four dissect tools plus camera presets. All are plain form controls. */
export function DissectTools({ view, onChange, onCamera, onReset }: Props) {
  return (
    <section
      aria-label={UI.dissect.tools}
      className="grid gap-x-4 gap-y-2 border-t border-line bg-surface p-3 text-sm sm:grid-cols-2 xl:grid-cols-4"
    >
      <label className="flex flex-col gap-1">
        <span className="flex justify-between gap-2">
          <span className="font-semibold">{UI.dissect.peel}</span>
          <span className="text-xs text-muted">{UI.dissect.peelSteps[view.peel]}</span>
        </span>
        <input
          type="range"
          min={0}
          max={MAX_LAYER}
          step={1}
          value={view.peel}
          aria-valuetext={UI.dissect.peelSteps[view.peel]}
          onChange={(e) => onChange({ peel: Number(e.target.value) })}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="flex justify-between gap-2">
          <span className="font-semibold">{UI.dissect.explode}</span>
          <span className="tnum text-xs text-muted">{view.explode}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={view.explode}
          onChange={(e) => onChange({ explode: Number(e.target.value) })}
        />
      </label>
      <fieldset className="flex flex-col gap-1">
        <legend className="font-semibold">{UI.dissect.cut}</legend>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            className={btn(view.cut === null)}
            aria-pressed={view.cut === null}
            onClick={() => onChange({ cut: null })}
          >
            {UI.dissect.cutOff}
          </button>
          {CUT_AXES.map((a) => (
            <button
              key={a}
              type="button"
              className={btn(view.cut === a)}
              aria-pressed={view.cut === a}
              onClick={() => onChange({ cut: a })}
            >
              {UI.dissect.cutAxis[a]}
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={view.cutPos}
          disabled={view.cut === null}
          aria-label={UI.dissect.cutPos}
          onChange={(e) => onChange({ cutPos: Number(e.target.value) })}
        />
      </fieldset>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              checked={view.xray}
              onChange={(e) => onChange({ xray: e.target.checked })}
            />
            {UI.dissect.xray}
          </label>
          <button type="button" className={btn(false)} onClick={onReset}>
            {UI.dissect.reset}
          </button>
        </div>
        <div role="group" aria-label={UI.dissect.camera} className="flex flex-wrap gap-1">
          {CAM_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              className={btn(view.cam === c)}
              aria-pressed={view.cam === c}
              onClick={() => onCamera(c)}
            >
              {UI.dissect.cam[c]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
