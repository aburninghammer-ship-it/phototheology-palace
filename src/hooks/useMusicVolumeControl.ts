// Global music volume control - allows any component to control ambient music volume
// This works independently of device volume, perfect for mobile where you can't control TTS volume separately
// Uses 0-100 scale internally, converts to 0-1 for audio elements

let volumeListeners = new Set<(volume: number) => void>();
let playbackListeners = new Set<(shouldPlay: boolean) => void>();
let currentVolume = 90; // default 90%
let isPlaying = false;

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('pt-music-volume-pct');
  if (stored) {
    currentVolume = parseInt(stored, 10);
  }
}

export const setGlobalMusicVolume = (volume: number) => {
  currentVolume = volume;
  localStorage.setItem('pt-music-volume-pct', currentVolume.toString());
  volumeListeners.forEach(listener => listener(currentVolume));
  console.log('[MusicVolumeControl] Set volume to:', currentVolume, '%');
};

export const getGlobalMusicVolume = () => currentVolume;

export const subscribeToMusicVolume = (listener: (volume: number) => void) => {
  volumeListeners.add(listener);
  // Immediately call with current volume
  listener(currentVolume);
  return () => {
    volumeListeners.delete(listener);
  };
};

// Control global ambient music playback
export const setGlobalMusicPlayback = (shouldPlay: boolean) => {
  if (isPlaying === shouldPlay) return;
  isPlaying = shouldPlay;
  playbackListeners.forEach(listener => listener(shouldPlay));
  console.log('[MusicVolumeControl] Set playback to:', shouldPlay);
};

export const subscribeToMusicPlayback = (listener: (shouldPlay: boolean) => void) => {
  playbackListeners.add(listener);
  // Immediately call with current state
  listener(isPlaying);
  return () => {
    playbackListeners.delete(listener);
  };
};
