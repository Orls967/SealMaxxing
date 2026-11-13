import { useCallback, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { CARS } from '@/content/cars';
import { PART_SYSTEM, SYSTEM_LAYER, isCarId, type PartId, type SystemId } from '@/content/ids';
import { UI } from '@/content/ui';
import { DEFAULT_VIEW, serializeView, type CamPreset } from '@/lib/viewState';
import { DissectScene } from '@/scene/DissectScene';
import { hasWebgl } from '@/scene/webgl';
import { useView } from '@/store/view';
import { CarTabs } from '@/ui/CarTabs';
import { DissectTools } from '@/ui/DissectTools';
import { PartPanel } from '@/ui/PartPanel';
import { StaticCars } from '@/ui/StaticCars';
import { SystemList } from '@/ui/SystemList';
import { useReducedMotion } from '@/ui/useReducedMotion';

export default function DissectPage() {
  const { carId } = useParams();
  const part = useView((s) => s.part);
  const system = useView((s) => s.system);
  const xray = useView((s) => s.xray);
  const peel = useView((s) => s.peel);
  const explode = useView((s) => s.explode);
  const cut = useView((s) => s.cut);
  const cutPos = useView((s) => s.cutPos);
  const cam = useView((s) => s.cam);
  const livery = useView((s) => s.livery);
  const set = useView((s) => s.set);
  const reduced = useReducedMotion();
  const [camNonce, setCamNonce] = useState(0);

  const pickFromModel = useCallback((id: PartId | null) => set({ part: id }), [set]);
  const pickFromList = useCallback(
    (id: PartId) => {
      const s = useView.getState();
      // A part buried under layers that are still on would glow unseen: switch to x-ray.
      set({ part: id, system: null, xray: s.xray || SYSTEM_LAYER[PART_SYSTEM[id]] > s.peel });
    },
    [set],
  );
  const pickSystem = useCallback((id: SystemId) => set({ system: id, part: null, xray: true }), [set]);
  const onCamera = useCallback(
    (c: CamPreset) => {
      set({ cam: c });
      setCamNonce((n) => n + 1);
    },
    [set],
  );
  const reset = useCallback(() => {
    const d = DEFAULT_VIEW;
    set({
      part: null,
      system: null,
      xray: d.xray,
      peel: d.peel,
      explode: d.explode,
      cut: d.cut,
      cutPos: d.cutPos,
      cam: d.cam,
    });
    setCamNonce((n) => n + 1);
  }, [set]);

  if (!isCarId(carId)) return <Navigate to="/bedah/seal" replace />;
  const car = CARS[carId];
  const factory = livery === 'factory';
  const qs = serializeView({ ...DEFAULT_VIEW, part, system, xray, peel, explode, cut, cutPos, cam, livery });

  return (
    <div className="flex flex-col lg:h-stage lg:flex-row">
      <h1 className="sr-only">{UI.dissect.title(car.name)}</h1>
      <div className="flex min-w-0 flex-1 flex-col lg:order-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-3 py-2">
          <CarTabs search={qs ? `?${qs}` : ''} />
          <div className="flex items-center gap-3 text-xs text-muted">
            <label className="flex items-center gap-2 text-text">
              <input
                type="checkbox"
                checked={!factory}
                onChange={(e) => set({ livery: e.target.checked ? 'theme' : 'factory' })}
              />
              {UI.garage.liveryToggle}
            </label>
            <span className="rounded border border-line px-1">
              {factory ? UI.common.factoryLivery : UI.common.themeLivery}
            </span>
          </div>
        </div>
        <div className="relative h-80 min-h-0 sm:h-96 lg:h-auto lg:flex-1">
          <div className="absolute inset-0">
            {hasWebgl() ? (
              <DissectScene
                label={UI.dissect.canvas(car.name)}
                carId={carId}
                part={part}
                system={system}
                xray={xray}
                peel={peel}
                explode={explode}
                cut={cut}
                cutPos={cutPos}
                cam={cam}
                camNonce={camNonce}
                livery={livery}
                instant={reduced}
                onSelect={pickFromModel}
              />
            ) : (
              <StaticCars cars={[carId]} />
            )}
          </div>
        </div>
        <p className="border-t border-line bg-bg px-3 py-1 text-xs text-muted">
          {UI.common.illustration} {UI.dissect.hint}
        </p>
        <DissectTools
          view={{ peel, explode, cut, cutPos, xray, cam }}
          onChange={set}
          onCamera={onCamera}
          onReset={reset}
        />
      </div>
      <aside className="border-line p-3 lg:order-3 lg:w-96 lg:shrink-0 lg:overflow-y-auto lg:border-l">
        <PartPanel carId={carId} part={part} onClear={() => set({ part: null })} />
      </aside>
      <aside className="border-t border-line p-3 lg:order-1 lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-t-0">
        <SystemList carId={carId} part={part} system={system} onPart={pickFromList} onSystem={pickSystem} />
      </aside>
    </div>
  );
}
