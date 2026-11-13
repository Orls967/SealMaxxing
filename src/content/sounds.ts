import type { CarId } from './ids';

export interface SoundCredit {
  title: string;
  author: string;
  licence: 'CC0' | 'CC BY 3.0';
  url: string;
}

export interface SoundClip {
  /** File name inside `public/sounds/`. */
  file: string;
  /** false = a stand-in recording of another car, used because no open recording of this one exists. */
  exact: boolean;
  credit: SoundCredit;
}

export interface CarSound {
  /** Looping low-rev clip; absent for the electric car, which is silent at rest. */
  idle?: SoundClip;
  /** Played from the start while the pedal is held. */
  rev: SoundClip;
  /** Shown under the button: what the listener is actually hearing. */
  note: string;
}

const P1: SoundCredit = {
  title: 'McLaren P1 – engine and exhaust sound',
  author: 'Alfisti J (YouTube), lewat Wikimedia Commons',
  licence: 'CC BY 3.0',
  url: 'https://commons.wikimedia.org/wiki/File:McLaren_P1_-_engine_and_exhaust_sound_(YouTube_M1xuT1ue10c).opus',
};
const SUPERCAR: SoundCredit = {
  title: 'Supercar rev',
  author: 'richwise (Freesound)',
  licence: 'CC0',
  url: 'https://freesound.org/people/richwise/sounds/478756/',
};

export const SOUNDS: Record<CarId, CarSound> = {
  seal: {
    rev: {
      file: 'seal-accel.mp3',
      exact: false,
      credit: {
        title: 'Acceleration of an electric car',
        author: 'justVova (Freesound)',
        licence: 'CC0',
        url: 'https://freesound.org/people/justVova/sounds/761685/',
      },
    },
    note: 'Rekaman pengganti: akselerasi mobil listrik lain (Tesla Model S Plaid), bukan BYD Seal.',
  },
  laferrari: {
    idle: {
      file: 'laferrari-idle.mp3',
      exact: false,
      credit: {
        title: 'Ferrari_motor_idle',
        author: 'jtvdb (Freesound)',
        licence: 'CC0',
        url: 'https://freesound.org/people/jtvdb/sounds/857147/',
      },
    },
    rev: {
      file: 'laferrari-rev.mp3',
      exact: true,
      credit: {
        title: 'Ferrari LaFerrari – engine and exhaust sound',
        author: 'Erwin Lindsen (YouTube), lewat Wikimedia Commons',
        licence: 'CC BY 3.0',
        url: 'https://commons.wikimedia.org/wiki/File:Ferrari_LaFerrari_-_engine_and_exhaust_sound_(YouTube_miX50gTQndk).opus',
      },
    },
    note: 'Saat digas: rekaman LaFerrari. Saat langsam: rekaman pengganti dari Ferrari lain.',
  },
  p1: {
    idle: { file: 'p1-idle.mp3', exact: true, credit: P1 },
    rev: { file: 'p1-rev.mp3', exact: true, credit: P1 },
    note: 'Rekaman McLaren P1.',
  },
  senna: {
    idle: { file: 'senna-idle.mp3', exact: false, credit: SUPERCAR },
    rev: { file: 'senna-rev.mp3', exact: false, credit: SUPERCAR },
    note: 'Rekaman pengganti: supercar lain yang modelnya tidak diketahui, bukan McLaren Senna.',
  },
};

/** Every distinct recording used, for the credits list. */
export const SOUND_CREDITS: SoundCredit[] = [
  ...new Map(
    Object.values(SOUNDS)
      .flatMap((s) => (s.idle ? [s.idle, s.rev] : [s.rev]))
      .map((c) => [c.credit.url, c.credit]),
  ).values(),
];
