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
import { Image, Search, Heart, Trash2, RefreshCw, Loader2, ArrowLeft, MessageCircle, Send, X, Edit, Package, Download, Share2, Globe } from "lucide-react";
import { genesisImages } from "@/assets/24fps/genesis";

interface BibleImage {
  id: string;
  room_type: string;
  description: string;
  verse_reference: string | null;
  image_url: string;
  is_favorite: boolean;
  is_public: boolean;
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
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "genesis-pack">("all");
  const [jeevesOpen, setJeevesOpen] = useState(false);
  const [jeevesPrompt, setJeevesPrompt] = useState("");
  const [jeevesGenerating, setJeevesGenerating] = useState(false);
  const [jeevesMessages, setJeevesMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [jeevesState, setJeevesState] = useState<"input" | "name" | "generating">("input");
  const [visualDescription, setVisualDescription] = useState("");
  const [verseReference, setVerseReference] = useState("");
  
  const [editingImage, setEditingImage] = useState<BibleImage | null>(null);
  const [editForm, setEditForm] = useState({ description: "", verse_reference: "" });
  
  const [newImage, setNewImage] = useState({
    room_type: "24fps",
    description: "",
    verse_reference: "",
  });

  const [importingGenesis, setImportingGenesis] = useState(false);

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
      // Moderate the image description
      const { data: moderationData, error: moderationError } = await supabase.functions.invoke(
        "moderate-content",
        {
          body: {
            content: `${newImage.description} ${newImage.verse_reference || ""}`,
            type: "image",
          },
        }
      );

      if (moderationError) {
        console.error("Moderation error:", moderationError);
        // Continue anyway if moderation fails
      } else if (moderationData && !moderationData.safe) {
        toast.error(`Image prompt not allowed: ${moderationData.reason}`);
        setGenerating(false);
        return;
      }

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

  const togglePublic = async (id: string, currentPublic: boolean) => {
    try {
      const { error } = await supabase
        .from("bible_images")
        .update({ is_public: !currentPublic })
        .eq("id", id);

      if (error) throw error;
      
      setImages(images.map(img => 
        img.id === id ? { ...img, is_public: !currentPublic } : img
      ));
      toast.success(!currentPublic ? "Image is now public" : "Image is now private");
    } catch (error) {
      console.error("Error toggling public:", error);
      toast.error("Failed to update sharing status");
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
      // Moderate the image description
      const { data: moderationData, error: moderationError } = await supabase.functions.invoke(
        "moderate-content",
        {
          body: {
            content: `${image.description} ${image.verse_reference || ""}`,
            type: "image",
          },
        }
      );

      if (moderationError) {
        console.error("Moderation error:", moderationError);
        // Continue anyway if moderation fails
      } else if (moderationData && !moderationData.safe) {
        toast.error(`Image prompt not allowed: ${moderationData.reason}`);
        setGenerating(false);
        return;
      }

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

  const isVerseReference = (text: string): boolean => {
    // Check if text looks like a verse reference (e.g., "John 3:16", "Genesis 1:1", "Psalm 23")
    const versePattern = /^(1|2|3)?\s*[A-Za-z]+\s+\d+:?\d*$/;
    return versePattern.test(text.trim());
  };

  const generateWithJeeves = async () => {
    if (!jeevesPrompt.trim()) {
      toast.error("Please describe what image you'd like Jeeves to create");
      return;
    }

    setJeevesGenerating(true);

    try {
      // If it looks like a verse reference, translate it first
      if (isVerseReference(jeevesPrompt)) {
        setJeevesMessages([{ role: "user", content: jeevesPrompt }]);
        
        const { data, error } = await supabase.functions.invoke("jeeves", {
          body: {
            mode: "translate-verse",
            description: jeevesPrompt,
          },
        });

        if (error) throw error;

        const translation = data.response;
        setVisualDescription(translation);
        setVerseReference(jeevesPrompt);
        
        setJeevesMessages(prev => [
          ...prev,
          { role: "assistant", content: `Here's the visual description for ${jeevesPrompt}:\n\n${translation}\n\nWhat would you like to name this image?` }
        ]);
        
        setJeevesState("name");
        setJeevesPrompt("");
      } else if (jeevesState === "name") {
        // User is providing the image name
        setJeevesMessages(prev => [...prev, { role: "user", content: jeevesPrompt }]);
        setJeevesState("generating");

        const { data, error } = await supabase.functions.invoke("jeeves", {
          body: {
            mode: "generate-image",
            description: jeevesPrompt, // Use the custom name as description
            verse_reference: verseReference || null,
            room_type: "translation",
          },
        });

        if (error) throw error;

        setJeevesMessages(prev => [
          ...prev,
          { role: "assistant", content: "✨ Image created successfully! Check your library." }
        ]);
        
        toast.success("Image generated with your custom name!");
        
        // Reset state after a brief delay
        setTimeout(() => {
          setJeevesPrompt("");
          setJeevesState("input");
          setVisualDescription("");
          setVerseReference("");
          setJeevesMessages([]);
          setJeevesOpen(false);
          fetchImages();
        }, 2000);
      } else {
        // Regular description - ask for a name
        setJeevesMessages([
          { role: "user", content: jeevesPrompt },
          { role: "assistant", content: "Great! Now, what would you like to name this image?" }
        ]);
        
        setVisualDescription(jeevesPrompt);
        setJeevesState("name");
        setJeevesPrompt("");
      }
    } catch (error) {
      console.error("Error with Jeeves:", error);
      toast.error("Jeeves encountered an error. Please try again.");
      setJeevesState("input");
      setJeevesMessages([]);
    } finally {
      setJeevesGenerating(false);
    }
  };

  const startEdit = (image: BibleImage) => {
    setEditingImage(image);
    setEditForm({
      description: image.description,
      verse_reference: image.verse_reference || "",
    });
  };

  const saveEdit = async () => {
    if (!editingImage) return;

    try {
      const { error } = await supabase
        .from("bible_images")
        .update({
          description: editForm.description,
          verse_reference: editForm.verse_reference || null,
        })
        .eq("id", editingImage.id);

      if (error) throw error;

      setImages(images.map(img => 
        img.id === editingImage.id 
          ? { ...img, description: editForm.description, verse_reference: editForm.verse_reference || null }
          : img
      ));
      
      toast.success("Image updated successfully");
      setEditingImage(null);
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    }
  };

  const stats = {
    total: images.length,
    translation: images.filter(img => img.room_type === "translation").length,
    fps24: images.filter(img => img.room_type === "24fps").length,
  };

  const genesisChapterTitles = [
    "Creation", "Garden of Eden", "The Fall", "Cain and Abel", "Adam's Genealogy",
    "Noah's Ark", "The Flood", "Post-Flood Covenant", "Table of Nations", "Tower of Babel",
    "Call of Abram", "Abram and Lot Separate", "Abram Rescues Lot", "God's Covenant with Abram", "Hagar and Ishmael",
    "Covenant of Circumcision", "Three Visitors", "Sodom and Gomorrah", "Abraham and Abimelech", "Birth of Isaac",
    "Hagar and Ishmael Sent Away", "Abraham Tested", "Death of Sarah", "Isaac and Rebekah"
  ];

  const importGenesisImage = async (chapterIndex: number) => {
    try {
      const chapter = chapterIndex + 1;
      const imageSrc = genesisImages[chapterIndex];
      
      // Fetch the image as a blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      
      // Upload to Supabase Storage
      const fileName = `genesis-${String(chapter).padStart(2, '0')}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bible-images')
        .upload(`24fps/${fileName}`, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('bible-images')
        .getPublicUrl(`24fps/${fileName}`);

      // Insert into bible_images table
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase
        .from('bible_images')
        .insert({
          user_id: userData.user.id,
          room_type: '24fps',
          description: genesisChapterTitles[chapterIndex],
          verse_reference: `Genesis ${chapter}`,
          image_url: publicUrl,
          is_favorite: false
        });

      if (insertError) throw insertError;

      return true;
    } catch (error) {
      console.error(`Error importing Genesis ${chapterIndex + 1}:`, error);
      return false;
    }
  };

  const importAllGenesis = async () => {
    setImportingGenesis(true);
    try {
      let successCount = 0;
      
      for (let i = 0; i < 24; i++) {
        const success = await importGenesisImage(i);
        if (success) successCount++;
      }

      toast.success(`Successfully imported ${successCount} of 24 Genesis images!`);
      fetchImages();
    } catch (error) {
      console.error("Error importing Genesis images:", error);
      toast.error("Failed to import some images");
    } finally {
      setImportingGenesis(false);
    }
  };

  const importSingleGenesis = async (chapterIndex: number) => {
    const chapter = chapterIndex + 1;
    toast.loading(`Importing Genesis ${chapter}...`, { id: `import-${chapter}` });
    
    const success = await importGenesisImage(chapterIndex);
    
    if (success) {
      toast.success(`Genesis ${chapter} imported!`, { id: `import-${chapter}` });
      fetchImages();
    } else {
      toast.error(`Failed to import Genesis ${chapter}`, { id: `import-${chapter}` });
    }
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

        {/* Jeeves Assistant Card */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Ask Jeeves for Images</h3>
                <p className="text-purple-100">Your AI assistant for biblical imagery</p>
              </div>
            </div>
            <Button
              onClick={() => setJeevesOpen(true)}
              className="bg-white text-purple-900 hover:bg-white/90"
            >
              Chat with Jeeves
            </Button>
          </div>
        </Card>

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
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "favorites" | "genesis-pack")} className="mb-6">
          <TabsList className="bg-white/90 backdrop-blur-sm border-white/20">
            <TabsTrigger value="all">All Images ({filteredImages.length})</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({images.filter(img => img.is_favorite).length})</TabsTrigger>
            <TabsTrigger value="genesis-pack">
              <Package className="w-4 h-4 mr-2" />
              Genesis Starter Pack
            </TabsTrigger>
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
                          title={image.is_favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart className={`w-5 h-5 ${image.is_favorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => togglePublic(image.id, image.is_public)}
                          className="bg-white/20 hover:bg-white/30"
                          title={image.is_public ? "Make private" : "Share publicly"}
                        >
                          <Globe className={`w-5 h-5 ${image.is_public ? "fill-green-500 text-green-500" : "text-white"}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(image)}
                          className="bg-white/20 hover:bg-white/30"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5 text-white" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => regenerateImage(image)}
                          className="bg-white/20 hover:bg-white/30"
                          title="Regenerate"
                        >
                          <RefreshCw className="w-5 h-5 text-white" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteImage(image.id)}
                          className="bg-white/20 hover:bg-white/30"
                          title="Delete"
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
                          title="Remove from favorites"
                        >
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => togglePublic(image.id, image.is_public)}
                          className="bg-white/20 hover:bg-white/30"
                          title={image.is_public ? "Make private" : "Share publicly"}
                        >
                          <Globe className={`w-5 h-5 ${image.is_public ? "fill-green-500 text-green-500" : "text-white"}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(image)}
                          className="bg-white/20 hover:bg-white/30"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5 text-white" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => regenerateImage(image)}
                          className="bg-white/20 hover:bg-white/30"
                          title="Regenerate"
                        >
                          <RefreshCw className="w-5 h-5 text-white" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteImage(image.id)}
                          className="bg-white/20 hover:bg-white/30"
                          title="Delete"
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

          <TabsContent value="genesis-pack" className="mt-6">
            <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Genesis 1-24 Starter Pack</h3>
                  <p className="text-purple-200">
                    Pre-illustrated frames for the first 24 chapters of Genesis from the 24FPS Room
                  </p>
                </div>
                <Button
                  onClick={importAllGenesis}
                  disabled={importingGenesis}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {importingGenesis ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Import All 24
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genesisImages.map((image, index) => {
                const chapter = index + 1;
                return (
                  <Card key={chapter} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden group">
                    <div className="relative aspect-square">
                      <img
                        src={image}
                        alt={`Genesis Chapter ${chapter}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          onClick={() => importSingleGenesis(index)}
                          disabled={importingGenesis}
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Import
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary-foreground">
                          24FPS Room
                        </span>
                        <span className="text-xs text-purple-200">Genesis {chapter}</span>
                      </div>
                      <p className="text-sm text-white">{genesisChapterTitles[index]}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
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

      {/* Edit Image Dialog */}
      <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
        <DialogContent className="bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Edit Image Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Verse Reference</label>
              <Input
                placeholder="e.g., John 3:16"
                value={editForm.verse_reference}
                onChange={(e) => setEditForm({ ...editForm, verse_reference: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe the image..."
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
              />
            </div>
            <Button onClick={saveEdit} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
              {jeevesMessages.length === 0 ? (
                <>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      👋 Hello! I'm Jeeves, your biblical image assistant. I can help you in two ways:
                    </p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium mb-2">📖 Give me a verse reference:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• "John 3:16"</li>
                      <li>• "Psalm 23:1"</li>
                      <li>• "Genesis 1:1"</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2 italic">I'll translate it into a visual description using Translation Room principles!</p>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium mb-2">🎨 Or describe what you want:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• "David facing Goliath with his sling"</li>
                      <li>• "Moses parting the Red Sea"</li>
                      <li>• "The Garden of Eden at dawn"</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  {jeevesMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground ml-8" 
                          : "bg-muted text-muted-foreground mr-8"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))}
                  
                  {jeevesGenerating && (
                    <div className="bg-primary/10 p-3 rounded-lg flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <p className="text-sm text-primary">
                        {jeevesState === "generating" ? "Creating your image..." : "Translating verse..."}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                placeholder={
                  jeevesState === "name" 
                    ? "Enter a name for this image..." 
                    : "Enter a verse (e.g., John 3:16) or describe an image..."
                }
                value={jeevesPrompt}
                onChange={(e) => setJeevesPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    generateWithJeeves();
                  }
                }}
                className="min-h-[80px] resize-none"
                disabled={jeevesGenerating || jeevesState === "generating"}
              />
              <Button
                onClick={generateWithJeeves}
                disabled={jeevesGenerating || !jeevesPrompt.trim() || jeevesState === "generating"}
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