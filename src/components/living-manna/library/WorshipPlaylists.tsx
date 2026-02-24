import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Music, Play, Plus, Send, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { toast } from "sonner";

interface WorshipPlaylistsProps { churchId: string; }

export function WorshipPlaylists({ churchId }: WorshipPlaylistsProps) {
  const { user } = useAuth();
  const { role } = useChurchMembership();
  const isLeader = role === "admin" || role === "leader";
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestion, setSuggestion] = useState({ title: "", artist: "", platform_url: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (churchId) loadPlaylists(); }, [churchId]);

  const loadPlaylists = async () => {
    try {
      const { data } = await (supabase as any).from("church_worship_playlists")
        .select("*").eq("church_id", churchId).eq("is_active", true).order("week_date", { ascending: false });
      setPlaylists(data || []);
      if (data?.length > 0) loadSongs(data[0]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const loadSongs = async (playlist: any) => {
    setSelectedPlaylist(playlist);
    const { data } = await (supabase as any).from("church_playlist_songs")
      .select("*").eq("playlist_id", playlist.id).order("sort_order");
    setSongs(data || []);
  };

  const handleSuggest = async () => {
    if (!suggestion.title) { toast.error("Song title is required"); return; }
    setSubmitting(true);
    try {
      await (supabase as any).from("church_song_suggestions").insert({
        church_id: churchId, suggested_by: user!.id, ...suggestion,
      });
      toast.success("Song suggested! Leaders will review it.");
      setShowSuggest(false);
      setSuggestion({ title: "", artist: "", platform_url: "", reason: "" });
    } catch (err: any) { toast.error(err.message); } finally { setSubmitting(false); }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "youtube": return "bg-red-500/10 text-red-500";
      case "spotify": return "bg-green-500/10 text-green-500";
      case "apple_music": return "bg-pink-500/10 text-pink-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  if (loading) return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Worship Playlists</CardTitle>
            </div>
            <Dialog open={showSuggest} onOpenChange={setShowSuggest}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Send className="h-4 w-4 mr-1" />Suggest a Song</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Suggest a Song</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Song Title</Label><Input value={suggestion.title} onChange={(e) => setSuggestion({ ...suggestion, title: e.target.value })} /></div>
                  <div><Label>Artist</Label><Input value={suggestion.artist} onChange={(e) => setSuggestion({ ...suggestion, artist: e.target.value })} /></div>
                  <div><Label>Link (YouTube/Spotify)</Label><Input value={suggestion.platform_url} onChange={(e) => setSuggestion({ ...suggestion, platform_url: e.target.value })} placeholder="https://..." /></div>
                  <div><Label>Why this song?</Label><Textarea value={suggestion.reason} onChange={(e) => setSuggestion({ ...suggestion, reason: e.target.value })} placeholder="Share why you love this song..." /></div>
                  <Button onClick={handleSuggest} disabled={submitting} className="w-full">{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Submit Suggestion</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {playlists.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No playlists yet. Check back soon!</p>
          ) : (
            <div className="space-y-4">
              {/* Playlist selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {playlists.map((p) => (
                  <Button
                    key={p.id}
                    variant={selectedPlaylist?.id === p.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => loadSongs(p)}
                    className="whitespace-nowrap"
                  >
                    {p.title}
                  </Button>
                ))}
              </div>

              {selectedPlaylist && (
                <div>
                  {selectedPlaylist.theme && (
                    <p className="text-sm text-muted-foreground mb-3">Theme: {selectedPlaylist.theme}</p>
                  )}
                  <div className="space-y-2">
                    {songs.map((song, i) => (
                      <div key={song.id} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
                        <span className="text-sm text-muted-foreground w-6 text-center">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{song.title}</p>
                          {song.artist && <p className="text-xs text-muted-foreground">{song.artist}</p>}
                        </div>
                        {song.platform && <Badge variant="outline" className={`text-[10px] ${getPlatformColor(song.platform)}`}>{song.platform}</Badge>}
                        {song.platform_url && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a href={song.platform_url} target="_blank" rel="noopener noreferrer"><Play className="h-3.5 w-3.5" /></a>
                          </Button>
                        )}
                      </div>
                    ))}
                    {songs.length === 0 && <p className="text-center text-muted-foreground py-4 text-sm">No songs in this playlist yet.</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
