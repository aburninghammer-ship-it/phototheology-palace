import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Home, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function MemoryPalaceBuilder() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [verses, setVerses] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [palaceData, setPalaceData] = useState<Record<string, any>>({});
  const [location, setLocation] = useState("");
  const [visualization, setVisualization] = useState("");

  useEffect(() => {
    loadVerses();
  }, [listId]);

  const loadVerses = async () => {
    const { data, error } = await supabase
      .from("memory_verse_list_items")
      .select("*")
      .eq("list_id", listId)
      .order("order_index");

    if (error) {
      toast.error("Failed to load verses");
      navigate("/memory");
      return;
    }

    setVerses(data || []);
    
    // Load existing palace data
    const { data: { user } } = await supabase.auth.getUser();
    if (user && data && data.length > 0) {
      const { data: existingData } = await (supabase as any)
        .from("memory_palace_locations")
        .select("*")
        .eq("user_id", user.id)
        .eq("list_id", listId);
      
      if (existingData) {
        const palaceMap: Record<string, any> = {};
        existingData.forEach((item: any) => {
          palaceMap[item.verse_id] = item;
        });
        setPalaceData(palaceMap);
        
        const current = existingData.find((d: any) => d.verse_id === data[0].id);
        if (current) {
          setLocation(current.location_name || "");
          setVisualization(current.visualization || "");
        }
      }
    }
  };

  const saveLocation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const currentVerse = verses[currentIndex];
    
    const { error } = await (supabase as any)
      .from("memory_palace_locations")
      .upsert({
        user_id: user.id,
        list_id: listId,
        verse_id: currentVerse.id,
        verse_reference: currentVerse.verse_reference,
        verse_text: currentVerse.verse_text,
        location_name: location,
        visualization: visualization,
        order_index: currentIndex
      }, {
        onConflict: "user_id,verse_id"
      });

    if (error) {
      toast.error("Failed to save location");
      return;
    }

    toast.success("Location saved!");
    
    if (currentIndex < verses.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      const nextData = palaceData[verses[nextIndex].id];
      setLocation(nextData?.location_name || "");
      setVisualization(nextData?.visualization || "");
    } else {
      navigate(`/memory/palace-practice/${listId}`);
    }
  };

  if (verses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Loading verses...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentVerse = verses[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Navigation />
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/memory")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-sm font-medium">
            {currentIndex + 1} / {verses.length}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <CardTitle>Build Your Memory Palace</CardTitle>
            </div>
            <CardDescription>
              Associate each verse with a specific location in your imaginary palace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg space-y-2">
              <p className="font-semibold text-primary">{currentVerse.verse_reference}</p>
              <p className="text-sm">{currentVerse.verse_text}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location in Your Palace
                </label>
                <Textarea
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., The front door, the living room couch, the kitchen window..."
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  Choose a specific, memorable location you can visualize clearly
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Visual Association</label>
                <Textarea
                  value={visualization}
                  onChange={(e) => setVisualization(e.target.value)}
                  placeholder="Describe a vivid, memorable image connecting this verse to the location..."
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Make it bizarre, emotional, or exaggerated to make it stick!
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                  💡 Memory Palace Tip
                </p>
                <p className="text-xs text-muted-foreground">
                  The weirder and more vivid your visualization, the better you'll remember it. 
                  Use all your senses - what do you see, hear, smell, or feel in this location?
                </p>
              </div>
            </div>

            <Button
              onClick={saveLocation}
              disabled={!location.trim() || !visualization.trim()}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              {currentIndex < verses.length - 1 ? "Save & Next" : "Save & Practice"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
