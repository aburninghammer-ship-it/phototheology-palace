import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, CircleDot, BookOpen, RotateCcw, Users, Swords, Trophy, ChevronDown, Wifi } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { MultiplayerLobby } from "@/components/games/MultiplayerLobby";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";

type Player = 'red' | 'yellow' | null;

interface BibleQuestion {
  question: string;
  answer: string;
  options: string[];
}

const BIBLE_QUESTIONS: BibleQuestion[] = [
  { question: "Who was Abraham's wife?", answer: "Sarah", options: ["Rachel", "Sarah", "Rebecca", "Leah"] },
  { question: "What was Paul's name before his conversion?", answer: "Saul", options: ["Simon", "Saul", "Stephen", "Samuel"] },
  { question: "How many books are in the Bible?", answer: "66", options: ["39", "52", "66", "73"] },
  { question: "Who was the first woman in the Bible?", answer: "Eve", options: ["Mary", "Eve", "Sarah", "Ruth"] },
  { question: "What was Moses' brother Aaron's role?", answer: "High Priest", options: ["King", "Prophet", "High Priest", "Judge"] },
  { question: "Who was the youngest son of Jacob?", answer: "Benjamin", options: ["Joseph", "Benjamin", "Judah", "Dan"] },
  { question: "What did Ruth say to Naomi?", answer: "Where you go, I will go", options: ["Return to your people", "Where you go, I will go", "I will stay here", "Leave me alone"] },
  { question: "Who rebuilt the walls of Jerusalem?", answer: "Nehemiah", options: ["Ezra", "Nehemiah", "Zerubbabel", "Haggai"] },
  { question: "What was the occupation of the apostle Matthew?", answer: "Tax collector", options: ["Fisherman", "Tax collector", "Carpenter", "Shepherd"] },
  { question: "How many tribes of Israel were there?", answer: "12", options: ["7", "10", "12", "14"] },
  { question: "Who said 'Am I my brother's keeper?'", answer: "Cain", options: ["Abel", "Cain", "Seth", "Adam"] },
  { question: "What tree did Zacchaeus climb?", answer: "Sycamore", options: ["Fig", "Olive", "Sycamore", "Palm"] },
  { question: "Who was thrown into a pit by his brothers?", answer: "Joseph", options: ["Benjamin", "Joseph", "Judah", "Reuben"] },
  { question: "What did Jesus write in the sand?", answer: "We don't know", options: ["Names", "Sins", "Words of forgiveness", "We don't know"] },
  { question: "Who was the father-in-law of Moses?", answer: "Jethro", options: ["Aaron", "Jethro", "Pharaoh", "Joshua"] },
];

const ROWS = 6;
const COLS = 7;

export default function PhototheologyConnectFour() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gameMode, setGameMode] = useState<"local" | "ai" | "online" | null>(null);
  const multiplayer = useGameMultiplayer("connect-four");
  const [board, setBoard] = useState<Player[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'yellow'>('red');
  const [winner, setWinner] = useState<Player>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [isDraw, setIsDraw] = useState(false);
  const [redWins, setRedWins] = useState(0);
  const [yellowWins, setYellowWins] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<BibleQuestion | null>(null);
  const [pendingColumn, setPendingColumn] = useState<number | null>(null);
  const [droppingPiece, setDroppingPiece] = useState<{ col: number; row: number } | null>(null);

  const checkWinner = useCallback((boardState: Player[][], row: number, col: number, player: Player): [number, number][] | null => {
    if (!player) return null;

    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal down-right
      [1, -1], // Diagonal down-left
    ];

    for (const [dr, dc] of directions) {
      const cells: [number, number][] = [[row, col]];

      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === player) {
          cells.push([r, c]);
        } else break;
      }

      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === player) {
          cells.push([r, c]);
        } else break;
      }

      if (cells.length >= 4) return cells;
    }

    return null;
  }, []);

  const findLowestRow = useCallback((boardState: Player[][], col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (boardState[row][col] === null) return row;
    }
    return -1;
  }, []);

  const handleColumnClick = (col: number) => {
    if (winner || isDraw || showQuestion) return;

    const row = findLowestRow(board, col);
    if (row === -1) {
      toast.error(t('games.connectFour.columnFull'));
      return;
    }

    // Show Bible question before allowing the drop
    setCurrentQuestion(BIBLE_QUESTIONS[Math.floor(Math.random() * BIBLE_QUESTIONS.length)]);
    setPendingColumn(col);
    setShowQuestion(true);
  };

  const handleQuestionAnswer = (answer: string) => {
    if (!currentQuestion || pendingColumn === null) return;

    const isCorrect = answer === currentQuestion.answer;
    setShowQuestion(false);

    if (isCorrect) {
      toast.success(t('games.common.correct'));
      executeDrop(pendingColumn);
    } else {
      toast.error(t('games.common.incorrectAnswer', { answer: currentQuestion.answer }));
      // Wrong answer - lose turn
      const nextPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      setCurrentPlayer(nextPlayer);

      if (gameMode === 'ai' && nextPlayer === 'yellow') {
        setTimeout(() => makeAIMove(board), 500);
      }
    }

    setPendingColumn(null);
    setCurrentQuestion(null);
  };

  const executeDrop = (col: number) => {
    const row = findLowestRow(board, col);
    if (row === -1) return;

    // Animate the drop
    setDroppingPiece({ col, row });

    setTimeout(() => {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      setDroppingPiece(null);

      // Check for winner
      const winCells = checkWinner(newBoard, row, col, currentPlayer);
      if (winCells) {
        setWinner(currentPlayer);
        setWinningCells(winCells);
        if (currentPlayer === 'red') {
          setRedWins(prev => prev + 1);
        } else {
          setYellowWins(prev => prev + 1);
        }
        saveGameResult(currentPlayer);
        return;
      }

      // Check for draw
      if (newBoard.every(row => row.every(cell => cell !== null))) {
        setIsDraw(true);
        return;
      }

      const nextPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      setCurrentPlayer(nextPlayer);

      if (gameMode === 'ai' && nextPlayer === 'yellow') {
        setTimeout(() => makeAIMove(newBoard), 500);
      }
    }, 300);
  };

  const makeAIMove = (currentBoard: Player[][]) => {
    const availableCols = [];
    for (let col = 0; col < COLS; col++) {
      if (findLowestRow(currentBoard, col) !== -1) {
        availableCols.push(col);
      }
    }

    if (availableCols.length === 0) return;

    // Try to win
    for (const col of availableCols) {
      const row = findLowestRow(currentBoard, col);
      const testBoard = currentBoard.map(r => [...r]);
      testBoard[row][col] = 'yellow';
      if (checkWinner(testBoard, row, col, 'yellow')) {
        executeDrop(col);
        return;
      }
    }

    // Block opponent's win
    for (const col of availableCols) {
      const row = findLowestRow(currentBoard, col);
      const testBoard = currentBoard.map(r => [...r]);
      testBoard[row][col] = 'red';
      if (checkWinner(testBoard, row, col, 'red')) {
        executeDrop(col);
        return;
      }
    }

    // Prefer center columns
    const centerCols = [3, 2, 4, 1, 5, 0, 6];
    for (const col of centerCols) {
      if (availableCols.includes(col)) {
        executeDrop(col);
        return;
      }
    }

    // Random fallback
    executeDrop(availableCols[Math.floor(Math.random() * availableCols.length)]);
  };

  const saveGameResult = async (gameWinner: 'red' | 'yellow') => {
    if (!user) return;
    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "phototheology_connectfour",
        score: gameWinner === 'red' ? 25 : 0,
        metadata: { winner: gameWinner, gameMode }
      });
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setWinningCells([]);
    setIsDraw(false);
    setDroppingPiece(null);
  };

  const resetScore = () => {
    resetGame();
    setRedWins(0);
    setYellowWins(0);
  };

  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
            <CircleDot className="h-8 w-8" />
            {t('games.connectFour.title')}
          </h1>
          {gameMode && (
            <Button variant="outline" onClick={resetScore} className="border-blue-500/50">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('games.common.resetAll')}
            </Button>
          )}
        </div>

        {/* Game Mode Selection */}
        {!gameMode && (
          <div className="max-w-md mx-auto">
            <Card className="bg-black/40 border-blue-500/50">
              <CardHeader>
                <CardTitle className="text-blue-400 text-center">{t('games.common.selectGameMode')}</CardTitle>
                <CardDescription className="text-center text-blue-200/80">
                  {t('games.connectFour.answerToDrop')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setGameMode("local")}
                  className="w-full h-auto py-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-bold">{t('games.common.local2Player')}</div>
                    <div className="text-xs opacity-80">{t('games.common.takeTurns')}</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setGameMode("ai")}
                  className="w-full h-auto py-4 bg-yellow-600 hover:bg-yellow-700"
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
            gameName="PT Connect Four"
            onCreateRoom={() => multiplayer.createRoom(2)}
            onJoinRoom={(code) => multiplayer.joinRoom(code)}
            onStartGame={() => {
              if (multiplayer.players.length >= 2) {
                multiplayer.startGame(
                  { board: Array(6).fill(null).map(() => Array(7).fill(null)), currentPlayer: 'red' },
                  multiplayer.players[0].user_id
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
              <Badge className="px-4 py-2 bg-red-600 text-lg">
                {t('games.connectFour.red')}: {redWins}
              </Badge>
              <Badge className={`px-4 py-2 text-lg ${
                winner ? (winner === 'red' ? 'bg-red-600' : 'bg-yellow-600') :
                isDraw ? 'bg-gray-600' :
                (currentPlayer === 'red' ? 'bg-red-600 ring-2 ring-white' : 'bg-yellow-600 ring-2 ring-white')
              }`}>
                {winner ? t('games.common.playerWins', { player: winner === 'red' ? t('games.connectFour.red') : t('games.connectFour.yellow') }) : isDraw ? t('games.common.draw') : t('games.common.playerTurn', { player: currentPlayer === 'red' ? t('games.connectFour.red') : t('games.connectFour.yellow') })}
              </Badge>
              <Badge className="px-4 py-2 bg-yellow-600 text-lg">
                {t('games.connectFour.yellow')}: {yellowWins}
              </Badge>
            </div>

            {/* Column Buttons */}
            <div className="flex gap-1">
              {Array(COLS).fill(null).map((_, col) => (
                <Button
                  key={col}
                  onClick={() => handleColumnClick(col)}
                  disabled={winner !== null || isDraw || showQuestion || findLowestRow(board, col) === -1}
                  variant="ghost"
                  className="w-12 sm:w-14 h-8 text-white hover:bg-white/20"
                >
                  <ChevronDown className="h-6 w-6" />
                </Button>
              ))}
            </div>

            {/* Board */}
            <div className="bg-blue-700 p-2 rounded-xl shadow-2xl">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 mb-1">
                  {row.map((cell, colIndex) => {
                    const isDropping = droppingPiece?.col === colIndex && droppingPiece?.row === rowIndex;
                    const isWinning = isWinningCell(rowIndex, colIndex);

                    return (
                      <div
                        key={colIndex}
                        className={`
                          w-12 h-12 sm:w-14 sm:h-14 rounded-full
                          bg-blue-950 flex items-center justify-center
                          ${isWinning ? 'ring-4 ring-white animate-pulse' : ''}
                        `}
                      >
                        <AnimatePresence>
                          {(cell || isDropping) && (
                            <motion.div
                              initial={{ y: -300 }}
                              animate={{ y: 0 }}
                              transition={{ type: "spring", damping: 10, stiffness: 100 }}
                              className={`
                                w-10 h-10 sm:w-12 sm:h-12 rounded-full
                                shadow-lg
                                ${(isDropping ? currentPlayer : cell) === 'red'
                                  ? 'bg-gradient-to-br from-red-400 to-red-600'
                                  : 'bg-gradient-to-br from-yellow-300 to-yellow-500'
                                }
                              `}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Play Again Button */}
            {(winner || isDraw) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('games.common.playAgain')}
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Bible Question Dialog */}
        <Dialog open={showQuestion} onOpenChange={() => {}}>
          <DialogContent className="bg-gradient-to-br from-blue-900 to-indigo-900 border-blue-400 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-200 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('games.common.bibleChallenge')}
              </DialogTitle>
              <DialogDescription className="text-blue-100">
                {t('games.connectFour.answerToDropDisc')}
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
                    className="py-4 text-sm border-blue-400 hover:bg-blue-500/30"
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
      <FloatingGameChat roomId={multiplayer.room?.id} gameType="connect-four" />
    </div>
  );
}
