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

export type CommentarySource = "standard" | "preacher-mentor" | "story-mode" | "epic" | "counselor";

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

  // Single-chapter books: bible-api.com interprets "Obadiah 1" as verse 1 only
  const singleChapterCounts: Record<string, number> = {
    obadiah: 21, philemon: 25, "2 john": 13, "3 john": 14, jude: 25,
  };
  const scVerseCount = singleChapterCounts[book.toLowerCase().trim()];
  const ref = (scVerseCount && chapter === 1)
    ? `${encodeURIComponent(book)}+1:1-${scVerseCount}`
    : `${encodeURIComponent(book)}+${chapter}`;

  // Fetch from API
  try {
    const response = await fetch(
      `https://bible-api.com/${ref}?translation=kjv`
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
 * Generate Preacher Mentor commentary for a verse
 * Tries dedicated preacher-mentor mode first, falls back to deep-palace-commentary,
 * then to standard commentary as last resort.
 */
export async function generatePreacherMentorCommentary(options: CommentaryOptions): Promise<CommentaryResult | null> {
  const { book, chapter, verse, verseText, generateAudio = false, voice = "onyx" } = options;

  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
    const anonKey = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: anonKey,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Try preacher-mentor-commentary mode first, fall back to deep-palace-commentary
    let commentaryText = "";

    // Attempt 1: Dedicated preacher-mentor mode
    try {
      const mentorRes = await fetch(
        `${supabaseUrl}/functions/v1/jeeves`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            mode: "preacher-mentor-commentary",
            book,
            chapter,
            verseText: { verse, text: verseText },
            primary_room: "sr",
            secondary_rooms: [],
            genre: "narrative",
            override_room: null,
          }),
        }
      );

      if (mentorRes.ok) {
        const data = await mentorRes.json();
        const content = data.content;
        if (typeof content === "string") {
          commentaryText = content;
        } else if (content?.sections) {
          const parts = [
            content.sections.meaning,
            content.sections.cross_scripture,
            content.sections.palace_framing,
            content.sections.preaching_orientation,
          ].filter(Boolean);
          commentaryText = parts.join("\n\n");
        } else if (content) {
          commentaryText = typeof content === "string" ? content : JSON.stringify(content);
        }
      }
    } catch (e) {
      console.warn("[Preacher Mentor] Dedicated mode failed, trying deep-palace:", e);
    }

    // Attempt 2: Fall back to deep-palace-commentary (always deployed)
    if (!commentaryText) {
      console.log("[Preacher Mentor] Using deep-palace-commentary fallback");
      try {
        const palaceRes = await fetch(
          `${supabaseUrl}/functions/v1/jeeves`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              mode: "deep-palace-commentary",
              book,
              chapter,
              verseText: { verse, text: verseText },
              maxWords: 350,
            }),
          }
        );

        if (palaceRes.ok) {
          const data = await palaceRes.json();
          commentaryText = typeof data.content === "string" ? data.content : "";
        }
      } catch (e) {
        console.warn("[Preacher Mentor] Deep palace fallback failed:", e);
      }
    }

    // Attempt 3: Standard commentary as last resort
    if (!commentaryText) {
      console.log("[Preacher Mentor] All Jeeves modes failed, using standard commentary");
      return generateCommentary({ ...options, tier: "intermediate" });
    }

    // Fire-and-forget TTS: start generating audio in background, return text immediately
    // The player will generate TTS itself if audioUrl is null
    if (generateAudio && commentaryText) {
      generateTTSAudio({ text: commentaryText, voice }).catch((e) =>
        console.warn("[Preacher Mentor] Background TTS failed:", e)
      );
    }

    return {
      commentary: commentaryText,
      audioUrl: null,
      cached: false,
    };
  } catch (error) {
    console.error("[Preacher Mentor Commentary] Error:", error);
    return generateCommentary({ ...options, tier: "intermediate" });
  }
}

/**
 * Generate Story Mode commentary for a verse
 * Simple, warm explanation with devotional thought for newcomers.
 * Tries dedicated story-mode first, falls back to verse-explanation,
 * then to standard surface commentary.
 */
export async function generateStoryModeCommentary(options: CommentaryOptions): Promise<CommentaryResult | null> {
  const { book, chapter, verse, verseText, generateAudio = false, voice = "fable" } = options;

  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
    const anonKey = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: anonKey,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let commentaryText = "";

    // Attempt 1: Dedicated story-mode-commentary in Jeeves
    try {
      const storyRes = await fetch(
        `${supabaseUrl}/functions/v1/jeeves`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            mode: "story-mode-commentary",
            book,
            chapter,
            verseText: { verse, text: verseText },
          }),
        }
      );

      if (storyRes.ok) {
        const data = await storyRes.json();
        commentaryText = typeof data.content === "string"
          ? data.content
          : data.content?.narrative || "";
      }
    } catch (e) {
      console.warn("[Story Mode] Dedicated mode failed, trying verse-explanation:", e);
    }

    // Attempt 2: Fall back to verse-explanation mode (always deployed)
    if (!commentaryText) {
      console.log("[Story Mode] Using verse-explanation fallback");
      try {
        const explainRes = await fetch(
          `${supabaseUrl}/functions/v1/jeeves`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              mode: "verse-explanation",
              book,
              chapter,
              verse,
              verseText,
            }),
          }
        );

        if (explainRes.ok) {
          const data = await explainRes.json();
          commentaryText = typeof data.content === "string" ? data.content : "";
        }
      } catch (e) {
        console.warn("[Story Mode] Verse-explanation fallback failed:", e);
      }
    }

    // Attempt 3: Standard surface commentary as last resort
    if (!commentaryText) {
      console.log("[Story Mode] All Jeeves modes failed, using standard commentary");
      return generateCommentary({ ...options, tier: "surface" });
    }

    // Fire-and-forget TTS: start generating audio in background, return text immediately
    if (generateAudio && commentaryText) {
      generateTTSAudio({ text: commentaryText, voice }).catch((e) =>
        console.warn("[Story Mode] Background TTS failed:", e)
      );
    }

    return {
      commentary: commentaryText,
      audioUrl: null,
      cached: false,
    };
  } catch (error) {
    console.error("[Story Mode Commentary] Error:", error);
    return generateCommentary({ ...options, tier: "surface" });
  }
}

/**
 * Generate Counselor Mode commentary for a verse
 * Reflective, soul-care focused commentary exploring emotional, psychological,
 * and spiritual dimensions of Scripture while remaining biblically grounded.
 * Tries dedicated counselor-commentary mode first, falls back to verse-explanation,
 * then to standard intermediate commentary.
 */
export async function generateCounselorCommentary(options: CommentaryOptions): Promise<CommentaryResult | null> {
  const { book, chapter, verse, verseText, generateAudio = false, voice = "sage" } = options;

  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
    const anonKey = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: anonKey,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let commentaryText = "";

    // Attempt 1: Dedicated counselor-commentary mode in Jeeves
    try {
      const counselorRes = await fetch(
        `${supabaseUrl}/functions/v1/jeeves`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            mode: "counselor-commentary",
            book,
            chapter,
            verseText: { verse, text: verseText },
          }),
        }
      );

      if (counselorRes.ok) {
        const data = await counselorRes.json();
        commentaryText = typeof data.content === "string"
          ? data.content
          : data.content?.reflection || "";
      }
    } catch (e) {
      console.warn("[Counselor] Dedicated mode failed, trying verse-explanation:", e);
    }

    // Attempt 2: Fall back to verse-explanation mode
    if (!commentaryText) {
      console.log("[Counselor] Using verse-explanation fallback");
      try {
        const explainRes = await fetch(
          `${supabaseUrl}/functions/v1/jeeves`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              mode: "verse-explanation",
              book,
              chapter,
              verse,
              verseText,
            }),
          }
        );

        if (explainRes.ok) {
          const data = await explainRes.json();
          commentaryText = typeof data.content === "string" ? data.content : "";
        }
      } catch (e) {
        console.warn("[Counselor] Verse-explanation fallback failed:", e);
      }
    }

    // Attempt 3: Standard intermediate commentary as last resort
    if (!commentaryText) {
      console.log("[Counselor] All Jeeves modes failed, using standard commentary");
      return generateCommentary({ ...options, tier: "intermediate" });
    }

    // Generate audio if requested — default to "sage" voice for calm, measured tone
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
    console.error("[Counselor Commentary] Error:", error);
    return generateCommentary({ ...options, tier: "intermediate" });
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
 * Passage commentary options
 */
interface PassageCommentaryOptions {
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  passageText?: string;
  depth?: "surface" | "intermediate" | "depth";
  generateAudio?: boolean;
  voice?: OpenAIVoice;
  commentarySource?: CommentarySource;
}

/**
 * Generate passage-level commentary (one cohesive commentary for a verse range)
 * Routes to the correct backend based on commentarySource.
 */
export async function generatePassageCommentary(options: PassageCommentaryOptions): Promise<CommentaryResult | null> {
  const {
    book, chapter, startVerse, endVerse, passageText,
    depth = "surface", generateAudio = true, voice = "onyx",
    commentarySource = "standard",
  } = options;

  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
    const anonKey = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: anonKey,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Route to the correct backend based on source
    if (commentarySource === "preacher-mentor") {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/jeeves`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            mode: "preacher-mentor-commentary",
            book,
            chapter,
            verseText: { verse: `${startVerse}-${endVerse}`, text: passageText },
            primary_room: "sr",
            secondary_rooms: [],
            genre: "narrative",
            override_room: null,
            isPassage: true,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const content = data.content;
          let commentaryText = typeof content === "string" ? content
            : content?.sections ? [content.sections.meaning, content.sections.cross_scripture, content.sections.palace_framing, content.sections.preaching_orientation].filter(Boolean).join("\n\n")
            : typeof content === "string" ? content : JSON.stringify(content);
          if (commentaryText) {
            let audioUrl: string | null = null;
            if (generateAudio) audioUrl = await generateTTSAudio({ text: commentaryText, voice });
            return { commentary: commentaryText, audioUrl, cached: false };
          }
        }
      } catch (e) {
        console.warn("[Passage] Preacher-mentor failed, falling back to standard:", e);
      }
    }

    if (commentarySource === "story-mode") {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/jeeves`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            mode: "story-mode-commentary",
            book,
            chapter,
            verseText: { verse: `${startVerse}-${endVerse}`, text: passageText },
            isPassage: true,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const commentaryText = typeof data.content === "string" ? data.content : data.content?.narrative || "";
          if (commentaryText) {
            let audioUrl: string | null = null;
            if (generateAudio) audioUrl = await generateTTSAudio({ text: commentaryText, voice });
            return { commentary: commentaryText, audioUrl, cached: false };
          }
        }
      } catch (e) {
        console.warn("[Passage] Story-mode failed, falling back to standard:", e);
      }
    }

    if (commentarySource === "epic") {
      try {
        const { data, error } = await supabase.functions.invoke("generate-epic-commentary", {
          body: { book, chapter, scope: "passage", startVerse, endVerse, passageText },
        });
        if (!error && data?.commentary) {
          let audioUrl = data.audioUrl || null;
          if (!audioUrl && generateAudio) audioUrl = await generateTTSAudio({ text: data.commentary, voice });
          return { commentary: data.commentary, audioUrl, cached: false };
        }
      } catch (e) {
        console.warn("[Passage] Epic mode failed, falling back to standard:", e);
      }
    }

    if (commentarySource === "counselor") {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/jeeves`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            mode: "counselor-commentary",
            book,
            chapter,
            verseText: { verse: `${startVerse}-${endVerse}`, text: passageText },
            isPassage: true,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const commentaryText = typeof data.content === "string" ? data.content : data.content?.reflection || "";
          if (commentaryText) {
            let audioUrl: string | null = null;
            if (generateAudio) audioUrl = await generateTTSAudio({ text: commentaryText, voice });
            return { commentary: commentaryText, audioUrl, cached: false };
          }
        }
      } catch (e) {
        console.warn("[Passage] Counselor mode failed, falling back to standard:", e);
      }
    }

    // Standard: call generate-chapter-commentary with isPassage flag
    const { data, error } = await supabase.functions.invoke("generate-chapter-commentary", {
      body: {
        book,
        chapter,
        chapterText: passageText,
        depth,
        generateAudio,
        voice,
        isPassage: true,
        startVerse,
        endVerse,
      },
    });

    if (error) {
      console.error("[Passage Commentary] Error:", error);
      return null;
    }

    return {
      commentary: data?.commentary || "",
      audioUrl: data?.audioUrl || null,
      cached: data?.cached || false,
    };
  } catch (error) {
    console.error("[Passage Commentary] Error:", error);
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
