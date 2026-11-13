import type { Car, Sourced } from '@/content/types';

export interface DerivedMetric {
  id: string;
  label: string;
  unit: string;
  better: 'higher' | 'lower' | 'none';
  digits: number;
  note: string;
  get: (car: Car) => Sourced | null;
}

function combine(value: number, parts: (Sourced | undefined)[], basis: string): Sourced | null {
  if (parts.some((p) => !p) || !Number.isFinite(value)) return null;
  const ps = parts as Sourced[];
  return {
    value,
    basis,
    sources: [...new Set(ps.flatMap((p) => p.sources))],
    verified: ps.every((p) => p.verified),
    qualifier: 'approx',
  };
}

export const DERIVED: DerivedMetric[] = [
  {
    id: 'powerPerTonneKw',
    label: 'Daya per ton',
    unit: 'kW/ton',
    better: 'higher',
    digits: 0,
    note: 'Daya gabungan dibagi berat siap jalan.',
    get: (c) => {
      const p = c.specs.powerTotalKw;
      const m = c.specs.kerbKg;
      return combine(p && m ? p.value / (m.value / 1000) : NaN, [p, m], 'daya gabungan ÷ berat siap jalan');
    },
  },
  {
    id: 'torquePerTonneNm',
    label: 'Torsi per ton',
    unit: 'Nm/ton',
    better: 'higher',
    digits: 0,
    note: 'Torsi gabungan dibagi berat siap jalan.',
    get: (c) => {
      const t = c.specs.torqueTotalNm;
      const m = c.specs.kerbKg;
      return combine(t && m ? t.value / (m.value / 1000) : NaN, [t, m], 'torsi gabungan ÷ berat siap jalan');
    },
  },
  {
    id: 'electricSharePct',
    label: 'Porsi daya listrik',
    unit: '%',
    better: 'none',
    digits: 0,
    note: 'Daya motor listrik dibagi daya gabungan.',
    get: (c) => {
      const p = c.specs.powerTotalKw;
      if (c.absent.motorPowerKw && p) return { ...p, value: 0, basis: 'tidak ada motor listrik', qualifier: 'exact' };
      const e = c.specs.motorPowerKw;
      return combine(e && p ? (e.value / p.value) * 100 : NaN, [e, p], 'daya motor ÷ daya gabungan');
    },
  },
  {
    id: 'batteryWhPerKg',
    label: 'Energi baterai per kg',
    unit: 'Wh/kg',
    better: 'none',
    digits: 0,
    note: 'Baterai hibrida dirancang untuk daya sesaat, bukan kapasitas, jadi angkanya rendah.',
    get: (c) => {
      const e = c.specs.batteryKwh;
      const m = c.specs.batteryKg;
      return combine(e && m ? (e.value * 1000) / m.value : NaN, [e, m], 'kapasitas ÷ massa paket');
    },
  },
  {
    id: 'kgPerMeter',
    label: 'Berat per meter panjang',
    unit: 'kg/m',
    better: 'none',
    digits: 0,
    note: 'Berat siap jalan dibagi panjang bodi.',
    get: (c) => {
      const m = c.specs.kerbKg;
      const l = c.specs.lengthMm;
      return combine(m && l ? m.value / (l.value / 1000) : NaN, [m, l], 'berat siap jalan ÷ panjang');
    },
  },
];
