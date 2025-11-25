import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Upload, X, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerateImageDialog } from "./GenerateImageDialog";

interface VerseImageAttachmentProps {
  book: string;
  chapter: number;
  verse: number;
  verseText?: string;
}

const FLOOR_COLORS = [
  { floor: 1, name: "Floor 1 - Furnishing", color: "gradient-palace" },
  { floor: 2, name: "Floor 2 - Investigation", color: "gradient-ocean" },
  { floor: 3, name: "Floor 3 - Freestyle", color: "gradient-royal" },
  { floor: 4, name: "Floor 4 - Next Level", color: "gradient-sunset" },
  { floor: 5, name: "Floor 5 - Vision", color: "gradient-warmth" },
  { floor: 6, name: "Floor 6 - Three Heavens", color: "gradient-palace" },
  { floor: 7, name: "Floor 7 - Spiritual", color: "gradient-ocean" },
  { floor: 8, name: "Floor 8 - Master", color: "gradient-royal" },
];

export const VerseImageAttachment = ({ book, chapter, verse, verseText = "" }: VerseImageAttachmentProps) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string>("1");
  const { toast } = useToast();

  const verseRef = `${book} ${chapter}:${verse}`;

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bible_images")
        .select("*")
        .eq("verse_reference", verseRef)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("bible-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("bible-images")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("bible_images").insert({
        user_id: userData.user.id,
        image_url: urlData.publicUrl,
        description: description || `Visual anchor for ${verseRef}`,
        verse_reference: verseRef,
        room_type: `Floor ${selectedFloor}`,
        is_public: false,
        is_favorite: false,
      });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Image attached to verse",
      });

      setDescription("");
      loadImages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (id: string) => {
    try {
      const { error } = await supabase.from("bible_images").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image removed",
      });

      loadImages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Visual Anchors</h3>
        </div>
        <Button variant="outline" size="sm" onClick={loadImages} disabled={loading}>
          <Image className="h-4 w-4 mr-2" />
          {loading ? "Loading..." : `Load Images`}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Generate or upload images to create mental palace visual anchors for this verse
      </p>

      {/* Image Generation and Upload Section */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="description" className="text-xs">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this image should represent..."
            className="text-xs"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="floor-color" className="text-xs">Floor/Color Code</Label>
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              {FLOOR_COLORS.map((floor) => (
                <SelectItem key={floor.floor} value={floor.floor.toString()}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${floor.color}`} />
                    <span>{floor.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <GenerateImageDialog
            verseRef={verseRef}
            verseText={verseText}
            selectedFloor={selectedFloor}
            description={description}
            onSuccess={loadImages}
          />

          <Label htmlFor="image-upload" className="cursor-pointer">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <div>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </div>
            </Button>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </Label>
        </div>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-2 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image_url}
                  alt={img.description}
                  className="w-full h-32 object-cover rounded-lg border-2 border-border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(img.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <Badge className="absolute bottom-2 left-2 text-xs">
                  {img.room_type}
                </Badge>
                {img.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {img.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
