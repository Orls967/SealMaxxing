import { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';

/** The single WebGL canvas of a page: renders on demand, clipping enabled for the cut tool. */
export function Stage({ label, children, fov = 32 }: { label: string; children: ReactNode; fov?: number }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, localClippingEnabled: true, powerPreference: 'high-performance' }}
      camera={{ fov, near: 0.1, far: 120, position: [-6, 3, 6] }}
      role="img"
      aria-label={label}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
