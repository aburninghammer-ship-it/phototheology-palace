import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Plus,
  Users,
  ArrowRight,
  Calendar,
  Clock,
  Loader2,
  CalendarPlus,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useScheduledGames, type ScheduledEventType } from '@/hooks/useScheduledGames';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  SCHEDULABLE_ACTIVITIES,
  getActivityById,
  getGameActivities,
  type ScheduledActivityType,
} from '@/config/schedulableActivities';
import { ActiveGameSessions } from '@/components/games/ActiveGameSessions';

interface LMGamesTabProps {
  churchId: string;
}

export function LMGamesTab({ churchId }: LMGamesTabProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createScheduledGame } = useScheduledGames(churchId);

  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [selectedGame, setSelectedGame] = useState<ScheduledActivityType | ''>('');
  const [title, setTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const selectedConfig = selectedGame ? getActivityById(selectedGame) : null;

  const resetForm = () => {
    setSelectedGame('');
    setTitle('');
    setScheduledDate('');
    setScheduledTime('');
  };

  const handleSchedule = async () => {
    if (!scheduledDate || !scheduledTime || !selectedGame) return;

    setIsCreating(true);
    try {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (dateTime <= new Date()) {
        toast.error('Please select a future date and time');
        setIsCreating(false);
        return;
      }

      const activity = getActivityById(selectedGame);

      await createScheduledGame({
        game_type: selectedGame as ScheduledEventType,
        title: title || `${activity?.name} Night` || 'Game Night',
        scheduled_at: dateTime,
        max_players: activity?.maxPlayers,
      });

      resetForm();
      setShowScheduleDialog(false);
    } finally {
      setIsCreating(false);
    }
  };

  const now = new Date();
  const minDate = format(now, 'yyyy-MM-dd');
  const minTime = format(new Date(now.getTime() + 5 * 60000), 'HH:mm');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Community Games
          </h3>
          <p className="text-sm text-muted-foreground">Play and compete with your church family</p>
        </div>
        <Button
          onClick={() => setShowScheduleDialog(true)}
          variant="outline"
          className="gap-2"
        >
          <CalendarPlus className="h-4 w-4" />
          Schedule Game Night
        </Button>
      </div>

      {/* Active Sessions */}
      <ActiveGameSessions />

      {/* Game Cards Grid */}
      <div>
        <h4 className="text-md font-semibold mb-3">Available Games</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCHEDULABLE_ACTIVITIES.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * index }}
            >
              <Card
                variant="glass"
                className="hover:border-primary/30 transition-all cursor-pointer hover:-translate-y-0.5"
                onClick={() => navigate(activity.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2.5 rounded-lg bg-gradient-to-br shrink-0',
                      activity.gradient
                    )}>
                      <activity.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm">{activity.name}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          <Users className="h-3 w-3 mr-1" />
                          {activity.minPlayers}-{activity.maxPlayers}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] px-1.5 py-0',
                            activity.category === 'games'
                              ? 'border-purple-500/30 text-purple-600 dark:text-purple-400'
                              : 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          )}
                        >
                          {activity.category === 'games' ? 'Game' : 'Study'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className={cn('w-full mt-3 bg-gradient-to-r', activity.gradient)}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(activity.route);
                    }}
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* See All Games Link */}
      <div className="text-center">
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-primary"
          onClick={() => navigate('/games')}
        >
          See All 40+ Games
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Schedule Game Night Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={(open) => {
        setShowScheduleDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              Schedule a Game Night
            </DialogTitle>
            <DialogDescription>
              Pick a game and time for your church community
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-5 pb-4">
              {/* Game Selector */}
              <div>
                <Label className="text-sm font-medium">Which game?</Label>
                <Select value={selectedGame} onValueChange={(v) => setSelectedGame(v as ScheduledActivityType)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a game..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-xs text-muted-foreground font-semibold">Games</SelectLabel>
                      {getGameActivities().map((act) => (
                        <SelectItem key={act.id} value={act.id}>
                          <div className="flex items-center gap-2">
                            <div className={cn('p-1 rounded bg-gradient-to-br', act.gradient)}>
                              <act.icon className="h-3 w-3 text-white" />
                            </div>
                            <span>{act.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({act.minPlayers}-{act.maxPlayers})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {selectedGame && (
                <>
                  {/* Selected Info */}
                  {selectedConfig && (
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: `linear-gradient(to right, hsl(var(--muted)), hsl(var(--muted)))` }}>
                      <div className={cn('p-2 rounded-lg bg-gradient-to-br', selectedConfig.gradient)}>
                        <selectedConfig.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedConfig.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedConfig.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gn-date" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="gn-date"
                        type="date"
                        min={minDate}
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gn-time" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Time <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="gn-time"
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
                    <Label htmlFor="gn-title">Event Title (optional)</Label>
                    <Input
                      id="gn-title"
                      placeholder={`e.g., Friday Night ${selectedConfig?.name || 'Games'}`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Submit Button */}
          {selectedGame && (
            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleSchedule}
                disabled={!scheduledDate || !scheduledTime || isCreating}
                className={cn(
                  'w-full bg-gradient-to-r',
                  selectedConfig?.gradient || 'from-primary to-blue-500'
                )}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CalendarPlus className="h-4 w-4 mr-2" />
                )}
                Schedule {selectedConfig?.name}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
