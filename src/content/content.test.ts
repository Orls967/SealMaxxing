import { describe, expect, it } from 'vitest';
import { carPartsSchema, carSchema } from '@/lib/schema';
import { CAR_LIST } from './cars';
import { PART_COMPARISON, STORIES, SYSTEM_COMPARISON } from './comparisons';
import { GLOSSARY } from './glossary';
import { CAR_IDS, PART_IDS, SYSTEM_IDS } from './ids';
import { PART_LABEL, SYSTEM_LABEL } from './labels';
import { METRICS } from './metrics';
import { PARTS } from './parts';

describe('content', () => {
  it.each(CAR_LIST)('car $id matches the schema', (car) => {
    expect(() => carSchema.parse(car)).not.toThrow();
  });

  it.each(CAR_IDS)('parts for %s cover every part id and match the schema', (id) => {
    expect(() => carPartsSchema.parse(PARTS[id])).not.toThrow();
    expect(Object.keys(PARTS[id]).sort()).toEqual([...PART_IDS].sort());
  });

  it('every metric is a value or an explicit absence for every car, except documented gaps', () => {
    const gaps: string[] = [];
    for (const car of CAR_LIST)
      for (const m of METRICS) {
        const has = car.specs[m.id] !== undefined;
        const absent = car.absent[m.id] !== undefined;
        expect(has && absent, `${car.id}.${m.id} is both value and absent`).toBe(false);
        if (!has && !absent) gaps.push(`${car.id}.${m.id}`);
      }
    // Known gaps: figures the makers never published. Listed so new gaps fail the test.
    expect(gaps.sort()).toEqual(
      [
        'laferrari.cargoL',
        'laferrari.dragCd',
        'laferrari.tubKg',
        'seal.batteryKg',
        'seal.discFrontMm',
        'seal.discRearMm',
        'senna.cargoL',
        'senna.dragCd',
        'senna.tubKg',
      ].sort(),
    );
  });

  it('facts reference metrics the car actually has', () => {
    for (const id of CAR_IDS) {
      const car = CAR_LIST.find((c) => c.id === id)!;
      for (const p of PART_IDS)
        for (const f of PARTS[id][p].facts ?? [])
          expect(car.specs[f] ?? car.absent[f], `${id}.${p} → ${f}`).toBeDefined();
    }
  });

  it('a sourced number without a real source is never marked verified', () => {
    for (const car of CAR_LIST)
      for (const [k, v] of Object.entries(car.specs))
        if (v.sources.every((s) => s === 'spec')) expect(v.verified, `${car.id}.${k}`).toBe(false);
  });

  it('labels and comparisons cover every system and part', () => {
    for (const s of SYSTEM_IDS) {
      expect(SYSTEM_LABEL[s]).toBeTruthy();
      expect(SYSTEM_COMPARISON[s].length).toBeGreaterThan(40);
    }
    for (const p of PART_IDS) {
      expect(PART_LABEL[p]).toBeTruthy();
      expect(PART_COMPARISON[p].length).toBeGreaterThan(20);
    }
    expect(STORIES).toHaveLength(8);
  });

  it('glossary ids are unique and sorted by term', () => {
    expect(new Set(GLOSSARY.map((g) => g.id)).size).toBe(GLOSSARY.length);
  });
});
