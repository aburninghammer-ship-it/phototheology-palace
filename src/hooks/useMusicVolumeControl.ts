// Global music volume control - allows any component to control ambient music volume
// This works independently of device volume, perfect for mobile where you can't control TTS volume separately

let volumeListeners = new Set<(volume: number) => void>();
let currentVolume = 18; // default 18%

// Initialize from localStorage if available, but cap at new max of 18%
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('pt-ambient-volume');
  if (stored) {
    const storedValue = parseInt(stored, 10);
    // Cap old higher values to new default
    currentVolume = Math.min(storedValue, 18);
    // Update localStorage if we capped it
    if (storedValue > 18) {
      localStorage.setItem('pt-ambient-volume', '18');
    }
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
