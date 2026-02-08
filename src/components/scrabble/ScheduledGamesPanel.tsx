// Scheduled Games Panel
// View upcoming games, RSVP, and schedule new games ("Meet me later")

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Check,
  HelpCircle,
  X,
  Trash2,
  Play,
  Loader2,
  CalendarPlus,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useScheduledGames, type ScheduledGame } from '@/hooks/useScheduledGames';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface ScheduledGamesPanelProps {
  onJoinGame?: (roomCode: string) => void;
  className?: string;
}

export function ScheduledGamesPanel({ onJoinGame, className }: ScheduledGamesPanelProps) {
  const { user } = useAuth();
  const {
    scheduledGames,
    isLoading,
    createScheduledGame,
    updateRSVP,
    cancelScheduledGame,
  } = useScheduledGames();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleCreateGame = async () => {
    if (!scheduledDate || !scheduledTime) return;

    setIsCreating(true);
    try {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (dateTime <= new Date()) {
        return; // Can't schedule in the past
      }

      await createScheduledGame({
        title: title || undefined,
        description: description || undefined,
        scheduled_at: dateTime,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setScheduledDate('');
      setScheduledTime('');
      setShowCreateDialog(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRSVP = async (gameId: string, status: 'going' | 'maybe' | 'not_going') => {
    await updateRSVP(gameId, status);
  };

  const handleCancel = async (gameId: string) => {
    if (confirm('Are you sure you want to cancel this game?')) {
      await cancelScheduledGame(gameId);
    }
  };

  // Get min date/time for scheduling (now + 5 minutes)
  const now = new Date();
  const minDate = format(now, 'yyyy-MM-dd');
  const minTime = format(new Date(now.getTime() + 5 * 60000), 'HH:mm');

  if (!user) {
    return (
      <Card className={cn('bg-muted/50', className)}>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Sign in to schedule games and RSVP</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarPlus className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Meet Me Later</h3>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              Schedule Game
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarPlus className="h-5 w-5" />
                Schedule a Game
              </DialogTitle>
              <DialogDescription>
                Set up a future game time and invite others to RSVP
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  placeholder="e.g., Friday Night PT Study"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Any details about the game..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    min={minDate}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    min={scheduledDate === minDate ? minTime : undefined}
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateGame}
                disabled={!scheduledDate || !scheduledTime || isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Calendar className="h-4 w-4 mr-2" />
                )}
                Schedule Game
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scheduled Games List */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      ) : scheduledGames.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="py-6 text-center text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No scheduled games yet</p>
            <p className="text-xs mt-1">Be the first to schedule one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {scheduledGames.map((game) => (
              <ScheduledGameCard
                key={game.id}
                game={game}
                isHost={game.host_user_id === user.id}
                onRSVP={handleRSVP}
                onCancel={handleCancel}
                onJoin={onJoinGame}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// Individual game card
interface ScheduledGameCardProps {
  game: ScheduledGame;
  isHost: boolean;
  onRSVP: (gameId: string, status: 'going' | 'maybe' | 'not_going') => void;
  onCancel: (gameId: string) => void;
  onJoin?: (roomCode: string) => void;
}

function ScheduledGameCard({ game, isHost, onRSVP, onCancel, onJoin }: ScheduledGameCardProps) {
  const scheduledDate = new Date(game.scheduled_at);
  const isStartingSoon = scheduledDate.getTime() - Date.now() < 15 * 60 * 1000; // Within 15 min
  const hasStarted = game.status === 'started' && game.room_code;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className={cn(
        'transition-all',
        isStartingSoon && 'border-yellow-500/50 bg-yellow-500/5',
        hasStarted && 'border-green-500/50 bg-green-500/5'
      )}>
        <CardHeader className="py-3 px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">
                {game.title || 'Scrabble PT Game'}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-xs">
                <span>by {game.host_name}</span>
                {isHost && (
                  <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">
                    HOST
                  </span>
                )}
              </CardDescription>
            </div>
            {isHost && !hasStarted && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onCancel(game.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-2 px-4 space-y-3">
          {/* Date/Time */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(scheduledDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{format(scheduledDate, 'h:mm a')}</span>
            </div>
          </div>

          {/* Time until */}
          <div className="text-xs text-muted-foreground">
            {isStartingSoon ? (
              <span className="text-yellow-600 font-medium flex items-center gap-1">
                <Bell className="h-3 w-3" />
                Starting {formatDistanceToNow(scheduledDate, { addSuffix: true })}
              </span>
            ) : (
              <span>{formatDistanceToNow(scheduledDate, { addSuffix: true })}</span>
            )}
          </div>

          {/* Description */}
          {game.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {game.description}
            </p>
          )}

          {/* RSVP count */}
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{game.rsvp_count || 0} going</span>
          </div>

          {/* Game started - Join button */}
          {hasStarted && game.room_code && onJoin && (
            <Button
              onClick={() => onJoin(game.room_code!)}
              className="w-full bg-green-500 hover:bg-green-600"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Join Game ({game.room_code})
            </Button>
          )}

          {/* RSVP buttons - only show if game hasn't started */}
          {!hasStarted && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={game.my_rsvp === 'going' ? 'default' : 'outline'}
                className={cn(
                  'flex-1',
                  game.my_rsvp === 'going' && 'bg-green-500 hover:bg-green-600'
                )}
                onClick={() => onRSVP(game.id, 'going')}
              >
                <Check className="h-3 w-3 mr-1" />
                Going
              </Button>
              <Button
                size="sm"
                variant={game.my_rsvp === 'maybe' ? 'default' : 'outline'}
                className={cn(
                  'flex-1',
                  game.my_rsvp === 'maybe' && 'bg-yellow-500 hover:bg-yellow-600'
                )}
                onClick={() => onRSVP(game.id, 'maybe')}
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Maybe
              </Button>
              <Button
                size="sm"
                variant={game.my_rsvp === 'not_going' ? 'default' : 'outline'}
                className={cn(
                  'flex-1',
                  game.my_rsvp === 'not_going' && 'bg-red-500 hover:bg-red-600'
                )}
                onClick={() => onRSVP(game.id, 'not_going')}
              >
                <X className="h-3 w-3 mr-1" />
                No
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
