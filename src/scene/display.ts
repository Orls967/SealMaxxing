import { PART_SYSTEM, SYSTEM_LAYER, type PartId, type SystemId } from '@/content/ids';

export type Mode = 'solid' | 'hi' | 'ghost' | 'hidden';

export interface DisplayState {
  /** Selected part, if any. */
  part?: PartId | null;
  /** Focused system, if any. */
  system?: SystemId | null;
  xray?: boolean;
  /** Layers with index < peel are peeled away. */
  peel?: number;
  /** Everything is drawn as a ghost (overlay layout). */
  allGhost?: boolean;
}

/** Decides how one part is drawn. Pure, so the same rules drive 3D and tests. */
export function partMode(id: PartId, s: DisplayState): Mode {
  const system = PART_SYSTEM[id];
  const focused = s.part ? s.part === id : s.system ? s.system === system : null;
  if (s.allGhost) return focused ? 'hi' : 'ghost';
  if (focused === true) return s.xray || s.part ? 'hi' : 'solid';
  const peeled = SYSTEM_LAYER[system] < (s.peel ?? 0);
  if (s.xray) {
    if (focused === false) return 'ghost';
    return peeled || SYSTEM_LAYER[system] <= 1 ? 'ghost' : 'solid';
  }
  return peeled ? 'hidden' : 'solid';
}
