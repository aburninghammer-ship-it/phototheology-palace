import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calculator, Trophy, Target, Clock, RefreshCw, Share2, Plus, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
  const [customVerse, setCustomVerse] = useState("");
  const [customEquation, setCustomEquation] = useState("");
  const [customExplanation, setCustomExplanation] = useState("");
  const [shareLink, setShareLink] = useState("");
  
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
  }, []);

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
    toast.success(`Equation built with ${selectedPrinciples.length} principles`);
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

  const createCustomChallenge = async () => {
    if (!customVerse || !customEquation || !customExplanation) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const challengeId = `custom-${Date.now()}`;
      const shareUrl = `${window.location.origin}/equations-challenge?challenge=${challengeId}`;
      
      // Note: Custom challenge storage requires database migration
      // For now, just generate the share link
      setShareLink(shareUrl);
      toast.success("Challenge created! Share the link with others.");
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast.error("Failed to create challenge");
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!");
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
              <CardContent className="py-12 text-center">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-6">
                  Ready to solve an equation? Click below to start!
                </p>
                <Button onClick={generateEquation} disabled={loading} size="lg">
                  {loading ? "Generating..." : "Generate New Equation"}
                </Button>
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
                <CardTitle>Create Custom Challenge</CardTitle>
                <CardDescription>
                  Build your own equation challenge to share with others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Verse Reference
                  </label>
                  <Input
                    value={customVerse}
                    onChange={(e) => setCustomVerse(e.target.value)}
                    placeholder="e.g., John 3:16"
                  />
                </div>

                {/* Principle Selector */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Select Principles for Your Equation
                    </label>
                    <Badge variant="secondary">
                      {selectedPrinciples.length} selected
                    </Badge>
                  </div>
                  
                  {principlesLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading principles...
                    </div>
                  ) : (
                    <div className="max-h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4">
                      {Object.entries(
                        availablePrinciples.reduce((acc, principle) => {
                          if (!acc[principle.category]) {
                            acc[principle.category] = [];
                          }
                          acc[principle.category].push(principle);
                          return acc;
                        }, {} as Record<string, PrincipleCode[]>)
                      ).map(([category, principles]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary">
                            {category}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                            {principles.map((principle) => (
                              <div
                                key={principle.id}
                                className="flex items-start space-x-2 p-2 rounded hover:bg-muted/50 transition-colors"
                              >
                                <Checkbox
                                  id={principle.id}
                                  checked={selectedPrinciples.includes(principle.code)}
                                  onCheckedChange={() => togglePrinciple(principle.code)}
                                />
                                <div className="flex-1 min-w-0">
                                  <Label
                                    htmlFor={principle.id}
                                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                  >
                                    <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                      {principle.code}
                                    </code>
                                    <span className="truncate">{principle.name}</span>
                                  </Label>
                                  {principle.floor_association && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      Floor: {principle.floor_association}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {availablePrinciples.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No principles available yet
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Button
                    onClick={buildEquationFromPrinciples}
                    variant="outline"
                    className="w-full"
                    disabled={selectedPrinciples.length === 0}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Build Equation from Selected Principles
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Equation (or build using principles above)
                  </label>
                  <Input
                    value={customEquation}
                    onChange={(e) => setCustomEquation(e.target.value)}
                    placeholder="e.g., @70w + @CyC + PO → CR + ABO + MS = @Re + 3H"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Explanation
                  </label>
                  <Textarea
                    value={customExplanation}
                    onChange={(e) => setCustomExplanation(e.target.value)}
                    placeholder="Explain how the symbols connect to reveal Christ in this passage..."
                    rows={6}
                  />
                </div>

                <Button 
                  onClick={createCustomChallenge} 
                  className="w-full" 
                  size="lg"
                  disabled={!user}
                >
                  Create & Share Challenge
                </Button>

                {shareLink && (
                  <Card className="bg-primary/5 border-primary">
                    <CardContent className="pt-6 space-y-3">
                      <p className="font-semibold">Challenge Created!</p>
                      <div className="flex gap-2">
                        <Input value={shareLink} readOnly className="flex-1" />
                        <Button variant="outline" onClick={copyShareLink}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share this link with others to challenge them!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}