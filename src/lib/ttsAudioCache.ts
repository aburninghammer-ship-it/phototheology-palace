/**
 * Client-side IndexedDB cache for TTS audio blobs.
 * Prevents re-charging when replaying previously generated audio.
 */

const DB_NAME = 'pt-tts-cache';
const DB_VERSION = 1;
const STORE_NAME = 'audio';
const MAX_ENTRIES = 200; // cap to avoid filling storage

/** Simple hash for cache key generation */
async function hashKey(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function buildCacheKey(text: string, voice: string, tier?: string): Promise<string> {
  // Use first 500 chars of text + voice + tier for uniqueness
  const raw = `${tier || 'hd'}:${voice}:${text.slice(0, 500)}`;
  return hashKey(raw);
}

/** Get cached audio blob by key */
export async function getCachedAudio(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const record = req.result;
        if (record?.blob) {
          console.log('[TTSCache] Hit:', key.slice(0, 12));
          resolve(record.blob as Blob);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/** Store audio blob in cache */
export async function setCachedAudio(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();

    // Evict oldest if over limit
    const countTx = db.transaction(STORE_NAME, 'readonly');
    const count = await new Promise<number>((res) => {
      const req = countTx.objectStore(STORE_NAME).count();
      req.onsuccess = () => res(req.result);
      req.onerror = () => res(0);
    });

    if (count >= MAX_ENTRIES) {
      const evictTx = db.transaction(STORE_NAME, 'readwrite');
      const idx = evictTx.objectStore(STORE_NAME).index('timestamp');
      const cursor = idx.openCursor();
      let deleted = 0;
      const toDelete = count - MAX_ENTRIES + 10; // free 10 slots
      cursor.onsuccess = () => {
        const c = cursor.result;
        if (c && deleted < toDelete) {
          c.delete();
          deleted++;
          c.continue();
        }
      };
    }

    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ key, blob, timestamp: Date.now() });
  } catch (err) {
    console.warn('[TTSCache] Store failed:', err);
  }
}

/**
 * Helper: fetch a URL and return a blob, storing in cache.
 * If already cached, returns cached blob without fetching.
 */
export async function fetchWithCache(
  cacheKey: string,
  fetchFn: () => Promise<{ blob: Blob } | null>
): Promise<Blob | null> {
  const cached = await getCachedAudio(cacheKey);
  if (cached) return cached;

  const result = await fetchFn();
  if (result?.blob) {
    await setCachedAudio(cacheKey, result.blob);
    return result.blob;
  }
  return null;
}
