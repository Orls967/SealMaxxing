import type { CarId } from '../ids';
import type { Car } from '../types';
import { laferrari } from './laferrari';
import { p1 } from './p1';
import { seal } from './seal';
import { senna } from './senna';

export const CARS: Record<CarId, Car> = { seal, laferrari, p1, senna };
export const CAR_LIST: Car[] = [seal, laferrari, p1, senna];
