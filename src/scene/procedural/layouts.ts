import type { CarId } from '@/content/ids';

/** Where the schematic internals sit. Metres; x = 0 at the front axle, +x rearwards. */
export interface CarLayout {
  /** Driver side: +1 = car's left (+Z), -1 = right. */
  driverZ: 1 | -1;
  seatRows: { x: number; n: 2 | 3 }[];
  engine?: { cyl: 8 | 12; x: number; len: number; vDeg: number; turbo: boolean };
  gearbox?: { x: number; len: number };
  motorFront?: { rad: number; len: number };
  /** Transverse motor on the rear axle (EV), or a motor inline with the powertrain. */
  motorRear?:
    | { kind: 'axle'; rad: number; len: number }
    | { kind: 'inline'; x: number; y: number; z: number; rad: number; len: number };
  battery?: { x0: number; x1: number; w: number; y0: number; h: number; blades: number };
  tank?: { x: number; len: number; w: number; y0: number; h: number };
  inverters: { x: number; y: number; z: number; s: [number, number, number] }[];
  chargePort?: { x: number; y: number; side: 1 | -1 };
  sideRadiators: boolean;
  exhaust?: 'twin-centre' | 'single-centre' | 'top';
  wing: 'lip' | 'hidden' | 'raised' | 'fixed';
  roofScoop: boolean;
  discRF: number;
  discRR: number;
  tailLight: 'bar' | 'round' | 'strips' | 'blade';
  cargo: { x: number; y: number; s: [number, number, number] }[];
  helmets?: boolean;
}

export const LAYOUTS: Record<CarId, CarLayout> = {
  seal: {
    driverZ: -1,
    seatRows: [
      { x: 1.32, n: 2 },
      { x: 2.28, n: 3 },
    ],
    motorFront: { rad: 0.14, len: 0.3 },
    motorRear: { kind: 'axle', rad: 0.16, len: 0.36 },
    battery: { x0: 0.46, x1: 2.5, w: 1.42, y0: 0.17, h: 0.13, blades: 44 },
    inverters: [
      { x: 0, y: 0.56, z: 0.12, s: [0.34, 0.12, 0.4] },
      { x: 2.92, y: 0.6, z: -0.1, s: [0.36, 0.12, 0.44] },
    ],
    chargePort: { x: 3.3, y: 0.86, side: -1 },
    sideRadiators: false,
    wing: 'lip',
    roofScoop: false,
    discRF: 0.17,
    discRR: 0.165,
    tailLight: 'bar',
    cargo: [
      { x: 3.45, y: 0.62, s: [0.72, 0.42, 1.25] },
      { x: -0.38, y: 0.62, s: [0.4, 0.2, 0.7] },
    ],
  },
  laferrari: {
    driverZ: 1,
    seatRows: [{ x: 1.18, n: 2 }],
    engine: { cyl: 12, x: 2.02, len: 0.78, vDeg: 65, turbo: false },
    gearbox: { x: 2.78, len: 0.62 },
    motorRear: { kind: 'inline', x: 3.18, y: 0.3, z: 0, rad: 0.12, len: 0.2 },
    battery: { x0: 1.2, x1: 1.6, w: 0.95, y0: 0.115, h: 0.11, blades: 8 },
    tank: { x: 1.52, len: 0.2, w: 1.1, y0: 0.26, h: 0.42 },
    inverters: [
      { x: 2.72, y: 0.6, z: 0.13, s: [0.26, 0.1, 0.2] },
      { x: 2.72, y: 0.6, z: -0.13, s: [0.26, 0.1, 0.2] },
    ],
    sideRadiators: true,
    exhaust: 'twin-centre',
    wing: 'hidden',
    roofScoop: false,
    discRF: 0.199,
    discRR: 0.19,
    tailLight: 'round',
    cargo: [{ x: -0.55, y: 0.36, s: [0.3, 0.14, 0.5] }],
  },
  p1: {
    driverZ: 1,
    seatRows: [{ x: 1.16, n: 2 }],
    engine: { cyl: 8, x: 2.12, len: 0.56, vDeg: 90, turbo: true },
    gearbox: { x: 2.82, len: 0.6 },
    motorRear: { kind: 'inline', x: 2.12, y: 0.28, z: 0.33, rad: 0.11, len: 0.26 },
    battery: { x0: 1.5, x1: 1.76, w: 1.0, y0: 0.44, h: 0.3, blades: 6 },
    tank: { x: 1.62, len: 0.3, w: 1.05, y0: 0.14, h: 0.27 },
    inverters: [{ x: 1.63, y: 0.8, z: 0, s: [0.22, 0.08, 0.5] }],
    chargePort: { x: 1.95, y: 0.62, side: 1 },
    sideRadiators: true,
    exhaust: 'single-centre',
    wing: 'raised',
    roofScoop: true,
    discRF: 0.195,
    discRR: 0.19,
    tailLight: 'strips',
    cargo: [{ x: -0.5, y: 0.4, s: [0.42, 0.22, 0.8] }],
  },
  senna: {
    driverZ: 1,
    seatRows: [{ x: 1.14, n: 2 }],
    engine: { cyl: 8, x: 2.12, len: 0.58, vDeg: 90, turbo: true },
    gearbox: { x: 2.82, len: 0.6 },
    tank: { x: 1.62, len: 0.26, w: 1.05, y0: 0.14, h: 0.4 },
    inverters: [],
    sideRadiators: true,
    exhaust: 'top',
    wing: 'fixed',
    roofScoop: true,
    discRF: 0.195,
    discRR: 0.195,
    tailLight: 'blade',
    cargo: [],
    helmets: true,
  },
};
