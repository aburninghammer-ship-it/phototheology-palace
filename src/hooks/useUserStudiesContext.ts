import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserStudy {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface DeckStudy {
  id: string;
  verse_reference: string | null;
  verse_text: string;
  conversation_history: unknown;
  gem_title: string | null;
  gem_notes: string | null;
}

export interface StudyContext {
  userStudies: UserStudy[];
  deckStudies: DeckStudy[];
}

/**
 * Hook to fetch admin studies relevant to a given book/chapter/verse
 * for incorporation into Jeeves commentary.
 * IMPORTANT: Only admin users can have their studies affect commentary.
 * Regular users will receive standard commentary without personalization.
 */
export const useUserStudiesContext = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchRelevantStudies = useCallback(async (
    book: string,
    chapter: number,
    verse?: number
  ): Promise<StudyContext> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { userStudies: [], deckStudies: [] };
      }

      // Check if user is the palace owner - ONLY the owner can have studies affect commentary
      const { data: ownerCheck } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .eq('role', 'owner')
        .maybeSingle();
      
      if (!ownerCheck) {
        // Non-owner users get standard commentary without personalization
        console.log("[Studies Context] Non-owner user, returning empty studies");
        return { userStudies: [], deckStudies: [] };
      }

      // Build search terms for relevance matching
      const bookName = book.toLowerCase();
      const chapterRef = `${book} ${chapter}`;
      const verseRef = verse ? `${book} ${chapter}:${verse}` : null;

      // Fetch user_studies that might be relevant
      // Search in title, content, and tags
      const { data: userStudies, error: userError } = await supabase
        .from("user_studies")
        .select("id, title, content, tags")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(10);

      if (userError) {
        console.error("[Studies Context] Error fetching user studies:", userError);
      }

      // Filter studies that mention the book/chapter/verse
      const relevantUserStudies = (userStudies || []).filter(study => {
        const titleLower = study.title?.toLowerCase() || "";
        const contentLower = study.content?.toLowerCase() || "";
        const tagsJoined = (study.tags || []).join(" ").toLowerCase();

        // Check if study mentions this book/chapter
        const mentionsBook = titleLower.includes(bookName) || 
                            contentLower.includes(bookName) ||
                            tagsJoined.includes(bookName);
        
        const mentionsChapter = titleLower.includes(chapterRef.toLowerCase()) ||
                               contentLower.includes(chapterRef.toLowerCase()) ||
                               tagsJoined.includes(chapterRef.toLowerCase());

        const mentionsVerse = verseRef && (
          titleLower.includes(verseRef.toLowerCase()) ||
          contentLower.includes(verseRef.toLowerCase()) ||
          tagsJoined.includes(verseRef.toLowerCase())
        );

        return mentionsBook || mentionsChapter || mentionsVerse;
      }).slice(0, 3); // Limit to top 3 most relevant

      // Fetch deck_studies (Card Deck conversations) that reference this passage
      const { data: deckStudies, error: deckError } = await supabase
        .from("deck_studies")
        .select("id, verse_reference, verse_text, conversation_history, gem_title, gem_notes")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(10);

      if (deckError) {
        console.error("[Studies Context] Error fetching deck studies:", deckError);
      }

      // Filter deck studies that mention this book/chapter
      const relevantDeckStudies = (deckStudies || []).filter(study => {
        const refLower = study.verse_reference?.toLowerCase() || "";
        const textLower = study.verse_text?.toLowerCase() || "";
        
        return refLower.includes(bookName) || 
               textLower.includes(bookName) ||
               refLower.includes(chapterRef.toLowerCase());
      }).slice(0, 3);

      console.log(`[Studies Context] Found ${relevantUserStudies.length} user studies and ${relevantDeckStudies.length} deck studies for ${book} ${chapter}${verse ? ':' + verse : ''}`);

      return {
        userStudies: relevantUserStudies,
        deckStudies: relevantDeckStudies
      };
    } catch (error) {
      console.error("[Studies Context] Error:", error);
      return { userStudies: [], deckStudies: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format studies into a string for the AI prompt
  const formatStudiesForPrompt = useCallback((context: StudyContext): string | null => {
    const parts: string[] = [];

    if (context.userStudies.length > 0) {
      parts.push("### PREVIOUS STUDIES ON THIS PASSAGE:");
      context.userStudies.forEach((study, i) => {
        parts.push(`\n**Study ${i + 1}: "${study.title}"**`);
        // Truncate content to avoid overwhelming the prompt
        const truncatedContent = study.content?.substring(0, 800) || "";
        parts.push(truncatedContent);
        if (study.tags?.length) {
          parts.push(`Tags: ${study.tags.join(", ")}`);
        }
      });
    }

    if (context.deckStudies.length > 0) {
      parts.push("\n### CARD DECK STUDY INSIGHTS:");
      context.deckStudies.forEach((study, i) => {
        parts.push(`\n**Insight ${i + 1}${study.gem_title ? `: "${study.gem_title}"` : ""}**`);
        if (study.gem_notes) {
          parts.push(study.gem_notes);
        }
        // Extract key insights from conversation history
        if (study.conversation_history && Array.isArray(study.conversation_history)) {
          const assistantMessages = study.conversation_history
            .filter((msg: any) => msg.role === "assistant")
            .slice(-2); // Last 2 AI responses
          if (assistantMessages.length > 0) {
            const insights = assistantMessages
              .map((msg: any) => msg.content?.substring(0, 400) || "")
              .join("\n");
            parts.push(insights);
          }
        }
      });
    }

    if (parts.length === 0) return null;

    return parts.join("\n") + "\n\n**INSTRUCTION**: Incorporate insights from the previous studies into the commentary where relevant. Build upon the existing understanding and connect new insights to what has already been explored.";
  }, []);

  return {
    fetchRelevantStudies,
    formatStudiesForPrompt,
    isLoading
  };
};
