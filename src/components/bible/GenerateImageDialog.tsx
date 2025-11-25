import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GenerateImageDialogProps {
  verseRef: string;
  verseText: string;
  selectedFloor: string;
  description: string;
  onSuccess: () => void;
}

export const GenerateImageDialog = ({ 
  verseRef, 
  verseText,
  selectedFloor, 
  description,
  onSuccess 
}: GenerateImageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setGeneratedImage(null);

    try {
      const fullPrompt = description 
        ? `${prompt}\n\nContext: ${description}\nVerse: ${verseText}`
        : `${prompt}\n\nVerse: ${verseText}`;

      const { data, error } = await supabase.functions.invoke("generate-visual-anchor", {
        body: { prompt: fullPrompt }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.image) {
        throw new Error("No image generated");
      }

      setGeneratedImage(data.image);
      toast({
        title: "Success",
        description: "Image generated! Click 'Save as Visual Anchor' to save it.",
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
      const fileName = `${userData.user.id}/${Date.now()}.png`;
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
        description: description || `AI-generated visual anchor for ${verseRef}: ${prompt}`,
        verse_reference: verseRef,
        room_type: `Floor ${selectedFloor}`,
        is_public: false,
        is_favorite: false,
      });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Visual anchor saved!",
      });

      setOpen(false);
      setPrompt("");
      setGeneratedImage(null);
      onSuccess();

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate AI Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Visual Anchor</DialogTitle>
          <DialogDescription>
            Describe the visual anchor you want to create for {verseRef}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt" className="text-sm font-medium">
              Image Prompt
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A glowing lampstand in a dark temple, with rays of light revealing intricate details..."
              rows={4}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: Be specific and descriptive. Include colors, mood, symbols, and biblical imagery.
            </p>
          </div>

          {generatedImage && (
            <div className="space-y-3">
              <Label>Generated Image</Label>
              <div className="border-2 border-primary/20 rounded-lg overflow-hidden">
                <img 
                  src={generatedImage} 
                  alt="Generated visual anchor" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="flex-1"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>

            {generatedImage && (
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="default"
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save as Visual Anchor"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
