// PT Family Feud - Team-based Theological Training Game
// Survey-style answers, Defense Mode, Forge a Weapon championship

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Trophy,
  Users,
  Plus,
  Minus,
  Loader2,
  Send,
  X,
  Shield,
  Sword,
  RotateCcw,
  Zap,
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
import { useFamilyFeudGame } from '@/hooks/useFamilyFeudGame';
import { cn } from '@/lib/utils';

type PageMode = 'menu' | 'local_setup' | 'online_lobby' | 'playing';

export default function PTFamilyFeud() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pageMode, setPageMode] = useState<PageMode>('menu');

  // Local setup state
  const [team1Name, setTeam1Name] = useState('Team Alpha');
  const [team2Name, setTeam2Name] = useState('Team Omega');
  const [team1Players, setTeam1Players] = useState(['Player 1']);
  const [team2Players, setTeam2Players] = useState(['Player 2']);
  const [guessInput, setGuessInput] = useState('');
  const [forgeInput, setForgeInput] = useState('');

  // Multiplayer
  const multiplayer = useGameMultiplayer('pt_family_feud');

  const {
    state,
    isLoading,
    startGame,
    startRound,
    submitGuess,
    attemptSteal,
    nextRound,
    startForgeWeapon,
    submitForgeAnswer,
    judgeForgeWeapon,
    goToDebrief,
    resetGame,
  } = useFamilyFeudGame();

  const handleStartLocal = () => {
    const t1 = team1Players.filter(p => p.trim());
    const t2 = team2Players.filter(p => p.trim());
    if (t1.length < 1 || t2.length < 1) return;
    startGame(team1Name, t1, team2Name, t2);
    setPageMode('playing');
  };

  const handleStartOnline = () => {
    const players = multiplayer.players.map(p => p.display_name);
    const half = Math.ceil(players.length / 2);
    startGame('Team 1', players.slice(0, half), 'Team 2', players.slice(half));
    setPageMode('playing');
  };

  const handleSubmitGuess = () => {
    if (!guessInput.trim()) return;
    submitGuess(guessInput.trim());
    setGuessInput('');
  };

  const handleSteal = () => {
    if (!guessInput.trim()) return;
    attemptSteal(guessInput.trim());
    setGuessInput('');
  };

  // Menu
  if (pageMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-red-950 to-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button onClick={() => navigate('/games')} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
              PT Family Feud
            </h1>
            <p className="text-gray-400">Team-based theological training — survey says!</p>
          </div>

          <Card className="bg-gray-900/50 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
              <p>• <span className="text-orange-400 font-semibold">2 teams</span> face off answering survey-style Bible questions</p>
              <p>• <span className="text-yellow-400 font-semibold">Guess the top answers</span> — higher ranked = more points</p>
              <p>• <span className="text-red-400 font-semibold">3 strikes</span> and the other team can steal!</p>
              <p>• <span className="text-purple-400 font-semibold">Defense Mode</span> round — respond to theological arguments</p>
              <p>• <span className="text-green-400 font-semibold">Forge a Weapon</span> championship — open-ended theological battle</p>
              <p>• <span className="text-blue-400 font-semibold">Scripture bonus</span> +25 for citing verses in your answers</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={() => setPageMode('local_setup')}
              size="lg"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Users className="mr-2 h-5 w-5" /> Local Teams
            </Button>
            <Button
              onClick={() => setPageMode('online_lobby')}
              size="lg"
              variant="outline"
              className="w-full border-orange-500/50 text-orange-300"
            >
              <Users className="mr-2 h-5 w-5" /> Online Multiplayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Local setup
  if (pageMode === 'local_setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-red-950 to-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <Button onClick={() => setPageMode('menu')} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="space-y-6">
            {/* Team 1 */}
            <Card className="bg-blue-900/30 border-blue-500/50">
              <CardHeader className="pb-2">
                <Input
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="text-lg font-bold bg-transparent border-none text-blue-300 p-0"
                />
              </CardHeader>
              <CardContent className="space-y-2">
                {team1Players.map((p, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={p}
                      onChange={(e) => {
                        const updated = [...team1Players];
                        updated[idx] = e.target.value;
                        setTeam1Players(updated);
                      }}
                      placeholder={`Player ${idx + 1}`}
                      className="bg-blue-950/50 border-blue-500/30"
                    />
                    {team1Players.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => setTeam1Players(prev => prev.filter((_, i) => i !== idx))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {team1Players.length < 5 && (
                  <Button variant="ghost" size="sm" onClick={() => setTeam1Players(prev => [...prev, ''])}>
                    <Plus className="mr-1 h-3 w-3" /> Add
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="text-center text-2xl font-bold text-gray-500">VS</div>

            {/* Team 2 */}
            <Card className="bg-red-900/30 border-red-500/50">
              <CardHeader className="pb-2">
                <Input
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="text-lg font-bold bg-transparent border-none text-red-300 p-0"
                />
              </CardHeader>
              <CardContent className="space-y-2">
                {team2Players.map((p, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={p}
                      onChange={(e) => {
                        const updated = [...team2Players];
                        updated[idx] = e.target.value;
                        setTeam2Players(updated);
                      }}
                      placeholder={`Player ${idx + 1}`}
                      className="bg-red-950/50 border-red-500/30"
                    />
                    {team2Players.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => setTeam2Players(prev => prev.filter((_, i) => i !== idx))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {team2Players.length < 5 && (
                  <Button variant="ghost" size="sm" onClick={() => setTeam2Players(prev => [...prev, ''])}>
                    <Plus className="mr-1 h-3 w-3" /> Add
                  </Button>
                )}
              </CardContent>
            </Card>

            <Button onClick={handleStartLocal} className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading} size="lg">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Play className="mr-2 h-5 w-5" />}
              {isLoading ? 'Generating Questions...' : 'Start Game'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Online lobby
  if (pageMode === 'online_lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-red-950 to-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <MultiplayerLobby
            room={multiplayer.room}
            players={multiplayer.players}
            loading={multiplayer.loading}
            isHost={multiplayer.room?.host_id === user?.id}
            minPlayers={2}
            maxPlayers={10}
            gameName="PT Family Feud"
            onCreateRoom={(max) => multiplayer.createRoom(max)}
            onJoinRoom={(code) => multiplayer.joinRoom(code)}
            onStartGame={handleStartOnline}
            onLeaveRoom={multiplayer.leaveRoom}
            onBack={() => setPageMode('menu')}
          />
        </div>
      </div>
    );
  }

  // Game is playing
  const currentRound = state.rounds[state.currentRoundIndex];
  const currentTeam = state.teams[state.currentTeamIndex];
  const otherTeam = state.teams[state.currentTeamIndex === 0 ? 1 : 0];

  // Score header (shared across phases)
  const scoreHeader = (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-700">
      <div className={cn('flex-1 text-center p-2 rounded-l-lg', state.currentTeamIndex === 0 ? 'bg-blue-600/30 border border-blue-500/50' : 'bg-blue-900/20')}>
        <p className="text-xs text-blue-300">{state.teams[0].name}</p>
        <p className="text-xl font-bold text-blue-400">{state.teams[0].score}</p>
      </div>
      <div className="px-4 text-center shrink-0">
        <p className="text-xs text-gray-500">Round {state.currentRoundIndex + 1}/{state.totalRounds}</p>
        {currentRound && <Badge variant="outline" className="text-[10px]">{currentRound.category.name}</Badge>}
      </div>
      <div className={cn('flex-1 text-center p-2 rounded-r-lg', state.currentTeamIndex === 1 ? 'bg-red-600/30 border border-red-500/50' : 'bg-red-900/20')}>
        <p className="text-xs text-red-300">{state.teams[1].name}</p>
        <p className="text-xl font-bold text-red-400">{state.teams[1].score}</p>
      </div>
    </div>
  );

  // Face-off
  if (state.phase === 'faceoff') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-red-950 to-black text-white">
        {scoreHeader}
        <div className="container mx-auto px-4 py-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Face Off!</h2>
          {currentRound && (
            <>
              <Badge className="mb-4">{currentRound.category.name}</Badge>
              {currentRound.isDefenseMode && (
                <Badge className="ml-2 bg-red-600 mb-4"><Shield className="h-3 w-3 mr-1" /> Defense Mode</Badge>
              )}
              <Card className="bg-gray-900/50 border-gray-700 mb-6">
                <CardContent className="p-6">
                  <p className="text-xl">{currentRound.question}</p>
                </CardContent>
              </Card>
            </>
          )}
          <p className="text-gray-400 mb-4">Which team buzzed in first?</p>
          <div className="flex gap-4">
            <Button onClick={() => startRound(0)} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {state.teams[0].name}
            </Button>
            <Button onClick={() => startRound(1)} className="flex-1 bg-red-600 hover:bg-red-700">
              {state.teams[1].name}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Playing
  if (state.phase === 'playing' && currentRound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-red-950 to-black text-white">
        {scoreHeader}
        <div className="container mx-auto px-4 py-4 max-w-lg">
          {/* Question */}
          <Card className="bg-gray-900/50 border-gray-700 mb-4">
            <CardContent className="p-4 text-center">
              <p className="text-lg font-medium">{currentRound.question}</p>
            </CardContent>
          </Card>

          {/* Answer board */}
          <div className="space-y-2 mb-4">
            {currentRound.answers.map((answer, idx) => (
              <motion.div
                key={idx}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  answer.revealed
                    ? 'bg-yellow-900/30 border-yellow-500/50'
                    : 'bg-gray-800/50 border-gray-700'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  {answer.revealed ? (
                    <span className="font-medium text-yellow-300">{answer.text}</span>
                  ) : (
                    <span className="text-gray-500 italic">Hidden</span>
                  )}
                </div>
                {answer.revealed && (
                  <Badge className="bg-yellow-600">{answer.points}</Badge>
                )}
              </motion.div>
            ))}
          </div>

          {/* Strikes */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-lg border-2',
                  i < currentTeam.strikes
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-500'
                )}
              >
                {i < currentTeam.strikes ? <X className="h-5 w-5" /> : ''}
              </div>
            ))}
            <span className="text-sm text-gray-400 ml-2">
              {currentTeam.name}'s turn
            </span>
          </div>

          {/* Guess input */}
          <div className="flex gap-2">
            <Input
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitGuess()}
              placeholder="Type your answer..."
              className="bg-gray-800/50 border-gray-600"
              autoFocus
            />
            <Button onClick={handleSubmitGuess} disabled={!guessInput.trim() || isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Steal phase
  if (state.phase === 'steal' && currentRound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-red-950 to-black text-white">
        {scoreHeader}
        <div className="container mx-auto px-4 py-8 max-w-lg text-center">
          <div className="text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold mb-2">STEAL!</h2>
          <p className="text-gray-400 mb-6">
            <span className="font-bold text-white">{otherTeam.name}</span>, guess the #1 remaining answer to steal all points!
          </p>

          <Card className="bg-gray-900/50 border-gray-700 mb-4">
            <CardContent className="p-4">
              <p className="text-lg">{currentRound.question}</p>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Input
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSteal()}
              placeholder="Steal answer..."
              className="bg-gray-800/50 border-gray-600"
              autoFocus
            />
            <Button onClick={handleSteal} disabled={!guessInput.trim() || isLoading} className="bg-yellow-600 hover:bg-yellow-700">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Round result
  if (state.phase === 'round_result' && currentRound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-red-950 to-black text-white">
        {scoreHeader}
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <h2 className="text-xl font-bold text-center mb-4">Round Complete!</h2>

          {/* All answers revealed */}
          <div className="space-y-2 mb-6">
            {currentRound.answers.map((answer, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-sm font-bold text-black">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{answer.text}</span>
                </div>
                <Badge className="bg-yellow-600 text-black">{answer.points}</Badge>
              </div>
            ))}
          </div>

          <Button onClick={nextRound} className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
            {state.currentRoundIndex + 1 >= state.rounds.length ? (
              <><Sword className="mr-2 h-5 w-5" /> Forge a Weapon — Final Round</>
            ) : (
              <><Play className="mr-2 h-5 w-5" /> Next Round</>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Forge a Weapon
  if (state.phase === 'forge_weapon') {
    if (!state.forgeWeapon) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950 to-black text-white flex items-center justify-center">
          <div className="text-center">
            <Sword className="h-16 w-16 mx-auto text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Forge a Weapon — Championship Round</h2>
            <Button onClick={startForgeWeapon} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700" size="lg">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sword className="mr-2 h-5 w-5" />}
              Generate Final Question
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950 to-black text-white">
        {scoreHeader}
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <div className="text-center mb-6">
            <Sword className="h-10 w-10 mx-auto text-purple-400 mb-2" />
            <h2 className="text-xl font-bold text-purple-300">Forge a Weapon</h2>
          </div>

          <Card className="bg-purple-900/20 border-purple-500/30 mb-6">
            <CardContent className="p-4 text-center">
              <p className="text-lg">{state.forgeWeapon.question}</p>
            </CardContent>
          </Card>

          {state.teams.map(team => {
            const hasSubmitted = state.forgeWeapon!.teamAnswers[team.id];
            return (
              <Card key={team.id} className="bg-gray-900/50 border-gray-700 mb-4">
                <CardContent className="p-4">
                  <p className="font-bold mb-2">{team.name}</p>
                  {hasSubmitted ? (
                    <Badge className="bg-green-600">Answer submitted</Badge>
                  ) : (
                    <div className="space-y-2">
                      <Textarea
                        value={forgeInput}
                        onChange={(e) => setForgeInput(e.target.value)}
                        placeholder="Craft your theological response..."
                        className="bg-gray-800/50 border-gray-600"
                        rows={4}
                      />
                      <Button
                        onClick={() => {
                          submitForgeAnswer(team.id, forgeInput);
                          setForgeInput('');
                        }}
                        disabled={!forgeInput.trim()}
                        className="w-full"
                      >
                        Submit Response
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Forge result
  if (state.phase === 'forge_result') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950 to-black text-white flex items-center justify-center p-4">
        <Card className="bg-gray-900/50 border-gray-700 max-w-lg w-full">
          <CardContent className="p-8 text-center space-y-6">
            {!state.forgeWeapon?.revealed ? (
              <>
                <Sword className="h-12 w-12 mx-auto text-purple-400" />
                <h2 className="text-xl font-bold">Jeeves is judging...</h2>
                <Button onClick={judgeForgeWeapon} disabled={isLoading} className="bg-purple-600">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Reveal Scores
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">Forge Results</h2>
                {state.teams.map(team => (
                  <div key={team.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{team.name}</span>
                      <Badge className="bg-purple-600">+{state.forgeWeapon?.teamScores[team.id] || 0}</Badge>
                    </div>
                  </div>
                ))}
                <Button onClick={goToDebrief} className="w-full bg-orange-600">
                  View Final Results
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Debrief
  if (state.phase === 'debrief') {
    const winner = state.teams[0].score >= state.teams[1].score ? state.teams[0] : state.teams[1];
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-red-950 to-black text-white p-4">
        <div className="container mx-auto max-w-lg text-center">
          <Trophy className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Game Over!</h1>
          <p className="text-lg text-yellow-400 mb-8">{winner.name} wins with {winner.score} points!</p>

          {state.teams.map(team => (
            <Card key={team.id} className="bg-gray-900/50 border-gray-700 mb-4 text-left">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{team.name}</span>
                  <span className="text-xl font-bold text-yellow-400">{team.score}</span>
                </div>
                <p className="text-sm text-gray-400">Rounds won: {team.roundsWon}</p>
                <p className="text-sm text-gray-400">Players: {team.players.join(', ')}</p>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-3 mt-6">
            <Button onClick={() => { resetGame(); setPageMode('menu'); }} variant="outline" className="flex-1 border-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Menu
            </Button>
            <Button onClick={() => { resetGame(); setPageMode('local_setup'); }} className="flex-1 bg-orange-600">
              <RotateCcw className="mr-2 h-4 w-4" /> Play Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading fallback
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-red-950 to-black text-white flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
    </div>
  );
}
