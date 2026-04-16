import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Swords, Trophy, Star, Zap, Target, Plus, X, Link2, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShareToProfileButton } from "@/components/social/ShareToProfileButton";

// ... keep existing code (interfaces)
interface FreestyleGameProps {
  roomId: string;
  roomName: string;
}

interface ChallengeData {
  objects: string[];
  hint: string;
}

interface EvaluationResult {
  score: number;
  breakdown: {
    christCenteredness: number;
    biblicalAccuracy: number;
    creativity: number;
    practicalApplication: number;
  };
  feedback: string;
  enhancement: string;
  relatedVerses: string[];
}

interface ChainLink {
  type: "jeeves" | "user";
  reference?: string;
  text?: string;
  spark?: string;
  sparkEmoji?: string;
  commentary?: string;
  userBuild?: string;
  chainNumber: number;
  chainStrength?: number;
  nextPrompt?: string;
}

export const FreestyleGame = ({ roomId, roomName }: FreestyleGameProps) => {
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<"play" | "challenge" | "chain">("play");
  
  // Play mode state
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Challenge Jeeves mode state
  const [userObjects, setUserObjects] = useState<string[]>([]);
  const [newObject, setNewObject] = useState("");
  const [jeevesResponse, setJeevesResponse] = useState("");
  const [isChallenging, setIsChallenging] = useState(false);

  // Build Chain state
  const [chainLinks, setChainLinks] = useState<ChainLink[]>([]);
  const [chainInput, setChainInput] = useState("");
  const [isChainLoading, setIsChainLoading] = useState(false);
  const [chainStarted, setChainStarted] = useState(false);

  // ... keep existing code (generateChallenge, submitFreestyle, addObject, removeObject, challengeJeeves, getScoreColor)
  const generateChallenge = async () => {
    setIsGenerating(true);
    setChallenge(null);
    setUserResponse("");
    setEvaluation(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("freestyle-game", {
        body: { mode: "generate_challenge" }
      });
      
      if (error) throw error;
      
      if (data.objects && data.hint) {
        setChallenge(data);
      } else {
        throw new Error("Invalid challenge format");
      }
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({
        title: "Error",
        description: "Failed to generate challenge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const submitFreestyle = async () => {
    if (!userResponse.trim() || !challenge) return;
    
    setIsEvaluating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("freestyle-game", {
        body: { 
          mode: "evaluate_freestyle",
          challengeObjects: challenge.objects,
          userResponse: userResponse.trim()
        }
      });
      
      if (error) throw error;
      
      if (data.score !== undefined) {
        setEvaluation(data);
        
        if (data.score >= 80) {
          toast({
            title: "🏆 Excellent Freestyle!",
            description: `You scored ${data.score}/100! Master-level connection!`
          });
        } else if (data.score >= 60) {
          toast({
            title: "⭐ Good Connection!",
            description: `You scored ${data.score}/100! Keep practicing!`
          });
        }
      }
    } catch (error) {
      console.error("Error evaluating freestyle:", error);
      toast({
        title: "Error",
        description: "Failed to evaluate your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const addObject = () => {
    if (newObject.trim() && userObjects.length < 10) {
      const newObjects = newObject.split(',').map(o => o.trim()).filter(o => o.length > 0);
      const remainingSlots = 10 - userObjects.length;
      const objectsToAdd = newObjects.slice(0, remainingSlots);
      
      if (objectsToAdd.length > 0) {
        setUserObjects([...userObjects, ...objectsToAdd]);
        setNewObject("");
      }
    }
  };

  const removeObject = (index: number) => {
    setUserObjects(userObjects.filter((_, i) => i !== index));
  };

  const challengeJeeves = async () => {
    if (userObjects.length < 2) {
      toast({
        title: "Add more objects",
        description: "Give Jeeves at least 2 objects to connect!",
        variant: "destructive"
      });
      return;
    }
    
    setIsChallenging(true);
    setJeevesResponse("");
    
    try {
      const { data, error } = await supabase.functions.invoke("freestyle-game", {
        body: { 
          mode: "challenge_jeeves",
          userObjects
        }
      });
      
      if (error) throw error;
      
      if (data.response) {
        setJeevesResponse(data.response);
      }
    } catch (error) {
      console.error("Error challenging Jeeves:", error);
      toast({
        title: "Error",
        description: "Jeeves couldn't complete the challenge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChallenging(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-orange-500";
  };

  // Build Chain functions
  const startChain = async () => {
    setIsChainLoading(true);
    setChainLinks([]);
    setChainStarted(true);

    try {
      const { data, error } = await supabase.functions.invoke("freestyle-game", {
        body: { mode: "chain_start" }
      });

      if (error) throw error;

      const link: ChainLink = {
        type: "jeeves",
        reference: data.reference,
        text: data.text,
        spark: data.spark,
        chainNumber: 1,
        nextPrompt: data.spark,
      };
      setChainLinks([link]);
    } catch (error) {
      console.error("Error starting chain:", error);
      toast({ title: "Error", description: "Failed to start chain. Try again.", variant: "destructive" });
      setChainStarted(false);
    } finally {
      setIsChainLoading(false);
    }
  };

  const submitChainBuild = async () => {
    if (!chainInput.trim()) return;
    setIsChainLoading(true);

    const userLink: ChainLink = {
      type: "user",
      userBuild: chainInput.trim(),
      chainNumber: chainLinks.length + 1,
    };
    const updatedLinks = [...chainLinks, userLink];
    setChainLinks(updatedLinks);
    setChainInput("");

    try {
      const { data, error } = await supabase.functions.invoke("freestyle-game", {
        body: {
          mode: "chain_respond",
          userBuild: chainInput.trim(),
          chainHistory: updatedLinks.map(l => ({
            type: l.type,
            reference: l.reference,
            text: l.text,
            userBuild: l.userBuild,
          })),
          chainNumber: updatedLinks.length + 1,
        }
      });

      if (error) throw error;

      const jeevesLink: ChainLink = {
        type: "jeeves",
        reference: data.nextReference,
        text: data.nextText,
        spark: data.spark,
        sparkEmoji: data.sparkEmoji,
        commentary: data.commentary,
        chainNumber: data.chainNumber || updatedLinks.length + 1,
        chainStrength: data.chainStrength,
        nextPrompt: data.nextPrompt,
      };
      setChainLinks(prev => [...prev, jeevesLink]);
    } catch (error) {
      console.error("Error in chain:", error);
      toast({ title: "Error", description: "Failed to continue chain. Try again.", variant: "destructive" });
    } finally {
      setIsChainLoading(false);
    }
  };

  const resetChain = () => {
    setChainLinks([]);
    setChainInput("");
    setChainStarted(false);
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">🎤 Freestyle Arena</CardTitle>
            <CardDescription>
              Connect everyday objects to spiritual truths—like a hip hop artist freestyling Scripture!
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "play" | "challenge" | "chain")}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="play" className="gap-2">
              <Target className="h-4 w-4" />
              Play
            </TabsTrigger>
            <TabsTrigger value="challenge" className="gap-2">
              <Swords className="h-4 w-4" />
              Challenge
            </TabsTrigger>
            <TabsTrigger value="chain" className="gap-2">
              <Link2 className="h-4 w-4" />
              Build Chain
            </TabsTrigger>
          </TabsList>

          {/* PLAY MODE */}
          <TabsContent value="play" className="space-y-4">
            {!challenge ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Ready to Freestyle?</h3>
                <p className="text-muted-foreground mb-6">
                  Jeeves will give you random objects. Your mission: connect them to Scripture!
                </p>
                <Button 
                  onClick={generateChallenge} 
                  disabled={isGenerating}
                  size="lg"
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Start Challenge
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                  <h4 className="font-semibold mb-3">🎲 Your Objects:</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {challenge.objects.map((obj, i) => (
                      <Badge key={i} variant="secondary" className="text-lg px-4 py-2 bg-background/80">
                        {obj}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">💡 Hint: {challenge.hint}</p>
                </div>

                {!evaluation ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Connect these objects to a spiritual truth... How do they point to Christ, reveal a biblical principle, or teach a life lesson?"
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      className="min-h-[150px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={submitFreestyle} disabled={!userResponse.trim() || isEvaluating} className="flex-1 gap-2">
                        {isEvaluating ? <><Loader2 className="h-4 w-4 animate-spin" />Evaluating...</> : <><Trophy className="h-4 w-4" />Submit Freestyle</>}
                      </Button>
                      <Button variant="outline" onClick={generateChallenge} disabled={isGenerating}>New Challenge</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-background/50 rounded-xl border">
                      <div className={`text-5xl font-black mb-2 ${getScoreColor(evaluation.score)}`}>{evaluation.score}/100</div>
                      <div className="text-muted-foreground">Your Freestyle Score</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Christ-Centeredness", value: evaluation.breakdown.christCenteredness, icon: "✝️" },
                        { label: "Biblical Accuracy", value: evaluation.breakdown.biblicalAccuracy, icon: "📖" },
                        { label: "Creativity", value: evaluation.breakdown.creativity, icon: "💡" },
                        { label: "Practical Application", value: evaluation.breakdown.practicalApplication, icon: "🎯" },
                      ].map((item) => (
                        <div key={item.label} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                          </div>
                          <Progress value={(item.value / 25) * 100} className="h-2" />
                          <div className="text-right text-xs mt-1 text-muted-foreground">{item.value}/25</div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                      <p className="text-sm">{evaluation.feedback}</p>
                      <p className="text-sm text-muted-foreground italic">💡 {evaluation.enhancement}</p>
                      {evaluation.relatedVerses?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {evaluation.relatedVerses.map((verse, i) => (
                            <Badge key={i} variant="outline">{verse}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <ShareToProfileButton
                        sharedContent={{
                          source_type: "freestyle_quote",
                          source_title: `Freestyle: ${challenge?.objects?.join(", ") || "Challenge"}`,
                          source_excerpt: userResponse.slice(0, 300),
                          verse_reference: evaluation.relatedVerses?.[0],
                          source_metadata: { score: evaluation.score, breakdown: evaluation.breakdown },
                        }}
                        className="flex-1"
                      />
                      <Button onClick={generateChallenge} className="flex-1 gap-2">
                        <Sparkles className="h-4 w-4" />Try Another Challenge
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* CHALLENGE JEEVES MODE */}
          <TabsContent value="challenge" className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20">
              <h4 className="font-semibold mb-2">⚔️ Challenge Jeeves!</h4>
              <p className="text-sm text-muted-foreground">
                Give Jeeves 2-10 random objects, places, events, or people and watch him create a master-level freestyle connection!
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter an object, place, event, or person..."
                  value={newObject}
                  onChange={(e) => setNewObject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addObject()}
                  disabled={userObjects.length >= 10}
                />
                <Button onClick={addObject} disabled={!newObject.trim() || userObjects.length >= 10} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {userObjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {userObjects.map((obj, i) => (
                    <Badge key={i} variant="secondary" className="text-base px-3 py-1.5 gap-2">
                      {obj}
                      <button onClick={() => removeObject(i)} className="hover:text-destructive transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <Button onClick={challengeJeeves} disabled={userObjects.length < 2 || isChallenging} className="w-full gap-2">
                {isChallenging ? <><Loader2 className="h-4 w-4 animate-spin" />Jeeves is freestyling...</> : <><Swords className="h-4 w-4" />Challenge Jeeves ({userObjects.length}/10 items)</>}
              </Button>
            </div>
            {jeevesResponse && (
              <div className="p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl border-2 border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 text-amber-500" />
                  <h4 className="font-bold">Jeeves' Master Freestyle:</h4>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {formatJeevesResponse(jeevesResponse)}
                </div>
                <Button variant="outline" onClick={() => { setUserObjects([]); setJeevesResponse(""); }} className="mt-4 w-full">
                  Try Again with New Objects
                </Button>
              </div>
            )}
          </TabsContent>

          {/* BUILD CHAIN MODE */}
          <TabsContent value="chain" className="space-y-4">
            {!chainStarted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-xl font-bold mb-2">Build Chain</h3>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                  Jeeves presents a Bible story or verse. You build a connection. Then Jeeves adds a spark and presents another text — and you keep building the chain!
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Each link strengthens the chain. How deep can you go?
                </p>
                <Button onClick={startChain} disabled={isChainLoading} size="lg" className="gap-2">
                  {isChainLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Starting...</> : <><Link2 className="h-5 w-5" />Start a Chain</>}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Chain strength indicator */}
                {chainLinks.some(l => l.chainStrength) && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-primary/10 rounded-lg border border-amber-500/20">
                    <span className="text-lg">⛓️</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">Chain Strength</span>
                        <span>{chainLinks.filter(l => l.chainStrength).slice(-1)[0]?.chainStrength}/10</span>
                      </div>
                      <Progress value={(chainLinks.filter(l => l.chainStrength).slice(-1)[0]?.chainStrength || 0) * 10} className="h-2" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.floor(chainLinks.length / 2)} links
                    </Badge>
                  </div>
                )}

                {/* Chain links */}
                <ScrollArea className="max-h-[400px] pr-2">
                  <div className="space-y-3">
                    {chainLinks.map((link, idx) => (
                      <div key={idx}>
                        {link.type === "jeeves" && (
                          <div className="space-y-2">
                            {/* Commentary on previous build */}
                            {link.commentary && (
                              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">{link.commentary}</p>
                              </div>
                            )}
                            {/* Spark */}
                            {link.spark && link.commentary && (
                              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                                <span className="text-lg">{link.sparkEmoji || "✨"}</span>
                                <div>
                                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-0.5">Jeeves' Spark</p>
                                  <p className="text-sm">{link.spark}</p>
                                </div>
                              </div>
                            )}
                            {/* New verse/story */}
                            <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default" className="text-xs">Link #{link.chainNumber}</Badge>
                                <span className="font-semibold text-sm">{link.reference}</span>
                              </div>
                              <p className="text-sm leading-relaxed mb-2">{link.text}</p>
                              {link.nextPrompt && (
                                <p className="text-sm text-primary font-medium flex items-center gap-1.5">
                                  <ArrowRight className="h-3.5 w-3.5" />
                                  {link.nextPrompt}
                                </p>
                              )}
                              {!link.commentary && link.spark && (
                                <p className="text-xs text-muted-foreground italic mt-2">💡 {link.spark}</p>
                              )}
                            </div>
                          </div>
                        )}
                        {link.type === "user" && (
                          <div className="p-3 bg-muted/50 rounded-lg border border-border/50 ml-6">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Your Build</p>
                            <p className="text-sm">{link.userBuild}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    {isChainLoading && (
                      <div className="flex items-center gap-2 justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Jeeves is forging the next link...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input area */}
                {!isChainLoading && chainLinks.length > 0 && chainLinks[chainLinks.length - 1].type === "jeeves" && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Build on this... What connections do you see? How does this link to what came before? Where does it point to Christ?"
                      value={chainInput}
                      onChange={(e) => setChainInput(e.target.value)}
                      className="min-h-[100px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submitChainBuild();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button onClick={submitChainBuild} disabled={!chainInput.trim()} className="flex-1 gap-2">
                        <Link2 className="h-4 w-4" />
                        Add to Chain
                      </Button>
                      <Button variant="outline" onClick={resetChain}>
                        New Chain
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
