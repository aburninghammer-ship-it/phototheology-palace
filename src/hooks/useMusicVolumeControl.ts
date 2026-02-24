// Global music volume control - allows any component to control ambient music volume
// This works independently of device volume, perfect for mobile where you can't control TTS volume separately
// Uses 0-100 scale internally, converts to 0-1 for audio elements

let volumeListeners = new Set<(volume: number) => void>();
let currentVolume = 80; // default 80%
let dbSyncCallback: ((volume: number) => void) | null = null;

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('pt-music-volume-pct');
  if (stored) {
    currentVolume = parseInt(stored, 10);
  }
}

export const setGlobalMusicVolume = (volume: number) => {
  // Clamp volume to 0-100 range
  const clampedVolume = Math.max(0, Math.min(100, volume));
  currentVolume = clampedVolume;
  localStorage.setItem('pt-music-volume-pct', currentVolume.toString());
  
  // Notify all listeners immediately
  volumeListeners.forEach(listener => listener(currentVolume));
  
  // Sync to database via callback
  if (dbSyncCallback) {
    dbSyncCallback(currentVolume);
  }
  
  console.log('[MusicVolumeControl] Set volume to:', currentVolume, '% (listeners:', volumeListeners.size, ')');
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

/**
 * Register a callback to sync volume changes to the database
 * Called by useUserPreferences to enable cross-device sync
 */
export const registerVolumeSyncCallback = (callback: (volume: number) => void) => {
  dbSyncCallback = callback;
};

/**
 * Apply volume from database (cross-device sync)
 */
export const applyVolumeFromDB = (volume: number) => {
  if (volume !== currentVolume) {
    currentVolume = Math.max(0, Math.min(100, volume));
    localStorage.setItem('pt-music-volume-pct', currentVolume.toString());
    volumeListeners.forEach(listener => listener(currentVolume));
  }
};
