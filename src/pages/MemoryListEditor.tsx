import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react";
import { toast } from "sonner";
import { ScriptureInsertDialog } from "@/components/studies/ScriptureInsertDialog";
import type { Verse } from "@/types/bible";

export default function MemoryListEditor() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [list, setList] = useState<any>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [showVerseInsert, setShowVerseInsert] = useState(false);

  useEffect(() => {
    if (listId) {
      fetchList();
      fetchVerses();
    }
  }, [listId]);

  const fetchList = async () => {
    try {
      const { data, error } = await supabase
        .from("memory_verse_lists")
        .select("*")
        .eq("id", listId)
        .single();

      if (error) throw error;
      setList(data);
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error("Failed to load list");
      navigate("/memory");
    } finally {
      setLoading(false);
    }
  };

  const fetchVerses = async () => {
    try {
      const { data, error } = await supabase
        .from("memory_verse_list_items")
        .select("*")
        .eq("list_id", listId)
        .order("order_index");

      if (error) throw error;
      setVerses(data || []);
    } catch (error) {
      console.error("Error fetching verses:", error);
    }
  };

  const handleInsertVerse = async (verseText: string) => {
    // Parse verse reference from the text
    const match = verseText.match(/^(.+?)\s+(\d+:\d+)\s+-\s+(.+)$/);
    if (!match) {
      toast.error("Invalid verse format");
      return;
    }

    const [, book, reference, text] = match;
    const verseReference = `${book} ${reference}`;

    try {
      const { error } = await supabase
        .from("memory_verse_list_items")
        .insert({
          list_id: listId,
          verse_reference: verseReference,
          verse_text: text.trim(),
          order_index: verses.length,
        });

      if (error) throw error;
      toast.success("Verse added!");
      fetchVerses();
      setShowVerseInsert(false);
    } catch (error) {
      console.error("Error adding verse:", error);
      toast.error("Failed to add verse");
    }
  };

  const handleDeleteVerse = async (verseId: string) => {
    try {
      const { error } = await supabase
        .from("memory_verse_list_items")
        .delete()
        .eq("id", verseId);

      if (error) throw error;
      toast.success("Verse removed");
      fetchVerses();
    } catch (error) {
      console.error("Error deleting verse:", error);
      toast.error("Failed to remove verse");
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === verses.length - 1)
    ) {
      return;
    }

    const newVerses = [...verses];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newVerses[index], newVerses[targetIndex]] = [newVerses[targetIndex], newVerses[index]];

    // Update order_index for all verses
    const updates = newVerses.map((verse, idx) => ({
      id: verse.id,
      order_index: idx,
    }));

    try {
      for (const update of updates) {
        await supabase
          .from("memory_verse_list_items")
          .update({ order_index: update.order_index })
          .eq("id", update.id);
      }
      
      setVerses(newVerses);
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to reorder verses");
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/memory")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Memory
        </Button>

        <div className="space-y-6">
          {/* List Info */}
          <Card>
            <CardHeader>
              <CardTitle>{list?.title}</CardTitle>
              <CardDescription>
                {list?.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Target: {list?.target_verse_count} verses</span>
                <span>•</span>
                <span>Current: {verses.length} verses</span>
                <span>•</span>
                <span>{list?.bible_version.toUpperCase()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Verses List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Verses</CardTitle>
                <Button onClick={() => setShowVerseInsert(true)} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Verse
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {verses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No verses added yet</p>
                  <p className="text-sm mt-2">Add verses to start creating your memory list</p>
                </div>
              ) : (
                verses.map((verse, index) => (
                  <Card key={verse.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1 mt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorder(index, "up")}
                          disabled={index === 0}
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorder(index, "down")}
                          disabled={index === verses.length - 1}
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-primary">
                          {verse.verse_reference}
                        </p>
                        <p className="text-sm mt-1">{verse.verse_text}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteVerse(verse.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ScriptureInsertDialog onInsert={handleInsertVerse} />
    </div>
  );
}
