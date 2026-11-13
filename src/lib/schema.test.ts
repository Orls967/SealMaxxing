import { describe, expect, it } from 'vitest';
import { CARS } from '@/content/cars';
import { carSchema, partTextSchema, sourcedNumber } from './schema';

describe('schema', () => {
  it('accepts a real car and rejects unknown keys', () => {
    expect(carSchema.safeParse(CARS.seal).success).toBe(true);
    expect(carSchema.safeParse({ ...CARS.seal, extra: 1 }).success).toBe(false);
  });
  it('requires at least one known source for every number', () => {
    expect(sourcedNumber.safeParse({ value: 1, sources: [], verified: false }).success).toBe(false);
    expect(sourcedNumber.safeParse({ value: 1, sources: ['nope'], verified: false }).success).toBe(false);
    expect(sourcedNumber.safeParse({ value: 1, sources: ['spec'], verified: false }).success).toBe(true);
  });
  it('requires a reason for an absent part', () => {
    const base = { summary: 'x'.repeat(20), how: 'x'.repeat(50), why: 'x'.repeat(25) };
    expect(partTextSchema.safeParse({ ...base, presence: { kind: 'absent' } }).success).toBe(false);
    expect(
      partTextSchema.safeParse({ ...base, presence: { kind: 'absent', reason: 'Tidak ada mesin bakar.' } })
        .success,
    ).toBe(true);
  });
});
