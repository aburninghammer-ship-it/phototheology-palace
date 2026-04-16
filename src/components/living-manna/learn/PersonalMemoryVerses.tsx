import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen, Brain, Plus, Trash2, Star, Trophy, Loader2,
  ChevronRight, Sparkles, Eye, EyeOff, RotateCcw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { MemoryVerseSearchDialog } from "@/components/memory/MemoryVerseSearchDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface PersonalMemoryVersesProps {
  churchId: string;
}

interface MemoryList {
  id: string;
  title: string;
  description: string | null;
  target_verse_count: number | null;
  bible_version: string | null;
  created_at: string;
}

interface MemoryVerseItem {
  id: string;
  list_id: string;
  verse_reference: string;
  verse_text: string;
  order_index: number;
  pt_insights: any;
}

interface MasteryRecord {
  verse_reference: string;
  mastery_level: number;
  times_practiced: number;
  last_practiced_at: string | null;
}

const MASTERY_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "New", color: "bg-gray-500" },
  1: { label: "Learning", color: "bg-blue-500" },
  2: { label: "Familiar", color: "bg-amber-500" },
  3: { label: "Memorized", color: "bg-green-500" },
  4: { label: "Mastered", color: "bg-purple-500" },
};

export function PersonalMemoryVerses({ churchId }: PersonalMemoryVersesProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<MemoryList[]>([]);
  const [selectedList, setSelectedList] = useState<MemoryList | null>(null);
  const [verses, setVerses] = useState<MemoryVerseItem[]>([]);
  const [mastery, setMastery] = useState<Record<string, MasteryRecord>>({});
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [showVerseText, setShowVerseText] = useState(false);

  useEffect(() => {
    if (user) fetchLists();
  }, [user]);

  const fetchLists = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("memory_verse_lists")
        .select("id, title, description, target_verse_count, bible_version, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLists(data || []);
    } catch (err) {
      console.error("Error fetching lists:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerses = async (listId: string) => {
    try {
      const { data, error } = await supabase
        .from("memory_verse_list_items")
        .select("id, list_id, verse_reference, verse_text, order_index, pt_insights")
        .eq("list_id", listId)
        .order("order_index");

      if (error) throw error;
      setVerses(data || []);

      // Fetch mastery records
      const { data: masteryData } = await supabase
        .from("memory_verse_mastery")
        .select("verse_reference, mastery_level, times_practiced, last_practiced_at")
        .eq("user_id", user!.id)
        .eq("list_id", listId);

      const masteryMap: Record<string, MasteryRecord> = {};
      (masteryData || []).forEach((m: any) => {
        masteryMap[m.verse_reference] = m;
      });
      setMastery(masteryMap);
    } catch (err) {
      console.error("Error fetching verses:", err);
    }
  };

  const handleSelectList = (list: MemoryList) => {
    setSelectedList(list);
    fetchVerses(list.id);
    setPracticeMode(false);
  };

  const handleCreateList = async () => {
    if (!user || !newListTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from("memory_verse_lists")
        .insert({
          user_id: user.id,
          title: newListTitle.trim(),
          description: newListDescription.trim() || null,
          bible_version: "kjv",
          target_verse_count: 10,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Memory verse list created!");
      setShowCreateDialog(false);
      setNewListTitle("");
      setNewListDescription("");
      fetchLists();

      if (data) {
        handleSelectList(data as MemoryList);
      }
    } catch (err) {
      console.error("Error creating list:", err);
      toast.error("Failed to create list");
    }
  };

  const handleAddVerse = async (verse: { reference: string; text: string }) => {
    if (!selectedList || !user) return;

    try {
      const { error } = await supabase
        .from("memory_verse_list_items")
        .insert({
          list_id: selectedList.id,
          verse_reference: verse.reference,
          verse_text: verse.text,
          order_index: verses.length,
        });

      if (error) throw error;

      toast.success(`${verse.reference} added!`);
      fetchVerses(selectedList.id);

      // Generate PT analysis in background
      supabase.functions
        .invoke("analyze-verse-pt", {
          body: { verse_reference: verse.reference, verse_text: verse.text },
        })
        .then(({ data }) => {
          if (data) {
            fetchVerses(selectedList.id);
          }
        })
        .catch(() => {});
    } catch (err) {
      console.error("Error adding verse:", err);
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
      if (selectedList) fetchVerses(selectedList.id);
    } catch (err) {
      toast.error("Failed to remove verse");
    }
  };

  const handlePractice = (verseRef: string) => {
    if (!selectedList || !user) return;

    const current = mastery[verseRef];
    const newLevel = Math.min((current?.mastery_level || 0) + 1, 4);

    const data = {
      user_id: user.id,
      list_id: selectedList.id,
      verse_reference: verseRef,
      mastery_level: newLevel,
      times_practiced: (current?.times_practiced || 0) + 1,
      last_practiced_at: new Date().toISOString(),
    };

    if (current) {
      supabase
        .from("memory_verse_mastery")
        .update(data)
        .eq("user_id", user.id)
        .eq("list_id", selectedList.id)
        .eq("verse_reference", verseRef)
        .then(() => {
          if (selectedList) fetchVerses(selectedList.id);
        });
    } else {
      supabase
        .from("memory_verse_mastery")
        .insert(data)
        .then(() => {
          if (selectedList) fetchVerses(selectedList.id);
        });
    }

    const levelInfo = MASTERY_LABELS[newLevel];
    toast.success(`${verseRef}: ${levelInfo.label}!`);
  };

  const getMasteryInfo = (verseRef: string) => {
    const level = mastery[verseRef]?.mastery_level || 0;
    return MASTERY_LABELS[level] || MASTERY_LABELS[0];
  };

  const overallProgress = () => {
    if (verses.length === 0) return 0;
    const totalMastery = verses.reduce((sum, v) => {
      return sum + (mastery[v.verse_reference]?.mastery_level || 0);
    }, 0);
    return Math.round((totalMastery / (verses.length * 4)) * 100);
  };

  // Practice mode
  if (practiceMode && selectedList && verses.length > 0) {
    const currentVerse = verses[practiceIndex];
    const masteryInfo = getMasteryInfo(currentVerse.verse_reference);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setPracticeMode(false)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <span className="text-sm text-muted-foreground">
            {practiceIndex + 1} / {verses.length}
          </span>
        </div>

        <Card variant="glass" className="text-center">
          <CardContent className="py-12 space-y-6">
            <Badge className={`${masteryInfo.color} text-white`}>
              {masteryInfo.label}
            </Badge>
            <h3 className="text-xl font-bold text-primary">
              {currentVerse.verse_reference}
            </h3>

            {showVerseText ? (
              <blockquote className="text-lg italic text-foreground/80 max-w-lg mx-auto border-l-4 border-primary/50 pl-4">
                {currentVerse.verse_text}
              </blockquote>
            ) : (
              <div className="py-8">
                <p className="text-muted-foreground">
                  Try to recite from memory, then reveal to check
                </p>
              </div>
            )}

            <div className="flex justify-center gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setShowVerseText(!showVerseText)}
              >
                {showVerseText ? (
                  <><EyeOff className="h-4 w-4 mr-2" />Hide</>
                ) : (
                  <><Eye className="h-4 w-4 mr-2" />Reveal</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePractice(currentVerse.verse_reference)}
              >
                <Star className="h-4 w-4 mr-2" />
                I Know This
              </Button>
              <Button
                onClick={() => {
                  setShowVerseText(false);
                  if (practiceIndex < verses.length - 1) {
                    setPracticeIndex(practiceIndex + 1);
                  } else {
                    toast.success("Practice session complete!");
                    setPracticeMode(false);
                  }
                }}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Progress value={((practiceIndex + 1) / verses.length) * 100} className="h-2" />
      </div>
    );
  }

  // List detail view
  if (selectedList) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedList(null)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            My Lists
          </Button>
          <div className="flex gap-2">
            {verses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPracticeMode(true);
                  setPracticeIndex(0);
                  setShowVerseText(false);
                }}
              >
                <Brain className="h-4 w-4 mr-2" />
                Practice
              </Button>
            )}
            <Button size="sm" onClick={() => setShowSearchDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Verse
            </Button>
          </div>
        </div>

        <Card variant="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{selectedList.title}</CardTitle>
            {selectedList.description && (
              <CardDescription>{selectedList.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>{verses.length} verses</span>
              <span className="text-muted-foreground">{overallProgress()}% mastered</span>
            </div>
            <Progress value={overallProgress()} className="h-2" />
          </CardContent>
        </Card>

        <ScrollArea className="h-[400px] pr-2">
          <div className="space-y-2">
            {verses.length === 0 ? (
              <Card variant="glass">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No verses yet</p>
                  <Button size="sm" onClick={() => setShowSearchDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Verse
                  </Button>
                </CardContent>
              </Card>
            ) : (
              verses.map((verse) => {
                const masteryInfo = getMasteryInfo(verse.verse_reference);

                return (
                  <Card key={verse.id} variant="glass" className="group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-sm text-primary">
                              {verse.verse_reference}
                            </span>
                            <Badge
                              className={`${masteryInfo.color} text-white text-xs`}
                            >
                              {masteryInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/80 line-clamp-2">
                            {verse.verse_text}
                          </p>
                          {verse.pt_insights && (
                            <p className="text-xs text-primary/70 mt-1 line-clamp-1">
                              <Sparkles className="h-3 w-3 inline mr-1" />
                              {typeof verse.pt_insights === "string"
                                ? verse.pt_insights
                                : (verse.pt_insights as any)?.summary || "PT insights available"}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePractice(verse.verse_reference)}
                            title="Mark as practiced"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteVerse(verse.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>

        <MemoryVerseSearchDialog
          open={showSearchDialog}
          onOpenChange={setShowSearchDialog}
          onAddVerse={handleAddVerse}
        />
      </div>
    );
  }

  // Main view - list of user's memory verse lists
  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">My Memory Verses</h3>
        </div>
        <Button size="sm" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </div>

      {lists.length === 0 ? (
        <Card variant="glass">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">No memory verse lists yet</p>
            <p className="text-sm text-muted-foreground/70 mb-4 text-center max-w-sm">
              Create a list and add verses you want to memorize. Use AI-powered search to find the perfect verses.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First List
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {lists.map((list) => (
            <Card
              key={list.id}
              variant="glass"
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleSelectList(list)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm truncate">{list.title}</h4>
                    {list.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {list.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {list.bible_version?.toUpperCase() || "KJV"}
                      </Badge>
                      <span>
                        {new Date(list.created_at!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create List Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Memory Verse List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">List Name</label>
              <Input
                placeholder="e.g., Sanctuary Promises, Daniel Prophecies..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input
                placeholder="What is this list about?"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={!newListTitle.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
