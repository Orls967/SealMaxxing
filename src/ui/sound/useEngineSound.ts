import { useCallback, useEffect, useRef, type RefObject } from 'react';
import type { CarSound } from '@/content/sounds';
import { RESPONSE, stepLevel, type SoundProfile } from '@/lib/sound';
import { createEngineVoice, type EngineVoice } from './engineVoice';
import { createRecordedVoice, loadClips, type RecordedVoice } from './recordedVoice';

let sharedCtx: AudioContext | null = null;
/** Only one car sounds at a time: starting another silences the previous one. */
let silenceCurrent: (() => void) | null = null;

export const soundSupported = (): boolean => typeof window !== 'undefined' && 'AudioContext' in window;

/** Seconds the engine keeps idling after the pedal is released before it switches off. */
const IDLE_HOLD_S = 1.2;

function audio(): AudioContext {
  sharedCtx ??= new AudioContext();
  void sharedCtx.resume();
  return sharedCtx;
}

interface State {
  recorded: RecordedVoice | null;
  synth: EngineVoice | null;
  /** Bumped on every shutdown so a late-arriving download does not start a stale voice. */
  session: number;
  loading: boolean;
  level: number;
  pedal: boolean;
  idleS: number;
  last: number;
  raf: number;
}

/**
 * Hold-to-rev sound. Plays the car's recordings; if they cannot be loaded it falls back to the
 * synthesised note and reports that through `onFallback`. `press` must come from a user
 * gesture. The meter element's width is driven directly, without re-rendering.
 */
export function useEngineSound(
  sound: CarSound,
  profile: SoundProfile,
  meter: RefObject<HTMLElement | null>,
  onFallback: () => void,
) {
  const state = useRef<State>({
    recorded: null,
    synth: null,
    session: 0,
    loading: false,
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
    s.session++;
    s.recorded?.stop();
    s.recorded = null;
    s.synth?.stop();
    s.synth = null;
    s.loading = false;
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
      let shown = 0;
      if (s.synth) {
        s.level = stepLevel(s.level, s.pedal, dt, RESPONSE[profile.kind]);
        s.synth.setLevel(s.level);
        shown = s.level;
      } else if (s.recorded) {
        shown = s.recorded.progress();
      }
      if (meter.current) meter.current.style.width = `${Math.round(shown * 100)}%`;
      s.idleS = s.pedal || s.loading || shown > 0 ? 0 : s.idleS + dt;
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
    if (s.recorded) return s.recorded.pedalDown();
    if (s.synth || s.loading) return;
    if (silenceCurrent && silenceCurrent !== shutdown) silenceCurrent();
    silenceCurrent = shutdown;
    const ctx = audio();
    const session = s.session;
    s.loading = true;
    s.idleS = 0;
    s.last = performance.now();
    s.raf = requestAnimationFrame(tick);
    loadClips(ctx, sound).then(
      (clips) => {
        if (state.current.session !== session) return;
        s.loading = false;
        s.recorded = createRecordedVoice(ctx, clips);
        if (s.pedal) s.recorded.pedalDown();
      },
      () => {
        if (state.current.session !== session) return;
        s.loading = false;
        s.synth = createEngineVoice(ctx, profile);
        onFallback();
      },
    );
  }, [sound, profile, shutdown, tick, onFallback]);

  const release = useCallback(() => {
    const s = state.current;
    s.pedal = false;
    s.recorded?.pedalUp();
  }, []);

  /** Starts the download early (on hover or focus) so the first press answers quickly. */
  const warm = useCallback(() => {
    if (sharedCtx) void loadClips(sharedCtx, sound).catch(() => undefined);
  }, [sound]);

  useEffect(() => shutdown, [shutdown]);

  return { press, release, warm };
}
