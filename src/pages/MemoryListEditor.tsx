import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { VoiceCallWidget } from "@/components/VoiceCallWidget";
import { MemoryVerseSearchDialog } from "@/components/memory/MemoryVerseSearchDialog";
import { VerseWithPTAnalysis } from "@/components/memory/VerseWithPTAnalysis";
import { JeevesVerseSuggestions } from "@/components/memory/JeevesVerseSuggestions";

export default function MemoryListEditor() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [list, setList] = useState<any>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [showVerseInsert, setShowVerseInsert] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);

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
      setIsTemplate(data.is_template || false);
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

  const handleInsertVerse = async (verse: { reference: string; text: string }) => {
    try {
      // First insert the verse
      const { data: newVerse, error } = await supabase
        .from("memory_verse_list_items")
        .insert({
          list_id: listId,
          verse_reference: verse.reference,
          verse_text: verse.text,
          order_index: verses.length,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Verse added! Generating PT analysis...");
      
      // Generate PT analysis in the background
      supabase.functions
        .invoke("analyze-verse-pt", {
          body: {
            verse_reference: verse.reference,
            verse_text: verse.text,
          },
        })
        .then(({ data, error: analysisError }) => {
          if (!analysisError && data) {
            // Update the verse with PT analysis
            supabase
              .from("memory_verse_list_items")
              .update({
                pt_insights: data.pt_insights,
                hebrew_greek: data.hebrew_greek || null,
              })
              .eq("id", newVerse.id)
              .then(() => {
                fetchVerses();
              });
          }
        })
        .catch((err) => {
          console.error("Error generating PT analysis:", err);
        });

      fetchVerses();
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

  const handleToggleTemplate = async () => {
    try {
      const { error } = await supabase
        .from("memory_verse_lists")
        .update({ is_template: !isTemplate })
        .eq("id", listId);

      if (error) throw error;
      setIsTemplate(!isTemplate);
      toast.success(
        !isTemplate 
          ? "List marked as template - now visible to all users!" 
          : "List unmarked as template"
      );
    } catch (error) {
      console.error("Error updating template status:", error);
      toast.error("Failed to update template status");
    }
  };

  const handleReorder = async (verseId: string, index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === verses.length - 1)
    ) {
      return;
    }

    const newVerses = [...verses];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newVerses[index], newVerses[targetIndex]] = [newVerses[targetIndex], newVerses[index]];

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
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl overflow-y-auto">
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
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Target: {list?.target_verse_count} verses</span>
                <span>•</span>
                <span>Current: {verses.length} verses</span>
                <span>•</span>
                <span>{list?.bible_version.toUpperCase()}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Mark as Template</p>
                    <p className="text-xs text-muted-foreground">
                      Make this list available as a curated template for all users
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isTemplate}
                  onCheckedChange={handleToggleTemplate}
                />
              </div>
            </CardContent>
          </Card>

          {/* Jeeves Suggestions */}
          <JeevesVerseSuggestions onAddVerse={handleInsertVerse} />

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
                  <VerseWithPTAnalysis
                    key={verse.id}
                    verseId={verse.id}
                    reference={verse.verse_reference}
                    text={verse.verse_text}
                    orderIndex={index}
                    ptInsights={verse.pt_insights}
                    hebrewGreek={verse.hebrew_greek}
                    onDelete={() => handleDeleteVerse(verse.id)}
                    onReorder={(dir) => handleReorder(verse.id, index, dir)}
                    canMoveUp={index > 0}
                    canMoveDown={index < verses.length - 1}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <MemoryVerseSearchDialog
        open={showVerseInsert}
        onOpenChange={setShowVerseInsert}
        onAddVerse={handleInsertVerse}
      />
      
      <VoiceCallWidget roomId={listId!} roomName={list?.title} />
    </div>
  );
}
