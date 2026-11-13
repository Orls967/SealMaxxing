import type { CarSound } from '@/content/sounds';

/** Plays real recordings: an optional idle loop plus a rev clip that runs while the pedal is held. */
export interface RecordedVoice {
  pedalDown: () => void;
  pedalUp: () => void;
  /** 0..1: how far through the rev clip playback is; 0 when the pedal is up. */
  progress: () => number;
  stop: () => void;
}

export interface ClipBuffers {
  idle: AudioBuffer | null;
  rev: AudioBuffer;
}

const cache = new Map<string, Promise<AudioBuffer>>();

function load(ctx: AudioContext, file: string): Promise<AudioBuffer> {
  let p = cache.get(file);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}sounds/${file}`)
      .then((r) => {
        if (!r.ok) throw new Error(`sound ${file}: HTTP ${r.status}`);
        return r.arrayBuffer();
      })
      .then((data) => ctx.decodeAudioData(data));
    // A failed download must not poison later attempts.
    p.catch(() => cache.delete(file));
    cache.set(file, p);
  }
  return p;
}

export async function loadClips(ctx: AudioContext, sound: CarSound): Promise<ClipBuffers> {
  const [rev, idle] = await Promise.all([
    load(ctx, sound.rev.file),
    sound.idle ? load(ctx, sound.idle.file) : Promise.resolve(null),
  ]);
  return { rev, idle };
}

const IDLE_GAIN = 0.55;
const IDLE_DUCKED = 0.12;
const FADE_S = 0.06;
const RELEASE_S = 0.12;

export function createRecordedVoice(ctx: AudioContext, clips: ClipBuffers): RecordedVoice {
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  const idleGain = ctx.createGain();
  idleGain.gain.value = 0;
  idleGain.connect(master);
  let idle: AudioBufferSourceNode | null = null;
  if (clips.idle) {
    idle = ctx.createBufferSource();
    idle.buffer = clips.idle;
    idle.loop = true;
    idle.connect(idleGain);
    idle.start();
    idleGain.gain.setTargetAtTime(IDLE_GAIN, ctx.currentTime, FADE_S);
  }

  let rev: { src: AudioBufferSourceNode; gain: GainNode; startedAt: number } | null = null;
  let stopped = false;

  const endRev = () => {
    if (!rev) return;
    const at = ctx.currentTime;
    rev.gain.gain.cancelScheduledValues(at);
    rev.gain.gain.setTargetAtTime(0, at, RELEASE_S);
    rev.src.stop(at + RELEASE_S * 5);
    rev = null;
    idleGain.gain.setTargetAtTime(idle ? IDLE_GAIN : 0, at, RELEASE_S);
  };

  return {
    pedalDown: () => {
      if (stopped || rev) return;
      const src = ctx.createBufferSource();
      src.buffer = clips.rev;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(gain).connect(master);
      const at = ctx.currentTime;
      gain.gain.setTargetAtTime(1, at, FADE_S);
      idleGain.gain.setTargetAtTime(idle ? IDLE_DUCKED : 0, at, FADE_S);
      src.start();
      const mine = { src, gain, startedAt: at };
      rev = mine;
      src.onended = () => {
        // The clip ran out with the pedal still down: fall back to the idle loop.
        if (rev === mine) {
          rev = null;
          idleGain.gain.setTargetAtTime(idle ? IDLE_GAIN : 0, ctx.currentTime, RELEASE_S);
        }
      };
    },
    pedalUp: endRev,
    progress: () =>
      rev ? Math.min(1, Math.max(0, (ctx.currentTime - rev.startedAt) / clips.rev.duration)) : 0,
    stop: () => {
      if (stopped) return;
      stopped = true;
      endRev();
      const at = ctx.currentTime;
      master.gain.setTargetAtTime(0, at, FADE_S);
      idle?.stop(at + 0.5);
      window.setTimeout(() => master.disconnect(), 900);
    },
  };
}
