// Offline audio caching service for music and TTS
// Uses Cache API for web and Capacitor Filesystem for native apps

import {
  isNativePlatform,
  saveAudioToDevice,
  getAudioFromDevice,
  isAudioSavedOnDevice,
  getSavedAudioSize,
  clearAllSavedAudio,
} from './nativeAudioStorage';

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

// Cache TTS audio for a verse (includes voice in key for multi-voice support)
// Uses native filesystem on mobile, Cache API on web
export const cacheTTSAudio = async (
  book: string,
  chapter: number,
  verse: number,
  audioBlob: Blob,
  voice: string = 'default'
): Promise<boolean> => {
  try {
    // Try native storage first for mobile apps
    if (isNativePlatform()) {
      const saved = await saveAudioToDevice(audioBlob, book, chapter, verse, 'verse', voice);
      if (saved) return true;
    }

    // Fall back to Cache API for web
    const cache = await caches.open(TTS_CACHE_NAME);
    const key = `tts://${book}/${chapter}/${verse}/${voice}`;

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
// Checks native filesystem first on mobile, then Cache API
export const getCachedTTSAudio = async (
  book: string,
  chapter: number,
  verse: number,
  voice: string = 'default'
): Promise<string | null> => {
  try {
    // Try native storage first for mobile apps
    if (isNativePlatform()) {
      const nativeUrl = await getAudioFromDevice(book, chapter, verse, 'verse', voice);
      if (nativeUrl) return nativeUrl;
    }

    // Fall back to Cache API
    const cache = await caches.open(TTS_CACHE_NAME);
    const key = `tts://${book}/${chapter}/${verse}/${voice}`;
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

// Cache commentary audio (chapter-level commentary)
// Uses native filesystem on mobile, Cache API on web
export const cacheCommentaryAudio = async (
  book: string,
  chapter: number,
  depth: string,
  voice: string,
  audioBlob: Blob
): Promise<boolean> => {
  try {
    // Try native storage first for mobile apps
    if (isNativePlatform()) {
      const saved = await saveAudioToDevice(audioBlob, book, chapter, undefined, 'commentary', voice);
      if (saved) return true;
    }

    // Fall back to Cache API
    const cache = await caches.open(TTS_CACHE_NAME);
    const key = `commentary://${book}/${chapter}/${depth}/${voice}`;

    const response = new Response(audioBlob, {
      headers: { 'Content-Type': 'audio/mpeg' }
    });

    await cache.put(key, response);
    console.log('[OfflineAudio] Cached commentary:', key, `(${(audioBlob.size / 1024).toFixed(1)}KB)`);
    return true;
  } catch (e) {
    console.error('[OfflineAudio] Error caching commentary:', e);
    return false;
  }
};

// Get cached commentary audio
// Checks native filesystem first on mobile, then Cache API
export const getCachedCommentaryAudio = async (
  book: string,
  chapter: number,
  depth: string,
  voice: string
): Promise<string | null> => {
  try {
    // Try native storage first for mobile apps
    if (isNativePlatform()) {
      const nativeUrl = await getAudioFromDevice(book, chapter, undefined, 'commentary', voice);
      if (nativeUrl) return nativeUrl;
    }

    // Fall back to Cache API
    const cache = await caches.open(TTS_CACHE_NAME);
    const key = `commentary://${book}/${chapter}/${depth}/${voice}`;
    const response = await cache.match(key);

    if (response) {
      const blob = await response.blob();
      console.log('[OfflineAudio] Using cached commentary:', key);
      return URL.createObjectURL(blob);
    }
    return null;
  } catch {
    return null;
  }
};

// Cache verse commentary audio
// Uses native filesystem on mobile, Cache API on web
export const cacheVerseCommentaryAudio = async (
  book: string,
  chapter: number,
  verse: number,
  depth: string,
  voice: string,
  audioBlob: Blob
): Promise<boolean> => {
  try {
    // Try native storage first for mobile apps
    if (isNativePlatform()) {
      const saved = await saveAudioToDevice(audioBlob, book, chapter, verse, 'commentary', voice);
      if (saved) return true;
    }

    // Fall back to Cache API
    const cache = await caches.open(TTS_CACHE_NAME);
    const key = `verse-commentary://${book}/${chapter}/${verse}/${depth}/${voice}`;

    const response = new Response(audioBlob, {
      headers: { 'Content-Type': 'audio/mpeg' }
    });

    await cache.put(key, response);
    console.log('[OfflineAudio] Cached verse commentary:', key);
    return true;
  } catch (e) {
    console.error('[OfflineAudio] Error caching verse commentary:', e);
    return false;
  }
};

// Get cached verse commentary audio
// Checks native filesystem first on mobile, then Cache API
export const getCachedVerseCommentaryAudio = async (
  book: string,
  chapter: number,
  verse: number,
  depth: string,
  voice: string
): Promise<string | null> => {
  try {
    // Try native storage first for mobile apps
    if (isNativePlatform()) {
      const nativeUrl = await getAudioFromDevice(book, chapter, verse, 'commentary', voice);
      if (nativeUrl) return nativeUrl;
    }

    // Fall back to Cache API
    const cache = await caches.open(TTS_CACHE_NAME);
    const key = `verse-commentary://${book}/${chapter}/${verse}/${depth}/${voice}`;
    const response = await cache.match(key);

    if (response) {
      const blob = await response.blob();
      console.log('[OfflineAudio] Using cached verse commentary:', key);
      return URL.createObjectURL(blob);
    }
    return null;
  } catch {
    return null;
  }
};

// Cache audio from URL (fetches and caches)
export const cacheAudioFromUrl = async (
  url: string,
  cacheKey: string
): Promise<boolean> => {
  try {
    const cache = await caches.open(TTS_CACHE_NAME);

    // Check if already cached
    const existing = await cache.match(cacheKey);
    if (existing) {
      return true;
    }

    // Fetch and cache
    const response = await fetch(url);
    if (!response.ok) {
      return false;
    }

    await cache.put(cacheKey, response.clone());
    console.log('[OfflineAudio] Cached audio from URL:', cacheKey);
    return true;
  } catch (e) {
    console.error('[OfflineAudio] Error caching from URL:', e);
    return false;
  }
};

// Clear all cached audio (both native and web cache)
export const clearAudioCache = async (): Promise<void> => {
  try {
    // Clear native storage
    if (isNativePlatform()) {
      await clearAllSavedAudio();
    }

    // Clear web cache
    await caches.delete(MUSIC_CACHE_NAME);
    await caches.delete(TTS_CACHE_NAME);
    console.log('[OfflineAudio] Cache cleared');
  } catch (e) {
    console.error('[OfflineAudio] Error clearing cache:', e);
  }
};

// Get cache size estimate (combines native and web cache)
export const getAudioCacheSize = async (): Promise<{ music: number; tts: number; native: number }> => {
  let musicSize = 0;
  let ttsSize = 0;
  let nativeSize = 0;

  // Get native storage size
  if (isNativePlatform()) {
    nativeSize = await getSavedAudioSize();
  }
  
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
  
  return { music: musicSize, tts: ttsSize, native: nativeSize };
};

// Re-export native storage functions for direct access
export { 
  isNativePlatform,
  saveAudioToDevice,
  getAudioFromDevice,
  isAudioSavedOnDevice,
  getAllSavedAudio,
  getSavedAudioSize,
  clearAllSavedAudio,
  saveChapterAudioToDevice,
  isChapterSaved,
} from './nativeAudioStorage';
