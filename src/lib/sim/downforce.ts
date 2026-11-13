import type { Car } from '@/content/types';

export interface DownforceSpec {
  /** Claimed downforce (kg) at `refKmh`. */
  refKg: number;
  refKmh: number;
  /** Active aero holds downforce at the claimed figure above the reference speed. */
  capped: boolean;
}

/** Reads the measurement speed out of a basis such as "pada 257 km/jam, mode Race". */
export function parseRefSpeed(basis: string | undefined): number | null {
  const m = /pada\s+([\d.]+)\s*km\/jam/i.exec(basis ?? '');
  if (!m?.[1]) return null;
  const n = Number(m[1].replace(/\./g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Single-point downforce spec from the car's claimed figure, or null when it makes none. */
export function downforceSpecFor(car: Car, capped: boolean): DownforceSpec | null {
  const d = car.specs.downforceKg;
  const refKmh = parseRefSpeed(d?.basis);
  if (!d || refKmh === null) return null;
  return { refKg: d.value, refKmh, capped };
}

/** F(v) = F_ref × (v / v_ref)², optionally capped at the claimed figure. An estimate from one point. */
export function downforceKg(spec: DownforceSpec | null, kmh: number): number {
  if (!spec || kmh <= 0) return 0;
  const f = spec.refKg * (kmh / spec.refKmh) ** 2;
  return spec.capped ? Math.min(f, spec.refKg) : f;
}
