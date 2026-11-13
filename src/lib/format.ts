import type { Qualifier, Sourced } from '@/content/types';

const cache = new Map<number, Intl.NumberFormat>();
export function fmt(n: number, digits = 0): string {
  let f = cache.get(digits);
  if (!f) {
    f = new Intl.NumberFormat('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits });
    cache.set(digits, f);
  }
  return f.format(n);
}

const PREFIX: Record<Qualifier, string> = {
  exact: '',
  approx: '± ',
  lessThan: '< ',
  greaterThan: '> ',
  limited: '',
};

export function fmtSourced(s: Sourced, unit: string, digits = 0): string {
  const year = unit === '' && s.value > 1900 && s.value < 2100 && Number.isInteger(s.value);
  const num = year ? String(s.value) : fmt(s.value, digits);
  return `${PREFIX[s.qualifier ?? 'exact']}${num}${unit ? ` ${unit}` : ''}`;
}

export const KW_TO_PS = 1.35962;
export const kwToPs = (kw: number): number => Math.round(kw * KW_TO_PS);
