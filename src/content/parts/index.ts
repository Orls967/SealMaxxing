import type { CarId } from '../ids';
import type { CarParts } from '../types';
import { laferrariParts } from './laferrari';
import { p1Parts } from './p1';
import { sealParts } from './seal';
import { sennaParts } from './senna';

export const PARTS: Record<CarId, CarParts> = {
  seal: sealParts,
  laferrari: laferrariParts,
  p1: p1Parts,
  senna: sennaParts,
};
