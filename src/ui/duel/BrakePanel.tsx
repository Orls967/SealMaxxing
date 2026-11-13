import { CAR_LIST } from '@/content/cars';
import { UI } from '@/content/ui';
import { fmt } from '@/lib/format';
import { simulateBrake } from '@/lib/sim/brake';
import { brakeInputFor } from '@/lib/sim/params';
import { ModelBars } from './ModelBars';

const FROM = ['100', '200'] as const;

export function BrakePanel({ from: raw, onFrom }: { from: string | null; onFrom: (v: string) => void }) {
  const from = FROM.find((f) => f === raw) ?? '100';
  const res = CAR_LIST.map((car) => {
    const top = car.specs.topSpeedKmh?.value ?? 0;
    return { car, r: Number(from) <= top ? simulateBrake(brakeInputFor(car), Number(from)) : null, top };
  });
  return (
    <div className="flex flex-col gap-3">
      <fieldset className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface p-3 text-sm">
        <legend className="sr-only">{UI.duel.brakeFrom}</legend>
        <span>{UI.duel.brakeFrom}</span>
        {FROM.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={from === f}
            onClick={() => onFrom(f)}
            className={`rounded border px-3 py-1 font-medium ${from === f ? 'border-accent bg-accent text-text' : 'border-line bg-surface-2 text-text hover:border-accent'}`}
          >
            {f}–0 km/jam
          </button>
        ))}
      </fieldset>
      <div className="grid gap-3 lg:grid-cols-2">
        <ModelBars
          title={`${UI.duel.brakeDist} (m) · ${UI.common.simpleModel.toLowerCase()}`}
          bars={res.map(({ car, r, top }) => ({
            carId: car.id,
            value: r ? r.distanceM : null,
            text: r ? `${fmt(r.distanceM, 1)} m` : UI.duel.never,
            sub: r
              ? `${UI.duel.brakeTime}: ${fmt(r.timeS, 2)} dtk · ${fmt(r.peakG, 2)} g`
              : UI.duel.neverWhy(top),
          }))}
        />
        <ModelBars
          title={`${UI.duel.brakeAero} (m)`}
          bars={res.map(({ car, r, top }) => {
            const gain = r ? r.distanceNoAeroM - r.distanceM : null;
            const none = r !== null && !brakeInputFor(car).downforce;
            return {
              carId: car.id,
              value: none ? null : gain,
              text: !r ? UI.duel.never : none ? UI.duel.dfNone : `−${fmt(gain ?? 0, 1)} m`,
              sub: !r
                ? UI.duel.neverWhy(top)
                : none
                  ? undefined
                  : `${fmt(r.distanceNoAeroM, 1)} m → ${fmt(r.distanceM, 1)} m`,
            };
          })}
        />
      </div>
      <p className="text-xs text-muted">{UI.duel.brakeNote}</p>
    </div>
  );
}
