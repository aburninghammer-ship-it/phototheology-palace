import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, ImagePlus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChapterFrame } from "@/data/bible24fps/allBooks";

interface Create24FPSImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: ChapterFrame;
  onSuccess: () => void;
}

export const Create24FPSImageDialog = ({ 
  open,
  onOpenChange,
  chapter,
  onSuccess 
}: Create24FPSImageDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
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
      // Create a detailed prompt for 24FPS memory frame
      const fullPrompt = `Create a memorable visual anchor for ${chapter.book} Chapter ${chapter.chapter}.

Title: "${chapter.title}"
Summary: ${chapter.summary}
Symbol: ${chapter.symbol}

User's vision: ${prompt}

Style requirements:
- Bold, memorable imagery suitable for memory training
- Clear symbolic representation
- Full-framed composition (no cropping)
- Vivid colors that aid memorization
- Biblical accuracy in any depicted scenes`;

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
        description: "Image generated! Click 'Save' to use it as your chapter frame.",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = async (imageData: string | File) => {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Please sign in to save images");

      let blob: Blob;
      
      if (typeof imageData === 'string') {
        // Convert base64 to blob
        const base64Data = imageData.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: 'image/png' });
      } else {
        blob = imageData;
      }

      // Upload to storage with book/chapter in path
      const fileName = `${userData.user.id}/24fps/${chapter.book.toLowerCase()}-${chapter.chapter}-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("bible-images")
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("bible-images")
        .getPublicUrl(fileName);

      // Save to database with book and chapter info
      const { error: insertError } = await supabase.from("bible_images").insert({
        user_id: userData.user.id,
        image_url: urlData.publicUrl,
        description: `24FPS frame for ${chapter.book} ${chapter.chapter}: ${chapter.title}`,
        verse_reference: `${chapter.book} ${chapter.chapter}`,
        room_type: "24fps",
        book: chapter.book,
        chapter: chapter.chapter,
        is_public: false,
        is_favorite: false,
      });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `Image saved for ${chapter.book} ${chapter.chapter}!`,
      });

      onOpenChange(false);
      resetState();
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

  const resetState = () => {
    setPrompt("");
    setGeneratedImage(null);
    setUploadedImage(null);
    setUploadFile(null);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-primary" />
            Create Frame for {chapter.book} {chapter.chapter}
          </DialogTitle>
          <DialogDescription>
            {chapter.title} — {chapter.memoryHook}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generate
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="prompt" className="text-sm font-medium">
                Describe your memory image
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Example: A vivid scene of ${chapter.summary.slice(0, 50)}...`}
                rows={4}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 The AI will incorporate the chapter context automatically. Focus on visual details that will help you remember.
              </p>
            </div>

            {generatedImage && (
              <div className="space-y-3">
                <Label>Generated Image</Label>
                <div className="border-2 border-primary/20 rounded-lg overflow-hidden bg-white">
                  <img 
                    src={generatedImage} 
                    alt="Generated chapter frame" 
                    className="w-full h-auto object-contain max-h-64 mx-auto"
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
                  onClick={() => saveImage(generatedImage)}
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
                    "Save Frame"
                  )}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="image-upload" className="text-sm font-medium">
                Upload your own image
              </Label>
              <div className="mt-2">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </span>
                </label>
              </div>
            </div>

            {uploadedImage && (
              <div className="space-y-3">
                <Label>Preview</Label>
                <div className="border-2 border-primary/20 rounded-lg overflow-hidden bg-white">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded chapter frame" 
                    className="w-full h-auto object-contain max-h-64 mx-auto"
                  />
                </div>
                <Button
                  onClick={() => uploadFile && saveImage(uploadFile)}
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save as Chapter Frame"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
