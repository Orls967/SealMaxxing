import { useMemo, useRef, type KeyboardEvent } from 'react';
import type { Car } from '@/content/types';
import { UI } from '@/content/ui';
import { soundProfileFor } from '@/lib/sound';
import { soundSupported, useEngineSound } from './useEngineSound';

const isPedalKey = (e: KeyboardEvent) => e.key === ' ' || e.key === 'Enter';

/** Hold to rev: plays a synthesised note for the car's engine or motors. */
export function EngineSoundButton({ car }: { car: Car }) {
  const profile = useMemo(() => soundProfileFor(car), [car]);
  const meter = useRef<HTMLSpanElement>(null);
  const { press, release } = useEngineSound(profile, meter);
  if (!soundSupported()) return null;
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        className="relative select-none overflow-hidden rounded border border-line bg-bg px-3 py-2 text-left text-sm font-semibold text-text hover:border-accent"
        aria-label={UI.sound.label(car.name)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          press();
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onKeyDown={(e) => {
          if (isPedalKey(e) && !e.repeat) press();
          if (isPedalKey(e)) e.preventDefault();
        }}
        onKeyUp={(e) => {
          if (isPedalKey(e)) release();
        }}
        onBlur={release}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span ref={meter} aria-hidden="true" className="absolute inset-y-0 left-0 w-0 bg-accent-dim" />
        <span className="relative flex items-center justify-between gap-2">
          <span>{UI.sound.hold}</span>
          <span className="text-xs font-normal text-muted">{UI.sound.kind[profile.kind]}</span>
        </span>
      </button>
      <p className="text-xs text-muted">{UI.sound.note}</p>
    </div>
  );
}
