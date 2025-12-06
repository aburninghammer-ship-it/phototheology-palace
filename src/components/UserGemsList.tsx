import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Gem, Plus, Trash2, Loader2, FolderOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExportToStudyButton } from "@/components/ExportToStudyButton";

interface UserGem {
  id: string;
  gem_name: string;
  gem_content: string;
  created_at: string;
  category?: string;
}

interface UserGemsListProps {
  floorNumber: number;
  roomId: string;
}

export function UserGemsList({ floorNumber, roomId }: UserGemsListProps) {
  const { user } = useAuth();
  const [gems, setGems] = useState<UserGem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [gemName, setGemName] = useState("");
  const [gemContent, setGemContent] = useState("");

  useEffect(() => {
    if (user) {
      fetchGems();
    }
  }, [user, floorNumber, roomId]);

  const fetchGems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_gems")
        .select("*")
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .eq("floor_number", floorNumber)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGems(data || []);
    } catch (error) {
      console.error("Error fetching gems:", error);
      toast.error("Failed to load your gems");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !gemName.trim() || !gemContent.trim()) return;

    try {
      setSubmitting(true);
      
      // Moderate content before saving
      const combinedContent = `${gemName.trim()} - ${gemContent.trim()}`;
      const { data: moderationData, error: moderationError } = await supabase.functions.invoke(
        "moderate-content",
        {
          body: {
            content: combinedContent,
            type: "text",
          },
        }
      );

      if (moderationError) {
        console.error("Moderation error:", moderationError);
        // Continue anyway if moderation fails
      } else if (moderationData && !moderationData.safe) {
        toast.error(`Content not allowed: ${moderationData.reason}`);
        setSubmitting(false);
        return;
      }
      
      // Categorize the gem using AI
      let category = "Other";
      try {
        const { data: categoryData, error: categoryError } = await supabase.functions.invoke(
          "categorize-gem",
          {
            body: {
              gemName: gemName.trim(),
              gemContent: gemContent.trim(),
            },
          }
        );

        if (!categoryError && categoryData?.category) {
          category = categoryData.category;
        }
      } catch (catError) {
        console.error("Error categorizing gem:", catError);
        // Continue with default category if categorization fails
      }

      const { error } = await supabase
        .from("user_gems")
        .insert({
          user_id: user.id,
          gem_name: gemName.trim(),
          gem_content: gemContent.trim(),
          room_id: roomId,
          floor_number: floorNumber,
          category: category,
        });

      if (error) throw error;

      toast.success(`Gem added to ${category}!`);
      setGemName("");
      setGemContent("");
      setShowForm(false);
      fetchGems();
    } catch (error) {
      console.error("Error adding gem:", error);
      toast.error("Failed to add gem");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (gemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_gems")
        .delete()
        .eq("id", gemId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Gem deleted");
      fetchGems();
    } catch (error) {
      console.error("Error deleting gem:", error);
      toast.error("Failed to delete gem");
    }
  };

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Sign in to create and save your own gems!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-primary" />
            <CardTitle>Your Gems Collection</CardTitle>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            variant={showForm ? "outline" : "default"}
          >
            <Plus className="h-4 w-4 mr-1" />
            {showForm ? "Cancel" : "Add Gem"}
          </Button>
        </div>
        <CardDescription>
          Store your biblical insights and discoveries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-accent/5">
            <div className="space-y-2">
              <Label htmlFor="gem-name">Gem Name *</Label>
              <Input
                id="gem-name"
                value={gemName}
                onChange={(e) => setGemName(e.target.value)}
                placeholder="e.g., David's Five Stones"
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gem-content">Gem Content *</Label>
              <Textarea
                id="gem-content"
                value={gemContent}
                onChange={(e) => setGemContent(e.target.value)}
                placeholder="Describe your biblical insight or discovery..."
                required
                rows={4}
                className="resize-none"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Gem className="h-4 w-4 mr-2" />
                  Save Gem
                </>
              )}
            </Button>
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : gems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Gem className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No gems saved yet. Start collecting your insights!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(() => {
              // Group gems by category
              const gemsByCategory = gems.reduce((acc, gem) => {
                const cat = gem.category || "Other";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(gem);
                return acc;
              }, {} as Record<string, typeof gems>);

              // Sort categories alphabetically
              const sortedCategories = Object.keys(gemsByCategory).sort();

              return sortedCategories.map((category) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                    <Gem className="h-5 w-5" />
                    {category}
                  </h3>
                  <div className="space-y-3 ml-2">
                    {gemsByCategory[category].map((gem) => (
                      <div
                        key={gem.id}
                        className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-base">
                            {gem.gem_name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <ExportToStudyButton
                              type="gem"
                              title={gem.gem_name}
                              content={gem.gem_content}
                              metadata={{
                                room: roomId.toUpperCase(),
                                floor: `Floor ${floorNumber}`,
                              }}
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-sky-500 hover:text-sky-400 hover:bg-sky-500/10"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(gem.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {gem.gem_content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Added {new Date(gem.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
