import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Winner {
  id: string;
  rank: number;
  jeeves_commentary?: string;
  standout_insight?: string | null;
  xp_awarded: number;
  badge_awarded?: string | null;
  user_id: string;
  profiles?: {
    display_name: string;
    avatar_url: string;
  } | any;
}

interface WinnerCardProps {
  winner: Winner;
}

export function WinnerCard({ winner }: WinnerCardProps) {
  const getRankDetails = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: <Crown className="h-8 w-8 text-amber-500" />,
          label: "1st Place",
          gradient: "from-amber-500/20 via-yellow-500/10 to-orange-500/20",
          border: "border-amber-500/50",
        };
      case 2:
        return {
          icon: <Medal className="h-7 w-7 text-gray-400" />,
          label: "2nd Place",
          gradient: "from-gray-400/20 via-gray-300/10 to-slate-400/20",
          border: "border-gray-400/50",
        };
      case 3:
        return {
          icon: <Award className="h-6 w-6 text-amber-700" />,
          label: "3rd Place",
          gradient: "from-amber-700/20 via-orange-600/10 to-amber-800/20",
          border: "border-amber-700/50",
        };
      default:
        return {
          icon: <Sparkles className="h-5 w-5 text-primary" />,
          label: `${rank}th Place`,
          gradient: "from-primary/10 to-primary/5",
          border: "border-primary/30",
        };
    }
  };

  const rankDetails = getRankDetails(winner.rank);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: winner.rank * 0.1 }}
    >
      <Card className={`relative overflow-hidden ${rankDetails.border} bg-gradient-to-br ${rankDetails.gradient}`}>
        {/* Rank Badge */}
        <div className="absolute top-3 right-3">
          {rankDetails.icon}
        </div>

        <CardContent className="pt-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-offset-background ring-amber-500/50">
              <AvatarImage src={winner.profiles?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                {(winner.profiles?.display_name || "W").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {winner.profiles?.display_name || "Winner"}
              </p>
              <Badge variant="secondary" className="text-xs">
                {rankDetails.label}
              </Badge>
            </div>
          </div>

          {/* Standout Insight */}
          {winner.standout_insight && (
            <div className="mb-4">
              <p className="text-sm italic text-muted-foreground">
                "{winner.standout_insight}"
              </p>
            </div>
          )}

          {/* Jeeves Commentary */}
          <div className="p-3 rounded-lg bg-background/50 text-xs">
            <p className="font-medium mb-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Jeeves says:
            </p>
            <p className="text-muted-foreground italic">
              {winner.jeeves_commentary}
            </p>
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs">
            <span className="text-muted-foreground">Rewards:</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                +{winner.xp_awarded} XP
              </Badge>
              {winner.badge_awarded && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-xs">
                  {winner.badge_awarded}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
