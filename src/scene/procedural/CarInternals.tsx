import { Fragment } from 'react';
import type { V3 } from '../explode';
import { Box, Cyl, Part, Ring, Rod, Sph, Tube } from '../prim';
import type { CarLayout } from './layouts';
import { stationAt, tOf, type CarShape } from './shapes';

const SIDES = [1, -1] as const;
type Side = 1 | -1;

interface P {
  s: CarShape;
  lay: CarLayout;
}

const belt = (s: CarShape, x: number) => stationAt(s, tOf(s, x)).belt;
const halfW = (s: CarShape, x: number) => stationAt(s, tOf(s, x)).hw;
const wheelZ = (s: CarShape, rear: boolean) => s.W / 2 - (rear ? s.tireWR : s.tireWF) / 2 - 0.02;
const axles = (s: CarShape) =>
  [
    { rear: false, x: 0, r: s.wheelRF, rim: s.rimRF, w: s.tireWF },
    { rear: true, x: s.wb, r: s.wheelRR, rim: s.rimRR, w: s.tireWR },
  ] as const;

/* ---------- Structure ---------- */

function Structure({ s, lay }: P) {
  const ev = !lay.engine;
  const x0 = ev ? 0.38 : 0.42;
  const x1 = ev ? s.wb - 0.38 : (lay.tank?.x ?? 1.6) - 0.16;
  const w = ev ? s.W * 0.78 : s.W * 0.66;
  const k = ev ? 'steel' : 'carbon';
  const sillH = ev ? 0.14 : 0.24;
  const len = x1 - x0;
  const mid = (x0 + x1) / 2;
  const roofY = s.H - 0.06;
  const xTail = s.L - s.fo;
  return (
    <>
      <Part id="tub">
        <Box k={k} p={[mid, 0.125, 0]} s={[len, 0.03, w]} />
        {SIDES.map((z) => (
          <Fragment key={z}>
            <Box k={k} p={[mid, 0.14 + sillH / 2, (z * w) / 2]} s={[len, sillH, 0.11]} />
            {/* A-pillar, roof rail, rear pillar */}
            <Rod k={k} a={[x0 + 0.05, belt(s, x0) - 0.06, z * w * 0.44]} b={[x0 + 0.62, roofY, z * w * 0.33]} rad={0.028} />
            <Rod k={k} a={[x0 + 0.62, roofY, z * w * 0.33]} b={[x1 - 0.1, roofY - 0.03, z * w * 0.33]} rad={0.028} />
            <Rod k={k} a={[x1 - 0.1, roofY - 0.03, z * w * 0.33]} b={[x1 + 0.05, belt(s, x1) - 0.05, z * w * 0.44]} rad={0.028} />
            {ev && <Rod k={k} a={[mid + 0.1, 0.28, z * w * 0.48]} b={[mid + 0.1, roofY - 0.02, z * w * 0.34]} rad={0.03} />}
          </Fragment>
        ))}
        <Box k={k} p={[x0, 0.36, 0]} s={[0.04, 0.46, w]} />
        <Box k={k} p={[x1, ev ? 0.3 : 0.44, 0]} s={[0.04, ev ? 0.34 : 0.62, w]} />
        {ev && [0.3, 0.55, 0.8].map((f) => <Box key={f} k={k} p={[x0 + len * f, 0.15, 0]} s={[0.06, 0.05, w]} />)}
        {!ev && <Rod k={k} a={[x0 + 0.62, roofY, -w * 0.33]} b={[x0 + 0.62, roofY, w * 0.33]} rad={0.028} />}
      </Part>
      <Part id="subframes">
        {SIDES.map((z) => (
          <Rod key={z} k="metal" a={[-0.42, 0.3, z * 0.38]} b={[x0, 0.24, z * 0.42]} rad={0.03} />
        ))}
        <Rod k="metal" a={[-0.1, 0.2, -0.4]} b={[-0.1, 0.2, 0.4]} rad={0.03} />
      </Part>
      <Part id="subframes" dir={[0.9, 0, 0]}>
        {SIDES.map((z) => (
          <Rod key={z} k="metal" a={[x1, 0.24, z * 0.46]} b={[xTail - 0.4, 0.34, z * 0.4]} rad={0.03} />
        ))}
        <Rod k="metal" a={[s.wb + 0.12, 0.22, -0.42]} b={[s.wb + 0.12, 0.22, 0.42]} rad={0.03} />
      </Part>
      <Part id="crash-structure">
        <Box k="metal" p={[-s.fo + 0.2, 0.36, 0]} s={[0.07, 0.1, s.W * 0.62]} />
        {SIDES.map((z) => (
          <Box key={z} k="redDeep" p={[-s.fo + 0.4, 0.34, z * 0.38]} s={[0.34, 0.1, 0.1]} />
        ))}
      </Part>
      <Part id="crash-structure" dir={[1.7, 0, 0]}>
        <Box k="metal" p={[xTail - 0.16, 0.42, 0]} s={[0.07, 0.1, s.W * 0.66]} />
        {SIDES.map((z) => (
          <Box key={z} k="redDeep" p={[xTail - 0.34, 0.4, z * 0.4]} s={[0.3, 0.1, 0.1]} />
        ))}
      </Part>
    </>
  );
}

/* ---------- Powertrain ---------- */

function Engine({ e }: { e: NonNullable<CarLayout['engine']> }) {
  const half = ((e.vDeg / 2) * Math.PI) / 180;
  const n = e.cyl / 2;
  const y0 = 0.17;
  return (
    <>
      <Box k="dark" p={[e.x, y0 + 0.1, 0]} s={[e.len, 0.2, 0.3]} />
      <Cyl k="steel" p={[e.x - e.len / 2 - 0.02, y0 + 0.1, 0]} rad={0.07} h={0.04} axis="x" />
      {SIDES.map((z) => (
        <group key={z} position={[e.x, y0 + 0.14, 0]} rotation={[z * half, 0, 0]}>
          <Box k="metal" p={[0, 0.16, 0]} s={[e.len, 0.24, 0.15]} />
          <Box k="red" p={[0, 0.3, 0]} s={[e.len * 0.97, 0.05, 0.16]} />
          {Array.from({ length: n }, (_, i) => (
            <Cyl key={i} k="dark" p={[(i - (n - 1) / 2) * (e.len / n), 0.335, 0]} rad={0.022} h={0.03} />
          ))}
        </group>
      ))}
    </>
  );
}

function Induction({ s, lay }: P) {
  const e = lay.engine;
  if (!e) return null;
  const top = 0.62;
  const roofX = 1.45;
  return (
    <>
      <Box k="carbon" p={[e.x, top, 0]} s={[e.len * 0.86, 0.1, 0.24]} />
      {lay.roofScoop ? (
        <Tube k="carbon" pts={[[roofX, s.H - 0.03, 0], [roofX + 0.25, s.H - 0.08, 0], [e.x - 0.1, top + 0.14, 0], [e.x, top + 0.04, 0]]} rad={0.07} />
      ) : (
        SIDES.map((z) => (
          <Tube key={z} k="carbon" pts={[[1.5, 0.92, z * 0.42], [1.75, 0.82, z * 0.36], [e.x - 0.1, top + 0.04, z * 0.1]]} rad={0.05} />
        ))
      )}
      {e.turbo &&
        SIDES.map((z) => (
          <Fragment key={z}>
            <Ring k="metal" p={[e.x + e.len / 2 + 0.1, 0.36, z * 0.3]} rad={0.085} axis="x" />
            <Cyl k="steel" p={[e.x + e.len / 2 + 0.1, 0.36, z * 0.3]} rad={0.06} h={0.12} axis="x" />
            <Box k="metal" p={[e.x - 0.05, 0.42, z * 0.56]} s={[0.36, 0.2, 0.07]} />
            <Tube k="metal" pts={[[e.x + e.len / 2 + 0.1, 0.44, z * 0.3], [e.x + 0.2, 0.5, z * 0.5], [e.x - 0.05, 0.5, z * 0.56]]} rad={0.028} />
          </Fragment>
        ))}
    </>
  );
}

function Powertrain({ s, lay }: P) {
  const yF = s.wheelRF;
  const yR = s.wheelRR;
  const mr = lay.motorRear;
  return (
    <>
      {lay.engine && (
        <Part id="engine">
          <Engine e={lay.engine} />
        </Part>
      )}
      <Part id="induction">
        <Induction s={s} lay={lay} />
      </Part>
      {lay.motorFront && (
        <Part id="motor-front">
          <Cyl k="metal" p={[0, yF, 0.06]} rad={lay.motorFront.rad} h={lay.motorFront.len} axis="z" />
          <Cyl k="red" p={[0, yF, 0.06 + lay.motorFront.len / 2]} rad={lay.motorFront.rad * 0.8} h={0.03} axis="z" />
        </Part>
      )}
      {mr && (
        <Part id="motor-rear">
          {mr.kind === 'axle' ? (
            <>
              <Cyl k="metal" p={[s.wb, yR, -0.05]} rad={mr.rad} h={mr.len} axis="z" />
              <Cyl k="red" p={[s.wb, yR, -0.05 - mr.len / 2]} rad={mr.rad * 0.8} h={0.03} axis="z" />
            </>
          ) : (
            <>
              <Cyl k="metal" p={[mr.x, mr.y, mr.z]} rad={mr.rad} h={mr.len} axis="x" />
              <Cyl k="red" p={[mr.x + mr.len / 2, mr.y, mr.z]} rad={mr.rad * 0.8} h={0.03} axis="x" />
            </>
          )}
        </Part>
      )}
      <Part id="regen">
        {lay.motorFront && <Ring k="red" p={[0, yF, 0.06]} rad={lay.motorFront.rad + 0.05} axis="z" />}
        {mr?.kind === 'axle' && <Ring k="red" p={[s.wb, yR, -0.05]} rad={mr.rad + 0.05} axis="z" />}
        {mr?.kind === 'inline' && <Ring k="red" p={[mr.x, mr.y, mr.z]} rad={mr.rad + 0.04} axis="x" />}
      </Part>
      <Part id="transmission">
        {lay.gearbox ? (
          <>
            <Box k="dark" p={[lay.gearbox.x, 0.31, 0]} s={[lay.gearbox.len, 0.3, 0.34]} />
            <Cyl k="steel" p={[lay.gearbox.x - lay.gearbox.len / 2, 0.31, 0]} rad={0.19} h={0.08} axis="x" />
          </>
        ) : (
          <>
            {lay.motorFront && <Box k="dark" p={[0.02, yF - 0.02, -0.2]} s={[0.26, 0.26, 0.14]} />}
            <Box k="dark" p={[s.wb + 0.02, yR - 0.02, 0.22]} s={[0.28, 0.28, 0.14]} />
          </>
        )}
      </Part>
      <Part id="driveline">
        {SIDES.map((z) => (
          <Fragment key={z}>
            <Rod k="steel" a={[s.wb, yR, z * 0.16]} b={[s.wb, yR, z * (wheelZ(s, true) - 0.1)]} rad={0.022} />
            {lay.motorFront && <Rod k="steel" a={[0, yF, z * 0.16]} b={[0, yF, z * (wheelZ(s, false) - 0.1)]} rad={0.02} />}
          </Fragment>
        ))}
        {lay.gearbox && <Sph k="steel" p={[s.wb, yR, 0]} s={[0.13, 0.13, 0.13]} />}
      </Part>
    </>
  );
}

/* ---------- Energy ---------- */

function Energy({ s, lay }: P) {
  const b = lay.battery;
  const t = lay.tank;
  const cp = lay.chargePort;
  return (
    <>
      {b && (
        <Part id="battery" dir={lay.engine ? [0, 1.45, 0] : undefined}>
          <Box k="dark" p={[(b.x0 + b.x1) / 2, b.y0 + b.h / 2, 0]} s={[b.x1 - b.x0, b.h, b.w]} />
          {Array.from({ length: b.blades }, (_, i) => (
            <Box
              key={i}
              k="cell"
              p={[b.x0 + ((i + 0.5) * (b.x1 - b.x0)) / b.blades, b.y0 + b.h + 0.004, 0]}
              s={[((b.x1 - b.x0) / b.blades) * 0.7, 0.012, b.w * 0.92]}
            />
          ))}
        </Part>
      )}
      {t && (
        <Part id="fuel-tank">
          <Box k="steel" p={[t.x, t.y0 + t.h / 2, 0]} s={[t.len, t.h, t.w]} />
          <Cyl k="red" p={[t.x, t.y0 + t.h + 0.02, t.w * 0.35]} rad={0.035} h={0.04} />
        </Part>
      )}
      <Part id="power-electronics">
        {lay.inverters.map((v, i) => (
          <Fragment key={i}>
            <Box k="metal" p={[v.x, v.y, v.z]} s={v.s} />
            <Box k="red" p={[v.x, v.y + v.s[1] / 2 + 0.006, v.z]} s={[v.s[0] * 0.5, 0.012, v.s[2] * 0.5]} />
          </Fragment>
        ))}
        {b && lay.inverters[0] && (
          <Tube
            k="red"
            pts={[
              [(b.x0 + b.x1) / 2, b.y0 + b.h, b.w * 0.3],
              [(b.x0 + b.x1) / 2 + 0.1, lay.inverters[0].y, b.w * 0.3],
              [lay.inverters[0].x, lay.inverters[0].y, lay.inverters[0].z],
            ]}
            rad={0.014}
          />
        )}
      </Part>
      {cp && (
        <Part id="charge-port" mirror={cp.side === -1}>
          <Cyl k="red" p={[cp.x, cp.y, cp.side * (halfW(s, cp.x) - 0.02)]} rad={0.055} h={0.06} axis="z" />
          <Cyl k="dark" p={[cp.x, cp.y, cp.side * (halfW(s, cp.x) + 0.012)]} rad={0.04} h={0.01} axis="z" />
        </Part>
      )}
    </>
  );
}

/* ---------- Thermal & exhaust ---------- */

function Thermal({ s, lay }: P) {
  const b = lay.battery;
  const nose = -s.fo;
  const sideX = s.wb - 0.72;
  const ev = !lay.engine;
  return (
    <>
      <Part id="radiators">
        <Box k="metal" p={[nose + 0.36, ev ? 0.4 : 0.3, 0]} s={[0.04, ev ? 0.3 : 0.24, s.W * (ev ? 0.4 : 0.5)]} r={[0, 0, ev ? 0.1 : 0.55]} />
      </Part>
      {lay.sideRadiators &&
        SIDES.map((z) => (
          <Part key={z} id="radiators" dir={[0, 0.3, 1.0]} mirror={z === -1}>
            <Box k="metal" p={[sideX, 0.46, z * (s.W / 2 - 0.2)]} s={[0.36, 0.36, 0.045]} r={[0, z * 0.45, 0]} />
          </Part>
        ))}
      {b && (
        <Part id="battery-cooling" dir={lay.engine ? [0, 1.75, 0] : undefined}>
          <Box k="metal" p={[(b.x0 + b.x1) / 2, b.y0 - 0.012, 0]} s={[(b.x1 - b.x0) * 0.96, 0.012, b.w * 0.9]} />
          <Tube k="metal" pts={[[b.x0, b.y0, b.w * 0.42], [b.x0 - 0.3, 0.22, 0.5], [nose + 0.45, 0.3, 0.3]]} rad={0.012} />
        </Part>
      )}
      <Part id="air-paths">
        {ev ? (
          SIDES.map((z) => (
            <Tube key={z} k="flow" pts={[[nose - 0.3, 0.32, z * 0.62], [nose + 0.15, 0.32, z * 0.82], [0.2, 0.4, z * (s.W / 2 + 0.06)], [1.2, 0.5, z * (s.W / 2 + 0.05)]]} rad={0.03} />
          ))
        ) : (
          <>
            <Tube k="flow" pts={[[nose - 0.35, 0.28, 0], [nose + 0.36, 0.3, 0], [nose + 0.75, belt(s, nose + 0.75) + 0.08, 0], [0.4, belt(s, 0.4) + 0.2, 0]]} rad={0.045} />
            {SIDES.map((z) => (
              <Tube key={z} k="flow" pts={[[0.9, 0.5, z * (s.W / 2 + 0.1)], [1.5, 0.48, z * (s.W / 2 + 0.02)], [sideX, 0.46, z * (s.W / 2 - 0.2)], [sideX + 0.5, belt(s, sideX + 0.5) + 0.1, z * 0.45]]} rad={0.04} />
            ))}
          </>
        )}
      </Part>
    </>
  );
}

function Exhaust({ s, lay }: P) {
  const e = lay.engine;
  if (!e || !lay.exhaust) return null;
  const xTail = s.L - s.fo;
  const out = (z: number): V3 => [e.x + e.len / 2, 0.24, z * 0.34];
  return (
    <Part id="exhaust">
      {lay.exhaust === 'twin-centre' &&
        SIDES.map((z) => (
          <Fragment key={z}>
            <Tube k="metal" pts={[[e.x, 0.26, z * 0.32], out(z), [lay.gearbox!.x, 0.5, z * 0.3], [xTail - 0.2, 0.52, z * 0.26]]} rad={0.04} />
            <Cyl k="steel" p={[xTail - 0.12, 0.52, z * 0.26]} rad={0.05} h={0.2} axis="x" />
          </Fragment>
        ))}
      {lay.exhaust === 'single-centre' && (
        <>
          {SIDES.map((z) => (
            <Tube key={z} k="metal" pts={[[e.x, 0.26, z * 0.32], out(z), [lay.gearbox!.x, 0.52, z * 0.2], [xTail - 0.45, 0.6, 0]]} rad={0.04} />
          ))}
          <Cyl k="steel" p={[xTail - 0.25, 0.6, 0]} rad={0.085} h={0.45} axis="x" />
        </>
      )}
      {lay.exhaust === 'top' &&
        [-1, 0, 1].map((i) => (
          <Tube
            key={i}
            k="metal"
            pts={[[e.x + (i === 0 ? 0.1 : 0), 0.26, i * 0.32], [e.x + e.len / 2 + 0.2, 0.4, i * 0.24], [s.wb + 0.12, 0.66, i * 0.11], [s.wb + 0.2, belt(s, s.wb + 0.2) + 0.03, i * 0.11]]}
            rad={0.04}
          />
        ))}
    </Part>
  );
}

/* ---------- Corners: suspension, brakes, wheels ---------- */

function Corner({ s, lay, rear, z }: P & { rear: boolean; z: Side }) {
  const a = axles(s)[rear ? 1 : 0];
  const zw = z * wheelZ(s, rear);
  const zi = z * (wheelZ(s, rear) - 0.42);
  const zu = z * (wheelZ(s, rear) - 0.14);
  const disc = rear ? lay.discRR : lay.discRF;
  const mirror = z === -1;
  const spokes = 10;
  const dx = rear ? 0.35 : -0.35;
  return (
    <>
      <Part id={rear ? 'suspension-rear' : 'suspension-front'} mirror={mirror}>
        {[-0.2, 0.2].map((o) => (
          <Fragment key={o}>
            <Rod k="steel" a={[a.x + o, a.r - 0.11, zi]} b={[a.x, a.r - 0.1, zu]} rad={0.014} />
            <Rod k="steel" a={[a.x + o * 0.8, a.r + 0.13, zi + z * 0.05]} b={[a.x, a.r + 0.12, zu]} rad={0.012} />
          </Fragment>
        ))}
        <Rod k="red" a={[a.x, a.r - 0.09, zu - z * 0.1]} b={[a.x + dx * 0.15, a.r + 0.34, zi + z * 0.08]} rad={0.03} />
        <Rod k="metal" a={[a.x, a.r - 0.09, zu - z * 0.1]} b={[a.x + dx * 0.11, a.r + 0.2, zi + z * 0.13]} rad={0.018} />
        <Box k="dark" p={[a.x, a.r, zu]} s={[0.08, 0.3, 0.05]} />
      </Part>
      <Part id="discs" mirror={mirror}>
        <Cyl k="ceramic" p={[a.x, a.r, zw - z * 0.07]} rad={disc} h={0.032} axis="z" />
        <Cyl k="metal" p={[a.x, a.r, zw - z * 0.07]} rad={disc * 0.45} h={0.05} axis="z" />
      </Part>
      <Part id="calipers" mirror={mirror}>
        <Box k="red" p={[a.x + (rear ? 0.7 : -0.7) * disc, a.r + disc * 0.55, zw - z * 0.07]} s={[0.1, 0.16, 0.085]} r={[0, 0, rear ? -0.9 : 0.9]} />
      </Part>
      <Part id="wheels" mirror={mirror}>
        <Cyl k="dark" p={[a.x, a.r, zw]} rad={a.rim} h={a.w * 0.96} axis="z" />
        <group position={[a.x, a.r, zw + z * (a.w / 2 + 0.002)]}>
          {Array.from({ length: spokes }, (_, i) => (
            <Box key={i} k="metal" s={[a.rim * 0.92, 0.022, 0.014]} p={[Math.cos((i * 2 * Math.PI) / spokes) * a.rim * 0.5, Math.sin((i * 2 * Math.PI) / spokes) * a.rim * 0.5, 0]} r={[0, 0, (i * 2 * Math.PI) / spokes]} />
          ))}
          <Cyl k="red" rad={0.035} h={0.02} axis="z" />
          <Ring k="metal" rad={a.rim * 0.97} axis="z" />
        </group>
      </Part>
      <Part id="tires" mirror={mirror}>
        <Cyl k="rubber" p={[a.x, a.r, zw]} rad={a.r} h={a.w * 0.9} axis="z" />
        <Ring k="rubber" p={[a.x, a.r, zw + a.w * 0.36]} rad={a.r - 0.02} axis="z" />
        <Ring k="rubber" p={[a.x, a.r, zw - a.w * 0.36]} rad={a.r - 0.02} axis="z" />
      </Part>
    </>
  );
}

function Steering({ s, lay }: P) {
  const dz = lay.driverZ * 0.36;
  const seatX = lay.seatRows[0]!.x;
  return (
    <Part id="steering">
      <Rod k="metal" a={[-0.14, s.wheelRF - 0.02, -0.5]} b={[-0.14, s.wheelRF - 0.02, 0.5]} rad={0.022} />
      {SIDES.map((z) => (
        <Rod key={z} k="steel" a={[-0.14, s.wheelRF - 0.02, z * 0.5]} b={[-0.08, s.wheelRF, z * (wheelZ(s, false) - 0.14)]} rad={0.012} />
      ))}
      <Rod k="steel" a={[-0.14, s.wheelRF, dz]} b={[seatX - 0.5, belt(s, seatX - 0.5) - 0.12, dz]} rad={0.014} />
    </Part>
  );
}

/* ---------- Aero ---------- */

function Aero({ s, lay }: P) {
  const nose = -s.fo;
  const xTail = s.L - s.fo;
  const ev = !lay.engine;
  const floorY = 0.085;
  const deck = belt(s, xTail - 0.25);
  const wingZ = lay.wing === 'fixed' ? s.W * 0.98 : s.W * 0.8;
  const wingY = lay.wing === 'fixed' ? s.H - 0.02 : deck + 0.2;
  const wingX = lay.wing === 'fixed' ? xTail - 0.08 : xTail - 0.28;
  return (
    <>
      <Part id="front-aero">
        <Box k={ev ? 'plastic' : 'carbon'} p={[nose + (ev ? 0.14 : 0.08), ev ? 0.2 : 0.075, 0]} s={[ev ? 0.14 : 0.42, ev ? 0.05 : 0.014, s.W * (ev ? 0.72 : 0.86)]} />
        {!ev && SIDES.map((z) => <Box key={z} k="carbon" p={[nose + 0.1, 0.13, z * s.W * 0.4]} s={[0.3, 0.1, 0.012]} />)}
      </Part>
      <Part id="underbody">
        <Box k="plastic" p={[(nose + 0.3 + s.wb + 0.1) / 2, floorY, 0]} s={[s.wb - nose - 0.2, 0.012, s.W * 0.72]} />
        <Box k="carbon" p={[(s.wb + 0.1 + xTail) / 2, floorY + (ev ? 0.07 : 0.14), 0]} s={[xTail - s.wb - 0.1, 0.012, s.W * 0.7]} r={[0, 0, ev ? -0.16 : -0.3]} />
        {(ev ? [-0.3, 0.3] : [-0.45, -0.15, 0.15, 0.45]).map((f) => (
          <Box key={f} k="carbon" p={[(s.wb + 0.1 + xTail) / 2 + 0.1, floorY + (ev ? 0.06 : 0.12), f * s.W * 0.7]} s={[xTail - s.wb - 0.3, ev ? 0.08 : 0.18, 0.012]} r={[0, 0, ev ? -0.16 : -0.3]} />
        ))}
      </Part>
      <Part id="rear-wing">
        {lay.wing === 'lip' && <Box k="paint" p={[xTail - 0.2, belt(s, xTail - 0.2) + 0.012, 0]} s={[0.12, 0.03, s.W * 0.72]} r={[0, 0, -0.25]} />}
        {lay.wing === 'hidden' && <Box k="carbon" p={[xTail - 0.2, deck + 0.05, 0]} s={[0.26, 0.016, s.W * 0.7]} r={[0, 0, -0.2]} />}
        {(lay.wing === 'raised' || lay.wing === 'fixed') && (
          <>
            <Box k="carbon" p={[wingX, wingY, 0]} s={[lay.wing === 'fixed' ? 0.4 : 0.32, 0.024, wingZ]} r={[0, 0, -0.16]} />
            {lay.wing === 'fixed' && <Box k="carbon" p={[wingX + 0.16, wingY + 0.05, 0]} s={[0.14, 0.014, wingZ]} r={[0, 0, -0.5]} />}
            {SIDES.map((z) => (
              <Fragment key={z}>
                {lay.wing === 'fixed' ? (
                  <>
                    <Tube k="carbon" pts={[[xTail - 0.5, deck, z * 0.42], [xTail - 0.42, wingY + 0.12, z * 0.42], [wingX - 0.05, wingY + 0.03, z * 0.42]]} rad={0.022} />
                    <Box k="carbon" p={[wingX + 0.04, wingY - 0.04, (z * wingZ) / 2]} s={[0.5, 0.26, 0.012]} />
                  </>
                ) : (
                  <Rod k="dark" a={[wingX, deck - 0.02, z * 0.4]} b={[wingX, wingY, z * 0.4]} rad={0.024} />
                )}
              </Fragment>
            ))}
          </>
        )}
      </Part>
      <Part id="active-aero">
        {SIDES.map((z) => (
          <Box key={z} k="redDeep" p={[nose + 0.5, 0.1, z * s.W * 0.26]} s={[0.2, 0.012, 0.3]} r={[0, 0, 0.25]} />
        ))}
        <Box k="redDeep" p={[xTail - 0.12, floorY + 0.24, 0]} s={[0.2, 0.012, s.W * 0.5]} r={[0, 0, -0.5]} />
      </Part>
      <Part id="air-brake">
        {SIDES.map((z) => (
          <Rod key={z} k="red" a={[wingX - 0.1, deck - 0.04, z * 0.24]} b={[wingX + 0.02, lay.wing === 'hidden' ? deck + 0.04 : wingY - 0.02, z * 0.24]} rad={0.016} />
        ))}
      </Part>
    </>
  );
}

/* ---------- Cabin & electronics ---------- */

function Seat({ x, z, w }: { x: number; z: number; w: number }) {
  return (
    <>
      <Box k="seat" p={[x, 0.3, z]} s={[0.46, 0.1, w]} />
      <Box k="seat" p={[x + 0.27, 0.56, z]} s={[0.1, 0.56, w]} r={[0, 0, 0.3]} />
      <Box k="red" p={[x + 0.21, 0.58, z]} s={[0.012, 0.44, w * 0.2]} r={[0, 0, 0.3]} />
      <Box k="seat" p={[x + 0.36, 0.9, z]} s={[0.08, 0.14, w * 0.5]} r={[0, 0, 0.2]} />
    </>
  );
}

function Cabin({ s, lay }: P) {
  const seatX = lay.seatRows[0]!.x;
  const dashX = seatX - 0.72;
  const dashY = belt(s, dashX) - 0.1;
  const dz = lay.driverZ * 0.36;
  const ev = !lay.engine;
  return (
    <>
      <Part id="seats">
        {lay.seatRows.map((row) =>
          row.n === 2 ? (
            SIDES.map((z) => <Seat key={`${row.x}${z}`} x={row.x} z={z * 0.36} w={0.44} />)
          ) : (
            <Fragment key={row.x}>
              <Seat x={row.x} z={0} w={1.3} />
            </Fragment>
          ),
        )}
      </Part>
      <Part id="dashboard">
        <Box k="plastic" p={[dashX, dashY, 0]} s={[0.24, 0.14, halfW(s, dashX) * 1.5]} />
        <Box k="screen" p={[dashX + 0.13, dashY + 0.1, dz]} s={[0.012, 0.09, 0.26]} />
        {ev && <Box k="screen" p={[dashX + 0.15, dashY + 0.08, 0]} s={[0.014, 0.2, 0.34]} />}
      </Part>
      <Part id="controls">
        <group position={[dashX + 0.3, dashY + 0.04, dz]} rotation={[0, 0, -0.35]}>
          <Ring k="plastic" rad={0.17} axis="x" />
          <Box k="red" s={[0.012, 0.03, 0.3]} />
        </group>
        <Box k="dark" p={[dashX + 0.02, 0.2, dz]} s={[0.06, 0.16, 0.24]} />
      </Part>
      <Part id="cargo">
        {lay.cargo.map((c, i) => (
          <Box key={i} k="volume" p={[c.x, c.y, 0]} s={c.s} />
        ))}
        {lay.helmets && SIDES.map((z) => <Sph key={z} k="volume" p={[seatX + 0.5, 0.82, z * 0.3]} s={[0.14, 0.14, 0.13]} />)}
      </Part>
      <Part id="drive-modes">
        <Cyl k="red" p={[seatX - 0.25, 0.46, 0]} rad={0.035} h={0.04} />
        <Box k="plastic" p={[seatX - 0.2, 0.38, 0]} s={[0.5, 0.12, 0.16]} />
      </Part>
      <Part id="stability">
        <Box k="metal" p={[dashX - 0.25, 0.42, -lay.driverZ * 0.3]} s={[0.16, 0.1, 0.18]} />
        {axles(s).flatMap((a) => SIDES.map((z) => <Cyl key={`${a.x}${z}`} k="red" p={[a.x + 0.07, a.r, z * (wheelZ(s, a.rear) - 0.16)]} rad={0.016} h={0.05} axis="z" />))}
      </Part>
      <Part id="driver-assist">
        <Box k="red" p={[-s.fo + 0.06, 0.42, 0]} s={[0.05, 0.07, 0.12]} />
        <Box k="red" p={[dashX + 0.34, s.H - 0.12, 0]} s={[0.05, 0.035, 0.1]} />
        {SIDES.map((z) => (
          <Fragment key={z}>
            <Box k="red" p={[-s.fo + 0.2, 0.45, z * s.W * 0.4]} s={[0.04, 0.05, 0.06]} />
            <Box k="red" p={[s.L - s.fo - 0.2, 0.5, z * s.W * 0.4]} s={[0.04, 0.05, 0.06]} />
          </Fragment>
        ))}
      </Part>
    </>
  );
}

export function CarInternals({ s, lay }: P) {
  return (
    <>
      <Structure s={s} lay={lay} />
      <Powertrain s={s} lay={lay} />
      <Energy s={s} lay={lay} />
      <Thermal s={s} lay={lay} />
      <Exhaust s={s} lay={lay} />
      {([false, true] as const).flatMap((rear) => SIDES.map((z) => <Corner key={`${rear}${z}`} s={s} lay={lay} rear={rear} z={z} />))}
      <Steering s={s} lay={lay} />
      <Aero s={s} lay={lay} />
      <Cabin s={s} lay={lay} />
    </>
  );
}
