import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { fetchChapter, BIBLE_TRANSLATIONS, Translation } from "@/services/bibleApi";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [verses, setVerses] = useState<MemorizationVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Add verse form
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedVerse, setSelectedVerse] = useState("");
  const [selectedTranslation, setSelectedTranslation] = useState("kjv");
  const [verseText, setVerseText] = useState("");
  const [notes, setNotes] = useState("");
  const [fetchingVerse, setFetchingVerse] = useState(false);
  const [bookSearchOpen, setBookSearchOpen] = useState(false);
  const [showFirstLetterOnly, setShowFirstLetterOnly] = useState<{[key: string]: boolean}>({});
  const [reviewInterval, setReviewInterval] = useState<number>(7); // Default 7 days

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
        title: t('memory.memorization.errorLoadingVerses'),
        description: t('common.tryAgainLater'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVerseFromAPI = async () => {
    if (!selectedBook || !selectedChapter || !selectedVerse) {
      toast({
        title: t('memory.memorization.missingInfo'),
        description: t('memory.memorization.selectBookChapterVerse'),
        variant: "destructive",
      });
      return;
    }

    setFetchingVerse(true);
    try {
      const chapterData = await fetchChapter(
        selectedBook,
        parseInt(selectedChapter),
        selectedTranslation as Translation
      );
      const foundVerse = chapterData.verses.find(v => v.verse === parseInt(selectedVerse));

      if (foundVerse) {
        setVerseText(foundVerse.text);
      } else {
        toast({
          title: t('memory.memorization.verseNotFound'),
          description: t('memory.memorization.couldNotFindVerse'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching verse:", error);
      toast({
        title: t('memory.memorization.errorFetchingVerse'),
        description: t('common.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setFetchingVerse(false);
    }
  };

  const addVerse = async () => {
    if (!user || !selectedBook || !selectedChapter || !selectedVerse || !verseText) {
      toast({
        title: t('memory.memorization.missingInfo'),
        description: t('memory.memorization.fillRequiredFields'),
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
        title: t('memory.memorization.verseAdded'),
        description: t('memory.memorization.verseAddedDesc', { reference }),
      });

      setIsAddDialogOpen(false);
      resetForm();
      loadVerses();
    } catch (error) {
      console.error("Error adding verse:", error);
      toast({
        title: t('memory.memorization.errorAddingVerse'),
        description: t('common.tryAgain'),
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
        title: t('memory.memorization.verseRemovedTitle'),
        description: t('memory.memorization.verseRemovedDesc'),
      });

      loadVerses();
    } catch (error) {
      console.error("Error deleting verse:", error);
      toast({
        title: t('memory.memorization.errorRemovingVerse'),
        description: t('common.tryAgain'),
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

  const toggleFirstLetter = (verseId: string) => {
    setShowFirstLetterOnly(prev => ({
      ...prev,
      [verseId]: !prev[verseId]
    }));
  };

  const getFirstLetters = (text: string) => {
    return text.split(' ').map(word => word.charAt(0)).join(' ');
  };

  const updateReviewSchedule = async (verseId: string, intervalDays: number) => {
    try {
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + intervalDays);
      
      const { error } = await supabase
        .from("memorization_verses")
        .update({ 
          next_review_date: nextReview.toISOString(),
          review_interval_days: intervalDays
        } as any)
        .eq("id", verseId);

      if (error) throw error;
      
      toast({
        title: t('memory.memorization.scheduleUpdated'),
        description: t('memory.memorization.nextReviewIn', { days: intervalDays }),
      });

      loadVerses();
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast({
        title: t('common.error'),
        description: t('memory.memorization.failedToUpdateSchedule'),
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
              {t('memory.memorization.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('memory.memorization.subtitle')}
            </p>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {t('memory.memorization.versesSaved', { count: verses.length })}
            </Badge>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-palace">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('memory.memorization.addVerse')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('memory.memorization.addVerseDialogTitle')}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('memory.memorization.bibleTranslation')}</Label>
                    <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        {BIBLE_TRANSLATIONS.map((trans) => (
                          <SelectItem key={trans.value} value={trans.value}>
                            {trans.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{t('memory.memorization.book')}</Label>
                      <Popover open={bookSearchOpen} onOpenChange={setBookSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={bookSearchOpen}
                            className="w-full justify-between"
                          >
                            {selectedBook || t('memory.memorization.selectBook')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0 bg-card border-border z-50">
                          <Command>
                            <CommandInput placeholder={t('memory.memorization.searchBooks')} />
                            <CommandList>
                              <CommandEmpty>{t('memory.memorization.noBookFound')}</CommandEmpty>
                              <CommandGroup>
                                {BIBLE_BOOKS.map((book) => (
                                  <CommandItem
                                    key={book}
                                    value={book}
                                    onSelect={() => {
                                      setSelectedBook(book);
                                      setBookSearchOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedBook === book ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {book}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('memory.memorization.chapter')}</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={selectedChapter}
                        onChange={(e) => setSelectedChapter(e.target.value)}
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('memory.memorization.verse')}</Label>
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
                    {fetchingVerse ? t('memory.memorization.fetching') : t('memory.memorization.fetchVerseText')}
                  </Button>

                  <div className="space-y-2">
                    <Label>{t('memory.memorization.verseText')}</Label>
                    <Textarea
                      placeholder={t('memory.memorization.verseTextPlaceholder')}
                      value={verseText}
                      onChange={(e) => setVerseText(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('memory.memorization.notesOptional')}</Label>
                    <Textarea
                      placeholder={t('memory.memorization.notesPlaceholder')}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={addVerse} className="gradient-palace">
                      {t('memory.memorization.addToList')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">{t('memory.memorization.loadingVerses')}</p>
            </Card>
          ) : verses.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">{t('memory.memorization.noVersesYet')}</p>
              <p className="text-muted-foreground mb-6">
                {t('memory.memorization.startBuilding')}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gradient-palace">
                <Plus className="h-4 w-4 mr-2" />
                {t('memory.memorization.addFirstVerse')}
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
                            {t('memory.memorization.level', { level: verse.mastery_level })}
                          </Badge>
                          <Badge variant="secondary">
                            {t('memory.memorization.reviewed', { count: verse.review_count })}
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
                    <div className="mb-3">
                      <div className="flex gap-2 mb-2">
                        <Button
                          size="sm"
                          variant={showFirstLetterOnly[verse.id] ? "default" : "outline"}
                          onClick={() => toggleFirstLetter(verse.id)}
                          className="text-xs"
                        >
                          {showFirstLetterOnly[verse.id] ? t('memory.memorization.showFull') : t('memory.memorization.firstLetters')}
                        </Button>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {showFirstLetterOnly[verse.id] 
                          ? getFirstLetters(verse.verse_text)
                          : verse.verse_text
                        }
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <Label className="text-xs mb-1 block">{t('memory.memorization.reviewSchedule')}</Label>
                      <Select
                        value={reviewInterval.toString()}
                        onValueChange={(value) => {
                          const days = parseInt(value);
                          setReviewInterval(days);
                          updateReviewSchedule(verse.id, days);
                        }}
                      >
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder={t('memory.memorization.reviewFrequency')} />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border z-50">
                          <SelectItem value="1">{t('memory.memorization.daily')}</SelectItem>
                          <SelectItem value="3">{t('memory.memorization.every3Days')}</SelectItem>
                          <SelectItem value="7">{t('memory.memorization.weekly')}</SelectItem>
                          <SelectItem value="14">{t('memory.memorization.every2Weeks')}</SelectItem>
                          <SelectItem value="30">{t('memory.memorization.monthly')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
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
                  <h3 className="font-semibold mb-1">{t('memory.memorization.readyToPractice')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('memory.memorization.versesReadyForMatch', { count: verses.length })}
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/games/verse_match/custom')}
                  className="gradient-palace"
                >
                  {t('memory.memorization.playVerseMatch')}
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
