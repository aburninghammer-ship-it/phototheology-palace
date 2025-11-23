import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, Trophy, TrendingUp } from "lucide-react";
import { Guild } from "@/hooks/useGuilds";
import { useNavigate } from "react-router-dom";

interface GuildCardProps {
  guild: Guild;
  onJoin?: (guildId: string) => void;
  onLeave?: (guildId: string) => void;
  isJoining?: boolean;
}

export const GuildCard = ({ guild, onJoin, onLeave, isJoining }: GuildCardProps) => {
  const navigate = useNavigate();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'house': return 'bg-purple-500/20 text-purple-300';
      case 'order': return 'bg-blue-500/20 text-blue-300';
      case 'squad': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'house': return '🏰';
      case 'order': return '⚔️';
      case 'squad': return '🛡️';
      default: return '👥';
    }
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all cursor-pointer border-border/40"
      onClick={() => navigate(`/guild/${guild.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getTypeIcon(guild.guild_type)}</span>
            <div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {guild.name}
              </CardTitle>
              <Badge variant="outline" className={getTypeColor(guild.guild_type)}>
                {guild.guild_type.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
        {guild.description && (
          <CardDescription className="mt-2 line-clamp-2">{guild.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{guild.member_count}/{guild.max_members} members</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>{guild.total_xp.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>{guild.current_streak} day streak</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-blue-500" />
              <span>{guild.focus_rooms?.length || 0} focus rooms</span>
            </div>
          </div>

          {/* Focus Rooms */}
          {guild.focus_rooms && guild.focus_rooms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {guild.focus_rooms.slice(0, 3).map((room) => (
                <Badge key={room} variant="secondary" className="text-xs">
                  {room}
                </Badge>
              ))}
              {guild.focus_rooms.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{guild.focus_rooms.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Button */}
          <div onClick={(e) => e.stopPropagation()}>
            {guild.is_member ? (
              <div className="flex items-center justify-between">
                <Badge variant="default" className="bg-green-500/20 text-green-300">
                  ✓ Member ({guild.user_role})
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLeave?.(guild.id)}
                >
                  Leave
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => onJoin?.(guild.id)}
                disabled={isJoining || (guild.member_count || 0) >= guild.max_members}
              >
                {(guild.member_count || 0) >= guild.max_members ? "Full" : "Join Guild"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};