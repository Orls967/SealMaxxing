import { CAR_MARKS } from '@/content/carMarks';
import { CAR_IDS, type CarId } from '@/content/ids';

/** Fill reference for a car: colour plus pattern, so charts never rely on colour alone. */
export const markFill = (id: CarId): string => `url(#mark-${id})`;

function Pattern({ id }: { id: CarId }) {
  const { color, pattern } = CAR_MARKS[id];
  const pid = `mark-${id}`;
  switch (pattern) {
    case 'solid':
      return (
        <pattern id={pid} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={color} />
        </pattern>
      );
    case 'diagonal':
      return (
        <pattern id={pid} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill={color} />
          <rect width="2.5" height="8" fill="black" fillOpacity="0.55" />
        </pattern>
      );
    case 'dots':
      return (
        <pattern id={pid} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={color} />
          <circle cx="4" cy="4" r="1.6" fill="white" fillOpacity="0.85" />
        </pattern>
      );
    case 'cross':
      return (
        <pattern id={pid} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={color} />
          <path d="M0 4H8M4 0V8" stroke="black" strokeOpacity="0.6" strokeWidth="1.4" />
        </pattern>
      );
    default: {
      const never: never = pattern;
      return never;
    }
  }
}

/** Shared SVG pattern definitions, mounted once in the app shell. */
export function ChartDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
      <defs>
        {CAR_IDS.map((id) => (
          <Pattern key={id} id={id} />
        ))}
      </defs>
    </svg>
  );
}

/** Small swatch showing a car's mark, for legends and labels. */
export function MarkSwatch({ id }: { id: CarId }) {
  return (
    <svg aria-hidden="true" focusable="false" width="14" height="14" className="inline-block shrink-0 align-middle">
      <rect width="14" height="14" rx="2" fill={markFill(id)} />
    </svg>
  );
}
