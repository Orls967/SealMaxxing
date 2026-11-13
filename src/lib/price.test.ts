import { describe, expect, it } from 'vitest';
import type { Price } from '@/content/types';
import { fmtIdr, priceView, toIdr } from './price';

const usd: Price = {
  amount: 958966,
  currency: 'USD',
  year: 2018,
  basis: 'test',
  sources: ['spec'],
  verified: false,
};
const rp: Price = { ...usd, amount: 750_000_000, currency: 'IDR', year: 2026 };

describe('price', () => {
  it('converts dollars at the given rate and rounds to whole rupiah', () => {
    expect(toIdr(usd, 18100)).toBe(17_357_284_600);
    expect(toIdr({ ...usd, amount: 0.05 }, 18100)).toBe(905);
  });

  it('leaves rupiah prices unconverted', () => {
    expect(toIdr(rp, 18100)).toBe(750_000_000);
    expect(priceView(rp).idr).toBeNull();
    expect(priceView(rp).original).toBe('Rp750.000.000');
  });

  it('shows the original currency next to the rupiah equivalent', () => {
    const v = priceView(usd, 18100);
    expect(v.original).toBe('$958.966');
    expect(v.idr).toBe('Rp17.357.284.600');
    expect(v.year).toBe(2018);
  });

  it('formats rupiah with Indonesian grouping', () => {
    expect(fmtIdr(1234567.4)).toBe('Rp1.234.567');
  });
});
