import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sword, Shield, Timer, Zap, Trophy, Heart, RotateCcw, Play, AlertTriangle, CheckCircle2, XCircle, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";

// Combat scenarios - spiritual battles
const COMBAT_SCENARIOS = [
  {
    id: "pride-attack",
    enemy: "Spirit of Pride",
    enemyIcon: "👑",
    situation: "You receive public praise for your spiritual growth. Pride whispers: 'You've really made it. You're better than most Christians.'",
    correctWeapon: "Breastplate of Righteousness",
    correctFruit: "Humility",
    wrongChoices: ["Sword of the Spirit", "Shield of Faith"],
    explanation: "Pride attacks the heart - only the Breastplate of Righteousness guards against self-exaltation. Remember: 'God resists the proud but gives grace to the humble.'"
  },
  {
    id: "fear-assault",
    enemy: "Spirit of Fear",
    enemyIcon: "👻",
    situation: "You're asked to share your faith at work. Fear grips you: 'What if they mock you? What if you lose your job?'",
    correctWeapon: "Shield of Faith",
    correctFruit: "Courage",
    wrongChoices: ["Belt of Truth", "Gospel Shoes"],
    explanation: "Fear launches fiery darts - only the Shield of Faith can quench them. 'God has not given us the spirit of fear, but of power, love, and a sound mind.'"
  },
  {
    id: "lust-temptation",
    enemy: "Spirit of Lust",
    enemyIcon: "🔥",
    situation: "Alone at night, temptation presents itself. The enemy whispers: 'No one will ever know. Just this once.'",
    correctWeapon: "Sword of the Spirit",
    correctFruit: "Self-Control",
    wrongChoices: ["Helmet of Salvation", "Breastplate of Righteousness"],
    explanation: "Lust must be cut down immediately with the Word of God - the Sword of the Spirit. Jesus defeated temptation saying 'It is written...' Use Scripture as your weapon!"
  },
  {
    id: "doubt-whisper",
    enemy: "Spirit of Doubt",
    enemyIcon: "❓",
    situation: "After tragedy strikes, doubt whispers: 'If God loved you, He wouldn't let this happen. Maybe He doesn't exist at all.'",
    correctWeapon: "Helmet of Salvation",
    correctFruit: "Faith",
    wrongChoices: ["Gospel Shoes", "Belt of Truth"],
    explanation: "Doubt attacks the mind - the Helmet of Salvation protects your thoughts. Remember WHO you belong to and WHAT has been promised, regardless of circumstances."
  },
  {
    id: "deception-trap",
    enemy: "Spirit of Deception",
    enemyIcon: "🐍",
    situation: "A popular teaching sounds spiritual but contradicts Scripture. Others embrace it. The enemy suggests: 'Don't be so rigid. Truth evolves.'",
    correctWeapon: "Belt of Truth",
    correctFruit: "Discernment",
    wrongChoices: ["Shield of Faith", "Sword of the Spirit"],
    explanation: "Deception is defeated by the Belt of Truth - knowing and standing on absolute truth. 'Buy the truth and sell it not.' Without truth, all other armor fails."
  },
  {
    id: "unforgiveness-chain",
    enemy: "Spirit of Unforgiveness",
    enemyIcon: "⛓️",
    situation: "Someone who deeply hurt you asks for reconciliation. Bitterness rages: 'They don't deserve forgiveness. Make them pay.'",
    correctWeapon: "Gospel Shoes",
    correctFruit: "Love",
    wrongChoices: ["Breastplate of Righteousness", "Helmet of Salvation"],
    explanation: "The Gospel of Peace (Gospel Shoes) reminds us WE were forgiven much. To walk in peace, we must extend the same grace we received. Unforgiveness chains us, not them."
  },
  {
    id: "laziness-sloth",
    enemy: "Spirit of Sloth",
    enemyIcon: "🦥",
    situation: "Your Bible sits unopened for weeks. Prayer feels like a chore. The enemy comforts: 'Rest is good. You've earned a spiritual vacation.'",
    correctWeapon: "Sword of the Spirit",
    correctFruit: "Discipline",
    wrongChoices: ["Shield of Faith", "Helmet of Salvation"],
    explanation: "Spiritual laziness is defeated by engaging with the Word of God - the Sword. 'Faith comes by hearing, and hearing by the word of God.' No Word, no power."
  },
  {
    id: "anxiety-storm",
    enemy: "Spirit of Anxiety",
    enemyIcon: "🌪️",
    situation: "Tomorrow brings uncertainty. Your mind races with worst-case scenarios. Anxiety screams: 'You must control everything or disaster awaits!'",
    correctWeapon: "Shield of Faith",
    correctFruit: "Peace",
    wrongChoices: ["Sword of the Spirit", "Gospel Shoes"],
    explanation: "Anxiety launches countless fiery darts of 'what if.' The Shield of Faith quenches them all. 'Be anxious for nothing, but in everything by prayer... the peace of God will guard your heart.'"
  },
  {
    id: "envy-poison",
    enemy: "Spirit of Envy",
    enemyIcon: "💚",
    situation: "A fellow believer receives the blessing you've been praying for. Envy hisses: 'Why them and not you? God is playing favorites.'",
    correctWeapon: "Breastplate of Righteousness",
    correctFruit: "Contentment",
    wrongChoices: ["Belt of Truth", "Helmet of Salvation"],
    explanation: "Envy poisons the heart - the Breastplate protects it. True righteousness rejoices with those who rejoice. Your blessing is not diminished by theirs."
  },
  {
    id: "anger-volcano",
    enemy: "Spirit of Wrath",
    enemyIcon: "🌋",
    situation: "Someone cuts you off in traffic, then makes a rude gesture. Rage boils up. The enemy shouts: 'Teach them a lesson! They deserve it!'",
    correctWeapon: "Gospel Shoes",
    correctFruit: "Patience",
    wrongChoices: ["Sword of the Spirit", "Shield of Faith"],
    explanation: "Anger is defeated by walking in peace (Gospel Shoes). 'Be angry and sin not' - respond with the peace of the Gospel. Road rage has no place in a warrior's life."
  },
];

type BattlePhase = "ready" | "battle" | "result" | "summary";

interface BattleResult {
  scenario: typeof COMBAT_SCENARIOS[0];
  correct: boolean;
  timeBonus: number;
}

export const CombatArena = () => {
  const [phase, setPhase] = useState<BattlePhase>("ready");
  const [currentBattle, setCurrentBattle] = useState<typeof COMBAT_SCENARIOS[0] | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [health, setHealth] = useState(3);
  const [battlesCompleted, setBattlesCompleted] = useState(0);
  const [results, setResults] = useState<BattleResult[]>([]);
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [difficulty, setDifficulty] = useState<"normal" | "hard" | "legendary">("normal");

  const weapons = [
    { name: "Belt of Truth", icon: "📿" },
    { name: "Breastplate of Righteousness", icon: "🛡️" },
    { name: "Gospel Shoes", icon: "👟" },
    { name: "Shield of Faith", icon: "🛡️" },
    { name: "Helmet of Salvation", icon: "⛑️" },
    { name: "Sword of the Spirit", icon: "⚔️" },
  ];

  const getDifficultySettings = () => {
    switch (difficulty) {
      case "hard": return { time: 20, healthLoss: 1 };
      case "legendary": return { time: 12, healthLoss: 2 };
      default: return { time: 30, healthLoss: 1 };
    }
  };

  const startBattle = () => {
    const availableScenarios = COMBAT_SCENARIOS.filter(
      s => !results.some(r => r.scenario.id === s.id)
    );

    if (availableScenarios.length === 0) {
      // All scenarios completed - show summary
      setPhase("summary");
      return;
    }

    const randomScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    setCurrentBattle(randomScenario);
    setTimeLeft(getDifficultySettings().time);
    setSelectedWeapon(null);
    setShowResult(false);
    setPhase("battle");
  };

  const startNewSession = () => {
    setPhase("ready");
    setScore(0);
    setStreak(0);
    setHealth(3);
    setBattlesCompleted(0);
    setResults([]);
    setCurrentBattle(null);
  };

  // Timer countdown
  useEffect(() => {
    if (phase !== "battle" || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, showResult]);

  const handleTimeout = () => {
    if (!currentBattle) return;

    setShowResult(true);
    setHealth(h => Math.max(0, h - getDifficultySettings().healthLoss));
    setStreak(0);

    setResults(prev => [...prev, {
      scenario: currentBattle,
      correct: false,
      timeBonus: 0
    }]);

    toast.error("Time's up! The enemy struck while you hesitated.");
  };

  const handleWeaponSelect = (weaponName: string) => {
    if (showResult || !currentBattle) return;

    setSelectedWeapon(weaponName);
    const isCorrect = weaponName === currentBattle.correctWeapon;
    const timeBonus = Math.floor(timeLeft * (difficulty === "legendary" ? 3 : difficulty === "hard" ? 2 : 1));

    setShowResult(true);

    if (isCorrect) {
      const points = 100 + timeBonus + (streak * 10);
      setScore(s => s + points);
      setStreak(s => s + 1);

      if (streak >= 2) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      toast.success(`Victory! +${points} points`);
    } else {
      setHealth(h => Math.max(0, h - getDifficultySettings().healthLoss));
      setStreak(0);
      toast.error("Wrong weapon! The enemy struck.");
    }

    setResults(prev => [...prev, {
      scenario: currentBattle,
      correct: isCorrect,
      timeBonus: isCorrect ? timeBonus : 0
    }]);

    setBattlesCompleted(b => b + 1);
  };

  const continueAfterResult = () => {
    if (health <= 0) {
      setPhase("summary");
    } else {
      startBattle();
    }
  };

  // Ready Phase
  if (phase === "ready") {
    return (
      <Card variant="glass" className="border-primary/30">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl"
            >
              ⚔️
            </motion.div>
          </div>
          <CardTitle className="text-3xl">Combat Arena</CardTitle>
          <CardDescription className="text-lg">
            Face spiritual enemies and choose the right weapon to defeat them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Difficulty Selection */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-center">Select Difficulty</p>
            <div className="flex gap-2 justify-center">
              <Button
                variant={difficulty === "normal" ? "default" : "outline"}
                onClick={() => setDifficulty("normal")}
                className="flex-1"
              >
                <Shield className="w-4 h-4 mr-2" />
                Normal
              </Button>
              <Button
                variant={difficulty === "hard" ? "default" : "outline"}
                onClick={() => setDifficulty("hard")}
                className="flex-1"
              >
                <Sword className="w-4 h-4 mr-2" />
                Hard
              </Button>
              <Button
                variant={difficulty === "legendary" ? "default" : "outline"}
                onClick={() => setDifficulty("legendary")}
                className="flex-1"
              >
                <Flame className="w-4 h-4 mr-2" />
                Legendary
              </Button>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Rules of Engagement
            </h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Face spiritual warfare scenarios and choose the correct weapon</li>
              <li>• Timer adds pressure - faster answers earn bonus points</li>
              <li>• Build streaks for combo multipliers</li>
              <li>• You have 3 hearts - lose them all and the battle ends</li>
              <li>• Higher difficulty = less time, greater rewards</li>
            </ul>
          </div>

          <Button onClick={startBattle} className="w-full h-14 text-lg gradient-palace">
            <Play className="w-5 h-5 mr-2" />
            Enter Battle
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Battle Phase
  if (phase === "battle" && currentBattle) {
    return (
      <Card variant="glass" className="border-primary/30 overflow-hidden">
        {/* Battle Header */}
        <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 ${i < health ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              <Badge variant="secondary" className="text-base">
                <Zap className="w-4 h-4 mr-1" />
                {score}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={streak > 0 ? "default" : "secondary"} className="text-base">
                🔥 x{streak}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Timer */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Timer className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : ''}`} />
                Time Remaining
              </span>
              <span className={timeLeft <= 10 ? 'text-red-500 font-bold' : ''}>{timeLeft}s</span>
            </div>
            <Progress
              value={(timeLeft / getDifficultySettings().time) * 100}
              className={`h-2 ${timeLeft <= 10 ? 'bg-red-900' : ''}`}
            />
          </div>

          {/* Enemy */}
          <div className="text-center space-y-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-6xl"
            >
              {currentBattle.enemyIcon}
            </motion.div>
            <h3 className="text-xl font-bold text-red-500">{currentBattle.enemy}</h3>
          </div>

          {/* Situation */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm leading-relaxed">{currentBattle.situation}</p>
          </div>

          {/* Weapon Selection */}
          {!showResult ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-center">Choose Your Weapon:</p>
              <div className="grid grid-cols-2 gap-2">
                {weapons.map((weapon) => (
                  <Button
                    key={weapon.name}
                    variant="outline"
                    className="h-auto py-3 px-4 text-left justify-start hover:border-primary"
                    onClick={() => handleWeaponSelect(weapon.name)}
                  >
                    <span className="text-xl mr-2">{weapon.icon}</span>
                    <span className="text-sm">{weapon.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            /* Result */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className={`rounded-lg p-4 ${selectedWeapon === currentBattle.correctWeapon ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedWeapon === currentBattle.correctWeapon ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-bold">
                    {selectedWeapon === currentBattle.correctWeapon ? "Victory!" : "Defeat!"}
                  </span>
                </div>
                <p className="text-sm mb-2">
                  <span className="font-semibold">Correct weapon:</span> {currentBattle.correctWeapon}
                </p>
                <p className="text-sm text-muted-foreground">{currentBattle.explanation}</p>
              </div>

              <Button onClick={continueAfterResult} className="w-full">
                {health <= 0 ? "View Results" : "Next Battle"}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Summary Phase
  if (phase === "summary") {
    const correctAnswers = results.filter(r => r.correct).length;
    const accuracy = results.length > 0 ? Math.round((correctAnswers / results.length) * 100) : 0;

    return (
      <Card variant="glass" className="border-primary/30">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-2"
          >
            {accuracy >= 80 ? "🏆" : accuracy >= 50 ? "⚔️" : "📚"}
          </motion.div>
          <CardTitle className="text-2xl">
            {accuracy >= 80 ? "Legendary Warrior!" : accuracy >= 50 ? "Brave Soldier" : "Keep Training"}
          </CardTitle>
          <CardDescription>
            {health <= 0 ? "You fell in battle, but every defeat teaches us." : "All enemies have been faced!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-primary">{score}</p>
              <p className="text-xs text-muted-foreground">Final Score</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-500">{correctAnswers}/{results.length}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-500">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>

          {/* Battle Log */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Battle Log:</h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {results.map((result, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm p-2 rounded ${result.correct ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                >
                  {result.correct ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className="flex-1">{result.scenario.enemy}</span>
                  {result.correct && (
                    <Badge variant="secondary" className="text-xs">
                      +{100 + result.timeBonus}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button onClick={startNewSession} className="w-full gradient-palace">
            <RotateCcw className="w-4 h-4 mr-2" />
            Battle Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};
