import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Users, Swords, Zap, BookOpen } from "lucide-react";
import { GameMode } from "./PTCardBattle";

interface Props {
  onSelectMode: (mode: GameMode) => void;
}

const gameModes = [
  {
    id: 'user_vs_jeeves' as GameMode,
    icon: Bot,
    title: 'VS Jeeves',
    description: 'Test your skills against AI',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-[0_0_50px_rgba(59,130,246,0.5)]',
  },
  {
    id: 'user_vs_user' as GameMode,
    icon: Swords,
    title: 'VS Player',
    description: 'Challenge Another Phototheologist',
    gradient: 'from-purple-500 to-pink-500',
    glow: 'shadow-[0_0_50px_rgba(168,85,247,0.5)]',
  },
  {
    id: 'team_vs_team' as GameMode,
    icon: Users,
    title: 'Team Battle',
    description: 'Collaborate and compete',
    gradient: 'from-green-500 to-emerald-500',
    glow: 'shadow-[0_0_50px_rgba(34,197,94,0.5)]',
  },
  {
    id: 'jeeves_vs_jeeves' as GameMode,
    icon: Zap,
    title: 'AI Showdown',
    description: 'Watch AI masters duel',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-[0_0_50px_rgba(245,158,11,0.5)]',
  },
];

export function GameModeSelector({ onSelectMode }: Props) {
  const [showInstructions, setShowInstructions] = useState(true);
  
  return (
    <div className="space-y-6">
      {/* Game Instructions */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl border-amber-400/30">
        <CardContent className="pt-6">
          <button 
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-400" />
              <h3 className="font-bold text-white text-lg">How to Play</h3>
            </div>
            <span className="text-amber-400 text-xl">{showInstructions ? '▼' : '▶'}</span>
          </button>
          
          {showInstructions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-4 space-y-3 text-white/90 text-sm"
            >
              <div className="space-y-2">
                <p className="font-semibold text-amber-300">📊 Scoring System:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Base Points:</strong> 1-3 points for quality of interpretation</li>
                  <li><strong>Bonus +2:</strong> Cross-referencing other verses</li>
                  <li><strong>Bonus +2:</strong> Identifying typology (Christ-centered)</li>
                  <li><strong>Bonus +2:</strong> Practical application</li>
                  <li><strong>Maximum:</strong> 5 points per turn</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-amber-300">🎮 Gameplay:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Approved cards</strong> are removed from your hand + points earned</li>
                  <li><strong>Rejected cards</strong> stay in your hand - pick another or challenge</li>
                  <li><strong>Jeeves follows the same rules</strong> - his moves can also be rejected!</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-amber-300">🏆 Winning:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>First player to <strong>empty their hand wins</strong></li>
                  <li>Game ends when final card is approved</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-amber-300">⚔️ Challenge System:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Only available</strong> after Jeeves rejects your move</li>
                  <li><strong>If upheld:</strong> You get 10 points + card removed</li>
                  <li><strong>If denied:</strong> Card stays in hand, pick another</li>
                </ul>
              </div>

              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-400/30 mt-4">
                <p className="text-xs text-purple-200">
                  💡 <strong>Strategy Tip:</strong> Use cards that naturally amplify the story's themes. Show depth through cross-references and typology!
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid md:grid-cols-2 gap-6"
      >
      {gameModes.map((mode, index) => (
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={`
              relative overflow-hidden cursor-pointer border-2 border-white/20
              bg-gradient-to-br ${mode.gradient} p-8 text-white
              hover:border-white/40 transition-all duration-300
              ${mode.glow}
            `}
            onClick={() => onSelectMode(mode.id)}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-4"
              >
                <mode.icon className="h-16 w-16 drop-shadow-lg" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
              <p className="text-white/80">{mode.description}</p>
              
              {/* Decorative elements */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            </div>
          </Card>
        </motion.div>
      ))}
      </motion.div>
    </div>
  );
}