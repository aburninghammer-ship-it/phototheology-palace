import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, User, Flame, Sparkles, BookOpen, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type StudyMode = 
  | "solo_study" 
  | "jeeves_judge" 
  | "daily_challenge" 
  | "sermon_builder" 
  | "freestyle";

interface Props {
  onSelectMode: (mode: StudyMode) => void;
}

const studyModes = [
  {
    id: 'solo_study' as StudyMode,
    icon: BookOpen,
    title: 'Solo Study',
    description: 'Draw cards and build your own biblical insights',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]',
    badge: 'Beginner Friendly',
    badgeColor: 'bg-green-500/20 text-green-300 border-green-400/50',
  },
  {
    id: 'jeeves_judge' as StudyMode,
    icon: Bot,
    title: 'Jeeves Judge',
    description: 'Get AI feedback and scoring on your applications',
    gradient: 'from-purple-500 to-pink-500',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]',
    badge: 'Recommended',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
  },
  {
    id: 'daily_challenge' as StudyMode,
    icon: Flame,
    title: 'Daily Challenge',
    description: 'One card per day to build your streak',
    gradient: 'from-orange-500 to-red-500',
    glow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]',
    badge: 'Streak Building',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-400/50',
  },
  {
    id: 'freestyle' as StudyMode,
    icon: Sparkles,
    title: 'Freestyle',
    description: 'Rapid-fire card drawing for spontaneous insights',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    badge: 'Advanced',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
  },
  {
    id: 'sermon_builder' as StudyMode,
    icon: Trophy,
    title: 'Sermon Builder',
    description: 'Draw 5 cards to outline a message',
    gradient: 'from-indigo-500 to-violet-500',
    glow: 'shadow-[0_0_30px_rgba(99,102,241,0.4)]',
    badge: 'Teaching Tool',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50',
  },
];

export function StudyDeckModeSelector({ onSelectMode }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Study Mode</h2>
        <p className="text-muted-foreground">
          Each mode offers a unique way to engage with Phototheology principles
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {studyModes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`
                relative overflow-hidden cursor-pointer border-2
                bg-gradient-to-br ${mode.gradient} p-6 text-white
                hover:border-white/60 transition-all duration-300
                ${mode.glow} h-full
              `}
              onClick={() => onSelectMode(mode.id)}
            >
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <mode.icon className="h-12 w-12 drop-shadow-lg" />
                  </motion.div>
                  <Badge className={`${mode.badgeColor} border text-xs`}>
                    {mode.badge}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-1">{mode.title}</h3>
                  <p className="text-white/80 text-sm">{mode.description}</p>
                </div>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full blur-xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-tr-full blur-lg" />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Guide */}
      <Card variant="glass" className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                For Beginners
              </h4>
              <p className="text-muted-foreground">
                Start with <strong>Solo Study</strong> or <strong>Daily Challenge</strong> to learn the deck mechanics and principles at your own pace.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                For Growth
              </h4>
              <p className="text-muted-foreground">
                Use <strong>Jeeves Judge</strong> for feedback, then advance to <strong>Freestyle</strong> or <strong>Sermon Builder</strong> for mastery.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
