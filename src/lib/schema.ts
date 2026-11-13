import { z } from 'zod';
import { CAR_IDS, PART_IDS } from '@/content/ids';
import { METRIC_IDS } from '@/content/metrics';
import { SOURCES } from '@/content/sources';

const sourceId = z.string().refine((s) => s in SOURCES, 'unknown source id');
const base = {
  basis: z.string().min(1).optional(),
  qualifier: z.enum(['exact', 'approx', 'lessThan', 'greaterThan', 'limited']).optional(),
  sources: z.array(sourceId).min(1),
  verified: z.boolean(),
  market: z.string().optional(),
};
export const sourcedNumber = z.object({ value: z.number().finite(), ...base }).strict();
export const sourcedText = z.object({ value: z.string().min(1), ...base }).strict();

const metricKey = z.enum(METRIC_IDS as [string, ...string[]]);
const specMap = z.partialRecord(metricKey, sourcedNumber);

export const carSchema = z
  .object({
    id: z.enum(CAR_IDS),
    maker: z.string().min(1),
    name: z.string().min(1),
    short: z.string().min(1),
    kind: z.enum(['bev', 'hybrid', 'phev', 'ice']),
    kindLabel: z.string().min(1),
    years: z.string().min(1),
    role: z.string().min(1),
    price: sourcedText,
    specs: specMap,
    absent: z.partialRecord(metricKey, z.string().min(8)),
    extreme: z.object({ name: z.string(), note: z.string(), specs: specMap }).optional(),
  })
  .strict();

export const partTextSchema = z
  .object({
    presence: z.union([
      z.object({ kind: z.literal('present') }),
      z.object({ kind: z.literal('absent'), reason: z.string().min(10) }),
    ]),
    summary: z.string().min(15),
    how: z.string().min(40),
    why: z.string().min(20),
    facts: z.array(metricKey).optional(),
  })
  .strict();

export const carPartsSchema = z.object(
  Object.fromEntries(PART_IDS.map((p) => [p, partTextSchema])) as Record<string, typeof partTextSchema>,
);
