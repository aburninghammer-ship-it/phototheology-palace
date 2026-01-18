import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Sparkles, Loader2, ChevronRight, BookOpen, Heart, Users, Shield, Flame, Crown } from "lucide-react";
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

interface StarterIdea {
  id: string;
  category: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  prompt: string;
}

const STARTER_IDEAS: StarterIdea[] = [
  {
    id: "prodigal",
    category: "Classic Stories",
    icon: <Heart className="w-5 h-5" />,
    title: "The Prodigal Son for Today",
    description: "A fresh look at Luke 15 for modern audiences",
    prompt: "A sermon on the prodigal son story that connects with contemporary culture and speaks to both the lost and the religious",
  },
  {
    id: "faith-trials",
    category: "Life Challenges",
    icon: <Shield className="w-5 h-5" />,
    title: "Faith in Uncertain Times",
    description: "Encouraging hope when everything seems unstable",
    prompt: "A sermon about maintaining faith and hope during times of uncertainty, economic stress, or personal trials",
  },
  {
    id: "daniel-courage",
    category: "Character Studies",
    icon: <Crown className="w-5 h-5" />,
    title: "Daniel's Courage",
    description: "Standing firm in a culture that opposes faith",
    prompt: "A sermon on Daniel's courage in Babylon, focusing on how believers can maintain their identity in secular environments",
  },
  {
    id: "suffering",
    category: "Hard Questions",
    icon: <BookOpen className="w-5 h-5" />,
    title: "Why Does God Allow Pain?",
    description: "Addressing the age-old question with compassion",
    prompt: "A theodicy sermon that addresses suffering with biblical depth and pastoral sensitivity",
  },
  {
    id: "forgiveness",
    category: "Spiritual Growth",
    icon: <Heart className="w-5 h-5" />,
    title: "The Freedom of Forgiveness",
    description: "Breaking free from bitterness and resentment",
    prompt: "A sermon on biblical forgiveness that helps people release grudges and experience spiritual freedom",
  },
  {
    id: "identity",
    category: "Life Challenges",
    icon: <Users className="w-5 h-5" />,
    title: "Who Am I in Christ?",
    description: "Finding identity in a world of comparison",
    prompt: "A sermon on Christian identity that addresses social media comparison, self-worth, and finding value in Christ",
  },
  {
    id: "prayer",
    category: "Spiritual Growth",
    icon: <Flame className="w-5 h-5" />,
    title: "When Prayer Feels Empty",
    description: "Reviving a stagnant prayer life",
    prompt: "A sermon for believers whose prayer life feels dry, offering practical and theological encouragement",
  },
  {
    id: "genesis-joseph",
    category: "Character Studies",
    icon: <Crown className="w-5 h-5" />,
    title: "Joseph: From Pit to Palace",
    description: "God's providence through life's detours",
    prompt: "A sermon tracing Joseph's journey that shows how God works through disappointment, betrayal, and waiting",
  },
];

interface IdeaStartersTabProps {
  onSelectIdea?: (option: SermonOption) => void;
}

export function IdeaStartersTab({ onSelectIdea }: IdeaStartersTabProps) {
  const [selectedStarter, setSelectedStarter] = useState<StarterIdea | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ insights: string; options: SermonOption[] } | null>(null);

  const handleSelectStarter = async (starter: StarterIdea) => {
    setSelectedStarter(starter);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("sermon-idea-analyzer", {
        body: {
          idea: starter.prompt,
          context: `Category: ${starter.category}`,
        },
      });

      if (error) throw error;

      if (data?.options) {
        setResult({
          insights: data.insights || "",
          options: data.options,
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

  const handleBack = () => {
    setSelectedStarter(null);
    setResult(null);
  };

  const categories = [...new Set(STARTER_IDEAS.map(i => i.category))];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Starter Ideas Panel */}
      <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Sermon Starters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-200/70 text-sm mb-4">
            Need inspiration? Choose a topic and let Jeeves develop it for you.
          </p>
          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category}>
                  <h4 className="text-xs uppercase tracking-wider text-orange-300/60 mb-2">{category}</h4>
                  <div className="space-y-2">
                    {STARTER_IDEAS.filter(i => i.category === category).map((starter) => (
                      <motion.button
                        key={starter.id}
                        onClick={() => handleSelectStarter(starter)}
                        disabled={isAnalyzing}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          selectedStarter?.id === starter.id
                            ? "bg-orange-500/20 border-orange-400"
                            : "bg-black/20 border-orange-500/20 hover:bg-orange-500/10 hover:border-orange-500/40"
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                            {starter.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-white font-medium text-sm">{starter.title}</h5>
                            <p className="text-orange-200/60 text-xs mt-0.5">{starter.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-orange-400 shrink-0 mt-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            {selectedStarter ? selectedStarter.title : "Select a Starter"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
                  <Lightbulb className="w-6 h-6 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-orange-200 mt-4">Jeeves is developing this idea...</p>
                <p className="text-orange-200/60 text-sm mt-1">Finding passages, angles, and applications</p>
              </motion.div>
            ) : result && selectedStarter ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="mb-4 text-orange-200 hover:text-white hover:bg-orange-500/20"
                >
                  ← Back to starters
                </Button>

                {result.insights && (
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-amber-200 text-sm">{result.insights}</p>
                  </div>
                )}
                
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-4">
                    {result.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl"
                      >
                        <h4 className="text-lg font-bold text-white mb-2">{option.title}</h4>
                        <p className="text-orange-100 text-sm mb-3 italic">"{option.bigIdea}"</p>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-orange-200/60 text-xs">Key Passages: </span>
                            <span className="text-white">{option.keyPassages.join(", ")}</span>
                          </div>
                          <div>
                            <span className="text-orange-200/60 text-xs">Audience: </span>
                            <span className="text-white">{option.targetAudience}</span>
                          </div>
                          <div>
                            <span className="text-orange-200/60 text-xs block mb-1">Main Points:</span>
                            <ul className="text-white space-y-1 pl-4">
                              {option.mainPoints.map((point, i) => (
                                <li key={i} className="list-disc">{point}</li>
                              ))}
                            </ul>
                          </div>
                          {option.palaceAnchors && option.palaceAnchors.length > 0 && (
                            <div className="pt-2 border-t border-orange-500/20">
                              <span className="text-orange-200/60 text-xs">🏛️ Palace Anchors: </span>
                              <span className="text-white text-xs">{option.palaceAnchors.join(", ")}</span>
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
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-orange-200">Choose a sermon starter</p>
                <p className="text-orange-200/60 text-sm mt-1 max-w-xs">
                  Select from curated topics and Jeeves will develop multiple sermon options for you
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
