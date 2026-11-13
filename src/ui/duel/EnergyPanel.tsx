import { useState } from 'react';
import { CAR_LIST } from '@/content/cars';
import { ENERGY_FLOWS, FLOW_STATES, type FlowNode, type FlowState } from '@/content/energyFlows';
import { UI } from '@/content/ui';

const POS: Record<FlowNode, [number, number]> = {
  battery: [58, 44],
  tank: [58, 150],
  motorF: [200, 24],
  motor: [200, 84],
  engine: [200, 150],
  front: [342, 34],
  rear: [342, 110],
  heat: [342, 176],
};
const LABEL: Record<FlowNode, string> = {
  battery: UI.duel.nodes.battery,
  tank: UI.duel.nodes.tank,
  motorF: UI.duel.nodes.motorF,
  motor: UI.duel.nodes.motor,
  engine: UI.duel.nodes.engine,
  front: UI.duel.nodes.front,
  rear: UI.duel.nodes.rear,
  heat: UI.duel.nodes.heat,
};
const BW = 96;
const BH = 26;

export function EnergyPanel() {
  const [state, setState] = useState<FlowState>('accel');
  return (
    <div className="flex flex-col gap-3">
      <fieldset className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface p-3 text-sm">
        <legend className="sr-only">{UI.duel.energyState}</legend>
        <span>{UI.duel.energyState}</span>
        {FLOW_STATES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={state === s}
            onClick={() => setState(s)}
            className={`rounded border px-3 py-1 font-medium ${state === s ? 'border-accent bg-accent text-text' : 'border-line bg-surface-2 text-text hover:border-accent'}`}
          >
            {UI.duel.states[s]}
          </button>
        ))}
      </fieldset>
      <div className="grid gap-3 lg:grid-cols-2">
        {CAR_LIST.map((car) => {
          const flows = ENERGY_FLOWS[car.id];
          const used = new Set<FlowNode>(FLOW_STATES.flatMap((s) => flows[s].flatMap((e) => [e.from, e.to])));
          const edges = flows[state];
          const live = new Set<FlowNode>(edges.flatMap((e) => [e.from, e.to]));
          const name = (n: FlowNode) =>
            n === 'motor' && used.has('motorF') ? UI.duel.nodes.motorR : LABEL[n];
          const caption = UI.duel.flowCaption(car.short, UI.duel.states[state].toLowerCase());
          return (
            <figure key={car.id} className="rounded-lg border border-line bg-surface p-3">
              <figcaption className="font-semibold">
                {car.short} <span className="font-normal text-muted">· {car.kindLabel}</span>
              </figcaption>
              <svg viewBox="0 0 400 200" role="img" aria-label={caption} className="w-full">
                <defs>
                  <marker
                    id={`arrow-${car.id}`}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 0L10 5L0 10z" className="fill-accent-text" />
                  </marker>
                </defs>
                {edges.map((e, i) => {
                  const [x1, y1] = POS[e.from];
                  const [x2, y2] = POS[e.to];
                  const dir = x2 >= x1 ? 1 : -1;
                  const same = x1 === x2;
                  return (
                    <line
                      key={i}
                      x1={same ? x1 : x1 + (dir * BW) / 2}
                      y1={same ? y1 + (y2 > y1 ? BH / 2 : -BH / 2) : y1}
                      x2={same ? x2 : x2 - (dir * BW) / 2 - dir * 2}
                      y2={same ? y2 - (y2 > y1 ? BH / 2 + 2 : -BH / 2 - 2) : y2}
                      className="stroke-accent-text"
                      strokeWidth="2.5"
                      markerEnd={`url(#arrow-${car.id})`}
                    />
                  );
                })}
                {[...used].map((n) => {
                  const [x, y] = POS[n];
                  const on = live.has(n);
                  return (
                    <g key={n}>
                      <rect
                        x={x - BW / 2}
                        y={y - BH / 2}
                        width={BW}
                        height={BH}
                        rx="5"
                        className={on ? 'fill-surface-2 stroke-accent' : 'fill-surface stroke-line'}
                      />
                      <text
                        x={x}
                        y={y + 4}
                        textAnchor="middle"
                        className={`text-xs ${on ? 'fill-text' : 'fill-muted'}`}
                      >
                        {name(n)}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <table className="mt-1 w-full text-left text-xs">
                <caption className="sr-only">{caption}</caption>
                <thead>
                  <tr className="text-muted">
                    <th scope="col" className="pr-2 font-medium">
                      {UI.duel.flowTable.from}
                    </th>
                    <th scope="col" className="pr-2 font-medium">
                      {UI.duel.flowTable.to}
                    </th>
                    <th scope="col" className="font-medium">
                      {UI.duel.flowTable.note}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {edges.map((e, i) => (
                    <tr key={i} className="border-t border-line align-top">
                      <td className="pr-2">{name(e.from)}</td>
                      <td className="pr-2">{name(e.to)}</td>
                      <td className="text-text">{e.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
