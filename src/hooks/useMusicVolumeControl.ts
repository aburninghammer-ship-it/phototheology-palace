// Global music volume control - allows any component to control ambient music volume
// This works independently of device volume, perfect for mobile where you can't control TTS volume separately

let volumeListeners = new Set<(volume: number) => void>();
let currentVolume = 30; // default 30%

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('pt-ambient-volume');
  if (stored) {
    currentVolume = parseInt(stored, 10);
  }
}

export const setGlobalMusicVolume = (volume: number) => {
  currentVolume = volume;
  localStorage.setItem('pt-ambient-volume', volume.toString());
  volumeListeners.forEach(listener => listener(volume));
  console.log('[MusicVolumeControl] Set volume to:', volume);
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
