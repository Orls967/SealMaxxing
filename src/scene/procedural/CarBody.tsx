import { useEffect, useMemo } from 'react';
import type * as THREE from 'three';
import { CUT_CAP, type MatKey } from '../materials';
import { Box, Cyl, Geo, Part, Rod, Sph, useMat, useMode } from '../prim';
import type { CarLayout } from './layouts';
import { stationAt, type CarShape, type PaintRef, type PatchDef } from './shapes';
import {
  CABIN_ZONES,
  arches,
  bodyGeometry,
  cabinGeometries,
  linerGeometry,
  linerWallGeometry,
  patchGeometry,
} from './surface';

function useDisposable<T extends THREE.BufferGeometry[]>(make: () => T, deps: unknown[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are supplied by the caller
  const g = useMemo(make, deps);
  useEffect(
    () => () => {
      for (const x of g) x.dispose();
    },
    [g],
  );
  return g;
}

const SIDES = [1, -1] as const;

/** Resolves livery-dependent paint references to a material key. */
function resolve(k: PaintRef, paint: MatKey): MatKey {
  if (k === 'body') return paint;
  // The black theme livery carries its accents in red; factory colours keep them in carbon.
  if (k === 'accent') return paint === 'paint' ? 'redDeep' : 'carbon';
  return k;
}

function Surf({ geometry, k }: { geometry: THREE.BufferGeometry; k: MatKey }) {
  return <Geo geometry={geometry} material={useMat(k)} />;
}

function Shell({ s, paint, cut }: { s: CarShape; paint: MatKey; cut: boolean }) {
  const [geo] = useDisposable(() => [bodyGeometry(s)], [s]);
  const liners = useDisposable(
    () =>
      arches(s).flatMap((a) => SIDES.flatMap((z) => [linerGeometry(s, a, z), linerWallGeometry(s, a, z)])),
    [s],
  );
  const mode = useMode();
  if (!geo) return null;
  return (
    <>
      <Surf geometry={geo} k={paint} />
      {cut && mode !== 'ghost' && <Geo geometry={geo} material={CUT_CAP} />}
      {mode !== 'ghost' && liners.map((g, i) => <Surf key={i} geometry={g} k="liner" />)}
    </>
  );
}

function Patches({ s, defs, paint, side }: { s: CarShape; defs: PatchDef[]; paint: MatKey; side?: 1 | -1 }) {
  const items = useMemo(
    () =>
      defs.flatMap((d) =>
        (d.centre ? ([1] as const) : side ? [side] : SIDES).map((z) => ({ d, z, k: resolve(d.k, paint) })),
      ),
    [defs, paint, side],
  );
  const geos = useDisposable(() => items.map(({ d, z }) => patchGeometry(s, d, z)), [s, items]);
  return (
    <>
      {items.map((it, i) => {
        const g = geos[i];
        return g ? <Surf key={i} geometry={g} k={it.k} /> : null;
      })}
    </>
  );
}

/** Thin dark seams along the leading and trailing edge of each door. */
function shutLines(s: CarShape): PatchDef[] {
  return s.doors.flatMap(([a, b]) =>
    [a, b].map((t): PatchDef => ({
      part: 'doors',
      k: 'intake',
      t: [t - 0.0016, t + 0.0016],
      a: [-42, 36],
      lift: 0.0075,
    })),
  );
}

function Cabin({
  s,
  paint,
  zones,
}: {
  s: CarShape;
  paint: MatKey;
  zones: readonly (typeof CABIN_ZONES)[number][];
}) {
  const all = useMemo(() => cabinGeometries(s), [s]);
  useEffect(
    () => () => {
      for (const z of CABIN_ZONES) all[z].dispose();
    },
    [all],
  );
  return (
    <>
      {zones.map((z) => (
        <Surf key={z} geometry={all[z]} k={resolve(s.gh.mats[z], paint)} />
      ))}
    </>
  );
}

function Mirrors({ s, paint }: { s: CarShape; paint: MatKey }) {
  const t = s.gh.header - 0.075;
  const st = stationAt(s, t);
  const z0 = st.hw * s.gh.belt * 0.98;
  const y = st.belt + 0.07;
  return (
    <>
      {SIDES.map((z) => (
        <group key={z}>
          <Rod k="trim" a={[st.x, y - 0.05, z * z0]} b={[st.x - 0.02, y, z * (z0 + 0.13)]} rad={0.014} />
          <Sph k={paint} p={[st.x - 0.02, y + 0.01, z * (z0 + 0.16)]} s={[0.055, 0.045, 0.085]} />
        </group>
      ))}
    </>
  );
}

function RearLights({ s, lay }: { s: CarShape; lay: CarLayout }) {
  const r = stationAt(s, 0.985);
  const y = r.belt - 0.07;
  switch (lay.tailLight) {
    case 'bar':
      return <Box k="tail" p={[r.x + 0.05, y, 0]} s={[0.04, 0.03, r.hw * 1.7]} />;
    case 'blade':
      return <Box k="tail" p={[r.x + 0.04, y + 0.02, 0]} s={[0.03, 0.015, r.hw * 1.5]} />;
    case 'round':
      return SIDES.map((side) => (
        <Cyl key={side} k="tail" p={[r.x + 0.04, y, side * r.hw * 0.62]} rad={0.07} h={0.05} axis="x" />
      ));
    case 'strips':
      return SIDES.map((side) => (
        <Box
          key={side}
          k="tail"
          p={[r.x + 0.03, y, side * r.hw * 0.62]}
          s={[0.03, 0.018, r.hw * 0.6]}
          r={[0, side * -0.35, 0]}
        />
      ));
  }
}

const GLASS_ZONES = ['windscreen', 'side', 'rear'] as const;
const PANEL_ZONES = ['roof', 'pillar', 'deck'] as const;

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
  const by = useMemo(() => {
    const of = (part: PatchDef['part']) => s.patches.filter((p) => p.part === part);
    return {
      panels: of('body-panels'),
      lights: of('lights'),
      glass: of('glass'),
      doors: [...of('doors'), ...shutLines(s)],
    };
  }, [s]);
  return (
    <>
      <Part id="body-panels">
        <Shell s={s} paint={paint} cut={cut} />
        <Patches s={s} defs={by.panels} paint={paint} />
        <Cabin s={s} paint={paint} zones={PANEL_ZONES} />
        <Mirrors s={s} paint={paint} />
      </Part>
      <Part id="doors">
        <Patches s={s} defs={by.doors} paint={paint} side={1} />
      </Part>
      <Part id="doors" mirror>
        <Patches s={s} defs={by.doors} paint={paint} side={-1} />
      </Part>
      <Part id="glass">
        <Cabin s={s} paint={paint} zones={GLASS_ZONES} />
        <Patches s={s} defs={by.glass} paint={paint} />
      </Part>
      <Part id="lights">
        <Patches s={s} defs={by.lights} paint={paint} />
      </Part>
      <Part id="lights" dir={[1.3, 0.3, 0]}>
        <RearLights s={s} lay={lay} />
      </Part>
    </>
  );
}
