import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { PALETTE, mat } from './materials';

/**
 * Dark "bred" studio: black backdrop, dim reflective floor, red strip lights and white rim
 * lights so black bodywork still reads. Lit by light formers only: nothing is downloaded.
 */
export function Studio({ shadows = true, span = 6 }: { shadows?: boolean; span?: number }) {
  return (
    <>
      <color attach="background" args={[PALETTE.bg]} />
      <fog attach="fog" args={[PALETTE.bg, span * 2.2, span * 6]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 6, 4]} intensity={1.6} color={PALETTE.white} />
      <directionalLight position={[6, 3, -6]} intensity={2.4} color={PALETTE.white} />
      <directionalLight position={[-6, 2.5, -5]} intensity={1.4} color={PALETTE.white} />
      <Environment resolution={256} frames={1} background={false}>
        <color attach="background" args={[PALETTE.black]} />
        <Lightformer
          form="rect"
          intensity={1.6}
          color={PALETTE.white}
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 0.7, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color={PALETTE.white}
          position={[0, 5, -5]}
          rotation={[Math.PI / 3, 0, 0]}
          scale={[12, 0.4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color={PALETTE.white}
          position={[9, 2.5, -4]}
          rotation={[0, -Math.PI / 2.4, 0]}
          scale={[6, 0.8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color={PALETTE.white}
          position={[-9, 2.5, -4]}
          rotation={[0, Math.PI / 2.4, 0]}
          scale={[6, 0.8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={5}
          color={PALETTE.red}
          position={[0, 0.6, 8]}
          rotation={[0, Math.PI, 0]}
          scale={[16, 0.35, 1]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color={PALETTE.red}
          position={[0, 0.6, -8]}
          scale={[16, 0.25, 1]}
        />
      </Environment>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.002, 0]}
        material={mat('floor')}
        raycast={() => undefined}
      >
        <circleGeometry args={[span * 6, 64]} />
      </mesh>
      {[-1, 1].map((z) => (
        <mesh
          key={z}
          position={[1.4, 0.012, z * (span * 0.5 + 1.6)]}
          material={mat('strip')}
          raycast={() => undefined}
        >
          <boxGeometry args={[span * 2.4, 0.02, 0.05]} />
        </mesh>
      ))}
      {shadows && (
        <ContactShadows
          frames={1}
          position={[0, 0.001, 0]}
          scale={span * 3}
          far={1.6}
          blur={2.2}
          opacity={0.85}
          resolution={1024}
        />
      )}
    </>
  );
}
