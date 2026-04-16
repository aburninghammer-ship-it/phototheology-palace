import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Globe, Calendar, Trophy, Flame, Mail, Loader2, Gem, Building2 } from "lucide-react";
import { FollowButton } from "../connect/FollowButton";
import { useFollow } from "@/hooks/useFollow";
import { useAuth } from "@/hooks/useAuth";

interface MemberProfileHeaderProps {
  profile: any;
  memberInfo: { role: string; joined_at: string } | null;
  userId: string;
  onMessage: () => void;
  messagingLoading?: boolean;
  enhancedStats?: {
    gemsCount: number;
    roomsCompleted: number;
    currentFloor: number;
    achievementsCount: number;
  };
}

const roleColors: Record<string, string> = {
  admin: "bg-red-500/10 text-red-600 border-red-500/30",
  leader: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  member: "bg-blue-500/10 text-blue-600 border-blue-500/30",
};

export function MemberProfileHeader({ profile, memberInfo, userId, onMessage, messagingLoading, enhancedStats }: MemberProfileHeaderProps) {
  const { user } = useAuth();
  const { followersCount, followingCount } = useFollow(userId);
  const isOwnProfile = user?.id === userId;

  if (!profile) return null;

  const socialLinks = profile.social_links || {};

  return (
    <Card variant="glass" className="overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 sm:h-40 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent relative">
        {profile.cover_photo_url && (
          <img src={profile.cover_photo_url} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <CardContent className="relative pt-0 px-4 pb-4 sm:px-6 sm:pb-6">
        {/* Avatar - overlaps cover */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 -mt-10 sm:-mt-12">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background ring-2 ring-primary/20">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {(profile.display_name || profile.username || "?")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold truncate">
                {profile.display_name || profile.username}
              </h2>
              {memberInfo && (
                <Badge variant="outline" className={`text-xs ${roleColors[memberInfo.role] || ""}`}>
                  {memberInfo.role}
                </Badge>
              )}
              {profile.master_title && profile.master_title !== "none" && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 capitalize">
                  {profile.master_title} Belt
                </Badge>
              )}
            </div>
            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{profile.bio}</p>
            )}
          </div>

          {/* Actions */}
          {!isOwnProfile && (
            <div className="flex gap-2 sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={onMessage}
                disabled={messagingLoading}
              >
                {messagingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Mail className="h-4 w-4 mr-1" />}
                Message
              </Button>
              <FollowButton targetUserId={userId} isCurrentUser={false} />
            </div>
          )}
        </div>

        {/* Identity Stats Banner */}
        <div className="flex flex-wrap items-center gap-3 mt-4 p-2.5 rounded-lg bg-card/50 border border-border/50">
          <span className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-500" />
            <strong className="text-sm text-foreground">{profile.daily_study_streak || 0}</strong>
            <span className="text-xs text-muted-foreground">Streak</span>
          </span>
          <div className="w-px h-5 bg-border" />
          <span className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            <strong className="text-sm text-foreground">{profile.points || 0}</strong>
            <span className="text-xs text-muted-foreground">XP</span>
          </span>
          <div className="w-px h-5 bg-border" />
          <span className="flex items-center gap-1.5">
            <Gem className="h-4 w-4 text-primary" />
            <strong className="text-sm text-foreground">{enhancedStats?.gemsCount || 0}</strong>
            <span className="text-xs text-muted-foreground">Gems</span>
          </span>
          <div className="w-px h-5 bg-border" />
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-purple-500" />
            <strong className="text-sm text-foreground">{enhancedStats?.roomsCompleted || 0}</strong>
            <span className="text-xs text-muted-foreground">Rooms</span>
          </span>
          {enhancedStats && enhancedStats.currentFloor > 0 && (
            <>
              <div className="w-px h-5 bg-border" />
              <span className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Floor</span>
                <strong className="text-sm text-foreground">{enhancedStats.currentFloor}</strong>
              </span>
            </>
          )}
        </div>

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </span>
          )}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
              <Globe className="h-3.5 w-3.5" /> Website
            </a>
          )}
          {memberInfo?.joined_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Member since {new Date(memberInfo.joined_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          )}
        </div>

        {/* Followers/Following */}
        <div className="flex flex-wrap gap-4 mt-2 text-sm">
          <span><strong className="text-foreground">{followersCount}</strong> <span className="text-muted-foreground">Followers</span></span>
          <span><strong className="text-foreground">{followingCount}</strong> <span className="text-muted-foreground">Following</span></span>
        </div>

        {/* Ministry Tags */}
        {profile.ministry_tags && profile.ministry_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {profile.ministry_tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Social Links */}
        {(socialLinks.twitter || socialLinks.instagram || socialLinks.linkedin) && (
          <div className="flex gap-3 mt-3">
            {socialLinks.twitter && (
              <a href={`https://twitter.com/${socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary">@{socialLinks.twitter}</a>
            )}
            {socialLinks.instagram && (
              <a href={`https://instagram.com/${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary">IG: {socialLinks.instagram}</a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary">LinkedIn</a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
