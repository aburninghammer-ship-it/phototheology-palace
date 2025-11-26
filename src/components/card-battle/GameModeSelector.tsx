import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bot, Users, Swords, Zap } from "lucide-react";
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
    description: 'Challenge another believer',
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
  return (
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
  );
}