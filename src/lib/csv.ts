import type { Cell } from './compare';
import { fmtSourced } from './format';

const esc = (s: string): string => (/[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

/** RFC 4180 CSV with a BOM-free header row. */
export function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map(esc).join(',')).join('\r\n');
}

/** Plain-text form of a cell for export: value with unit, basis and status, or the absence. */
export function cellText(cell: Cell, unit: string, digits: number, labels: { absent: string; unknown: string; unverified: string }): string {
  switch (cell.kind) {
    case 'value': {
      const d = cell.data;
      const parts = [fmtSourced(d, unit, digits)];
      if (d.basis) parts.push(`(${d.basis})`);
      if (!d.verified) parts.push(`[${labels.unverified}]`);
      return parts.join(' ');
    }
    case 'absent':
      return `${labels.absent}: ${cell.reason}`;
    case 'unknown':
      return labels.unknown;
    default: {
      const never: never = cell;
      return never;
    }
  }
}
