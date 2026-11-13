import { describe, expect, it } from 'vitest';
import { partMode } from './display';

describe('partMode', () => {
  it('draws everything solid by default', () => {
    expect(partMode('body-panels', {})).toBe('solid');
    expect(partMode('battery', {})).toBe('solid');
  });
  it('hides peeled layers and keeps deeper ones', () => {
    expect(partMode('body-panels', { peel: 1 })).toBe('hidden');
    expect(partMode('seats', { peel: 1 })).toBe('solid');
    expect(partMode('engine', { peel: 4 })).toBe('solid');
    expect(partMode('tub', { peel: 4 })).toBe('hidden');
  });
  it('x-ray ghosts the shell and highlights the focused system', () => {
    expect(partMode('body-panels', { xray: true })).toBe('ghost');
    expect(partMode('engine', { xray: true })).toBe('solid');
    expect(partMode('battery', { xray: true, system: 'energy' })).toBe('hi');
    expect(partMode('engine', { xray: true, system: 'energy' })).toBe('ghost');
  });
  it('highlights only the selected part', () => {
    expect(partMode('battery', { part: 'battery' })).toBe('hi');
    expect(partMode('fuel-tank', { part: 'battery' })).toBe('solid');
    expect(partMode('fuel-tank', { part: 'battery', xray: true })).toBe('ghost');
  });
  it('a selected part stays visible even when its layer is peeled', () => {
    expect(partMode('body-panels', { part: 'body-panels', peel: 3 })).toBe('hi');
  });
  it('overlay layout ghosts everything except the focus', () => {
    expect(partMode('tub', { allGhost: true })).toBe('ghost');
    expect(partMode('tub', { allGhost: true, system: 'structure' })).toBe('hi');
  });
});
