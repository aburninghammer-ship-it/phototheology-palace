// PT Jeopardy - Theological Jeopardy Game
// AI-generated questions from PT Room categories, scored with bonuses

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Clock,
  Trophy,
  Plus,
  Minus,
  Loader2,
  Sparkles,
  Shield,
  BookOpen,
  Star,
  Send,
  Users,
  RotateCcw,
  Sword,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useGameMultiplayer } from '@/hooks/useGameMultiplayer';
import { MultiplayerLobby } from '@/components/games/MultiplayerLobby';
import {
  useJeopardyGame,
  JEOPARDY_CATEGORIES,
  POINT_VALUES,
  type JeopardyTile,
  type JeopardyPlayer,
} from '@/hooks/useJeopardyGame';
import { cn } from '@/lib/utils';

type GameMode = 'menu' | 'local' | 'online_lobby' | 'playing';

export default function PTJeopardy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<GameMode>('menu');
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);
  const [answerInput, setAnswerInput] = useState('');
  const [timer, setTimer] = useState(30);
  const timerRef = useRef<number | null>(null);
  const [finalWagerInput, setFinalWagerInput] = useState('');
  const [finalAnswerInput, setFinalAnswerInput] = useState('');

  // Multiplayer
  const multiplayer = useGameMultiplayer('pt_jeopardy');

  const {
    state,
    isLoading,
    startGame,
    selectTile,
    submitAnswer,
    skipQuestion,
    returnToBoard,
    setFinalWager,
    submitFinalAnswer,
    judgeFinalAnswers,
    goToDebrief,
    resetGame,
  } = useJeopardyGame();

  // Timer for clue phase
  useEffect(() => {
    if (state.phase === 'clue') {
      setTimer(30);
      setAnswerInput('');
      timerRef.current = window.setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            skipQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [state.phase, state.currentTile]);

  const handleStartLocal = () => {
    const validNames = playerNames.filter(n => n.trim());
    if (validNames.length < 1) return;
    startGame(validNames);
    setMode('playing');
  };

  const handleStartOnline = () => {
    // Start online game using multiplayer players
    const names = multiplayer.players.map(p => p.display_name);
    startGame(names);
    setMode('playing');
  };

  const handleSubmitAnswer = () => {
    if (!answerInput.trim()) return;
    if (timerRef.current) clearInterval(timerRef.current);
    submitAnswer(answerInput.trim());
    setAnswerInput('');
  };

  // Category color map
  const categoryColors: Record<string, string> = {
    story: 'from-amber-600 to-amber-800',
    sanctuary: 'from-purple-600 to-purple-800',
    connect6: 'from-sky-600 to-sky-800',
    symbols: 'from-blue-600 to-blue-800',
    christ: 'from-yellow-500 to-yellow-700',
    freestyle: 'from-green-600 to-green-800',
    defense: 'from-red-600 to-red-800',
  };

  // Menu
  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button onClick={() => navigate('/games')} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              PT Jeopardy
            </h1>
            <p className="text-gray-400">Test your theological knowledge across PT Room categories</p>
          </div>

          <Card className="bg-gray-900/50 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
              <p>• <span className="text-blue-400 font-semibold">6 categories</span> from PT Rooms, 5 point values each (100-500)</p>
              <p>• <span className="text-yellow-400 font-semibold">Jeeves generates</span> questions dynamically based on category and difficulty</p>
              <p>• <span className="text-green-400 font-semibold">Bonus points</span>: Scripture Citation (+25), PT Principle (+50), Christ Connection (+25)</p>
              <p>• <span className="text-purple-400 font-semibold">Hidden Gems</span> (Daily Doubles) — worth double points!</p>
              <p>• <span className="text-red-400 font-semibold">Final Round</span>: "Forge a Weapon" — open-ended theological question</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={() => setMode('local')}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Users className="mr-2 h-5 w-5" /> Local Multiplayer
            </Button>
            <Button
              onClick={() => setMode('online_lobby')}
              size="lg"
              variant="outline"
              className="w-full border-purple-500/50 text-purple-300"
            >
              <Users className="mr-2 h-5 w-5" /> Online Multiplayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Local setup
  if (mode === 'local') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Button onClick={() => setMode('menu')} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle>Player Setup</CardTitle>
              <CardDescription className="text-gray-400">Add 1-6 players</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {playerNames.map((name, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={name}
                    onChange={(e) => {
                      const updated = [...playerNames];
                      updated[idx] = e.target.value;
                      setPlayerNames(updated);
                    }}
                    placeholder={`Player ${idx + 1}`}
                    className="bg-gray-800/50 border-gray-600"
                  />
                  {playerNames.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPlayerNames(prev => prev.filter((_, i) => i !== idx))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {playerNames.length < 6 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPlayerNames(prev => [...prev, `Player ${prev.length + 1}`])}
                  className="border-gray-600"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Player
                </Button>
              )}
              <Button onClick={handleStartLocal} className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="mr-2 h-4 w-4" />}
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Online lobby
  if (mode === 'online_lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <MultiplayerLobby
            room={multiplayer.room}
            players={multiplayer.players}
            loading={multiplayer.loading}
            isHost={multiplayer.room?.host_id === user?.id}
            minPlayers={2}
            maxPlayers={6}
            gameName="PT Jeopardy"
            onCreateRoom={(max) => multiplayer.createRoom(max)}
            onJoinRoom={(code) => multiplayer.joinRoom(code)}
            onStartGame={handleStartOnline}
            onLeaveRoom={multiplayer.leaveRoom}
            onBack={() => setMode('menu')}
          />
        </div>
      </div>
    );
  }

  // Playing - Board phase
  if (state.phase === 'board') {
    const currentPlayer = state.players[state.currentPlayerIndex];
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white p-2">
        {/* Scoreboard */}
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-3 overflow-x-auto">
            {state.players.map((p, idx) => (
              <div
                key={p.id}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm shrink-0',
                  idx === state.currentPlayerIndex ? 'bg-yellow-600 text-white font-bold' : 'bg-gray-800/70 text-gray-200'
                )}
              >
                {p.name}: <span className={p.score >= 0 ? 'text-green-300' : 'text-red-300'}>${p.score}</span>
              </div>
            ))}
          </div>
          <Badge className="bg-gray-700 text-white text-xs shrink-0 ml-2">
            {state.tilesRemaining} left
          </Badge>
        </div>

        <p className="text-center text-base text-yellow-300 font-semibold mb-2">
          {currentPlayer?.name}, pick a category!
        </p>

        {/* Jeopardy Board */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Category headers */}
            <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `repeat(${state.categories.length}, 1fr)` }}>
              {state.categories.map(cat => (
                <div
                  key={cat.id}
                  className={cn(
                    'p-2 rounded-t text-center text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-br',
                    categoryColors[cat.id] || 'from-gray-600 to-gray-800'
                  )}
                >
                  {cat.name}
                </div>
              ))}
            </div>

            {/* Point rows */}
            {POINT_VALUES.map(points => (
              <div
                key={points}
                className="grid gap-1 mb-1"
                style={{ gridTemplateColumns: `repeat(${state.categories.length}, 1fr)` }}
              >
                {state.categories.map(cat => {
                  const key = `${cat.id}-${points}`;
                  const tile = state.board[key];
                  const isAnswered = tile?.answeredBy !== null && tile?.isRevealed;

                  return (
                    <button
                      key={key}
                      onClick={() => !isAnswered && !isLoading && selectTile(cat.id, points)}
                      disabled={isAnswered || isLoading}
                      className={cn(
                        'p-3 rounded text-center font-bold text-lg transition-all',
                        isAnswered
                          ? 'bg-gray-800/30 text-gray-700 cursor-default'
                          : 'bg-slate-700/80 hover:bg-slate-600 text-yellow-400 hover:text-yellow-300 cursor-pointer hover:scale-105 border border-slate-600/50'
                      )}
                    >
                      {isAnswered ? '' : `$${points}`}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="text-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-yellow-400" />
            <p className="text-sm text-gray-300 mt-1">Jeeves is crafting a question...</p>
          </div>
        )}
      </div>
    );
  }

  // Clue phase
  if (state.phase === 'clue' && state.currentTile) {
    const currentPlayer = state.players[state.currentPlayerIndex];
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white flex items-center justify-center p-4">
        <Card className="bg-slate-800/80 border-yellow-500/40 max-w-lg w-full shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            {state.currentTile.isHiddenGem && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <Badge className="bg-yellow-500 text-black text-lg px-4 py-2 font-bold">
                  <Star className="h-4 w-4 mr-1 inline" /> HIDDEN GEM — Double Points!
                </Badge>
              </motion.div>
            )}

            <div>
              <Badge className="bg-yellow-600 text-white mb-3 text-sm">${state.currentTile.points}</Badge>
              <p className="text-2xl font-semibold leading-relaxed text-white">{state.currentTile.clue}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-3xl font-mono">
              <Clock className="h-6 w-6 text-white" />
              <span className={timer <= 10 ? 'text-red-400 animate-pulse font-bold' : 'text-white font-bold'}>{timer}s</span>
            </div>

            <p className="text-base text-yellow-300 font-semibold">{currentPlayer?.name}'s turn</p>

            <div className="flex gap-2">
              <Input
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                placeholder="What is..."
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 text-lg"
                autoFocus
              />
              <Button onClick={handleSubmitAnswer} disabled={!answerInput.trim() || isLoading} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={skipQuestion} className="text-gray-300 hover:text-white">
              Pass
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Judging phase
  if (state.phase === 'judging') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-400 mb-4" />
          <p className="text-lg">Jeeves is judging your answer...</p>
        </div>
      </div>
    );
  }

  // Result phase
  if (state.phase === 'result' && state.judgmentResult) {
    const result = state.judgmentResult;
    const currentPlayer = state.players[state.currentPlayerIndex];
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white flex items-center justify-center p-4">
        <Card className={cn(
          'max-w-lg w-full border',
          result.correct ? 'bg-green-900/30 border-green-500/50' : 'bg-red-900/30 border-red-500/50'
        )}>
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-6xl mb-2">{result.correct ? '✅' : '❌'}</div>
            <h2 className="text-2xl font-bold">{result.correct ? 'Correct!' : 'Incorrect'}</h2>
            <p className="text-gray-300">{result.explanation}</p>

            {result.correct && (
              <div className="flex justify-center gap-2 flex-wrap">
                {result.scriptureBonus && (
                  <Badge className="bg-green-600"><BookOpen className="h-3 w-3 mr-1" /> Scripture +25</Badge>
                )}
                {result.ptPrincipleBonus && (
                  <Badge className="bg-purple-600"><Shield className="h-3 w-3 mr-1" /> PT Principle +50</Badge>
                )}
                {result.christBonus && (
                  <Badge className="bg-yellow-600"><Sparkles className="h-3 w-3 mr-1" /> Christ +25</Badge>
                )}
              </div>
            )}

            {state.currentTile && (
              <p className="text-sm text-gray-400">
                Answer: <span className="text-white font-medium">{state.currentTile.answer}</span>
              </p>
            )}

            <p className="font-semibold">
              {currentPlayer?.name}: <span className={currentPlayer && currentPlayer.score >= 0 ? 'text-green-400' : 'text-red-400'}>${currentPlayer?.score}</span>
            </p>

            <Button onClick={returnToBoard} className="w-full bg-blue-600 hover:bg-blue-700">
              {state.tilesRemaining > 0 ? 'Continue' : 'Final Round'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Final wager phase
  if (state.phase === 'final_wager' && state.finalRound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white flex items-center justify-center p-4">
        <Card className="bg-purple-900/30 border-purple-500/50 max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-4xl mb-2"><Sword className="h-12 w-12 mx-auto text-purple-400" /></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Forge a Weapon — Final Round
            </h2>
            <p className="text-sm text-gray-400">Each player: wager up to your current score</p>

            {state.players.map(p => {
              const hasWagered = state.finalRound!.wagers[p.id] !== undefined;
              return (
                <div key={p.id} className="text-left bg-gray-900/50 rounded-lg p-4">
                  <p className="font-medium mb-2">{p.name} (${p.score})</p>
                  {hasWagered ? (
                    <Badge className="bg-green-600">Wager set: ${state.finalRound!.wagers[p.id]}</Badge>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={Math.max(p.score, 0)}
                        value={finalWagerInput}
                        onChange={(e) => setFinalWagerInput(e.target.value)}
                        placeholder="Enter wager"
                        className="bg-gray-800/50 border-gray-600"
                      />
                      <Button
                        onClick={() => {
                          const wager = Math.min(Math.max(0, parseInt(finalWagerInput) || 0), Math.max(p.score, 0));
                          setFinalWager(p.id, wager);
                          setFinalWagerInput('');
                        }}
                      >
                        Lock
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Final answer phase
  if (state.phase === 'final_answer' && state.finalRound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white flex items-center justify-center p-4">
        <Card className="bg-purple-900/30 border-purple-500/50 max-w-lg w-full">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-center text-purple-300">Final Question</h2>
            <p className="text-lg text-center leading-relaxed">{state.finalRound.question}</p>

            {state.players.map(p => {
              const hasAnswered = state.finalRound!.answers[p.id] !== undefined;
              return (
                <div key={p.id} className="bg-gray-900/50 rounded-lg p-4">
                  <p className="font-medium mb-2">{p.name} (wagered ${state.finalRound!.wagers[p.id]})</p>
                  {hasAnswered ? (
                    <Badge className="bg-green-600">Answer submitted</Badge>
                  ) : (
                    <div className="space-y-2">
                      <Textarea
                        value={finalAnswerInput}
                        onChange={(e) => setFinalAnswerInput(e.target.value)}
                        placeholder="Your answer..."
                        className="bg-gray-800/50 border-gray-600"
                        rows={3}
                      />
                      <Button
                        onClick={() => {
                          submitFinalAnswer(p.id, finalAnswerInput);
                          setFinalAnswerInput('');
                        }}
                        disabled={!finalAnswerInput.trim()}
                        className="w-full"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Final result phase
  if (state.phase === 'final_result' && state.finalRound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white flex items-center justify-center p-4">
        <Card className="bg-gray-900/50 border-gray-700 max-w-lg w-full">
          <CardContent className="p-8 space-y-6 text-center">
            {!state.finalRound.revealed ? (
              <>
                <h2 className="text-xl font-bold">Judging Final Answers...</h2>
                <Button onClick={judgeFinalAnswers} disabled={isLoading} className="bg-purple-600">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Reveal Results
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">Final Results</h2>
                {state.players
                  .sort((a, b) => b.score - a.score)
                  .map((p, idx) => (
                    <div key={p.id} className="bg-gray-800/50 rounded-lg p-4 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{idx === 0 ? '🏆 ' : ''}{p.name}</span>
                        <span className={cn('text-xl font-bold', p.score >= 0 ? 'text-green-400' : 'text-red-400')}>
                          ${p.score}
                        </span>
                      </div>
                      {state.finalRound!.results[p.id] && (
                        <p className="text-sm text-gray-400 mt-1">
                          Final: {state.finalRound!.results[p.id].correct ? '✅ Correct' : '❌ Incorrect'} ({state.finalRound!.results[p.id].points >= 0 ? '+' : ''}{state.finalRound!.results[p.id].points})
                        </p>
                      )}
                    </div>
                  ))}
                <Button onClick={goToDebrief} className="w-full bg-blue-600">
                  View Debrief
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Debrief phase
  if (state.phase === 'debrief') {
    const winner = [...state.players].sort((a, b) => b.score - a.score)[0];
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white p-4">
        <div className="container mx-auto max-w-lg">
          <div className="text-center mb-8">
            <Trophy className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Jeeves Tactical Debrief</h1>
            {winner && (
              <p className="text-lg text-yellow-400">Winner: {winner.name} with ${winner.score}</p>
            )}
          </div>

          {state.players.map(p => {
            const weakCategories = Object.entries(p.categoryStats)
              .filter(([_, s]) => s.total > 0 && s.correct / s.total < 0.5)
              .map(([catId]) => state.categories.find(c => c.id === catId)?.name || catId);

            return (
              <Card key={p.id} className="bg-gray-900/50 border-gray-700 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-lg">{p.name}</span>
                    <span className={cn('font-bold', p.score >= 0 ? 'text-green-400' : 'text-red-400')}>
                      ${p.score}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                    <p>Correct: <span className="text-green-400">{p.correctAnswers}</span></p>
                    <p>Wrong: <span className="text-red-400">{p.wrongAnswers}</span></p>
                  </div>
                  {weakCategories.length > 0 && (
                    <div className="mt-3 p-2 rounded bg-red-900/20 border border-red-500/20">
                      <p className="text-xs text-red-400">Areas to study: {weakCategories.join(', ')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <div className="flex gap-3 mt-6">
            <Button onClick={() => { resetGame(); setMode('menu'); }} variant="outline" className="flex-1 border-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Menu
            </Button>
            <Button onClick={() => { resetGame(); handleStartLocal(); }} className="flex-1 bg-blue-600">
              <RotateCcw className="mr-2 h-4 w-4" /> Play Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Setup fallback
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
    </div>
  );
}
