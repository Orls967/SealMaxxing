import { useThree } from '@react-three/fiber';
import { CAR_IDS, type CarId } from '@/content/ids';
import { CameraRig } from './CameraRig';
import { CarModel } from './CarModel';
import type { MatKey } from './materials';
import { SHAPES } from './procedural/shapes';
import { Stage } from './Stage';
import { Studio } from './Studio';

const GAP = 2.75;

function Row({ paints, instant }: { paints: Partial<Record<CarId, MatKey>>; instant: boolean }) {
  const aspect = useThree((s) => s.size.width / s.size.height);
  const span = GAP * (CAR_IDS.length - 1);
  return (
    <>
      <Studio span={7} />
      {CAR_IDS.map((id, i) => {
        const s = SHAPES[id];
        // Bodies centred lengthwise so the difference in length shows at both ends.
        return (
          <CarModel
            key={id}
            carId={id}
            detail="exterior"
            paint={paints[id]}
            instant
            position={[s.fo - s.L / 2, 0, i * GAP - span / 2]}
          />
        );
      })}
      <CameraRig
        preset="quarter"
        target={[0, 0.45, 0]}
        distance={aspect < 1 ? 13 / aspect : aspect < 1.6 ? 17 : 13.5}
        instant={instant}
        allowBelow={false}
      />
    </>
  );
}

/** The four cars side by side at true scale. */
export function GarageScene({
  label,
  paints,
  instant,
}: {
  label: string;
  paints: Partial<Record<CarId, MatKey>>;
  instant: boolean;
}) {
  return (
    <Stage label={label} fov={28}>
      <Row paints={paints} instant={instant} />
    </Stage>
  );
}
