import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, BookOpen, ImageIcon, Home, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { bibleRenderedSets } from "@/data/bibleRenderedSets";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";

const BibleRenderedRoom = () => {
  const navigate = useNavigate();
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [generatingImages, setGeneratingImages] = useState<number | null>(null);
  const [setImages, setSetImages] = useState<Record<number, string>>({});

  const generateFlashcards = async () => {
    try {
      setGeneratingFlashcards(true);
      const { data, error } = await supabase.functions.invoke('generate-bible-rendered-flashcards');
      
      if (error) throw error;
      
      toast.success('Flashcard set created! Check the Flashcards page.');
      console.log('Flashcards generated:', data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error('Failed to generate flashcards');
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  useEffect(() => {
    loadSetImages();
  }, []);

  const loadSetImages = async () => {
    try {
      const { data, error } = await supabase
        .from('bible_images')
        .select('verse_reference, image_url')
        .eq('room_type', 'Bible Rendered')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const imageMap: Record<number, string> = {};
      data?.forEach((img) => {
        const set = bibleRenderedSets.find(s => s.range === img.verse_reference);
        if (set && !imageMap[set.number]) {
          imageMap[set.number] = img.image_url;
        }
      });
      
      setSetImages(imageMap);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const generateImage = async (setNumber: number) => {
    try {
      setGeneratingImages(setNumber);
      const { data, error } = await supabase.functions.invoke('generate-bible-rendered-images', {
        body: { setNumber }
      });
      
      if (error) throw error;
      
      toast.success(`Image generated for Set ${setNumber}!`);
      await loadSetImages(); // Reload images to show new one
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.message || 'Failed to generate image');
    } finally {
      setGeneratingImages(null);
    }
  };

  const categories = Array.from(new Set(bibleRenderedSets.map(s => s.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="container max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate('/palace')}>
                <Home className="h-4 w-4" />
              </Button>
              <h1 className="text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
                Bible Rendered Room
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Master the entire Bible through 50 symbolic sets. From Creation to New Jerusalem,
              compress 1,189 chapters into memorable glyphs and themes.
            </p>
          </div>
          <Badge variant="outline" className="hidden md:flex items-center gap-2">
            <BookOpen className="h-3 w-3" />
            Floor 1: Furnishing
          </Badge>
        </div>

        {/* Quick Actions */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Generate flashcards and images for the complete Bible Rendered set
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              onClick={generateFlashcards}
              disabled={generatingFlashcards}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {generatingFlashcards ? 'Generating...' : 'Generate Flashcards (All 50 Sets)'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/flashcards')}
            >
              View Flashcards
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/bible-image-library')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              View Image Library
            </Button>
          </CardContent>
        </Card>

        {/* Sets by Category */}
        <Tabs defaultValue={categories[0]} className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bibleRenderedSets
                  .filter(set => set.category === category)
                  .map((set) => (
                    <Card key={set.number} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{set.symbol}</div>
                            <div>
                              <CardTitle className="text-lg">Set {set.number}</CardTitle>
                              <CardDescription className="font-semibold text-foreground">
                                {set.name}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {setImages[set.number] && (
                          <div className="rounded-lg overflow-hidden border border-border">
                            <img 
                              src={setImages[set.number]} 
                              alt={`${set.name} - ${set.range}`}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-primary mb-1">
                            {set.range}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {set.description}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant={setImages[set.number] ? "outline" : "default"}
                          className="w-full"
                          onClick={() => generateImage(set.number)}
                          disabled={generatingImages === set.number}
                        >
                          <Wand2 className="h-3 w-3 mr-2" />
                          {generatingImages === set.number ? 'Generating...' : setImages[set.number] ? 'Regenerate Image' : 'Generate Image'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Room Info */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>About the Bible Rendered Room</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The Bible Rendered Room gives you the ultimate macro-view—compressing all 1,189 chapters 
              of Scripture into 50 ultra-high-level frames. Each set captures the essence of a major 
              biblical arc with a single symbolic glyph.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Core Question:</h4>
                <p className="text-sm text-muted-foreground">
                  "What single symbol captures this section's essence?"
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Purpose:</h4>
                <p className="text-sm text-muted-foreground">
                  Train your mind to hold the WHOLE counsel of God in view, so you can see how 
                  individual passages fit into the grand narrative.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BibleRenderedRoom;
