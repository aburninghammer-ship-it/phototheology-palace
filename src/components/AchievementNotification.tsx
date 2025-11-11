import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Trophy, Star, Award, Crown, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import Confetti from "react-confetti";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const iconMap: Record<string, any> = {
  "🏆": Trophy,
  "⭐": Star,
  "🎖️": Award,
  "👑": Crown,
  "🔥": Flame,
  "✨": Sparkles,
};

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (achievement) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      const autoClose = setTimeout(onClose, 6000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(autoClose);
      };
    }
  }, [achievement, onClose]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const IconComponent = iconMap[achievement?.icon || "🏆"] || Trophy;

  return (
    <AnimatePresence>
      {achievement && (
        <>
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
            />
          )}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              duration: 0.6
            }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <Card className="relative overflow-hidden border-2 border-primary/50 shadow-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10">
              {/* Animated background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 animate-pulse" />
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />

              <div className="relative p-6">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-start gap-4">
                  {/* Animated badge icon */}
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2 
                    }}
                    className="relative"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Sparkle effects */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          x: [0, (i - 1) * 20],
                          y: [0, -20],
                        }}
                        transition={{ 
                          duration: 1.5, 
                          delay: 0.5 + i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                        style={{
                          top: "50%",
                          left: "50%",
                        }}
                      >
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
                        🎉 Achievement Unlocked!
                      </h3>
                      <h4 className="text-lg font-semibold mb-1">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                    </motion.div>

                    {/* Points reward */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.5 
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30"
                    >
                      <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                        +{achievement.points} Points
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Bottom glow effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
