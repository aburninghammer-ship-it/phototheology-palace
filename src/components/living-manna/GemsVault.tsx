import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Gem,
  Search,
  Loader2,
  Trash2,
  BookOpen,
  Calendar,
  Quote,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface GemWithDetails {
  id: string;
  sermon_id: string;
  insight_id: string | null;
  custom_note: string | null;
  created_at: string;
  sermon_title?: string;
  sermon_speaker?: string;
  insight_content?: string;
  insight_type?: string;
  palace_room?: string;
}

// Palace room color mapping
const PALACE_ROOM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "outer_court": { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" },
  "holy_place": { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/30" },
  "most_holy": { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
  "red_room": { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30" },
  "orange_room": { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/30" },
  "yellow_room": { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  "green_room": { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" },
  "blue_room": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
  "indigo_room": { bg: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/30" },
  "violet_room": { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/30" },
};

function formatRoomName(room: string | null): string {
  if (!room) return "General";
  return room.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getRoomStyles(room: string | null) {
  return PALACE_ROOM_COLORS[room || ""] || { bg: "bg-muted", text: "text-foreground", border: "border-border" };
}

export function GemsVault() {
  const { user } = useAuth();
  const [gems, setGems] = useState<GemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadGems();
    }
  }, [user]);

  const loadGems = async () => {
    if (!user) return;

    try {
      // First get the gems
      const { data: gemsData, error: gemsError } = await (supabase
        .from("lm_sermon_gems" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }) as any);

      if (gemsError) throw gemsError;

      if (!gemsData || gemsData.length === 0) {
        setGems([]);
        setLoading(false);
        return;
      }

      // Get sermon details
      const sermonIds = [...new Set(gemsData.map((g: any) => g.sermon_id))];
      const { data: sermonsData } = await (supabase
        .from("lm_sermons" as any)
        .select("id, title, speaker")
        .in("id", sermonIds) as any);

      // Get insight details for gems that have insights
      const insightIds = gemsData.filter((g: any) => g.insight_id).map((g: any) => g.insight_id);
      let insightsData: any[] = [];
      if (insightIds.length > 0) {
        const { data } = await (supabase
          .from("lm_sermon_insights" as any)
          .select("id, content, insight_type, palace_room")
          .in("id", insightIds) as any);
        insightsData = data || [];
      }

      // Combine the data
      const enrichedGems: GemWithDetails[] = gemsData.map((gem: any) => {
        const sermon = sermonsData?.find((s: any) => s.id === gem.sermon_id);
        const insight = insightsData.find((i: any) => i.id === gem.insight_id);

        return {
          ...gem,
          sermon_title: sermon?.title,
          sermon_speaker: sermon?.speaker,
          insight_content: insight?.content,
          insight_type: insight?.insight_type,
          palace_room: insight?.palace_room,
        };
      });

      setGems(enrichedGems);
    } catch (error) {
      console.error("Error loading gems:", error);
      toast.error("Failed to load gems");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gemId: string) => {
    if (!user) return;

    setDeleting(gemId);
    try {
      const { error } = await (supabase
        .from("lm_sermon_gems" as any)
        .delete()
        .eq("id", gemId)
        .eq("user_id", user.id) as any);

      if (error) throw error;

      setGems(gems.filter(g => g.id !== gemId));
      toast.success("Gem removed from vault");
    } catch (error) {
      console.error("Error deleting gem:", error);
      toast.error("Failed to remove gem");
    } finally {
      setDeleting(null);
    }
  };

  const filteredGems = gems.filter(gem => {
    const searchLower = searchQuery.toLowerCase();
    return (
      gem.sermon_title?.toLowerCase().includes(searchLower) ||
      gem.custom_note?.toLowerCase().includes(searchLower) ||
      gem.insight_content?.toLowerCase().includes(searchLower) ||
      gem.sermon_speaker?.toLowerCase().includes(searchLower)
    );
  });

  // Group gems by sermon
  const gemsBySermon = filteredGems.reduce((acc, gem) => {
    const sermonId = gem.sermon_id;
    if (!acc[sermonId]) {
      acc[sermonId] = {
        title: gem.sermon_title || "Unknown Sermon",
        speaker: gem.sermon_speaker || "Unknown Speaker",
        gems: [],
      };
    }
    acc[sermonId].gems.push(gem);
    return acc;
  }, {} as Record<string, { title: string; speaker: string; gems: GemWithDetails[] }>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass" className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Gem className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-xl">Your Gems Vault</CardTitle>
              <CardDescription>
                {gems.length} gem{gems.length !== 1 ? "s" : ""} saved from sermon deep dives
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {gems.length === 0 ? (
        <Card variant="glass">
          <CardContent className="py-12 text-center">
            <Gem className="h-16 w-16 mx-auto text-amber-500/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Gems Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Start exploring sermon deep dives and save your favorite insights as gems
            </p>
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Explore Sermons
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your gems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Gems List */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {Object.entries(gemsBySermon).map(([sermonId, { title, speaker, gems: sermonGems }]) => (
                <div key={sermonId}>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{title}</h3>
                    <span className="text-sm text-muted-foreground">• {speaker}</span>
                  </div>

                  <div className="space-y-3 pl-6">
                    {sermonGems.map((gem) => {
                      const roomStyles = getRoomStyles(gem.palace_room);

                      return (
                        <Card key={gem.id} className={`border-l-4 ${roomStyles.border}`}>
                          <CardContent className="py-4">
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-full ${roomStyles.bg} shrink-0`}>
                                {gem.insight_id ? (
                                  <Lightbulb className={`h-4 w-4 ${roomStyles.text}`} />
                                ) : (
                                  <Quote className={`h-4 w-4 ${roomStyles.text}`} />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-foreground">
                                  {gem.insight_content || gem.custom_note}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                  {gem.palace_room && (
                                    <Badge variant="outline" className="text-xs">
                                      {formatRoomName(gem.palace_room)}
                                    </Badge>
                                  )}
                                  {gem.insight_type && (
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {gem.insight_type.replace(/_/g, " ")}
                                    </Badge>
                                  )}
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(gem.created_at).toLocaleDateString()}
                                  </span>
                                </div>

                                {gem.custom_note && gem.insight_content && (
                                  <div className="mt-3 p-2 bg-muted/50 rounded text-sm text-muted-foreground">
                                    <span className="font-medium">Your note:</span> {gem.custom_note}
                                  </div>
                                )}
                              </div>

                              <Button
                                size="icon"
                                variant="ghost"
                                className="shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(gem.id)}
                                disabled={deleting === gem.id}
                              >
                                {deleting === gem.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
