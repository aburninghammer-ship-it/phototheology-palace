import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  loading?: boolean;
  onToggle: (userId: string) => void;
}

export function FollowButton({ userId, isFollowing, loading, onToggle }: FollowButtonProps) {
  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(userId);
      }}
      disabled={loading}
      className="min-w-[100px]"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-4 w-4 mr-1" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-1" />
          Follow
        </>
      )}
    </Button>
  );
}
