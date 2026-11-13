import type { CarId } from './ids';

/** Fixed per-car marks for charts: colour is always paired with a pattern and a direct label. */
export const CAR_MARKS: Record<CarId, { color: string; pattern: 'solid' | 'diagonal' | 'dots' | 'cross' }> = {
  seal: { color: '#ffffff', pattern: 'solid' },
  laferrari: { color: '#ff3b47', pattern: 'diagonal' },
  p1: { color: '#b01624', pattern: 'dots' },
  senna: { color: '#b9b9c2', pattern: 'cross' },
};
