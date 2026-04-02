import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import { useImmersiveMode, type ImmersiveTrack } from "@/hooks/useImmersiveMode";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Compass,
  Headphones,
  Maximize2,
  Search,
  ListPlus,
  Check,
  Heart,
  Flame,
  Shield,
  Crown,
  Library,
  Music,
  GraduationCap,
  Star,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AddToPlaylistButton } from "@/components/audio/AddToPlaylistButton";
import { PlaylistPanel } from "@/components/audio/PlaylistPanel";
import { AudioContentBuilder } from "@/components/audio/AudioContentBuilder";
import { usePlaylist } from "@/hooks/usePlaylist";
import { AUDIO_LIBRARY, AUDIO_CATEGORIES, type AudioEntry } from "@/data/audioLibraryData";

// ── Icon Lookup ─────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen, Compass, Shield, Heart, Flame, Crown, GraduationCap, Library, Music, Star,
};

function resolveIcon(iconName: string, className: string): React.ReactNode {
  const Icon = ICON_MAP[iconName];
  if (!Icon) return null;
  return <Icon className={className} />;
}

// ── Resolved catalog (shared data + JSX icons) ──────────────────────────────

interface ResolvedAudioEntry extends AudioEntry {
  icon: React.ReactNode;
}

const AUDIO_CATALOG: ResolvedAudioEntry[] = AUDIO_LIBRARY.filter(
  (e) => e.category !== "music"
).map((e) => ({
  ...e,
  icon: resolveIcon(e.iconName, "h-5 w-5"),
}));

const CATEGORIES = AUDIO_CATEGORIES.filter((c) => c.id !== "music").map((c) => ({
  id: c.id,
  label: c.label,
  icon: resolveIcon(c.iconName, "h-4 w-4"),
}));

// ── Page Component ──────────────────────────────────────────────────────────

export default function AudioLibrary() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const immersive = useImmersiveMode();
  const { createPlaylist, playlists } = usePlaylist();
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleImmerse = (item: ResolvedAudioEntry) => {
    const track: ImmersiveTrack = {
      id: item.id,
      title: item.title,
      subtitle: item.description,
      type: item.category as ImmersiveTrack["type"],
      displayText: item.audioMeta?.text,
    };
    immersive.openImmersive([track]);
  };

  const filtered = useMemo(() => {
    return AUDIO_CATALOG.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { all: AUDIO_CATALOG.length };
    AUDIO_CATALOG.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Headphones className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Audio Library</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Curated audio experiences — commentaries, Palace tours, apologetics training,
            devotionals, and study sessions. Add up to 10 tracks per playlist.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="outline" className="gap-1">
              <Music className="h-3 w-3" />
              {AUDIO_CATALOG.length} tracks
            </Badge>
            <PlaylistPanel />
          </div>
        </div>

        {/* My Playlists Quick View */}
        <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListPlus className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-base">My Playlists</h2>
                <Badge variant="secondary" className="text-xs">{playlists.length}</Badge>
              </div>
              {showNewPlaylist ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Playlist name..."
                    className="h-8 w-40 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newPlaylistName.trim()) {
                        createPlaylist(newPlaylistName.trim());
                        setNewPlaylistName("");
                        setShowNewPlaylist(false);
                      }
                      if (e.key === "Escape") setShowNewPlaylist(false);
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      if (newPlaylistName.trim()) {
                        createPlaylist(newPlaylistName.trim());
                        setNewPlaylistName("");
                        setShowNewPlaylist(false);
                      }
                    }}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Create
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8" onClick={() => setShowNewPlaylist(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8"
                  onClick={() => setShowNewPlaylist(true)}
                >
                  <ListPlus className="h-3.5 w-3.5" />
                  New Playlist
                </Button>
              )}
            </div>
            {playlists.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Create your first playlist to start organizing audio content. You can add up to 10 tracks per playlist.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {playlists.map((pl) => (
                  <div
                    key={pl.id}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-background border hover:border-primary/40 transition-colors cursor-pointer"
                    onClick={() => {
                      // Open the playlist panel sheet
                      const trigger = document.querySelector('[title="My Playlists"]') as HTMLButtonElement;
                      if (trigger) trigger.click();
                    }}
                  >
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Headphones className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{pl.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(pl.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dynamic Builders */}
        <AudioContentBuilder />

        {/* Search */}
        <div className="relative mb-6 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2 justify-center flex-wrap">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5 whitespace-nowrap"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon}
                  {cat.label}
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 min-w-[20px] p-0 flex items-center justify-center text-[10px]"
                  >
                    {categoryCount[cat.id] || 0}
                  </Badge>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Results */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No audio found matching your search.</p>
            </motion.div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow border-2 hover:border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} text-white`}>
                          {item.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm leading-tight">{item.title}</h3>
                            {item.badge && (
                              <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] gap-1 px-1.5">
                              <Clock className="h-2.5 w-2.5" />
                              {item.duration}
                            </Badge>
                            <AddToPlaylistButton
                              title={item.title}
                              description={item.description}
                              audioType={item.category}
                              audioMeta={item.audioMeta}
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1 text-amber-400 hover:bg-amber-500/10"
                              onClick={() => handleImmerse(item)}
                            >
                              <Maximize2 className="h-3 w-3" />
                              Immerse
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="text-center mt-10 mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            New content is added regularly. Check back for fresh commentaries, studies, and training.
          </p>
          <Badge variant="outline" className="gap-1">
            <Star className="h-3 w-3 text-amber-500" />
            Premium users get access to extended audio content
          </Badge>
        </div>
      </div>

      <Footer />

      <ImmersiveAudioPlayer
        isOpen={immersive.isOpen}
        onClose={immersive.closeImmersive}
        tracks={immersive.queue.tracks}
        currentIndex={immersive.queue.currentIndex}
        onNextTrack={immersive.nextTrack}
        onPrevTrack={immersive.prevTrack}
        hasNext={immersive.hasNext}
        hasPrev={immersive.hasPrev}
        ambientMusicEnabled={immersive.ambientMusicEnabled}
        ambientVolume={immersive.ambientVolume}
        continuousPlay={immersive.continuousPlay}
        onSetAmbientMusic={immersive.setAmbientMusic}
        onSetAmbientVolume={immersive.setAmbientVolume}
        onSetContinuousPlay={immersive.setContinuousPlay}
      />
    </div>
  );
}
