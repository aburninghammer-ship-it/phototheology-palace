import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, CircleDot, BookOpen, RotateCcw, Users, Swords, Trophy, Crown, Wifi } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { MultiplayerLobby } from "@/components/games/MultiplayerLobby";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";

type PieceColor = 'red' | 'black';

interface CheckerPiece {
  color: PieceColor;
  isKing: boolean;
}

interface Position {
  row: number;
  col: number;
}

interface BibleQuestion {
  question: string;
  answer: string;
  options: string[];
}

const BIBLE_QUESTIONS: BibleQuestion[] = [
  { question: "What was the name of Adam's third son?", answer: "Seth", options: ["Cain", "Abel", "Seth", "Enoch"] },
  { question: "How many plagues did God send on Egypt?", answer: "10", options: ["7", "10", "12", "15"] },
  { question: "Who was Moses' brother?", answer: "Aaron", options: ["Joshua", "Caleb", "Aaron", "Miriam"] },
  { question: "What did God rain down on Sodom and Gomorrah?", answer: "Fire and brimstone", options: ["Hail", "Fire and brimstone", "Locusts", "Frogs"] },
  { question: "How many days was Lazarus dead before Jesus raised him?", answer: "4", options: ["2", "3", "4", "7"] },
  { question: "Who was the oldest man in the Bible?", answer: "Methuselah", options: ["Adam", "Noah", "Methuselah", "Abraham"] },
  { question: "What was Peter's occupation before following Jesus?", answer: "Fisherman", options: ["Carpenter", "Fisherman", "Tax Collector", "Tentmaker"] },
  { question: "How many books are in the New Testament?", answer: "27", options: ["21", "27", "33", "39"] },
  { question: "Who was thrown into the fiery furnace?", answer: "Shadrach, Meshach, and Abednego", options: ["Daniel", "David", "Shadrach, Meshach, and Abednego", "The Apostles"] },
  { question: "What river was Jesus baptized in?", answer: "Jordan", options: ["Nile", "Jordan", "Euphrates", "Tigris"] },
  { question: "Who interpreted Pharaoh's dreams?", answer: "Joseph", options: ["Moses", "Joseph", "Daniel", "Samuel"] },
  { question: "What did Samson use to kill 1,000 Philistines?", answer: "Jawbone of a donkey", options: ["Sword", "Jawbone of a donkey", "Spear", "His hands"] },
  { question: "How many sons did Jacob have?", answer: "12", options: ["10", "12", "7", "15"] },
  { question: "Who replaced Judas as an apostle?", answer: "Matthias", options: ["Paul", "Matthias", "Barnabas", "Timothy"] },
  { question: "What did Solomon ask God for?", answer: "Wisdom", options: ["Wealth", "Long life", "Wisdom", "Victory over enemies"] },
];

const createInitialBoard = (): (CheckerPiece | null)[][] => {
  const board: (CheckerPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  // Place black pieces (top)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: 'black', isKing: false };
      }
    }
  }

  // Place red pieces (bottom)
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: 'red', isKing: false };
      }
    }
  }

  return board;
};

export default function PhototheologyCheckers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gameMode, setGameMode] = useState<"local" | "ai" | "online" | null>(null);
  const multiplayer = useGameMultiplayer("checkers");
  const [board, setBoard] = useState<(CheckerPiece | null)[][]>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('red');
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [mustJump, setMustJump] = useState<Position | null>(null);
  const [capturedRed, setCapturedRed] = useState<number>(0);
  const [capturedBlack, setCapturedBlack] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<BibleQuestion | null>(null);
  const [pendingCapture, setPendingCapture] = useState<{ from: Position; to: Position; captured: Position } | null>(null);

  const calculateValidMoves = useCallback((pos: Position, boardState: (CheckerPiece | null)[][], forceJump = false): { moves: Position[], jumps: Position[] } => {
    const piece = boardState[pos.row][pos.col];
    if (!piece) return { moves: [], jumps: [] };

    const moves: Position[] = [];
    const jumps: Position[] = [];
    const directions = piece.isKing ? [-1, 1] : (piece.color === 'red' ? [-1] : [1]);

    directions.forEach(rowDir => {
      [-1, 1].forEach(colDir => {
        const newRow = pos.row + rowDir;
        const newCol = pos.col + colDir;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const target = boardState[newRow][newCol];

          if (!target && !forceJump) {
            // Regular move
            moves.push({ row: newRow, col: newCol });
          } else if (target && target.color !== piece.color) {
            // Check for jump
            const jumpRow = newRow + rowDir;
            const jumpCol = newCol + colDir;

            if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
              if (!boardState[jumpRow][jumpCol]) {
                jumps.push({ row: jumpRow, col: jumpCol });
              }
            }
          }
        }
      });
    });

    return { moves, jumps };
  }, []);

  const checkForJumps = useCallback((color: PieceColor, boardState: (CheckerPiece | null)[][]): Position[] => {
    const piecesWithJumps: Position[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece?.color === color) {
          const { jumps } = calculateValidMoves({ row, col }, boardState);
          if (jumps.length > 0) {
            piecesWithJumps.push({ row, col });
          }
        }
      }
    }

    return piecesWithJumps;
  }, [calculateValidMoves]);

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver || showQuestion) return;

    const piece = board[row][col];

    if (selectedPiece) {
      const isValidMove = validMoves.some(m => m.row === row && m.col === col);

      if (isValidMove) {
        // Check if this is a jump (capture)
        const rowDiff = Math.abs(row - selectedPiece.row);

        if (rowDiff === 2) {
          // Jump - captured piece is in between
          const capturedRow = (row + selectedPiece.row) / 2;
          const capturedCol = (col + selectedPiece.col) / 2;

          setCurrentQuestion(BIBLE_QUESTIONS[Math.floor(Math.random() * BIBLE_QUESTIONS.length)]);
          setPendingCapture({
            from: selectedPiece,
            to: { row, col },
            captured: { row: capturedRow, col: capturedCol }
          });
          setShowQuestion(true);
        } else {
          // Regular move
          executeMove(selectedPiece, { row, col });
        }
      } else if (piece?.color === currentPlayer) {
        const jumpsAvailable = checkForJumps(currentPlayer, board);
        if (jumpsAvailable.length > 0 && !jumpsAvailable.some(p => p.row === row && p.col === col)) {
          toast.error(t('games.checkers.mustJump'));
          return;
        }
        setSelectedPiece({ row, col });
        const { moves, jumps } = calculateValidMoves({ row, col }, board);
        setValidMoves(jumpsAvailable.length > 0 ? jumps : [...moves, ...jumps]);
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else if (piece?.color === currentPlayer) {
      const jumpsAvailable = checkForJumps(currentPlayer, board);
      if (jumpsAvailable.length > 0 && !jumpsAvailable.some(p => p.row === row && p.col === col)) {
        toast.error(t('games.checkers.mustJump'));
        return;
      }
      setSelectedPiece({ row, col });
      const { moves, jumps } = calculateValidMoves({ row, col }, board);
      setValidMoves(jumpsAvailable.length > 0 ? jumps : [...moves, ...jumps]);
    }
  };

  const executeMove = (from: Position, to: Position, capturedPos?: Position) => {
    const newBoard = board.map(row => [...row]);
    const piece = { ...newBoard[from.row][from.col]! };

    // Check for king promotion
    if ((piece.color === 'red' && to.row === 0) || (piece.color === 'black' && to.row === 7)) {
      piece.isKing = true;
      toast.success(t('games.checkers.crowned'));
    }

    // Remove captured piece
    if (capturedPos) {
      const capturedPiece = newBoard[capturedPos.row][capturedPos.col];
      newBoard[capturedPos.row][capturedPos.col] = null;
      if (capturedPiece?.color === 'red') {
        setCapturedRed(prev => prev + 1);
      } else {
        setCapturedBlack(prev => prev + 1);
      }
    }

    // Move piece
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);

    // Check for multi-jump
    if (capturedPos) {
      const { jumps } = calculateValidMoves(to, newBoard);
      if (jumps.length > 0) {
        // Multi-jump available
        setMustJump(to);
        setSelectedPiece(to);
        setValidMoves(jumps);
        toast.info(t('games.checkers.multiJumpAvailable'));
        return;
      }
    }

    setMustJump(null);
    checkGameOver(newBoard);

    // Switch player
    const nextPlayer = currentPlayer === 'red' ? 'black' : 'red';
    setCurrentPlayer(nextPlayer);

    // AI move
    if (gameMode === 'ai' && nextPlayer === 'black') {
      setTimeout(() => makeAIMove(newBoard), 500);
    }
  };

  const handleQuestionAnswer = (answer: string) => {
    if (!currentQuestion || !pendingCapture) return;

    const isCorrect = answer === currentQuestion.answer;
    setShowQuestion(false);

    if (isCorrect) {
      toast.success(t('games.common.correctCapture'));
      executeMove(pendingCapture.from, pendingCapture.to, pendingCapture.captured);
    } else {
      toast.error(t('games.common.incorrectAnswer', { answer: currentQuestion.answer }));
      // Failed capture - lose turn
      setSelectedPiece(null);
      setValidMoves([]);

      const nextPlayer = currentPlayer === 'red' ? 'black' : 'red';
      setCurrentPlayer(nextPlayer);

      if (gameMode === 'ai' && nextPlayer === 'black') {
        setTimeout(() => makeAIMove(board), 500);
      }
    }

    setPendingCapture(null);
    setCurrentQuestion(null);
  };

  const checkGameOver = (boardState: (CheckerPiece | null)[][]) => {
    let redPieces = 0;
    let blackPieces = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece?.color === 'red') redPieces++;
        if (piece?.color === 'black') blackPieces++;
      }
    }

    if (redPieces === 0) {
      setGameOver(true);
      setWinner('black');
      saveGameResult('black');
    } else if (blackPieces === 0) {
      setGameOver(true);
      setWinner('red');
      saveGameResult('red');
    }
  };

  const makeAIMove = (currentBoard: (CheckerPiece | null)[][]) => {
    const jumpsAvailable = checkForJumps('black', currentBoard);

    if (jumpsAvailable.length > 0) {
      // Make a jump
      const randomJumper = jumpsAvailable[Math.floor(Math.random() * jumpsAvailable.length)];
      const { jumps } = calculateValidMoves(randomJumper, currentBoard);
      const randomJump = jumps[Math.floor(Math.random() * jumps.length)];

      const capturedRow = (randomJump.row + randomJumper.row) / 2;
      const capturedCol = (randomJump.col + randomJumper.col) / 2;

      // AI auto-captures (no question)
      executeMove(randomJumper, randomJump, { row: capturedRow, col: capturedCol });
    } else {
      // Find all possible moves
      const allMoves: { from: Position; to: Position }[] = [];
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = currentBoard[row][col];
          if (piece?.color === 'black') {
            const { moves } = calculateValidMoves({ row, col }, currentBoard);
            moves.forEach(move => {
              allMoves.push({ from: { row, col }, to: move });
            });
          }
        }
      }

      if (allMoves.length === 0) {
        setGameOver(true);
        setWinner('red');
        return;
      }

      const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      executeMove(randomMove.from, randomMove.to);
    }
  };

  const saveGameResult = async (winnerColor: PieceColor) => {
    if (!user) return;
    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "phototheology_checkers",
        score: winnerColor === 'red' ? 100 : 0,
        metadata: { winner: winnerColor, gameMode }
      });
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer('red');
    setSelectedPiece(null);
    setValidMoves([]);
    setMustJump(null);
    setCapturedRed(0);
    setCapturedBlack(0);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-rose-900 to-orange-950">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold text-red-400 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
            <CircleDot className="h-8 w-8" />
            {t('games.checkers.title')}
          </h1>
          {gameMode && (
            <Button variant="outline" onClick={resetGame} className="border-red-500/50">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('games.common.newGame')}
            </Button>
          )}
        </div>

        {/* Game Mode Selection */}
        {!gameMode && (
          <div className="max-w-md mx-auto">
            <Card className="bg-black/40 border-red-500/50">
              <CardHeader>
                <CardTitle className="text-red-400 text-center">{t('games.common.selectGameMode')}</CardTitle>
                <CardDescription className="text-center text-red-200/80">
                  {t('games.common.answerBibleQuestions')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setGameMode("local")}
                  className="w-full h-auto py-4 bg-red-600 hover:bg-red-700"
                >
                  <Users className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-bold">{t('games.common.local2Player')}</div>
                    <div className="text-xs opacity-80">{t('games.common.passAndPlay')}</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setGameMode("ai")}
                  className="w-full h-auto py-4 bg-gray-700 hover:bg-gray-800"
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
            gameName="PT Checkers"
            onCreateRoom={() => multiplayer.createRoom(2)}
            onJoinRoom={(code) => multiplayer.joinRoom(code)}
            onStartGame={() => {
              if (multiplayer.players.length >= 2) {
                multiplayer.startGame(
                  { board: "initial", currentPlayer: 'red' },
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
                {t('games.checkers.redRemaining', { count: 12 - capturedRed })}
              </Badge>
              <Badge className={`px-4 py-2 text-lg ${currentPlayer === 'red' ? 'bg-red-600 ring-2 ring-yellow-400' : 'bg-gray-800'}`}>
                {currentPlayer === 'red' ? t('games.checkers.redTurn') : t('games.checkers.blackTurn')}
              </Badge>
              <Badge className="px-4 py-2 bg-gray-800 text-lg">
                {t('games.checkers.blackRemaining', { count: 12 - capturedBlack })}
              </Badge>
            </div>

            {/* Board */}
            <div className="grid grid-cols-8 border-4 border-amber-800 rounded-lg overflow-hidden shadow-2xl">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isDark = (rowIndex + colIndex) % 2 === 1;
                  const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
                  const isValidMove = validMoves.some(m => m.row === rowIndex && m.col === colIndex);

                  return (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      whileHover={{ scale: isDark ? 1.02 : 1 }}
                      className={`
                        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center
                        ${isDark ? 'bg-amber-900 cursor-pointer' : 'bg-amber-200'}
                        ${isSelected ? 'ring-4 ring-yellow-400 ring-inset' : ''}
                        ${isValidMove ? 'ring-4 ring-green-400 ring-inset' : ''}
                      `}
                    >
                      {piece && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`
                            w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full
                            flex items-center justify-center
                            shadow-lg border-4
                            ${piece.color === 'red'
                              ? 'bg-gradient-to-br from-red-500 to-red-700 border-red-300'
                              : 'bg-gradient-to-br from-gray-700 to-gray-900 border-gray-500'
                            }
                          `}
                        >
                          {piece.isKing && (
                            <Crown className={`h-6 w-6 ${piece.color === 'red' ? 'text-yellow-300' : 'text-yellow-400'}`} />
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>

            {mustJump && (
              <Badge className="bg-yellow-600 animate-pulse">
                {t('games.checkers.multiJumpAvailable')}
              </Badge>
            )}
          </div>
        )}

        {/* Bible Question Dialog */}
        <Dialog open={showQuestion} onOpenChange={() => {}}>
          <DialogContent className="bg-gradient-to-br from-red-900 to-orange-900 border-red-400 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-200 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('games.common.bibleChallenge')}
              </DialogTitle>
              <DialogDescription className="text-red-100">
                {t('games.common.answerToCapture')}
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
                    className="py-4 text-lg border-red-400 hover:bg-red-500/30"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Game Over Dialog */}
        <Dialog open={gameOver} onOpenChange={() => {}}>
          <DialogContent className="bg-gradient-to-br from-red-900 to-orange-900 border-red-400">
            <DialogHeader>
              <DialogTitle className="text-3xl text-center text-red-200">
                <Trophy className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
                {t('games.common.gameOver')}
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center">
              <p className="text-2xl text-white">
                {t('games.common.playerWins', { player: winner === 'red' ? t('games.checkers.red') : t('games.checkers.black') })}
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button onClick={resetGame} className="flex-1 bg-red-600 hover:bg-red-700">
                {t('games.common.playAgain')}
              </Button>
              <Button onClick={() => navigate("/games")} variant="outline" className="flex-1 border-red-400">
                {t('common.backToGames')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
      <FloatingGameChat roomId={multiplayer.room?.id} gameType="checkers" />
    </div>
  );
}
