import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Calendar, Users } from "lucide-react";
import { GuildChallenge } from "@/hooks/useGuildChallenges";
import { formatDistanceToNow } from "date-fns";

interface GuildChallengeCardProps {
  challenge: GuildChallenge;
  onComplete?: (params: { challengeId: string; xpEarned: number }) => void;
  isCompleting?: boolean;
}

export const GuildChallengeCard = ({ challenge, onComplete, isCompleting }: GuildChallengeCardProps) => {
  const progress = (challenge.current_completions / challenge.target_completions) * 100;
  const isActive = new Date(challenge.ends_at) > new Date() && !challenge.is_completed;
  const timeLeft = formatDistanceToNow(new Date(challenge.ends_at), { addSuffix: true });

  return (
    <Card className={challenge.is_completed ? "border-green-500/50" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {challenge.challenge_title}
            </CardTitle>
            <CardDescription className="mt-2">
              {challenge.challenge_description}
            </CardDescription>
          </div>
          {challenge.is_completed ? (
            <Badge variant="default" className="bg-green-500">
              ✓ Completed
            </Badge>
          ) : isActive ? (
            <Badge variant="default">Active</Badge>
          ) : (
            <Badge variant="secondary">Expired</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Progress
            </span>
            <span className="font-medium">
              {challenge.current_completions}/{challenge.target_completions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{challenge.reward_xp} XP per completion</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{isActive ? `Ends ${timeLeft}` : "Ended"}</span>
          </div>
        </div>

        {/* Room Badge */}
        <div>
          <Badge variant="outline" className="font-mono">
            {challenge.room_id}
          </Badge>
        </div>

        {/* Action Button */}
        {isActive && !challenge.has_completed && (
          <Button
            size="sm"
            className="w-full"
            onClick={() => onComplete?.({ challengeId: challenge.id, xpEarned: challenge.reward_xp })}
            disabled={isCompleting}
          >
            {isCompleting ? "Completing..." : "Mark as Completed"}
          </Button>
        )}
        {challenge.has_completed && (
          <div className="text-center text-sm text-muted-foreground">
            ✓ You've completed this challenge
          </div>
        )}
      </CardContent>
    </Card>
  );
};
