import { FX } from '@/content/fx';
import type { Price } from '@/content/types';

export interface PriceView {
  /** Price in its original currency, e.g. "$958.966" or "Rp750.000.000". */
  original: string;
  /** Rounded rupiah equivalent; null when the original is already in rupiah. */
  idr: string | null;
  idrAmount: number;
  year: number;
}

const whole = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

export const fmtIdr = (n: number): string => `Rp${whole.format(Math.round(n))}`;
export const fmtUsd = (n: number): string => `$${whole.format(Math.round(n))}`;

/** Rupiah value of a price: unchanged for IDR, USD × the fixed project rate otherwise. */
export function toIdr(p: Price, rate: number = FX.usdToIdr): number {
  switch (p.currency) {
    case 'IDR':
      return p.amount;
    case 'USD':
      return Math.round(p.amount * rate);
    default: {
      const never: never = p.currency;
      return never;
    }
  }
}

export function priceView(p: Price, rate: number = FX.usdToIdr): PriceView {
  const idrAmount = toIdr(p, rate);
  return p.currency === 'IDR'
    ? { original: fmtIdr(p.amount), idr: null, idrAmount, year: p.year }
    : { original: fmtUsd(p.amount), idr: fmtIdr(idrAmount), idrAmount, year: p.year };
}
