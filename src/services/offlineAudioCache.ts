// Offline audio caching service for music and TTS

const MUSIC_CACHE_NAME = 'pt-music-cache-v1';
const TTS_CACHE_NAME = 'pt-tts-cache-v1';

export interface CachedAudioInfo {
  url: string;
  cachedAt: number;
  size?: number;
}

// Check if we're online
export const isOnline = (): boolean => navigator.onLine;

// Get all cached music tracks
export const getCachedMusicTracks = async (): Promise<string[]> => {
  try {
    const cache = await caches.open(MUSIC_CACHE_NAME);
    const keys = await cache.keys();
    return keys.map(req => req.url);
  } catch (e) {
    console.error('[OfflineAudio] Error getting cached tracks:', e);
    return [];
  }
};

// Cache a music track for offline use
export const cacheMusicTrack = async (url: string, onProgress?: (percent: number) => void): Promise<boolean> => {
  try {
    const cache = await caches.open(MUSIC_CACHE_NAME);
    
    // Check if already cached
    const existing = await cache.match(url);
    if (existing) {
      console.log('[OfflineAudio] Track already cached:', url);
      return true;
    }
    
    // Fetch and cache
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    // Clone response for caching
    await cache.put(url, response.clone());
    console.log('[OfflineAudio] Cached music track:', url);
    return true;
  } catch (e) {
    console.error('[OfflineAudio] Error caching track:', url, e);
    return false;
  }
};

// Get cached music track (returns blob URL for offline use)
export const getCachedMusicTrack = async (url: string): Promise<string | null> => {
  try {
    const cache = await caches.open(MUSIC_CACHE_NAME);
    const response = await cache.match(url);
    
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (e) {
    console.error('[OfflineAudio] Error getting cached track:', e);
    return null;
  }
};

// Check if a music track is cached
export const isMusicTrackCached = async (url: string): Promise<boolean> => {
  try {
    const cache = await caches.open(MUSIC_CACHE_NAME);
    const response = await cache.match(url);
    return !!response;
  } catch {
    return false;
  }
};

// Cache TTS audio for a verse
export const cacheTTSAudio = async (
  book: string, 
  chapter: number, 
  verse: number, 
  audioBlob: Blob
): Promise<boolean> => {
  try {
    const cache = await caches.open(TTS_CACHE_NAME);
    const key = `tts://${book}/${chapter}/${verse}`;
    
    const response = new Response(audioBlob, {
      headers: { 'Content-Type': 'audio/mpeg' }
    });
    
    await cache.put(key, response);
    console.log('[OfflineAudio] Cached TTS:', key);
    return true;
  } catch (e) {
    console.error('[OfflineAudio] Error caching TTS:', e);
    return false;
  }
};

// Get cached TTS audio
export const getCachedTTSAudio = async (
  book: string, 
  chapter: number, 
  verse: number
): Promise<string | null> => {
  try {
    const cache = await caches.open(TTS_CACHE_NAME);
    const key = `tts://${book}/${chapter}/${verse}`;
    const response = await cache.match(key);
    
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch {
    return null;
  }
};

// Clear all cached audio
export const clearAudioCache = async (): Promise<void> => {
  try {
    await caches.delete(MUSIC_CACHE_NAME);
    await caches.delete(TTS_CACHE_NAME);
    console.log('[OfflineAudio] Cache cleared');
  } catch (e) {
    console.error('[OfflineAudio] Error clearing cache:', e);
  }
};

// Get cache size estimate
export const getAudioCacheSize = async (): Promise<{ music: number; tts: number }> => {
  let musicSize = 0;
  let ttsSize = 0;
  
  try {
    const musicCache = await caches.open(MUSIC_CACHE_NAME);
    const musicKeys = await musicCache.keys();
    for (const req of musicKeys) {
      const resp = await musicCache.match(req);
      if (resp) {
        const blob = await resp.blob();
        musicSize += blob.size;
      }
    }
  } catch {}
  
  try {
    const ttsCache = await caches.open(TTS_CACHE_NAME);
    const ttsKeys = await ttsCache.keys();
    for (const req of ttsKeys) {
      const resp = await ttsCache.match(req);
      if (resp) {
        const blob = await resp.blob();
        ttsSize += blob.size;
      }
    }
  } catch {}
  
  return { music: musicSize, tts: ttsSize };
};
