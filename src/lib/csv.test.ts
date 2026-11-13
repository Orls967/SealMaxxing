import { describe, expect, it } from 'vitest';
import { CARS } from '@/content/cars';
import { METRIC_BY_ID } from '@/content/metrics';
import { cellFor } from './compare';
import { cellText, toCsv } from './csv';

const L = { absent: 'Tidak ada', unknown: 'Tidak dipublikasikan', unverified: 'perlu verifikasi' };

describe('csv', () => {
  it('quotes fields containing commas, quotes or newlines', () => {
    expect(
      toCsv([
        ['a', 'b,c'],
        ['d"e', 'f\ng'],
      ]),
    ).toBe('a,"b,c"\r\n"d""e","f\ng"');
  });
  it('exports value, basis and verification status', () => {
    expect(cellText(cellFor(CARS.seal, METRIC_BY_ID.evRangeKm), 'km', 0, L)).toBe('520 km (WLTP)');
    expect(cellText(cellFor(CARS.senna, METRIC_BY_ID.kerbKg), 'kg', 0, L)).toContain('[perlu verifikasi]');
  });
  it('exports absence with its reason, never a zero', () => {
    const t = cellText(cellFor(CARS.senna, METRIC_BY_ID.batteryKwh), 'kWh', 2, L);
    expect(t.startsWith('Tidak ada: ')).toBe(true);
    expect(cellText(cellFor(CARS.seal, METRIC_BY_ID.batteryKg), 'kg', 0, L)).toBe('Tidak dipublikasikan');
  });
});
