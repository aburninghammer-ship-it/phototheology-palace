import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Brain, Sparkles, Plus, Loader2, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function Flashcards() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mySets, setMySets] = useState<FlashcardSet[]>([]);
  const [publicSets, setPublicSets] = useState<FlashcardSet[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "public">("my");
  
  const [studyMode, setStudyMode] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

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

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

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
      toast.error("Failed to load flashcard sets");
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a topic for AI generation");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "generate-flashcards",
          topic: aiPrompt,
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

      toast.success("Flashcard set generated successfully!");
      setAiPrompt("");
      fetchSets();
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast.error("Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  const createCustomSet = async () => {
    if (!newSet.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("flashcard_sets").insert({
        user_id: user.id,
        title: newSet.title,
        description: newSet.description,
        is_public: newSet.is_public,
        is_ai_generated: false,
      });

      if (error) throw error;

      toast.success("Custom set created!");
      setNewSet({ title: "", description: "", is_public: false });
      fetchSets();
    } catch (error) {
      console.error("Error creating set:", error);
      toast.error("Failed to create set");
    }
  };

  const deleteSet = async (id: string) => {
    try {
      const { error } = await supabase
        .from("flashcard_sets")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Set deleted");
      fetchSets();
    } catch (error) {
      console.error("Error deleting set:", error);
      toast.error("Failed to delete set");
    }
  };

  const startStudying = async (setId: string) => {
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("set_id", setId)
        .order("order_index");

      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error("This set has no flashcards yet");
        return;
      }

      setStudyCards(data);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setStudyMode(true);
    } catch (error) {
      console.error("Error loading flashcards:", error);
      toast.error("Failed to load flashcards");
    }
  };

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => Math.min(prev + 1, studyCards.length - 1));
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
  };

  if (studyMode) {
    const currentCard = studyCards[currentCardIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <Button
            onClick={() => setStudyMode(false)}
            variant="outline"
            className="mb-4 bg-white/20 text-white border-white/40"
          >
            Exit Study Mode
          </Button>

          <Card className="bg-white/95 backdrop-blur-sm min-h-[400px] flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Card {currentCardIndex + 1} of {studyCards.length}
                </CardTitle>
                {currentCard.verse_reference && (
                  <span className="text-sm text-purple-600 font-medium">{currentCard.verse_reference}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="text-center space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Question:</p>
                  <p className="text-2xl font-medium text-foreground">{currentCard.question}</p>
                </div>

                {showAnswer && (
                  <div className="pt-6 border-t animate-in fade-in">
                    <p className="text-sm text-muted-foreground mb-2">Answer:</p>
                    <p className="text-lg text-foreground">{currentCard.answer}</p>
                  </div>
                )}

                <Button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="w-full"
                  size="lg"
                >
                  {showAnswer ? "Hide Answer" : "Show Answer"}
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
                Previous
              </Button>
              <Button
                onClick={nextCard}
                disabled={currentCardIndex === studyCards.length - 1}
                className="flex-1"
              >
                Next
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border-b border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Brain className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-4xl font-bold text-white">Flashcards</h1>
              <p className="text-purple-200 text-lg">Master Bible knowledge through interactive study cards</p>
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
                Generate with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Generate Flashcards with AI</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter a topic (e.g., 'Parables of Jesus', 'Books of the Bible', 'Ten Commandments')"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                />
                <Button onClick={generateWithAI} disabled={generating} className="w-full">
                  {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Flashcards
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="bg-white/90 text-foreground">
                <Plus className="mr-2 h-5 w-5" />
                Create Custom Set
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Create Custom Flashcard Set</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="e.g., My Favorite Verses"
                    value={newSet.title}
                    onChange={(e) => setNewSet({ ...newSet, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                  <Textarea
                    placeholder="What's this set about?"
                    value={newSet.description}
                    onChange={(e) => setNewSet({ ...newSet, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Make Public</label>
                  <Switch
                    checked={newSet.is_public}
                    onCheckedChange={(checked) => setNewSet({ ...newSet, is_public: checked })}
                  />
                </div>
                <Button onClick={createCustomSet} className="w-full">
                  Create Set
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "my" | "public")}>
          <TabsList className="bg-white/90">
            <TabsTrigger value="my">My Sets</TabsTrigger>
            <TabsTrigger value="public">Public Sets</TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : mySets.length === 0 ? (
              <div className="text-center py-16">
                <Brain className="w-24 h-24 mx-auto text-white/30 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No flashcard sets yet</h3>
                <p className="text-purple-200">Generate some with AI or create your own custom set</p>
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
                      <Button onClick={() => startStudying(set.id)} className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Study
                      </Button>
                      <Button onClick={() => deleteSet(set.id)} variant="outline" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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
                <h3 className="text-xl font-medium text-white mb-2">No public sets available</h3>
                <p className="text-purple-200">Check back later for community-created flashcards</p>
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
                      <Button onClick={() => startStudying(set.id)} className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Study
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