import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, ImageIcon, Check, X, RefreshCw, Sparkles, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { biblicalCharacterProfiles } from "@/data/biblicalCharacterProfiles";
import type { CharacterProfile } from "@/data/biblicalCharacterProfiles";
import { buildCharacterPortraitPrompt } from "@/utils/characterPortraitPrompt";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CachedCharacterImage {
  character_id: string;
  public_url: string;
  generated_at: string;
}

export function CharacterImageGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cachedImages, setCachedImages] = useState<Map<string, { url: string; generatedAt: Date }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{ id: string; name: string; success: boolean; error?: string }[]>([]);

  useEffect(() => {
    loadCachedImages();
  }, []);

  const loadCachedImages = async () => {
    setLoading(true);
    try {
      const cache = new Map<string, { url: string; generatedAt: Date }>();
      const pageSize = 1000;
      let from = 0;

      while (true) {
        const to = from + pageSize - 1;
        const { data, error } = await supabase
          .from("character_image_cache" as any)
          .select("character_id, public_url, generated_at")
          .order("character_id", { ascending: true })
          .range(from, to);

        if (error) throw error;

        const rows = ((data as unknown) as CachedCharacterImage[]) ?? [];
        rows.forEach((item) => {
          cache.set(item.character_id, {
            url: item.public_url,
            generatedAt: new Date(item.generated_at),
          });
        });

        if (rows.length < pageSize) break;
        from += pageSize;
      }

      setCachedImages(cache);
    } catch (err) {
      console.error("Error loading cached character images:", err);
    } finally {
      setLoading(false);
    }
  };

  const allCharacters = biblicalCharacterProfiles;
  const totalCharacters = allCharacters.length;
  const generatedCount = allCharacters.filter(c => cachedImages.has(c.id)).length;
  const missingCount = totalCharacters - generatedCount;

  const getMissingCharacters = (): CharacterProfile[] => {
    return allCharacters.filter(c => !cachedImages.has(c.id));
  };

  const filteredCharacters = allCharacters.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
  });

  const handleGenerateAll = async () => {
    const missing = getMissingCharacters();
    if (missing.length === 0) {
      toast({ title: "All images generated!", description: "No missing characters to generate" });
      return;
    }
    await generateCharacters(missing, true);
  };

  const handleRegenerateOne = async (character: CharacterProfile) => {
    await generateCharacters([character], false);
  };

  const generateCharacters = async (characters: CharacterProfile[], skipExisting: boolean) => {
    setGenerating(true);
    setResults([]);
    setProgress({ current: 0, total: characters.length });

    const batchSize = 10;
    const allResults: typeof results = [];

    for (let i = 0; i < characters.length; i += batchSize) {
      const batch = characters.slice(i, i + batchSize).map(c => ({
        id: c.id,
        name: c.name,
        prompt: buildCharacterPortraitPrompt(c),
      }));

      try {
        const { data, error } = await supabase.functions.invoke("generate-character-image", {
          body: { characters: batch, skipExisting },
        });

        if (error) throw error;

        if (data?.results) {
          allResults.push(...data.results);
          setResults([...allResults]);
        }

        setProgress({ current: Math.min(i + batchSize, characters.length), total: characters.length });

        if (data?.results?.some((r: any) => r.error === "Credits exhausted")) {
          toast({ title: "Credits Exhausted", description: "Add more credits to continue generating", variant: "destructive" });
          break;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Generation failed";
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
        break;
      }
    }

    await loadCachedImages();
    queryClient.invalidateQueries({ queryKey: ["character-images"] });
    setGenerating(false);

    const successCount = allResults.filter(r => r.success).length;
    toast({ title: "Generation Complete", description: `Generated ${successCount} of ${characters.length} images` });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Characters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalCharacters}</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{generatedCount}</div>
          </CardContent>
        </Card>

        <Card className={missingCount > 0 ? "border-amber-500/50 bg-amber-500/5" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-amber-500" />
              Missing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-600">{missingCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Character Portrait Generator
          </CardTitle>
          <CardDescription>
            Generate AI portrait images for biblical characters using Lovable AI (batches of 10)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={handleGenerateAll}
              disabled={generating || missingCount === 0}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Missing ({missingCount})
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={loadCachedImages}
              disabled={generating}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Progress Bar */}
          {generating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <Progress value={(progress.current / progress.total) * 100} />
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Results</h4>
              <ScrollArea className="h-[200px] border rounded-md p-3">
                <div className="space-y-1">
                  {results.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {r.success ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>{r.name}</span>
                      {r.error && (
                        <span className="text-muted-foreground">- {r.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Character Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Character Portraits</CardTitle>
          <CardDescription>
            {generatedCount} of {totalCharacters} portraits generated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredCharacters.map((char) => {
              const cached = cachedImages.get(char.id);
              return (
                <div
                  key={char.id}
                  className={`p-3 rounded-lg border text-center space-y-2 ${
                    cached ? "bg-green-500/5 border-green-500/30" : "bg-muted/50"
                  }`}
                >
                  {cached ? (
                    <img
                      src={cached.url}
                      alt={char.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-green-500/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-muted text-3xl">
                      {char.emoji}
                    </div>
                  )}
                  <div className="text-xs font-medium truncate">{char.name}</div>
                  <div className="flex items-center justify-center gap-1">
                    {cached ? (
                      <Badge variant="outline" className="text-[10px] bg-green-500/20 text-green-700 border-green-500/30">
                        Done
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">Pending</Badge>
                    )}
                  </div>
                  {cached && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => handleRegenerateOne(char)}
                      disabled={generating}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Redo
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
