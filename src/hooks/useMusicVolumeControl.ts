// Global music volume control - allows any component to control ambient music volume
// This works independently of device volume, perfect for mobile where you can't control TTS volume separately

let volumeListeners = new Set<(volume: number) => void>();
let currentVolume = 10; // default 10%

// Initialize from localStorage if available, but cap at new max of 10%
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('pt-ambient-volume');
  if (stored) {
    const storedValue = parseFloat(stored);
    // Cap old higher values to new default (handle both 0-1 and 0-100 scales)
    const normalizedValue = storedValue > 1 ? storedValue / 100 : storedValue;
    currentVolume = Math.min(normalizedValue * 100, 10);
    // Update localStorage
    localStorage.setItem('pt-ambient-volume', (currentVolume / 100).toString());
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
