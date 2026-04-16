/**
 * Storage Manager - Handles localStorage quota issues
 *
 * This utility helps prevent and recover from localStorage quota exceeded errors,
 * particularly important for Supabase auth token storage.
 */

// Prefixes for cached data that can be safely cleared
const CLEARABLE_PREFIXES = [
  'bible_chapter_',
  'bible_commentary_',
  'bible_cache_metadata',
  'offline_notes_',
  'recent_pages',
  'page_state_',
  'guesthouse_sparks_',
  'path_exercises_',
  'devotion_',
  'daily_tip_',
  'daily_verse_',
  'feature_highlights_',
  'winner_banner_',
  'sermon_autosave_',
  'ppt_autosave_',
];

// Keys that should NEVER be cleared (auth-related)
const PROTECTED_KEYS = [
  'sb-tdjtumtdkjicnhlpqqzd-auth-token',
  'rememberedEmail',
];

/**
 * Estimate current localStorage usage in bytes
 */
export const getStorageUsage = (): { used: number; usedMB: string } => {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        total += key.length + value.length;
      }
    }
  }
  // Multiply by 2 for UTF-16 encoding
  const bytes = total * 2;
  return {
    used: bytes,
    usedMB: (bytes / (1024 * 1024)).toFixed(2),
  };
};

/**
 * Check if we can write to localStorage
 */
export const canWriteToStorage = (testSize: number = 50000): boolean => {
  const testKey = '__storage_test__';
  const testValue = 'x'.repeat(testSize);

  try {
    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Clear cached data to free up space
 * Returns the number of items cleared
 */
export const clearCachedData = (aggressive: boolean = false): number => {
  let cleared = 0;
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // Skip protected keys
    if (PROTECTED_KEYS.some(pk => key.includes(pk))) continue;

    // Check if key matches clearable prefixes
    const isClearable = CLEARABLE_PREFIXES.some(prefix => key.startsWith(prefix));

    if (isClearable) {
      keysToRemove.push(key);
    } else if (aggressive) {
      // In aggressive mode, clear anything that's not protected
      // and looks like cached/temporary data
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('cache') ||
        lowerKey.includes('temp') ||
        lowerKey.includes('draft') ||
        lowerKey.includes('autosave')
      ) {
        keysToRemove.push(key);
      }
    }
  }

  for (const key of keysToRemove) {
    try {
      localStorage.removeItem(key);
      cleared++;
    } catch (e) {
      // Ignore removal errors
    }
  }

  console.log(`[StorageManager] Cleared ${cleared} cached items`);
  return cleared;
};

/**
 * Ensure there's enough space for auth tokens
 * Call this before auth operations
 */
export const ensureStorageSpace = (): { success: boolean; cleared: number } => {
  // First check if we have space
  if (canWriteToStorage()) {
    return { success: true, cleared: 0 };
  }

  console.log('[StorageManager] Storage full, attempting cleanup...');

  // Try normal cleanup first
  let cleared = clearCachedData(false);
  if (canWriteToStorage()) {
    return { success: true, cleared };
  }

  // Try aggressive cleanup
  console.log('[StorageManager] Normal cleanup insufficient, trying aggressive...');
  cleared += clearCachedData(true);

  const success = canWriteToStorage();
  if (!success) {
    console.error('[StorageManager] Could not free enough storage space');
  }

  return { success, cleared };
};

/**
 * Check if an error is a storage quota error
 */
export const isQuotaError = (error: unknown): boolean => {
  if (error instanceof DOMException) {
    // Different browsers use different names/codes
    return (
      error.name === 'QuotaExceededError' ||
      error.code === 22 ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    );
  }

  // Check error message for quota-related text
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('quota') || message.includes('storage');
  }

  return false;
};

/**
 * Get a user-friendly message for storage errors
 */
export const getStorageErrorMessage = (): string => {
  return 'Your browser storage is full. Please clear your browser data or try a different browser. ' +
    'Go to Settings > Privacy > Clear browsing data, or try using an incognito/private window.';
};

/**
 * Get storage statistics for debugging
 */
export const getStorageStats = (): {
  totalItems: number;
  usage: string;
  byPrefix: Record<string, number>;
} => {
  const byPrefix: Record<string, number> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // Categorize by prefix
    const prefix = CLEARABLE_PREFIXES.find(p => key.startsWith(p)) || 'other';
    byPrefix[prefix] = (byPrefix[prefix] || 0) + 1;
  }

  return {
    totalItems: localStorage.length,
    usage: getStorageUsage().usedMB + ' MB',
    byPrefix,
  };
};
