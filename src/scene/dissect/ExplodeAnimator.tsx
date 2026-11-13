import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { EXPLODE_LINE } from '../materials';
import { useCar } from '../prim';

const MAX_LINES = 160;
const box = new THREE.Box3();
const tmp = new THREE.Vector3();

/**
 * Moves every registered part towards the explode target with a damped spring and draws the
 * connector lines. Runs entirely in useFrame: no React state changes per frame.
 */
export function ExplodeAnimator({ target, instant }: { target: number; instant: boolean }) {
  const car = useCar();
  const invalidate = useThree((s) => s.invalidate);
  const vel = useRef(0);
  const root = useRef<THREE.Group>(null);
  const lines = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_LINES * 6), 3));
    g.setDrawRange(0, 0);
    const l = new THREE.LineSegments(g, EXPLODE_LINE);
    l.frustumCulled = false;
    l.raycast = () => undefined;
    return l;
  }, []);
  useEffect(() => () => lines.geometry.dispose(), [lines]);
  useEffect(() => invalidate(), [target, invalidate]);

  useFrame((_, dt) => {
    const cur = car.explodeT.current;
    const settled = Math.abs(target - cur) < 0.0005 && Math.abs(vel.current) < 0.0005;
    let t = cur;
    if (!settled) {
      if (instant) {
        t = target;
        vel.current = 0;
      } else {
        // Critically damped spring.
        const h = Math.min(dt, 0.05);
        const k = 90;
        vel.current += (k * (target - cur) - 2 * Math.sqrt(k) * vel.current) * h;
        t = cur + vel.current * h;
      }
      car.explodeT.current = t;
      invalidate();
    }
    const pos = lines.geometry.getAttribute('position');
    const parent = root.current;
    let n = 0;
    for (const e of car.parts) {
      if (!settled || e.g.position.x !== e.d[0] * t) e.g.position.set(e.d[0] * t, e.d[1] * t, e.d[2] * t);
      if (t <= 0.01 || !parent || n >= MAX_LINES) continue;
      if (!e.c) {
        e.g.updateWorldMatrix(true, true);
        box.setFromObject(e.g);
        if (box.isEmpty()) continue;
        e.c = parent.worldToLocal(box.getCenter(tmp).clone()).sub(e.g.position);
      }
      pos.setXYZ(n * 2, e.c.x, e.c.y, e.c.z);
      pos.setXYZ(n * 2 + 1, e.c.x + e.d[0] * t, e.c.y + e.d[1] * t, e.c.z + e.d[2] * t);
      n++;
    }
    if (lines.geometry.drawRange.count !== n * 2 || !settled) {
      lines.geometry.setDrawRange(0, n * 2);
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={root}>
      <primitive object={lines} />
    </group>
  );
}
