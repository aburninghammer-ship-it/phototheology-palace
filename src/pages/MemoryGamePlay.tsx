import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Gamepad2, Shuffle, Type } from "lucide-react";
import { toast } from "sonner";

export default function MemoryGamePlay() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any>(null);
  const [verses, setVerses] = useState<any[]>([]);

  useEffect(() => {
    if (listId) {
      fetchData();
    }
  }, [listId]);

  const fetchData = async () => {
    try {
      const [listRes, versesRes] = await Promise.all([
        supabase
          .from("memory_verse_lists")
          .select("*")
          .eq("id", listId)
          .single(),
        supabase
          .from("memory_verse_list_items")
          .select("*")
          .eq("list_id", listId)
          .order("order_index"),
      ]);

      if (listRes.error) throw listRes.error;
      if (versesRes.error) throw versesRes.error;

      setList(listRes.data);
      setVerses(versesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load list");
      navigate("/memory");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = (gameType: string) => {
    navigate(`/memory/game/${listId}/${gameType}`);
  };

  if (loading) return null;

  if (verses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Verses Yet</CardTitle>
            <CardDescription>
              This list doesn't have any verses. Add some verses to start playing!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/memory")}>
                Back to Memory
              </Button>
              <Button onClick={() => navigate(`/memory/list/${listId}`)}>
                Add Verses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/memory")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Memory
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{list?.title}</h1>
          <p className="text-muted-foreground">
            {verses.length} verses • {list?.bible_version.toUpperCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Letter Game */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStartGame("first-letter")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>First Letter</CardTitle>
                  <CardDescription>Fill in words from first letters</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See the first letter of each word and type the complete verse
              </p>
            </CardContent>
          </Card>

          {/* Fill in the Blanks Game */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStartGame("fill-blanks")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Type className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Fill the Blanks</CardTitle>
                  <CardDescription>Complete the missing words</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fill in the missing words to complete the verse
              </p>
            </CardContent>
          </Card>

          {/* Rearrange Game */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStartGame("rearrange")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Shuffle className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Rearrange</CardTitle>
                  <CardDescription>Put words in correct order</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Drag and drop words to arrange them in the correct order
              </p>
            </CardContent>
          </Card>

          {/* Type First Letter Game */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStartGame("type-first-letter")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Gamepad2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle>Type First Letters</CardTitle>
                  <CardDescription>Final mastery test</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Type only the first letter of each word without hints
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
