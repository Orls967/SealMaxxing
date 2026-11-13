import { invalidate } from '@react-three/fiber';
import type { CarId } from '@/content/ids';
import { CLIP_PLANES, CUT_PLANE } from '../materials';
import { SHAPES } from '../procedural/shapes';

export type CutAxis = 'x' | 'y' | 'z';

/** Positions the shared cut plane. `pos` is 0..100 along the axis; `null` axis removes the cut. */
export function applyCut(carId: CarId, axis: CutAxis | null, pos: number): void {
  CLIP_PLANES.length = 0;
  if (axis) {
    const s = SHAPES[carId];
    const f = pos / 100;
    const [lo, hi] = axis === 'x' ? [-s.fo, s.L - s.fo] : axis === 'y' ? [0, s.H] : [-s.W / 2, s.W / 2];
    CUT_PLANE.normal.set(axis === 'x' ? -1 : 0, axis === 'y' ? -1 : 0, axis === 'z' ? -1 : 0);
    CUT_PLANE.constant = lo + (hi - lo) * f;
    CLIP_PLANES.push(CUT_PLANE);
  }
  invalidate();
}
