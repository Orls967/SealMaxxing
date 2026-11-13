import { useState } from 'react';
import { CAR_LIST } from '@/content/cars';
import { UI } from '@/content/ui';
import { cellFor } from '@/lib/compare';
import { fmt } from '@/lib/format';
import { downforceKg, downforceSpecFor } from '@/lib/sim/downforce';
import { MODEL } from '@/lib/sim/params';
import { markFill } from '../charts/ChartDefs';
import { LineChart, type Series } from '../charts/LineChart';
import { MetricValue } from '../MetricValue';

const SPEEDS = Array.from({ length: 36 }, (_, i) => i * 10);
const WING = ['low', 'high', 'brake'] as const;
type Wing = (typeof WING)[number];
const ANGLE: Record<Wing, number> = { low: 0, high: -14, brake: -58 };

export function DownforcePanel({ speed, onSpeed }: { speed: number; onSpeed: (v: number) => void }) {
  const [wing, setWing] = useState<Wing>('high');
  const cars = CAR_LIST.map((car) => {
    const spec = downforceSpecFor(car, MODEL[car.id].downforceCapped);
    return { car, spec, kg: spec ? downforceKg(spec, speed) : null };
  });
  const max = Math.max(1, ...cars.map((c) => (c.spec ? downforceKg(c.spec, 350) : 0)));
  const series: Series[] = cars.map(({ car, spec }) =>
    spec
      ? { carId: car.id, points: SPEEDS.map((v) => [v, downforceKg(spec, v)]) }
      : { carId: car.id, points: [], absent: UI.dissect.absentTag },
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-surface p-3 text-sm">
        <label className="flex min-w-0 flex-1 items-center gap-3">
          <span className="shrink-0">{UI.duel.speed}</span>
          <input
            type="range"
            min={0}
            max={350}
            step={5}
            value={speed}
            onChange={(e) => onSpeed(Number(e.target.value))}
            className="min-w-0 flex-1"
            aria-valuetext={`${speed} km/jam`}
          />
          <span className="tnum w-24 shrink-0 font-display text-xl font-bold">{fmt(speed)} km/jam</span>
        </label>
        <fieldset className="flex flex-wrap items-center gap-1">
          <legend className="sr-only">{UI.duel.wing}</legend>
          <span className="mr-1">{UI.duel.wing}</span>
          {WING.map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={wing === w}
              onClick={() => setWing(w)}
              className={`rounded border px-2 py-1 text-xs font-medium ${wing === w ? 'border-accent bg-accent text-text' : 'border-line bg-surface-2 text-text hover:border-accent'}`}
            >
              {UI.duel.wingModes[w]}
            </button>
          ))}
        </fieldset>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cars.map(({ car, spec, kg }) => {
          const over = car.specs.topSpeedKmh ? speed > car.specs.topSpeedKmh.value : false;
          const len = kg === null ? 0 : 8 + (kg / max) * 62;
          const active = spec !== null;
          return (
            <li key={car.id} className="rounded-lg border border-line bg-surface p-3">
              <h3 className="font-semibold">{car.short}</h3>
              <svg
                viewBox="0 0 200 130"
                role="img"
                aria-label={kg === null ? `${car.short}: ${UI.duel.dfNone}` : `${car.short}: ${fmt(kg)} kg`}
                className="w-full"
              >
                <line x1="6" x2="194" y1="118" y2="118" className="stroke-line" />
                <path
                  d="M22 108 Q26 92 60 88 L92 72 Q118 66 140 76 L172 86 Q182 92 182 108 Z"
                  fill={markFill(car.id)}
                  fillOpacity="0.9"
                />
                <circle cx="56" cy="108" r="10" className="fill-bg stroke-muted" />
                <circle cx="150" cy="108" r="10" className="fill-bg stroke-muted" />
                <g transform={`rotate(${active ? ANGLE[wing] : 0} 172 70)`}>
                  <rect x="152" y="68" width="40" height="4" rx="2" className="fill-accent" />
                </g>
                <line x1="172" x2="172" y1="72" y2="86" className="stroke-muted" />
                {kg !== null && kg > 0 && (
                  <g className="stroke-accent-text fill-accent-text">
                    <line x1="100" x2="100" y1={62 - len} y2="60" strokeWidth="4" />
                    <path d="M92 58 L108 58 L100 70 Z" />
                  </g>
                )}
              </svg>
              {kg === null ? (
                <p className="text-sm text-muted">{UI.duel.dfNone}</p>
              ) : (
                <p className="tnum text-sm">
                  <span className="font-display text-2xl font-bold">{fmt(kg)} kg</span>{' '}
                  <span className="rounded border border-line px-1 text-xs text-muted">
                    {UI.common.estimate}
                  </span>
                  {spec?.capped && kg >= spec.refKg && (
                    <span className="block text-xs text-muted">{UI.duel.capped}</span>
                  )}
                  {over && (
                    <span className="block text-xs text-warn">
                      {UI.duel.neverWhy(car.specs.topSpeedKmh?.value ?? 0)}
                    </span>
                  )}
                </p>
              )}
              <p className="mt-1 text-xs text-muted">{UI.common.claim}:</p>
              <p className="text-sm">
                <MetricValue cell={cellFor(car, { id: 'downforceKg' })} unit="kg" />
              </p>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted">
        {UI.duel.dfNote} {UI.duel.wingNote}
      </p>
      <div className="max-w-3xl">
        <LineChart
          title={UI.data.downforce}
          xLabel={UI.duel.axisSpeed}
          yLabel={UI.duel.axisForce}
          series={series}
          tableXs={[100, 150, 200, 250, 300, 350]}
          cursor={speed}
        />
      </div>
    </div>
  );
}
