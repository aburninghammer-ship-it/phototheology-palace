import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGameSession } from "@/hooks/useGameSession";
import { toast } from "sonner";
import { Clock, HelpCircle, Trophy, Zap, CheckCircle, XCircle, Play, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Puzzle {
  id: string;
  puzzle_number: number;
  floor_number: number | null;
  room_tag: string;
  principle: string;
  prompt: string;
  expected_verses: string[];
  typology_notes: string;
  points_perfect: number;
  points_partial: number;
  time_cap_minutes: number | null;
}

interface EscapeRoom {
  id: string;
  title: string;
  mode: string;
  category: string | null;
  time_limit_minutes: number;
  max_hints: number;
  biblical_conclusion: string;
  expires_at: string;
}

// Game state for persistence
interface EscapeRoomGameState {
  roomId: string;
  attemptId: string | null;
  currentPuzzleIndex: number;
  timeElapsed: number;
  score: number;
  hintsUsed: number;
  showHint: boolean;
  submittedVerses: string;
  roomJustification: string;
  principleUsed: string;
  usedPrinciples: string[];
  solutions: { puzzle_number: number; is_correct: boolean; points_earned: number }[];
}

export default function EscapeRoomPlay() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [room, setRoom] = useState<EscapeRoom | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Use game session for state persistence
  const initialGameState: EscapeRoomGameState = {
    roomId: roomId || '',
    attemptId: null,
    currentPuzzleIndex: 0,
    timeElapsed: 0,
    score: 0,
    hintsUsed: 0,
    showHint: false,
    submittedVerses: '',
    roomJustification: '',
    principleUsed: '',
    usedPrinciples: [],
    solutions: [],
  };

  const {
    gameState,
    hasExistingSession,
    isLoading: sessionLoading,
    saveSession,
    startNewGame,
    resumeGame,
    completeGame,
    setGameState,
  } = useGameSession<EscapeRoomGameState>({
    gameType: `escape_room_${roomId}`,
    initialState: initialGameState,
    totalSteps: puzzles.length,
    autoSaveInterval: 15000, // Save every 15 seconds
  });

  // Derived state from gameState
  const currentPuzzleIndex = gameState.currentPuzzleIndex;
  const attemptId = gameState.attemptId;
  const submittedVerses = gameState.submittedVerses;
  const roomJustification = gameState.roomJustification;
  const principleUsed = gameState.principleUsed;
  const usedPrinciples = gameState.usedPrinciples;
  const timeElapsed = gameState.timeElapsed;
  const score = gameState.score;
  const hintsUsed = gameState.hintsUsed;
  const showHint = gameState.showHint;
  const solutions = gameState.solutions;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load room data
  useEffect(() => {
    if (!user || !roomId) return;
    loadEscapeRoom();
  }, [user, roomId]);

  // Show resume dialog if there's an existing session
  useEffect(() => {
    if (!sessionLoading && hasExistingSession && gameState.roomId === roomId) {
      setShowResumeDialog(true);
    }
  }, [sessionLoading, hasExistingSession, gameState.roomId, roomId]);

  // Timer - only runs when game has started
  useEffect(() => {
    if (!gameStarted || !room) return;

    const timer = setInterval(() => {
      setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, room]);

  // Handle resume game
  const handleResumeGame = useCallback(() => {
    resumeGame();
    setGameStarted(true);
    setShowResumeDialog(false);
    toast.success(t('escapeRoom.play.welcomeBack'));
  }, [resumeGame]);

  // Handle start new game
  const handleStartNewGame = useCallback(async () => {
    await startNewGame();
    await createNewAttempt();
    setGameStarted(true);
    setShowResumeDialog(false);
  }, [startNewGame]);

  // Create new attempt in the escape_room_attempts table
  const createNewAttempt = async () => {
    if (!user || !roomId) return;

    const { data, error } = await supabase
      .from('escape_room_attempts')
      .insert({
        room_id: roomId,
        user_id: user.id,
        is_team: false,
      })
      .select()
      .single();

    if (!error && data) {
      setGameState(prev => ({ ...prev, attemptId: data.id }));
    }
  };

  const loadEscapeRoom = async () => {
    const { data: roomData, error: roomError } = await supabase
      .from('escape_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError || !roomData) {
      toast.error(t('escapeRoom.play.roomNotFound'));
      navigate('/escape-room');
      return;
    }

    setRoom(roomData);

    const { data: puzzlesData, error: puzzlesError } = await supabase
      .from('escape_room_puzzles')
      .select('*')
      .eq('room_id', roomId)
      .order('puzzle_number');

    if (!puzzlesError && puzzlesData) {
      setPuzzles(puzzlesData);
    }
  };

  const handleSubmitSolution = async () => {
    if (!attemptId || !user) return;

    const currentPuzzle = puzzles[currentPuzzleIndex];
    if (!currentPuzzle) return;

    // Check for repeated principle
    let penaltyScore = 0;
    if (usedPrinciples.includes(principleUsed) && currentPuzzleIndex > 0) {
      toast.error(t('escapeRoom.play.principleReuse'));
      penaltyScore = 1;
    }

    setIsSubmitting(true);

    try {
      const versesArray = submittedVerses.split('\n').map(v => v.trim()).filter(v => v);

      // Normalize verse reference for comparison (handles variations like "John 3:16" vs "John3:16" vs "John 3: 16")
      const normalizeVerse = (verse: string): string => {
        return verse
          .toLowerCase()
          .replace(/\s+/g, '') // Remove all whitespace
          .replace(/(\d)([a-z])/gi, '$1 $2') // Add space between number and letter (e.g., "1john" -> "1 john")
          .replace(/([a-z])(\d)/gi, '$1 $2') // Add space between letter and number (e.g., "john3" -> "john 3")
          .replace(/\s+/g, ' ') // Normalize to single spaces
          .trim();
      };

      // Check if two verse references match (strict comparison)
      const versesMatch = (submitted: string, expected: string): boolean => {
        const normalizedSubmitted = normalizeVerse(submitted);
        const normalizedExpected = normalizeVerse(expected);

        // Exact match after normalization
        if (normalizedSubmitted === normalizedExpected) return true;

        // Check if submitted verse is within a range (e.g., "John 3:16" matches expected "John 3:14-18")
        const rangeMatch = normalizedExpected.match(/^(.+?)(\d+):(\d+)-(\d+)$/);
        if (rangeMatch) {
          const [, book, chapter, startVerse, endVerse] = rangeMatch;
          const submittedMatch = normalizedSubmitted.match(/^(.+?)(\d+):(\d+)$/);
          if (submittedMatch) {
            const [, subBook, subChapter, subVerse] = submittedMatch;
            const bookMatch = normalizeVerse(subBook) === normalizeVerse(book);
            const chapterMatch = subChapter === chapter;
            const verseInRange = parseInt(subVerse) >= parseInt(startVerse) && parseInt(subVerse) <= parseInt(endVerse);
            if (bookMatch && chapterMatch && verseInRange) return true;
          }
        }

        // Check if expected is a single verse and submitted includes that verse in a range
        const singleMatch = normalizedExpected.match(/^(.+?)(\d+):(\d+)$/);
        if (singleMatch) {
          const [, book, chapter, verse] = singleMatch;
          const submittedRangeMatch = normalizedSubmitted.match(/^(.+?)(\d+):(\d+)-(\d+)$/);
          if (submittedRangeMatch) {
            const [, subBook, subChapter, startVerse, endVerse] = submittedRangeMatch;
            const bookMatch = normalizeVerse(subBook) === normalizeVerse(book);
            const chapterMatch = subChapter === chapter;
            const expectedVerseInRange = parseInt(verse) >= parseInt(startVerse) && parseInt(verse) <= parseInt(endVerse);
            if (bookMatch && chapterMatch && expectedVerseInRange) return true;
          }
        }

        return false;
      };

      // Validation: check if submitted verses match expected (strict matching)
      const isCorrect = versesArray.some(v =>
        currentPuzzle.expected_verses.some(expected => versesMatch(v, expected))
      );

      const pointsEarned = isCorrect ? currentPuzzle.points_perfect : currentPuzzle.points_partial;

      const { error } = await supabase
        .from('escape_room_solutions')
        .insert({
          attempt_id: attemptId,
          puzzle_id: currentPuzzle.id,
          submitted_verses: versesArray,
          room_justification: roomJustification,
          principle_used: principleUsed,
          is_correct: isCorrect,
          points_earned: pointsEarned,
        });

      if (error) throw error;

      const newScore = Math.max(0, score + pointsEarned - penaltyScore);
      const newSolutions = [...solutions, {
        puzzle_number: currentPuzzle.puzzle_number,
        is_correct: isCorrect,
        points_earned: pointsEarned
      }];
      const newUsedPrinciples = [...usedPrinciples, principleUsed];

      toast.success(isCorrect ? t('escapeRoom.play.perfect', { points: pointsEarned }) : t('escapeRoom.play.partialCredit', { points: pointsEarned }));

      // Move to next puzzle or finish
      if (currentPuzzleIndex < puzzles.length - 1) {
        const nextPuzzleNumber = currentPuzzleIndex + 2;
        setTimeout(() => {
          const newState = {
            ...gameState,
            currentPuzzleIndex: currentPuzzleIndex + 1,
            score: newScore,
            solutions: newSolutions,
            usedPrinciples: newUsedPrinciples,
            submittedVerses: '',
            roomJustification: '',
            principleUsed: '',
            showHint: false,
          };
          setGameState(newState);
          saveSession(newState, newScore, currentPuzzleIndex + 1);
          toast.info(t('escapeRoom.play.movingToPuzzle', { number: nextPuzzleNumber }), { duration: 3000 });
        }, 1000);
      } else {
        // Update final state before finishing
        setGameState(prev => ({
          ...prev,
          score: newScore,
          solutions: newSolutions,
          usedPrinciples: newUsedPrinciples,
        }));
        finishAttempt(true, newScore);
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      toast.error(t('escapeRoom.play.failedSubmit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestHint = () => {
    if (!room || hintsUsed >= room.max_hints) {
      toast.error(t('escapeRoom.play.noHints'));
      return;
    }

    const newHintsUsed = hintsUsed + 1;
    const newScore = Math.max(0, score - 2);
    setGameState(prev => ({
      ...prev,
      hintsUsed: newHintsUsed,
      score: newScore,
      showHint: true,
    }));
    saveSession({ hintsUsed: newHintsUsed, score: newScore, showHint: true }, newScore);
    toast.info(t('escapeRoom.play.hintRevealed'));
  };

  const finishAttempt = async (completed: boolean, finalScore?: number) => {
    if (!attemptId) return;

    const scoreToSave = finalScore ?? score;

    await supabase
      .from('escape_room_attempts')
      .update({
        completed_at: new Date().toISOString(),
        score: scoreToSave,
        hints_used: hintsUsed,
        time_elapsed_seconds: timeElapsed,
      })
      .eq('id', attemptId);

    // Mark the game session as completed
    await completeGame(scoreToSave);

    toast.success(completed ? t('escapeRoom.play.completed') : t('escapeRoom.play.timesUp'));
    navigate('/escape-room');
  };

  // Helper functions to update form state
  const updateSubmittedVerses = (value: string) => {
    setGameState(prev => ({ ...prev, submittedVerses: value }));
  };

  const updateRoomJustification = (value: string) => {
    setGameState(prev => ({ ...prev, roomJustification: value }));
  };

  const updatePrincipleUsed = (value: string) => {
    setGameState(prev => ({ ...prev, principleUsed: value }));
  };

  if (sessionLoading || !room || puzzles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('escapeRoom.play.loading')}</p>
        </div>
      </div>
    );
  }

  // Resume Dialog
  if (showResumeDialog) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-12 max-w-md">
          <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  {t('escapeRoom.play.resumeTitle')}
                </DialogTitle>
                <DialogDescription>
                  {t('escapeRoom.play.ongoingSession', { title: room.title })}
                  <div className="mt-3 p-3 bg-accent/10 rounded-lg space-y-1 text-sm">
                    <p><strong>{t('escapeRoom.play.progress')}:</strong> {t('escapeRoom.play.puzzleOf', { current: gameState.currentPuzzleIndex + 1, total: puzzles.length })}</p>
                    <p><strong>{t('common.score')}:</strong> {gameState.score} {t('common.pts')}</p>
                    <p><strong>{t('common.time')}:</strong> {Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2 sm:gap-0">
                <Button variant="outline" onClick={handleStartNewGame} className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {t('common.startOver')}
                </Button>
                <Button onClick={handleResumeGame} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {t('common.resume')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    );
  }

  // Start screen if game hasn't started yet
  if (!gameStarted && !hasExistingSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-12 max-w-md">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>{room.title}</CardTitle>
              <CardDescription>
                {t('escapeRoom.play.startDescription', { puzzles: puzzles.length, minutes: room.time_limit_minutes, hints: room.max_hints })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('escapeRoom.play.autoSaveNote')}
              </p>
              <Button onClick={handleStartNewGame} className="w-full" size="lg">
                <Play className="w-4 h-4 mr-2" />
                {t('escapeRoom.play.beginEscapeRoom')}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentPuzzle = puzzles[currentPuzzleIndex];
  const progress = ((currentPuzzleIndex + 1) / puzzles.length) * 100;
  const timeRemaining = (room.time_limit_minutes * 60) - timeElapsed;
  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-12 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{room.title}</h1>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className={timeRemaining < 300 ? "text-destructive font-bold" : ""}>
                {minutesRemaining}:{secondsRemaining.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>{t('common.scorePts', { score })}</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>{t('escapeRoom.play.hintsUsed', { used: hintsUsed, max: room.max_hints })}</span>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>

        {/* Current Puzzle */}
        <Card className="border-primary/20 mb-6 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentPuzzle.floor_number && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {t('escapeRoom.play.floor', { number: currentPuzzle.floor_number })}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary">{t('escapeRoom.play.puzzleNumber', { number: currentPuzzle.puzzle_number })}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {t('escapeRoom.play.ofTotal', { total: puzzles.length })}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground px-2 py-1 bg-accent/10 rounded">
                    {currentPuzzle.room_tag}
                  </span>
                </CardTitle>
                <CardDescription className="mt-1">
                  {currentPuzzle.principle}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {t('common.scorePts', { score: currentPuzzle.points_perfect })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('escapeRoom.play.partial', { points: currentPuzzle.points_partial })}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">{t('escapeRoom.play.challenge')}:</h3>
              <p className="text-muted-foreground">{currentPuzzle.prompt}</p>
            </div>

            {showHint && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {t('escapeRoom.play.hint')}:
                </h3>
                <p className="text-sm">{currentPuzzle.typology_notes}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="verses">{t('escapeRoom.play.kjvVersesLabel')}</Label>
                <Textarea
                  id="verses"
                  value={submittedVerses}
                  onChange={(e) => updateSubmittedVerses(e.target.value)}
                  placeholder="e.g., Genesis 3:15&#10;John 1:29"
                  rows={4}
                  className="font-mono"
                />
              </div>

              <div>
                <Label htmlFor="justification">{t('escapeRoom.play.justificationLabel')}</Label>
                <Textarea
                  id="justification"
                  value={roomJustification}
                  onChange={(e) => updateRoomJustification(e.target.value)}
                  placeholder={t('escapeRoom.play.justificationPlaceholder')}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="principle">{t('escapeRoom.play.principleUsedLabel')}</Label>
                <Input
                  id="principle"
                  value={principleUsed}
                  onChange={(e) => updatePrincipleUsed(e.target.value)}
                  placeholder={t('escapeRoom.play.principlePlaceholder')}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitSolution}
                disabled={isSubmitting || !submittedVerses || !roomJustification || !principleUsed}
                className="flex-1"
                size="lg"
              >
                {isSubmitting ? t('common.submitting') : t('escapeRoom.play.submitSolution')}
              </Button>
              <Button
                onClick={requestHint}
                variant="outline"
                disabled={showHint || hintsUsed >= room.max_hints}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {t('escapeRoom.play.hintButton')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        {solutions.length > 0 && (
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">{t('escapeRoom.play.progress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {solutions.map((sol) => (
                  <div key={sol.puzzle_number} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {sol.is_correct ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-orange-500" />
                      )}
                      <span>{t('escapeRoom.play.puzzleNumber', { number: sol.puzzle_number })}</span>
                    </div>
                    <span className="text-muted-foreground">{t('escapeRoom.play.plusPts', { points: sol.points_earned })}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}