// ─── Personal Armory ────────────────────────────────────────────────────────
// Browse all forged weapons for the current user, grouped by avatar/apologist.

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, Swords, ChevronDown, ChevronUp, Loader2, Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RANK_CONFIG, getRankForDay, WAR_COLLEGE_TRACKS } from "@/data/aats/warCollegeTypes";

interface Weapon {
  id: string;
  avatar_id: string;
  day_number: number;
  weapon_text: string;
  score: number;
  sharpening_history: any[];
  forged_at: string;
}

interface PersonalArmoryProps {
  avatarId: string;
  avatarName: string;
  onBack: () => void;
}

export function PersonalArmory({ avatarId, avatarName, onBack }: PersonalArmoryProps) {
  const { user } = useAuth();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [collapsedAvatars, setCollapsedAvatars] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await (supabase as any)
        .from("war_college_weapons")
        .select("*")
        .eq("user_id", user.id)
        .order("day_number");
      setWeapons((data as Weapon[]) || []);
      setLoading(false);
    })();
  }, [user]);

  // Group weapons by avatar_id → day_number
  const weaponsByAvatar = useMemo(() => {
    const map = new Map<string, Map<number, Weapon>>();
    weapons.forEach((w) => {
      if (!map.has(w.avatar_id)) map.set(w.avatar_id, new Map());
      map.get(w.avatar_id)!.set(w.day_number, w);
    });
    return map;
  }, [weapons]);

  const totalForged = weapons.filter((w) => w.score >= 9).length;
  const totalPossible = WAR_COLLEGE_TRACKS.length * 56;

  // Build week structure once
  const weeks = useMemo(() => {
    const w: { week: number; days: number[] }[] = [];
    for (let wk = 1; wk <= 8; wk++) {
      const days: number[] = [];
      for (let d = (wk - 1) * 7 + 1; d <= Math.min(wk * 7, 56); d++) {
        days.push(d);
      }
      w.push({ week: wk, days });
    }
    return w;
  }, []);

  // Put the current avatar first, then others
  const sortedTracks = useMemo(() => {
    const current = WAR_COLLEGE_TRACKS.find((t) => t.avatarId === avatarId);
    const rest = WAR_COLLEGE_TRACKS.filter((t) => t.avatarId !== avatarId);
    return current ? [current, ...rest] : WAR_COLLEGE_TRACKS;
  }, [avatarId]);

  const toggleAvatarCollapse = (aId: string) => {
    setCollapsedAvatars((prev) => {
      const next = new Set(prev);
      if (next.has(aId)) next.delete(aId);
      else next.add(aId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Track
        </Button>
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400 mx-auto" />
            <p className="text-sm mt-2">Loading armory...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Track
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-amber-400" /> Personal Armory
          </h1>
          <p className="text-sm text-muted-foreground">
            Forged weapons from War College manuscripts — all apologists
          </p>
        </div>

        {/* Overall progress */}
        <Card className="border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium flex items-center gap-2">
                <Swords className="h-4 w-4 text-amber-400" />
                {totalForged} / {totalPossible} total weapons forged
              </span>
              <span className="text-muted-foreground">
                {Math.round((totalForged / totalPossible) * 100)}%
              </span>
            </div>
            <Progress value={(totalForged / totalPossible) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Weapons grouped by avatar */}
      <div className="space-y-6">
        {sortedTracks.map((track) => {
          const avatarWeapons = weaponsByAvatar.get(track.avatarId) || new Map<number, Weapon>();
          const avatarForged = Array.from(avatarWeapons.values()).filter((w) => w.score >= 9).length;
          const isCollapsed = collapsedAvatars.has(track.avatarId);

          return (
            <div key={track.avatarId}>
              {/* Avatar header */}
              <button
                onClick={() => toggleAvatarCollapse(track.avatarId)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-amber-500/15 bg-gradient-to-r from-amber-500/5 to-transparent hover:from-amber-500/10 transition-all mb-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{track.emoji}</span>
                  <div className="text-left">
                    <p className="font-bold text-sm">{track.avatarName}</p>
                    <p className="text-xs text-muted-foreground">{track.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      avatarForged > 0 ? "border-amber-500/30 text-amber-300" : "border-border/30"
                    }`}
                  >
                    {avatarForged}/56
                  </Badge>
                  {isCollapsed
                    ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    : <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </button>

              {!isCollapsed && (
                <div className="space-y-3 pl-2">
                  {avatarForged === 0 && avatarWeapons.size === 0 ? (
                    <p className="text-xs text-muted-foreground/50 italic pl-2 py-2">
                      No weapons forged yet for this apologist.
                    </p>
                  ) : (
                    weeks.map(({ week, days }) => {
                      const rank = getRankForDay(days[0]);
                      const ri = RANK_CONFIG[rank];
                      const weekForged = days.filter((d) => {
                        const w = avatarWeapons.get(d);
                        return w && w.score >= 9;
                      }).length;

                      // Skip empty weeks for cleaner view
                      const hasAny = days.some((d) => avatarWeapons.has(d));
                      if (!hasAny) return null;

                      return (
                        <div key={week}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge
                              variant="outline"
                              className={`${ri.color} border-current/30 text-[10px]`}
                            >
                              {ri.emoji} Wk {week} — {ri.label}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {weekForged}/{days.length}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-1.5">
                            {days.map((d) => {
                              const weapon = avatarWeapons.get(d);
                              if (!weapon) return null;

                              const expandKey = `${track.avatarId}-${d}`;
                              const isExpanded = expandedKey === expandKey;
                              const isForged = weapon.score >= 9;

                              return (
                                <Card
                                  key={d}
                                  className={`overflow-hidden transition-all ${
                                    isForged
                                      ? "border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent"
                                      : "border-border/30 bg-muted/10 opacity-70"
                                  }`}
                                >
                                  <CardContent className="p-2.5">
                                    <button
                                      onClick={() => setExpandedKey(isExpanded ? null : expandKey)}
                                      className="w-full text-left flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold ${isForged ? "text-amber-400" : "text-muted-foreground/50"}`}>
                                          Day {d}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-[350px]">
                                          {weapon.weapon_text.substring(0, 80)}...
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className={`text-[10px] ${
                                            isForged ? "border-amber-500/30 text-amber-300" : "border-border/30"
                                          }`}
                                        >
                                          {weapon.score}/10
                                        </Badge>
                                        {isExpanded
                                          ? <ChevronUp className="h-3 w-3 text-muted-foreground" />
                                          : <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                        }
                                      </div>
                                    </button>

                                    {isExpanded && (
                                      <div className="mt-2.5 space-y-2 border-t border-border/20 pt-2.5">
                                        <p className="text-sm leading-relaxed">{weapon.weapon_text}</p>
                                        {weapon.sharpening_history && weapon.sharpening_history.length > 0 && (
                                          <div className="space-y-1.5">
                                            <p className="text-xs font-medium text-muted-foreground">
                                              Sharpening History ({weapon.sharpening_history.length} attempt{weapon.sharpening_history.length > 1 ? "s" : ""})
                                            </p>
                                            {weapon.sharpening_history.map((h: any, i: number) => (
                                              <div key={i} className="text-xs p-2 rounded bg-muted/30 border border-border/20">
                                                <div className="flex items-center justify-between mb-0.5">
                                                  <span className="font-medium">Attempt {i + 1}</span>
                                                  <span className="text-muted-foreground">Score: {h.score}/10</span>
                                                </div>
                                                <p className="text-muted-foreground">{h.feedback}</p>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
