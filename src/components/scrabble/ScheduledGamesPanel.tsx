// Scheduled Games & Group Studies Panel
// View upcoming games/studies, RSVP, and schedule new sessions

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
  BookOpen,
  Gamepad2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScheduledGames, type ScheduledGame, type ScheduledEventType } from '@/hooks/useScheduledGames';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface ScheduledGamesPanelProps {
  onJoinGame?: (roomCode: string) => void;
  className?: string;
  defaultType?: ScheduledEventType;
}

export function ScheduledGamesPanel({ onJoinGame, className, defaultType = 'scrabble-pt' }: ScheduledGamesPanelProps) {
  const { user } = useAuth();
  const {
    scheduledGames,
    isLoading,
    createScheduledGame,
    updateRSVP,
    cancelScheduledGame,
    startScheduledGame,
  } = useScheduledGames();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [eventType, setEventType] = useState<ScheduledEventType>(defaultType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [verseReference, setVerseReference] = useState('');

  // Filter games by type
  const games = scheduledGames.filter(g => g.game_type === 'scrabble-pt');
  const studies = scheduledGames.filter(g => g.game_type === 'group-study');

  const handleCreateEvent = async () => {
    if (!scheduledDate || !scheduledTime) return;

    setIsCreating(true);
    try {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (dateTime <= new Date()) {
        return; // Can't schedule in the past
      }

      await createScheduledGame({
        game_type: eventType,
        title: title || (eventType === 'group-study' ? 'Group Bible Study' : 'Scrabble PT Game'),
        description: description || undefined,
        scheduled_at: dateTime,
        verse_reference: verseReference || undefined,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setScheduledDate('');
      setScheduledTime('');
      setVerseReference('');
      setShowCreateDialog(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRSVP = async (gameId: string, status: 'going' | 'maybe' | 'not_going') => {
    await updateRSVP(gameId, status);
  };

  const handleCancel = async (gameId: string) => {
    if (confirm('Are you sure you want to cancel this?')) {
      await cancelScheduledGame(gameId);
    }
  };

  const handleStartGame = async (gameId: string) => {
    // Generate a simple room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const success = await startScheduledGame(gameId, roomCode, gameId);
    if (success && onJoinGame) {
      onJoinGame(roomCode);
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
          <p>Sign in to schedule games/studies and RSVP</p>
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
          <h3 className="font-semibold">Scheduled Sessions</h3>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90">
              <Plus className="h-4 w-4" />
              Schedule New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarPlus className="h-5 w-5" />
                Schedule a Session
              </DialogTitle>
              <DialogDescription>
                Set up a future game or group study for others to join
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Event Type Selection */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={eventType === 'scrabble-pt' ? 'default' : 'outline'}
                  className={cn(
                    'flex-col h-auto py-3 gap-1',
                    eventType === 'scrabble-pt' && 'bg-gradient-to-r from-purple-500 to-blue-500'
                  )}
                  onClick={() => setEventType('scrabble-pt')}
                >
                  <Gamepad2 className="h-5 w-5" />
                  <span className="text-xs">Scrabble PT Game</span>
                </Button>
                <Button
                  type="button"
                  variant={eventType === 'group-study' ? 'default' : 'outline'}
                  className={cn(
                    'flex-col h-auto py-3 gap-1',
                    eventType === 'group-study' && 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  )}
                  onClick={() => setEventType('group-study')}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-xs">Group Bible Study</span>
                </Button>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder={eventType === 'group-study' ? 'e.g., Friday Night Bible Study' : 'e.g., Weekend PT Challenge'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder={eventType === 'group-study' ? 'Topic, passage to study, what to prepare...' : 'Any details about the game...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              {eventType === 'group-study' && (
                <div>
                  <Label htmlFor="verse">Passage/Verse Reference (optional)</Label>
                  <Input
                    id="verse"
                    placeholder="e.g., John 3:1-21"
                    value={verseReference}
                    onChange={(e) => setVerseReference(e.target.value)}
                  />
                </div>
              )}

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
                onClick={handleCreateEvent}
                disabled={!scheduledDate || !scheduledTime || isCreating}
                className={cn(
                  'w-full',
                  eventType === 'group-study' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                )}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Calendar className="h-4 w-4 mr-2" />
                )}
                Schedule {eventType === 'group-study' ? 'Study' : 'Game'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs for Games vs Studies */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="text-xs">
            All ({scheduledGames.length})
          </TabsTrigger>
          <TabsTrigger value="games" className="text-xs gap-1">
            <Gamepad2 className="h-3 w-3" />
            Games ({games.length})
          </TabsTrigger>
          <TabsTrigger value="studies" className="text-xs gap-1">
            <BookOpen className="h-3 w-3" />
            Studies ({studies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <ScheduledList
            items={scheduledGames}
            isLoading={isLoading}
            userId={user.id}
            onRSVP={handleRSVP}
            onCancel={handleCancel}
            onJoin={onJoinGame}
            onStartGame={handleStartGame}
          />
        </TabsContent>

        <TabsContent value="games" className="mt-4">
          <ScheduledList
            items={games}
            isLoading={isLoading}
            userId={user.id}
            onRSVP={handleRSVP}
            onCancel={handleCancel}
            onJoin={onJoinGame}
            onStartGame={handleStartGame}
            emptyMessage="No games scheduled yet"
          />
        </TabsContent>

        <TabsContent value="studies" className="mt-4">
          <ScheduledList
            items={studies}
            isLoading={isLoading}
            userId={user.id}
            onRSVP={handleRSVP}
            onCancel={handleCancel}
            onJoin={onJoinGame}
            onStartGame={handleStartGame}
            emptyMessage="No group studies scheduled yet"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// List component
interface ScheduledListProps {
  items: ScheduledGame[];
  isLoading: boolean;
  userId: string;
  onRSVP: (gameId: string, status: 'going' | 'maybe' | 'not_going') => void;
  onCancel: (gameId: string) => void;
  onJoin?: (roomCode: string) => void;
  onStartGame?: (gameId: string) => void;
  emptyMessage?: string;
}

function ScheduledList({ items, isLoading, userId, onRSVP, onCancel, onJoin, onStartGame, emptyMessage = 'Nothing scheduled yet' }: ScheduledListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="py-6 text-center text-muted-foreground">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{emptyMessage}</p>
          <p className="text-xs mt-1">Be the first to schedule one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((game) => (
          <ScheduledGameCard
            key={game.id}
            game={game}
            isHost={game.host_user_id === userId}
            onRSVP={onRSVP}
            onCancel={onCancel}
            onJoin={onJoin}
            onStartGame={onStartGame}
          />
        ))}
      </AnimatePresence>
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
  onStartGame?: (gameId: string) => void;
}

function ScheduledGameCard({ game, isHost, onRSVP, onCancel, onJoin, onStartGame }: ScheduledGameCardProps) {
  const scheduledDate = new Date(game.scheduled_at);
  const isPastScheduledTime = scheduledDate.getTime() <= Date.now();
  const isStartingSoon = scheduledDate.getTime() - Date.now() < 15 * 60 * 1000; // Within 15 min
  const hasStarted = game.status === 'started' && game.room_code;
  const isGroupStudy = game.game_type === 'group-study';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className={cn(
        'transition-all',
        isStartingSoon && 'border-yellow-500/50 bg-yellow-500/5',
        hasStarted && 'border-green-500/50 bg-green-500/5',
        isGroupStudy && !isStartingSoon && !hasStarted && 'border-emerald-500/30'
      )}>
        <CardHeader className="py-3 px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isGroupStudy ? (
                  <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Gamepad2 className="h-4 w-4 text-purple-500 shrink-0" />
                )}
                <CardTitle className="text-base truncate">
                  {game.title || (isGroupStudy ? 'Group Bible Study' : 'Scrabble PT Game')}
                </CardTitle>
              </div>
              <CardDescription className="flex items-center gap-2 text-xs">
                <Users className="h-3 w-3" />
                <span>Scheduled by <strong>{game.host_name}</strong></span>
                {isHost && (
                  <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">
                    YOU
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
            {isPastScheduledTime ? (
              <span className="text-orange-600 font-medium flex items-center gap-1">
                <Bell className="h-3 w-3" />
                Scheduled time has passed — ready to start!
              </span>
            ) : isStartingSoon ? (
              <span className="text-yellow-600 font-medium flex items-center gap-1">
                <Bell className="h-3 w-3" />
                Starting {formatDistanceToNow(scheduledDate, { addSuffix: true })}
              </span>
            ) : (
              <span>{formatDistanceToNow(scheduledDate, { addSuffix: true })}</span>
            )}
          </div>

          {/* Verse reference for studies */}
          {game.verse_reference && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{game.verse_reference}</span>
            </div>
          )}

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

          {/* Host: Start Game Now button */}
          {isHost && !hasStarted && onStartGame && (
            <Button
              onClick={() => onStartGame(game.id)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Game Now
            </Button>
          )}

          {/* Game started - Join button */}
          {hasStarted && game.room_code && onJoin && (
            <Button
              onClick={() => onJoin(game.room_code!)}
              className="w-full bg-green-500 hover:bg-green-600"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Join Now ({game.room_code})
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
