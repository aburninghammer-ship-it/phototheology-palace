import { usePartnership } from '@/hooks/usePartnership';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Users, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PartnerStatusWidget() {
  const { 
    partnership, 
    myActivity, 
    partnerActivity, 
    bothCompletedToday,
    pendingInvitations 
  } = usePartnership();

  // Show pending invitations notification
  if (pendingInvitations && pendingInvitations.length > 0) {
    return (
      <Link 
        to="/mastery?tab=partner"
        className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
      >
        <Users className="h-5 w-5 text-amber-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-600">Partner Invitation</p>
          <p className="text-xs text-muted-foreground truncate">
            {pendingInvitations[0].partner_profile?.display_name} wants to study with you!
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-500/20 text-amber-600 border-amber-500/30">
          New
        </Badge>
      </Link>
    );
  }

  // No active partnership
  if (!partnership || partnership.status !== 'active') {
    return (
      <Link 
        to="/mastery?tab=partner"
        className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
      >
        <Users className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">Find a Training Partner</p>
          <p className="text-xs text-muted-foreground">1.5x streak bonus when studying together</p>
        </div>
      </Link>
    );
  }

  // Active partnership - compact status
  const myCompleted = myActivity && (
    myActivity.completed_mastery || 
    myActivity.completed_reading || 
    myActivity.completed_challenge
  );
  const partnerCompleted = partnerActivity && (
    partnerActivity.completed_mastery || 
    partnerActivity.completed_reading || 
    partnerActivity.completed_challenge
  );

  return (
    <Link 
      to="/mastery?tab=partner"
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        bothCompletedToday 
          ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20' 
          : 'bg-card hover:bg-muted'
      }`}
    >
      <div className="relative">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarImage src={partnership.partner_profile?.avatar_url || undefined} />
          <AvatarFallback className="text-sm">
            {partnership.partner_profile?.display_name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        {partnerCompleted && (
          <CheckCircle2 className="h-4 w-4 text-green-500 absolute -bottom-1 -right-1 bg-background rounded-full" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">
            {partnership.partner_profile?.display_name}
          </p>
          {bothCompletedToday && (
            <Sparkles className="h-3 w-3 text-green-500" />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Flame className="h-3 w-3 text-orange-500" />
          <span>{partnership.partnership_streak} day streak</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          {myCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground/50" />
          )}
          <span className="text-xs">You</span>
        </div>
        <div className="flex items-center gap-1">
          {partnerCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground/50" />
          )}
          <span className="text-xs">Partner</span>
        </div>
      </div>
    </Link>
  );
}
