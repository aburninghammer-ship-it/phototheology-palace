/**
 * AudioEngine - Simple singleton for audio playback
 * Handles iOS audio unlock and provides consistent playback across devices
 */

import { globalAudioManager } from './globalAudioManager';

type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

type AudioEventCallback = (state: AudioState, data?: any) => void;

class AudioEngine {
  private static instance: AudioEngine;
  private audio: HTMLAudioElement | null = null;
  private isUnlocked = false;
  private listeners: Set<AudioEventCallback> = new Set();
  private currentState: AudioState = 'idle';
  private playbackRate = 1.0;
  private volume = 1.0;
  private pendingUrl: string | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.configureAudioElement();
      this.setupEventListeners();
    }
  }

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /**
   * Configure audio element for mobile compatibility
   */
  private configureAudioElement() {
    if (!this.audio) return;

    // Required for iOS inline playback
    this.audio.setAttribute('playsinline', 'true');
    this.audio.setAttribute('webkit-playsinline', 'true');

    // Preload metadata for faster start
    this.audio.preload = 'auto';

    // NOTE: crossOrigin removed - we fetch as blob instead to avoid CORS issues on mobile
  }

  private setupEventListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('loadstart', () => {
      console.log('[AudioEngine] loadstart');
      this.setState('loading');
    });

    this.audio.addEventListener('canplay', () => {
      console.log('[AudioEngine] canplay, currentState:', this.currentState);
      // Only auto-play if we're in loading state (user initiated)
      if (this.currentState === 'loading') {
        this.audio?.play()
          .then(() => console.log('[AudioEngine] play started after canplay'))
          .catch(err => {
            console.error('[AudioEngine] play failed after canplay:', err);
            this.setState('error');
          });
      }
    });

    this.audio.addEventListener('playing', () => {
      console.log('[AudioEngine] playing');
      globalAudioManager.register(this.audio!);
      this.setState('playing');
    });

    this.audio.addEventListener('pause', () => {
      console.log('[AudioEngine] pause, currentState:', this.currentState);
      globalAudioManager.unregister(this.audio!);
      // Don't change state to paused if we just ended
      if (this.currentState !== 'ended' && this.currentState !== 'idle') {
        this.setState('paused');
      }
    });

    this.audio.addEventListener('ended', () => {
      console.log('[AudioEngine] ended');
      globalAudioManager.unregister(this.audio!);
      this.setState('ended');
    });

    this.audio.addEventListener('error', (e) => {
      const error = this.audio?.error;
      console.error('[AudioEngine] Error:', e, 'MediaError:', error?.code, error?.message);
      this.setState('error');
    });

    // Additional events for debugging mobile issues
    this.audio.addEventListener('waiting', () => {
      console.log('[AudioEngine] waiting (buffering)');
    });

    this.audio.addEventListener('stalled', () => {
      console.log('[AudioEngine] stalled');
    });

    this.audio.addEventListener('suspend', () => {
      console.log('[AudioEngine] suspend');
    });
  }

  private setState(state: AudioState, data?: any) {
    console.log(`[AudioEngine] setState: ${this.currentState} -> ${state}`);
    this.currentState = state;
    this.listeners.forEach(cb => cb(state, data));
  }

  subscribe(callback: AudioEventCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Unlock audio on iOS - must be called from user gesture
   */
  async unlock(): Promise<boolean> {
    if (this.isUnlocked) {
      console.log('[AudioEngine] Already unlocked');
      return true;
    }

    if (!this.audio) {
      console.error('[AudioEngine] No audio element');
      return false;
    }

    try {
      console.log('[AudioEngine] Attempting to unlock...');

      // Create a new audio context to unlock iOS audio
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        // Create and play a silent buffer
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        console.log('[AudioEngine] AudioContext unlocked');
      }

      // Also unlock the HTML audio element with silent audio
      const silentAudio = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRwmHAAAAAAD/+xBkAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZB4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';

      this.audio.src = silentAudio;
      this.audio.volume = 0.01;

      await this.audio.play();
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.volume = this.volume;
      this.audio.src = '';

      this.isUnlocked = true;
      console.log('[AudioEngine] iOS audio unlocked successfully');
      return true;
    } catch (error) {
      console.error('[AudioEngine] Failed to unlock:', error);
      // Still mark as unlocked - some devices don't need it
      this.isUnlocked = true;
      return true;
    }
  }

  async play(url: string): Promise<void> {
    if (!this.audio) {
      console.error('[AudioEngine] No audio element');
      return;
    }

    console.log('[AudioEngine] play() called with URL:', url.substring(0, 100) + '...');

    try {
      // Stop all other audio across the app
      globalAudioManager.stopAllExcept(this.audio);

      // Stop any current playback first
      this.audio.pause();
      this.audio.currentTime = 0;

      this.setState('loading');

      // CRITICAL: On mobile, fetch as blob to avoid CORS issues with cross-origin audio URLs
      let audioSrc = url;
      if (url.startsWith('http') && !url.startsWith('data:')) {
        try {
          console.log('[AudioEngine] Fetching audio as blob for reliable mobile playback...');
          const response = await fetch(url);
          if (response.ok) {
            const blob = await response.blob();
            audioSrc = URL.createObjectURL(blob);
            console.log('[AudioEngine] Created blob URL for playback, size:', blob.size);
          } else {
            console.warn('[AudioEngine] Blob fetch failed with status:', response.status, '- using URL directly');
          }
        } catch (fetchErr) {
          console.warn('[AudioEngine] Blob fetch failed, using URL directly:', fetchErr);
        }
      }

      // Set the new source
      this.audio.src = audioSrc;
      this.audio.playbackRate = this.playbackRate;
      this.audio.volume = this.volume;

      // Load and play
      this.audio.load();

      // For mobile, we need to explicitly call play() after load
      // The canplay event will also try to play, but this is a backup
      try {
        await this.audio.play();
        console.log('[AudioEngine] play() succeeded directly');
      } catch (playError: any) {
        // If autoplay fails, the canplay event handler will try again
        console.log('[AudioEngine] Direct play() failed, waiting for canplay:', playError.message);
      }
    } catch (error) {
      console.error('[AudioEngine] Play error:', error);
      this.setState('error');
    }
  }

  pause() {
    console.log('[AudioEngine] pause() called');
    this.audio?.pause();
  }

  resume() {
    console.log('[AudioEngine] resume() called');
    this.audio?.play().catch(err => {
      console.error('[AudioEngine] resume failed:', err);
    });
  }

  stop() {
    console.log('[AudioEngine] stop() called');
    if (this.audio) {
      globalAudioManager.unregister(this.audio);
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
      this.setState('idle');
    }
  }

  setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  getVolume(): number {
    return this.volume;
  }

  getState(): AudioState {
    return this.currentState;
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  isAudioUnlocked(): boolean {
    return this.isUnlocked;
  }
}

export const audioEngine = AudioEngine.getInstance();
export type { AudioState };
