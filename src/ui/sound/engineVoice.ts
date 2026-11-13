import { firingHz, rpmAt, type SoundProfile } from '@/lib/sound';

/** A running synthesised engine note. Everything is generated in the browser; no audio files. */
export interface EngineVoice {
  /** 0 = idle (or standstill for an electric car), 1 = limiter / full speed. */
  setLevel: (level: number) => void;
  /** Fades out and releases every node. */
  stop: () => void;
}

const SMOOTH_S = 0.04;

function noiseBuffer(ctx: AudioContext): AudioBuffer {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function driveCurve(amount: number): Float32Array<ArrayBuffer> {
  const n = 1024;
  const curve = new Float32Array(new ArrayBuffer(n * 4));
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * amount);
  }
  return curve;
}

interface Layer {
  nodes: AudioScheduledSourceNode[];
  update: (level: number, at: number) => void;
}

/** Combustion engine: harmonics of the firing frequency, shaped, plus intake and exhaust noise. */
function combustion(ctx: AudioContext, out: AudioNode, p: Extract<SoundProfile, { kind: 'ice' }>): Layer {
  // A V12 sings with strong upper orders; a turbo V8 is thicker and lower.
  const orders: [number, OscillatorType, number][] =
    p.cylinders >= 12
      ? [
          [0.5, 'sawtooth', 0.28],
          [1, 'sawtooth', 0.5],
          [2, 'sawtooth', 0.34],
          [3, 'square', 0.12],
        ]
      : [
          [0.25, 'sawtooth', 0.3],
          [0.5, 'sawtooth', 0.46],
          [1, 'sawtooth', 0.5],
          [2, 'square', 0.14],
        ];
  const shaper = ctx.createWaveShaper();
  shaper.curve = driveCurve(p.cylinders >= 12 ? 2.4 : 3.4);
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.Q.value = 1.2;
  const body = ctx.createGain();
  shaper.connect(tone).connect(body).connect(out);

  const oscs = orders.map(([order, type, gain]) => {
    const o = ctx.createOscillator();
    o.type = type;
    const g = ctx.createGain();
    g.gain.value = gain;
    o.connect(g).connect(shaper);
    o.start();
    return { o, order };
  });

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx);
  noise.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 0.7;
  const roar = ctx.createGain();
  // The noise pulses with the firing events, which is what makes it sound like an exhaust.
  const pulse = ctx.createGain();
  pulse.gain.value = 0.5;
  noise.connect(band).connect(roar).connect(pulse).connect(out);
  const pulseOsc = ctx.createOscillator();
  pulseOsc.type = 'sine';
  const pulseDepth = ctx.createGain();
  pulseDepth.gain.value = 0.45;
  pulseOsc.connect(pulseDepth).connect(pulse.gain);
  noise.start();
  pulseOsc.start();

  const nodes: AudioScheduledSourceNode[] = [...oscs.map((x) => x.o), noise, pulseOsc];

  let whistle: { o: OscillatorNode; g: GainNode } | null = null;
  if (p.turbo) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    const g = ctx.createGain();
    g.gain.value = 0;
    o.connect(g).connect(out);
    o.start();
    nodes.push(o);
    whistle = { o, g };
  }

  return {
    nodes,
    update: (level, at) => {
      const f = firingHz(rpmAt(level, p.idleRpm, p.maxRpm), p.cylinders);
      for (const { o, order } of oscs) o.frequency.setTargetAtTime(f * order, at, SMOOTH_S);
      pulseOsc.frequency.setTargetAtTime(f * 0.5, at, SMOOTH_S);
      tone.frequency.setTargetAtTime(500 + level * (p.cylinders >= 12 ? 6500 : 4200), at, SMOOTH_S);
      body.gain.setTargetAtTime(0.32 + level * 0.5, at, SMOOTH_S);
      band.frequency.setTargetAtTime(350 + level * 2600, at, SMOOTH_S);
      roar.gain.setTargetAtTime(0.1 + level * 0.5, at, SMOOTH_S);
      if (whistle) {
        whistle.o.frequency.setTargetAtTime(2200 + 7000 * level ** 1.4, at, SMOOTH_S);
        whistle.g.gain.setTargetAtTime(0.035 * level ** 2, at, 0.12);
      }
    },
  };
}

/** Electric drive: a rising motor whine with an inverter overtone and a little road rush. */
function electric(ctx: AudioContext, out: AudioNode, loud: number): Layer {
  const partials: [number, OscillatorType, number][] = [
    [0.5, 'triangle', 0.3],
    [1, 'sine', 0.5],
    [2.01, 'sine', 0.22],
    [3.02, 'sine', 0.08],
  ];
  const mix = ctx.createGain();
  mix.connect(out);
  const oscs = partials.map(([ratio, type, gain]) => {
    const o = ctx.createOscillator();
    o.type = type;
    const g = ctx.createGain();
    g.gain.value = gain;
    o.connect(g).connect(mix);
    o.start();
    return { o, ratio };
  });
  const inverter = ctx.createOscillator();
  inverter.type = 'sine';
  const invGain = ctx.createGain();
  invGain.gain.value = 0;
  inverter.connect(invGain).connect(out);
  inverter.start();

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx);
  noise.loop = true;
  const low = ctx.createBiquadFilter();
  low.type = 'lowpass';
  const rush = ctx.createGain();
  rush.gain.value = 0;
  noise.connect(low).connect(rush).connect(out);
  noise.start();

  return {
    nodes: [...oscs.map((x) => x.o), inverter, noise],
    update: (level, at) => {
      const f = 150 + 1500 * level ** 1.15;
      for (const { o, ratio } of oscs) o.frequency.setTargetAtTime(f * ratio, at, SMOOTH_S);
      mix.gain.setTargetAtTime(loud * (0.1 + 0.4 * level), at, SMOOTH_S);
      inverter.frequency.setTargetAtTime(5200 + 3600 * level, at, SMOOTH_S);
      invGain.gain.setTargetAtTime(loud * 0.02 * level, at, SMOOTH_S);
      low.frequency.setTargetAtTime(300 + 1400 * level, at, SMOOTH_S);
      rush.gain.setTargetAtTime(loud * 0.22 * level ** 2, at, SMOOTH_S);
    },
  };
}

export function createEngineVoice(ctx: AudioContext, profile: SoundProfile): EngineVoice {
  const master = ctx.createGain();
  master.gain.value = 0;
  const limiter = ctx.createDynamicsCompressor();
  master.connect(limiter).connect(ctx.destination);

  const layers: Layer[] =
    profile.kind === 'ev'
      ? [electric(ctx, master, 1)]
      : [combustion(ctx, master, profile), ...(profile.electric ? [electric(ctx, master, 0.18)] : [])];

  const now = ctx.currentTime;
  for (const l of layers) l.update(0, now);
  master.gain.setTargetAtTime(profile.kind === 'ev' ? 0.3 : 0.22, now, 0.08);

  let stopped = false;
  return {
    setLevel: (level) => {
      if (stopped) return;
      const at = ctx.currentTime;
      for (const l of layers) l.update(level, at);
    },
    stop: () => {
      if (stopped) return;
      stopped = true;
      const at = ctx.currentTime;
      master.gain.cancelScheduledValues(at);
      master.gain.setTargetAtTime(0, at, 0.08);
      for (const l of layers) for (const n of l.nodes) n.stop(at + 0.5);
      window.setTimeout(() => {
        master.disconnect();
        limiter.disconnect();
      }, 700);
    },
  };
}
