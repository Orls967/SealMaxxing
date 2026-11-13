import { describe, expect, it } from 'vitest';
import { fmt, fmtSourced, kwToPs } from './format';

describe('format', () => {
  it('uses Indonesian separators', () => {
    expect(fmt(4800)).toBe('4.800');
    expect(fmt(82.56, 2)).toBe('82,56');
  });
  it('adds qualifier prefixes and keeps years unseparated', () => {
    expect(
      fmtSourced({ value: 3, qualifier: 'lessThan', sources: ['spec'], verified: false }, 'dtk', 1),
    ).toBe('< 3,0 dtk');
    expect(fmtSourced({ value: 2013, sources: ['spec'], verified: true }, '')).toBe('2013');
  });
  it('converts kW to PS', () => {
    expect(kwToPs(588)).toBe(799);
    expect(kwToPs(390)).toBe(530);
  });
});
