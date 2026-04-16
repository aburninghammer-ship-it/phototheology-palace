import { useState, useEffect, useCallback } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { FLASHCARDS_TOUR } from "@/data/guidedTours";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Brain, Sparkles, Plus, Loader2, Trash2, Eye, ChevronLeft, ChevronRight, Play, RotateCcw } from "lucide-react";
import { flashcardSetSchema, aiPromptSchema } from "@/lib/validationSchemas";
import { sanitizeText } from "@/lib/sanitize";
import { BIBLE_TRANSLATIONS } from "@/services/bibleApi";
import { useGameSession } from "@/hooks/useGameSession";

interface FlashcardSet {
  id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  is_ai_generated: boolean;
  created_at: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  verse_reference: string | null;
}

// Game state for study mode persistence
interface FlashcardStudyState {
  setId: string;
  setTitle: string;
  studyCards: Flashcard[];
  currentCardIndex: number;
  showAnswer: boolean;
  selectedTranslation: string;
  cardsViewed: number;
}

export default function Flashcards() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mySets, setMySets] = useState<FlashcardSet[]>([]);
  const [publicSets, setPublicSets] = useState<FlashcardSet[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "public">("my");
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  // Initial state for study mode
  const initialStudyState: FlashcardStudyState = {
    setId: '',
    setTitle: '',
    studyCards: [],
    currentCardIndex: 0,
    showAnswer: false,
    selectedTranslation: 'kjv',
    cardsViewed: 0,
  };

  // Use game session for study mode persistence
  const {
    gameState: studyState,
    hasExistingSession,
    isLoading: sessionLoading,
    saveSession,
    startNewGame,
    resumeGame,
    completeGame,
    setGameState: setStudyState,
  } = useGameSession<FlashcardStudyState>({
    gameType: 'flashcard_study',
    initialState: initialStudyState,
    autoSaveInterval: 10000, // Save every 10 seconds
  });

  // Derived state
  const studyMode = studyState.studyCards.length > 0;
  const studyCards = studyState.studyCards;
  const currentCardIndex = studyState.currentCardIndex;
  const showAnswer = studyState.showAnswer;
  const selectedTranslation = studyState.selectedTranslation;

  const [newSet, setNewSet] = useState({
    title: "",
    description: "",
    is_public: false,
  });

  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    checkAuth();
    fetchSets();
  }, []);

  // Check for existing study session
  useEffect(() => {
    if (!sessionLoading && hasExistingSession && studyState.studyCards.length > 0) {
      setShowResumeDialog(true);
    }
  }, [sessionLoading, hasExistingSession, studyState.studyCards.length]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
  };

  // Handle resume study session
  const handleResumeStudy = useCallback(() => {
    resumeGame();
    setShowResumeDialog(false);
    toast.success(t('flashcards.welcomeBack'));
  }, [resumeGame]);

  // Handle start new study
  const handleStartNewStudy = useCallback(async () => {
    await startNewGame();
    setShowResumeDialog(false);
  }, [startNewGame]);

  const fetchSets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: myData, error: myError } = await supabase
        .from("flashcard_sets")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (myError) throw myError;
      setMySets(myData || []);

      const { data: publicData, error: publicError } = await supabase
        .from("flashcard_sets")
        .select("*")
        .eq("is_public", true)
        .neq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (publicError) throw publicError;
      setPublicSets(publicData || []);
    } catch (error) {
      console.error("Error fetching sets:", error);
      toast.error(t('flashcards.failedToLoadSets'));
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async () => {
    try {
      // Validate AI prompt
      const validatedPrompt = aiPromptSchema.parse(aiPrompt);
      const sanitizedPrompt = sanitizeText(validatedPrompt);

      setGenerating(true);
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "generate-flashcards",
          topic: sanitizedPrompt,
        },
      });

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create the set
      const { data: setData, error: setError } = await supabase
        .from("flashcard_sets")
        .insert({
          user_id: user.id,
          title: `${aiPrompt} - AI Generated`,
          description: `AI-generated flashcards about ${aiPrompt}`,
          is_ai_generated: true,
          is_public: false,
        })
        .select()
        .single();

      if (setError) throw setError;

      // Parse and insert flashcards
      const flashcards = data.flashcards || [];
      const cardsToInsert = flashcards.map((card: any, idx: number) => ({
        set_id: setData.id,
        question: card.question,
        answer: card.answer,
        verse_reference: card.verse_reference || null,
        order_index: idx,
      }));

      const { error: cardsError } = await supabase
        .from("flashcards")
        .insert(cardsToInsert);

      if (cardsError) throw cardsError;

      toast.success(t('flashcards.setGenerated'));
      setAiPrompt("");
      fetchSets();
    } catch (error: any) {
      console.error("Error generating flashcards:", error);
      if (error.name === 'ZodError') {
        toast.error(error.errors[0]?.message || "Invalid input");
      } else {
        toast.error(t('flashcards.failedToGenerate'));
      }
    } finally {
      setGenerating(false);
    }
  };

  const createCustomSet = async () => {
    try {
      // Validate input
      const validatedData = flashcardSetSchema.parse({
        title: newSet.title,
        description: newSet.description || undefined
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Sanitize inputs
      const sanitizedTitle = sanitizeText(validatedData.title);
      const sanitizedDescription = validatedData.description 
        ? sanitizeText(validatedData.description) 
        : null;

      const { error } = await supabase.from("flashcard_sets").insert({
        user_id: user.id,
        title: sanitizedTitle,
        description: sanitizedDescription,
        is_public: newSet.is_public,
        is_ai_generated: false,
      });

      if (error) throw error;

      toast.success(t('flashcards.customSetCreated'));
      setNewSet({ title: "", description: "", is_public: false });
      
      // Refresh both tabs to show the new set
      await fetchSets();
      
      // Switch to "my" tab if on public tab
      if (activeTab === "public") {
        setActiveTab("my");
      }
    } catch (error: any) {
      console.error("Error creating set:", error);
      if (error.name === 'ZodError') {
        toast.error(error.errors[0]?.message || "Invalid input");
      } else {
        toast.error(t('flashcards.failedToCreateSet'));
      }
    }
  };

  const deleteSet = async (id: string) => {
    try {
      const { error } = await supabase
        .from("flashcard_sets")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success(t('flashcards.setDeleted'));
      fetchSets();
    } catch (error) {
      console.error("Error deleting set:", error);
      toast.error(t('flashcards.failedToDeleteSet'));
    }
  };

  const startStudying = async (setId: string, setTitle?: string) => {
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("set_id", setId)
        .order("order_index");

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error(t('flashcards.noFlashcardsInSet'));
        return;
      }

      // Start new game session with the study data
      await startNewGame();
      setStudyState({
        setId,
        setTitle: setTitle || 'Flashcards',
        studyCards: data,
        currentCardIndex: 0,
        showAnswer: false,
        selectedTranslation: 'kjv',
        cardsViewed: 0,
      });
    } catch (error) {
      console.error("Error loading flashcards:", error);
      toast.error(t('flashcards.failedToLoadFlashcards'));
    }
  };

  const exitStudyMode = async () => {
    // Complete the session when exiting
    await completeGame(studyState.cardsViewed);
    setStudyState(initialStudyState);
  };

  const nextCard = () => {
    const newIndex = Math.min(currentCardIndex + 1, studyCards.length - 1);
    const newCardsViewed = Math.max(studyState.cardsViewed, newIndex + 1);
    setStudyState(prev => ({
      ...prev,
      showAnswer: false,
      currentCardIndex: newIndex,
      cardsViewed: newCardsViewed,
    }));
    saveSession({ currentCardIndex: newIndex, showAnswer: false, cardsViewed: newCardsViewed });
  };

  const prevCard = () => {
    const newIndex = Math.max(currentCardIndex - 1, 0);
    setStudyState(prev => ({
      ...prev,
      showAnswer: false,
      currentCardIndex: newIndex,
    }));
    saveSession({ currentCardIndex: newIndex, showAnswer: false });
  };

  const toggleAnswer = () => {
    setStudyState(prev => ({
      ...prev,
      showAnswer: !prev.showAnswer,
    }));
  };

  const updateTranslation = (value: string) => {
    setStudyState(prev => ({
      ...prev,
      selectedTranslation: value,
    }));
    saveSession({ selectedTranslation: value });
  };

  // Resume dialog for existing session
  if (showResumeDialog && hasExistingSession && studyState.studyCards.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-6">
        <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
          <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                {t('flashcards.resumeStudy')}
              </DialogTitle>
              <DialogDescription>
                You have an ongoing study session for "{studyState.setTitle}".
                <div className="mt-3 p-3 bg-accent/10 rounded-lg space-y-1 text-sm">
                  <p><strong>{t('flashcards.progress')}:</strong> {t('flashcards.cardOf', { current: studyState.currentCardIndex + 1, total: studyState.studyCards.length })}</p>
                  <p><strong>{t('flashcards.cardsViewed')}:</strong> {studyState.cardsViewed}</p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleStartNewStudy} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                {t('flashcards.startFresh')}
              </Button>
              <Button onClick={handleResumeStudy} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                {t('flashcards.resume')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (studyMode) {
    const currentCard = studyCards[currentCardIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={exitStudyMode}
              variant="outline"
              className="bg-white/20 text-white border-white/40"
            >
              {t('flashcards.exitStudyMode')}
            </Button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-white">{t('flashcards.bibleVersion')}:</label>
              <Select value={selectedTranslation} onValueChange={updateTranslation}>
                <SelectTrigger className="w-[140px] bg-white/20 text-white border-white/40">
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
          </div>

          <div className="text-center text-white/70 text-sm mb-2">
            {t('flashcards.autoSaved')}
          </div>

          <Card className="bg-white/95 backdrop-blur-sm min-h-[400px] flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {t('flashcards.cardOf', { current: currentCardIndex + 1, total: studyCards.length })}
                </CardTitle>
                {currentCard?.verse_reference && (
                  <span className="text-sm text-purple-600 font-medium">{currentCard.verse_reference}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="text-center space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t('flashcards.question')}:</p>
                  <p className="text-2xl font-medium text-foreground">{currentCard?.question}</p>
                </div>

                {showAnswer && (
                  <div className="pt-6 border-t animate-in fade-in">
                    <p className="text-sm text-muted-foreground mb-2">{t('flashcards.answer')}:</p>
                    <p className="text-lg text-foreground">{currentCard?.answer}</p>
                  </div>
                )}

                <Button
                  onClick={toggleAnswer}
                  className="w-full"
                  size="lg"
                >
                  {showAnswer ? t('flashcards.hideAnswer') : t('flashcards.showAnswer')}
                </Button>
              </div>
            </CardContent>
            <div className="p-6 border-t flex gap-2">
              <Button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                variant="outline"
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t('common.previous')}
              </Button>
              <Button
                onClick={nextCard}
                disabled={currentCardIndex === studyCards.length - 1}
                className="flex-1"
              >
                {t('common.next')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {tourOpen && <GuidedTourOverlay steps={FLASHCARDS_TOUR} onClose={() => setTourOpen(false)} />}
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border-b border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Brain className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-4xl font-bold text-white">{t('flashcards.title')}</h1>
              <p className="text-purple-200 text-lg">{t('flashcards.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Sparkles className="mr-2 h-5 w-5" />
                {t('flashcards.generateWithAI')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>{t('flashcards.generateWithAITitle')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder={t('flashcards.topicPlaceholder')}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <Button onClick={generateWithAI} disabled={generating} className="w-full">
                  {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {t('flashcards.generateFlashcards')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="bg-white/90 text-foreground">
                <Plus className="mr-2 h-5 w-5" />
                {t('flashcards.createCustomSet')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>{t('flashcards.createCustomSetTitle')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('flashcards.setTitle')}</label>
                  <Input
                    placeholder={t('flashcards.setTitlePlaceholder')}
                    value={newSet.title}
                    onChange={(e) => setNewSet({ ...newSet, title: e.target.value })}
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('flashcards.descriptionOptional')}</label>
                  <Textarea
                    placeholder={t('flashcards.descriptionPlaceholder')}
                    value={newSet.description}
                    onChange={(e) => setNewSet({ ...newSet, description: e.target.value })}
                    rows={2}
                    maxLength={500}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{t('flashcards.makePublic')}</label>
                  <Switch
                    checked={newSet.is_public}
                    onCheckedChange={(checked) => setNewSet({ ...newSet, is_public: checked })}
                  />
                </div>
                <Button onClick={createCustomSet} className="w-full">
                  {t('flashcards.createSet')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "my" | "public")}>
          <TabsList className="bg-white/90">
            <TabsTrigger value="my">{t('flashcards.mySets')}</TabsTrigger>
            <TabsTrigger value="public">{t('flashcards.publicSets')}</TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : mySets.length === 0 ? (
              <div className="text-center py-16">
                <Brain className="w-24 h-24 mx-auto text-white/30 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">{t('flashcards.noSetsYet')}</h3>
                <p className="text-purple-200">{t('flashcards.noSetsYetDesc')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySets.map((set) => (
                  <Card key={set.id} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{set.title}</CardTitle>
                          {set.description && (
                            <CardDescription className="mt-1">{set.description}</CardDescription>
                          )}
                        </div>
                        {set.is_ai_generated && (
                          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button onClick={() => startStudying(set.id, set.title)} className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        {t('flashcards.study')}
                      </Button>
                      <Button onClick={() => deleteSet(set.id)} variant="outline" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('common.delete')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="public" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : publicSets.length === 0 ? (
              <div className="text-center py-16">
                <Brain className="w-24 h-24 mx-auto text-white/30 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">{t('flashcards.noPublicSets')}</h3>
                <p className="text-purple-200">{t('flashcards.noPublicSetsDesc')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicSets.map((set) => (
                  <Card key={set.id} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{set.title}</CardTitle>
                      {set.description && (
                        <CardDescription className="mt-1">{set.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => startStudying(set.id, set.title)} className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        {t('flashcards.study')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}