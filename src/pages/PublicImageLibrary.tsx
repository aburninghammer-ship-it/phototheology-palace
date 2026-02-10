import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Heart, User, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PublicImage {
  id: string;
  image_url: string;
  description: string;
  verse_reference: string | null;
  room_type: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

const PublicImageLibrary = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [images, setImages] = useState<PublicImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<PublicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomFilter, setRoomFilter] = useState<string>("all");

  useEffect(() => {
    fetchPublicImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [searchQuery, roomFilter, images]);

  const fetchPublicImages = async () => {
    try {
      // First get public images
      const { data: imagesData, error: imagesError } = await supabase
        .from("bible_images")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (imagesError) throw imagesError;

      // Then fetch profiles for those images
      if (imagesData && imagesData.length > 0) {
        const userIds = Array.from(new Set(imagesData.map(img => img.user_id)));
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        // Combine images with their profile data
        const combinedData = imagesData.map(image => ({
          ...image,
          profiles: profilesData?.find(p => p.id === image.user_id) || {
            username: "Unknown",
            display_name: null,
            avatar_url: null,
          },
        }));

        setImages(combinedData as any);
      } else {
        setImages([]);
      }
    } catch (error: any) {
      console.error("Error fetching public images:", error);
      toast({
        title: t('common.error'),
        description: t('public.failedToLoadImages'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = images;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (img) =>
          img.description.toLowerCase().includes(query) ||
          img.verse_reference?.toLowerCase().includes(query) ||
          img.room_type.toLowerCase().includes(query) ||
          img.profiles.username.toLowerCase().includes(query)
      );
    }

    if (roomFilter !== "all") {
      filtered = filtered.filter((img) => img.room_type === roomFilter);
    }

    setFilteredImages(filtered);
  };

  const roomTypes = Array.from(new Set(images.map((img) => img.room_type)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">{t('public.imageLibraryTitle')}</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('public.imageLibrarySubtitle')}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('public.searchImagesPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roomFilter} onValueChange={setRoomFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder={t('public.filterByRoom')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('public.allRooms')}</SelectItem>
                  {roomTypes.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t('public.showingImages', { showing: filteredImages.length, total: images.length })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Images Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredImages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-20">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">{t('public.noImagesFound')}</h3>
              <p className="text-muted-foreground">
                {searchQuery || roomFilter !== "all"
                  ? t('public.tryAdjustingFilters')
                  : t('public.beFirstToShare')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={image.profiles.avatar_url || undefined} />
                        <AvatarFallback>
                          {image.profiles.display_name?.[0] || image.profiles.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {image.profiles.display_name || image.profiles.username}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(image.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {image.room_type}
                    </Badge>
                  </CardHeader>
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={image.image_url}
                      alt={image.description}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <CardDescription className="line-clamp-2 mb-2">
                      {image.description}
                    </CardDescription>
                    {image.verse_reference && (
                      <p className="text-sm font-semibold text-primary">
                        📖 {image.verse_reference}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(image.image_url, "_blank")}
                    >
                      {t('public.viewFullSize')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default PublicImageLibrary;
