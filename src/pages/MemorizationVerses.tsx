import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, BookOpen, Search, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BIBLE_BOOKS } from "@/types/bible";
import { fetchChapter } from "@/services/bibleApi";

interface MemorizationVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  verse_text: string;
  verse_reference: string;
  added_at: string;
  last_reviewed: string | null;
  review_count: number;
  mastery_level: number;
  notes: string | null;
}

const MemorizationVerses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [verses, setVerses] = useState<MemorizationVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Add verse form
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedVerse, setSelectedVerse] = useState("");
  const [verseText, setVerseText] = useState("");
  const [notes, setNotes] = useState("");
  const [fetchingVerse, setFetchingVerse] = useState(false);

  useEffect(() => {
    if (user) {
      loadVerses();
    }
  }, [user]);

  const loadVerses = async () => {
    try {
      const { data, error } = await supabase
        .from("memorization_verses")
        .select("*")
        .eq("user_id", user?.id)
        .order("added_at", { ascending: false });

      if (error) throw error;
      setVerses(data || []);
    } catch (error) {
      console.error("Error loading verses:", error);
      toast({
        title: "Error loading verses",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVerseFromAPI = async () => {
    if (!selectedBook || !selectedChapter || !selectedVerse) {
      toast({
        title: "Missing information",
        description: "Please select book, chapter, and verse",
        variant: "destructive",
      });
      return;
    }

    setFetchingVerse(true);
    try {
      // Default to KJV for Memory Verse Challenge
      const chapterData = await fetchChapter(selectedBook, parseInt(selectedChapter), 'kjv');
      const foundVerse = chapterData.verses.find(v => v.verse === parseInt(selectedVerse));
      
      if (foundVerse) {
        setVerseText(foundVerse.text);
      } else {
        toast({
          title: "Verse not found",
          description: "Could not find the specified verse",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching verse:", error);
      toast({
        title: "Error fetching verse",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setFetchingVerse(false);
    }
  };

  const addVerse = async () => {
    if (!user || !selectedBook || !selectedChapter || !selectedVerse || !verseText) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const reference = `${selectedBook} ${selectedChapter}:${selectedVerse}`;

    try {
      const { error } = await supabase
        .from("memorization_verses")
        .insert({
          user_id: user.id,
          book: selectedBook,
          chapter: parseInt(selectedChapter),
          verse: parseInt(selectedVerse),
          verse_text: verseText,
          verse_reference: reference,
          notes: notes || null,
        });

      if (error) throw error;

      toast({
        title: "Verse added!",
        description: `${reference} added to your memorization list`,
      });

      setIsAddDialogOpen(false);
      resetForm();
      loadVerses();
    } catch (error) {
      console.error("Error adding verse:", error);
      toast({
        title: "Error adding verse",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const deleteVerse = async (id: string) => {
    try {
      const { error } = await supabase
        .from("memorization_verses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Verse removed",
        description: "Verse removed from your memorization list",
      });

      loadVerses();
    } catch (error) {
      console.error("Error deleting verse:", error);
      toast({
        title: "Error removing verse",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedBook("");
    setSelectedChapter("");
    setSelectedVerse("");
    setVerseText("");
    setNotes("");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
              My Memorization Verses
            </h1>
            <p className="text-lg text-muted-foreground">
              Build your collection of verses to memorize and practice
            </p>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {verses.length} {verses.length === 1 ? 'verse' : 'verses'} saved
            </Badge>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-palace">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Verse
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Verse to Memorization List</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Book</Label>
                      <Select value={selectedBook} onValueChange={setSelectedBook}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select book" />
                        </SelectTrigger>
                        <SelectContent>
                          {BIBLE_BOOKS.map(book => (
                            <SelectItem key={book} value={book}>{book}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Chapter</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={selectedChapter}
                        onChange={(e) => setSelectedChapter(e.target.value)}
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Verse</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={selectedVerse}
                        onChange={(e) => setSelectedVerse(e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={fetchVerseFromAPI} 
                    variant="outline" 
                    className="w-full"
                    disabled={fetchingVerse}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {fetchingVerse ? "Fetching..." : "Fetch Verse Text"}
                  </Button>

                  <div className="space-y-2">
                    <Label>Verse Text</Label>
                    <Textarea
                      placeholder="Verse text will appear here..."
                      value={verseText}
                      onChange={(e) => setVerseText(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (optional)</Label>
                    <Textarea
                      placeholder="Add personal notes about this verse..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addVerse} className="gradient-palace">
                      Add to List
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading verses...</p>
            </Card>
          ) : verses.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No verses yet</p>
              <p className="text-muted-foreground mb-6">
                Start building your memorization collection by adding verses
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gradient-palace">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Verse
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {verses.map((verse) => (
                <Card key={verse.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-primary">
                          {verse.verse_reference}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">
                            <Star className="h-3 w-3 mr-1" />
                            Level {verse.mastery_level}
                          </Badge>
                          <Badge variant="secondary">
                            Reviewed {verse.review_count}x
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteVerse(verse.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed mb-3">
                      {verse.verse_text}
                    </p>
                    {verse.notes && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground italic">
                          {verse.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {verses.length >= 6 && (
            <Card className="mt-6 p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Ready to practice?</h3>
                  <p className="text-sm text-muted-foreground">
                    You have {verses.length} verses ready for the Verse Match game!
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/games/verse_match/custom')}
                  className="gradient-palace"
                >
                  Play Verse Match
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemorizationVerses;
