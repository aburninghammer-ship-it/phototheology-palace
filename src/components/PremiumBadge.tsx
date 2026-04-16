import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useChurchMembership } from "@/hooks/useChurchMembership";

interface PremiumBadgeProps {
  feature?: string;
  inline?: boolean;
}

export const PremiumBadge = ({ feature, inline = false }: PremiumBadgeProps) => {
  const { isMember: isChurchMember } = useChurchMembership();

  // Church members should never see "Premium" badges
  if (isChurchMember) return null;

  const badge = (
    <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30">
      <Crown className="h-3 w-3 mr-1 text-yellow-600" />
      Premium
    </Badge>
  );

  if (inline) {
    return badge;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">
          {feature ? `${feature} requires` : "This feature requires"} a premium subscription.{" "}
          <Link to="/pricing" className="underline">
            Upgrade now
          </Link>
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
