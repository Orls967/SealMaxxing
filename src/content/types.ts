import type { CarId, PartId } from './ids';
import type { MetricId } from './metrics';
import type { SourceId } from './sources';

export type Qualifier = 'exact' | 'approx' | 'lessThan' | 'greaterThan' | 'limited';

export interface Sourced<T = number> {
  value: T;
  basis?: string;
  qualifier?: Qualifier;
  sources: SourceId[];
  verified: boolean;
  market?: string;
}

export type Presence = { kind: 'present' } | { kind: 'absent'; reason: string };

export type SpecMap = Partial<Record<MetricId, Sourced>>;

export interface ExtremeVariant {
  name: string;
  note: string;
  specs: SpecMap;
}

export interface Car {
  id: CarId;
  maker: string;
  name: string;
  short: string;
  kind: 'bev' | 'hybrid' | 'phev' | 'ice';
  kindLabel: string;
  years: string;
  role: string;
  price: Sourced<string>;
  specs: SpecMap;
  /** Metrics that do not apply to this car, with the reason. */
  absent: Partial<Record<MetricId, string>>;
  extreme?: ExtremeVariant;
}

export interface PartText {
  presence: Presence;
  summary: string;
  how: string;
  why: string;
  facts?: MetricId[];
}

export type CarParts = Record<PartId, PartText>;

type Extra = Omit<Sourced, 'value' | 'sources' | 'verified'>;
/** Verified against at least one listed source. */
export const ok = (value: number, sources: SourceId[], extra: Extra = {}): Sourced => ({
  value,
  sources,
  verified: true,
  ...extra,
});
/** Starting data not yet confirmed against a source. */
export const tbc = (value: number, extra: Extra = {}, sources: SourceId[] = ['spec']): Sourced => ({
  value,
  sources,
  verified: false,
  ...extra,
});

export const part = (summary: string, how: string, why: string, facts?: MetricId[]): PartText => ({
  presence: { kind: 'present' },
  summary,
  how,
  why,
  ...(facts ? { facts } : {}),
});
export const noPart = (reason: string, summary: string, how: string, why: string): PartText => ({
  presence: { kind: 'absent', reason },
  summary,
  how,
  why,
});
