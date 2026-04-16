import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Crown, Swords, BookOpen, RotateCcw, Users, User, Trophy, Wifi } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { MultiplayerLobby } from "@/components/games/MultiplayerLobby";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";

// Chess piece types
type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

interface Position {
  row: number;
  col: number;
}

interface BibleQuestion {
  question: string;
  answer: string;
  options: string[];
  category: string;
}

// Chess piece symbols
const PIECE_SYMBOLS: Record<PieceType, Record<PieceColor, string>> = {
  king: { white: '♔', black: '♚' },
  queen: { white: '♕', black: '♛' },
  rook: { white: '♖', black: '♜' },
  bishop: { white: '♗', black: '♝' },
  knight: { white: '♘', black: '♞' },
  pawn: { white: '♙', black: '♟' }
};

// Bible questions for capturing pieces
const BIBLE_QUESTIONS: BibleQuestion[] = [
  { question: "Who was thrown into the lion's den?", answer: "Daniel", options: ["David", "Daniel", "Moses", "Elijah"], category: "Old Testament" },
  { question: "How many days was Jesus in the tomb?", answer: "3", options: ["1", "2", "3", "7"], category: "New Testament" },
  { question: "Who built the ark?", answer: "Noah", options: ["Moses", "Noah", "Abraham", "Jacob"], category: "Old Testament" },
  { question: "What is the first book of the Bible?", answer: "Genesis", options: ["Exodus", "Genesis", "Matthew", "Psalms"], category: "Bible Basics" },
  { question: "Who betrayed Jesus for 30 pieces of silver?", answer: "Judas", options: ["Peter", "Judas", "Thomas", "John"], category: "New Testament" },
  { question: "What sea did Moses part?", answer: "Red Sea", options: ["Dead Sea", "Red Sea", "Mediterranean", "Galilee"], category: "Old Testament" },
  { question: "How many disciples did Jesus have?", answer: "12", options: ["7", "10", "12", "15"], category: "New Testament" },
  { question: "Who was the first king of Israel?", answer: "Saul", options: ["David", "Saul", "Solomon", "Samuel"], category: "Old Testament" },
  { question: "What fruit did Eve eat in the garden?", answer: "Forbidden fruit", options: ["Apple", "Fig", "Forbidden fruit", "Pomegranate"], category: "Old Testament" },
  { question: "Who wrote most of the Psalms?", answer: "David", options: ["Moses", "David", "Solomon", "Asaph"], category: "Old Testament" },
  { question: "Where was Jesus born?", answer: "Bethlehem", options: ["Jerusalem", "Nazareth", "Bethlehem", "Capernaum"], category: "New Testament" },
  { question: "Who was swallowed by a great fish?", answer: "Jonah", options: ["Jonah", "Elijah", "Peter", "Job"], category: "Old Testament" },
  { question: "How many commandments did God give Moses?", answer: "10", options: ["5", "7", "10", "12"], category: "Old Testament" },
  { question: "Who walked on water with Jesus?", answer: "Peter", options: ["John", "Peter", "James", "Andrew"], category: "New Testament" },
  { question: "What is the last book of the Bible?", answer: "Revelation", options: ["Jude", "Revelation", "Acts", "Malachi"], category: "Bible Basics" },
  { question: "Who killed Goliath?", answer: "David", options: ["Saul", "Jonathan", "David", "Samuel"], category: "Old Testament" },
  { question: "What did Jesus turn water into?", answer: "Wine", options: ["Juice", "Wine", "Milk", "Oil"], category: "New Testament" },
  { question: "Who led Israel into the Promised Land?", answer: "Joshua", options: ["Moses", "Joshua", "Caleb", "Aaron"], category: "Old Testament" },
  { question: "How many days did God take to create the world?", answer: "6", options: ["5", "6", "7", "1"], category: "Old Testament" },
  { question: "Who denied Jesus three times?", answer: "Peter", options: ["Judas", "Peter", "Thomas", "John"], category: "New Testament" },
];

// Initial chess board setup
const createInitialBoard = (): (ChessPiece | null)[][] => {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  // Set up black pieces (top)
  board[0] = [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' }
  ];
  board[1] = Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'black' as PieceColor }));

  // Set up white pieces (bottom)
  board[7] = [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' }
  ];
  board[6] = Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'white' as PieceColor }));

  return board;
};

export default function PhototheologyChess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gameMode, setGameMode] = useState<"local" | "ai" | "online" | null>(null);
  const multiplayer = useGameMultiplayer("chess");
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<ChessPiece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<ChessPiece[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<BibleQuestion | null>(null);
  const [pendingCapture, setPendingCapture] = useState<{ from: Position; to: Position; capturedPiece: ChessPiece } | null>(null);
  const [playerNames, setPlayerNames] = useState({ white: "White", black: "Black" });
  const [isCheck, setIsCheck] = useState(false);

  // Calculate valid moves for a piece
  const calculateValidMoves = useCallback((pos: Position, boardState: (ChessPiece | null)[][]): Position[] => {
    const piece = boardState[pos.row][pos.col];
    if (!piece) return [];

    const moves: Position[] = [];
    const { row, col } = pos;
    const color = piece.color;
    const direction = color === 'white' ? -1 : 1;

    const addMove = (r: number, c: number) => {
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = boardState[r][c];
        if (!target || target.color !== color) {
          moves.push({ row: r, col: c });
          return !target; // Can continue if empty
        }
      }
      return false;
    };

    switch (piece.type) {
      case 'pawn':
        // Forward move
        if (!boardState[row + direction]?.[col]) {
          moves.push({ row: row + direction, col });
          // Double move from starting position
          if ((color === 'white' && row === 6) || (color === 'black' && row === 1)) {
            if (!boardState[row + 2 * direction]?.[col]) {
              moves.push({ row: row + 2 * direction, col });
            }
          }
        }
        // Captures
        [-1, 1].forEach(dc => {
          const target = boardState[row + direction]?.[col + dc];
          if (target && target.color !== color) {
            moves.push({ row: row + direction, col: col + dc });
          }
        });
        break;

      case 'rook':
        // Horizontal and vertical
        for (let i = row + 1; i < 8; i++) if (!addMove(i, col)) break;
        for (let i = row - 1; i >= 0; i--) if (!addMove(i, col)) break;
        for (let i = col + 1; i < 8; i++) if (!addMove(row, i)) break;
        for (let i = col - 1; i >= 0; i--) if (!addMove(row, i)) break;
        break;

      case 'bishop':
        // Diagonals
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col + i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col - i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col + i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col - i)) break;
        break;

      case 'queen':
        // Rook + Bishop moves
        for (let i = row + 1; i < 8; i++) if (!addMove(i, col)) break;
        for (let i = row - 1; i >= 0; i--) if (!addMove(i, col)) break;
        for (let i = col + 1; i < 8; i++) if (!addMove(row, i)) break;
        for (let i = col - 1; i >= 0; i--) if (!addMove(row, i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col + i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col - i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col + i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col - i)) break;
        break;

      case 'knight':
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        knightMoves.forEach(([dr, dc]) => addMove(row + dr, col + dc));
        break;

      case 'king':
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) addMove(row + dr, col + dc);
          }
        }
        break;
    }

    return moves;
  }, []);

  // Check if a king is in check
  const isKingInCheck = useCallback((color: PieceColor, boardState: (ChessPiece | null)[][]): boolean => {
    // Find king position
    let kingPos: Position | null = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (piece?.type === 'king' && piece.color === color) {
          kingPos = { row: r, col: c };
          break;
        }
      }
      if (kingPos) break;
    }

    if (!kingPos) return false;

    // Check if any opponent piece can capture the king
    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (piece?.color === opponentColor) {
          const moves = calculateValidMoves({ row: r, col: c }, boardState);
          if (moves.some(m => m.row === kingPos!.row && m.col === kingPos!.col)) {
            return true;
          }
        }
      }
    }

    return false;
  }, [calculateValidMoves]);

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (gameOver || showQuestion) return;

    const piece = board[row][col];

    // If a piece is selected
    if (selectedPiece) {
      const isValidMove = validMoves.some(m => m.row === row && m.col === col);

      if (isValidMove) {
        const targetPiece = board[row][col];

        // If capturing a piece, show question
        if (targetPiece) {
          setCurrentQuestion(BIBLE_QUESTIONS[Math.floor(Math.random() * BIBLE_QUESTIONS.length)]);
          setPendingCapture({
            from: selectedPiece,
            to: { row, col },
            capturedPiece: targetPiece
          });
          setShowQuestion(true);
        } else {
          // Regular move
          executeMove(selectedPiece, { row, col });
        }
      } else if (piece?.color === currentPlayer) {
        // Select a different piece
        setSelectedPiece({ row, col });
        setValidMoves(calculateValidMoves({ row, col }, board));
      } else {
        // Deselect
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else if (piece?.color === currentPlayer) {
      // Select a piece
      setSelectedPiece({ row, col });
      setValidMoves(calculateValidMoves({ row, col }, board));
    }
  };

  // Execute a move
  const executeMove = (from: Position, to: Position, capture?: ChessPiece) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.row][from.col]!;

    // Handle pawn promotion
    if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
      piece.type = 'queen'; // Auto-promote to queen
    }

    // Add captured piece to list
    if (capture) {
      if (capture.color === 'white') {
        setCapturedWhite([...capturedWhite, capture]);
      } else {
        setCapturedBlack([...capturedBlack, capture]);
      }
    }

    // Move piece
    newBoard[to.row][to.col] = { ...piece, hasMoved: true };
    newBoard[from.row][from.col] = null;

    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);

    // Check for checkmate or check
    const opponentColor = currentPlayer === 'white' ? 'black' : 'white';
    const opponentInCheck = isKingInCheck(opponentColor, newBoard);
    setIsCheck(opponentInCheck);

    // Check if game is over (king captured or checkmate)
    if (capture?.type === 'king') {
      setGameOver(true);
      setWinner(currentPlayer);
      saveGameResult();
      return;
    }

    // Switch player
    setCurrentPlayer(opponentColor);

    // AI move if playing against AI
    if (gameMode === 'ai' && opponentColor === 'black') {
      setTimeout(() => makeAIMove(newBoard), 500);
    }
  };

  // Handle question answer
  const handleQuestionAnswer = (answer: string) => {
    if (!currentQuestion || !pendingCapture) return;

    const isCorrect = answer === currentQuestion.answer;
    setShowQuestion(false);

    if (isCorrect) {
      toast.success(t('games.common.correctCapture'));
      executeMove(pendingCapture.from, pendingCapture.to, pendingCapture.capturedPiece);
    } else {
      toast.error(t('games.common.incorrectAnswer', { answer: currentQuestion.answer }));
      // Move without capture - piece goes back
      setSelectedPiece(null);
      setValidMoves([]);

      // Still switch turns as a penalty
      const opponentColor = currentPlayer === 'white' ? 'black' : 'white';
      setCurrentPlayer(opponentColor);

      if (gameMode === 'ai' && opponentColor === 'black') {
        setTimeout(() => makeAIMove(board), 500);
      }
    }

    setPendingCapture(null);
    setCurrentQuestion(null);
  };

  // Simple AI move
  const makeAIMove = (currentBoard: (ChessPiece | null)[][]) => {
    const allMoves: { from: Position; to: Position; score: number }[] = [];

    // Find all possible moves for black
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = currentBoard[r][c];
        if (piece?.color === 'black') {
          const moves = calculateValidMoves({ row: r, col: c }, currentBoard);
          moves.forEach(move => {
            const target = currentBoard[move.row][move.col];
            let score = 0;
            // Prioritize captures
            if (target) {
              const pieceValues: Record<PieceType, number> = {
                pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100
              };
              score = pieceValues[target.type];
            }
            // Slight randomness
            score += Math.random() * 0.5;
            allMoves.push({ from: { row: r, col: c }, to: move, score });
          });
        }
      }
    }

    if (allMoves.length === 0) {
      setGameOver(true);
      setWinner('white');
      return;
    }

    // Pick best move
    allMoves.sort((a, b) => b.score - a.score);
    const bestMove = allMoves[0];
    const targetPiece = currentBoard[bestMove.to.row][bestMove.to.col];

    if (targetPiece) {
      // AI automatically captures (no question for AI)
      executeMove(bestMove.from, bestMove.to, targetPiece);
    } else {
      executeMove(bestMove.from, bestMove.to);
    }
  };

  // Save game result
  const saveGameResult = async () => {
    if (!user) return;
    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "phototheology_chess",
        score: winner === 'white' ? 100 : 0,
        metadata: { winner, gameMode }
      });
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer('white');
    setSelectedPiece(null);
    setValidMoves([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setGameOver(false);
    setWinner(null);
    setIsCheck(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-900 to-red-950">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold text-amber-400 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
            <Crown className="h-8 w-8" />
            {t('games.chess.title')}
          </h1>
          {gameMode && (
            <Button variant="outline" onClick={resetGame} className="border-amber-500/50">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('games.common.newGame')}
            </Button>
          )}
        </div>

        {/* Game Mode Selection */}
        {!gameMode && (
          <div className="max-w-md mx-auto">
            <Card className="bg-black/40 border-amber-500/50">
              <CardHeader>
                <CardTitle className="text-amber-400 text-center">{t('games.common.selectGameMode')}</CardTitle>
                <CardDescription className="text-center text-amber-200/80">
                  {t('games.common.answerBibleQuestions')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setGameMode("local")}
                  className="w-full h-auto py-4 bg-amber-600 hover:bg-amber-700"
                >
                  <Users className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-bold">{t('games.common.local2Player')}</div>
                    <div className="text-xs opacity-80">{t('games.common.passAndPlay')}</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setGameMode("ai")}
                  className="w-full h-auto py-4 bg-purple-600 hover:bg-purple-700"
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
            gameName="PT Chess"
            onCreateRoom={() => multiplayer.createRoom(2)}
            onJoinRoom={(code) => multiplayer.joinRoom(code)}
            onStartGame={() => {
              if (multiplayer.players.length >= 2) {
                multiplayer.startGame(
                  { board: "initial", currentPlayer: 'white' },
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
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
            {/* Captured pieces - Black */}
            <Card className="bg-black/40 border-amber-500/50 p-4 min-w-[120px]">
              <p className="text-amber-400 text-sm mb-2">{t('games.chess.capturedByWhite')}:</p>
              <div className="flex flex-wrap gap-1">
                {capturedBlack.map((piece, i) => (
                  <span key={i} className="text-2xl">{PIECE_SYMBOLS[piece.type][piece.color]}</span>
                ))}
              </div>
            </Card>

            {/* Chess Board */}
            <div className="relative">
              {/* Turn indicator */}
              <div className="text-center mb-4">
                <Badge
                  className={`px-4 py-2 text-lg ${
                    currentPlayer === 'white' ? 'bg-white text-black' : 'bg-gray-800 text-white'
                  }`}
                >
                  {isCheck && <span className="text-red-500 mr-2">{t('games.chess.check')}</span>}
                  {gameMode === 'ai' && currentPlayer === 'black' ? t('games.chess.aiThinking') : t('games.chess.playerTurn', { player: playerNames[currentPlayer] })}
                </Badge>
              </div>

              {/* Board */}
              <div className="grid grid-cols-8 border-4 border-amber-800 rounded-lg overflow-hidden shadow-2xl">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => {
                    const isLight = (rowIndex + colIndex) % 2 === 0;
                    const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
                    const isValidMove = validMoves.some(m => m.row === rowIndex && m.col === colIndex);
                    const canCapture = isValidMove && piece !== null;

                    return (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        whileHover={{ scale: 1.02 }}
                        className={`
                          w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center cursor-pointer
                          text-3xl sm:text-4xl md:text-5xl relative transition-all
                          ${isLight ? 'bg-amber-200' : 'bg-amber-800'}
                          ${isSelected ? 'ring-4 ring-yellow-400 ring-inset' : ''}
                          ${isValidMove && !canCapture ? 'after:absolute after:w-4 after:h-4 after:rounded-full after:bg-green-500/50' : ''}
                          ${canCapture ? 'ring-4 ring-red-500 ring-inset bg-red-500/30' : ''}
                        `}
                      >
                        {piece && (
                          <span className={piece.color === 'white' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-gray-900'}>
                            {PIECE_SYMBOLS[piece.type][piece.color]}
                          </span>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Captured pieces - White */}
            <Card className="bg-black/40 border-amber-500/50 p-4 min-w-[120px]">
              <p className="text-amber-400 text-sm mb-2">{t('games.chess.capturedByBlack')}:</p>
              <div className="flex flex-wrap gap-1">
                {capturedWhite.map((piece, i) => (
                  <span key={i} className="text-2xl">{PIECE_SYMBOLS[piece.type][piece.color]}</span>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Bible Question Dialog */}
        <Dialog open={showQuestion} onOpenChange={() => {}}>
          <DialogContent className="bg-gradient-to-br from-amber-900 to-orange-900 border-amber-400 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-amber-200 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('games.common.bibleChallenge')}
              </DialogTitle>
              <DialogDescription className="text-amber-100">
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
                    className="py-4 text-lg border-amber-400 hover:bg-amber-500/30"
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
          <DialogContent className="bg-gradient-to-br from-amber-900 to-orange-900 border-amber-400">
            <DialogHeader>
              <DialogTitle className="text-3xl text-center text-amber-200">
                <Trophy className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
                {t('games.common.gameOver')}
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center">
              <p className="text-2xl text-white">
                {t('games.common.playerWins', { player: winner === 'white' ? playerNames.white : playerNames.black })}
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button onClick={resetGame} className="flex-1 bg-amber-600 hover:bg-amber-700">
                {t('games.common.playAgain')}
              </Button>
              <Button onClick={() => navigate("/games")} variant="outline" className="flex-1 border-amber-400">
                {t('common.backToGames')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
      <FloatingGameChat roomId={multiplayer.room?.id} gameType="chess" />
    </div>
  );
}
