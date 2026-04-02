import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Lock, Crown, Star, Flame, Eye, Compass, Zap, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloorBadgeData {
  floor: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  description: string;
}

const FLOOR_BADGES: FloorBadgeData[] = [
  { floor: 1, name: "Furnisher", icon: <Star className="h-6 w-6" />, color: "text-blue-400", gradient: "from-blue-500 to-blue-700", description: "Mastered the Furnishing Floor — memory & visualization" },
  { floor: 2, name: "Detective", icon: <Eye className="h-6 w-6" />, color: "text-red-400", gradient: "from-red-500 to-red-700", description: "Mastered the Investigation Floor — detective of the Word" },
  { floor: 3, name: "Freestyler", icon: <Zap className="h-6 w-6" />, color: "text-yellow-400", gradient: "from-yellow-500 to-amber-700", description: "Mastered the Freestyle Floor — spontaneous connections" },
  { floor: 4, name: "Builder", icon: <Compass className="h-6 w-6" />, color: "text-purple-400", gradient: "from-purple-500 to-purple-700", description: "Mastered the Next Level Floor — Christ-centered depth" },
  { floor: 5, name: "Visionary", icon: <Shield className="h-6 w-6" />, color: "text-cyan-400", gradient: "from-cyan-500 to-cyan-700", description: "Mastered the Vision Floor — prophecy & sanctuary" },
  { floor: 6, name: "Cosmic Scholar", icon: <Crown className="h-6 w-6" />, color: "text-emerald-400", gradient: "from-emerald-500 to-emerald-700", description: "Mastered the Three Heavens Floor — cycles & context" },
  { floor: 7, name: "Fire Walker", icon: <Flame className="h-6 w-6" />, color: "text-orange-400", gradient: "from-orange-500 to-orange-700", description: "Mastered the Spiritual Floor — heart transformation" },
  { floor: 8, name: "Palace Master", icon: <Infinity className="h-6 w-6" />, color: "text-white", gradient: "from-gray-800 to-black", description: "Achieved reflexive Phototheology — the palace lives within" },
];

interface FloorBadgesProps {
  completedFloors: number[];
  compact?: boolean;
}

export function FloorBadges({ completedFloors, compact = false }: FloorBadgesProps) {
  const completedSet = new Set(completedFloors);

  if (compact) {
    return (
      <TooltipProvider>
        <div className="flex flex-wrap gap-1.5">
          {FLOOR_BADGES.map((badge) => {
            const earned = completedSet.has(badge.floor);
            return (
              <Tooltip key={badge.floor}>
                <TooltipTrigger>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      earned
                        ? `bg-gradient-to-br ${badge.gradient} shadow-lg shadow-${badge.color}/20`
                        : "bg-muted/50 opacity-40"
                    )}
                  >
                    <span className={cn("scale-75", earned ? "text-white" : "text-muted-foreground")}>
                      {earned ? badge.icon : <Lock className="h-4 w-4" />}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{earned ? badge.name : `Floor ${badge.floor} — Locked`}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Palace Floor Badges
          <Badge variant="outline" className="ml-auto">
            {completedFloors.length} / 8
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          <TooltipProvider>
            {FLOOR_BADGES.map((badge) => {
              const earned = completedSet.has(badge.floor);
              return (
                <Tooltip key={badge.floor}>
                  <TooltipTrigger className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                        earned
                          ? `bg-gradient-to-br ${badge.gradient} shadow-lg ring-2 ring-white/20 hover:scale-110`
                          : "bg-muted/30 border border-dashed border-muted-foreground/20"
                      )}
                    >
                      <span className={earned ? "text-white" : "text-muted-foreground/40"}>
                        {earned ? badge.icon : <Lock className="h-5 w-5" />}
                      </span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium text-center leading-tight",
                      earned ? "text-foreground" : "text-muted-foreground/50"
                    )}>
                      {earned ? badge.name : `Floor ${badge.floor}`}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="font-semibold">{earned ? `✅ ${badge.name}` : `🔒 Floor ${badge.floor}`}</p>
                    <p className="text-xs text-muted-foreground max-w-48">{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
