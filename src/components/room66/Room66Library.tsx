import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen, Search, ChevronRight, Library, Sparkles, Loader2,
  BookMarked, Grid3X3, Wand2, Save, Download
} from "lucide-react";
import { room66Library, searchRoom66Themes, getRoom66ThemesByDifficulty, BIBLE_BOOKS, type Room66Theme, type Book66Entry } from "@/data/room66Library";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Room66LibraryProps {
  onClose?: () => void;
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
  intermediate: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
  advanced: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"
};

const testamentColors = {
  OT: "bg-amber-500/10 border-amber-500/30",
  NT: "bg-blue-500/10 border-blue-500/30"
};

export function Room66Library({ onClose }: Room66LibraryProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"library" | "generate">("library");
  const [selectedTheme, setSelectedTheme] = useState<Room66Theme | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  // Generation state
  const [themeInput, setThemeInput] = useState("");
  const [verseInput, setVerseInput] = useState("");
  const [inputMode, setInputMode] = useState<"theme" | "verse">("theme");
  const [generating, setGenerating] = useState(false);
  const [generatedTheme, setGeneratedTheme] = useState<Room66Theme | null>(null);
  const [generateMode, setGenerateMode] = useState<"ai" | "manual">("ai");
  
  // Manual entry state
  const [manualThemeName, setManualThemeName] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualConstellation, setManualConstellation] = useState("");
  const [manualText, setManualText] = useState("");
  const [parsing, setParsing] = useState(false);

  const filteredThemes = searchQuery.length >= 2
    ? searchRoom66Themes(searchQuery)
    : difficultyFilter === "all"
      ? room66Library
      : getRoom66ThemesByDifficulty(difficultyFilter);

  const handleGenerate = async () => {
    const input = inputMode === "theme" ? themeInput.trim() : verseInput.trim();

    if (!input) {
      toast.error(inputMode === "theme" ? "Please enter a theme to track" : "Please enter a Bible verse");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("room-66-generate", {
        body: {
          theme: inputMode === "theme" ? input : undefined,
          verse: inputMode === "verse" ? input : undefined,
          inputMode,
          userId: user?.id
        }
      });

      if (error) throw error;

      if (data?.theme) {
        setGeneratedTheme(data.theme);
        toast.success("Theme generated! Review and save your analysis.");
      } else {
        throw new Error("No theme data returned");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate theme. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleManualParse = () => {
    if (!manualThemeName.trim() || !manualText.trim()) {
      toast.error("Please enter a theme name and your analysis text");
      return;
    }

    setParsing(true);
    try {
      // Parse the manual text - expecting format like "Genesis: claim here (Gen 1:1)"
      const lines = manualText.split('\n').filter(l => l.trim());
      const books: Book66Entry[] = [];
      
      for (const line of lines) {
        // Try to match patterns like "Genesis: The blood covenant begins (Gen 3:21)"
        const match = line.match(/^([^:]+):\s*(.+?)(?:\s*\(([^)]+)\))?$/);
        if (match) {
          const [, bookName, claim, proofText] = match;
          const cleanBook = bookName.trim();
          books.push({
            book: cleanBook,
            claim: claim.trim().slice(0, 100), // Limit claim length
            proofText: proofText?.trim() || `${cleanBook} 1:1`,
            ptTags: ["CR"] // Default tag
          });
        }
      }

      if (books.length === 0) {
        toast.error("Could not parse any books. Use format: 'Genesis: Your claim here (Gen 1:1)'");
        return;
      }

      // Create the theme object
      const manualTheme: Room66Theme = {
        id: `manual-${Date.now()}`,
        theme: manualThemeName.trim(),
        description: manualDescription.trim() || `A personal study tracing ${manualThemeName} through Scripture`,
        constellation: manualConstellation.trim() || `This theme of ${manualThemeName} weaves through Scripture from Genesis to Revelation, revealing God's consistent character and redemptive plan.`,
        difficulty: "intermediate",
        books: books
      };

      setGeneratedTheme(manualTheme);
      toast.success(`Parsed ${books.length} books! Review your analysis.`);
    } catch (error) {
      console.error("Parse error:", error);
      toast.error("Failed to parse text. Check the format.");
    } finally {
      setParsing(false);
    }
  };

  const exportTheme = (theme: Room66Theme) => {
    let markdown = `# Room 66: ${theme.theme}\n\n`;
    markdown += `**Description:** ${theme.description}\n\n`;
    markdown += `## Constellation\n${theme.constellation}\n\n`;
    markdown += `## 66-Book Grid\n\n`;
    markdown += `| Book | Claim | Proof Text | PT Tags |\n`;
    markdown += `|------|-------|------------|----------|\n`;

    theme.books.forEach(book => {
      markdown += `| ${book.book} | ${book.claim} | ${book.proofText} | ${book.ptTags.join(", ")} |\n`;
    });

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `room66-${theme.theme.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Theme exported to Markdown!");
  };

  // Theme detail view
  if (selectedTheme) {
    const otBooks = selectedTheme.books.slice(0, 39);
    const ntBooks = selectedTheme.books.slice(39);

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelectedTheme(null)}>
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
              Back to Library
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportTheme(selectedTheme)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 text-white">
              <Grid3X3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">{selectedTheme.theme}</CardTitle>
              <CardDescription>{selectedTheme.description}</CardDescription>
            </div>
          </div>
          <Badge className={`w-fit mt-2 ${difficultyColors[selectedTheme.difficulty]}`}>
            {selectedTheme.difficulty}
          </Badge>
        </CardHeader>

        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-6">
            {/* Constellation */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Constellation (OT→NT Synthesis)
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedTheme.constellation}
                </p>
              </CardContent>
            </Card>

            {/* 66-Book Grid */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-500" />
                66-Book Grid
              </h4>

              {/* Old Testament */}
              <div className={`rounded-lg p-4 mb-4 ${testamentColors.OT}`}>
                <h5 className="font-medium mb-3 text-amber-700 dark:text-amber-400">
                  Old Testament (39 Books)
                </h5>
                <div className="space-y-2">
                  {otBooks.map((book, idx) => (
                    <BookEntry key={idx} book={book} />
                  ))}
                </div>
              </div>

              {/* New Testament */}
              <div className={`rounded-lg p-4 ${testamentColors.NT}`}>
                <h5 className="font-medium mb-3 text-blue-700 dark:text-blue-400">
                  New Testament (27 Books)
                </h5>
                <div className="space-y-2">
                  {ntBooks.map((book, idx) => (
                    <BookEntry key={idx + 39} book={book} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  // Generated theme view
  if (generatedTheme) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setGeneratedTheme(null)}>
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportTheme(generatedTheme)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {generatedTheme.theme}
                <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30">
                  AI Generated
                </Badge>
              </CardTitle>
              <CardDescription>{generatedTheme.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-6">
            {/* Constellation */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Constellation (OT→NT Synthesis)
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {generatedTheme.constellation}
                </p>
              </CardContent>
            </Card>

            {/* 66-Book Grid */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-500" />
                66-Book Grid
              </h4>

              <div className={`rounded-lg p-4 mb-4 ${testamentColors.OT}`}>
                <h5 className="font-medium mb-3 text-amber-700 dark:text-amber-400">
                  Old Testament (39 Books)
                </h5>
                <div className="space-y-2">
                  {generatedTheme.books.slice(0, 39).map((book, idx) => (
                    <BookEntry key={idx} book={book} />
                  ))}
                </div>
              </div>

              <div className={`rounded-lg p-4 ${testamentColors.NT}`}>
                <h5 className="font-medium mb-3 text-blue-700 dark:text-blue-400">
                  New Testament (27 Books)
                </h5>
                <div className="space-y-2">
                  {generatedTheme.books.slice(39).map((book, idx) => (
                    <BookEntry key={idx + 39} book={book} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-red-500" />
              Room 66 Library
            </CardTitle>
            <CardDescription>
              Track themes through all 66 books of the Bible
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              Library ({room66Library.length})
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4 mt-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2 flex-wrap">
              {["all", "beginner", "intermediate", "advanced"].map((level) => (
                <Badge
                  key={level}
                  variant={difficultyFilter === level ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setDifficultyFilter(level)}
                >
                  {level === "all" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
                </Badge>
              ))}
            </div>

            {/* Theme List */}
            <ScrollArea className="h-[350px]">
              <div className="space-y-3 pr-4">
                {filteredThemes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No themes found</p>
                  </div>
                ) : (
                  filteredThemes.map((theme) => (
                    <Card
                      key={theme.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedTheme(theme)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Grid3X3 className="h-5 w-5 text-red-500" />
                            <h4 className="font-semibold">{theme.theme}</h4>
                          </div>
                          <Badge className={`text-xs ${difficultyColors[theme.difficulty]}`}>
                            {theme.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {theme.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span>66 books tracked</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4 mt-4">
            {/* Mode Toggle - Prominent */}
            <Card className="bg-muted/50 border-2">
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground mb-2 text-center">Choose your creation method:</p>
                <div className="flex gap-2">
                  <Button
                    variant={generateMode === "ai" ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 ${generateMode === "ai" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                    onClick={() => setGenerateMode("ai")}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI Generate
                  </Button>
                  <Button
                    variant={generateMode === "manual" ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 ${generateMode === "manual" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                    onClick={() => setGenerateMode("manual")}
                  >
                    <BookMarked className="h-4 w-4 mr-2" />
                    Write Your Own (Text)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {generateMode === "ai" ? (
              <>
                <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-purple-500" />
                      AI-Generated R66 Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {inputMode === "theme"
                        ? "Enter any biblical theme. Jeeves will trace it through all 66 books of the Bible."
                        : "Enter a Bible verse. Jeeves will extract the theme and trace it through all 66 books."
                      }
                    </p>

                    <div className="space-y-4">
                      {/* Input Mode Toggle */}
                      <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
                        <Button
                          variant={inputMode === "theme" ? "default" : "ghost"}
                          size="sm"
                          className={`flex-1 ${inputMode === "theme" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                          onClick={() => setInputMode("theme")}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Theme / Topic
                        </Button>
                        <Button
                          variant={inputMode === "verse" ? "default" : "ghost"}
                          size="sm"
                          className={`flex-1 ${inputMode === "verse" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                          onClick={() => setInputMode("verse")}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Bible Verse
                        </Button>
                      </div>

                      {inputMode === "theme" ? (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Theme / Topic / Idea
                          </label>
                          <Textarea
                            placeholder="E.g., 'The concept of grace', 'Fire imagery', 'God's faithfulness'..."
                            value={themeInput}
                            onChange={(e) => setThemeInput(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Bible Verse Reference
                          </label>
                          <Input
                            placeholder="E.g., 'John 3:16', 'Psalm 23:1', 'Romans 8:28'..."
                            value={verseInput}
                            onChange={(e) => setVerseInput(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Jeeves will read this verse, identify its central theme, and trace it through all 66 books.
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={handleGenerate}
                        disabled={generating || (inputMode === "theme" ? !themeInput.trim() : !verseInput.trim())}
                        className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                      >
                        {generating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating 66-Book Analysis...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate R66 Analysis
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick suggestions based on mode */}
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    {inputMode === "theme" ? "Quick Themes:" : "Popular Verses:"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {inputMode === "theme" ? (
                      ["Fire", "Bread", "Garden", "Covenant", "Exile", "Worship", "Angels", "Names of God"].map((theme) => (
                        <Badge
                          key={theme}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => setThemeInput(theme)}
                        >
                          {theme}
                        </Badge>
                      ))
                    ) : (
                      ["John 3:16", "Psalm 23:1", "Romans 8:28", "Jeremiah 29:11", "Philippians 4:13", "Isaiah 40:31", "Proverbs 3:5-6", "Matthew 6:33"].map((verse) => (
                        <Badge
                          key={verse}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => setVerseInput(verse)}
                        >
                          {verse}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BookMarked className="h-4 w-4 text-amber-500" />
                      Write Your Own R66 Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Paste or type your own theme analysis. Use the format below.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Theme Name *</label>
                    <Input
                      placeholder="E.g., 'The Shepherd Motif'"
                      value={manualThemeName}
                      onChange={(e) => setManualThemeName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Description (optional)</label>
                    <Input
                      placeholder="One sentence describing this theme..."
                      value={manualDescription}
                      onChange={(e) => setManualDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Constellation / Synthesis (optional)</label>
                    <Textarea
                      placeholder="How does this theme develop from OT to NT? (100-120 words)"
                      value={manualConstellation}
                      onChange={(e) => setManualConstellation(e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">66-Book Analysis *</label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Format: <code className="bg-muted px-1 rounded">Book: Your claim here (Verse reference)</code>
                    </p>
                    <Textarea
                      placeholder={`Genesis: God as shepherd provides for Adam (Gen 2:8)
Exodus: Moses shepherds Israel out of Egypt (Exod 3:1)
Leviticus: Offerings picture the Good Shepherd (Lev 1:10)
...continue for all 66 books...`}
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>

                  <Button
                    onClick={handleManualParse}
                    disabled={parsing || !manualThemeName.trim() || !manualText.trim()}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    {parsing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Parsing...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create R66 Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Book entry component
function BookEntry({ book }: { book: Book66Entry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-background/60 rounded-lg p-3 cursor-pointer hover:bg-background/80 transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-mono">
            {book.book}
          </Badge>
        </div>
        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
      </div>

      <p className="text-sm mt-1 line-clamp-2">
        {book.claim}
      </p>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          <div>
            <span className="text-xs text-muted-foreground">Proof Text:</span>
            <p className="text-sm font-medium text-primary">{book.proofText}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {book.ptTags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Room66Library;
