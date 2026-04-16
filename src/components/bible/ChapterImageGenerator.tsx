import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Loader2, Download, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChapterImageGeneratorProps {
  book: string;
  chapter: number;
  chapterText: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STYLE_PRESETS = [
  { value: "biblical-epic", label: "Biblical Epic", description: "Cinematic, dramatic scenes with divine lighting" },
  { value: "classical-art", label: "Classical Art", description: "Renaissance/Baroque painting style" },
  { value: "stained-glass", label: "Stained Glass", description: "Vibrant stained glass window aesthetic" },
  { value: "illuminated-manuscript", label: "Illuminated Manuscript", description: "Medieval manuscript with gold leaf" },
  { value: "photorealistic", label: "Photorealistic", description: "Realistic photographic style" },
  { value: "symbolic", label: "Symbolic/Abstract", description: "Abstract symbols and metaphors" },
];

export const ChapterImageGenerator = ({
  book,
  chapter,
  chapterText,
  open,
  onOpenChange
}: ChapterImageGeneratorProps) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [stylePreset, setStylePreset] = useState("biblical-epic");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const generateAutoPrompt = () => {
    // This will be enhanced by AI
    const reference = `${book} ${chapter}`;
    return `Create a powerful visual representation of ${reference}. Capture the key narrative moment, theological significance, and emotional impact of this chapter.`;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedImage(null);

    try {
      // Get AI analysis of the chapter to create a better prompt
      const analysisPrompt = `Analyze ${book} chapter ${chapter} and create a detailed visual description for an AI image generator. Focus on:
1. The central scene or moment
2. Key characters and their emotions
3. Setting and atmosphere
4. Symbolic elements
5. Divine presence/intervention

Chapter text (first 500 chars): ${chapterText.slice(0, 500)}...

Provide a vivid, detailed image prompt (2-3 sentences).`;

      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "general",
          message: analysisPrompt,
        },
      });

      if (analysisError) throw analysisError;

      const aiPrompt = typeof analysisData === 'string' ? analysisData : analysisData?.response || analysisData?.content;

      // Combine AI prompt with style and custom additions
      const selectedStyle = STYLE_PRESETS.find(s => s.value === stylePreset);
      const finalPrompt = `${aiPrompt}

Style: ${selectedStyle?.description}
${customPrompt ? `\nAdditional details: ${customPrompt}` : ''}

Reference: ${book} ${chapter}`;

      // Generate the image
      const { data: imageData, error: imageError } = await supabase.functions.invoke("generate-visual-anchor", {
        body: {
          prompt: finalPrompt,
          size: "1024x1024" // Larger size for chapter images
        }
      });

      if (imageError) throw imageError;
      if (imageData.error) throw new Error(imageData.error);
      if (!imageData.image) throw new Error("No image generated");

      setGeneratedImage(imageData.image);
      toast({
        title: "Chapter Image Generated!",
        description: "Click 'Save Image' to add it to your library.",
      });

    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedImage) return;

    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Convert base64 to blob
      const base64Data = generatedImage.split(',')[1];
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

      toast({
        title: "Success!",
        description: `Chapter image saved for ${book} ${chapter}`,
      });

      onOpenChange(false);
      setCustomPrompt("");
      setGeneratedImage(null);

    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save image",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${book}-${chapter}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "Image saved to your downloads folder",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            Generate Chapter Image — {book} {chapter}
          </DialogTitle>
          <DialogDescription>
            Create an AI-generated visual representation of this chapter using Phototheology principles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Style Preset */}
          <div className="space-y-2">
            <Label htmlFor="style" className="text-sm font-medium">
              Art Style
            </Label>
            <Select value={stylePreset} onValueChange={setStylePreset}>
              <SelectTrigger id="style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLE_PRESETS.map(preset => (
                  <SelectItem key={preset.value} value={preset.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{preset.label}</span>
                      <span className="text-xs text-muted-foreground">{preset.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Additions */}
          <div className="space-y-2">
            <Label htmlFor="custom" className="text-sm font-medium">
              Custom Details (Optional)
            </Label>
            <Textarea
              id="custom"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add specific details you want included... (e.g., 'emphasize the angels', 'darker mood', 'focus on Lot's wife')"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              💡 Jeeves will analyze the chapter and create the base prompt. Add custom touches here.
            </p>
          </div>

          {/* Generated Image Preview */}
          {generatedImage && (
            <div className="space-y-3">
              <Label>Generated Image</Label>
              <div className="border-2 border-primary/30 rounded-xl overflow-hidden bg-black/5">
                <img
                  src={generatedImage}
                  alt={`${book} ${chapter}`}
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="flex-1"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating... (30-60s)
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Chapter Image
                </>
              )}
            </Button>

            {generatedImage && (
              <>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  variant="default"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Image"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
