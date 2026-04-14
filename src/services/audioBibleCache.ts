/**
 * Audio Bible Cache Service
 * Caches Bible verses and commentary in IndexedDB for faster loading
 */

const DB_NAME = "phototheology-audio-bible";
const DB_VERSION = 3; // Bumped 2026-04-14 to flush stale commentary
const VERSE_STORE = "verses";
const COMMENTARY_STORE = "commentary";

interface CachedVerse {
  key: string; // "Genesis:1:1"
  book: string;
  chapter: number;
  verse: number;
  text: string;
  cachedAt: number;
}

interface CachedCommentary {
  key: string; // "Genesis:1:1:surface"
  book: string;
  chapter: number;
  verse: number;
  tier: string;
  commentary: string;
  audioUrl?: string;
  cachedAt: number;
}

// Cache expiration: 30 days for verses, 7 days for commentary
const VERSE_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000;
const COMMENTARY_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("[Cache] Failed to open IndexedDB:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // On version bump, delete old stores to flush stale content
      if (database.objectStoreNames.contains(COMMENTARY_STORE)) {
        database.deleteObjectStore(COMMENTARY_STORE);
      }

      // Verses store (text doesn't change, keep if exists)
      if (!database.objectStoreNames.contains(VERSE_STORE)) {
        const verseStore = database.createObjectStore(VERSE_STORE, { keyPath: "key" });
        verseStore.createIndex("book_chapter", ["book", "chapter"], { unique: false });
      }

      // Recreate commentary store fresh
      const commentaryStore = database.createObjectStore(COMMENTARY_STORE, { keyPath: "key" });
      commentaryStore.createIndex("book_chapter_verse", ["book", "chapter", "verse"], { unique: false });
    };
  });
}

/**
 * Generate cache key for verse
 */
function getVerseKey(book: string, chapter: number, verse: number): string {
  return `${book}:${chapter}:${verse}`;
}

/**
 * Generate cache key for commentary
 */
function getCommentaryKey(book: string, chapter: number, verse: number, tier: string): string {
  return `${book}:${chapter}:${verse}:${tier}`;
}

/**
 * Cache verses for a chapter
 */
export async function cacheChapterVerses(
  book: string,
  chapter: number,
  verses: { verse: number; text: string }[]
): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction(VERSE_STORE, "readwrite");
    const store = transaction.objectStore(VERSE_STORE);

    for (const v of verses) {
      const cached: CachedVerse = {
        key: getVerseKey(book, chapter, v.verse),
        book,
        chapter,
        verse: v.verse,
        text: v.text,
        cachedAt: Date.now(),
      };
      store.put(cached);
    }

    console.log(`[Cache] Cached ${verses.length} verses for ${book} ${chapter}`);
  } catch (error) {
    console.error("[Cache] Failed to cache verses:", error);
  }
}

/**
 * Get cached verses for a chapter
 */
export async function getCachedChapterVerses(
  book: string,
  chapter: number
): Promise<{ verse: number; text: string }[] | null> {
  try {
    const database = await initDB();
    const transaction = database.transaction(VERSE_STORE, "readonly");
    const store = transaction.objectStore(VERSE_STORE);
    const index = store.index("book_chapter");

    return new Promise((resolve) => {
      const request = index.getAll([book, chapter]);

      request.onsuccess = () => {
        const results = request.result as CachedVerse[];
        if (results.length === 0) {
          resolve(null);
          return;
        }

        // Check if cache is expired
        const now = Date.now();
        const expired = results.some((v) => now - v.cachedAt > VERSE_CACHE_DURATION);
        if (expired) {
          resolve(null);
          return;
        }

        // Sort by verse number and return
        const verses = results
          .sort((a, b) => a.verse - b.verse)
          .map((v) => ({ verse: v.verse, text: v.text }));

        console.log(`[Cache] Hit: ${book} ${chapter} (${verses.length} verses)`);
        resolve(verses);
      };

      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.error("[Cache] Failed to get cached verses:", error);
    return null;
  }
}

/**
 * Cache commentary for a verse
 */
export async function cacheCommentary(
  book: string,
  chapter: number,
  verse: number,
  tier: string,
  commentary: string,
  audioUrl?: string
): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction(COMMENTARY_STORE, "readwrite");
    const store = transaction.objectStore(COMMENTARY_STORE);

    const cached: CachedCommentary = {
      key: getCommentaryKey(book, chapter, verse, tier),
      book,
      chapter,
      verse,
      tier,
      commentary,
      audioUrl,
      cachedAt: Date.now(),
    };

    store.put(cached);
    console.log(`[Cache] Cached commentary for ${book} ${chapter}:${verse} (${tier})`);
  } catch (error) {
    console.error("[Cache] Failed to cache commentary:", error);
  }
}

/**
 * Get cached commentary for a verse
 */
export async function getCachedCommentary(
  book: string,
  chapter: number,
  verse: number,
  tier: string
): Promise<{ commentary: string; audioUrl?: string } | null> {
  try {
    const database = await initDB();
    const transaction = database.transaction(COMMENTARY_STORE, "readonly");
    const store = transaction.objectStore(COMMENTARY_STORE);

    return new Promise((resolve) => {
      const key = getCommentaryKey(book, chapter, verse, tier);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result as CachedCommentary | undefined;
        if (!result) {
          resolve(null);
          return;
        }

        // Check if cache is expired
        if (Date.now() - result.cachedAt > COMMENTARY_CACHE_DURATION) {
          resolve(null);
          return;
        }

        console.log(`[Cache] Hit: Commentary for ${book} ${chapter}:${verse} (${tier})`);
        resolve({
          commentary: result.commentary,
          audioUrl: result.audioUrl,
        });
      };

      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.error("[Cache] Failed to get cached commentary:", error);
    return null;
  }
}

/**
 * Prefetch commentary for upcoming verses
 */
export async function prefetchCommentary(
  book: string,
  chapter: number,
  startVerse: number,
  count: number,
  tier: string,
  verses: { verse: number; text: string }[],
  generateFn: (book: string, chapter: number, verse: number, text: string, tier: string) => Promise<{ commentary: string; audioUrl?: string } | null>
): Promise<void> {
  console.log(`[Cache] Prefetching ${count} commentaries starting from ${book} ${chapter}:${startVerse}`);

  // Get the next N verses that need commentary
  const versesToPrefetch = verses
    .filter((v) => v.verse >= startVerse && v.verse < startVerse + count)
    .slice(0, count);

  for (const verse of versesToPrefetch) {
    // Check if already cached
    const cached = await getCachedCommentary(book, chapter, verse.verse, tier);
    if (cached) continue;

    // Generate and cache
    try {
      const result = await generateFn(book, chapter, verse.verse, verse.text, tier);
      if (result) {
        await cacheCommentary(book, chapter, verse.verse, tier, result.commentary, result.audioUrl);
      }
    } catch (error) {
      console.error(`[Cache] Failed to prefetch commentary for ${book} ${chapter}:${verse.verse}:`, error);
    }
  }
}

/**
 * Clear all cached data
 */
export async function clearCache(): Promise<void> {
  try {
    const database = await initDB();

    const verseTx = database.transaction(VERSE_STORE, "readwrite");
    verseTx.objectStore(VERSE_STORE).clear();

    const commentaryTx = database.transaction(COMMENTARY_STORE, "readwrite");
    commentaryTx.objectStore(COMMENTARY_STORE).clear();

    console.log("[Cache] All cache cleared");
  } catch (error) {
    console.error("[Cache] Failed to clear cache:", error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{ verses: number; commentaries: number }> {
  try {
    const database = await initDB();

    const getCount = (storeName: string): Promise<number> => {
      return new Promise((resolve) => {
        const transaction = database.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(0);
      });
    };

    const [verses, commentaries] = await Promise.all([
      getCount(VERSE_STORE),
      getCount(COMMENTARY_STORE),
    ]);

    return { verses, commentaries };
  } catch (error) {
    console.error("[Cache] Failed to get cache stats:", error);
    return { verses: 0, commentaries: 0 };
  }
}
