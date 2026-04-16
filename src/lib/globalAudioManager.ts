/**
 * GlobalAudioManager - Ensures only one audio plays at a time across the entire app
 * Tracks all active audio elements and stops them when a new one starts
 */

type AudioElement = HTMLAudioElement | SpeechSynthesisUtterance | { stop: () => void; type: string };

class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private activeAudios: Set<AudioElement> = new Set();

  private constructor() {}

  static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  /**
   * Register an audio element as active
   */
  register(audio: AudioElement) {
    this.activeAudios.add(audio);
  }

  /**
   * Unregister an audio element (called when it stops)
   */
  unregister(audio: AudioElement) {
    this.activeAudios.delete(audio);
  }

  /**
   * Stop all currently playing audio EXCEPT the provided one
   * This ensures only one audio plays at a time
   */
  stopAllExcept(currentAudio?: AudioElement) {
    console.log('[GlobalAudioManager] Stopping all audio except current, active count:', this.activeAudios.size);

    this.activeAudios.forEach(audio => {
      // Don't stop the current audio
      if (audio === currentAudio) return;

      try {
        if (audio instanceof HTMLAudioElement) {
          audio.pause();
          audio.currentTime = 0;
        } else if ('stop' in audio && typeof audio.stop === 'function') {
          audio.stop();
        }
      } catch (err) {
        console.warn('[GlobalAudioManager] Error stopping audio:', err);
      }

      // Remove from active set
      this.activeAudios.delete(audio);
    });

    // Also stop browser speech synthesis
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Stop all audio unconditionally
   */
  stopAll() {
    this.stopAllExcept();
  }

  /**
   * Get count of active audio elements
   */
  getActiveCount(): number {
    return this.activeAudios.size;
  }
}

export const globalAudioManager = GlobalAudioManager.getInstance();
