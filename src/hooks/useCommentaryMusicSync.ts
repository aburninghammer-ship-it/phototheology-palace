// Global event system to auto-start ambient music when commentary plays
// and allow users to toggle this behavior

type MusicRequestListener = (action: 'start' | 'stop') => void;

let listeners = new Set<MusicRequestListener>();

// Whether music should auto-start with commentary (persisted)
// Default is FALSE - user must manually enable if they want auto-music
let autoMusicEnabled = false;
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('pt-commentary-music-auto');
  autoMusicEnabled = stored === 'true'; // default false, only enabled if explicitly set to 'true'
}

let autoMusicListeners = new Set<(enabled: boolean) => void>();

export const requestMusicForCommentary = (action: 'start' | 'stop') => {
  if (!autoMusicEnabled && action === 'start') return;
  listeners.forEach(l => l(action));
  console.log('[CommentaryMusicSync] Music request:', action, 'autoEnabled:', autoMusicEnabled);
};

export const subscribeToMusicRequests = (listener: MusicRequestListener) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const getAutoMusicEnabled = () => autoMusicEnabled;

export const setAutoMusicEnabled = (enabled: boolean) => {
  autoMusicEnabled = enabled;
  localStorage.setItem('pt-commentary-music-auto', enabled.toString());
  autoMusicListeners.forEach(l => l(enabled));
  // If turning off, stop music immediately
  if (!enabled) {
    listeners.forEach(l => l('stop'));
  }
};

export const subscribeToAutoMusicToggle = (listener: (enabled: boolean) => void) => {
  autoMusicListeners.add(listener);
  return () => { autoMusicListeners.delete(listener); };
};
