/**
 * Audio Bible Service
 * Handles TTS generation, commentary fetching, and caching
 */

import { supabase } from "@/integrations/supabase/client";
import {
  cacheChapterVerses,
  getCachedChapterVerses,
  cacheCommentary as cacheCommentaryLocal,
  getCachedCommentary as getCachedCommentaryLocal,
  prefetchCommentary,
} from "./audioBibleCache";

export type CommentaryTier = "surface" | "intermediate" | "scholarly";

export type CommentarySource = "standard" | "preacher-mentor" | "story-mode";

export type OpenAIVoice = "alloy" | "ash" | "coral" | "echo" | "fable" | "nova" | "onyx" | "sage" | "shimmer";

export const OPENAI_VOICES: { id: OpenAIVoice; name: string; description: string }[] = [
  { id: "onyx", name: "Onyx", description: "Deep, authoritative" },
  { id: "nova", name: "Nova", description: "Warm, friendly" },
  { id: "alloy", name: "Alloy", description: "Balanced, neutral" },
  { id: "echo", name: "Echo", description: "Clear, precise" },
  { id: "fable", name: "Fable", description: "Expressive, narrative" },
  { id: "shimmer", name: "Shimmer", description: "Bright, optimistic" },
  { id: "coral", name: "Coral", description: "Conversational" },
  { id: "sage", name: "Sage", description: "Wise, measured" },
  { id: "ash", name: "Ash", description: "Calm, steady" },
];

interface GenerateAudioOptions {
  text: string;
  voice?: OpenAIVoice;
  cacheKey?: string;
}

interface CommentaryOptions {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  tier?: CommentaryTier;
  generateAudio?: boolean;
  voice?: OpenAIVoice;
}

interface CommentaryResult {
  commentary: string;
  audioUrl: string | null;
  cached: boolean;
}

/**
 * Fetch chapter verses with caching
 */
export async function fetchChapterVerses(
  book: string,
  chapter: number
): Promise<{ verse: number; text: string }[]> {
  // Check local cache first
  const cached = await getCachedChapterVerses(book, chapter);
  if (cached && cached.length > 0) {
    console.log(`[Service] Using cached verses for ${book} ${chapter}`);
    return cached;
  }

  // Fetch from API
  try {
    const response = await fetch(
      `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=kjv`
    );
    const data = await response.json();

    if (data.verses) {
      const verses = data.verses.map((v: any) => ({
        verse: v.verse,
        text: v.text.trim(),
      }));

      // Cache for next time
      await cacheChapterVerses(book, chapter, verses);

      return verses;
    }
    return [];
  } catch (error) {
    console.error("[Service] Error fetching verses:", error);
    return [];
  }
}

/**
 * Generate TTS audio from text using OpenAI
 */
export async function generateTTSAudio(options: GenerateAudioOptions): Promise<string | null> {
  const { text, voice = "onyx" } = options;

  try {
    const { data, error } = await supabase.functions.invoke("text-to-speech", {
      body: { text, voice, returnType: "url" },
    });

    if (error) {
      console.error("[TTS] Error:", error);
      return null;
    }

    return data?.audioUrl || data?.url || null;
  } catch (error) {
    console.error("[TTS] Error:", error);
    return null;
  }
}

/**
 * Generate commentary for a verse with optional TTS
 * Uses local cache first, then Supabase cache, then generates new
 */
export async function generateCommentary(options: CommentaryOptions): Promise<CommentaryResult | null> {
  const { book, chapter, verse, verseText, tier = "surface", generateAudio = false, voice = "onyx" } = options;

  // 1. Check local IndexedDB cache first (fastest)
  const localCached = await getCachedCommentaryLocal(book, chapter, verse, tier);
  if (localCached) {
    console.log(`[Service] Local cache hit for ${book} ${chapter}:${verse} (${tier})`);
    return {
      commentary: localCached.commentary,
      audioUrl: localCached.audioUrl || null,
      cached: true,
    };
  }

  // 2. Call edge function (which checks Supabase cache and generates if needed)
  try {
    const { data, error } = await supabase.functions.invoke("generate-audio-commentary", {
      body: { book, chapter, verse, verseText, tier, generateAudio, voice },
    });

    if (error) {
      console.error("[Commentary] Error:", error);
      return null;
    }

    const result = {
      commentary: data?.commentary || "",
      audioUrl: data?.audioUrl || null,
      cached: data?.cached || false,
    };

    // 3. Cache locally for even faster access next time
    if (result.commentary) {
      await cacheCommentaryLocal(book, chapter, verse, tier, result.commentary, result.audioUrl || undefined);
    }

    return result;
  } catch (error) {
    console.error("[Commentary] Error:", error);
    return null;
  }
}

// CommentarySource type is defined at top of file

/**
 * Generate Preacher Mentor commentary for a verse (2-step pipeline)
 * Step 1: Passage analysis (lens detection) — with fallback if analyzer unavailable
 * Step 2: Mentor commentary generation via Jeeves
 */
export async function generatePreacherMentorCommentary(options: CommentaryOptions): Promise<CommentaryResult | null> {
  const { book, chapter, verse, verseText, generateAudio = false, voice = "onyx" } = options;

  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
    const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: anonKey,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Step 1: Passage Analysis (with fallback defaults if analyzer not deployed)
    let analysis = {
      primary_room: "sr",
      secondary_rooms: [] as string[],
      genre: "narrative",
    };

    try {
      const analyzeRes = await fetch(
        `${supabaseUrl}/functions/v1/pt-passage-analyzer`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ book, chapter, verse, verseText }),
        }
      );

      if (analyzeRes.ok) {
        const analyzeData = await analyzeRes.json();
        if (analyzeData.primary_room) {
          analysis = analyzeData;
          console.log(`[Preacher Mentor] Analysis: primary=${analysis.primary_room}, genre=${analysis.genre}`);
        }
      } else {
        console.warn(`[Preacher Mentor] Analyzer unavailable (${analyzeRes.status}), using default lens`);
      }
    } catch (analyzeError) {
      console.warn("[Preacher Mentor] Analyzer fetch failed, using default lens:", analyzeError);
    }

    // Step 2: Commentary Generation via Jeeves
    const commentaryRes = await fetch(
      `${supabaseUrl}/functions/v1/jeeves`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          mode: "preacher-mentor-commentary",
          book,
          chapter,
          verseText: { verse, text: verseText },
          primary_room: analysis.primary_room,
          secondary_rooms: analysis.secondary_rooms,
          genre: analysis.genre,
          override_room: null,
        }),
      }
    );

    if (!commentaryRes.ok) {
      console.error("[Preacher Mentor] Commentary failed:", commentaryRes.status);
      return null;
    }

    const commentaryData = await commentaryRes.json();
    const content = commentaryData.content;

    // Handle both structured JSON response and plain text response
    let commentaryText = "";
    if (typeof content === "string") {
      commentaryText = content;
    } else if (content?.sections) {
      const sections = content.sections;
      const parts = [
        sections.meaning,
        sections.cross_scripture,
        sections.palace_framing,
        sections.preaching_orientation,
      ].filter(Boolean);
      commentaryText = parts.join("\n\n");
    } else if (content) {
      commentaryText = JSON.stringify(content);
    }

    if (!commentaryText) {
      console.error("[Preacher Mentor] No commentary content in response");
      return null;
    }

    // Generate audio if requested
    let audioUrl: string | null = null;
    if (generateAudio && commentaryText) {
      audioUrl = await generateTTSAudio({ text: commentaryText, voice });
    }

    return {
      commentary: commentaryText,
      audioUrl,
      cached: false,
    };
  } catch (error) {
    console.error("[Preacher Mentor Commentary] Error:", error);
    return null;
  }
}

/**
 * Generate Story Mode commentary for a verse
 * Simple, narrative explanation for newcomers — what's happening, who's involved, why it matters
 */
export async function generateStoryModeCommentary(options: CommentaryOptions): Promise<CommentaryResult | null> {
  const { book, chapter, verse, verseText, generateAudio = false, voice = "nova" } = options;

  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "story-mode-commentary",
        book,
        chapter,
        verseText: { verse, text: verseText },
      },
    });

    if (error) {
      console.error("[Story Mode] Error:", error);
      return null;
    }

    const commentaryText = typeof data?.content === "string"
      ? data.content
      : data?.content?.story || "";

    if (!commentaryText) {
      console.error("[Story Mode] No content in response");
      return null;
    }

    // Generate audio if requested
    let audioUrl: string | null = null;
    if (generateAudio && commentaryText) {
      audioUrl = await generateTTSAudio({ text: commentaryText, voice });
    }

    return {
      commentary: commentaryText,
      audioUrl,
      cached: false,
    };
  } catch (error) {
    console.error("[Story Mode Commentary] Error:", error);
    return null;
  }
}

/**
 * Chapter commentary options
 */
interface ChapterCommentaryOptions {
  book: string;
  chapter: number;
  chapterText?: string;
  depth?: "surface" | "intermediate" | "depth";
  generateAudio?: boolean;
  voice?: OpenAIVoice;
}

/**
 * Generate chapter-level commentary (summary for entire chapter)
 */
export async function generateChapterCommentary(options: ChapterCommentaryOptions): Promise<CommentaryResult | null> {
  const { book, chapter, chapterText, depth = "surface", generateAudio = true, voice = "onyx" } = options;

  try {
    const { data, error } = await supabase.functions.invoke("generate-chapter-commentary", {
      body: { 
        book, 
        chapter, 
        chapterText, 
        depth,
        generateAudio,
        voice
      },
    });

    if (error) {
      console.error("[Chapter Commentary] Error:", error);
      return null;
    }

    return {
      commentary: data?.commentary || "",
      audioUrl: data?.audioUrl || null,
      cached: data?.cached || false,
    };
  } catch (error) {
    console.error("[Chapter Commentary] Error:", error);
    return null;
  }
}

/**
 * Get cached commentary from Supabase database
 * Note: bible_commentaries table may not exist yet - commentary is generated on-demand
 */
export async function getCachedCommentary(
  book: string,
  chapter: number,
  verse: number,
  tier: CommentaryTier = "surface"
): Promise<CommentaryResult | null> {
  // Check local cache first
  const localCached = await getCachedCommentaryLocal(book, chapter, verse, tier);
  if (localCached) {
    return {
      commentary: localCached.commentary,
      audioUrl: localCached.audioUrl || null,
      cached: true,
    };
  }

  // Commentary is generated via edge function, not stored in main database
  // The edge function handles its own caching
  return null;
}

/**
 * Prefetch commentary for upcoming verses in the background
 */
export async function prefetchUpcomingCommentary(
  book: string,
  chapter: number,
  currentVerse: number,
  verses: { verse: number; text: string }[],
  tier: CommentaryTier = "surface",
  count: number = 3
): Promise<void> {
  // Generate function for prefetch
  const generateFn = async (
    b: string,
    ch: number,
    v: number,
    text: string,
    t: string
  ): Promise<{ commentary: string; audioUrl?: string } | null> => {
    const result = await generateCommentary({
      book: b,
      chapter: ch,
      verse: v,
      verseText: text,
      tier: t as CommentaryTier,
      generateAudio: false, // Don't generate audio for prefetch to save time/cost
    });

    if (result) {
      return {
        commentary: result.commentary,
        audioUrl: result.audioUrl || undefined,
      };
    }
    return null;
  };

  await prefetchCommentary(book, chapter, currentVerse + 1, count, tier, verses, generateFn);
}

/**
 * Get available themes
 * Note: Themes feature not yet implemented - returns empty array
 */
export async function getThemes(): Promise<{ id: string; name: string; display_name: string; description: string; icon: string; category: string; verse_count: number }[]> {
  // Themes feature not yet implemented
  // Return empty array for now
  return [];
}

/**
 * Get verses for a theme
 * Note: Themes feature not yet implemented - returns empty array
 */
export async function getThemeVerses(_themeId: string): Promise<{ verse_reference: string; relevance_score: number }[]> {
  // Themes feature not yet implemented
  return [];
}

// Pre-defined reading series
export const READING_SERIES = [
  {
    id: "prophecy",
    name: "Prophecy Pack",
    description: "Daniel & Revelation prophetic sequence",
    items: [
      { book: "Daniel", chapter: 7 },
      { book: "Revelation", chapter: 13 },
      { book: "Daniel", chapter: 8 },
      { book: "Daniel", chapter: 9 },
      { book: "Revelation", chapter: 14 },
    ],
  },
  {
    id: "sanctuary",
    name: "Sanctuary Journey",
    description: "Walk through the sanctuary system",
    items: [
      { book: "Exodus", chapter: 25 },
      { book: "Exodus", chapter: 26 },
      { book: "Leviticus", chapter: 16 },
      { book: "Hebrews", chapter: 8 },
      { book: "Hebrews", chapter: 9 },
    ],
  },
  {
    id: "gospels",
    name: "Gospel Harmony",
    description: "Christ's story across the Gospels",
    items: [
      { book: "Luke", chapter: 2 },
      { book: "John", chapter: 1 },
      { book: "Matthew", chapter: 5 },
      { book: "Mark", chapter: 15 },
      { book: "John", chapter: 20 },
    ],
  },
  {
    id: "creation",
    name: "Creation to Fall",
    description: "The beginning of everything",
    items: [
      { book: "Genesis", chapter: 1 },
      { book: "Genesis", chapter: 2 },
      { book: "Genesis", chapter: 3 },
    ],
  },
  {
    id: "psalms",
    name: "Psalms of Praise",
    description: "Songs of worship and devotion",
    items: [
      { book: "Psalms", chapter: 23 },
      { book: "Psalms", chapter: 91 },
      { book: "Psalms", chapter: 119 },
      { book: "Psalms", chapter: 139 },
      { book: "Psalms", chapter: 150 },
    ],
  },
];
