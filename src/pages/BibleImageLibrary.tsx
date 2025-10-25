import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Image, Search, Heart, Trash2, RefreshCw, Loader2, ArrowLeft, MessageCircle, Send, X } from "lucide-react";

interface BibleImage {
  id: string;
  room_type: string;
  description: string;
  verse_reference: string | null;
  image_url: string;
  is_favorite: boolean;
  created_at: string;
}

export default function BibleImageLibrary() {
  const navigate = useNavigate();
  const [images, setImages] = useState<BibleImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<BibleImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "translation" | "24fps">("all");
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [jeevesOpen, setJeevesOpen] = useState(false);
  const [jeevesPrompt, setJeevesPrompt] = useState("");
  const [jeevesGenerating, setJeevesGenerating] = useState(false);
  
  const [newImage, setNewImage] = useState({
    room_type: "24fps",
    description: "",
    verse_reference: "",
  });

  useEffect(() => {
    checkAuth();
    fetchImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, searchQuery, activeFilter, activeTab]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
  };

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("bible_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = images;

    // Filter by room type
    if (activeFilter !== "all") {
      filtered = filtered.filter((img) => img.room_type === activeFilter);
    }

    // Filter by favorites
    if (activeTab === "favorites") {
      filtered = filtered.filter((img) => img.is_favorite);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (img) =>
          img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.verse_reference?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  };

  const generateImage = async () => {
    if (!newImage.description.trim()) {
      toast.error("Please enter a description for the image");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "generate-image",
          description: newImage.description,
          verse_reference: newImage.verse_reference,
          room_type: newImage.room_type,
        },
      });

      if (error) throw error;

      toast.success("Image generated successfully!");
      setNewImage({ room_type: "24fps", description: "", verse_reference: "" });
      fetchImages();
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    } finally {
      setGenerating(false);
    }
  };

  const toggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from("bible_images")
        .update({ is_favorite: !currentFavorite })
        .eq("id", id);

      if (error) throw error;
      
      setImages(images.map(img => 
        img.id === id ? { ...img, is_favorite: !currentFavorite } : img
      ));
      toast.success(!currentFavorite ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite");
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bible_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setImages(images.filter(img => img.id !== id));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const regenerateImage = async (image: BibleImage) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "generate-image",
          description: image.description,
          verse_reference: image.verse_reference,
          room_type: image.room_type,
        },
      });

      if (error) throw error;

      await deleteImage(image.id);
      toast.success("Image regenerated successfully!");
      fetchImages();
    } catch (error) {
      console.error("Error regenerating image:", error);
      toast.error("Failed to regenerate image");
    } finally {
      setGenerating(false);
    }
  };

  const generateWithJeeves = async () => {
    if (!jeevesPrompt.trim()) {
      toast.error("Please describe what image you'd like Jeeves to create");
      return;
    }

    setJeevesGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "generate-image",
          description: jeevesPrompt,
          verse_reference: null,
          room_type: "24fps",
        },
      });

      if (error) throw error;

      toast.success("Jeeves generated your image successfully!");
      setJeevesPrompt("");
      setJeevesOpen(false);
      fetchImages();
    } catch (error) {
      console.error("Error generating image with Jeeves:", error);
      toast.error("Jeeves couldn't generate the image. Please try again.");
    } finally {
      setJeevesGenerating(false);
    }
  };

  const stats = {
    total: images.length,
    translation: images.filter(img => img.room_type === "translation").length,
    fps24: images.filter(img => img.room_type === "24fps").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border-b border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Image className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-4xl font-bold text-white">Bible Image Library</h1>
                <p className="text-purple-200 text-lg">Your visual interpretations of Scripture</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/palace")}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Palace
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h3 className="text-purple-200 text-sm font-medium mb-2">Total Images</h3>
            <p className="text-5xl font-bold text-white">{stats.total}</p>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h3 className="text-purple-200 text-sm font-medium mb-2">Translation Room</h3>
            <p className="text-5xl font-bold text-white">{stats.translation}</p>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h3 className="text-purple-200 text-sm font-medium mb-2">24FPS Room</h3>
            <p className="text-5xl font-bold text-white">{stats.fps24}</p>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by verse reference or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/90 backdrop-blur-sm border-white/20 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className={activeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-white/90 text-foreground border-white/20"}
          >
            All Images
          </Button>
          <Button
            variant={activeFilter === "translation" ? "default" : "outline"}
            onClick={() => setActiveFilter("translation")}
            className={activeFilter === "translation" ? "bg-primary text-primary-foreground" : "bg-white/90 text-foreground border-white/20"}
          >
            Translation Room
          </Button>
          <Button
            variant={activeFilter === "24fps" ? "default" : "outline"}
            onClick={() => setActiveFilter("24fps")}
            className={activeFilter === "24fps" ? "bg-primary text-primary-foreground" : "bg-white/90 text-foreground border-white/20"}
          >
            24FPS Room
          </Button>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "favorites")} className="mb-6">
          <TabsList className="bg-white/90 backdrop-blur-sm border-white/20">
            <TabsTrigger value="all">All Images ({filteredImages.length})</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({images.filter(img => img.is_favorite).length})</TabsTrigger>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
                  Create New
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card text-card-foreground">
                <DialogHeader>
                  <DialogTitle>Generate New Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Room Type</label>
                    <Tabs value={newImage.room_type} onValueChange={(v) => setNewImage({ ...newImage, room_type: v })}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="translation">Translation Room</TabsTrigger>
                        <TabsTrigger value="24fps">24FPS Room</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Verse Reference (Optional)</label>
                    <Input
                      placeholder="e.g., John 3:16"
                      value={newImage.verse_reference}
                      onChange={(e) => setNewImage({ ...newImage, verse_reference: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Image Description</label>
                    <Textarea
                      placeholder="Describe the image you want to create..."
                      value={newImage.description}
                      onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={generateImage}
                    disabled={generating}
                    className="w-full"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Image"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-16">
                <Image className="w-24 h-24 mx-auto text-white/30 mb-4" />
                <p className="text-white/60 text-lg">No images found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image) => (
                  <Card key={image.id} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden group">
                    <div className="relative aspect-square">
                      <img
                        src={image.image_url}
                        alt={image.description}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleFavorite(image.id, image.is_favorite)}
                          className="bg-white/20 hover:bg-white/30"
                        >
                          <Heart className={`w-5 h-5 ${image.is_favorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => regenerateImage(image)}
                          className="bg-white/20 hover:bg-white/30"
                        >
                          <RefreshCw className="w-5 h-5 text-white" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteImage(image.id)}
                          className="bg-white/20 hover:bg-white/30"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary-foreground">
                          {image.room_type === "24fps" ? "24FPS Room" : "Translation Room"}
                        </span>
                        {image.verse_reference && (
                          <span className="text-xs text-purple-200">{image.verse_reference}</span>
                        )}
                      </div>
                      <p className="text-sm text-white line-clamp-2">{image.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : filteredImages.filter(img => img.is_favorite).length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-24 h-24 mx-auto text-white/30 mb-4" />
                <p className="text-white/60 text-lg">No favorite images yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.filter(img => img.is_favorite).map((image) => (
                  <Card key={image.id} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden group">
                    <div className="relative aspect-square">
                      <img
                        src={image.image_url}
                        alt={image.description}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleFavorite(image.id, image.is_favorite)}
                          className="bg-white/20 hover:bg-white/30"
                        >
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => regenerateImage(image)}
                          className="bg-white/20 hover:bg-white/30"
                        >
                          <RefreshCw className="w-5 h-5 text-white" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteImage(image.id)}
                          className="bg-white/20 hover:bg-white/30"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary-foreground">
                          {image.room_type === "24fps" ? "24FPS Room" : "Translation Room"}
                        </span>
                        {image.verse_reference && (
                          <span className="text-xs text-purple-200">{image.verse_reference}</span>
                        )}
                      </div>
                      <p className="text-sm text-white line-clamp-2">{image.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Jeeves Floating Button */}
      {!jeevesOpen && (
        <Button
          onClick={() => setJeevesOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Jeeves Chat Panel */}
      {jeevesOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 bg-card flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">Jeeves - Image Assistant</h3>
            </div>
            <Button
              onClick={() => setJeevesOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  👋 Hello! I'm Jeeves, your biblical image assistant. Tell me what biblical scene or concept you'd like me to visualize, and I'll create a beautiful image for you.
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground font-medium mb-2">Try saying:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Create an image of David and Goliath"</li>
                  <li>• "Show me the parting of the Red Sea"</li>
                  <li>• "Visualize the Garden of Eden"</li>
                  <li>• "Generate an image for Psalm 23"</li>
                </ul>
              </div>

              {jeevesGenerating && (
                <div className="bg-primary/10 p-3 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <p className="text-sm text-primary">Jeeves is creating your image...</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                placeholder="Describe the biblical image you want..."
                value={jeevesPrompt}
                onChange={(e) => setJeevesPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    generateWithJeeves();
                  }
                }}
                className="min-h-[80px] resize-none"
                disabled={jeevesGenerating}
              />
              <Button
                onClick={generateWithJeeves}
                disabled={jeevesGenerating || !jeevesPrompt.trim()}
                size="icon"
                className="h-20 w-20 shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}