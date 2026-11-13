import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from '@react-three/drei';
import { Canvas, invalidate, useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAR_MARKS } from '@/content/carMarks';
import { CARS } from '@/content/cars';
import type { CarId, SystemId } from '@/content/ids';
import { CameraRig } from '../CameraRig';
import { CarModel } from '../CarModel';
import type { DisplayState } from '../display';
import { SHAPES } from '../procedural/shapes';
import { Studio } from '../Studio';

export type CompareLayout = 'side' | 'overlay';
export type CompareAnchor = 'front' | 'mid' | 'ground';

export interface CompareSceneProps {
  label: string;
  cars: CarId[];
  layout: CompareLayout;
  anchor: CompareAnchor;
  sync: boolean;
  system: SystemId | null;
  xray: boolean;
  instant: boolean;
}

/** X offset that puts the chosen reference point of a car at the origin. */
function anchorX(id: CarId, anchor: CompareAnchor): number {
  const s = SHAPES[id];
  if (anchor === 'front') return 0;
  if (anchor === 'mid') return -s.wb / 2;
  return s.fo - s.L / 2;
}

function Rig({ target, onReady, instant }: { target: [number, number, number]; onReady?: (c: OrbitControlsImpl) => void; instant: boolean }) {
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  return <CameraRig preset="quarter" target={target} distance={Math.max(6.2, 6.9 / aspect)} instant={instant} damping={false} onReady={onReady} />;
}

/**
 * Side-by-side or stacked comparison. One WebGL canvas; each car is a viewport (drei View)
 * with its own camera, optionally kept in sync.
 */
export function CompareScene({ label, cars, layout, anchor, sync, system, xray, instant }: CompareSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const rigs = useRef(new Map<OrbitControlsImpl, () => void>());
  const syncRef = useRef(sync);
  const busy = useRef(false);
  useEffect(() => {
    syncRef.current = sync;
  }, [sync]);

  const register = useCallback((c: OrbitControlsImpl) => {
    const map = rigs.current;
    if (map.has(c)) return;
    const onChange = () => {
      if (!syncRef.current || busy.current) return;
      busy.current = true;
      for (const other of map.keys()) {
        if (other === c) continue;
        other.object.position.copy(c.object.position);
        other.target.copy(c.target);
        other.update();
      }
      busy.current = false;
    };
    map.set(c, onChange);
    c.addEventListener('change', onChange);
  }, []);
  useEffect(() => {
    const map = rigs.current;
    return () => {
      for (const [c, fn] of map) c.removeEventListener('change', fn);
      map.clear();
    };
  }, [layout, cars]);

  const display = useMemo<DisplayState>(
    () => ({ system, xray, allGhost: layout === 'overlay' }),
    [system, xray, layout],
  );
  const solid = !xray && layout === 'side';

  return (
    <div ref={wrap} role="img" aria-label={label} className="relative h-full w-full touch-pan-x">
      {layout === 'side' ? (
        <div className="flex h-full snap-x snap-mandatory overflow-x-auto" onScroll={() => invalidate()}>
          {cars.map((id) => {
            const s = SHAPES[id];
            return (
              <div key={id} className="relative h-full shrink-0 basis-1/2 snap-start border-r border-line last:border-r-0 md:shrink md:grow md:basis-0">
                <View className="absolute inset-0">
                  <Studio span={4} shadows={solid} />
                  <CarModel carId={id} display={display} instant={instant} />
                  <Rig target={[s.L / 2 - s.fo, 0.5, 0]} onReady={register} instant={instant} />
                </View>
                <p className="pointer-events-none absolute left-2 top-2 z-10 rounded bg-bg/80 px-2 py-0.5 text-sm font-semibold text-text">
                  <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: CAR_MARKS[id].color }} />
                  {CARS[id].short} <span className="font-normal text-muted">· {CARS[id].years}</span>
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative h-full">
          <View className="absolute inset-0">
            <Studio span={4} shadows={false} />
            {cars.map((id) => (
              <CarModel key={id} carId={id} display={display} tint={CAR_MARKS[id].color} instant={instant} position={[anchorX(id, anchor), 0, 0]} />
            ))}
            <Rig target={[anchor === 'front' ? 1.35 : 0, 0.5, 0]} instant={instant} />
          </View>
          <ul className="pointer-events-none absolute left-2 top-2 z-10 flex flex-wrap gap-2 text-sm">
            {cars.map((id) => (
              <li key={id} className="rounded bg-bg/80 px-2 py-0.5 font-semibold text-text">
                <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: CAR_MARKS[id].color }} />
                {CARS[id].short}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0">
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 32, near: 0.1, far: 120 }}
          eventSource={wrap}
          aria-hidden="true"
        >
          <View.Port />
        </Canvas>
      </div>
    </div>
  );
}
