import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award } from "lucide-react";

interface MemberAchievementsWallProps {
  achievements: any[];
}

const TIER_COLORS: Record<string, string> = {
  bronze: "from-amber-700/20 to-amber-800/10 border-amber-700/30 text-amber-700",
  silver: "from-gray-400/20 to-gray-500/10 border-gray-400/30 text-gray-500",
  gold: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-600",
  platinum: "from-cyan-400/20 to-cyan-500/10 border-cyan-400/30 text-cyan-500",
  diamond: "from-purple-400/20 to-purple-500/10 border-purple-400/30 text-purple-500",
};

export function MemberAchievementsWall({ achievements }: MemberAchievementsWallProps) {
  if (achievements.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="p-8 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No achievements unlocked yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Complete studies, challenges, and milestones to earn badges.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {achievements.map((a) => {
        const ach = a.achievements;
        if (!ach) return null;
        const tierColor = TIER_COLORS[ach.tier || "bronze"] || TIER_COLORS.bronze;

        return (
          <Card
            key={a.id}
            variant="glass"
            className={`bg-gradient-to-br ${tierColor} hover:scale-[1.02] transition-transform`}
          >
            <CardContent className="p-4 text-center space-y-2">
              <div className="text-3xl mx-auto">
                {ach.icon || "🏆"}
              </div>
              <h4 className="text-sm font-semibold leading-tight">{ach.name}</h4>
              {ach.description && (
                <p className="text-[10px] text-muted-foreground line-clamp-2">{ach.description}</p>
              )}
              <div className="flex items-center justify-center gap-2">
                {ach.points > 0 && (
                  <Badge variant="outline" className="text-[10px]">
                    +{ach.points} XP
                  </Badge>
                )}
                {ach.tier && (
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {ach.tier}
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">
                {new Date(a.earned_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
