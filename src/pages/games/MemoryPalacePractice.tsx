import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Check, Home } from "lucide-react";
import { toast } from "sonner";

export default function MemoryPalacePractice() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVerse, setShowVerse] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadPalace();
  }, [listId]);

  const loadPalace = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await (supabase as any)
      .from("memory_palace_locations")
      .select("*")
      .eq("user_id", user.id)
      .eq("list_id", listId)
      .order("order_index");

    if (error) {
      toast.error("Failed to load memory palace");
      navigate("/memory");
      return;
    }

    if (!data || data.length === 0) {
      toast.error("No memory palace found. Build one first!");
      navigate(`/memory/palace-builder/${listId}`);
      return;
    }

    setLocations(data);
  };

  const handleNext = () => {
    if (currentIndex < locations.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowVerse(false);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowVerse(false);
    }
  };

  if (locations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Loading your memory palace...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🏛️ Palace Walk Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-6">
                  You've walked through all {locations.length} locations in your memory palace.
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => navigate("/memory")} variant="outline" className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Lists
                </Button>
                <Button onClick={() => window.location.reload()} className="flex-1">
                  Practice Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const current = locations[currentIndex];

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
            {currentIndex + 1} / {locations.length}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <CardTitle>Walk Through Your Palace</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 rounded-lg space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Location:</p>
              <p className="text-xl font-semibold">{current.location_name}</p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Your Visualization:</p>
              <p className="text-sm">{current.visualization}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">The Verse:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVerse(!showVerse)}
                >
                  {showVerse ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Reveal
                    </>
                  )}
                </Button>
              </div>

              {showVerse ? (
                <div className="bg-background border-2 border-primary/20 p-6 rounded-lg space-y-2 animate-in fade-in-50 duration-300">
                  <p className="font-semibold text-primary">{current.verse_reference}</p>
                  <p className="text-sm">{current.verse_text}</p>
                </div>
              ) : (
                <div className="bg-muted/30 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <p className="text-center text-sm text-muted-foreground">
                    Try to recall the verse from your visualization, then reveal to check
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                variant="outline"
                className="flex-1"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1"
              >
                {currentIndex < locations.length - 1 ? "Next Location" : "Complete"}
                {currentIndex === locations.length - 1 && <Check className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
