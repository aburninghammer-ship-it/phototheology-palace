/**
 * useNarrativeSoundEffects — Atmospheric sound effect engine for Epic commentary.
 *
 * Synthesizes ambient sounds (wind, thunder, rain, fire, ocean, tension drone,
 * heavenly shimmer, trumpet, battle, earthquake) using the Web Audio API and
 * schedules them against a playing HTMLAudioElement based on SFX cue data.
 */

import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type SfxType =
  | "wind"
  | "thunder"
  | "rain"
  | "fire"
  | "ocean"
  | "tension"
  | "heavenly"
  | "trumpet"
  | "battle"
  | "earthquake";

export interface SfxCue {
  /** Position in the narration as a percentage 0-100 */
  at: number;
  /** Which sound effect to play */
  effect: SfxType;
  /** Duration in seconds (default 5) */
  duration?: number;
  /** Volume 0-1 (default 0.3) */
  volume?: number;
}

interface ActiveEffect {
  nodes: AudioNode[];
  stopTime: number;
}

// ── Synthesizers ───────────────────────────────────────────────────────────────
// Each returns an array of AudioNodes that should be disconnected on cleanup.

function createNoise(ctx: AudioContext, duration: number): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
}

function synthWind(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;
  const noise = createNoise(ctx, duration + 1);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(400, now);
  filter.Q.setValueAtTime(0.5, now);
  // Slow modulation of filter frequency for realism
  filter.frequency.linearRampToValueAtTime(800, now + duration * 0.3);
  filter.frequency.linearRampToValueAtTime(300, now + duration * 0.6);
  filter.frequency.linearRampToValueAtTime(600, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol * 0.6, now + 0.8);
  gain.gain.setValueAtTime(vol * 0.6, now + duration - 1);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration);

  return [noise, filter, gain];
}

function synthThunder(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;
  const dur = Math.max(duration, 3);

  // Low rumble
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(40, now);
  osc.frequency.exponentialRampToValueAtTime(25, now + dur);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(vol * 0.7, now);
  oscGain.gain.linearRampToValueAtTime(0, now + dur);

  // Crack/burst
  const noise = createNoise(ctx, 0.5);
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.setValueAtTime(2000, now);
  const burstGain = ctx.createGain();
  burstGain.gain.setValueAtTime(vol * 0.8, now);
  burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + dur);

  noise.connect(hpf);
  hpf.connect(burstGain);
  burstGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.5);

  return [osc, oscGain, noise, hpf, burstGain];
}

function synthRain(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;
  const noise = createNoise(ctx, duration + 1);

  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.setValueAtTime(4000, now);

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.setValueAtTime(12000, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol * 0.5, now + 1.5);
  gain.gain.setValueAtTime(vol * 0.5, now + duration - 1.5);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  noise.connect(hpf);
  hpf.connect(lpf);
  lpf.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration);

  return [noise, hpf, lpf, gain];
}

function synthFire(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;
  const noise = createNoise(ctx, duration + 1);

  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.setValueAtTime(1500, now);
  bpf.Q.setValueAtTime(1.5, now);

  // Amplitude modulation for crackle effect
  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(8, now);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(vol * 0.2, now);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(vol * 0.4, now + 0.5);
  masterGain.gain.setValueAtTime(vol * 0.4, now + duration - 0.5);
  masterGain.gain.linearRampToValueAtTime(0, now + duration);

  noise.connect(bpf);
  bpf.connect(masterGain);
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  masterGain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);
  lfo.start(now);
  lfo.stop(now + duration);

  return [noise, bpf, lfo, lfoGain, masterGain];
}

function synthOcean(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;
  const noise = createNoise(ctx, duration + 1);

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.setValueAtTime(800, now);

  // Slow wave-like amplitude cycling
  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(0.15, now);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(vol * 0.15, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol * 0.4, now + 2);
  gain.gain.setValueAtTime(vol * 0.4, now + duration - 2);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  noise.connect(lpf);
  lpf.connect(gain);
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);
  lfo.start(now);
  lfo.stop(now + duration);

  return [noise, lpf, lfo, lfoGain, gain];
}

function synthTension(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;

  // Two slightly detuned low oscillators for unease
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(55, now);

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(57, now); // slight detune

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol * 0.35, now + 1.5);
  gain.gain.setValueAtTime(vol * 0.35, now + duration - 1.5);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + duration);
  osc2.start(now);
  osc2.stop(now + duration);

  return [osc1, osc2, gain];
}

function synthHeavenly(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;
  const nodes: AudioNode[] = [];

  // Cluster of high sine waves with slow amplitude modulation
  const freqs = [880, 1108, 1318, 1568]; // A5, C#6, E6, G6
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(vol * 0.2, now + 2);
  masterGain.gain.setValueAtTime(vol * 0.2, now + duration - 2);
  masterGain.gain.linearRampToValueAtTime(0, now + duration);
  masterGain.connect(ctx.destination);
  nodes.push(masterGain);

  for (const freq of freqs) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, now);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(now);
    osc.stop(now + duration);
    nodes.push(osc, g);
  }

  // Gentle LFO for shimmer
  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(0.3, now);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(vol * 0.05, now);
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  lfo.start(now);
  lfo.stop(now + duration);
  nodes.push(lfo, lfoGain);

  return nodes;
}

function synthTrumpet(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;
  const dur = Math.max(duration, 2);

  // Harmonic series for brass-like timbre
  const fundamental = 440; // A4
  const harmonics = [1, 2, 3, 4, 5];
  const amps = [1.0, 0.6, 0.4, 0.2, 0.1];
  const nodes: AudioNode[] = [];

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(vol * 0.4, now + 0.3);
  masterGain.gain.setValueAtTime(vol * 0.4, now + dur - 0.5);
  masterGain.gain.linearRampToValueAtTime(0, now + dur);
  masterGain.connect(ctx.destination);
  nodes.push(masterGain);

  for (let i = 0; i < harmonics.length; i++) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(fundamental * harmonics[i], now);
    const g = ctx.createGain();
    g.gain.setValueAtTime(amps[i] * 0.15, now);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(now);
    osc.stop(now + dur);
    nodes.push(osc, g);
  }

  return nodes;
}

function synthBattle(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;
  const dur = Math.max(duration, 3);
  const nodes: AudioNode[] = [];

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(vol * 0.35, now + 0.5);
  masterGain.gain.setValueAtTime(vol * 0.35, now + dur - 0.8);
  masterGain.gain.linearRampToValueAtTime(0, now + dur);
  masterGain.connect(ctx.destination);
  nodes.push(masterGain);

  // Series of metallic clash bursts
  const clashCount = Math.floor(dur / 0.6);
  for (let i = 0; i < clashCount; i++) {
    const t = now + i * 0.6 + Math.random() * 0.2;
    const noise = createNoise(ctx, 0.15);
    const hpf = ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.setValueAtTime(3000 + Math.random() * 2000, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5 + Math.random() * 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(hpf);
    hpf.connect(g);
    g.connect(masterGain);
    noise.start(t);
    noise.stop(t + 0.15);
    nodes.push(noise, hpf, g);
  }

  // Low war-drum rumble
  const drumNoise = createNoise(ctx, dur);
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.setValueAtTime(200, now);
  const drumGain = ctx.createGain();
  drumGain.gain.setValueAtTime(0.4, now);
  drumNoise.connect(lpf);
  lpf.connect(drumGain);
  drumGain.connect(masterGain);
  drumNoise.start(now);
  drumNoise.stop(now + dur);
  nodes.push(drumNoise, lpf, drumGain);

  return nodes;
}

function synthEarthquake(ctx: AudioContext, duration: number, vol: number): AudioNode[] {
  const now = ctx.currentTime;
  const dur = Math.max(duration, 3);

  // Sub-bass oscillator
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(25, now);
  osc.frequency.linearRampToValueAtTime(18, now + dur);

  // Rumble noise
  const noise = createNoise(ctx, dur + 1);
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.setValueAtTime(150, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol * 0.6, now + 0.5);
  gain.gain.setValueAtTime(vol * 0.6, now + dur - 1);
  gain.gain.linearRampToValueAtTime(0, now + dur);

  osc.connect(gain);
  noise.connect(lpf);
  lpf.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + dur);
  noise.start(now);
  noise.stop(now + dur);

  return [osc, noise, lpf, gain];
}

// ── Synthesizer registry ───────────────────────────────────────────────────────

const SYNTHESIZERS: Record<SfxType, (ctx: AudioContext, dur: number, vol: number) => AudioNode[]> = {
  wind: synthWind,
  thunder: synthThunder,
  rain: synthRain,
  fire: synthFire,
  ocean: synthOcean,
  tension: synthTension,
  heavenly: synthHeavenly,
  trumpet: synthTrumpet,
  battle: synthBattle,
  earthquake: synthEarthquake,
};

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useNarrativeSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);
  const activeRef = useRef<ActiveEffect[]>([]);
  const scheduledRef = useRef<Set<number>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("narrativeSfxEnabled");
    return stored !== null ? stored === "true" : true;
  });
  const [sfxVolume, setSfxVolume] = useState(() => {
    if (typeof window === "undefined") return 0.3;
    const stored = localStorage.getItem("narrativeSfxVolume");
    return stored !== null ? parseFloat(stored) : 0.3;
  });

  // Persist preferences
  useEffect(() => {
    localStorage.setItem("narrativeSfxEnabled", String(isEnabled));
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem("narrativeSfxVolume", String(sfxVolume));
  }, [sfxVolume]);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /** Play a single SFX immediately */
  const playSfx = useCallback(
    (effect: SfxType, duration = 5, volume?: number) => {
      if (!isEnabled) return;
      const synth = SYNTHESIZERS[effect];
      if (!synth) return;

      const ctx = getContext();
      const vol = volume ?? sfxVolume;
      const nodes = synth(ctx, duration, vol);
      const entry: ActiveEffect = { nodes, stopTime: ctx.currentTime + duration };
      activeRef.current.push(entry);

      // Auto-cleanup after duration
      setTimeout(() => {
        const idx = activeRef.current.indexOf(entry);
        if (idx >= 0) activeRef.current.splice(idx, 1);
      }, (duration + 1) * 1000);
    },
    [isEnabled, sfxVolume, getContext],
  );

  /**
   * Start scheduling SFX cues against a playing HTMLAudioElement.
   * Call this when epic playback starts. Polls the audio's currentTime and
   * triggers cues when their position is reached.
   * If no cues are provided, falls back to ambient mode: random atmospheric
   * sounds are played at random intervals throughout playback.
   */
  const startScheduling = useCallback(
    (audioEl: HTMLAudioElement, cues: SfxCue[]) => {
      // Reset previous scheduling
      stopScheduling();
      scheduledRef.current.clear();

      if (!isEnabled) return;

      // ── Ambient fallback mode (no cues provided) ───────────────────────────
      if (!cues || cues.length === 0) {
        const AMBIENT_EFFECTS: SfxType[] = ["wind", "tension", "heavenly", "fire", "rain", "ocean"];
        let ambientTimeout: ReturnType<typeof setTimeout> | null = null;

        const scheduleNext = () => {
          if (audioEl.paused || audioEl.ended) {
            // Check again later
            ambientTimeout = setTimeout(scheduleNext, 2000);
            return;
          }
          // Pick a random effect
          const effect = AMBIENT_EFFECTS[Math.floor(Math.random() * AMBIENT_EFFECTS.length)];
          const duration = 6 + Math.random() * 6; // 6–12s
          playSfx(effect, duration);

          // Schedule next in 15–35s
          const delay = (15 + Math.random() * 20) * 1000;
          ambientTimeout = setTimeout(scheduleNext, delay);
        };

        // Start first ambient sound after a short delay
        ambientTimeout = setTimeout(scheduleNext, 3000);

        // Store cleanup in the interval ref using a fake setInterval wrapper
        intervalRef.current = setInterval(() => {
          // Just a keep-alive; real scheduling is in ambientTimeout chain
          if (audioEl.ended) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            if (ambientTimeout) clearTimeout(ambientTimeout);
          }
        }, 5000) as ReturnType<typeof setInterval>;

        // Attach cleanup to stopScheduling by patching activeRef with a sentinel
        const cleanup = () => {
          if (ambientTimeout) clearTimeout(ambientTimeout);
        };
        // Wrap cleanup in a dummy AudioNode-like entry (nodes = [])
        activeRef.current.push({ nodes: [], stopTime: Infinity });
        // Override the last entry's nodes disconnect to call cleanup
        const sentinel = activeRef.current[activeRef.current.length - 1];
        (sentinel as any)._cleanupFn = cleanup;

        return;
      }

      const check = () => {
        if (audioEl.paused || audioEl.ended) return;
        const totalDur = audioEl.duration;
        if (!totalDur || isNaN(totalDur)) return;

        const currentPct = (audioEl.currentTime / totalDur) * 100;

        for (let i = 0; i < cues.length; i++) {
          if (scheduledRef.current.has(i)) continue;
          const cue = cues[i];
          // Trigger when we reach or pass the cue position
          if (currentPct >= cue.at) {
            scheduledRef.current.add(i);
            playSfx(cue.effect, cue.duration ?? 5, cue.volume ?? sfxVolume);
          }
        }
      };

      // Poll every 500ms
      intervalRef.current = setInterval(check, 500);
    },
    [isEnabled, sfxVolume, playSfx],
  );

  /** Stop all SFX scheduling and clean up active effects */
  const stopScheduling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    scheduledRef.current.clear();
    // Disconnect any active effects and call sentinel cleanup fns
    for (const effect of activeRef.current) {
      if ((effect as any)._cleanupFn) {
        try { (effect as any)._cleanupFn(); } catch { /* ignore */ }
      }
      for (const node of effect.nodes) {
        try {
          node.disconnect();
        } catch {
          // already disconnected
        }
      }
    }
    activeRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScheduling();
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, [stopScheduling]);

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      if (!next) stopScheduling();
      return next;
    });
  }, [stopScheduling]);

  return {
    isEnabled,
    toggle,
    sfxVolume,
    setSfxVolume,
    playSfx,
    startScheduling,
    stopScheduling,
  };
}
