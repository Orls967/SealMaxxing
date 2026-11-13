import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { RESPONSE, stepLevel, type SoundProfile } from '@/lib/sound';
import { createEngineVoice, type EngineVoice } from './engineVoice';

let sharedCtx: AudioContext | null = null;
/** Only one car sounds at a time: starting another silences the previous one. */
let silenceCurrent: (() => void) | null = null;

export const soundSupported = (): boolean => typeof window !== 'undefined' && 'AudioContext' in window;

/** Seconds the engine keeps idling after the pedal is released before it switches off. */
const IDLE_HOLD_S = 1.2;

/**
 * Hold-to-rev engine sound. `press` must be called from a user gesture (browsers only start
 * audio then). The meter element's width follows the throttle level without re-rendering.
 */
export function useEngineSound(profile: SoundProfile, meter: RefObject<HTMLElement | null>) {
  const state = useRef({
    voice: null as EngineVoice | null,
    level: 0,
    pedal: false,
    idleS: 0,
    last: 0,
    raf: 0,
  });

  const shutdown = useCallback(() => {
    const s = state.current;
    cancelAnimationFrame(s.raf);
    s.raf = 0;
    s.voice?.stop();
    s.voice = null;
    s.level = 0;
    s.pedal = false;
    if (meter.current) meter.current.style.width = '0%';
    if (silenceCurrent === shutdown) silenceCurrent = null;
  }, [meter]);

  const tick = useCallback(
    (now: number) => {
      const s = state.current;
      const dt = Math.min(0.1, (now - s.last) / 1000);
      s.last = now;
      s.level = stepLevel(s.level, s.pedal, dt, RESPONSE[profile.kind]);
      s.voice?.setLevel(s.level);
      if (meter.current) meter.current.style.width = `${Math.round(s.level * 100)}%`;
      s.idleS = s.pedal || s.level > 0 ? 0 : s.idleS + dt;
      if (s.idleS > IDLE_HOLD_S) {
        shutdown();
        return;
      }
      s.raf = requestAnimationFrame(tick);
    },
    [profile.kind, meter, shutdown],
  );

  const press = useCallback(() => {
    if (!soundSupported()) return;
    const s = state.current;
    s.pedal = true;
    if (s.voice) return;
    if (silenceCurrent && silenceCurrent !== shutdown) silenceCurrent();
    sharedCtx ??= new AudioContext();
    void sharedCtx.resume();
    s.voice = createEngineVoice(sharedCtx, profile);
    silenceCurrent = shutdown;
    s.idleS = 0;
    s.last = performance.now();
    s.raf = requestAnimationFrame(tick);
  }, [profile, shutdown, tick]);

  const release = useCallback(() => {
    state.current.pedal = false;
  }, []);

  useEffect(() => shutdown, [shutdown]);

  return { press, release };
}
