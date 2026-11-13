import {
  CAR_IDS,
  MAX_LAYER,
  isCarId,
  isPartId,
  isSystemId,
  type CarId,
  type PartId,
  type SystemId,
} from '@/content/ids';

export const CAM_PRESETS = ['quarter', 'front', 'side', 'top', 'bottom'] as const;
export type CamPreset = (typeof CAM_PRESETS)[number];
export const CUT_AXES = ['x', 'y', 'z'] as const;
export type CutAxis = (typeof CUT_AXES)[number];
export const LAYOUTS = ['side', 'overlay'] as const;
export type Layout = (typeof LAYOUTS)[number];
export const ANCHORS = ['front', 'mid', 'ground'] as const;
export type Anchor = (typeof ANCHORS)[number];
export const ADU_MODES = ['accel', 'brake', 'downforce', 'energy'] as const;
export type AduMode = (typeof ADU_MODES)[number];
export const LIVERIES = ['theme', 'factory'] as const;
export type Livery = (typeof LIVERIES)[number];

/** Everything about a view that can be shared through the URL. */
export interface ViewState {
  part: PartId | null;
  system: SystemId | null;
  xray: boolean;
  /** Layers with index < peel are peeled away (0..MAX_LAYER). */
  peel: number;
  /** 0..100 */
  explode: number;
  cut: CutAxis | null;
  /** 0..100 along the cut axis. */
  cutPos: number;
  cam: CamPreset;
  cars: CarId[];
  layout: Layout;
  anchor: Anchor;
  sync: boolean;
  livery: Livery;
  /** Data page: charted metric, group filter, search text, extreme variants. */
  metric: string | null;
  group: string | null;
  query: string;
  extreme: boolean;
  /** Adu page. */
  mode: AduMode;
  dist: string | null;
  speed: number;
}

export const DEFAULT_VIEW: ViewState = {
  part: null,
  system: null,
  xray: false,
  peel: 0,
  explode: 0,
  cut: null,
  cutPos: 50,
  cam: 'quarter',
  cars: [...CAR_IDS],
  layout: 'side',
  anchor: 'front',
  sync: true,
  livery: 'theme',
  metric: null,
  group: null,
  query: '',
  extreme: false,
  mode: 'accel',
  dist: null,
  speed: 250,
};

const oneOf = <T extends string>(list: readonly T[], x: string | null): T | null =>
  list.find((v) => v === x) ?? null;

function int(x: string | null, min: number, max: number, fallback: number): number {
  if (x === null || x.trim() === '') return fallback;
  const n = Number(x);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
}

/** Parses a query string (with or without the leading "?"). Unknown or invalid values fall back to defaults. */
export function parseView(search: string): ViewState {
  const q = new URLSearchParams(search);
  const cars = [...new Set((q.get('cars') ?? '').split(',').filter(isCarId))];
  const d = DEFAULT_VIEW;
  const part = q.get('part');
  const sys = q.get('sys');
  return {
    part: isPartId(part) ? part : null,
    system: isSystemId(sys) ? sys : null,
    xray: q.get('xray') === '1',
    peel: int(q.get('peel'), 0, MAX_LAYER, d.peel),
    explode: int(q.get('ex'), 0, 100, d.explode),
    cut: oneOf(CUT_AXES, q.get('cut')),
    cutPos: int(q.get('cp'), 0, 100, d.cutPos),
    cam: oneOf(CAM_PRESETS, q.get('cam')) ?? d.cam,
    cars: cars.length >= 2 ? CAR_IDS.filter((c) => cars.includes(c)) : [...CAR_IDS],
    layout: oneOf(LAYOUTS, q.get('lay')) ?? d.layout,
    anchor: oneOf(ANCHORS, q.get('anc')) ?? d.anchor,
    sync: q.get('sync') !== '0',
    livery: oneOf(LIVERIES, q.get('liv')) ?? d.livery,
    metric: q.get('m') || null,
    group: q.get('g') || null,
    query: q.get('q') ?? '',
    extreme: q.get('ext') === '1',
    mode: oneOf(ADU_MODES, q.get('mode')) ?? d.mode,
    dist: q.get('dist') || null,
    speed: int(q.get('v'), 0, 350, d.speed),
  };
}

/** Serialises only the values that differ from the defaults, in a stable order. */
export function serializeView(v: ViewState): string {
  const d = DEFAULT_VIEW;
  const q = new URLSearchParams();
  if (v.part) q.set('part', v.part);
  if (v.system) q.set('sys', v.system);
  if (v.xray) q.set('xray', '1');
  if (v.peel !== d.peel) q.set('peel', String(v.peel));
  if (v.explode !== d.explode) q.set('ex', String(v.explode));
  if (v.cut) {
    q.set('cut', v.cut);
    if (v.cutPos !== d.cutPos) q.set('cp', String(v.cutPos));
  }
  if (v.cam !== d.cam) q.set('cam', v.cam);
  if (v.cars.length !== CAR_IDS.length) q.set('cars', v.cars.join(','));
  if (v.layout !== d.layout) q.set('lay', v.layout);
  if (v.anchor !== d.anchor) q.set('anc', v.anchor);
  if (!v.sync) q.set('sync', '0');
  if (v.livery !== d.livery) q.set('liv', v.livery);
  if (v.metric) q.set('m', v.metric);
  if (v.group) q.set('g', v.group);
  if (v.query) q.set('q', v.query);
  if (v.extreme) q.set('ext', '1');
  if (v.mode !== d.mode) q.set('mode', v.mode);
  if (v.dist) q.set('dist', v.dist);
  if (v.speed !== d.speed) q.set('v', String(v.speed));
  return q.toString().replace(/%2C/g, ',');
}

/** Adds or removes a car while keeping at least two selected, in canonical order. */
export function toggleCar(cars: CarId[], id: CarId): CarId[] {
  const next = cars.includes(id) ? cars.filter((c) => c !== id) : [...cars, id];
  return next.length < 2 ? cars : CAR_IDS.filter((c) => next.includes(c));
}
