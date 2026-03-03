import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Zap, Heart, Target, CheckCircle2, XCircle, Sparkles, Timer, RotateCcw } from 'lucide-react';
import { FloatingGameChat } from "@/components/games/FloatingGameChat";

interface Symbol {
  id: string;
  symbol: string;
  emoji: string;
  correctMeaning: string;
  christConnection: string;
  scriptureRef: string;
  wrongMeanings: string[];
  category: 'sanctuary' | 'nature' | 'animals' | 'numbers' | 'colors' | 'elements';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameState {
  currentRound: number;
  score: number;
  streak: number;
  bestStreak: number;
  lives: number;
  totalRounds: number;
  answeredCorrect: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  gameMode: 'match' | 'rapid' | 'christ-focus';
  status: 'menu' | 'playing' | 'feedback' | 'complete';
}

const symbolDatabase: Symbol[] = [
  // Sanctuary Symbols
  {
    id: 'lamb',
    symbol: 'Lamb',
    emoji: '🐑',
    correctMeaning: 'Sacrifice for sin / Christ as our substitute',
    christConnection: 'John 1:29 - "Behold the Lamb of God who takes away the sin of the world"',
    scriptureRef: 'Exodus 12:3-7; John 1:29; Revelation 5:6',
    wrongMeanings: ['Gentleness or meekness', 'Innocence without sacrifice', 'Wool for clothing', 'Peace and harmony'],
    category: 'animals',
    difficulty: 'easy'
  },
  {
    id: 'altar-of-burnt-offering',
    symbol: 'Altar of Burnt Offering',
    emoji: '🔥',
    correctMeaning: 'The Cross of Christ / Complete sacrifice',
    christConnection: 'Christ offered Himself once for all on the cross (Hebrews 9:14)',
    scriptureRef: 'Exodus 27:1-8; Hebrews 13:10',
    wrongMeanings: ['A place for cooking food', 'Just a ceremonial furniture', 'Punishment for enemies', 'Human achievement'],
    category: 'sanctuary',
    difficulty: 'easy'
  },
  {
    id: 'laver',
    symbol: 'Laver (Bronze Basin)',
    emoji: '💧',
    correctMeaning: 'Cleansing / Sanctification / Baptism',
    christConnection: 'Christ cleanses us by the washing of water with the Word (Ephesians 5:26)',
    scriptureRef: 'Exodus 30:17-21; Titus 3:5',
    wrongMeanings: ['Just for hand washing', 'Decoration in the courtyard', 'Storage for water', 'Reflection mirror'],
    category: 'sanctuary',
    difficulty: 'easy'
  },
  {
    id: 'lampstand',
    symbol: 'Golden Lampstand (Menorah)',
    emoji: '🕯️',
    correctMeaning: 'Christ as the Light of the World / Holy Spirit',
    christConnection: 'John 8:12 - "I am the light of the world"',
    scriptureRef: 'Exodus 25:31-40; John 8:12; Revelation 1:12-13',
    wrongMeanings: ['Just a light source for the tent', 'Decoration with gold', 'Seven days of creation only', 'Natural illumination'],
    category: 'sanctuary',
    difficulty: 'medium'
  },
  {
    id: 'showbread',
    symbol: 'Table of Showbread',
    emoji: '🍞',
    correctMeaning: 'Christ as the Bread of Life / Word of God',
    christConnection: 'John 6:35 - "I am the bread of life"',
    scriptureRef: 'Exodus 25:23-30; John 6:48-51',
    wrongMeanings: ['Food for the priests only', 'Weekly meal tradition', 'Offering to God for food', 'Symbol of human provision'],
    category: 'sanctuary',
    difficulty: 'medium'
  },
  {
    id: 'incense-altar',
    symbol: 'Altar of Incense',
    emoji: '💨',
    correctMeaning: "Christ's intercession / Our prayers ascending to God",
    christConnection: 'Christ ever lives to make intercession for us (Hebrews 7:25)',
    scriptureRef: 'Exodus 30:1-10; Revelation 8:3-4; Hebrews 7:25',
    wrongMeanings: ['Air freshener for the tent', 'Pleasant aroma for worship', 'Smoke signals to God', 'Cover for bad smells'],
    category: 'sanctuary',
    difficulty: 'medium'
  },
  {
    id: 'veil',
    symbol: 'Veil/Curtain',
    emoji: '📜',
    correctMeaning: "Christ's flesh / Barrier removed by His death",
    christConnection: 'Hebrews 10:20 - "through the veil, that is, His flesh"',
    scriptureRef: 'Exodus 26:31-35; Matthew 27:51; Hebrews 10:19-20',
    wrongMeanings: ['Just a room divider', 'Privacy screen', 'Decoration in the temple', 'Symbol of mystery'],
    category: 'sanctuary',
    difficulty: 'hard'
  },
  {
    id: 'ark-of-covenant',
    symbol: 'Ark of the Covenant',
    emoji: '📦',
    correctMeaning: "God's throne / Christ as mercy seat",
    christConnection: 'Christ is our propitiation/mercy seat (Romans 3:25)',
    scriptureRef: 'Exodus 25:10-22; Romans 3:25; Hebrews 9:4-5',
    wrongMeanings: ['Just a storage box for tablets', 'Magic power container', 'Golden treasure chest', 'Symbol of Jewish heritage'],
    category: 'sanctuary',
    difficulty: 'hard'
  },
  // Nature/Elements
  {
    id: 'water',
    symbol: 'Water',
    emoji: '💧',
    correctMeaning: 'Holy Spirit / Cleansing / Life',
    christConnection: 'John 7:38-39 - Rivers of living water = the Spirit',
    scriptureRef: 'John 4:14; John 7:37-39; Ezekiel 47:1-12',
    wrongMeanings: ['Just physical hydration', 'Baptism ritual only', 'Natural resource', 'Weather phenomenon'],
    category: 'elements',
    difficulty: 'easy'
  },
  {
    id: 'fire',
    symbol: 'Fire',
    emoji: '🔥',
    correctMeaning: "God's presence / Purification / Holy Spirit",
    christConnection: 'He will baptize you with the Holy Spirit and fire (Matthew 3:11)',
    scriptureRef: 'Exodus 3:2; Acts 2:3; Hebrews 12:29',
    wrongMeanings: ['Just heat for cooking', 'Destruction only', 'Punishment alone', 'Natural phenomenon'],
    category: 'elements',
    difficulty: 'easy'
  },
  {
    id: 'oil',
    symbol: 'Oil',
    emoji: '🫒',
    correctMeaning: 'Holy Spirit / Anointing / Consecration',
    christConnection: 'Christ = "Anointed One" (Messiah/Christ means anointed)',
    scriptureRef: 'Exodus 30:22-33; 1 Samuel 16:13; Luke 4:18',
    wrongMeanings: ['Cooking ingredient', 'Lamp fuel only', 'Moisturizer', 'Trade commodity'],
    category: 'elements',
    difficulty: 'medium'
  },
  {
    id: 'rock',
    symbol: 'Rock/Stone',
    emoji: '🪨',
    correctMeaning: 'Christ as foundation / Stability / Refuge',
    christConnection: '1 Corinthians 10:4 - "that Rock was Christ"',
    scriptureRef: 'Exodus 17:6; 1 Corinthians 10:4; Matthew 16:18',
    wrongMeanings: ['Building material only', 'Natural geology', 'Weapon for battle', 'Weight or burden'],
    category: 'nature',
    difficulty: 'medium'
  },
  {
    id: 'tree-of-life',
    symbol: 'Tree of Life',
    emoji: '🌳',
    correctMeaning: 'Christ / Eternal life / Access to God',
    christConnection: 'Christ on the cross (tree) gives eternal life',
    scriptureRef: 'Genesis 2:9; Revelation 2:7; Revelation 22:2',
    wrongMeanings: ['Just a nice tree in Eden', 'Symbol of nature', 'Fruit for eating', 'Shade provider'],
    category: 'nature',
    difficulty: 'medium'
  },
  {
    id: 'vine',
    symbol: 'Vine',
    emoji: '🍇',
    correctMeaning: 'Christ as source of life / Abiding relationship',
    christConnection: 'John 15:5 - "I am the vine, you are the branches"',
    scriptureRef: 'John 15:1-8; Isaiah 5:1-7',
    wrongMeanings: ['Wine production', 'Agricultural plant', 'Climbing decoration', 'Fruit source only'],
    category: 'nature',
    difficulty: 'easy'
  },
  // Animals
  {
    id: 'lion',
    symbol: 'Lion',
    emoji: '🦁',
    correctMeaning: 'Christ as King / Majesty / Judah tribe',
    christConnection: 'Revelation 5:5 - "the Lion of the tribe of Judah"',
    scriptureRef: 'Genesis 49:9; Revelation 5:5',
    wrongMeanings: ['Danger and fear', 'Wild animal', 'African wildlife', 'Power without grace'],
    category: 'animals',
    difficulty: 'easy'
  },
  {
    id: 'serpent-bronze',
    symbol: 'Bronze Serpent',
    emoji: '🐍',
    correctMeaning: 'Christ bearing sin on the cross / Look and live',
    christConnection: 'John 3:14 - "As Moses lifted up the serpent... so must the Son of Man be lifted up"',
    scriptureRef: 'Numbers 21:8-9; John 3:14-15',
    wrongMeanings: ['Evil or Satan', 'Temptation', 'Medical symbol only', 'Curse without cure'],
    category: 'animals',
    difficulty: 'hard'
  },
  {
    id: 'dove',
    symbol: 'Dove',
    emoji: '🕊️',
    correctMeaning: 'Holy Spirit / Peace / Purity',
    christConnection: 'The Spirit descended on Jesus like a dove (Matthew 3:16)',
    scriptureRef: 'Genesis 8:8-12; Matthew 3:16; John 1:32',
    wrongMeanings: ['Just a bird', 'Peace symbol only', 'Sacrifice animal', 'Love symbol'],
    category: 'animals',
    difficulty: 'easy'
  },
  {
    id: 'eagle',
    symbol: 'Eagle',
    emoji: '🦅',
    correctMeaning: "God's protection / Renewal / Waiting on the Lord",
    christConnection: 'Those who wait on the Lord shall mount up with wings like eagles (Isaiah 40:31)',
    scriptureRef: 'Exodus 19:4; Isaiah 40:31; Revelation 4:7',
    wrongMeanings: ['American patriotism', 'Just a bird of prey', 'Speed only', 'National symbol'],
    category: 'animals',
    difficulty: 'medium'
  },
  // Numbers
  {
    id: 'seven',
    symbol: 'Number 7',
    emoji: '7️⃣',
    correctMeaning: 'Completion / Perfection / Divine fullness',
    christConnection: 'Seven Spirits of God (Revelation 3:1), Seven churches, Seven seals',
    scriptureRef: 'Genesis 2:2-3; Revelation 1:4; Matthew 18:22',
    wrongMeanings: ['Lucky number', 'Days of week only', 'Random favorite number', 'Superstition'],
    category: 'numbers',
    difficulty: 'easy'
  },
  {
    id: 'twelve',
    symbol: 'Number 12',
    emoji: '🔢',
    correctMeaning: "Governmental perfection / God's complete authority",
    christConnection: '12 apostles chosen by Christ to govern the church',
    scriptureRef: 'Genesis 49:28; Matthew 10:1; Revelation 21:12-14',
    wrongMeanings: ['Months of year only', 'Random number', 'Dozen eggs', 'Clock hours'],
    category: 'numbers',
    difficulty: 'medium'
  },
  {
    id: 'forty',
    symbol: 'Number 40',
    emoji: '4️⃣0️⃣',
    correctMeaning: 'Testing / Trial / Probation period',
    christConnection: 'Jesus fasted 40 days and was tempted (Matthew 4:2)',
    scriptureRef: 'Genesis 7:12; Exodus 24:18; Matthew 4:2',
    wrongMeanings: ['Middle age', 'Random time period', 'Round number', 'Approximate guess'],
    category: 'numbers',
    difficulty: 'medium'
  },
  // Colors
  {
    id: 'white',
    symbol: 'White',
    emoji: '⬜',
    correctMeaning: 'Purity / Righteousness / Victory',
    christConnection: 'Christ gives us white robes of His righteousness (Revelation 3:5)',
    scriptureRef: 'Revelation 7:14; Isaiah 1:18; Revelation 19:8',
    wrongMeanings: ['Just a color', 'Cleanliness only', 'Winter/snow', 'Blank or empty'],
    category: 'colors',
    difficulty: 'easy'
  },
  {
    id: 'purple',
    symbol: 'Purple/Scarlet',
    emoji: '🟣',
    correctMeaning: 'Royalty / Kingship / Wealth',
    christConnection: 'They clothed Jesus in purple, mocking His kingship (Mark 15:17)',
    scriptureRef: 'Exodus 25:4; Mark 15:17; Revelation 17:4',
    wrongMeanings: ['Just a pretty color', 'Fashion choice', 'Dye industry', 'Feminine color'],
    category: 'colors',
    difficulty: 'medium'
  },
  {
    id: 'blue',
    symbol: 'Blue',
    emoji: '🔵',
    correctMeaning: 'Heaven / Law of God / Divine origin',
    christConnection: 'Blue in the tabernacle pointed to heaven where Christ intercedes',
    scriptureRef: 'Exodus 24:10; Numbers 15:38-40; Ezekiel 1:26',
    wrongMeanings: ['Sky color only', 'Ocean color', 'Sadness', 'Cool temperature'],
    category: 'colors',
    difficulty: 'hard'
  },
  {
    id: 'gold',
    symbol: 'Gold',
    emoji: '🟡',
    correctMeaning: 'Divinity / Divine nature / Tested faith',
    christConnection: "Gold in sanctuary represented Christ's divine nature",
    scriptureRef: 'Exodus 25:11; 1 Peter 1:7; Revelation 3:18',
    wrongMeanings: ['Just wealth/money', 'Jewelry metal', 'Trade currency', 'Yellow color'],
    category: 'colors',
    difficulty: 'medium'
  },
  // More Sanctuary
  {
    id: 'blood',
    symbol: 'Blood',
    emoji: '🩸',
    correctMeaning: 'Life / Atonement / Covenant',
    christConnection: 'Without shedding of blood there is no remission (Hebrews 9:22)',
    scriptureRef: 'Leviticus 17:11; Hebrews 9:22; 1 John 1:7',
    wrongMeanings: ['Just biological fluid', 'Violence', 'Death only', 'Medical concern'],
    category: 'sanctuary',
    difficulty: 'easy'
  },
  {
    id: 'high-priest',
    symbol: 'High Priest',
    emoji: '👳',
    correctMeaning: 'Christ as our Mediator / Intercessor',
    christConnection: 'We have a great High Priest... Jesus the Son of God (Hebrews 4:14)',
    scriptureRef: 'Leviticus 16; Hebrews 4:14-16; Hebrews 7:26-27',
    wrongMeanings: ['Religious leader only', 'Temple worker', 'Jewish clergy', 'Old Testament figure'],
    category: 'sanctuary',
    difficulty: 'medium'
  },
  {
    id: 'manna',
    symbol: 'Manna',
    emoji: '✨',
    correctMeaning: 'Christ as bread from heaven / Daily dependence on God',
    christConnection: 'I am the bread of life... bread from heaven (John 6:48-51)',
    scriptureRef: 'Exodus 16:14-15; John 6:31-35; Revelation 2:17',
    wrongMeanings: ['Just wilderness food', 'Miracle bread only', 'Jewish history', 'Survival food'],
    category: 'sanctuary',
    difficulty: 'medium'
  },
  {
    id: 'passover',
    symbol: 'Passover',
    emoji: '🚪',
    correctMeaning: "Christ's sacrifice / Deliverance from judgment",
    christConnection: 'Christ our Passover has been sacrificed (1 Corinthians 5:7)',
    scriptureRef: 'Exodus 12:1-14; 1 Corinthians 5:7; John 1:29',
    wrongMeanings: ['Jewish holiday only', 'Historical event', 'Family dinner', 'Cultural tradition'],
    category: 'sanctuary',
    difficulty: 'easy'
  }
];

const SymbolDecoder: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    lives: 3,
    totalRounds: 10,
    answeredCorrect: 0,
    difficulty: 'mixed',
    gameMode: 'match',
    status: 'menu'
  });
  const [currentSymbol, setCurrentSymbol] = useState<Symbol | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [usedSymbols, setUsedSymbols] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Get symbols filtered by difficulty
  const getAvailableSymbols = useCallback(() => {
    return symbolDatabase.filter(s => {
      if (gameState.difficulty === 'mixed') return true;
      return s.difficulty === gameState.difficulty;
    }).filter(s => !usedSymbols.has(s.id));
  }, [gameState.difficulty, usedSymbols]);

  // Setup next round
  const setupRound = useCallback(() => {
    const available = getAvailableSymbols();
    if (available.length === 0 || gameState.currentRound >= gameState.totalRounds) {
      setGameState(prev => ({ ...prev, status: 'complete' }));
      return;
    }

    const symbol = available[Math.floor(Math.random() * available.length)];
    setCurrentSymbol(symbol);
    setUsedSymbols(prev => new Set([...prev, symbol.id]));

    // Create options: 1 correct + 3 wrong
    const wrongOptions = symbol.wrongMeanings.slice(0, 3);
    const allOptions = [symbol.correctMeaning, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);

    if (gameState.gameMode === 'rapid') {
      setTimeLeft(15);
      setTimerActive(true);
    }
  }, [getAvailableSymbols, gameState.currentRound, gameState.totalRounds, gameState.gameMode]);

  // Timer effect for rapid mode
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          handleAnswer('__timeout__');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null || !currentSymbol) return;

    setTimerActive(false);
    setSelectedAnswer(answer);

    const correct = answer === currentSymbol.correctMeaning;
    setIsCorrect(correct);

    if (correct) {
      const basePoints = gameState.difficulty === 'hard' ? 30 : gameState.difficulty === 'medium' ? 20 : 10;
      const streakBonus = gameState.streak >= 3 ? Math.floor(gameState.streak / 3) * 5 : 0;
      const timeBonus = gameState.gameMode === 'rapid' && timeLeft > 5 ? (timeLeft - 5) * 2 : 0;

      setGameState(prev => ({
        ...prev,
        score: prev.score + basePoints + streakBonus + timeBonus,
        streak: prev.streak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
        answeredCorrect: prev.answeredCorrect + 1,
        status: 'feedback'
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        streak: 0,
        status: prev.lives <= 1 ? 'complete' : 'feedback'
      }));
    }
  };

  // Continue to next round
  const continueGame = () => {
    if (gameState.lives <= 0) {
      setGameState(prev => ({ ...prev, status: 'complete' }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      status: 'playing'
    }));
  };

  // Effect to setup round when playing
  useEffect(() => {
    if (gameState.status === 'playing' && !currentSymbol) {
      setupRound();
    }
  }, [gameState.status, currentSymbol, setupRound]);

  // Effect to setup next round after continue
  useEffect(() => {
    if (gameState.status === 'playing' && selectedAnswer !== null) {
      setupRound();
    }
  }, [gameState.currentRound]);

  // Start game
  const startGame = (difficulty: 'easy' | 'medium' | 'hard' | 'mixed', mode: 'match' | 'rapid' | 'christ-focus') => {
    setGameState({
      currentRound: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      lives: 3,
      totalRounds: mode === 'rapid' ? 15 : 10,
      answeredCorrect: 0,
      difficulty,
      gameMode: mode,
      status: 'playing'
    });
    setUsedSymbols(new Set());
    setCurrentSymbol(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  // Complete game
  useEffect(() => {
    if (gameState.status === 'complete') {
      setHighScore(prev => Math.max(prev, gameState.score));
    }
  }, [gameState.status, gameState.score]);

  // Render menu
  if (gameState.status === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button onClick={() => navigate('/games')} variant="ghost" className="text-white/70 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('common.backToGames')}
          </Button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔣</div>
            <h1 className="text-4xl font-bold text-white mb-2">{t('games.symbolDecoder.title')}</h1>
            <p className="text-gray-400">{t('games.symbolDecoder.subtitle')}</p>
            {highScore > 0 && (
              <div className="mt-4 text-amber-400">
                <Trophy className="inline-block mr-2 h-5 w-5" />
                {t('games.symbolDecoder.highScore', { score: highScore })}
              </div>
            )}
          </div>

          <Card className="bg-gray-900/50 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">{t('games.common.howToPlay')}</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>{t('games.symbolDecoder.instructions.step1')}</p>
              <p>{t('games.symbolDecoder.instructions.step2')}</p>
              <p>{t('games.symbolDecoder.instructions.step3')}</p>
              <p>{t('games.symbolDecoder.instructions.step4')}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-center">{t('games.symbolDecoder.selectGameMode')}:</h3>

            <Button
              onClick={() => startGame('mixed', 'match')}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Target className="mr-3 h-6 w-6" />
              <div className="text-left">
                <div className="font-bold">{t('games.symbolDecoder.classicMatch')}</div>
                <div className="text-xs opacity-80">{t('games.symbolDecoder.classicMatchDesc')}</div>
              </div>
            </Button>

            <Button
              onClick={() => startGame('mixed', 'rapid')}
              className="w-full py-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Timer className="mr-3 h-6 w-6" />
              <div className="text-left">
                <div className="font-bold">{t('games.symbolDecoder.rapidFire')}</div>
                <div className="text-xs opacity-80">{t('games.symbolDecoder.rapidFireDesc')}</div>
              </div>
            </Button>

            <Button
              onClick={() => startGame('mixed', 'christ-focus')}
              className="w-full py-6 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              <div className="text-left">
                <div className="font-bold">{t('games.symbolDecoder.christFocus')}</div>
                <div className="text-xs opacity-80">{t('games.symbolDecoder.christFocusDesc')}</div>
              </div>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <Button
              onClick={() => startGame('easy', 'match')}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600/20"
            >
              {t('games.common.easy')}
            </Button>
            <Button
              onClick={() => startGame('medium', 'match')}
              variant="outline"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
            >
              {t('games.common.medium')}
            </Button>
            <Button
              onClick={() => startGame('hard', 'match')}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600/20"
            >
              {t('games.common.hard')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render game over
  if (gameState.status === 'complete') {
    const accuracy = gameState.currentRound > 0
      ? Math.round((gameState.answeredCorrect / gameState.currentRound) * 100)
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {gameState.lives > 0 ? '🏆' : '💔'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {gameState.lives > 0 ? t('games.symbolDecoder.challengeComplete') : t('games.common.gameOver')}
            </h2>

            <Card className="bg-gray-900/50 border-gray-700 my-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-4xl font-bold text-amber-400">{gameState.score}</div>
                    <div className="text-gray-400 text-sm">{t('games.common.score')}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-400">{accuracy}%</div>
                    <div className="text-gray-400 text-sm">{t('games.symbolDecoder.accuracy')}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-orange-400">{gameState.bestStreak}</div>
                    <div className="text-gray-400 text-sm">{t('games.common.bestStreak')}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-400">{gameState.answeredCorrect}</div>
                    <div className="text-gray-400 text-sm">{t('games.common.correct')}</div>
                  </div>
                </div>

                {gameState.score >= highScore && gameState.score > 0 && (
                  <div className="mt-4 text-amber-400 font-bold">
                    <Trophy className="inline-block mr-2 h-5 w-5" />
                    {t('games.symbolDecoder.newHighScore')}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={() => startGame(gameState.difficulty, gameState.gameMode)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('games.common.playAgain')}
              </Button>
              <Button
                onClick={() => setGameState(prev => ({ ...prev, status: 'menu' }))}
                variant="outline"
                className="w-full border-gray-600 text-gray-300"
              >
                {t('games.common.backToMenu')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render game/feedback
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      <Navigation />
      <div className="container mx-auto px-4 py-4 max-w-lg">
        {/* Header Stats */}
        <div className="flex justify-between items-center mb-4 text-white">
          <Button onClick={() => setGameState(prev => ({ ...prev, status: 'menu' }))} variant="ghost" size="sm" className="text-gray-400">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="font-bold">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-400" />
              <span>{'❤️'.repeat(gameState.lives)}{'🖤'.repeat(3 - gameState.lives)}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>{t('games.symbolDecoder.roundOf', { current: gameState.currentRound + 1, total: gameState.totalRounds })}</span>
            {gameState.streak >= 3 && (
              <span className="text-orange-400">{t('games.symbolDecoder.streakDisplay', { streak: gameState.streak })}</span>
            )}
          </div>
          <Progress value={(gameState.currentRound / gameState.totalRounds) * 100} className="h-2" />
        </div>

        {/* Timer for rapid mode */}
        {gameState.gameMode === 'rapid' && timerActive && (
          <div className={`text-center mb-4 text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            ⏱️ {timeLeft}s
          </div>
        )}

        {currentSymbol && (
          <>
            {/* Symbol Display */}
            <Card className="bg-gray-900/70 border-gray-700 mb-4">
              <CardContent className="pt-6 text-center">
                <div className="text-6xl mb-3">{currentSymbol.emoji}</div>
                <h2 className="text-2xl font-bold text-white mb-1">{currentSymbol.symbol}</h2>
                <div className="text-gray-400 text-sm capitalize">
                  {currentSymbol.category} • {currentSymbol.difficulty}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-3 mb-4">
              {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentSymbol.correctMeaning;
                const showResult = selectedAnswer !== null;

                let buttonClass = 'w-full p-4 text-left rounded-lg border transition-all ';
                if (showResult) {
                  if (isCorrectOption) {
                    buttonClass += 'bg-green-900/50 border-green-500 text-green-200';
                  } else if (isSelected) {
                    buttonClass += 'bg-red-900/50 border-red-500 text-red-200';
                  } else {
                    buttonClass += 'bg-gray-800/50 border-gray-700 text-gray-500';
                  }
                } else {
                  buttonClass += 'bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:border-gray-500';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={buttonClass}
                  >
                    <div className="flex items-start gap-3">
                      {showResult && (
                        isCorrectOption ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : isSelected ? (
                          <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="h-5 w-5 flex-shrink-0" />
                        )
                      )}
                      <span className="text-sm leading-relaxed">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback Panel */}
            {gameState.status === 'feedback' && (
              <Card className={`mb-4 ${isCorrect ? 'bg-green-900/30 border-green-600' : 'bg-red-900/30 border-red-600'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <span className="font-bold text-green-400">{t('games.common.correct')}!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-400" />
                        <span className="font-bold text-red-400">{t('games.symbolDecoder.notQuite')}</span>
                      </>
                    )}
                  </div>

                  {(gameState.gameMode === 'christ-focus' || !isCorrect) && (
                    <div className="text-sm text-gray-300 space-y-2">
                      <p><strong className="text-amber-400">{t('games.symbolDecoder.christConnection')}:</strong></p>
                      <p className="text-gray-400">{currentSymbol.christConnection}</p>
                      <p className="text-xs text-gray-500">📖 {currentSymbol.scriptureRef}</p>
                    </div>
                  )}

                  <Button
                    onClick={continueGame}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {gameState.currentRound + 1 >= gameState.totalRounds || gameState.lives <= 0
                      ? t('games.symbolDecoder.seeResults')
                      : t('games.symbolDecoder.continue')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
      <FloatingGameChat gameType="symbol-decoder" />
    </div>
  );
};

export default SymbolDecoder;
