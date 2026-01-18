import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Sparkles, Loader2, Copy, Check, ArrowRight, BookOpen, Target, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface IdeaStartersTabProps {
  onSelectIdea?: (option: SermonOption) => void;
}

export function IdeaStartersTab({ onSelectIdea }: IdeaStartersTabProps) {
  const [idea, setIdea] = useState("");
  const [context, setContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      toast.error("Please enter a sermon idea or title");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("sermon-idea-analyzer", {
        body: {
          idea: idea.trim(),
          context: context.trim() || undefined,
        },
      });

      if (error) throw error;

      if (data?.options) {
        setResult({
          originalIdea: idea,
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

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Share Your Sermon Idea
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-orange-200">Sermon Title or Idea</Label>
            <Input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., 'The Power of Forgiveness' or 'Why suffering?'"
              className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/40"
            />
            <p className="text-xs text-orange-200/60">
              Enter a title you already have in mind, a topic, or even just a question
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-orange-200">Additional Context (Optional)</Label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., 'For a youth group dealing with peer pressure' or 'Easter sermon series'"
              className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/40 min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !idea.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
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

          {/* Quick idea prompts */}
          <div className="pt-4 border-t border-orange-500/20">
            <p className="text-xs text-orange-200/60 mb-2">Need inspiration? Try these:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "The prodigal son today",
                "Faith in uncertain times",
                "Daniel's courage",
                "Why does God allow pain?",
              ].map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => setIdea(prompt)}
                  className="text-xs bg-orange-500/10 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
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
                  <Lightbulb className="w-6 h-6 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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
                  <Lightbulb className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-orange-200">Share your sermon idea</p>
                <p className="text-orange-200/60 text-sm mt-1 max-w-xs">
                  Jeeves will analyze it and present multiple angles, passages, and approaches you can take
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
