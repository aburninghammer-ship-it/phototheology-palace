// Group Study Session - Real-time multiplayer Bible study
// Gamified insights, voting, and discussion with split-screen personal study

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Trophy,
  MessageSquare,
  Book,
  Clock,
  Sparkles,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Send,
  Crown,
  Play,
  FastForward,
  LogOut,
  Copy,
  Check,
  Loader2,
  BookOpen,
  Search,
  GraduationCap,
  GitBranch,
  Languages,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { QuickShareCode } from '@/components/scrabble/QuickShareCode';
import { useAuth } from '@/hooks/useAuth';
import { useGroupStudySession } from '@/hooks/useGroupStudySession';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { CreateInsightInput } from '@/types/groupStudy';
import { getPhaseConfig, STUDY_SCORING } from '@/types/groupStudy';

// Personal study tool options
const STUDY_TOOLS = [
  { id: 'bible', label: 'Bible', path: '/bible', icon: BookOpen },
  { id: 'palace', label: 'Palace', path: '/palace', icon: Crown },
  { id: 'interlinear', label: 'Interlinear', path: '/interlinear', icon: Languages },
  { id: 'study-buddy', label: 'Study Buddy', path: '/study-buddy', icon: GraduationCap },
  { id: 'branch-study', label: 'Branch Study', path: '/branch-study', icon: GitBranch },
  { id: 'bible-search', label: 'Bible Search', path: '/bible-search', icon: Search },
] as const;

export default function GroupStudySession() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionIdFromUrl = searchParams.get('session');

  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Create session form state
  const [createSubject, setCreateSubject] = useState('');
  const [createContentText, setCreateContentText] = useState('');

  // Group study hook
  const {
    session,
    participants,
    myParticipant,
    insights,
    chatMessages,
    isLoading,
    error,
    createSession,
    joinSession,
    leaveSession,
    shareInsight,
    voteOnInsight,
    removeVote,
    sendChat,
    advancePhase,
    endSession,
    isHost,
    refreshSession,
  } = useGroupStudySession(sessionIdFromUrl || undefined);

  // Insight form state
  const [insightText, setInsightText] = useState('');
  const [verseReference, setVerseReference] = useState('');
  const [isChristConnection, setIsChristConnection] = useState(false);
  const [isSubmittingInsight, setIsSubmittingInsight] = useState(false);

  // Chat state
  const [chatInput, setChatInput] = useState('');

  // Phase timer
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Split-screen state
  const [activeStudyTool, setActiveStudyTool] = useState('bible');
  const [mobileView, setMobileView] = useState<'shared' | 'study'>('shared');
  const [showPersonalPane, setShowPersonalPane] = useState(true);

  // Calculate time remaining
  useEffect(() => {
    if (!session?.phaseEndsAt) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const endTime = new Date(session.phaseEndsAt!).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session?.phaseEndsAt]);

  // Handle create
  const handleCreate = async () => {
    if (!createSubject.trim()) {
      toast.error('Please enter a subject or verse');
      return;
    }
    const sessionId = await createSession(createSubject.trim(), createContentText.trim() || undefined);
    if (sessionId) {
      setSearchParams({ session: sessionId }, { replace: true });
    }
  };

  // Handle join
  const handleJoin = async () => {
    if (!roomCodeInput.trim()) {
      toast.error(t('groupStudy.enterRoomCode'));
      return;
    }
    const success = await joinSession(roomCodeInput.trim().toUpperCase());
    if (success) {
      // Session id will be set by the hook after join
    }
  };

  // Handle insight submission
  const handleShareInsight = async () => {
    if (!insightText.trim()) return;

    setIsSubmittingInsight(true);
    const input: CreateInsightInput = {
      insightText: insightText.trim(),
      verseReference: verseReference.trim() || undefined,
      isChristConnection,
    };

    const success = await shareInsight(input);
    if (success) {
      setInsightText('');
      setVerseReference('');
      setIsChristConnection(false);
    }
    setIsSubmittingInsight(false);
  };

  // Handle chat
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    await sendChat(chatInput.trim());
    setChatInput('');
  };

  // Copy room code
  const copyRoomCode = () => {
    if (session?.roomCode) {
      navigator.clipboard.writeText(session.roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast.success(t('groupStudy.roomCodeCopied'));
    }
  };

  // Phase config
  const phaseConfig = session ? getPhaseConfig(session.currentPhase) : null;

  // Get current study tool path
  const currentToolPath = STUDY_TOOLS.find(t => t.id === activeStudyTool)?.path || '/bible';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('groupStudy.signInRequired')}</h1>
          <Button onClick={() => navigate('/auth')}>{t('groupStudy.signIn')}</Button>
        </main>
      </div>
    );
  }

  // Join/Create screen - no active session
  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-md">
          <Button onClick={() => navigate('/games')} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('groupStudy.backToGames')}
          </Button>

          <Card>
            <CardHeader className="text-center">
              <div className="text-5xl mb-4">📖</div>
              <CardTitle className="text-2xl">{t('groupStudy.title')}</CardTitle>
              <CardDescription>
                Create or join a group Bible study session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create Session</TabsTrigger>
                  <TabsTrigger value="join">Join Session</TabsTrigger>
                </TabsList>

                {/* Create Tab */}
                <TabsContent value="create" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Subject / Verse</Label>
                    <Input
                      placeholder="e.g., John 3:16-21 or The Atonement"
                      value={createSubject}
                      onChange={(e) => setCreateSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      placeholder="Add context or study notes for participants..."
                      value={createContentText}
                      onChange={(e) => setCreateContentText(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleCreate}
                    className="w-full"
                    disabled={isLoading || !createSubject.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Session
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* Join Tab */}
                <TabsContent value="join" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>{t('groupStudy.roomCode')}</Label>
                    <Input
                      placeholder={t('groupStudy.enterCode')}
                      value={roomCodeInput}
                      onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="text-center text-2xl font-mono tracking-widest"
                    />
                  </div>
                  <Button
                    onClick={handleJoin}
                    className="w-full"
                    disabled={isLoading || roomCodeInput.length < 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('groupStudy.joining')}
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        {t('groupStudy.joinSession')}
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              {error && (
                <p className="text-sm text-destructive text-center mt-4">{error}</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Shared content panel (used in both desktop split and mobile)
  const sharedPanel = (
    <div className="flex flex-col gap-4 h-full min-h-0 p-4 overflow-auto">
      {/* Room code + invite */}
      {session.currentPhase === 'gathering' && (
        <Card className="shrink-0 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Share this code to invite others:</span>
              <QuickShareCode roomCode={session.roomCode} gameName="Group Study" />
            </div>
            <button
              onClick={copyRoomCode}
              className="w-full text-center text-3xl font-mono font-bold tracking-[0.3em] py-3 rounded-lg bg-background border hover:border-primary transition-colors flex items-center justify-center gap-2"
            >
              {session.roomCode}
              {copiedCode ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-muted-foreground" />}
            </button>
          </CardContent>
        </Card>
      )}

      {/* Study content */}
      <Card className="shrink-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Book className="h-5 w-5 text-primary" />
            <span className="font-semibold">{session.contentReference}</span>
          </div>
          {session.contentText && (
            <p className="text-sm italic">{session.contentText}</p>
          )}
        </CardContent>
      </Card>

      {/* Insight input - only during sharing phase */}
      {phaseConfig?.canSubmitInsights && (
        <Card className="shrink-0">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t('groupStudy.shareAnInsight')}</span>
            </div>
            <Textarea
              placeholder={t('groupStudy.insightPlaceholder')}
              value={insightText}
              onChange={(e) => setInsightText(e.target.value)}
              rows={3}
            />
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Input
                placeholder={t('groupStudy.versePlaceholder')}
                value={verseReference}
                onChange={(e) => setVerseReference(e.target.value)}
                className="max-w-[200px]"
              />
              <div className="flex items-center gap-2">
                <Switch
                  id="christ-connection"
                  checked={isChristConnection}
                  onCheckedChange={setIsChristConnection}
                />
                <Label htmlFor="christ-connection" className="text-sm">
                  {t('groupStudy.christConnection', { points: STUDY_SCORING.CHRIST_CONNECTION_BONUS })}
                </Label>
              </div>
              <Button
                onClick={handleShareInsight}
                disabled={!insightText.trim() || isSubmittingInsight}
              >
                {isSubmittingInsight ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    {t('groupStudy.share')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights feed */}
      <Card className="flex-1 min-h-[200px]">
        <CardHeader className="py-3 px-4 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {t('groupStudy.sharedInsights', { count: insights.length })}
          </CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-4 space-y-3">
            {insights.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('groupStudy.noInsightsYet')}
              </p>
            ) : (
              insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'p-4 rounded-lg border',
                    insight.isChristConnection && 'border-purple-500/50 bg-purple-500/5'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{insight.participantName}</span>
                      {insight.verseReference && (
                        <Badge variant="outline" className="text-xs">
                          {insight.verseReference}
                        </Badge>
                      )}
                      {insight.isChristConnection && (
                        <Badge className="bg-purple-500 text-xs">Christ</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {t('groupStudy.points', { count: insight.totalPoints })}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{insight.insightText}</p>
                  {phaseConfig?.canVote && insight.userId !== user?.id && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant={insight.myVote === 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => insight.myVote === 1 ? removeVote(insight.id) : voteOnInsight(insight.id, 1)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {insight.votesUp}
                      </Button>
                      <Button
                        variant={insight.myVote === -1 ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => insight.myVote === -1 ? removeVote(insight.id) : voteOnInsight(insight.id, -1)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {insight.votesDown}
                      </Button>
                    </div>
                  )}
                  {insight.userId === user?.id && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" /> {insight.votesUp}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3" /> {insight.votesDown}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Leaderboard */}
      <Card className="shrink-0">
        <CardHeader className="py-3 px-4 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {t('groupStudy.leaderboard')}
          </CardTitle>
        </CardHeader>
        <ScrollArea className="max-h-[200px]">
          <div className="p-2">
            {participants
              .sort((a, b) => b.score - a.score)
              .map((p, idx) => (
                <div
                  key={p.id}
                  className={cn(
                    'flex items-center justify-between p-2 rounded',
                    p.userId === user?.id && 'bg-primary/10'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-bold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="text-sm">
                      {p.displayName}
                      {p.userId === session.hostId && (
                        <Crown className="inline h-3 w-3 ml-1 text-yellow-500" />
                      )}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-yellow-500">{p.score}</span>
                </div>
              ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat */}
      <Card className="shrink-0 max-h-[300px] flex flex-col">
        <CardHeader className="py-3 px-4 border-b shrink-0">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('groupStudy.chat')}
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {chatMessages.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-4">
                {t('groupStudy.noMessagesYet')}
              </p>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'p-2 rounded text-sm',
                    msg.messageType === 'announcement' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                    msg.messageType === 'prayer' && 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  )}
                >
                  <span className="font-medium">{msg.userName}: </span>
                  <span>{msg.message}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        {phaseConfig?.canChat && (
          <div className="p-2 border-t shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder={t('groupStudy.typeMessage')}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="text-sm"
              />
              <Button size="icon" onClick={handleSendChat}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  // Personal study panel
  const personalStudyPanel = (
    <div className="flex flex-col h-full min-h-0">
      {/* Study tool selector toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 overflow-x-auto shrink-0">
        {STUDY_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={activeStudyTool === tool.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveStudyTool(tool.id)}
              className="shrink-0 text-xs"
            >
              <Icon className="h-3.5 w-3.5 mr-1" />
              {tool.label}
            </Button>
          );
        })}
      </div>
      {/* iframe for study tool */}
      <div className="flex-1 min-h-0">
        <iframe
          src={`${currentToolPath}?workspace=true`}
          className="w-full h-full border-0"
          title={`Personal Study - ${activeStudyTool}`}
        />
      </div>
    </div>
  );

  // Active session view with split-screen
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={leaveSession}>
              <LogOut className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold">{t('groupStudy.groupStudy')}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <button
                  onClick={copyRoomCode}
                  className="font-mono flex items-center gap-1 hover:text-primary"
                >
                  {session.roomCode}
                  {copiedCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
                <span className="text-muted-foreground/50">|</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {participants.length}
                </span>
              </div>
            </div>
          </div>

          {/* Phase indicator */}
          <div className="flex items-center gap-4">
            <Badge variant={phaseConfig?.canSubmitInsights ? 'default' : 'secondary'}>
              {phaseConfig?.label}
            </Badge>
            {timeRemaining !== null && (
              <div className="flex items-center gap-1 font-mono">
                <Clock className="h-4 w-4" />
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle personal study pane (desktop) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPersonalPane(!showPersonalPane)}
              className="hidden lg:flex"
            >
              {showPersonalPane ? (
                <><PanelRightClose className="h-4 w-4 mr-1" /> Hide Study</>
              ) : (
                <><PanelLeftClose className="h-4 w-4 mr-1" /> My Study</>
              )}
            </Button>

            {/* Host controls */}
            {isHost && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={advancePhase}
                  disabled={session.currentPhase === 'recap'}
                >
                  <FastForward className="h-4 w-4 mr-1" />
                  {t('groupStudy.nextPhase')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={endSession}
                >
                  {t('groupStudy.end')}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile tab toggle */}
      <div className="lg:hidden border-b">
        <div className="flex">
          <button
            onClick={() => setMobileView('shared')}
            className={cn(
              'flex-1 py-2 text-center text-sm font-medium border-b-2 transition-colors',
              mobileView === 'shared' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            )}
          >
            <Users className="inline h-4 w-4 mr-1" />
            Shared
          </button>
          <button
            onClick={() => setMobileView('study')}
            className={cn(
              'flex-1 py-2 text-center text-sm font-medium border-b-2 transition-colors',
              mobileView === 'study' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            )}
          >
            <BookOpen className="inline h-4 w-4 mr-1" />
            My Study
          </button>
        </div>
      </div>

      {/* Content area */}
      {/* Desktop: ResizablePanelGroup split-screen */}
      <div className="flex-1 hidden lg:flex min-h-0">
        {showPersonalPane ? (
          <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-65px)]">
            <ResizablePanel defaultSize={55} minSize={30}>
              {sharedPanel}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={45} minSize={25}>
              {personalStudyPanel}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="w-full h-[calc(100vh-65px)]">
            {sharedPanel}
          </div>
        )}
      </div>

      {/* Mobile: Tab toggle view */}
      <div className="flex-1 lg:hidden min-h-0">
        {mobileView === 'shared' ? (
          <div className="h-[calc(100vh-120px)] overflow-auto">
            {sharedPanel}
          </div>
        ) : (
          <div className="h-[calc(100vh-120px)]">
            {personalStudyPanel}
          </div>
        )}
      </div>
    </div>
  );
}
