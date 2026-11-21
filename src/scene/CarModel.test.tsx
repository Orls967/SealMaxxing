import { create } from '@react-three/test-renderer';
import { describe, expect, it } from 'vitest';
import { CAR_IDS, PART_IDS, PART_SYSTEM, isPartId } from '@/content/ids';
import { PARTS } from '@/content/parts';
import { CarModel } from './CarModel';

describe('CarModel node mapping', () => {
  it.each(CAR_IDS)('%s has a named node for every present part and none for absent ones', async (carId) => {
    const r = await create(<CarModel carId={carId} instant bodyModel={false} />);
    const names = new Set<string>();
    r.scene.instance.traverse((o) => {
      const m = /^([a-z]+)__([a-z-]+)__\d+$/.exec(o.name);
      const id = m?.[2];
      if (isPartId(id)) {
        expect(PART_SYSTEM[id]).toBe(m?.[1]);
        names.add(id);
      }
    });
    for (const p of PART_IDS) {
      const present = PARTS[carId][p].presence.kind === 'present';
      expect(names.has(p), `${carId}.${p} present=${present}`).toBe(present);
    }
    await r.unmount();
  });
});
