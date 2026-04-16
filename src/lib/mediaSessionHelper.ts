/**
 * MediaSession Helper - Enables lock-screen / background playback on mobile
 * 
 * Mobile browsers (especially iOS Safari & Chrome Android) will suspend audio
 * when the screen turns off UNLESS the page has an active Media Session.
 * The AmbientMusicPlayer already does this, but commentary/TTS audio does not.
 * This helper provides a simple way to register any audio with the Media Session API.
 */

interface MediaSessionOptions {
  title: string;
  artist?: string;
  album?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onSeekBackward?: () => void;
  onSeekForward?: () => void;
  onNextTrack?: () => void;
  onPreviousTrack?: () => void;
}

/**
 * Set up the Media Session metadata and action handlers.
 * Call this whenever a new audio track starts playing.
 */
export function setupMediaSession(options: MediaSessionOptions) {
  if (!('mediaSession' in navigator)) return;

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: options.title || 'Phototheology Audio',
      artist: options.artist || 'Phototheology Palace',
      album: options.album || 'PT Audio',
    });

    if (options.onPlay) {
      navigator.mediaSession.setActionHandler('play', options.onPlay);
    }
    if (options.onPause) {
      navigator.mediaSession.setActionHandler('pause', options.onPause);
    }
    if (options.onSeekBackward) {
      navigator.mediaSession.setActionHandler('seekbackward', options.onSeekBackward);
    }
    if (options.onSeekForward) {
      navigator.mediaSession.setActionHandler('seekforward', options.onSeekForward);
    }
    if (options.onNextTrack) {
      navigator.mediaSession.setActionHandler('nexttrack', options.onNextTrack);
    }
    if (options.onPreviousTrack) {
      navigator.mediaSession.setActionHandler('previoustrack', options.onPreviousTrack);
    }
  } catch (err) {
    console.warn('[MediaSession] Setup error:', err);
  }
}

/**
 * Update the playback state shown on the lock screen
 */
export function updateMediaSessionPlaybackState(state: 'playing' | 'paused' | 'none') {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = state;
  } catch {
    // Silently ignore
  }
}

/**
 * Clear the media session (when audio stops completely)
 */
export function clearMediaSession() {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = 'none';
    // Clear all handlers
    const actions: MediaSessionAction[] = ['play', 'pause', 'seekbackward', 'seekforward', 'nexttrack', 'previoustrack'];
    actions.forEach(action => {
      try {
        navigator.mediaSession.setActionHandler(action, null);
      } catch {
        // Some browsers don't support all actions
      }
    });
  } catch {
    // Silently ignore
  }
}
