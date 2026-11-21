import type { CarId } from './ids';

export interface ModelCredit {
  title: string;
  author: string;
  url: string;
  licence: 'CC BY 4.0';
  /** What this project changed, as CC BY asks. */
  changes: string;
}

const CHANGES =
  'Diskalakan ke panjang sebenarnya, dipecah per bagian, disederhanakan, tekstur dan emblem pabrikan dibuang, warna diganti.';

/** Exterior models from Sketchfab, processed by scripts/build-models.mjs into public/models/. */
export const MODELS: Record<CarId, ModelCredit> = {
  seal: {
    title: '2024 BYD Seal Performance AWD',
    author: 'Nazh Design',
    url: 'https://sketchfab.com/3d-models/96ec5c34852f4c3090a755d4445f5e98',
    licence: 'CC BY 4.0',
    changes: CHANGES,
  },
  laferrari: {
    title: 'Ferrari Laferrari',
    author: 'Res1n',
    url: 'https://sketchfab.com/3d-models/006a4b4047754c35aa5ed0366bff3b49',
    licence: 'CC BY 4.0',
    changes: `${CHANGES} Cat hitam bawaan model diganti merah beratap hitam.`,
  },
  p1: {
    title: 'McLaren P1',
    author: 'hartwelkisaka',
    url: 'https://sketchfab.com/3d-models/e791b5aee5c6497c83994f4e5f1db84b',
    licence: 'CC BY 4.0',
    changes: CHANGES,
  },
  senna: {
    title: 'McLaren senna',
    author: 'hartwelkisaka',
    url: 'https://sketchfab.com/3d-models/f3ada11a4618463cac2e082c008cc340',
    licence: 'CC BY 4.0',
    changes: `${CHANGES} Model ini tidak menyertakan ban, jadi roda dan ban digambar oleh aplikasi.`,
  },
};

export const LICENCE_URL: Record<ModelCredit['licence'], string> = {
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
};
