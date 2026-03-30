import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Download, Copy, Check, Flame, Trophy, Gem, BookOpen, Swords, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ShareToProfileButton } from "@/components/social/ShareToProfileButton";

const BELT_INFO: Record<string, { label: string; emoji: string; gradient: string; textColor: string }> = {
  white: { label: "White Belt", emoji: "🥋", gradient: "from-gray-200 to-gray-400", textColor: "text-gray-800" },
  blue: { label: "Blue Belt", emoji: "🔵", gradient: "from-blue-400 to-blue-600", textColor: "text-white" },
  red: { label: "Red Belt", emoji: "🔴", gradient: "from-red-500 to-red-700", textColor: "text-white" },
  gold: { label: "Gold Belt", emoji: "🏅", gradient: "from-amber-400 to-amber-600", textColor: "text-white" },
  purple: { label: "Purple Belt", emoji: "🟣", gradient: "from-purple-500 to-purple-700", textColor: "text-white" },
  black_candidate: { label: "Black Candidate", emoji: "⚫", gradient: "from-gray-700 to-gray-900", textColor: "text-white" },
  black: { label: "Black Belt Master", emoji: "👑", gradient: "from-gray-900 to-black", textColor: "text-amber-400" },
};

interface ProgressData {
  displayName: string;
  avatarUrl: string | null;
  beltTitle: string;
  totalXp: number;
  floorsCompleted: number;
  currentFloor: number;
  roomsMastered: number;
  streakDays: number;
  gemsCount: number;
  chaptersRead: number;
}

export const ShareableProgressCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profileRes, masteryRes, streakRes, gemsRes, readingRes, roomsRes] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url, master_title").eq("id", user.id).single(),
        supabase.from("global_master_titles").select("total_xp, floors_completed, current_floor").eq("user_id", user.id).maybeSingle(),
        supabase.from("mastery_streaks").select("current_streak").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_gems").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reading_streaks").select("total_chapters_read").eq("user_id", user.id).maybeSingle(),
        supabase.from("room_mastery_levels").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("mastery_level", 5),
      ]);

      setData({
        displayName: profileRes.data?.display_name || "Scholar",
        avatarUrl: profileRes.data?.avatar_url || null,
        beltTitle: profileRes.data?.master_title || "white",
        totalXp: masteryRes.data?.total_xp || 0,
        floorsCompleted: masteryRes.data?.floors_completed || 0,
        currentFloor: masteryRes.data?.current_floor || 1,
        roomsMastered: roomsRes.count || 0,
        streakDays: streakRes.data?.current_streak || 0,
        gemsCount: gemsRes.count || 0,
        chaptersRead: readingRes.data?.total_chapters_read || 0,
      });
    } catch (err) {
      console.error("Error fetching progress:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open) fetchProgress();
  }, [open, fetchProgress]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas" as any).catch(() => ({ default: null }));
      if (!html2canvas) {
        // Fallback: copy text
        handleCopyText();
        return;
      }
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement("a");
      link.download = "phototheology-progress.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({ title: "Card downloaded!", description: "Share it on social media 🎉" });
    } catch {
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    if (!data) return;
    const belt = BELT_INFO[data.beltTitle] || BELT_INFO.white;
    const text = `${belt.emoji} ${data.displayName} — ${belt.label}\n🏛️ Floor ${data.currentFloor}/8 | ${data.roomsMastered} rooms mastered\n⚡ ${data.totalXp.toLocaleString()} XP | 🔥 ${data.streakDays}-day streak\n💎 ${data.gemsCount} gems | 📖 ${data.chaptersRead} chapters\n\n#Phototheology #BibleStudy`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Progress copied!", description: "Paste it anywhere to share" });
  };

  const handleShare = async () => {
    if (!data) return;
    const belt = BELT_INFO[data.beltTitle] || BELT_INFO.white;
    const text = `${belt.emoji} ${data.displayName} — ${belt.label}\n🏛️ Floor ${data.currentFloor}/8 | ${data.roomsMastered} rooms mastered\n⚡ ${data.totalXp.toLocaleString()} XP | 🔥 ${data.streakDays}-day streak\n💎 ${data.gemsCount} gems | 📖 ${data.chaptersRead} chapters\n\n#Phototheology #BibleStudy`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Phototheology Progress", text });
      } catch {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  const belt = data ? (BELT_INFO[data.beltTitle] || BELT_INFO.white) : BELT_INFO.white;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share Progress</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Progress</DialogTitle>
        </DialogHeader>

        {loading || !data ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* The visual card */}
            <div
              ref={cardRef}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${belt.gradient} p-6 shadow-xl`}
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-6xl">{belt.emoji}</div>
                <div className="absolute bottom-4 left-4 text-4xl opacity-50">🏛️</div>
              </div>

              <div className={`relative z-10 ${belt.textColor}`}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  {data.avatarUrl ? (
                    <img src={data.avatarUrl} alt="" className="h-12 w-12 rounded-full border-2 border-white/30 object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center text-xl font-bold">
                      {data.displayName[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold leading-tight">{data.displayName}</h3>
                    <p className="text-sm opacity-80">{belt.label}</p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <StatBlock icon={<Crown className="h-4 w-4" />} label="Floor" value={`${data.currentFloor}/8`} />
                  <StatBlock icon={<Swords className="h-4 w-4" />} label="Rooms Mastered" value={data.roomsMastered.toString()} />
                  <StatBlock icon={<Trophy className="h-4 w-4" />} label="Total XP" value={data.totalXp.toLocaleString()} />
                  <StatBlock icon={<Flame className="h-4 w-4" />} label="Streak" value={`${data.streakDays} days`} />
                  <StatBlock icon={<Gem className="h-4 w-4" />} label="Gems" value={data.gemsCount.toString()} />
                  <StatBlock icon={<BookOpen className="h-4 w-4" />} label="Chapters" value={data.chaptersRead.toString()} />
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs opacity-60 font-medium tracking-wider uppercase">Phototheology<span style={{ color: "#e8e8e8" }}>OS</span> <span style={{ color: "rgba(180, 220, 255, 0.85)" }}>Eden</span></span>
                  <span className="text-xs opacity-60">phototheologybible.com</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={handleCopyText}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Text"}
              </Button>
              <Button variant="default" className="flex-1 gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Save Image
              </Button>
            </div>
            {data && (
              <ShareToProfileButton
                sharedContent={{
                  source_type: "progress_card",
                  source_title: `${data.displayName}'s Progress`,
                  source_excerpt: `${data.beltTitle} • ${data.totalXp.toLocaleString()} XP • ${data.streakDays} day streak • ${data.floorsCompleted} floors completed`,
                  source_metadata: {
                    beltTitle: data.beltTitle,
                    totalXp: data.totalXp,
                    streakDays: data.streakDays,
                    floorsCompleted: data.floorsCompleted,
                    roomsMastered: data.roomsMastered,
                  },
                }}
                className="w-full"
                label="Share to Profile"
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

function StatBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
      <div className="flex items-center gap-1.5 mb-0.5">
        {icon}
        <span className="text-[10px] uppercase tracking-wider opacity-70">{label}</span>
      </div>
      <div className="text-lg font-bold leading-tight">{value}</div>
    </div>
  );
}
