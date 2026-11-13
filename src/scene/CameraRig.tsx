import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export type CamPreset = 'quarter' | 'front' | 'side' | 'top' | 'bottom';

/** Unit directions from the target towards the camera. Car nose points to -X. */
const DIRS: Record<CamPreset, [number, number, number]> = {
  quarter: [-0.72, 0.36, 0.6],
  front: [-1, 0.12, 0.001],
  side: [0, 0.1, 1],
  top: [0.001, 1, 0.02],
  bottom: [-0.25, -0.75, 0.6],
};

export interface CameraRigProps {
  preset: CamPreset;
  /** Bump to re-apply the same preset after the user has orbited away. */
  nonce?: number;
  target: [number, number, number];
  distance: number;
  /** World point to look at instead of `target` (double-click focus). */
  focus?: THREE.Vector3 | null;
  instant?: boolean;
  /** Allow looking from below the floor. */
  allowBelow?: boolean;
  onReady?: (controls: OrbitControlsImpl) => void;
}

export function CameraRig({ preset, nonce = 0, target, distance, focus, instant = false, allowBelow = true, onReady }: CameraRigProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const goal = useMemo(() => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), active: false, first: true }), []);
  const [tx, ty, tz] = target;

  useEffect(() => {
    const d = DIRS[preset];
    goal.tgt.set(tx, ty, tz);
    goal.pos.set(d[0], d[1], d[2]).normalize().multiplyScalar(distance).add(goal.tgt);
    goal.active = true;
    invalidate();
  }, [preset, nonce, tx, ty, tz, distance, goal, invalidate]);

  useEffect(() => {
    if (!focus) return;
    const offset = camera.position.clone().sub(controls.current?.target ?? goal.tgt);
    goal.tgt.copy(focus);
    goal.pos.copy(focus).add(offset.multiplyScalar(0.6));
    goal.active = true;
    invalidate();
  }, [focus, camera, goal, invalidate]);

  useEffect(() => {
    if (controls.current) onReady?.(controls.current);
  }, [onReady]);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!goal.active || !c) return;
    const k = instant || goal.first ? 1 : 1 - Math.exp(-dt * 7);
    camera.position.lerp(goal.pos, k);
    c.target.lerp(goal.tgt, k);
    if (k === 1 || camera.position.distanceToSquared(goal.pos) < 1e-4) {
      camera.position.copy(goal.pos);
      c.target.copy(goal.tgt);
      goal.active = false;
      goal.first = false;
    }
    c.update();
    invalidate();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping={!instant}
      minDistance={distance * 0.25}
      maxDistance={distance * 2.2}
      maxPolarAngle={allowBelow ? Math.PI * 0.93 : Math.PI * 0.49}
      onStart={() => {
        goal.active = false;
        goal.first = false;
      }}
    />
  );
}
