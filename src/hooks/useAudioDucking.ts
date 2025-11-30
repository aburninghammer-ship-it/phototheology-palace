import { useEffect, useCallback } from 'react';

// Global audio ducking state
let musicVolumeBeforeDuck = 0.3;
let isDucked = false;
let duckListeners: Set<(ducked: boolean) => void> = new Set();

// Duck ratio - music volume is reduced to this percentage when TTS plays
// 0.30 = 30% of original volume, making voice reader 70% dominant
const DUCK_RATIO = 0.30;

export const notifyTTSStarted = () => {
  if (!isDucked) {
    isDucked = true;
    duckListeners.forEach(listener => listener(true));
    console.log('[AudioDucking] TTS started - ducking music');
  }
};

export const notifyTTSStopped = () => {
  if (isDucked) {
    isDucked = false;
    duckListeners.forEach(listener => listener(false));
    console.log('[AudioDucking] TTS stopped - restoring music');
  }
};

export const setMusicVolumeReference = (volume: number) => {
  musicVolumeBeforeDuck = volume;
};

export const getDuckedVolume = (originalVolume: number): number => {
  return isDucked ? originalVolume * DUCK_RATIO : originalVolume;
};

export const useAudioDucking = (onDuckChange?: (ducked: boolean, duckRatio: number) => void) => {
  useEffect(() => {
    const listener = (ducked: boolean) => {
      onDuckChange?.(ducked, ducked ? DUCK_RATIO : 1);
    };
    
    duckListeners.add(listener);
    
    // Immediately notify if already ducked
    if (isDucked) {
      listener(true);
    }
    
    return () => {
      duckListeners.delete(listener);
    };
  }, [onDuckChange]);

  return {
    isDucked,
    notifyTTSStarted,
    notifyTTSStopped,
    DUCK_RATIO,
  };
};
