import { useState } from "react";
import { useChurchActiveUsers } from "@/hooks/useChurchActiveUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MemberProfileView } from "./profile/MemberProfileView";

interface LiveMembersStripProps {
  churchId: string;
}

const MAX_AVATARS = 8;

export function LiveMembersStrip({ churchId }: LiveMembersStripProps) {
  const { liveMembers, liveCount } = useChurchActiveUsers(churchId);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (liveCount === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        <span>No members online right now</span>
      </div>
    );
  }

  const visibleMembers = liveMembers.slice(0, MAX_AVATARS);
  const overflow = liveCount - MAX_AVATARS;

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-sm font-medium text-foreground/80">
            {liveCount} Live Now
          </span>
        </div>

        {/* Stacked avatars */}
        <div className="flex items-center -space-x-2">
          {visibleMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedUserId(member.id)}
              className="relative cursor-pointer hover:z-10 hover:scale-110 transition-transform"
              title={member.display_name || member.username || "Member"}
            >
              <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-green-500/40">
                <AvatarImage src={member.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {(member.display_name || member.username || "?")[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Green dot on avatar */}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-background" />
            </button>
          ))}
          {overflow > 0 && (
            <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
              +{overflow}
            </div>
          )}
        </div>
      </div>

      {/* Member profile sheet */}
      <Sheet open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
          {selectedUserId && (
            <MemberProfileView
              userId={selectedUserId}
              churchId={churchId}
              onBack={() => setSelectedUserId(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
