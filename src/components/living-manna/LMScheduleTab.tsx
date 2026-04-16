import { useState } from 'react';
import { toast } from 'sonner';
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
  Megaphone,
  Mic,
  MessageSquare,
  Sparkles,
  Layers,
  Vote,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// PT Principle Focus options
const PT_PRINCIPLE_OPTIONS = [
  { value: 'CR', label: 'Concentration Room', description: 'Christ-focused study' },
  { value: 'DR', label: 'Dimensions Room', description: '5-dimension analysis' },
  { value: 'OR', label: 'Observation Room', description: 'Text analysis' },
  { value: 'SR', label: 'Story Room', description: 'Narrative focus' },
  { value: 'BL', label: 'Blue Room', description: 'Sanctuary/blueprint' },
  { value: 'IR', label: 'Imagination Room', description: 'Visualization' },
];

interface GroupStudyFeatures {
  liveAudio: boolean;
  textFeed: boolean;
  sparks: boolean;
  ptCards: boolean;
  voting: boolean;
}

interface LMScheduleTabProps {
  churchId: string;
}

export function LMScheduleTab({ churchId }: LMScheduleTabProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    scheduledGames,
    isLoading,
    createScheduledGame,
    updateRSVP,
    cancelScheduledGame,
  } = useScheduledGames(churchId);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Form state
  const [selectedActivity, setSelectedActivity] = useState<ScheduledActivityType | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [verseReference, setVerseReference] = useState('');
  const [studyTopic, setStudyTopic] = useState('');
  const [ptFocus, setPtFocus] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('12');
  const [studyFeatures, setStudyFeatures] = useState<GroupStudyFeatures>({
    liveAudio: true,
    textFeed: true,
    sparks: true,
    ptCards: false,
    voting: true,
  });

  // Filter games by category
  const gameTypeIds = getGameActivities().map(a => a.id);
  const studyTypeIds = getStudyActivities().map(a => a.id);

  const games = scheduledGames.filter(g => gameTypeIds.includes(g.game_type as ScheduledActivityType));
  const studies = scheduledGames.filter(g => studyTypeIds.includes(g.game_type as ScheduledActivityType));
  const mySchedule = scheduledGames.filter(g => g.host_user_id === user?.id || g.my_rsvp === 'going');

  const isGroupStudy = selectedActivity === 'group-study' || selectedActivity === 'live-study-room';
  const selectedActivityConfig = selectedActivity ? getActivityById(selectedActivity) : null;

  const resetForm = () => {
    setSelectedActivity('');
    setTitle('');
    setDescription('');
    setScheduledDate('');
    setScheduledTime('');
    setVerseReference('');
    setStudyTopic('');
    setPtFocus('');
    setMaxParticipants('12');
    setStudyFeatures({
      liveAudio: true,
      textFeed: true,
      sparks: true,
      ptCards: false,
      voting: true,
    });
  };

  const handleCreateEvent = async () => {
    if (!scheduledDate || !scheduledTime || !selectedActivity) return;

    setIsCreating(true);
    try {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (dateTime <= new Date()) {
        toast.error('Please select a future date and time');
        setIsCreating(false);
        return;
      }

      const activity = getActivityById(selectedActivity);

      const gameOptions = isGroupStudy ? {
        features: studyFeatures,
        ptFocus: ptFocus || undefined,
        topic: studyTopic || undefined,
      } : undefined;

      await createScheduledGame({
        game_type: selectedActivity as ScheduledEventType,
        title: title || activity?.name || 'Scheduled Session',
        description: description || (studyTopic ? `Topic: ${studyTopic}` : undefined),
        scheduled_at: dateTime,
        verse_reference: verseReference || undefined,
        max_players: isGroupStudy ? parseInt(maxParticipants) : activity?.maxPlayers,
        game_options: gameOptions,
      });

      resetForm();
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
      const route = game.room_code
        ? `${activity.route}?room=${game.room_code}`
        : activity.route;
      navigate(route);
    }
  };

  const toggleFeature = (feature: keyof GroupStudyFeatures) => {
    setStudyFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const now = new Date();
  const minDate = format(now, 'yyyy-MM-dd');
  const minTime = format(new Date(now.getTime() + 5 * 60000), 'HH:mm');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-primary" />
            Church Schedule
          </h3>
          <p className="text-sm text-muted-foreground">Plan studies and games with your community</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Schedule a Study
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="text-xs">
            All ({scheduledGames.length})
          </TabsTrigger>
          <TabsTrigger value="studies" className="text-xs">
            Studies ({studies.length})
          </TabsTrigger>
          <TabsTrigger value="games" className="text-xs">
            Games ({games.length})
          </TabsTrigger>
          <TabsTrigger value="mine" className="text-xs">
            My Schedule ({mySchedule.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ScheduledList
            items={scheduledGames}
            isLoading={isLoading}
            userId={user?.id || ''}
            onRSVP={handleRSVP}
            onCancel={handleCancel}
            onJoin={handleJoin}
          />
        </TabsContent>

        <TabsContent value="studies">
          <ScheduledList
            items={studies}
            isLoading={isLoading}
            userId={user?.id || ''}
            onRSVP={handleRSVP}
            onCancel={handleCancel}
            onJoin={handleJoin}
            emptyMessage="No studies scheduled yet"
          />
        </TabsContent>

        <TabsContent value="games">
          <ScheduledList
            items={games}
            isLoading={isLoading}
            userId={user?.id || ''}
            onRSVP={handleRSVP}
            onCancel={handleCancel}
            onJoin={handleJoin}
            emptyMessage="No games scheduled yet"
          />
        </TabsContent>

        <TabsContent value="mine">
          <ScheduledList
            items={mySchedule}
            isLoading={isLoading}
            userId={user?.id || ''}
            onRSVP={handleRSVP}
            onCancel={handleCancel}
            onJoin={handleJoin}
            emptyMessage="You haven't RSVP'd to anything yet"
          />
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              Schedule an Activity
            </DialogTitle>
            <DialogDescription>
              Choose what you'd like to schedule for your community
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-5 pb-4">
              {/* Activity Type Dropdown */}
              <div>
                <Label className="text-sm font-medium">What would you like to schedule?</Label>
                <Select value={selectedActivity} onValueChange={(v) => setSelectedActivity(v as ScheduledActivityType)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select activity type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-xs text-muted-foreground font-semibold">Studies</SelectLabel>
                      {getStudyActivities().map((activity) => (
                        <SelectItem key={activity.id} value={activity.id}>
                          <div className="flex items-center gap-2">
                            <div className={cn('p-1 rounded bg-gradient-to-br', activity.gradient)}>
                              <activity.icon className="h-3 w-3 text-white" />
                            </div>
                            <span>{activity.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({activity.minPlayers}-{activity.maxPlayers} players)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="text-xs text-muted-foreground font-semibold mt-2">Games</SelectLabel>
                      {getGameActivities().map((activity) => (
                        <SelectItem key={activity.id} value={activity.id}>
                          <div className="flex items-center gap-2">
                            <div className={cn('p-1 rounded bg-gradient-to-br', activity.gradient)}>
                              <activity.icon className="h-3 w-3 text-white" />
                            </div>
                            <span>{activity.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({activity.minPlayers}-{activity.maxPlayers} players)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Show configuration once activity is selected */}
              {selectedActivity && (
                <>
                  {/* Selected Activity Info */}
                  {selectedActivityConfig && (
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: `linear-gradient(to right, hsl(var(--muted)), hsl(var(--muted)))` }}>
                      <div className={cn('p-2 rounded-lg bg-gradient-to-br', selectedActivityConfig.gradient)}>
                        <selectedActivityConfig.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedActivityConfig.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedActivityConfig.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lm-date" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lm-date"
                        type="date"
                        min={minDate}
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lm-time" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Time <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lm-time"
                        type="time"
                        min={scheduledDate === minDate ? minTime : undefined}
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="lm-title">Title</Label>
                    <Input
                      id="lm-title"
                      placeholder={`e.g., Friday Night ${selectedActivityConfig?.name || 'Session'}`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Group Study Configuration */}
                  {isGroupStudy && (
                    <>
                      <div>
                        <Label htmlFor="lm-topic">Subject/Topic of Study</Label>
                        <Input
                          id="lm-topic"
                          placeholder="e.g., The Sanctuary in Hebrews"
                          value={studyTopic}
                          onChange={(e) => setStudyTopic(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="lm-verse">Passage Reference</Label>
                        <Input
                          id="lm-verse"
                          placeholder="e.g., Hebrews 9:1-14"
                          value={verseReference}
                          onChange={(e) => setVerseReference(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>PT Principle Focus (optional)</Label>
                        <Select value={ptFocus} onValueChange={setPtFocus}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select a room focus..." />
                          </SelectTrigger>
                          <SelectContent>
                            {PT_PRINCIPLE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{option.label}</span>
                                  <span className="text-xs text-muted-foreground">- {option.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Room Features */}
                      <div>
                        <Label className="mb-3 block">Room Features</Label>
                        <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="lm-liveAudio"
                              checked={studyFeatures.liveAudio}
                              onCheckedChange={() => toggleFeature('liveAudio')}
                            />
                            <div className="grid gap-0.5 leading-none">
                              <label htmlFor="lm-liveAudio" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                <Mic className="h-4 w-4 text-blue-500" />
                                Live Audio Chat
                              </label>
                              <p className="text-xs text-muted-foreground">Voice conversations during study</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="lm-textFeed"
                              checked={studyFeatures.textFeed}
                              onCheckedChange={() => toggleFeature('textFeed')}
                            />
                            <div className="grid gap-0.5 leading-none">
                              <label htmlFor="lm-textFeed" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-green-500" />
                                Live Text Feed
                              </label>
                              <p className="text-xs text-muted-foreground">Real-time chat messages</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="lm-sparks"
                              checked={studyFeatures.sparks}
                              onCheckedChange={() => toggleFeature('sparks')}
                            />
                            <div className="grid gap-0.5 leading-none">
                              <label htmlFor="lm-sparks" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                Sparks Integration
                              </label>
                              <p className="text-xs text-muted-foreground">AI-generated insights for discussion</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="lm-ptCards"
                              checked={studyFeatures.ptCards}
                              onCheckedChange={() => toggleFeature('ptCards')}
                            />
                            <div className="grid gap-0.5 leading-none">
                              <label htmlFor="lm-ptCards" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                <Layers className="h-4 w-4 text-purple-500" />
                                PT Principle Cards
                              </label>
                              <p className="text-xs text-muted-foreground">Apply Palace principles to the study</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="lm-voting"
                              checked={studyFeatures.voting}
                              onCheckedChange={() => toggleFeature('voting')}
                            />
                            <div className="grid gap-0.5 leading-none">
                              <label htmlFor="lm-voting" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                <Vote className="h-4 w-4 text-orange-500" />
                                Voting on Insights
                              </label>
                              <p className="text-xs text-muted-foreground">Gamified discussion with upvotes</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="lm-maxParticipants">Max Participants</Label>
                        <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[4, 6, 8, 10, 12, 15, 20].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} participants
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Non-study verse reference */}
                  {!isGroupStudy && selectedActivityConfig?.supportsVerse && (
                    <div>
                      <Label htmlFor="lm-verse-alt">Passage/Verse Reference (optional)</Label>
                      <Input
                        id="lm-verse-alt"
                        placeholder="e.g., John 3:1-21"
                        value={verseReference}
                        onChange={(e) => setVerseReference(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <Label htmlFor="lm-description">Description (optional)</Label>
                    <Textarea
                      id="lm-description"
                      placeholder="Any additional details about this session..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Submit Button */}
          {selectedActivity && (
            <div className="pt-4 border-t border-border relative z-50">
              {(!scheduledDate || !scheduledTime) && (
                <p className="text-xs text-amber-400 mb-2 text-center">
                  Please scroll up to set a date and time
                </p>
              )}
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Inlined ScheduledList and ScheduledActivityCard ---

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
      <Card variant="glass">
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
          <LMActivityCard
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

interface LMActivityCardProps {
  game: ScheduledGame;
  isHost: boolean;
  onRSVP: (gameId: string, status: 'going' | 'maybe' | 'not_going') => void;
  onCancel: (gameId: string) => void;
  onJoin: (game: ScheduledGame) => void;
}

function LMActivityCard({ game, isHost, onRSVP, onCancel, onJoin }: LMActivityCardProps) {
  const scheduledDate = new Date(game.scheduled_at);
  const isStartingSoon = scheduledDate.getTime() - Date.now() < 15 * 60 * 1000;
  const hasStarted = game.status === 'started' && game.room_code;
  const [notifying, setNotifying] = useState(false);

  const sendReminder = async () => {
    setNotifying(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const activity = getActivityById(game.game_type);
      const globalChannel = supabase.channel('global-notifications');
      await globalChannel.send({
        type: 'broadcast',
        event: 'event-scheduled',
        payload: {
          title: game.title || activity?.name || 'Scheduled Session',
          hostName: game.host_name,
          scheduledAt: game.scheduled_at,
          gameType: game.game_type,
        },
      });
      supabase.removeChannel(globalChannel);
      toast.success('Notification sent to all users!');
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setNotifying(false);
    }
  };

  const activity = getActivityById(game.game_type);
  const Icon = activity?.icon || Calendar;
  const gameOptions = game.game_options;
  const features = gameOptions?.features;
  const ptFocus = gameOptions?.ptFocus;
  const topic = gameOptions?.topic;

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
                <span>·</span>
                <span>by {game.host_name}</span>
                {isHost && (
                  <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">
                    HOST
                  </span>
                )}
              </CardDescription>
            </div>
            {isHost && !hasStarted && (
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-blue-500"
                  onClick={sendReminder}
                  disabled={notifying}
                  title="Send notification"
                >
                  {notifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onCancel(game.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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

          {/* Topic */}
          {topic && (
            <div className="flex items-center gap-1.5 text-sm">
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">{topic}</span>
            </div>
          )}

          {/* Verse reference */}
          {game.verse_reference && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <span>{game.verse_reference}</span>
            </div>
          )}

          {/* PT Focus */}
          {ptFocus && (
            <div className="text-xs">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                {PT_PRINCIPLE_OPTIONS.find(p => p.value === ptFocus)?.label || ptFocus}
              </span>
            </div>
          )}

          {/* Room features */}
          {features && (
            <div className="flex flex-wrap gap-1.5">
              {features.liveAudio && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                  <Mic className="h-3 w-3" /> Audio
                </span>
              )}
              {features.textFeed && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                  <MessageSquare className="h-3 w-3" /> Chat
                </span>
              )}
              {features.sparks && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded">
                  <Sparkles className="h-3 w-3" /> Sparks
                </span>
              )}
              {features.ptCards && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">
                  <Layers className="h-3 w-3" /> Cards
                </span>
              )}
              {features.voting && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded">
                  <Vote className="h-3 w-3" /> Voting
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {game.description && !topic && (
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
                (max {game.max_players || activity.maxPlayers})
              </span>
            )}
          </div>

          {/* Join button */}
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
