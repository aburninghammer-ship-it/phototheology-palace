import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Filter,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  SCHEDULABLE_ACTIVITIES,
  getActivityById,
  getGameActivities,
  getStudyActivities,
  type ScheduledActivityType,
} from '@/config/schedulableActivities';

const Schedule = () => {
  const navigate = useNavigate();
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
  const [activeTab, setActiveTab] = useState('all');

  // Form state
  const [selectedActivity, setSelectedActivity] = useState<ScheduledActivityType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [verseReference, setVerseReference] = useState('');

  // Filter games by category
  const gameTypes = getGameActivities().map(a => a.id);
  const studyTypes = getStudyActivities().map(a => a.id);

  const games = scheduledGames.filter(g => gameTypes.includes(g.game_type as ScheduledActivityType));
  const studies = scheduledGames.filter(g => studyTypes.includes(g.game_type as ScheduledActivityType));
  const mySchedule = scheduledGames.filter(g => g.host_user_id === user?.id || g.my_rsvp === 'going');

  const handleCreateEvent = async () => {
    if (!scheduledDate || !scheduledTime || !selectedActivity) return;

    setIsCreating(true);
    try {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (dateTime <= new Date()) {
        return;
      }

      const activity = getActivityById(selectedActivity);
      await createScheduledGame({
        game_type: selectedActivity as ScheduledEventType,
        title: title || activity?.name || 'Scheduled Session',
        description: description || undefined,
        scheduled_at: dateTime,
        verse_reference: verseReference || undefined,
        max_players: activity?.maxPlayers,
      });

      // Reset form
      setSelectedActivity(null);
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

  const handleJoin = (game: ScheduledGame) => {
    const activity = getActivityById(game.game_type);
    if (activity) {
      // Navigate to the game route with room code if available
      const route = game.room_code
        ? `${activity.route}?room=${game.room_code}`
        : activity.route;
      navigate(route);
    }
  };

  // Get min date/time for scheduling
  const now = new Date();
  const minDate = format(now, 'yyyy-MM-dd');
  const minTime = format(new Date(now.getTime() + 5 * 60000), 'HH:mm');

  const selectedActivityConfig = selectedActivity ? getActivityById(selectedActivity) : null;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Sign in to schedule activities</p>
              <p className="text-sm mt-2">Create games and studies for others to join</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarPlus className="h-6 w-6 text-primary" />
              Schedule
            </h1>
            <p className="text-muted-foreground text-sm">Plan games and studies with others</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 bg-gradient-to-r from-primary to-blue-500"
          >
            <Plus className="h-4 w-4" />
            Schedule New
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all" className="text-xs">
              All ({scheduledGames.length})
            </TabsTrigger>
            <TabsTrigger value="games" className="text-xs">
              Games ({games.length})
            </TabsTrigger>
            <TabsTrigger value="studies" className="text-xs">
              Studies ({studies.length})
            </TabsTrigger>
            <TabsTrigger value="mine" className="text-xs">
              My Schedule ({mySchedule.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScheduledList
              items={scheduledGames}
              isLoading={isLoading}
              userId={user.id}
              onRSVP={handleRSVP}
              onCancel={handleCancel}
              onJoin={handleJoin}
            />
          </TabsContent>

          <TabsContent value="games">
            <ScheduledList
              items={games}
              isLoading={isLoading}
              userId={user.id}
              onRSVP={handleRSVP}
              onCancel={handleCancel}
              onJoin={handleJoin}
              emptyMessage="No games scheduled yet"
            />
          </TabsContent>

          <TabsContent value="studies">
            <ScheduledList
              items={studies}
              isLoading={isLoading}
              userId={user.id}
              onRSVP={handleRSVP}
              onCancel={handleCancel}
              onJoin={handleJoin}
              emptyMessage="No studies scheduled yet"
            />
          </TabsContent>

          <TabsContent value="mine">
            <ScheduledList
              items={mySchedule}
              isLoading={isLoading}
              userId={user.id}
              onRSVP={handleRSVP}
              onCancel={handleCancel}
              onJoin={handleJoin}
              emptyMessage="You haven't RSVP'd to anything yet"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              Schedule a Session
            </DialogTitle>
            <DialogDescription>
              Choose an activity and set a time for others to join
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-4">
              {/* Activity Type Selection */}
              {!selectedActivity ? (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Games</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {getGameActivities().map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <Button
                          key={activity.id}
                          type="button"
                          variant="outline"
                          className={cn(
                            'flex-col h-auto py-4 gap-2 hover:border-primary/50',
                            `hover:bg-gradient-to-br hover:${activity.gradient}/10`
                          )}
                          onClick={() => setSelectedActivity(activity.id)}
                        >
                          <div className={cn('p-2 rounded-lg bg-gradient-to-br', activity.gradient)}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-xs font-medium">{activity.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {activity.minPlayers}-{activity.maxPlayers} players
                          </span>
                        </Button>
                      );
                    })}
                  </div>

                  <Label className="text-base font-semibold">Studies</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {getStudyActivities().map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <Button
                          key={activity.id}
                          type="button"
                          variant="outline"
                          className={cn(
                            'flex-col h-auto py-4 gap-2 hover:border-primary/50',
                            `hover:bg-gradient-to-br hover:${activity.gradient}/10`
                          )}
                          onClick={() => setSelectedActivity(activity.id)}
                        >
                          <div className={cn('p-2 rounded-lg bg-gradient-to-br', activity.gradient)}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-xs font-medium">{activity.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {activity.minPlayers}-{activity.maxPlayers} players
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected Activity Header */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    {selectedActivityConfig && (
                      <>
                        <div className={cn('p-2 rounded-lg bg-gradient-to-br', selectedActivityConfig.gradient)}>
                          <selectedActivityConfig.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{selectedActivityConfig.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedActivityConfig.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedActivity(null)}
                        >
                          Change
                        </Button>
                      </>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder={`e.g., ${selectedActivityConfig?.name} Session`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Any details about this session..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                    />
                  </div>

                  {selectedActivityConfig?.supportsVerse && (
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
                      'w-full bg-gradient-to-r',
                      selectedActivityConfig?.gradient || 'from-primary to-blue-500'
                    )}
                  >
                    {isCreating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Calendar className="h-4 w-4 mr-2" />
                    )}
                    Schedule {selectedActivityConfig?.name}
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// List component
interface ScheduledListProps {
  items: ScheduledGame[];
  isLoading: boolean;
  userId: string;
  onRSVP: (gameId: string, status: 'going' | 'maybe' | 'not_going') => void;
  onCancel: (gameId: string) => void;
  onJoin: (game: ScheduledGame) => void;
  emptyMessage?: string;
}

function ScheduledList({ items, isLoading, userId, onRSVP, onCancel, onJoin, emptyMessage = 'Nothing scheduled yet' }: ScheduledListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="py-12 text-center text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">{emptyMessage}</p>
          <p className="text-sm mt-2">Be the first to schedule something!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((game) => (
          <ScheduledActivityCard
            key={game.id}
            game={game}
            isHost={game.host_user_id === userId}
            onRSVP={onRSVP}
            onCancel={onCancel}
            onJoin={onJoin}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Individual activity card
interface ScheduledActivityCardProps {
  game: ScheduledGame;
  isHost: boolean;
  onRSVP: (gameId: string, status: 'going' | 'maybe' | 'not_going') => void;
  onCancel: (gameId: string) => void;
  onJoin: (game: ScheduledGame) => void;
}

function ScheduledActivityCard({ game, isHost, onRSVP, onCancel, onJoin }: ScheduledActivityCardProps) {
  const scheduledDate = new Date(game.scheduled_at);
  const isStartingSoon = scheduledDate.getTime() - Date.now() < 15 * 60 * 1000;
  const hasStarted = game.status === 'started' && game.room_code;

  const activity = getActivityById(game.game_type);
  const Icon = activity?.icon || Calendar;

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
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  'p-1.5 rounded-md bg-gradient-to-br',
                  activity?.gradient || 'from-gray-500 to-gray-600'
                )}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base truncate">
                  {game.title || activity?.name || 'Scheduled Session'}
                </CardTitle>
              </div>
              <CardDescription className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">{activity?.name}</span>
                <span>•</span>
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

          {/* Verse reference */}
          {game.verse_reference && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
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
            {activity && (
              <span className="text-muted-foreground">
                (max {activity.maxPlayers})
              </span>
            )}
          </div>

          {/* Game started - Join button */}
          {hasStarted && (
            <Button
              onClick={() => onJoin(game)}
              className="w-full bg-green-500 hover:bg-green-600"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Join Now
            </Button>
          )}

          {/* RSVP buttons */}
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

export default Schedule;
