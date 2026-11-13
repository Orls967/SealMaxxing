import { useEffect, useMemo } from 'react';
import type * as THREE from 'three';
import { CUT_CAP, mat, matGhost, matHi, withArches, type MatKey } from '../materials';
import { Box, Cyl, Geo, Part, useCar, useMode } from '../prim';
import type { CarLayout } from './layouts';
import { bodyGeometry, doorGeometry, greenhouseGeometry, roofGeometry } from './loft';
import { stationAt, type CarShape } from './shapes';

function useDisposable<T extends THREE.BufferGeometry | THREE.BufferGeometry[]>(
  make: () => T,
  deps: unknown[],
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are supplied by the caller
  const g = useMemo(make, deps);
  useEffect(
    () => () => {
      for (const x of Array.isArray(g) ? g : [g]) x.dispose();
    },
    [g],
  );
  return g;
}

/** Paint with wheel-arch cut-outs, in the variant matching the current display mode. */
function useArchPaint(s: CarShape, key: MatKey): THREE.Material {
  const mode = useMode();
  const { tint } = useCar();
  const arch = useMemo(
    () => ({
      frontX: 0,
      rearX: s.wb,
      frontR: s.wheelRF + 0.045,
      rearR: s.wheelRR + 0.045,
      y: s.wheelRF,
      zMin: s.W * 0.3,
    }),
    [s],
  );
  const solid = useMemo(() => withArches(mat(key), arch), [key, arch]);
  const hi = useMemo(() => withArches(matHi(key), arch), [key, arch]);
  useEffect(() => () => (solid.dispose(), hi.dispose()), [solid, hi]);
  if (mode === 'ghost') return matGhost(tint);
  return mode === 'hi' ? hi : solid;
}

function Shell({ s, paint, cut }: { s: CarShape; paint: MatKey; cut: boolean }) {
  const geo = useDisposable(() => bodyGeometry(s), [s]);
  const roof = useDisposable(() => (s.roof ? [roofGeometry(s, s.roof[0], s.roof[1])] : []), [s]);
  const m = useArchPaint(s, paint);
  // The factory-style red livery keeps a black roof.
  const roofM = useArchPaint(s, 'paint');
  const mode = useMode();
  return (
    <>
      <Geo geometry={geo} material={m} />
      {cut && mode !== 'ghost' && <Geo geometry={geo} material={CUT_CAP} />}
      {roof.map((g, i) => (
        <Geo key={i} geometry={g} material={roofM} />
      ))}
    </>
  );
}

function Doors({ s, paint, side }: { s: CarShape; paint: MatKey; side: 1 | -1 }) {
  const geos = useDisposable(() => s.doors.map(([a, b]) => doorGeometry(s, a, b, side)), [s, side]);
  const m = useArchPaint(s, paint);
  return (
    <>
      {geos.map((g, i) => (
        <Geo key={i} geometry={g} material={m} />
      ))}
    </>
  );
}

function Glass({ s }: { s: CarShape }) {
  const geo = useDisposable(() => greenhouseGeometry(s), [s]);
  const mode = useMode();
  const { tint } = useCar();
  const m = mode === 'ghost' ? matGhost(tint) : mode === 'hi' ? matHi('glass') : mat('glass');
  return <Geo geometry={geo} material={m} />;
}

function FrontLights({ s }: { s: CarShape }) {
  const f = stationAt(s, 0.035);
  return (
    <>
      {([1, -1] as const).map((side) => (
        <Box
          key={side}
          k="light"
          p={[f.x + 0.02, f.belt - 0.05, side * f.hw * 0.66]}
          s={[0.1, 0.035, f.hw * 0.36]}
          r={[0, side * 0.5, 0]}
        />
      ))}
    </>
  );
}

function RearLights({ s, lay }: { s: CarShape; lay: CarLayout }) {
  const r = stationAt(s, 0.985);
  const y = r.belt - 0.07;
  const sides = [1, -1] as const;
  switch (lay.tailLight) {
    case 'bar':
      return <Box k="tail" p={[r.x + 0.045, y, 0]} s={[0.04, 0.03, r.hw * 1.7]} />;
    case 'blade':
      return <Box k="tail" p={[r.x + 0.03, y + 0.02, 0]} s={[0.03, 0.015, r.hw * 1.5]} />;
    case 'round':
      return sides.map((side) => (
        <Cyl key={side} k="tail" p={[r.x + 0.03, y, side * r.hw * 0.62]} rad={0.07} h={0.05} axis="x" />
      ));
    case 'strips':
      return sides.map((side) => (
        <Box
          key={side}
          k="tail"
          p={[r.x + 0.02, y, side * r.hw * 0.62]}
          s={[0.03, 0.018, r.hw * 0.6]}
          r={[0, side * -0.35, 0]}
        />
      ));
  }
}

export function CarBody({
  s,
  lay,
  paint,
  cut,
}: {
  s: CarShape;
  lay: CarLayout;
  paint: MatKey;
  cut: boolean;
}) {
  return (
    <>
      <Part id="body-panels">
        <Shell s={s} paint={paint} cut={cut} />
      </Part>
      <Part id="doors">
        <Doors s={s} paint={paint} side={1} />
      </Part>
      <Part id="doors" mirror>
        <Doors s={s} paint={paint} side={-1} />
      </Part>
      <Part id="glass">
        <Glass s={s} />
      </Part>
      <Part id="lights">
        <FrontLights s={s} />
      </Part>
      <Part id="lights" dir={[1.3, 0.3, 0]}>
        <RearLights s={s} lay={lay} />
      </Part>
    </>
  );
}
