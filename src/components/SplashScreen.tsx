import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)"
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Divine light rays background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,215,0,0.3) 0%, transparent 70%)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated Palace Tower Icon */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)"
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Palace Icon */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Open Bible */}
              <motion.path
                d="M20 80 L60 70 L100 80 L100 90 L60 85 L20 90 Z"
                fill="url(#bibleGradient)"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              />
              
              {/* Palace Tower */}
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Tower base */}
                <rect x="40" y="40" width="40" height="40" rx="2" fill="url(#towerGradient)" />
                
                {/* Gothic arch window */}
                <path
                  d="M50 50 Q50 45 55 45 L65 45 Q70 45 70 50 L70 65 L50 65 Z"
                  fill="url(#glassGradient)"
                />
                
                {/* Cross on top */}
                <motion.g
                  animate={{
                    filter: [
                      "drop-shadow(0 0 10px rgba(255,215,0,0.8))",
                      "drop-shadow(0 0 20px rgba(255,215,0,1))",
                      "drop-shadow(0 0 10px rgba(255,215,0,0.8))"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <rect x="58" y="20" width="4" height="15" fill="#FFD700" />
                  <rect x="52" y="26" width="16" height="4" fill="#FFD700" />
                </motion.g>
              </motion.g>

              {/* Light rays */}
              <motion.g
                opacity={0.6}
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <path d="M60 75 L50 90" stroke="url(#rayGradient)" strokeWidth="2" />
                <path d="M60 75 L60 95" stroke="url(#rayGradient)" strokeWidth="2" />
                <path d="M60 75 L70 90" stroke="url(#rayGradient)" strokeWidth="2" />
              </motion.g>

              {/* Gradients */}
              <defs>
                <linearGradient id="bibleGradient" x1="20" y1="70" x2="100" y2="90">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8B4513" />
                </linearGradient>
                
                <linearGradient id="towerGradient" x1="40" y1="40" x2="80" y2="80">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
                
                <linearGradient id="glassGradient" x1="50" y1="45" x2="70" y2="65">
                  <stop offset="0%" stopColor="#E6E6FA" />
                  <stop offset="100%" stopColor="#9370DB" />
                </linearGradient>
                
                <linearGradient id="rayGradient" x1="60" y1="75" x2="60" y2="95">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>

        {/* App Name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
            Phototheology
          </h1>
          <p className="text-lg text-white/90 font-light tracking-widest">
            PALACE
          </p>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #FFD700 0%, #FFA500 100%)",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)"
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          className="text-white/70 text-sm tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Entering the Palace...
        </motion.p>
      </div>

      {/* Decorative stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};
