import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ReadingSequenceBlock, SavedReadingSequence, SequenceItem } from "@/types/readingSequence";
import { VoiceId } from "@/hooks/useTextToSpeech";

export const useReadingSequences = () => {
  const { user } = useAuth();
  const [savedSequences, setSavedSequences] = useState<SavedReadingSequence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSequences = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data: sequences, error: seqError } = await supabase
        .from("reading_sequences")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (seqError) throw seqError;

      if (!sequences?.length) {
        setSavedSequences([]);
        return;
      }

      // Fetch items for all sequences
      const { data: items, error: itemsError } = await supabase
        .from("sequence_items")
        .select("*")
        .in("sequence_id", sequences.map(s => s.id))
        .order("sequence_number", { ascending: true })
        .order("item_order", { ascending: true });

      if (itemsError) throw itemsError;

      // Group items by sequence
      const sequencesWithItems: SavedReadingSequence[] = sequences.map(seq => {
        const seqItems = items?.filter(i => i.sequence_id === seq.id) || [];
        
        // Group items by sequence_number (1-5)
        const blocks: ReadingSequenceBlock[] = [];
        for (let i = 1; i <= 5; i++) {
          const blockItems = seqItems.filter(item => item.sequence_number === i);
          if (blockItems.length > 0) {
            blocks.push({
              sequenceNumber: i,
              enabled: true,
              items: blockItems.map(item => ({
                id: item.id,
                book: item.book,
                chapter: item.chapter,
                startVerse: item.start_verse || undefined,
                endVerse: item.end_verse || undefined,
                order: item.item_order,
              })),
              voice: (blockItems[0]?.voice || "daniel") as VoiceId,
              playbackSpeed: Number(blockItems[0]?.playback_speed) || 1,
              playOrder: "listed",
              includeJeevesCommentary: blockItems[0]?.include_jeeves_commentary || false,
              commentaryVoice: (blockItems[0]?.commentary_voice || "daniel") as VoiceId,
              commentaryDepth: (blockItems[0]?.commentary_depth || "surface") as "surface" | "intermediate" | "depth",
              commentaryMode: (blockItems[0]?.commentary_mode || "chapter") as "chapter" | "verse",
            });
          }
        }

        return {
          id: seq.id,
          userId: seq.user_id,
          name: seq.name,
          description: seq.description || undefined,
          roomTags: seq.room_tags || [],
          isPublic: seq.is_public || false,
          playCount: seq.play_count || 0,
          sequences: blocks,
          createdAt: seq.created_at,
          updatedAt: seq.updated_at,
        };
      });

      setSavedSequences(sequencesWithItems);
    } catch (error) {
      console.error("Error fetching sequences:", error);
      toast.error("Failed to load your reading sequences");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSequences();
  }, [fetchSequences]);

  const saveSequence = async (
    name: string,
    description: string,
    roomTags: string[],
    sequences: ReadingSequenceBlock[],
    existingId?: string
  ): Promise<string | null> => {
    if (!user) {
      toast.error("Please sign in to save sequences");
      return null;
    }

    setIsSaving(true);
    try {
      let sequenceId = existingId;

      if (existingId) {
        // Update existing
        const { error } = await supabase
          .from("reading_sequences")
          .update({
            name,
            description,
            room_tags: roomTags,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingId);

        if (error) throw error;

        // Delete old items
        await supabase.from("sequence_items").delete().eq("sequence_id", existingId);
      } else {
        // Create new
        const { data, error } = await supabase
          .from("reading_sequences")
          .insert({
            user_id: user.id,
            name,
            description,
            room_tags: roomTags,
          })
          .select("id")
          .single();

        if (error) throw error;
        sequenceId = data.id;
      }

      // Insert items
      const itemsToInsert = sequences
        .filter(seq => seq.enabled && seq.items.length > 0)
        .flatMap(seq =>
          seq.items.map((item, idx) => ({
            sequence_id: sequenceId,
            sequence_number: seq.sequenceNumber,
            item_order: idx,
            book: item.book,
            chapter: item.chapter,
            start_verse: item.startVerse || null,
            end_verse: item.endVerse || null,
            voice: seq.voice,
            playback_speed: seq.playbackSpeed,
            include_jeeves_commentary: seq.includeJeevesCommentary,
            commentary_voice: seq.commentaryVoice || "daniel",
            commentary_depth: seq.commentaryDepth || "surface",
            commentary_mode: seq.commentaryMode || "chapter",
          }))
        );

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from("sequence_items")
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast.success(existingId ? "Sequence updated!" : "Sequence saved!");
      await fetchSequences();
      return sequenceId;
    } catch (error) {
      console.error("Error saving sequence:", error);
      toast.error("Failed to save sequence");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSequence = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reading_sequences")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSavedSequences(prev => prev.filter(s => s.id !== id));
      toast.success("Sequence deleted");
    } catch (error) {
      console.error("Error deleting sequence:", error);
      toast.error("Failed to delete sequence");
    }
  };

  const incrementPlayCount = async (id: string) => {
    try {
      await supabase.rpc("increment_user_points", { user_id: user?.id, points_to_add: 0 }); // Dummy, actual increment below
      const { error } = await supabase
        .from("reading_sequences")
        .update({ play_count: savedSequences.find(s => s.id === id)?.playCount || 0 + 1 })
        .eq("id", id);
      
      if (!error) {
        setSavedSequences(prev =>
          prev.map(s => (s.id === id ? { ...s, playCount: s.playCount + 1 } : s))
        );
      }
    } catch (e) {
      // Silently fail
    }
  };

  return {
    savedSequences,
    isLoading,
    isSaving,
    saveSequence,
    deleteSequence,
    fetchSequences,
    incrementPlayCount,
  };
};
