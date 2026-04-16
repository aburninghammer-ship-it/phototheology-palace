import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Download, X, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChapterImageProps {
  book: string;
  chapter: number;
  chapterText: string;
}

export const ChapterImage = ({ book, chapter, chapterText }: ChapterImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingImage();
  }, [book, chapter]);

  const loadExistingImage = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Check if image already exists for this chapter
      const { data, error } = await supabase
        .from("bible_images")
        .select("image_url")
        .eq("user_id", userData.user.id)
        .eq("verse_reference", `${book} ${chapter}`)
        .eq("room_type", "Chapter Image")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data?.image_url) {
        setImageUrl(data.image_url);
      } else {
        // Auto-generate image if none exists
        // This runs once per chapter when first viewed
        generateImage();
      }
    } catch (error) {
      console.error("Error loading chapter image:", error);
    }
  };

  const generateImage = async () => {
    setLoading(true);

    try {
      // Get AI analysis of the chapter
      const analysisPrompt = `Analyze ${book} chapter ${chapter} and create an EPIC, CINEMATIC visual description for an AI image generator. This must be visually stunning and dramatic. Focus on:

1. The most DRAMATIC and POWERFUL moment in the chapter - the climax or most visually striking scene
2. HEROIC or INTENSE character poses with strong emotions - faces filled with awe, determination, fear, or reverence
3. EPIC SCALE - vast landscapes, towering architecture, crowds, or cosmic elements that show magnitude
4. DIVINE LIGHT - dramatic rays of light, glowing presence, supernatural illumination breaking through darkness
5. CINEMATIC COMPOSITION - dynamic angles (low angle for power, high angle for scope), depth, leading lines
6. ATMOSPHERIC DRAMA - storm clouds, fire, mist, dramatic skies, contrasting light and shadow
7. SYMBOLIC POWER - key objects or elements that represent the theological significance
8. ETHNIC AUTHENTICITY - Biblical figures should reflect historically accurate Middle Eastern, Mediterranean, and African heritage based on the geographical and historical context. Ensure diverse, culturally appropriate representation.

Chapter text (first 500 chars): ${chapterText.slice(0, 500)}...

Create a vivid, EPIC image prompt (2-3 sentences) that emphasizes:
- Cinematic blockbuster quality like a movie poster
- Dramatic lighting with strong contrast (chiaroscuro)
- Epic scale and grandeur
- Emotional intensity
- Divine/supernatural presence made visible
- Heroic or monumental composition
- Historically accurate ethnic representation (Middle Eastern, Mediterranean, African features as appropriate to the biblical context)

Make this look like it belongs in an epic biblical film directed by a master cinematographer.`;

      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "general",
          message: analysisPrompt,
        },
      });

      if (analysisError) throw analysisError;

      const aiPrompt = typeof analysisData === 'string' ? analysisData : analysisData?.response || analysisData?.content;

      const finalPrompt = `${aiPrompt}

EPIC CINEMATIC STYLE REQUIREMENTS:
- Professional film photography quality, 8K resolution aesthetic
- Dramatic chiaroscuro lighting (strong light and shadow contrast)
- Volumetric lighting, god rays, ethereal glow effects
- Epic scale and grandeur - monumental composition
- Cinematic color grading (rich, saturated, dramatic palette)
- Dynamic camera angle for maximum visual impact
- Photorealistic detail with painterly drama
- Biblical epic film aesthetic (think Ben-Hur, The Ten Commandments, Kingdom of Heaven)
- Heroic poses and powerful emotional expressions
- Atmospheric depth with mist, particles, or environmental effects
- Sharp focus on key subjects, dramatic depth of field
- NO text, NO watermarks, NO borders

ETHNIC REPRESENTATION (CRITICAL):
- Biblical figures MUST reflect historically accurate Middle Eastern, Mediterranean, and North African ethnic features
- Skin tones: olive, tan, brown complexions appropriate to ancient Near East geography
- Facial features: diverse Middle Eastern and Mediterranean characteristics
- For crowds/groups: show ethnic diversity reflecting historical trade routes and migrations
- Avoid Eurocentric defaults - this is ancient Israel, Egypt, Mesopotamia, and surrounding regions
- Cultural authenticity in clothing, appearance, and setting

Reference: ${book} ${chapter} - Biblical Epic Masterpiece`;

      // Generate the image
      const { data: imageData, error: imageError } = await supabase.functions.invoke("generate-visual-anchor", {
        body: {
          prompt: finalPrompt,
          size: "1024x1024"
        }
      });

      if (imageError) throw imageError;
      if (imageData.error) throw new Error(imageData.error);
      if (!imageData.image) throw new Error("No image generated");

      // Save to database
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Convert base64 to blob
      const base64Data = imageData.image.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Upload to storage
      const fileName = `${userData.user.id}/chapters/${book}-${chapter}-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("bible-images")
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("bible-images")
        .getPublicUrl(fileName);

      // Save to database
      const { error: insertError } = await supabase.from("bible_images").insert({
        user_id: userData.user.id,
        image_url: urlData.publicUrl,
        description: `AI-generated chapter image for ${book} ${chapter}`,
        verse_reference: `${book} ${chapter}`,
        room_type: "Chapter Image",
        is_public: false,
        is_favorite: false,
      });

      if (insertError) throw insertError;

      setImageUrl(urlData.publicUrl);

      toast({
        title: "Chapter Image Generated!",
        description: `Image created for ${book} ${chapter}`,
      });

    } catch (error: any) {
      console.error("Generation error:", error);

      // More detailed error logging
      if (error?.message) {
        console.error("Error message:", error.message);
      }
      if (error?.response) {
        console.error("Error response:", error.response);
      }

      // Check for specific error types
      let errorMessage = "Image generation is optional and will retry next time.";
      if (error?.message?.includes("quota") || error?.message?.includes("rate limit")) {
        errorMessage = "API quota exceeded. Images will resume when quota resets.";
      } else if (error?.message?.includes("API key") || error?.message?.includes("unauthorized")) {
        errorMessage = "API configuration issue. Please check settings.";
      } else if (error?.message?.includes("timeout")) {
        errorMessage = "Request timed out. Try again in a moment.";
      }

      toast({
        title: "Could not generate image",
        description: errorMessage,
        variant: "destructive",
      });

      // Set imageUrl to null to prevent infinite retry on same chapter
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${book}-${chapter}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "Image saved to your downloads folder",
    });
  };

  if (hidden) return null;

  // --- Collapsed banner (default) ---
  if (!isExpanded) {
    return (
      <Card className="glass-card mb-4 overflow-hidden">
        {loading ? (
          // Loading shimmer strip
          <div className="h-20 relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            <div className="h-full flex items-center justify-center gap-3 px-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Generating {book} {chapter} image...</span>
            </div>
          </div>
        ) : imageUrl ? (
          // Collapsed strip with background image
          <div
            className="h-20 relative cursor-pointer group"
            onClick={() => setIsExpanded(true)}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
            <div className="relative h-full flex items-center justify-between px-4">
              <div className="text-white">
                <p className="text-sm font-semibold drop-shadow-lg">{book} {chapter}</p>
                <p className="text-xs opacity-75">Chapter Image</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Expand
              </Button>
            </div>
          </div>
        ) : (
          // No image — dashed strip
          <div className="h-20 flex items-center justify-center border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
            <Button
              onClick={generateImage}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <Zap className="h-3 w-3 mr-2" />
              Generate Image for {book} {chapter}
            </Button>
          </div>
        )}
      </Card>
    );
  }

  // --- Expanded view (full image) ---
  return (
    <Card className="glass-card mb-4 overflow-hidden">
      <div className="relative">
        {loading ? (
          <div className="aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/80">Generating Chapter Image...</p>
                <p className="text-xs text-muted-foreground mt-1">Analyzing {book} {chapter} with AI (30-60s)</p>
              </div>
            </div>
          </div>
        ) : imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={`${book} ${chapter}`}
              className="w-full h-auto object-cover aspect-[16/9] sm:aspect-[21/9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Image controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between">
              <div className="text-white drop-shadow-lg">
                <p className="text-xs sm:text-sm font-medium opacity-90">AI-Generated Chapter Image</p>
                <p className="text-xs opacity-75">{book} {chapter}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 px-2 sm:px-3 bg-white/90 hover:bg-white backdrop-blur-sm"
                >
                  <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-2">Collapse</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleDownload}
                  className="h-8 px-2 sm:px-3 bg-white/90 hover:bg-white backdrop-blur-sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-2">Download</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setImageUrl(null);
                    generateImage();
                  }}
                  disabled={loading}
                  className="h-8 px-2 sm:px-3 bg-white/90 hover:bg-white backdrop-blur-sm"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-2">Regenerate</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setHidden(true)}
                  className="h-8 px-2 sm:px-3 bg-white/90 hover:bg-white backdrop-blur-sm"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center border-2 border-dashed border-primary/20">
            <div className="text-center space-y-3 p-6">
              <div className="text-4xl opacity-30">🖼️</div>
              <div>
                <p className="text-sm font-medium text-foreground/60">No chapter image yet</p>
                <p className="text-xs text-muted-foreground mt-1">Generate an AI-powered visual for {book} {chapter}</p>
              </div>
              <Button
                onClick={generateImage}
                disabled={loading}
                size="sm"
                variant="outline"
                className="mt-2"
              >
                <Zap className="h-3 w-3 mr-2" />
                Generate Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
