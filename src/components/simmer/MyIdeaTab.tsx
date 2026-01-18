import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenLine, Sparkles, Loader2, Copy, Check, ArrowRight, BookOpen, Target, Users, Save, History, Star, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/integrations/supabase/types";

interface SermonOption {
  title: string;
  bigIdea: string;
  keyPassages: string[];
  targetAudience: string;
  mainPoints: string[];
  palaceAnchors?: string[];
}

interface AnalysisResult {
  originalIdea: string;
  options: SermonOption[];
  insights: string;
}

interface SavedIdea {
  id: string;
  title: string | null;
  idea: string | null;
  context: string | null;
  analysis_result: AnalysisResult | null;
  is_favorite: boolean;
  created_at: string;
}

interface MyIdeaTabProps {
  onSelectIdea?: (option: SermonOption) => void;
}

export function MyIdeaTab({ onSelectIdea }: MyIdeaTabProps) {
  const { user } = useAuth();
  const [idea, setIdea] = useState("");
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState<string | null>(null);

  // Load saved ideas
  useEffect(() => {
    if (user) {
      loadSavedIdeas();
    }
  }, [user]);

  const loadSavedIdeas = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('sermon_ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading ideas:', error);
      return;
    }
    
    // Map the data to our SavedIdea type
    const mapped = data.map(item => ({
      ...item,
      analysis_result: item.analysis_result as unknown as AnalysisResult | null
    }));
    setSavedIdeas(mapped);
  };

  const saveIdea = async () => {
    if (!user) {
      toast.error("Please sign in to save ideas");
      return;
    }

    if (!idea.trim() && !title.trim()) {
      toast.error("Enter an idea or title to save");
      return;
    }

    setIsSaving(true);
    try {
      if (currentIdeaId) {
        // Update existing idea
        const { error } = await supabase
          .from('sermon_ideas')
          .update({
            title: title || null,
            idea: idea || null,
            context: context || null,
            analysis_result: result as unknown as Json,
          })
          .eq('id', currentIdeaId);

        if (error) throw error;
        toast.success("Idea updated!");
      } else {
        // Create new idea
        const { data, error } = await supabase
          .from('sermon_ideas')
          .insert([{
            user_id: user.id,
            title: title || null,
            idea: idea || null,
            context: context || null,
            analysis_result: result as unknown as Json,
          }])
          .select()
          .single();

        if (error) throw error;
        setCurrentIdeaId(data.id);
        toast.success("Idea saved!");
      }
      
      loadSavedIdeas();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error("Failed to save idea");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteIdea = async (ideaId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('sermon_ideas')
      .delete()
      .eq('id', ideaId);

    if (error) {
      toast.error("Failed to delete idea");
      return;
    }

    toast.success("Idea deleted");
    if (currentIdeaId === ideaId) {
      handleClear();
    }
    loadSavedIdeas();
  };

  const toggleFavorite = async (ideaId: string, currentFav: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from('sermon_ideas')
      .update({ is_favorite: !currentFav })
      .eq('id', ideaId);

    if (error) {
      toast.error("Failed to update");
      return;
    }

    loadSavedIdeas();
  };

  const loadIdea = (savedIdea: SavedIdea) => {
    setTitle(savedIdea.title || "");
    setIdea(savedIdea.idea || "");
    setContext(savedIdea.context || "");
    setResult(savedIdea.analysis_result);
    setCurrentIdeaId(savedIdea.id);
    setShowHistory(false);
  };

  const handleAnalyze = async () => {
    if (!idea.trim() && !title.trim()) {
      toast.error("Please enter a sermon idea or title");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const combinedIdea = title.trim() 
        ? `Title: "${title.trim()}"${idea.trim() ? ` - ${idea.trim()}` : ''}`
        : idea.trim();

      const { data, error } = await supabase.functions.invoke("sermon-idea-analyzer", {
        body: {
          idea: combinedIdea,
          context: context.trim() || undefined,
        },
      });

      if (error) throw error;

      if (data?.options) {
        setResult({
          originalIdea: combinedIdea,
          options: data.options,
          insights: data.insights || "",
        });
      } else {
        throw new Error("Invalid response from analyzer");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze idea");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyOption = (option: SermonOption, index: number) => {
    const text = `Title: ${option.title}\n\nBig Idea: ${option.bigIdea}\n\nKey Passages: ${option.keyPassages.join(", ")}\n\nMain Points:\n${option.mainPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setIdea("");
    setTitle("");
    setContext("");
    setResult(null);
    setCurrentIdeaId(null);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PenLine className="w-5 h-5 text-amber-400" />
            Your Sermon Idea
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-orange-200">Sermon Title (if you have one)</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 'The Power of Forgiveness'"
              className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/40"
            />
            <p className="text-xs text-orange-200/60">
              Already have a title in mind? Enter it here
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-orange-200">Your Idea or Theme</Label>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., 'I want to preach about how believers can find peace during difficult times' or 'The story of Joseph and how God uses our trials'"
              className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/40 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-orange-200">Audience or Context (Optional)</Label>
            <Input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., 'Youth group' or 'Easter sermon series'"
              className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/40"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!idea.trim() && !title.trim())}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Jeeves is Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze with Jeeves
                </>
              )}
            </Button>
            <Button
              onClick={saveIdea}
              disabled={isSaving || (!idea.trim() && !title.trim())}
              variant="outline"
              className="bg-black/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              className={`bg-black/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/20 ${showHistory ? 'bg-orange-500/20' : ''}`}
            >
              <History className="w-4 h-4" />
            </Button>
            {(idea || title || context) && (
              <Button
                variant="outline"
                onClick={handleClear}
                className="bg-black/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Saved Ideas History */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="border border-orange-500/30 rounded-lg bg-black/20 p-3 mt-2">
                  <h4 className="text-sm font-medium text-orange-200 mb-2">Saved Ideas</h4>
                  {savedIdeas.length === 0 ? (
                    <p className="text-xs text-orange-200/60">No saved ideas yet</p>
                  ) : (
                    <ScrollArea className="max-h-[150px]">
                      <div className="space-y-2">
                        {savedIdeas.map((saved) => (
                          <div
                            key={saved.id}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                              currentIdeaId === saved.id 
                                ? 'bg-orange-500/20 border border-orange-500/40' 
                                : 'hover:bg-orange-500/10'
                            }`}
                            onClick={() => loadIdea(saved)}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">
                                {saved.title || saved.idea?.substring(0, 40) || 'Untitled'}
                              </p>
                              <p className="text-xs text-orange-200/60">
                                {new Date(saved.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(saved.id, saved.is_favorite);
                                }}
                                className="h-6 w-6 text-orange-200 hover:text-amber-400"
                              >
                                <Star className={`w-3 h-3 ${saved.is_favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteIdea(saved.id);
                                }}
                                className="h-6 w-6 text-orange-200 hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Jeeves' Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
                  <PenLine className="w-6 h-6 text-amber-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-orange-200 mt-4">Jeeves is analyzing your idea...</p>
                <p className="text-orange-200/60 text-sm mt-1">Finding passages, angles, and applications</p>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {result.insights && (
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-amber-200 text-sm">{result.insights}</p>
                  </div>
                )}
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {result.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="text-lg font-bold text-white">{option.title}</h4>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopyOption(option, index)}
                              className="h-8 w-8 text-orange-200 hover:text-white hover:bg-orange-500/20"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            {onSelectIdea && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onSelectIdea(option)}
                                className="h-8 w-8 text-orange-200 hover:text-white hover:bg-orange-500/20"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <p className="text-orange-100 text-sm mb-3 italic">"{option.bigIdea}"</p>

                        <div className="grid gap-3 text-sm">
                          <div className="flex items-start gap-2">
                            <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-orange-200/60 text-xs block">Key Passages</span>
                              <span className="text-white">{option.keyPassages.join(", ")}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-orange-200/60 text-xs block">Target Audience</span>
                              <span className="text-white">{option.targetAudience}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-orange-200/60 text-xs block">Main Points</span>
                              <ul className="text-white space-y-1">
                                {option.mainPoints.map((point, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="text-orange-400">{i + 1}.</span> {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {option.palaceAnchors && option.palaceAnchors.length > 0 && (
                            <div className="flex items-start gap-2">
                              <span className="text-lg shrink-0">🏛️</span>
                              <div>
                                <span className="text-orange-200/60 text-xs block">Palace Anchors</span>
                                <span className="text-white">{option.palaceAnchors.join(", ")}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <PenLine className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-orange-200">Share your sermon idea</p>
                <p className="text-orange-200/60 text-sm mt-1 max-w-xs">
                  Enter your title or theme, and Jeeves will present multiple sermon options with passages and outlines
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
