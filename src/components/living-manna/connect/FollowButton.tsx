import { useFollow } from "@/hooks/useFollow";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  isCurrentUser: boolean;
}

export function FollowButton({ targetUserId, isCurrentUser }: FollowButtonProps) {
  const { isFollowing, loading, toggleFollow } = useFollow(targetUserId);

  if (isCurrentUser) return null;

  return (
    <Button
      variant={isFollowing ? "secondary" : "ghost"}
      size="sm"
      className="text-xs"
      onClick={toggleFollow}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-3 w-3 mr-1" />
      ) : (
        <UserPlus className="h-3 w-3 mr-1" />
      )}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
