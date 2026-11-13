import type { MetricGroup } from './ids';

export type Better = 'higher' | 'lower' | 'none';

interface MetricDef {
  id: string;
  group: MetricGroup;
  label: string;
  unit: string;
  better: Better;
  /** true → values are only ranked against each other when their `basis` matches. */
  basisSensitive?: boolean;
  digits?: number;
}

const def = <const T extends MetricDef[]>(x: T) => x;

export const METRICS = def([
  { id: 'yearFrom', group: 'identity', label: 'Tahun mulai produksi', unit: '', better: 'none' },
  { id: 'unitsBuilt', group: 'identity', label: 'Jumlah unit', unit: 'unit', better: 'none' },
  { id: 'seats', group: 'identity', label: 'Kursi', unit: '', better: 'none' },

  { id: 'powerTotalKw', group: 'performance', label: 'Daya gabungan', unit: 'kW', better: 'higher' },
  { id: 'torqueTotalNm', group: 'performance', label: 'Torsi gabungan', unit: 'Nm', better: 'higher' },
  { id: 'zeroTo100S', group: 'performance', label: '0–100 km/jam', unit: 'dtk', better: 'lower', digits: 1 },
  { id: 'zeroTo200S', group: 'performance', label: '0–200 km/jam', unit: 'dtk', better: 'lower', digits: 1 },
  { id: 'zeroTo300S', group: 'performance', label: '0–300 km/jam', unit: 'dtk', better: 'lower', digits: 1 },
  { id: 'topSpeedKmh', group: 'performance', label: 'Kecepatan puncak', unit: 'km/jam', better: 'higher' },

  { id: 'lengthMm', group: 'dimensions', label: 'Panjang', unit: 'mm', better: 'none' },
  { id: 'widthMm', group: 'dimensions', label: 'Lebar', unit: 'mm', better: 'none' },
  { id: 'heightMm', group: 'dimensions', label: 'Tinggi', unit: 'mm', better: 'none' },
  { id: 'wheelbaseMm', group: 'dimensions', label: 'Jarak sumbu roda', unit: 'mm', better: 'none' },
  { id: 'kerbKg', group: 'dimensions', label: 'Berat siap jalan', unit: 'kg', better: 'lower', basisSensitive: true },
  { id: 'dryKg', group: 'dimensions', label: 'Berat kering', unit: 'kg', better: 'lower' },

  { id: 'cylinders', group: 'powertrain', label: 'Jumlah silinder', unit: '', better: 'none' },
  { id: 'displacementCc', group: 'powertrain', label: 'Isi silinder', unit: 'cc', better: 'none' },
  { id: 'enginePowerKw', group: 'powertrain', label: 'Daya mesin bakar', unit: 'kW', better: 'higher' },
  { id: 'engineTorqueNm', group: 'powertrain', label: 'Torsi mesin bakar', unit: 'Nm', better: 'higher' },
  { id: 'engineMaxRpm', group: 'powertrain', label: 'Putaran maksimum mesin', unit: 'rpm', better: 'higher' },
  { id: 'motorPowerKw', group: 'powertrain', label: 'Daya motor listrik (total)', unit: 'kW', better: 'higher' },
  { id: 'gears', group: 'powertrain', label: 'Tingkat transmisi', unit: '', better: 'none' },

  { id: 'batteryKwh', group: 'energy', label: 'Kapasitas baterai traksi', unit: 'kWh', better: 'none', digits: 2 },
  { id: 'batteryKg', group: 'energy', label: 'Massa baterai', unit: 'kg', better: 'none' },
  { id: 'evRangeKm', group: 'energy', label: 'Jarak listrik murni', unit: 'km', better: 'higher', basisSensitive: true },
  { id: 'fuelTankL', group: 'energy', label: 'Tangki bensin', unit: 'L', better: 'none' },
  { id: 'dcChargeKw', group: 'energy', label: 'Pengisian DC maksimum', unit: 'kW', better: 'higher' },

  { id: 'tubKg', group: 'structure', label: 'Massa bak karbon', unit: 'kg', better: 'lower' },

  { id: 'discFrontMm', group: 'brakes', label: 'Cakram depan', unit: 'mm', better: 'higher' },
  { id: 'discRearMm', group: 'brakes', label: 'Cakram belakang', unit: 'mm', better: 'higher' },

  { id: 'tireFrontMm', group: 'wheels', label: 'Lebar ban depan', unit: 'mm', better: 'none' },
  { id: 'tireRearMm', group: 'wheels', label: 'Lebar ban belakang', unit: 'mm', better: 'none' },
  { id: 'wheelFrontIn', group: 'wheels', label: 'Pelek depan', unit: 'inci', better: 'none' },
  { id: 'wheelRearIn', group: 'wheels', label: 'Pelek belakang', unit: 'inci', better: 'none' },

  { id: 'dragCd', group: 'aero', label: 'Koefisien hambat (Cd)', unit: '', better: 'lower', digits: 3 },
  { id: 'downforceKg', group: 'aero', label: 'Downforce (klaim)', unit: 'kg', better: 'higher', basisSensitive: true },

  { id: 'cargoL', group: 'cabin', label: 'Volume bagasi', unit: 'L', better: 'higher' },
]);

export type MetricId = (typeof METRICS)[number]['id'];
export type Metric = MetricDef & { id: MetricId };
export const METRIC_BY_ID = Object.fromEntries(METRICS.map((m) => [m.id, m])) as Record<MetricId, Metric>;
export const METRIC_IDS = METRICS.map((m) => m.id) as MetricId[];
