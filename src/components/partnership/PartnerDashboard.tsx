import { useState } from 'react';
import { usePartnership } from '@/hooks/usePartnership';
import { useActiveUsers } from '@/hooks/useActiveUsers';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  UserPlus, 
  Flame, 
  Trophy, 
  Heart, 
  Bell, 
  PartyPopper,
  CheckCircle2,
  Circle,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function PartnerDashboard() {
  const { user } = useAuth();
  const { 
    partnership, 
    pendingInvitations,
    myActivity,
    partnerActivity,
    bothCompletedToday,
    invitePartner,
    acceptInvitation,
    declineInvitation,
    sendNudge,
    endPartnership,
  } = usePartnership();
  const { activeUsers } = useActiveUsers();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleInvite = async () => {
    if (!selectedUserId) return;
    await invitePartner.mutateAsync({ userId: selectedUserId, message: inviteMessage });
    setInviteDialogOpen(false);
    setInviteMessage('');
    setSelectedUserId(null);
  };

  // No partnership - show invite options
  if (!partnership || partnership.status === 'ended' || partnership.status === 'declined') {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Training Partner Mode</CardTitle>
          <CardDescription className="text-base">
            Study together, grow together. Partners who study together have 65% better retention!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pending invitations received */}
          {pendingInvitations && pendingInvitations.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                Pending Invitations
              </h3>
              {pendingInvitations.map((inv) => (
                <Card key={inv.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={inv.partner_profile?.avatar_url || undefined} />
                        <AvatarFallback>
                          {inv.partner_profile?.display_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{inv.partner_profile?.display_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {inv.invitation_message || 'Wants to be your study partner!'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => acceptInvitation.mutate(inv.id)}
                        disabled={acceptInvitation.isPending}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => declineInvitation.mutate(inv.id)}
                        disabled={declineInvitation.isPending}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Invite dialog */}
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Find a Training Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Invite a Training Partner</DialogTitle>
                <DialogDescription>
                  Choose someone to study with. You'll see each other's progress and can send encouragement.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <ScrollArea className="h-[200px] border rounded-lg p-2">
                  {activeUsers.filter(u => u.id !== user?.id).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No other users online right now
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {activeUsers
                        .filter(u => u.id !== user?.id)
                        .map((activeUser) => (
                          <button
                            key={activeUser.id}
                            onClick={() => setSelectedUserId(activeUser.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              selectedUserId === activeUser.id
                                ? 'bg-primary/10 border-primary border'
                                : 'hover:bg-muted border border-transparent'
                            }`}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={activeUser.avatar_url || undefined} />
                              <AvatarFallback>
                                {activeUser.display_name?.charAt(0) || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="font-medium">{activeUser.display_name}</p>
                              <p className="text-xs text-muted-foreground">Online now</p>
                            </div>
                            {selectedUserId === activeUser.id && (
                              <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />
                            )}
                          </button>
                        ))}
                    </div>
                  )}
                </ScrollArea>
                <Textarea
                  placeholder="Add a personal message (optional)"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={2}
                />
                <Button
                  className="w-full"
                  onClick={handleInvite}
                  disabled={!selectedUserId || invitePartner.isPending}
                >
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-4 rounded-lg bg-background/50">
              <Flame className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <p className="font-semibold">1.5x Streak Bonus</p>
              <p className="text-xs text-muted-foreground">When both complete daily</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <Trophy className="h-8 w-8 mx-auto text-amber-500 mb-2" />
              <p className="font-semibold">Two-by-Two Badge</p>
              <p className="text-xs text-muted-foreground">After 7 days together</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pending invitation sent
  if (partnership.status === 'pending' && partnership.user1_id === user?.id) {
    return (
      <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 animate-pulse">
            <Bell className="h-8 w-8 text-amber-500" />
          </div>
          <CardTitle>Invitation Pending</CardTitle>
          <CardDescription>
            Waiting for your partner to accept...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Sent {formatDistanceToNow(new Date(partnership.created_at), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Active partnership
  return (
    <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            Training Partner
          </CardTitle>
          {bothCompletedToday && (
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Both Active Today!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Partner info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-green-500/30">
            <AvatarImage src={partnership.partner_profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-green-500/10 text-green-600">
              {partnership.partner_profile?.display_name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-lg">{partnership.partner_profile?.display_name}</p>
            <p className="text-sm text-muted-foreground">
              Partners since {formatDistanceToNow(new Date(partnership.accepted_at!), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Streak display */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-500">
              <Flame className="h-6 w-6" />
              {partnership.partnership_streak}
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <div className="text-2xl font-bold text-amber-500">
              {partnership.longest_streak}
            </div>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <div className="text-2xl font-bold text-green-500">
              {partnership.total_sessions_together}
            </div>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </div>
        </div>

        {/* Today's progress */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Today's Progress</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* My progress */}
            <div className="p-3 rounded-lg border bg-card">
              <p className="text-xs text-muted-foreground mb-2">You</p>
              <div className="space-y-1">
                <ActivityItem 
                  label="Mastery" 
                  completed={myActivity?.completed_mastery} 
                />
                <ActivityItem 
                  label="Reading" 
                  completed={myActivity?.completed_reading} 
                />
                <ActivityItem 
                  label="Challenge" 
                  completed={myActivity?.completed_challenge} 
                />
              </div>
            </div>
            {/* Partner progress */}
            <div className="p-3 rounded-lg border bg-card">
              <p className="text-xs text-muted-foreground mb-2">
                {partnership.partner_profile?.display_name?.split(' ')[0]}
              </p>
              <div className="space-y-1">
                <ActivityItem 
                  label="Mastery" 
                  completed={partnerActivity?.completed_mastery} 
                />
                <ActivityItem 
                  label="Reading" 
                  completed={partnerActivity?.completed_reading} 
                />
                <ActivityItem 
                  label="Challenge" 
                  completed={partnerActivity?.completed_challenge} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bonus XP indicator */}
        {bothCompletedToday && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
            <Sparkles className="h-6 w-6 mx-auto text-green-500 mb-2" />
            <p className="font-semibold text-green-600">1.5x Streak Bonus Active!</p>
            <p className="text-sm text-muted-foreground">Both of you studied today</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendNudge.mutate({ type: 'encouragement' })}
            disabled={sendNudge.isPending}
          >
            <Heart className="h-4 w-4 mr-1 text-pink-500" />
            Encourage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendNudge.mutate({ type: 'reminder' })}
            disabled={sendNudge.isPending}
          >
            <Bell className="h-4 w-4 mr-1 text-amber-500" />
            Remind
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendNudge.mutate({ type: 'celebration' })}
            disabled={sendNudge.isPending}
          >
            <PartyPopper className="h-4 w-4 mr-1 text-purple-500" />
            Celebrate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ label, completed }: { label: string; completed?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {completed ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground/50" />
      )}
      <span className={completed ? 'text-foreground' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  );
}
