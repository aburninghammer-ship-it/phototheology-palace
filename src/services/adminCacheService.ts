/**
 * Admin Cache Service
 * Utilities for clearing cached commentary with theological errors
 */

import { supabase } from "@/integrations/supabase/client";

interface ClearCacheOptions {
  book?: string;
  chapter?: number;
  verse?: number;
  tier?: "surface" | "intermediate" | "scholarly";
  clearAll?: boolean;
}

interface ClearCacheResult {
  success: boolean;
  message: string;
  clearedBy?: string;
  error?: string;
}

/**
 * Clear commentary cache (admin only)
 * Clears cached commentary from Supabase tables
 */
export async function clearCommentaryCache(options: ClearCacheOptions): Promise<ClearCacheResult> {
  try {
    const { data, error } = await supabase.functions.invoke("clear-commentary-cache", {
      body: options,
    });

    if (error) {
      console.error("[AdminCache] Error:", error);
      return {
        success: false,
        message: "Failed to clear cache",
        error: error.message,
      };
    }

    return data as ClearCacheResult;
  } catch (error) {
    console.error("[AdminCache] Error:", error);
    return {
      success: false,
      message: "Failed to clear cache",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Clear local IndexedDB cache for audio bible
 * This clears the browser-side cache for the current user
 */
export async function clearLocalAudioBibleCache(): Promise<boolean> {
  try {
    const dbName = "audioBibleCache";

    // Delete the entire IndexedDB database
    return new Promise((resolve) => {
      const request = indexedDB.deleteDatabase(dbName);

      request.onsuccess = () => {
        console.log("[AdminCache] Local IndexedDB cache cleared");
        resolve(true);
      };

      request.onerror = () => {
        console.error("[AdminCache] Failed to clear local cache");
        resolve(false);
      };

      request.onblocked = () => {
        console.warn("[AdminCache] Database deletion blocked - close other tabs");
        resolve(false);
      };
    });
  } catch (error) {
    console.error("[AdminCache] Error clearing local cache:", error);
    return false;
  }
}

/**
 * Quick fix: Clear Matthew 28 cache specifically
 * This is a convenience function for the known theological error
 */
export async function clearMatthew28Cache(): Promise<ClearCacheResult> {
  return clearCommentaryCache({
    book: "Matthew",
    chapter: 28,
  });
}

/**
 * Clear all commentary for a specific book
 */
export async function clearBookCache(book: string): Promise<ClearCacheResult> {
  return clearCommentaryCache({ book });
}
