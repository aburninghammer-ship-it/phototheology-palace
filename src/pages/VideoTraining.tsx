import { useState } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { VIDEO_TRAINING_TOUR } from "@/data/guidedTours";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, Play, Video, Trash2, GraduationCap } from "lucide-react";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { videoTrainingSteps } from "@/config/howItWorksSteps";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { SocialShareButton } from "@/components/SocialShareButton";
import defaultVideoThumbnail from "@/assets/video-training-thumbnail.png";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Testimonials } from "@/components/Testimonials";

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
  const { t } = useTranslation();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [tourOpen, setTourOpen] = useState(false);
  
  // Form state for new video
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

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

  // Open video from URL parameter
  useEffect(() => {
    const videoId = searchParams.get("video");
    if (videoId && videos) {
      const video = videos.find(v => v.id === videoId);
      if (video) {
        setSelectedVideo(video);
      }
    }
  }, [searchParams, videos]);

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
      
      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split(".").pop();
        const thumbPath = `thumbnails/${crypto.randomUUID()}.${thumbExt}`;
        
        const { error: thumbUploadError } = await supabase.storage
          .from("training-videos")
          .upload(thumbPath, thumbnailFile);
        
        if (thumbUploadError) throw thumbUploadError;
        
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage
          .from("training-videos")
          .getPublicUrl(thumbPath);
        
        thumbnailUrl = thumbPublicUrl;
      }
      
      // Create database record
      const { error: dbError } = await supabase
        .from("training_videos")
        .insert({
          title,
          description,
          category,
          video_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          created_by: user?.id,
        });
      
      if (dbError) throw dbError;
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success(t('videoTraining.uploadSuccess'));
      queryClient.invalidateQueries({ queryKey: ["training-videos"] });
      setTitle("");
      setDescription("");
      setCategory("general");
      setVideoFile(null);
      setThumbnailFile(null);
      setIsUploading(false);
    },
    onError: (error) => {
      toast.error(t('videoTraining.uploadFailed', { error: error.message }));
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
      toast.success(t('videoTraining.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ["training-videos"] });
      setSelectedVideo(null);
    },
    onError: (error) => {
      toast.error(t('videoTraining.deleteFailed', { error: error.message }));
    },
  });

  const categories = [
    { value: "all", label: t('videoTraining.categories.allVideos') },
    { value: "general", label: t('videoTraining.categories.general') },
    { value: "palace", label: t('videoTraining.categories.palaceTraining') },
    { value: "games", label: t('videoTraining.categories.gamesFeatures') },
    { value: "bible-study", label: t('videoTraining.categories.bibleStudy') },
    { value: "advanced", label: t('videoTraining.categories.advanced') },
  ];

  // Dynamic meta tags for social sharing
  const shareUrl = selectedVideo 
    ? `${window.location.origin}/video-training?video=${selectedVideo.id}`
    : `${window.location.origin}/video-training`;
  const shareTitle = selectedVideo 
    ? `${selectedVideo.title} - Phototheology Video Training`
    : "Video Training - Phototheology";
  const shareDescription = selectedVideo?.description 
    || "Learn how to use Phototheology with step-by-step video tutorials";
  const shareImage = selectedVideo?.thumbnail_url 
    || `${window.location.origin}/phototheology-hero.png`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {tourOpen && <GuidedTourOverlay steps={VIDEO_TRAINING_TOUR} onClose={() => setTourOpen(false)} />}
      <Helmet>
        <title>{shareTitle}</title>
        <meta name="description" content={shareDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="video.other" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={shareUrl} />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={shareDescription} />
        <meta name="twitter:image" content={shareImage} />
      </Helmet>
      
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('videoTraining.title')}</h1>
          <p className="text-muted-foreground">
            {t('videoTraining.description')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
            <GraduationCap className="h-4 w-4" /> Tour
          </Button>
          <HowItWorksDialog title={t('videoTraining.howToUseTitle')} steps={videoTrainingSteps} />
          {isVideoAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                {t('videoTraining.uploadVideo')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{t('videoTraining.uploadTrainingVideo')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('videoTraining.form.title')}</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('videoTraining.form.titlePlaceholder')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">{t('videoTraining.form.description')}</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('videoTraining.form.descriptionPlaceholder')}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">{t('videoTraining.form.category')}</Label>
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
                  <Label htmlFor="video">{t('videoTraining.form.videoFile')}</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="thumbnail">{t('videoTraining.form.thumbnailLabel')}</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('videoTraining.form.thumbnailHint')}
                  </p>
                </div>
                
                <Button
                  onClick={() => uploadMutation.mutate()}
                  disabled={!title || !videoFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? t('videoTraining.uploading') : t('videoTraining.uploadVideo')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          )}
        </div>
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
            <div className="text-center py-12">{t('videoTraining.loadingVideos')}</div>
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
                        <img
                          src={defaultVideoThumbnail}
                          alt={`Phototheology training video thumbnail for ${video.title}`}
                          className="object-cover w-full h-full rounded-t-lg"
                        />
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
                <p className="text-muted-foreground">{t('videoTraining.noVideosInCategory')}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl bg-background/80 backdrop-blur-xl border-border/50">
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
                  className="w-full h-full rounded-lg bg-black"
                  autoPlay
                />
              </AspectRatio>
              {selectedVideo.description && (
                <p className="text-muted-foreground">{selectedVideo.description}</p>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <SocialShareButton
                  title={selectedVideo.title}
                  description={selectedVideo.description || "Watch this Phototheology training video"}
                  url={`${window.location.origin}/video-training?video=${selectedVideo.id}`}
                  variant="dropdown"
                  buttonText="Share Video"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Testimonials />
    </div>
  );
};

export default VideoTraining;
