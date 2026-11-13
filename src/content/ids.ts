export const CAR_IDS = ['seal', 'laferrari', 'p1', 'senna'] as const;
export type CarId = (typeof CAR_IDS)[number];

export const SYSTEM_PARTS = {
  body: ['body-panels', 'doors', 'glass', 'lights'],
  structure: ['tub', 'subframes', 'crash-structure'],
  powertrain: ['engine', 'induction', 'motor-front', 'motor-rear', 'transmission', 'driveline'],
  energy: ['battery', 'fuel-tank', 'power-electronics', 'charge-port'],
  thermal: ['radiators', 'battery-cooling', 'air-paths'],
  exhaust: ['exhaust'],
  suspension: ['suspension-front', 'suspension-rear', 'steering'],
  brakes: ['discs', 'calipers', 'regen', 'air-brake'],
  wheels: ['wheels', 'tires'],
  aero: ['front-aero', 'underbody', 'rear-wing', 'active-aero'],
  cabin: ['seats', 'dashboard', 'controls', 'cargo'],
  electronics: ['drive-modes', 'stability', 'driver-assist'],
} as const;

export type SystemId = keyof typeof SYSTEM_PARTS;
export type PartId = (typeof SYSTEM_PARTS)[SystemId][number];

export const SYSTEM_IDS = Object.keys(SYSTEM_PARTS) as SystemId[];
export const PART_IDS = SYSTEM_IDS.flatMap((s) => [...SYSTEM_PARTS[s]]) as PartId[];

export const PART_SYSTEM = Object.fromEntries(
  SYSTEM_IDS.flatMap((s) => SYSTEM_PARTS[s].map((p) => [p, s])),
) as Record<PartId, SystemId>;

/** Peel order: 0 = outermost. */
export const SYSTEM_LAYER: Record<SystemId, number> = {
  body: 0,
  cabin: 1,
  aero: 2,
  thermal: 2,
  exhaust: 2,
  electronics: 2,
  structure: 3,
  suspension: 3,
  brakes: 3,
  wheels: 3,
  powertrain: 4,
  energy: 4,
};
export const MAX_LAYER = 4;

export const METRIC_GROUPS = ['identity', 'performance', 'dimensions', ...SYSTEM_IDS] as const;
export type MetricGroup = (typeof METRIC_GROUPS)[number];

export function isCarId(x: string | undefined | null): x is CarId {
  return (CAR_IDS as readonly string[]).includes(x ?? '');
}
export function isSystemId(x: string | undefined | null): x is SystemId {
  return (SYSTEM_IDS as readonly string[]).includes(x ?? '');
}
export function isPartId(x: string | undefined | null): x is PartId {
  return (PART_IDS as readonly string[]).includes(x ?? '');
}
