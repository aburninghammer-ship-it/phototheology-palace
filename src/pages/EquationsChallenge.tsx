import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calculator, Trophy, Target, Clock, RefreshCw, Share2, Plus, Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { ChallengeShareButton } from "@/components/challenges/ChallengeShareButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Difficulty = "easy" | "intermediate" | "advanced" | "pro";

interface Equation {
  verse: string;
  equation: string;
  symbols: string[];
  difficulty: Difficulty;
  explanation: string;
}

interface PrincipleCode {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  floor_association: string | null;
}

export default function EquationsChallenge() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<"solve" | "create">("solve");
  const [jeevesLoading, setJeevesLoading] = useState(false);
  const [jeevesSolution, setJeevesSolution] = useState("");
  
  // Custom challenge creation state
  const [customTitle, setCustomTitle] = useState("");
  const [customVerse, setCustomVerse] = useState("");
  const [customEquation, setCustomEquation] = useState("");
  const [customExplanation, setCustomExplanation] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty>("easy");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareCode, setShareCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharingToCommunity, setSharingToCommunity] = useState(false);
  
  // Principle selection state
  const [availablePrinciples, setAvailablePrinciples] = useState<PrincipleCode[]>([]);
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [principlesLoading, setPrinciplesLoading] = useState(false);

  const difficultyInfo = {
    easy: { symbols: 3, color: "bg-green-500", description: "3 principles" },
    intermediate: { symbols: 6, color: "bg-yellow-500", description: "6 principles" },
    advanced: { symbols: 9, color: "bg-orange-500", description: "9 principles" },
    pro: { symbols: 12, color: "bg-red-500", description: "12 principles" }
  };

  // Load available principles on mount
  useEffect(() => {
    loadPrinciples();
    
    // Check if there's a shared challenge in the URL
    const challengeCode = searchParams.get('challenge');
    if (challengeCode) {
      loadSharedChallenge(challengeCode);
    }
  }, [searchParams]);

  const loadPrinciples = async () => {
    setPrinciplesLoading(true);
    try {
      const { data, error } = await supabase
        .from('equation_codes')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) {
        console.error("Error loading principles:", error);
        toast.error("Failed to load principles");
        setAvailablePrinciples([]);
      } else {
        setAvailablePrinciples(data || []);
      }
    } catch (error) {
      console.error("Error loading principles:", error);
      toast.error("Failed to load principles");
      setAvailablePrinciples([]);
    } finally {
      setPrinciplesLoading(false);
    }
  };

  const togglePrinciple = (code: string) => {
    setSelectedPrinciples(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const buildEquationFromPrinciples = () => {
    if (selectedPrinciples.length === 0) {
      toast.error("Please select at least one principle");
      return;
    }
    
    // Build equation with selected principles
    const equation = selectedPrinciples.join(" + ");
    setCustomEquation(equation);
    
    // Generate explanation paragraph with narrative flow
    const explanationParts: string[] = [];
    selectedPrinciples.forEach((code, index) => {
      const principle = availablePrinciples.find(p => p.code === code);
      if (principle) {
        if (index === 0) {
          explanationParts.push(`We begin with ${code} (${principle.name}), which ${principle.description.toLowerCase()}`);
        } else if (index === selectedPrinciples.length - 1) {
          explanationParts.push(`and finally ${code} (${principle.name}), ${principle.description.toLowerCase()}`);
        } else {
          explanationParts.push(`then ${code} (${principle.name}), ${principle.description.toLowerCase()}`);
        }
      }
    });
    
    const explanation = explanationParts.join(", ") + ". Together, these principles illuminate the verse by revealing Christ through multi-dimensional study—observing the text closely, discovering prophetic and typological connections, and situating the passage within the sanctuary pattern and redemptive cycles.";
    setCustomExplanation(explanation);
    
    toast.success(`Equation and explanation generated!`);
  };

  const generateEquation = async () => {
    setLoading(true);
    setShowResult(false);
    setUserAnswer("");

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "equations-challenge",
          difficulty: difficulty,
          symbolCount: difficultyInfo[difficulty].symbols
        }
      });

      if (error) throw error;

      setCurrentEquation(data);
    } catch (error) {
      console.error("Error generating equation:", error);
      toast.error("Failed to generate equation");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!currentEquation) return;

    // In a real implementation, this would validate the answer
    // For now, we'll just show the explanation
    setShowResult(true);
    setScore(score + 1);
  };

  const challengeJeeves = async () => {
    if (!currentEquation) return;
    
    setJeevesLoading(true);
    setJeevesSolution("");
    
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "solve-equation",
          equation: currentEquation.equation,
          verse: currentEquation.verse,
          symbols: currentEquation.symbols
        }
      });

      if (error) throw error;

      setJeevesSolution(data.solution);
      toast.success("Jeeves has solved the equation!");
    } catch (error) {
      console.error("Error getting Jeeves' solution:", error);
      toast.error("Failed to get Jeeves' solution");
    } finally {
      setJeevesLoading(false);
    }
  };

  const loadSharedChallenge = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('equation_challenges')
        .select('*')
        .eq('share_code', code)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setCurrentEquation({
          verse: data.verse,
          equation: data.equation,
          symbols: data.symbols,
          difficulty: data.difficulty as Difficulty,
          explanation: data.explanation
        });
        setMode("solve");
        toast.success("Loaded shared challenge!");
        
        // Increment solve count
        await supabase
          .from('equation_challenges')
          .update({ solve_count: (data.solve_count || 0) + 1 })
          .eq('id', data.id);
      }
    } catch (error) {
      console.error("Error loading shared challenge:", error);
      toast.error("Failed to load shared challenge");
    }
  };

  const createCustomChallenge = async () => {
    if (!customTitle || !customVerse || !customEquation || !customExplanation) {
      toast.error("Please fill in all fields (Title, Verse, Equation, and Explanation)");
      return;
    }

    if (!user) {
      toast.error("Please sign in to create challenges");
      return;
    }

    setLoading(true);
    try {
      // Generate share code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_challenge_share_code');
      
      if (codeError) throw codeError;
      
      const shareCode = codeData as string;
      
      // Extract principles from equation if none selected
      const principlesArray = selectedPrinciples.length > 0 
        ? selectedPrinciples 
        : customEquation.match(/[A-Z@][A-Z0-9\-_]+/g) || [];
      
      // Create challenge
      const { error: insertError } = await supabase
        .from('equation_challenges')
        .insert({
          created_by: user.id,
          title: customTitle,
          verse: customVerse,
          equation: customEquation,
          explanation: customExplanation,
          difficulty: customDifficulty,
          symbols: principlesArray,
          share_code: shareCode,
          is_public: true
        });
      
      if (insertError) throw insertError;
      
      const shareUrl = `${window.location.origin}/equations-challenge?challenge=${shareCode}`;
      setShareLink(shareUrl);
      setShareCode(shareCode);
      setShareDialogOpen(true);
      
      toast.success("Challenge created successfully!");
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast.error("Failed to create challenge");
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const resetCreateForm = () => {
    setCustomTitle("");
    setCustomVerse("");
    setCustomEquation("");
    setCustomExplanation("");
    setSelectedPrinciples([]);
    setCustomDifficulty("easy");
  };

  const shareEquationToCommunity = async () => {
    if (!user || !currentEquation) {
      toast.error("Please sign in to share");
      return;
    }

    setSharingToCommunity(true);
    try {
      // Get user's display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', user.id)
        .single();

      const displayName = profile?.display_name || profile?.username || 'A student';

      // Create community post
      const postTitle = `Help ${displayName} solve this Phototheology equation!`;
      const postContent = `**Verse:** ${currentEquation.verse}

**Equation Challenge:**
\`\`\`
${currentEquation.equation}
\`\`\`

**Symbols Used:**
${currentEquation.symbols.map(s => `• ${s}`).join('\n')}

Can you help solve this equation? Share your interpretation and insights!

*Difficulty: ${difficulty}*`;

      const { data: newPost, error: postError } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: postTitle,
          content: postContent,
          category: 'challenge'
        })
        .select()
        .single();

      if (postError) throw postError;

      // Get users who want equation challenge notifications (excluding the poster)
      const { data: interestedUsers } = await supabase
        .from('notification_preferences')
        .select('user_id')
        .eq('equation_challenges', true)
        .neq('user_id', user.id);

      // Create notifications for interested users
      if (interestedUsers && interestedUsers.length > 0) {
        const notifications = interestedUsers.map(u => ({
          user_id: u.user_id,
          type: 'equation_challenge',
          title: 'New Equation Challenge!',
          message: `${displayName} shared a new ${difficulty} equation challenge`,
          link: `/community`,
          metadata: {
            post_id: newPost?.id,
            difficulty: difficulty,
            equation: currentEquation.equation
          }
        }));

        await supabase.from('notifications').insert(notifications);
      }

      // Broadcast to all live users
      const liveChannel = supabase.channel('live-notifications');
      await liveChannel.send({
        type: 'broadcast',
        event: 'challenge-shared',
        payload: {
          type: 'challenge-shared',
          message: '🔔 New Challenge Alert!',
          challengeType: 'Equation Challenge',
          userName: displayName,
          link: '/community'
        }
      });

      toast.success("Equation shared to community! All online users notified.");
    } catch (error) {
      console.error("Error sharing to community:", error);
      toast.error("Failed to share to community");
    } finally {
      setSharingToCommunity(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Calculator className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">Equations Challenge</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Decode biblical equations using palace principles and symbols
          </p>
        </div>

        {/* Score Display */}
        <Card className="mb-6">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Score: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Difficulty: <span className="capitalize">{difficulty}</span>
              </span>
            </div>
          </CardContent>
        </Card>

          <Card className="mb-6">
          <CardHeader>
            <CardTitle>Principle Codes Reference</CardTitle>
            <CardDescription>Approved symbols used in Phototheology equations</CardDescription>
          </CardHeader>
          <CardContent>
            {principlesLoading ? (
              <div className="text-center py-8">Loading principles...</div>
            ) : (
              <div className="space-y-4">
                {[
                  { key: 'floor1', title: 'Floor 1 — Furnishing Rooms' },
                  { key: 'floor2', title: 'Floor 2 — Investigation Rooms' },
                  { key: 'floor3', title: 'Floor 3 — Freestyle Rooms' },
                  { key: 'floor4', title: 'Floor 4 — Next Level Rooms' },
                  { key: 'floor4_dimensions', title: 'Floor 4 — Dimensions' },
                  { key: 'floor4_genres', title: 'Floor 4 — Connect-6 Genres' },
                  { key: 'floor4_themes', title: 'Floor 4 — Theme Walls' },
                  { key: 'floor4_timezones', title: 'Floor 4 — Time Zones' },
                  { key: 'floor4_fruit', title: 'Floor 4 — Fruit of the Spirit' },
                  { key: 'floor5', title: 'Floor 5 — Vision Rooms' },
                  { key: 'floor5_sanctuary', title: 'Floor 5 — Sanctuary Furniture' },
                  { key: 'floor5_prophecy', title: 'Floor 5 — Prophecy Timelines' },
                  { key: 'floor5_angels', title: 'Floor 5 — Three Angels' },
                  { key: 'floor5_feasts', title: 'Floor 5 — Biblical Feasts' },
                  { key: 'floor6_heavens', title: 'Floor 6 — Three Heavens' },
                  { key: 'floor6_cycles', title: 'Floor 6 — Eight Cycles' },
                  { key: 'floor6', title: 'Floor 6 — Cycle Rooms' },
                  { key: 'floor7', title: 'Floor 7 — Spiritual & Emotional' }
                ].map(({ key, title }) => {
                  const categoryPrinciples = availablePrinciples.filter(p => p.category === key);
                  if (categoryPrinciples.length === 0) return null;
                  
                  return (
                    <div key={key}>
                      <h3 className="font-semibold mb-2 text-primary">{title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {categoryPrinciples.map((principle) => (
                          <Badge key={principle.id} variant="outline" className="justify-start text-xs">
                            {principle.code} - {principle.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1 text-sm">Example Equations:</h4>
                  <p className="text-sm text-muted-foreground font-mono mb-2">
                    FE-PA + SAN-ALT + SAN-ARK → CR + GR = DoL³/NE³
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    (Passover + Altar of Burnt Offering + Ark/Mercy Seat → Concentration on Christ + Grace = Third Heaven)
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">
                    @70w + @Mo → SAN-ALT + CR = @Re
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (70 Weeks + Mosaic Cycle → Altar + Concentration = Remnant)
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mode Tabs */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as "solve" | "create")} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="solve">
              <Calculator className="h-4 w-4 mr-2" />
              Solve Challenges
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solve" className="space-y-6">
            {/* Difficulty Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Difficulty</CardTitle>
                <CardDescription>Choose your challenge level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(Object.keys(difficultyInfo) as Difficulty[]).map((diff) => (
                    <Button
                      key={diff}
                      variant={difficulty === diff ? "default" : "outline"}
                      onClick={() => setDifficulty(diff)}
                      className="flex flex-col h-auto py-4"
                    >
                      <span className="capitalize font-bold">{diff}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {difficultyInfo[diff].description}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Equation Display */}
            {!currentEquation ? (
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-6">
                  Ready to solve an equation? Click below to start!
                </p>
                <Button onClick={generateEquation} disabled={loading} size="lg">
                  {loading ? "Generating..." : "Generate New Equation"}
                </Button>
                
                {/* Share to Community Button - Disabled State */}
                <Button
                  onClick={shareEquationToCommunity}
                  variant="outline"
                  className="w-full mt-4"
                  disabled={true}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share to Community - Get Help Solving This!
                </Button>
                <p className="text-xs text-muted-foreground">
                  Generate an equation first to share with the community
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Challenge</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateEquation}
                      disabled={loading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Badge className={difficultyInfo[difficulty].color}>
                      {difficulty}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
              {/* Verse Reference */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold text-lg mb-2">{currentEquation.verse}</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {currentEquation.equation}
                </p>
              </div>

              {/* Symbol Legend */}
              <div>
                <h3 className="font-semibold mb-3">Symbols in this equation:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {currentEquation.symbols.map((symbol, idx) => (
                    <Badge key={idx} variant="outline" className="justify-start">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Share to Community Button */}
              <Button
                onClick={shareEquationToCommunity}
                variant="outline"
                className="w-full"
                disabled={sharingToCommunity}
              >
                {sharingToCommunity ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share to Community - Get Help Solving This!
                  </>
                )}
              </Button>

              {/* Answer Input */}
              {!showResult && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Your interpretation:
                    </label>
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={checkAnswer} className="w-full" size="lg">
                      Submit Answer
                    </Button>
                    <Button 
                      onClick={challengeJeeves} 
                      variant="outline"
                      className="w-full" 
                      size="lg"
                      disabled={jeevesLoading}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {jeevesLoading ? "Asking Jeeves..." : "Challenge Jeeves"}
                    </Button>
                  </div>
                  
                  {/* Jeeves' Solution */}
                  {jeevesSolution && (
                    <Card className="border-primary bg-primary/5">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <h3 className="font-bold text-lg">Jeeves' Solution:</h3>
                        </div>
                        <p className="whitespace-pre-wrap">{jeevesSolution}</p>
                        
                        {/* Share Button */}
                        {currentEquation && (
                          <ChallengeShareButton
                            challengeEquation={currentEquation.equation}
                            challengeExplanation={currentEquation.explanation}
                            jeevesSolution={jeevesSolution}
                            verse={currentEquation.verse}
                          />
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

                {/* Result */}
                {showResult && (
                  <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="pt-6 space-y-4">
                      <h3 className="font-bold text-lg">Jeeves' Explanation:</h3>
                      <p className="whitespace-pre-wrap">{currentEquation.explanation}</p>
                      <Button onClick={generateEquation} className="w-full">
                        Next Equation
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Own Challenge</CardTitle>
                <CardDescription>
                  Build a custom equation challenge to share with others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Challenge Title */}
                <div>
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input
                    id="title"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g., The Gospel in Genesis 3:15"
                  />
                </div>

                {/* Difficulty Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Difficulty</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(Object.keys(difficultyInfo) as Difficulty[]).map((diff) => (
                      <Button
                        key={diff}
                        variant={customDifficulty === diff ? "default" : "outline"}
                        onClick={() => setCustomDifficulty(diff)}
                        className="flex flex-col h-auto py-3"
                      >
                        <span className="capitalize font-bold text-sm">{diff}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Principle Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Select Principles ({selectedPrinciples.length} selected)
                  </Label>
                  {principlesLoading ? (
                    <div className="text-center py-4">Loading principles...</div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto p-4 border rounded-lg">
                      {[
                        { key: 'floor1', title: 'Floor 1 — Furnishing' },
                        { key: 'floor2', title: 'Floor 2 — Investigation' },
                        { key: 'floor3', title: 'Floor 3 — Freestyle' },
                        { key: 'floor4', title: 'Floor 4 — Next Level' },
                        { key: 'floor4_dimensions', title: '↳ Dimensions' },
                        { key: 'floor4_genres', title: '↳ Connect-6 Genres' },
                        { key: 'floor4_themes', title: '↳ Theme Walls' },
                        { key: 'floor4_timezones', title: '↳ Time Zones' },
                        { key: 'floor4_fruit', title: '↳ Fruit of the Spirit' },
                        { key: 'floor5', title: 'Floor 5 — Vision' },
                        { key: 'floor5_sanctuary', title: '↳ Sanctuary Furniture' },
                        { key: 'floor5_prophecy', title: '↳ Prophecy Timelines' },
                        { key: 'floor5_angels', title: '↳ Three Angels' },
                        { key: 'floor5_feasts', title: '↳ Biblical Feasts' },
                        { key: 'floor6_heavens', title: 'Floor 6 — Three Heavens' },
                        { key: 'floor6_cycles', title: '↳ Eight Cycles' },
                        { key: 'floor6', title: '↳ Cycle Rooms' },
                        { key: 'floor7', title: 'Floor 7 — Spiritual' }
                      ].map(({ key, title }) => {
                        const categoryPrinciples = availablePrinciples.filter(p => p.category === key);
                        if (categoryPrinciples.length === 0) return null;
                        
                        return (
                          <div key={key} className="space-y-2">
                            <h3 className="font-semibold text-sm text-primary">{title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                              {categoryPrinciples.map((principle) => (
                                <div key={principle.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={principle.code}
                                    checked={selectedPrinciples.includes(principle.code)}
                                    onCheckedChange={() => togglePrinciple(principle.code)}
                                  />
                                  <Label
                                    htmlFor={principle.code}
                                    className="text-xs cursor-pointer"
                                  >
                                    {principle.code} - {principle.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Build Equation Helper */}
                {selectedPrinciples.length > 0 && (
                  <Button 
                    onClick={buildEquationFromPrinciples} 
                    variant="outline"
                    className="w-full"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Build Equation from Selected ({selectedPrinciples.length} principles)
                  </Button>
                )}
                
                <p className="text-sm text-muted-foreground text-center">
                  Select principles above to auto-build, or type your equation manually below
                </p>

                {/* Challenge Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="verse">Verse Reference</Label>
                    <Input
                      id="verse"
                      value={customVerse}
                      onChange={(e) => setCustomVerse(e.target.value)}
                      placeholder="e.g., John 3:16"
                    />
                  </div>

                  <div>
                    <Label htmlFor="equation">Equation</Label>
                    <Input
                      id="equation"
                      value={customEquation}
                      onChange={(e) => setCustomEquation(e.target.value)}
                      placeholder="e.g., CR + SAN-ALT = @Re"
                      className="font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="explanation">Explanation / Solution</Label>
                    <Textarea
                      id="explanation"
                      value={customExplanation}
                      onChange={(e) => setCustomExplanation(e.target.value)}
                      placeholder="Explain how the principles connect to the verse..."
                      className="min-h-32"
                    />
                  </div>
                </div>

                {/* Create Button */}
                <div className="flex gap-3">
                  <Button 
                    onClick={createCustomChallenge} 
                    className="flex-1"
                    size="lg"
                    disabled={loading}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {loading ? "Creating..." : "Create & Share Challenge"}
                  </Button>
                  <Button 
                    onClick={resetCreateForm}
                    variant="outline"
                    size="lg"
                  >
                    Reset
                  </Button>
                </div>

                {/* Share to Community Button */}
                {customEquation && customExplanation && (
                  <Button
                    onClick={async () => {
                      if (!user) {
                        toast.error("Please sign in to share");
                        return;
                      }

                      setSharingToCommunity(true);
                      try {
                        const { data: profile } = await supabase
                          .from('profiles')
                          .select('display_name, username')
                          .eq('id', user.id)
                          .single();

                        const displayName = profile?.display_name || profile?.username || 'A student';
                        const postTitle = `Help ${displayName} solve this Phototheology equation!`;
                        const postContent = `**Verse:** ${customVerse || 'Custom Challenge'}

**Equation Challenge:**
\`\`\`
${customEquation}
\`\`\`

**Explanation:**
${customExplanation}

Can you help solve this equation? Share your interpretation and insights!

*Difficulty: ${customDifficulty}*`;

                        const { error: postError } = await supabase
                          .from('community_posts')
                          .insert({
                            user_id: user.id,
                            title: postTitle,
                            content: postContent,
                            category: 'challenge'
                          });

                        if (postError) throw postError;
                        toast.success("Custom challenge shared to community!");
                      } catch (error) {
                        console.error("Error sharing to community:", error);
                        toast.error("Failed to share to community");
                      } finally {
                        setSharingToCommunity(false);
                      }
                    }}
                    variant="outline"
                    className="w-full"
                    disabled={sharingToCommunity}
                  >
                    {sharingToCommunity ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share to Community - Get Help Solving This!
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Challenge Created Successfully! 🎉</DialogTitle>
              <DialogDescription>
                Share this link with others to challenge them
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-semibold">Share Code:</p>
                <p className="text-2xl font-mono font-bold text-primary">{shareCode}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Input value={shareLink} readOnly className="flex-1 font-mono text-sm" />
                <Button onClick={copyShareLink} variant="outline" size="icon">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Anyone with this link can attempt your challenge. They don't need to solve it before you share!
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}