import { describe, expect, it } from 'vitest';
import { DEFAULT_VIEW, parseView, serializeView, toggleCar } from './viewState';

describe('viewState', () => {
  it('parses an empty query to the defaults and serialises defaults to nothing', () => {
    expect(parseView('')).toEqual(DEFAULT_VIEW);
    expect(serializeView(DEFAULT_VIEW)).toBe('');
  });
  it('round-trips a full dissect view', () => {
    const q = 'part=battery&sys=energy&xray=1&peel=3&ex=40&cut=x&cp=30&cam=side&liv=factory';
    const v = parseView(`?${q}`);
    expect(v.part).toBe('battery');
    expect(v.cut).toBe('x');
    expect(serializeView(v)).toBe(q);
  });
  it('round-trips compare, data and sim state', () => {
    const q =
      'cars=seal,senna&lay=overlay&anc=mid&sync=0&m=powerPerTonneKw&g=energy&q=daya&ext=1&mode=brake&dist=200&v=120';
    expect(serializeView(parseView(q))).toBe(q);
  });
  it('ignores invalid values and clamps numbers', () => {
    const v = parseView('part=nope&sys=x&peel=99&ex=-5&cut=w&cam=zzz&cars=seal&mode=fly&v=abc');
    expect(v.part).toBeNull();
    expect(v.system).toBeNull();
    expect(v.peel).toBe(4);
    expect(v.explode).toBe(0);
    expect(v.cut).toBeNull();
    expect(v.cam).toBe('quarter');
    expect(v.cars).toHaveLength(4);
    expect(v.mode).toBe('accel');
    expect(v.speed).toBe(250);
  });
  it('keeps at least two cars selected and in canonical order', () => {
    expect(toggleCar(['seal', 'p1'], 'p1')).toEqual(['seal', 'p1']);
    expect(toggleCar(['seal', 'senna'], 'laferrari')).toEqual(['seal', 'laferrari', 'senna']);
    expect(toggleCar(['seal', 'laferrari', 'senna'], 'seal')).toEqual(['laferrari', 'senna']);
  });
});
