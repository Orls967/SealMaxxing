import { UI } from '@/content/ui';
import type { Cell } from '@/lib/compare';
import { fmtSourced, kwToPs, fmt } from '@/lib/format';
import { SourceBadge } from './SourceBadge';

interface Props {
  cell: Cell;
  unit: string;
  digits?: number;
  best?: boolean;
  /** Compact: value and status only, without the basis line. */
  compact?: boolean;
  /** Show the PS conversion next to kW values (power figures only). */
  ps?: boolean;
}

/** One metric value with unit, basis and verification status; or an explicit absence. */
export function MetricValue({ cell, unit, digits = 0, best = false, compact = false, ps = true }: Props) {
  switch (cell.kind) {
    case 'value': {
      const d = cell.data;
      return (
        <span className="inline-flex flex-col gap-0.5">
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className={`tnum font-semibold ${best ? 'text-accent-text' : 'text-text'}`}>{fmtSourced(d, unit, digits)}</span>
            {ps && unit === 'kW' && !d.basis?.includes('PS') && <span className="tnum text-xs text-muted">{fmt(kwToPs(d.value))} PS</span>}
            {best && <span className="rounded bg-accent px-1 text-xs leading-tight text-text">{UI.common.best}</span>}
            <SourceBadge verified={d.verified} />
          </span>
          {!compact && d.basis && <span className="text-xs text-muted">{d.basis}{d.market ? ` · ${d.market}` : ''}</span>}
        </span>
      );
    }
    case 'absent':
      return (
        <span className="inline-flex flex-col gap-0.5">
          <span className="text-sm text-muted">{UI.common.absent}</span>
          {!compact && <span className="text-xs text-muted">{cell.reason}</span>}
        </span>
      );
    case 'unknown':
      return (
        <span className="text-sm text-muted" title={UI.common.unknownHint}>
          {UI.common.unknown}
        </span>
      );
    default: {
      const never: never = cell;
      return never;
    }
  }
}
