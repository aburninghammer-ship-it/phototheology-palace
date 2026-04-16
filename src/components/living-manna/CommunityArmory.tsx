import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Swords, Loader2, Heart, ArrowLeft, Search,
  Sparkles, Trophy, Users, FlaskConical, Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import { DEFENSE_TOPICS } from "@/data/defenseModeOpponents";

interface ArmoryWeapon {
  id: string;
  user_id: string;
  topic: string;
  weapon_name: string;
  weapon_emoji: string;
  argument: string;
  analysis: string;
  score: number;
  likes: number;
  is_curated: boolean;
  created_at: string;
  user_liked?: boolean;
}

interface CommunityArmoryProps {
  onGoToForge: () => void;
}

const TOPIC_FILTERS = [
  "All",
  "The Sabbath",
  "God's Law",
  "Hellfire / Annihilationism",
  "State of the Dead",
  "Sanctuary",
  "Second Coming",
  "Prophecy",
  "The Papacy / Antichrist",
  "Once Saved Always Saved",
  "The Trinity",
  "Speaking in Tongues",
  "The Rapture",
  "Health & Temperance",
  "Baptism",
  "Three Angels' Messages",
];

export function CommunityArmory({ onGoToForge }: CommunityArmoryProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [weapons, setWeapons] = useState<ArmoryWeapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeapon, setSelectedWeapon] = useState<ArmoryWeapon | null>(null);
  const [filterTopic, setFilterTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likingId, setLikingId] = useState<string | null>(null);

  const fetchWeapons = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("community_armory")
        .select("*")
        .order("is_curated", { ascending: false })
        .order("likes", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(200);

      if (filterTopic !== "All") {
        query = query.eq("topic", filterTopic);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Check which ones the user has liked
      let likedIds: Set<string> = new Set();
      if (user && data && data.length > 0) {
        const { data: likes } = await supabase
          .from("community_armory_likes")
          .select("weapon_id")
          .eq("user_id", user.id);
        if (likes) {
          likedIds = new Set(likes.map((l: { weapon_id: string }) => l.weapon_id));
        }
      }

      setWeapons(
        (data || []).map((w: ArmoryWeapon) => ({
          ...w,
          user_liked: likedIds.has(w.id),
        }))
      );
    } catch (err) {
      console.error("Failed to fetch armory:", err);
    } finally {
      setLoading(false);
    }
  }, [filterTopic, user]);

  useEffect(() => {
    fetchWeapons();
  }, [fetchWeapons]);

  const toggleLike = async (weaponId: string) => {
    if (!user || likingId) return;
    setLikingId(weaponId);

    const weapon = weapons.find((w) => w.id === weaponId);
    if (!weapon) { setLikingId(null); return; }

    try {
      if (weapon.user_liked) {
        // Unlike
        await supabase
          .from("community_armory_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("weapon_id", weaponId);
        // Decrement likes count
        await supabase
          .from("community_armory")
          .update({ likes: Math.max(0, weapon.likes - 1) })
          .eq("id", weaponId);
        setWeapons((prev) =>
          prev.map((w) =>
            w.id === weaponId ? { ...w, likes: Math.max(0, w.likes - 1), user_liked: false } : w
          )
        );
      } else {
        // Like
        await supabase
          .from("community_armory_likes")
          .insert({ user_id: user.id, weapon_id: weaponId });
        await supabase
          .from("community_armory")
          .update({ likes: weapon.likes + 1 })
          .eq("id", weaponId);
        setWeapons((prev) =>
          prev.map((w) =>
            w.id === weaponId ? { ...w, likes: w.likes + 1, user_liked: true } : w
          )
        );
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikingId(null);
    }
  };

  const filtered = weapons.filter((w) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        w.weapon_name.toLowerCase().includes(q) ||
        w.topic.toLowerCase().includes(q) ||
        w.argument.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Detail view
  if (selectedWeapon) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedWeapon(null)}
          className="text-amber-400 hover:text-amber-300"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Armory
        </Button>

        <Card variant="glass" className="border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-orange-950/20">
          <CardContent className="p-5 space-y-4">
            <div className="text-center space-y-2">
              <span className="text-5xl block">{selectedWeapon.weapon_emoji}</span>
              <h4 className="text-lg font-bold text-amber-300">{selectedWeapon.weapon_name}</h4>
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-amber-600/30 text-amber-300 border-amber-500/30">
                  {selectedWeapon.topic}
                </Badge>
                <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                  <Trophy className="h-3 w-3 mr-1" />{selectedWeapon.score}/10
                </Badge>
                {selectedWeapon.is_curated && (
                  <Badge className="bg-purple-600/30 text-purple-300 border-purple-500/30">
                    <Sparkles className="h-3 w-3 mr-1" />Curated
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <button
                  onClick={() => toggleLike(selectedWeapon.id)}
                  disabled={!user || likingId === selectedWeapon.id}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                    selectedWeapon.user_liked
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-muted/30 text-muted-foreground hover:text-red-400 border border-border/50"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${selectedWeapon.user_liked ? "fill-red-400" : ""}`} />
                  {selectedWeapon.likes}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">The Argument</h5>
              <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed p-3 rounded-lg bg-black/20 border border-border/30">
                {selectedWeapon.argument}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Jeeves Analysis</h5>
                <QuickAudioButton
                  text={selectedWeapon.analysis}
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 text-amber-400/60 hover:text-amber-400"
                />
              </div>
              <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed p-3 rounded-lg bg-black/20 border border-border/30">
                {selectedWeapon.analysis}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header & Mission */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Users className="h-6 w-6 text-amber-400" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
            The Community Armory
          </h3>
        </div>
        <div className="max-w-xl mx-auto space-y-2">
          <p className="text-sm text-foreground/80">
            A shared treasury of theological weapons forged by Living Manna warriors.
            Browse, study, and upvote the strongest defenses — or forge your own and contribute to the arsenal.
          </p>
          <div className="p-3 rounded-lg bg-gradient-to-r from-amber-950/30 to-orange-950/20 border border-amber-500/20">
            <p className="text-xs text-amber-300 leading-relaxed">
              <strong>🔥 Call to Arms:</strong> Don't just rehearse old arguments — <em>forge new ones</em>.
              The world doesn't need a hundred versions of the same Sabbath defense. Craft original,
              devastating, scripture-saturated weapons that make challengers pause and think.
              Every weapon you contribute strengthens every defender who draws from this armory.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search weapons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-1.5 pb-1">
            {TOPIC_FILTERS.map((topic) => (
              <Badge
                key={topic}
                variant={filterTopic === topic ? "default" : "outline"}
                className={`cursor-pointer text-xs py-1 px-2.5 whitespace-nowrap transition-all shrink-0 ${
                  filterTopic === topic
                    ? "bg-amber-600 text-white border-amber-600"
                    : "hover:bg-amber-600/10"
                }`}
                onClick={() => setFilterTopic(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Weapons Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-amber-950/40 border-2 border-amber-500/20 flex items-center justify-center">
            <Swords className="h-10 w-10 text-amber-500/40" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-foreground/70">
              {filterTopic !== "All" ? `No weapons yet for "${filterTopic}"` : "The Armory Awaits"}
            </h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Be the first to forge a weapon in this category. Go to the <strong className="text-cyan-400">Forge Weapon</strong> tab,
              craft an argument that scores 8/10 or higher, and share it with the community.
            </p>
          </div>
          <Button
            size="sm"
            onClick={onGoToForge}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            <FlaskConical className="h-4 w-4 mr-1" />
            Forge a Weapon
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{filtered.length} weapon{filtered.length !== 1 ? "s" : ""} in armory</span>
            <Button
              size="sm"
              variant="outline"
              onClick={onGoToForge}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <FlaskConical className="h-3.5 w-3.5 mr-1" />
              Forge & Share
            </Button>
          </div>

            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-2"} gap-4`}>
            {filtered.map((weapon) => (
              <motion.div
                key={weapon.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedWeapon(weapon)}
                className="cursor-pointer"
              >
                <Card
                  variant="glass"
                  className={`border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-black/40 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all h-full ${
                    weapon.is_curated ? "ring-1 ring-purple-500/30" : ""
                  }`}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header row */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-900/60 to-orange-900/40 border border-amber-500/30 flex items-center justify-center shadow-inner shrink-0">
                        <span className="text-xl">{weapon.weapon_emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm font-bold text-amber-300 leading-tight">{weapon.weapon_name}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] border-amber-500/20 text-amber-400/80">
                            {weapon.topic}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] border-amber-500/20 text-amber-400/70">
                            <Trophy className="h-2.5 w-2.5 mr-0.5" />{weapon.score}/10
                          </Badge>
                          {weapon.is_curated && (
                            <Badge className="text-[9px] bg-purple-600/20 text-purple-300 border-purple-500/20">
                              <Sparkles className="h-2.5 w-2.5 mr-0.5" />Curated
                            </Badge>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(weapon.id); }}
                        disabled={!user || likingId === weapon.id}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all shrink-0 ${
                          weapon.user_liked
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-muted/20 text-muted-foreground hover:text-red-400 border border-border/30"
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${weapon.user_liked ? "fill-red-400" : ""}`} />
                        {weapon.likes}
                      </button>
                    </div>

                    {/* Argument preview */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold text-amber-400/70 uppercase tracking-wider">The Argument</p>
                      <p className="text-xs text-foreground/80 leading-relaxed line-clamp-4">
                        {weapon.argument}
                      </p>
                    </div>

                    {/* Analysis preview */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold text-amber-400/70 uppercase tracking-wider">Jeeves Analysis</p>
                      <p className="text-xs text-foreground/60 leading-relaxed line-clamp-3">
                        {weapon.analysis}
                      </p>
                    </div>

                    <p className="text-[10px] text-amber-400/60 text-right">Tap to read full weapon →</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
