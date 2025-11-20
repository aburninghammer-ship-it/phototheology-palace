import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, Play, Video, Trash2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TrainingVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  duration_seconds: number | null;
  order_index: number;
  created_at: string;
}

const VideoTraining = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Form state for new video
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Check if user is video admin
  const { data: isVideoAdmin } = useQuery({
    queryKey: ["isVideoAdmin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "video_admin")
        .single();
      return !!data;
    },
    enabled: !!user?.id,
  });

  // Fetch videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ["training-videos", activeCategory],
    queryFn: async () => {
      let query = supabase
        .from("training_videos")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true });
      
      if (activeCategory !== "all") {
        query = query.eq("category", activeCategory);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as TrainingVideo[];
    },
  });

  // Upload video mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!videoFile) throw new Error("No video file selected");
      
      setIsUploading(true);
      
      // Upload video to storage
      const fileExt = videoFile.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("training-videos")
        .upload(filePath, videoFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("training-videos")
        .getPublicUrl(filePath);
      
      // Create database record
      const { error: dbError } = await supabase
        .from("training_videos")
        .insert({
          title,
          description,
          category,
          video_url: publicUrl,
          created_by: user?.id,
        });
      
      if (dbError) throw dbError;
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Video uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["training-videos"] });
      setTitle("");
      setDescription("");
      setCategory("general");
      setVideoFile(null);
      setIsUploading(false);
    },
    onError: (error) => {
      toast.error(`Failed to upload video: ${error.message}`);
      setIsUploading(false);
    },
  });

  // Delete video mutation
  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase
        .from("training_videos")
        .delete()
        .eq("id", videoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Video deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["training-videos"] });
      setSelectedVideo(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete video: ${error.message}`);
    },
  });

  const categories = [
    { value: "all", label: "All Videos" },
    { value: "general", label: "General" },
    { value: "palace", label: "Palace Training" },
    { value: "games", label: "Games & Features" },
    { value: "bible-study", label: "Bible Study" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Video Training</h1>
          <p className="text-muted-foreground">
            Learn how to use Phototheology with step-by-step video tutorials
          </p>
        </div>
        
        {isVideoAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Upload Training Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Getting Started with Phototheology"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A comprehensive introduction to..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="video">Video File</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                </div>
                
                <Button
                  onClick={() => uploadMutation.mutate()}
                  disabled={!title || !videoFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? "Uploading..." : "Upload Video"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-6">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          {isLoading ? (
            <div className="text-center py-12">Loading videos...</div>
          ) : videos && videos.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedVideo(video)}
                >
                  <CardHeader className="p-0">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="object-cover w-full h-full rounded-t-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </AspectRatio>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
                    {video.description && (
                      <CardDescription className="line-clamp-2">
                        {video.description}
                      </CardDescription>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No videos in this category yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedVideo?.title}</span>
              {isVideoAdmin && selectedVideo && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMutation.mutate(selectedVideo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-4">
              <AspectRatio ratio={16 / 9}>
                <video
                  src={selectedVideo.video_url}
                  controls
                  className="w-full h-full rounded-lg"
                  autoPlay
                />
              </AspectRatio>
              {selectedVideo.description && (
                <p className="text-muted-foreground">{selectedVideo.description}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoTraining;
