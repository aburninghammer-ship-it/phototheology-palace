import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { BookOpen, Plus, Trash2, Loader2, Edit, Check, X, Sparkles, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BiblePracticeTile } from "./BiblePracticeTile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoomExercise {
  id: string;
  verse_reference: string;
  exercise_title: string;
  exercise_content: string;
  created_at: string;
  updated_at: string;
}

interface RoomPracticeSpaceProps {
  floorNumber: number;
  roomId: string;
  roomName: string;
  roomPrinciple: string;
}

export function RoomPracticeSpace({ floorNumber, roomId, roomName, roomPrinciple }: RoomPracticeSpaceProps) {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<RoomExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [verseRef, setVerseRef] = useState("");
  const [exerciseTitle, setExerciseTitle] = useState("");
  const [exerciseContent, setExerciseContent] = useState("");
  const [showAIPractice, setShowAIPractice] = useState(false);
  const [practiceVerseRef, setPracticeVerseRef] = useState("");
  const [practiceBibleText, setPracticeBibleText] = useState("");
  const [loadingBibleText, setLoadingBibleText] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [sourceType, setSourceType] = useState<"bible" | "custom" | null>(null);
  const [bibleRefInput, setBibleRefInput] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customContent, setCustomContent] = useState("");

  useEffect(() => {
    if (user) {
      fetchExercises();
    }
  }, [user, floorNumber, roomId]);

  const fetchExercises = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("room_exercises")
        .select("*")
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .eq("floor_number", floorNumber)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      toast.error("Failed to load your practice work");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !verseRef.trim() || !exerciseTitle.trim() || !exerciseContent.trim()) return;

    try {
      setSubmitting(true);

      if (editingId) {
        // Update existing exercise
        const { error } = await supabase
          .from("room_exercises")
          .update({
            verse_reference: verseRef.trim(),
            exercise_title: exerciseTitle.trim(),
            exercise_content: exerciseContent.trim(),
          })
          .eq("id", editingId)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Practice work updated!");
      } else {
        // Create new exercise
        const { error } = await supabase
          .from("room_exercises")
          .insert({
            user_id: user.id,
            floor_number: floorNumber,
            room_id: roomId,
            verse_reference: verseRef.trim(),
            exercise_title: exerciseTitle.trim(),
            exercise_content: exerciseContent.trim(),
          });

        if (error) throw error;
        toast.success("Practice work saved!");
      }

      setVerseRef("");
      setExerciseTitle("");
      setExerciseContent("");
      setShowForm(false);
      setEditingId(null);
      fetchExercises();
    } catch (error) {
      console.error("Error saving exercise:", error);
      toast.error("Failed to save practice work");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exercise: RoomExercise) => {
    setEditingId(exercise.id);
    setVerseRef(exercise.verse_reference);
    setExerciseTitle(exercise.exercise_title);
    setExerciseContent(exercise.exercise_content);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setVerseRef("");
    setExerciseTitle("");
    setExerciseContent("");
    setShowForm(false);
  };

  const handleDelete = async (exerciseId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("room_exercises")
        .delete()
        .eq("id", exerciseId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Practice work deleted");
      fetchExercises();
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Failed to delete practice work");
    }
  };

  const handleStartAIPractice = () => {
    setShowSourcePicker(true);
    setSourceType(null);
    setBibleRefInput("");
    setCustomTitle("");
    setCustomContent("");
  };

  const handleBibleRefSubmit = async () => {
    if (!bibleRefInput.trim()) return;

    try {
      setLoadingBibleText(true);
      setPracticeVerseRef(bibleRefInput);

      // Parse reference: handles "John 3:16", "1 Corinthians 13:4-7", "Genesis 1"
      const refPattern = /^((?:\d\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)(?::(\d+)(?:\s*[-–—]\s*(\d+))?)?$/;
      const match = bibleRefInput.trim().match(refPattern);

      if (!match) {
        toast.error("Invalid reference format. Try e.g. 'John 3:16' or 'Genesis 1:1-5'");
        setLoadingBibleText(false);
        return;
      }

      const [, book, chapterStr, verseStartStr, verseEndStr] = match;
      const chapter = parseInt(chapterStr);
      const verseStart = verseStartStr ? parseInt(verseStartStr) : null;
      const verseEnd = verseEndStr ? parseInt(verseEndStr) : verseStart;

      const { data, error } = await supabase.functions.invoke('bible-api', {
        body: { book, chapter, version: 'kjv' }
      });

      if (error) throw error;

      if (data?.verses) {
        let filteredVerses = data.verses;
        if (verseStart !== null) {
          filteredVerses = data.verses.filter(
            (v: any) => v.verse >= verseStart && v.verse <= (verseEnd ?? verseStart)
          );
        }

        if (filteredVerses.length === 0) {
          toast.error("No verses found for that reference.");
          setLoadingBibleText(false);
          return;
        }

        const text = filteredVerses.map((v: any) => `${v.verse} ${v.text}`).join('\n');
        setPracticeBibleText(text);
        setShowSourcePicker(false);
        setShowAIPractice(true);
      } else {
        throw new Error('No Bible text found');
      }
    } catch (error) {
      console.error("Error fetching Bible text:", error);
      toast.error("Could not load Bible text. Please check the reference and try again.");
    } finally {
      setLoadingBibleText(false);
    }
  };

  const handleCustomSubmit = () => {
    if (!customTitle.trim() || !customContent.trim()) return;
    setPracticeVerseRef(customTitle);
    setPracticeBibleText(customContent);
    setShowSourcePicker(false);
    setShowAIPractice(true);
  };

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Sign in to practice {roomName} principles and save your work!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {showAIPractice && (
        <BiblePracticeTile
          verseReference={practiceVerseRef}
          bibleText={practiceBibleText}
          roomName={roomName}
          roomPrinciple={roomPrinciple}
          onClose={() => setShowAIPractice(false)}
        />
      )}

      {/* Inline Source Picker - replaces confirm/prompt dialogs */}
      {showSourcePicker && (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 mb-4">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold">Choose Your Source</h3>
              <p className="text-sm text-muted-foreground">Select a Bible passage or write your own text</p>
            </div>

            {!sourceType && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  onClick={() => setSourceType("bible")}
                  size="lg"
                  className="h-auto py-4 flex flex-col items-center gap-1 gradient-palace text-white"
                >
                  <Search className="h-5 w-5" />
                  <span className="font-bold">Bible Verse / Chapter</span>
                  <span className="text-xs opacity-90">e.g. John 3:16, Genesis 22</span>
                </Button>
                <Button
                  onClick={() => setSourceType("custom")}
                  size="lg"
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-1 border-2"
                >
                  <Edit className="h-5 w-5" />
                  <span className="font-bold">Your Own Story / Text</span>
                  <span className="text-xs text-muted-foreground">Paste or type anything</span>
                </Button>
              </div>
            )}

            {sourceType === "bible" && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Enter verse or chapter reference</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. John 3:16, Genesis 22, Psalm 23"
                    value={bibleRefInput}
                    onChange={(e) => setBibleRefInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBibleRefSubmit()}
                    autoFocus
                  />
                  <Button
                    onClick={handleBibleRefSubmit}
                    disabled={!bibleRefInput.trim() || loadingBibleText}
                  >
                    {loadingBibleText ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go"}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSourceType(null)} className="text-xs">
                  ← Back
                </Button>
              </div>
            )}

            {sourceType === "custom" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <Input
                    placeholder="e.g. David and Goliath, The Prodigal Son"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Your text</Label>
                  <Textarea
                    placeholder="Paste or type any story, verse, or personal experience..."
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSourceType(null)} className="text-xs">
                    ← Back
                  </Button>
                  <Button
                    onClick={handleCustomSubmit}
                    disabled={!customTitle.trim() || !customContent.trim()}
                    size="sm"
                  >
                    Start Practice
                  </Button>
                </div>
              </div>
            )}

            <div className="text-right">
              <Button variant="ghost" size="sm" onClick={() => setShowSourcePicker(false)} className="text-xs text-muted-foreground">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {exercises.length === 0 && !showForm && (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-palace shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">🎯 Practice With YOUR Content</CardTitle>
                <CardDescription className="text-sm mt-1">
                  This is where you apply {roomName} principles to your own scriptures, stories, or topics!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                onClick={handleStartAIPractice}
                size="lg"
                className="w-full gradient-palace text-white h-auto py-4 flex flex-col items-center gap-1"
                disabled={loadingBibleText}
              >
                {loadingBibleText ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-6 w-6" />
                    <span className="font-bold">AI-Guided Practice</span>
                    <span className="text-xs opacity-90">Jeeves walks you through step-by-step</span>
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-center gap-1 border-2 hover:border-primary/50"
              >
                <Plus className="h-6 w-6" />
                <span className="font-bold">Write Your Own</span>
                <span className="text-xs text-muted-foreground">Journal your insights directly</span>
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              💡 <strong>Tip:</strong> Choose any Bible verse, story, or topic you're studying and apply {roomName} principles to it!
            </p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Practice Box</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleStartAIPractice}
                size="sm"
                variant="default"
                className="gradient-palace"
                disabled={loadingBibleText}
              >
                {loadingBibleText ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Practice
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  if (showForm && !editingId) {
                    handleCancelEdit();
                  } else {
                    setShowForm(!showForm);
                  }
                }}
                size="sm"
                variant={showForm ? "outline" : "default"}
              >
                {showForm ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    New Practice
                  </>
                )}
              </Button>
            </div>
          </div>
          <CardDescription>
            Apply the {roomName} principle to any verse or story you choose
          </CardDescription>
        </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-accent/5">
            <div className="space-y-2">
              <Label htmlFor="verse-ref">Verse/Story Reference *</Label>
              <Input
                id="verse-ref"
                value={verseRef}
                onChange={(e) => setVerseRef(e.target.value)}
                placeholder="e.g., John 3:16, Genesis 22, Exodus 14"
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exercise-title">Title *</Label>
              <Input
                id="exercise-title"
                value={exerciseTitle}
                onChange={(e) => setExerciseTitle(e.target.value)}
                placeholder="Give your practice work a title"
                required
                maxLength={150}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exercise-content">Your Work *</Label>
              <Textarea
                id="exercise-content"
                value={exerciseContent}
                onChange={(e) => setExerciseContent(e.target.value)}
                placeholder={`Apply the ${roomName} principle here...\n\nExample: ${roomPrinciple.substring(0, 200)}...`}
                required
                rows={8}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Save Work
                  </>
                )}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No practice work yet. Start applying the {roomName} principle!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground bg-accent px-2 py-1 rounded">
                        {exercise.verse_reference}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(exercise.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-base">
                      {exercise.exercise_title}
                    </h4>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(exercise)}
                      className="h-8 w-8 p-0 hover:bg-accent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(exercise.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {exercise.exercise_content}
                </p>
                {exercise.updated_at !== exercise.created_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated {new Date(exercise.updated_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}