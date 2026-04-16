import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareToProfileDialog } from "./ShareToProfileDialog";
import { ShareToSocialDialog } from "./ShareToSocialDialog";
import type { SharedContent } from "@/types/sharedContent";

interface ShareToProfileButtonProps {
  sharedContent: SharedContent;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "icon";
  className?: string;
  label?: string;
}

export function ShareToProfileButton({
  sharedContent,
  variant = "outline",
  size = "sm",
  className = "",
  label = "Share",
}: ShareToProfileButtonProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={`gap-2 ${className}`}>
            <Share2 className="h-3.5 w-3.5" />
            {size !== "icon" && label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Share to Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSocialOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share to Social Media
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ShareToProfileDialog sharedContent={sharedContent} open={profileOpen} onOpenChange={setProfileOpen} />
      <ShareToSocialDialog sharedContent={sharedContent} open={socialOpen} onOpenChange={setSocialOpen} />
    </>
  );
}
