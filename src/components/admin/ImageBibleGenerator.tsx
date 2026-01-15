import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ImageIcon, Check, X, RefreshCw, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { imageBibleBooks, type ChapterCard } from "@/data/imageBibleData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CachedImage {
  book: string;
  chapter: number;
  public_url: string;
  generated_at: string;
}

// Cutoff date for "old style" images - images generated before this date use the old prompt
const OLD_STYLE_CUTOFF_DATE = new Date("2026-01-14T00:00:00Z");

export function ImageBibleGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cachedImages, setCachedImages] = useState<Map<string, { url: string; generatedAt: Date }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string>("all");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{ book: string; chapter: number; success: boolean; error?: string }[]>([]);

  // Load cached images on mount
  useEffect(() => {
    loadCachedImages();
  }, []);

  const loadCachedImages = async () => {
    setLoading(true);
    try {
      // Note: backend enforces a 1000-row limit per request, so we page through.
      const cache = new Map<string, { url: string; generatedAt: Date }>();
      const pageSize = 1000;
      let from = 0;

      while (true) {
        const to = from + pageSize - 1;
        const { data, error } = await supabase
          .from("image_bible_cache")
          .select("book, chapter, public_url, generated_at")
          .order("book", { ascending: true })
          .order("chapter", { ascending: true })
          .range(from, to);

        if (error) throw error;

        const rows = (data as CachedImage[]) ?? [];
        rows.forEach((item) => {
          cache.set(`${item.book}-${item.chapter}`, {
            url: item.public_url,
            generatedAt: new Date(item.generated_at),
          });
        });

        if (rows.length < pageSize) break;
        from += pageSize;
      }

      setCachedImages(cache);
    } catch (err) {
      console.error("Error loading cached images:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get all chapters based on selection
  const getAllChaptersForSelection = (): ChapterCard[] => {
    if (selectedBook === "all") {
      return imageBibleBooks.flatMap(book => book.chapters);
    }
    const book = imageBibleBooks.find(b => b.name === selectedBook);
    return book?.chapters || [];
  };

  // Get only missing chapters (not in cache)
  const getMissingChaptersToGenerate = (): ChapterCard[] => {
    const allChapters = getAllChaptersForSelection();
    return allChapters.filter(c => !cachedImages.has(`${c.book}-${c.chapter}`));
  };

  // Get old-style chapters (generated before cutoff date)
  const getOldStyleChapters = (): ChapterCard[] => {
    const allChapters = getAllChaptersForSelection();
    return allChapters.filter(c => {
      const cached = cachedImages.get(`${c.book}-${c.chapter}`);
      return cached && cached.generatedAt < OLD_STYLE_CUTOFF_DATE;
    });
  };

  // Get stats
  const allChapters = imageBibleBooks.flatMap(book => book.chapters);
  const totalChapters = allChapters.length;
  const generatedCount = cachedImages.size;
  const missingCount = totalChapters - generatedCount;
  
  // Count old-style images
  const oldStyleCount = Array.from(cachedImages.values()).filter(
    img => img.generatedAt < OLD_STYLE_CUTOFF_DATE
  ).length;

  const handleGenerate = async (skipExisting = true) => {
    // Only send chapters that are actually missing - much more efficient
    const chapters = skipExisting ? getMissingChaptersToGenerate() : getAllChaptersForSelection();
    
    if (chapters.length === 0) {
      toast({
        title: "All images generated!",
        description: "No missing chapters to generate",
      });
      return;
    }

    setGenerating(true);
    setResults([]);
    setProgress({ current: 0, total: chapters.length });

    // Process in batches of 5
    const batchSize = 5;
    const allResults: typeof results = [];

    for (let i = 0; i < chapters.length; i += batchSize) {
      const batch = chapters.slice(i, i + batchSize).map(c => ({
        book: c.book,
        chapter: c.chapter,
        theme: c.theme,
        summary: c.summary,
        visualIcon: c.visualIcon,
      }));

      try {
        const { data, error } = await supabase.functions.invoke("generate-image-bible", {
          body: { chapters: batch, skipExisting },
        });

        if (error) throw error;

        if (data?.results) {
          allResults.push(...data.results);
          setResults([...allResults]);
        }

        setProgress({ current: Math.min(i + batchSize, chapters.length), total: chapters.length });

        // Check for credit exhaustion
        if (data?.results?.some((r: any) => r.error === "Credits exhausted")) {
          toast({
            title: "Credits Exhausted",
            description: "Add more credits to continue generating",
            variant: "destructive",
          });
          break;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Generation failed";
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        break;
      }
    }

    // Reload cache and invalidate Image Bible query to refresh thumbnails
    await loadCachedImages();
    queryClient.invalidateQueries({ queryKey: ['image-bible-storage-images'] });
    setGenerating(false);

    const successCount = allResults.filter(r => r.success).length;
    toast({
      title: "Generation Complete",
      description: `Generated ${successCount} of ${chapters.length} images`,
    });
  };

  const handleRegenerateOldStyle = async () => {
    const oldStyleChapters = getOldStyleChapters();
    
    if (oldStyleChapters.length === 0) {
      toast({
        title: "All images up to date!",
        description: "No old-style images to regenerate",
      });
      return;
    }

    setGenerating(true);
    setResults([]);
    setProgress({ current: 0, total: oldStyleChapters.length });

    // Process in batches of 5
    const batchSize = 5;
    const allResults: typeof results = [];

    for (let i = 0; i < oldStyleChapters.length; i += batchSize) {
      const batch = oldStyleChapters.slice(i, i + batchSize).map(c => ({
        book: c.book,
        chapter: c.chapter,
        theme: c.theme,
        summary: c.summary,
        visualIcon: c.visualIcon,
      }));

      try {
        // skipExisting = false to force regeneration
        const { data, error } = await supabase.functions.invoke("generate-image-bible", {
          body: { chapters: batch, skipExisting: false },
        });

        if (error) throw error;

        if (data?.results) {
          allResults.push(...data.results);
          setResults([...allResults]);
        }

        setProgress({ current: Math.min(i + batchSize, oldStyleChapters.length), total: oldStyleChapters.length });

        // Check for credit exhaustion
        if (data?.results?.some((r: any) => r.error === "Credits exhausted")) {
          toast({
            title: "Credits Exhausted",
            description: "Add more credits to continue generating",
            variant: "destructive",
          });
          break;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Generation failed";
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        break;
      }
    }

    // Reload cache and invalidate Image Bible query to refresh thumbnails
    await loadCachedImages();
    queryClient.invalidateQueries({ queryKey: ['image-bible-storage-images'] });
    setGenerating(false);

    const successCount = allResults.filter(r => r.success).length;
    toast({
      title: "Old Style Update Complete",
      description: `Regenerated ${successCount} of ${oldStyleChapters.length} images`,
    });
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
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalChapters}</div>
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

        <Card className={oldStyleCount > 0 ? "border-orange-500/50 bg-orange-500/5" : "border-green-500/50 bg-green-500/5"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Old Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${oldStyleCount > 0 ? "text-orange-600" : "text-green-600"}`}>
              {oldStyleCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Before {OLD_STYLE_CUTOFF_DATE.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Batch Image Generator
          </CardTitle>
          <CardDescription>
            Generate AI images for Bible chapters using Lovable AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books ({totalChapters} chapters)</SelectItem>
                  {imageBibleBooks.map(book => {
                    const bookCached = book.chapters.filter(c => 
                      cachedImages.has(`${c.book}-${c.chapter}`)
                    ).length;
                    return (
                      <SelectItem key={book.name} value={book.name}>
                        {book.name} ({bookCached}/{book.totalChapters})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => handleGenerate(true)}
              disabled={generating}
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
              variant="secondary"
              onClick={handleRegenerateOldStyle}
              disabled={generating || oldStyleCount === 0}
            >
              <Clock className="h-4 w-4 mr-2" />
              Update Old Style ({oldStyleCount})
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
                      <span>{r.book} {r.chapter}</span>
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

      {/* Book Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Book Status</CardTitle>
          <CardDescription>Image generation progress by book</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
            {imageBibleBooks.map(book => {
              const cached = book.chapters.filter(c => 
                cachedImages.has(`${c.book}-${c.chapter}`)
              ).length;
              const oldStyle = book.chapters.filter(c => {
                const img = cachedImages.get(`${c.book}-${c.chapter}`);
                return img && img.generatedAt < OLD_STYLE_CUTOFF_DATE;
              }).length;
              const percent = (cached / book.totalChapters) * 100;
              const isComplete = cached === book.totalChapters;
              const hasOldStyle = oldStyle > 0;

              return (
                <div
                  key={book.name}
                  className={`p-3 rounded-lg border ${
                    isComplete && !hasOldStyle 
                      ? "bg-green-500/10 border-green-500/30" 
                      : hasOldStyle 
                        ? "bg-orange-500/10 border-orange-500/30"
                        : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm truncate">{book.name}</span>
                    <div className="flex items-center gap-1">
                      {hasOldStyle && (
                        <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-700 border-orange-500/30">
                          {oldStyle} old
                        </Badge>
                      )}
                      <Badge variant={isComplete ? "default" : "outline"} className="text-xs">
                        {cached}/{book.totalChapters}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
