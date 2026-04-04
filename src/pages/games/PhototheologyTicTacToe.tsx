import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Grid3X3, BookOpen, RotateCcw, Users, Swords, Trophy, X, Circle, Wifi } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { MultiplayerLobby } from "@/components/games/MultiplayerLobby";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";

type Player = 'X' | 'O' | null;

interface BibleQuestion {
  question: string;
  answer: string;
  options: string[];
}

const BIBLE_QUESTIONS: BibleQuestion[] = [
  { question: "What was the first miracle Jesus performed?", answer: "Turning water into wine", options: ["Healing a blind man", "Turning water into wine", "Walking on water", "Feeding 5000"] },
  { question: "Who was the first martyr in the Bible?", answer: "Abel", options: ["Stephen", "Abel", "John the Baptist", "James"] },
  { question: "What instrument did David play?", answer: "Harp", options: ["Flute", "Harp", "Trumpet", "Drums"] },
  { question: "How many days did it rain during the flood?", answer: "40", options: ["7", "40", "100", "150"] },
  { question: "Who was the mother of John the Baptist?", answer: "Elizabeth", options: ["Mary", "Elizabeth", "Hannah", "Sarah"] },
  { question: "What mountain did Moses receive the Ten Commandments on?", answer: "Mount Sinai", options: ["Mount Carmel", "Mount Sinai", "Mount of Olives", "Mount Zion"] },
  { question: "Who was sold into slavery by his brothers?", answer: "Joseph", options: ["Moses", "Joseph", "Jacob", "Benjamin"] },
  { question: "What did God create on the fourth day?", answer: "Sun, moon, and stars", options: ["Animals", "Man", "Sun, moon, and stars", "Plants"] },
  { question: "Who wrote the book of Revelation?", answer: "John", options: ["Paul", "Peter", "John", "Luke"] },
  { question: "How many loaves of bread did Jesus use to feed 5000?", answer: "5", options: ["2", "5", "7", "12"] },
  { question: "Who was the father of King Solomon?", answer: "David", options: ["Saul", "David", "Samuel", "Jonathan"] },
  { question: "What did Jacob give to his son Joseph?", answer: "A coat of many colors", options: ["A ring", "A sword", "A coat of many colors", "A crown"] },
];

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export default function PhototheologyTicTacToe() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gameMode, setGameMode] = useState<"local" | "ai" | "online" | null>(null);
  const multiplayer = useGameMultiplayer("tic-tac-toe");
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<BibleQuestion | null>(null);
  const [pendingMove, setPendingMove] = useState<number | null>(null);

  const checkWinner = useCallback((squares: Player[]): { winner: Player; line: number[] | null } => {
    for (const line of WINNING_LINES) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    return { winner: null, line: null };
  }, []);

  const handleCellClick = (index: number) => {
    if (board[index] || winner || isDraw || showQuestion) return;
    
    // Online: check if it's my turn
    if (gameMode === "online" && !multiplayer.isMyTurn) {
      toast.error("Not your turn!");
      return;
    }

    // Show Bible question before allowing the move
    setCurrentQuestion(BIBLE_QUESTIONS[Math.floor(Math.random() * BIBLE_QUESTIONS.length)]);
    setPendingMove(index);
    setShowQuestion(true);
  };

  // Sync online game state
  useEffect(() => {
    if (gameMode !== "online" || !multiplayer.room || multiplayer.room.status !== "active") return;
    const gs = multiplayer.room.game_state;
    if (gs?.board) {
      setBoard(gs.board);
      setCurrentPlayer(gs.currentPlayer || 'X');
      if (gs.winner) {
        setWinner(gs.winner);
        setWinningLine(gs.winningLine || null);
      }
      if (gs.isDraw) setIsDraw(true);
    }
  }, [multiplayer.room?.game_state, multiplayer.room?.status, gameMode]);

  const handleQuestionAnswer = (answer: string) => {
    if (!currentQuestion || pendingMove === null) return;

    const isCorrect = answer === currentQuestion.answer;
    setShowQuestion(false);

    if (isCorrect) {
      toast.success(t('games.common.correct'));
      executeMove(pendingMove);
    } else {
      toast.error(t('games.common.incorrectAnswer', { answer: currentQuestion.answer }));
      // Wrong answer - lose turn
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

      if (gameMode === 'ai' && currentPlayer === 'X') {
        setTimeout(() => makeAIMove(board), 500);
      }
      
      // Online: sync turn change
      if (gameMode === "online" && multiplayer.room && multiplayer.players.length >= 2) {
        const nextUserId = multiplayer.players.find(p => p.user_id !== user?.id)?.user_id;
        if (nextUserId) {
          multiplayer.updateGameState(
            { ...multiplayer.room.game_state, board, currentPlayer: currentPlayer === 'X' ? 'O' : 'X' },
            nextUserId
          );
        }
      }
    }

    setPendingMove(null);
    setCurrentQuestion(null);
  };

  const executeMove = (index: number) => {
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      if (gameWinner === 'X') {
        setXWins(prev => prev + 1);
      } else {
        setOWins(prev => prev + 1);
      }
      saveGameResult(gameWinner);
      return;
    }

    if (newBoard.every(cell => cell !== null)) {
      setIsDraw(true);
      if (gameMode === "online") {
        multiplayer.updateGameState({ board: newBoard, currentPlayer, isDraw: true }, null, "completed");
      }
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    if (gameMode === 'ai' && nextPlayer === 'O') {
      setTimeout(() => makeAIMove(newBoard), 500);
    }

    // Online: sync move
    if (gameMode === "online" && multiplayer.room && multiplayer.players.length >= 2) {
      const nextUserId = multiplayer.players.find(p => p.user_id !== user?.id)?.user_id;
      if (nextUserId) {
        multiplayer.updateGameState(
          { board: newBoard, currentPlayer: nextPlayer },
          nextUserId
        );
      }
    }
  };

  const makeAIMove = (currentBoard: Player[]) => {
    // Simple AI: Try to win, block, or play strategically
    const emptyIndices = currentBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);

    if (emptyIndices.length === 0) return;

    // Try to win
    for (const index of emptyIndices) {
      const testBoard = [...currentBoard];
      testBoard[index] = 'O';
      if (checkWinner(testBoard).winner === 'O') {
        executeMove(index);
        return;
      }
    }

    // Block opponent's win
    for (const index of emptyIndices) {
      const testBoard = [...currentBoard];
      testBoard[index] = 'X';
      if (checkWinner(testBoard).winner === 'X') {
        executeMove(index);
        return;
      }
    }

    // Take center if available
    if (currentBoard[4] === null) {
      executeMove(4);
      return;
    }

    // Take a corner
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(i => currentBoard[i] === null);
    if (emptyCorners.length > 0) {
      executeMove(emptyCorners[Math.floor(Math.random() * emptyCorners.length)]);
      return;
    }

    // Take any available
    executeMove(emptyIndices[Math.floor(Math.random() * emptyIndices.length)]);
  };

  const saveGameResult = async (gameWinner: 'X' | 'O') => {
    if (!user) return;
    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "phototheology_tictactoe",
        score: gameWinner === 'X' ? 10 : 0,
        metadata: { winner: gameWinner, gameMode }
      });
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
  };

  const resetScore = () => {
    resetGame();
    setXWins(0);
    setOWins(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
            <Grid3X3 className="h-8 w-8" />
            {t('games.ticTacToe.title')}
          </h1>
          {gameMode && (
            <Button variant="outline" onClick={resetScore} className="border-purple-500/50">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('games.common.resetAll')}
            </Button>
          )}
        </div>

        {/* Game Mode Selection */}
        {!gameMode && (
          <div className="max-w-md mx-auto">
            <Card className="bg-black/40 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-purple-400 text-center">{t('games.common.selectGameMode')}</CardTitle>
                <CardDescription className="text-center text-purple-200/80">
                  {t('games.ticTacToe.answerToPlace')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setGameMode("local")}
                  className="w-full h-auto py-4 bg-purple-600 hover:bg-purple-700"
                >
                  <Users className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-bold">{t('games.common.local2Player')}</div>
                    <div className="text-xs opacity-80">{t('games.common.takeTurns')}</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setGameMode("ai")}
                  className="w-full h-auto py-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Swords className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-bold">{t('games.common.vsComputer')}</div>
                    <div className="text-xs opacity-80">{t('games.common.playAgainstAI')}</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setGameMode("online")}
                  className="w-full h-auto py-4 bg-green-600 hover:bg-green-700"
                >
                  <Wifi className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-bold">Online Multiplayer</div>
                    <div className="text-xs opacity-80">Play with friends online</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Online Multiplayer Lobby */}
        {gameMode === "online" && multiplayer.room?.status !== "active" && (
          <MultiplayerLobby
            room={multiplayer.room}
            players={multiplayer.players}
            loading={multiplayer.loading}
            isHost={multiplayer.isHost}
            gameName="PT Tic-Tac-Toe"
            onCreateRoom={() => multiplayer.createRoom(2)}
            onJoinRoom={(code) => multiplayer.joinRoom(code)}
            onStartGame={() => {
              if (multiplayer.players.length >= 2) {
                const firstPlayer = multiplayer.players[0];
                multiplayer.startGame(
                  { board: Array(9).fill(null), currentPlayer: 'X' },
                  firstPlayer.user_id
                );
              }
            }}
            onLeaveRoom={multiplayer.leaveRoom}
            onBack={() => { setGameMode(null); multiplayer.leaveRoom(); }}
          />
        )}

        {/* Game Board */}
        {((gameMode === "local" || gameMode === "ai") || (gameMode === "online" && multiplayer.room?.status === "active")) && (
          <div className="flex flex-col items-center gap-6">
            {/* Score */}
            <div className="flex items-center gap-8">
              <Badge className="px-4 py-2 bg-blue-600 text-lg flex items-center gap-2">
                <X className="h-4 w-4" /> {t('games.ticTacToe.playerX')}: {xWins}
              </Badge>
              <Badge className={`px-4 py-2 text-lg ${
                winner ? (winner === 'X' ? 'bg-blue-600' : 'bg-pink-600') :
                isDraw ? 'bg-gray-600' :
                (currentPlayer === 'X' ? 'bg-blue-600 ring-2 ring-yellow-400' : 'bg-pink-600 ring-2 ring-yellow-400')
              }`}>
                {winner ? t('games.common.playerWins', { player: winner }) : isDraw ? t('games.common.draw') : t('games.common.playerTurn', { player: currentPlayer })}
              </Badge>
              <Badge className="px-4 py-2 bg-pink-600 text-lg flex items-center gap-2">
                <Circle className="h-4 w-4" /> {t('games.ticTacToe.playerO')}: {oWins}
              </Badge>
            </div>

            {/* Board */}
            <div className="grid grid-cols-3 gap-2 bg-purple-900/50 p-4 rounded-xl shadow-2xl">
              {board.map((cell, index) => {
                const isWinningCell = winningLine?.includes(index);

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={cell !== null || winner !== null || isDraw || showQuestion}
                    whileHover={{ scale: cell ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
                      flex items-center justify-center
                      rounded-xl text-6xl sm:text-7xl font-bold
                      transition-all duration-200
                      ${!cell && !winner && !isDraw ? 'bg-purple-800/50 hover:bg-purple-700/50 cursor-pointer' : 'bg-purple-900/30'}
                      ${isWinningCell ? 'ring-4 ring-yellow-400 bg-yellow-400/20' : ''}
                    `}
                  >
                    <AnimatePresence mode="wait">
                      {cell && (
                        <motion.span
                          key={`cell-${index}-${cell}`}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          className={cell === 'X' ? 'text-blue-400' : 'text-pink-400'}
                        >
                          {cell === 'X' ? <X className="w-16 h-16 sm:w-20 sm:h-20" /> : <Circle className="w-16 h-16 sm:w-20 sm:h-20" />}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/* Play Again Button */}
            {(winner || isDraw) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('games.common.playAgain')}
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Bible Question Dialog */}
        <Dialog open={showQuestion} onOpenChange={() => {}}>
          <DialogContent className="bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-400 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-purple-200 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('games.common.bibleChallenge')}
              </DialogTitle>
              <DialogDescription className="text-purple-100">
                {t('games.ticTacToe.answerToPlaceMark', { player: currentPlayer })}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-xl text-white text-center mb-4">{currentQuestion?.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion?.options.map((option, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleQuestionAnswer(option)}
                    variant="outline"
                    className="py-4 text-sm border-purple-400 hover:bg-purple-500/30"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
      <FloatingGameChat roomId={multiplayer.room?.id} gameType="tic-tac-toe" />
    </div>
  );
}
