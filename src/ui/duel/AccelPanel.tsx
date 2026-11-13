import { useEffect, useMemo, useRef, useState } from 'react';
import { CAR_LIST } from '@/content/cars';
import type { MetricId } from '@/content/metrics';
import { UI } from '@/content/ui';
import { cellFor } from '@/lib/compare';
import { fmt } from '@/lib/format';
import { simulateAccel } from '@/lib/sim/accel';
import { accelInputFor } from '@/lib/sim/params';
import { MarkSwatch, markFill } from '../charts/ChartDefs';
import { LineChart, type Series } from '../charts/LineChart';
import { MetricValue } from '../MetricValue';

const TARGETS = ['100', '200', '300', '402', '1000'] as const;
type Target = (typeof TARGETS)[number];
const CLAIM: Partial<Record<Target, MetricId>> = {
  '100': 'zeroTo100S',
  '200': 'zeroTo200S',
  '300': 'zeroTo300S',
};
const isDistance = (t: Target) => t === '402' || t === '1000';
const BTN =
  'rounded border border-line bg-surface-2 px-3 py-1 text-sm font-medium text-text hover:border-accent';

export function AccelPanel({
  target: raw,
  onTarget,
  instant,
}: {
  target: string | null;
  onTarget: (t: string) => void;
  instant: boolean;
}) {
  const target: Target = TARGETS.find((t) => t === raw) ?? '200';
  const runs = useMemo(
    () => CAR_LIST.map((car) => ({ car, run: simulateAccel(accelInputFor(car), 45) })),
    [],
  );
  const results = runs.map(({ car, run }) => ({
    car,
    time: isDistance(target) ? run.toDistance(Number(target)) : run.toSpeed(Number(target)),
  }));
  const tEnd = Math.min(45, Math.max(1, ...results.map((r) => r.time ?? 0)) * 1.05);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = useRef<number | null>(null);

  useEffect(() => {
    setT(0);
    setPlaying(false);
  }, [target]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = (now: number) => {
      const dt = last.current === null ? 0 : (now - last.current) / 1000;
      last.current = now;
      setT((prev) => {
        const next = Math.min(tEnd, prev + dt);
        if (next >= tEnd) setPlaying(false);
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    last.current = null;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, tEnd]);

  const start = () => {
    if (instant) return setT(tEnd);
    if (t >= tEnd) setT(0);
    setPlaying(true);
  };

  const at = (i: number) =>
    runs[i]!.run.samples[Math.min(runs[i]!.run.samples.length - 1, Math.round(t * 100))]!;
  const xEnd = Math.max(
    1,
    ...runs.map(({ run }) => run.samples[Math.min(run.samples.length - 1, Math.round(tEnd * 100))]!.x),
  );
  const upto = Math.round(tEnd * 100);
  const series = (key: 'v' | 'x'): Series[] =>
    runs.map(({ car, run }) => ({
      carId: car.id,
      points: run.samples.filter((_, i) => i % 10 === 0 && i <= upto).map((s) => [s.t, s[key]]),
    }));
  const tableXs = [0.25, 0.5, 0.75, 1].map((f) => Math.round(tEnd * f * 10) / 10);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-3 text-sm">
        <label className="flex items-center gap-2">
          {UI.duel.target}
          <select
            className="rounded border border-line bg-surface-2 px-2 py-1 text-text"
            value={target}
            onChange={(e) => onTarget(e.target.value)}
          >
            {TARGETS.map((x) => (
              <option key={x} value={x}>
                {UI.duel.targets[x]}
              </option>
            ))}
          </select>
        </label>
        {playing ? (
          <button type="button" className={BTN} onClick={() => setPlaying(false)}>
            {UI.duel.pause}
          </button>
        ) : (
          <button
            type="button"
            className="rounded bg-accent px-3 py-1 text-sm font-semibold text-text hover:bg-accent-dim"
            onClick={start}
          >
            {UI.duel.start}
          </button>
        )}
        <button type="button" className={BTN} onClick={() => (setPlaying(false), setT(0))}>
          {UI.duel.restart}
        </button>
        <span className="tnum ml-auto font-display text-2xl font-bold" aria-live="off">
          {UI.duel.time}: {fmt(t, 2)} dtk
        </span>
      </div>

      <figure className="rounded-lg border border-line bg-surface p-3">
        <svg viewBox="0 0 640 132" role="img" aria-label={UI.duel.track} className="w-full">
          {runs.map(({ car }, i) => {
            const s = at(i);
            const x = 8 + (s.x / xEnd) * 560;
            const y = 6 + i * 31;
            return (
              <g key={car.id}>
                <line x1="8" x2="632" y1={y + 24} y2={y + 24} className="stroke-line" />
                <rect x={x} y={y + 6} width="34" height="14" rx="5" fill={markFill(car.id)} />
                <text x={Math.min(x + 40, 520)} y={y + 17} className="tnum fill-text text-xs">
                  {car.short} · {fmt(s.v)} km/jam · {fmt(s.x)} m
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className="text-xs text-muted">{UI.duel.track}</figcaption>
      </figure>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            {UI.duel.result}: {UI.duel.targets[target]}
          </caption>
          <thead>
            <tr className="bg-surface text-left">
              <th scope="col" className="px-3 py-2">
                {UI.common.car}
              </th>
              <th scope="col" className="px-3 py-2">
                {UI.common.model}{' '}
                <span className="font-normal text-muted">({UI.common.simpleModel.toLowerCase()})</span>
              </th>
              <th scope="col" className="px-3 py-2">
                {UI.common.claim}
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ car, time }) => {
              const claim = CLAIM[target];
              const top = car.specs.topSpeedKmh?.value;
              return (
                <tr key={car.id} className="border-t border-line align-top">
                  <th scope="row" className="px-3 py-2 text-left font-medium">
                    <span className="flex items-center gap-2">
                      <MarkSwatch id={car.id} />
                      {car.short}
                    </span>
                  </th>
                  <td className="px-3 py-2">
                    {time === null ? (
                      <span className="text-muted">
                        {UI.duel.never}
                        {top !== undefined && <span className="block text-xs">{UI.duel.neverWhy(top)}</span>}
                      </span>
                    ) : (
                      <span className="tnum font-semibold">{fmt(time, 1)} dtk</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {claim ? (
                      <MetricValue cell={cellFor(car, { id: claim })} unit="dtk" digits={1} />
                    ) : (
                      <span className="text-muted">–</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <LineChart
          title={UI.duel.speedTime}
          xLabel={UI.duel.axisTime}
          yLabel={UI.duel.axisSpeed}
          series={series('v')}
          tableXs={tableXs}
          cursor={Math.min(t, tEnd)}
        />
        <LineChart
          title={UI.duel.distTime}
          xLabel={UI.duel.axisTime}
          yLabel={UI.duel.axisDist}
          series={series('x')}
          tableXs={tableXs}
          cursor={Math.min(t, tEnd)}
        />
      </div>
    </div>
  );
}
