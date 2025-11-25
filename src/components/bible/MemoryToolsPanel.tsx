import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Plus, Clock, Star, Trash2, Eye, EyeOff, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MemoryToolsPanelProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

export const MemoryToolsPanel = ({ book, chapter, verse, verseText }: MemoryToolsPanelProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const [memoryData, setMemoryData] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMemoryData();
  }, [book, chapter, verse]);

  const loadMemoryData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const verseRef = `${book} ${chapter}:${verse}`;
    const { data } = await supabase
      .from("memorization_verses")
      .select("*")
      .eq("user_id", user.id)
      .eq("verse_reference", verseRef)
      .maybeSingle();

    if (data) {
      setIsAdded(true);
      setMemoryData(data);
      setNotes(data.notes || "");
    } else {
      setIsAdded(false);
      setMemoryData(null);
    }
  };

  const addToMemory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in to save verses", variant: "destructive" });
      return;
    }

    const verseRef = `${book} ${chapter}:${verse}`;
    const { error } = await supabase
      .from("memorization_verses")
      .insert({
        user_id: user.id,
        book,
        chapter,
        verse,
        verse_reference: verseRef,
        verse_text: verseText,
        notes,
        mastery_level: 0,
        review_count: 0,
        next_review_date: new Date().toISOString().split('T')[0]
      });

    if (error) {
      toast({ title: "Error adding verse", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Added to memory deck!", description: "You'll be prompted to review this verse." });
      loadMemoryData();
    }
  };

  const removeFromMemory = async () => {
    if (!memoryData) return;

    const { error } = await supabase
      .from("memorization_verses")
      .delete()
      .eq("id", memoryData.id);

    if (error) {
      toast({ title: "Error removing verse", variant: "destructive" });
    } else {
      toast({ title: "Removed from memory deck" });
      setIsAdded(false);
      setMemoryData(null);
    }
  };

  const markReviewed = async (success: boolean) => {
    if (!memoryData) return;

    const newMastery = success 
      ? Math.min(memoryData.mastery_level + 1, 5)
      : Math.max(memoryData.mastery_level - 1, 0);

    const intervals = [1, 3, 7, 14, 30]; // days
    const nextInterval = intervals[newMastery] || 30;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + nextInterval);

    const { error } = await supabase
      .from("memorization_verses")
      .update({
        mastery_level: newMastery,
        review_count: memoryData.review_count + 1,
        last_reviewed: new Date().toISOString(),
        next_review_date: nextReview.toISOString().split('T')[0],
        review_interval_days: nextInterval
      })
      .eq("id", memoryData.id);

    if (error) {
      toast({ title: "Error updating review", variant: "destructive" });
    } else {
      toast({ 
        title: success ? "Great job! 🎉" : "Keep practicing!",
        description: `Next review in ${nextInterval} days`
      });
      loadMemoryData();
      setShowAnswer(false);
    }
  };

  const updateNotes = async () => {
    if (!memoryData) return;

    const { error } = await supabase
      .from("memorization_verses")
      .update({ notes })
      .eq("id", memoryData.id);

    if (error) {
      toast({ title: "Error saving notes", variant: "destructive" });
    } else {
      toast({ title: "Notes saved!" });
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-2 border-purple-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold text-sm text-foreground">Memory Tools</h4>
        </div>
        {isAdded && (
          <Badge variant="secondary" className="bg-purple-600 text-white">
            In Memory Deck
          </Badge>
        )}
      </div>

      {!isAdded ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Add this verse to your memory deck for spaced repetition review
          </p>
          <Input
            placeholder="Add memory notes (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="text-sm"
          />
          <Button 
            onClick={addToMemory}
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Memory Deck
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mastery Level */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Mastery:</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < memoryData.mastery_level
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {memoryData.review_count} reviews
            </span>
          </div>

          {/* Next Review */}
          {memoryData.next_review_date && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Next review: {memoryData.next_review_date}</span>
            </div>
          )}

          {/* Flashcard Review */}
          <div className="p-3 bg-background/50 rounded border border-border space-y-3">
            <div className="text-sm font-semibold text-foreground">
              {book} {chapter}:{verse}
            </div>
            {!showAnswer ? (
              <Button
                onClick={() => setShowAnswer(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                Show Verse
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-foreground italic">
                  "{verseText}"
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => markReviewed(true)}
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Got It!
                  </Button>
                  <Button
                    onClick={() => markReviewed(false)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Review Again
                  </Button>
                </div>
                <Button
                  onClick={() => setShowAnswer(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </Button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Input
              placeholder="Memory notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-sm"
            />
            <Button
              onClick={updateNotes}
              size="sm"
              variant="outline"
              className="w-full"
            >
              Save Notes
            </Button>
          </div>

          {/* Remove */}
          <Button
            onClick={removeFromMemory}
            variant="ghost"
            size="sm"
            className="w-full text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove from Memory Deck
          </Button>
        </div>
      )}

      <div className="bg-accent/10 p-2 rounded border border-accent/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Spaced Repetition:</strong> Review intervals increase as you master verses (1→3→7→14→30 days)
        </p>
      </div>
    </Card>
  );
};
