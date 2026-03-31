import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WifiOff, Wifi, Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const particleArray = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(particleArray);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Speed up splash - complete in ~1.5 seconds instead of ~2.5
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 200); // Faster exit
          return 100;
        }
        return prev + 5; // Faster progress
      });
    }, 25); // Faster tick

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic gradient background */}
      <motion.div
        animate={{
          background: [
            'linear-gradient(135deg, hsl(280, 70%, 30%) 0%, hsl(280, 60%, 40%) 50%, hsl(45, 80%, 50%) 100%)',
            'linear-gradient(135deg, hsl(280, 60%, 40%) 0%, hsl(45, 80%, 50%) 50%, hsl(280, 70%, 30%) 100%)',
            'linear-gradient(135deg, hsl(280, 70%, 30%) 0%, hsl(280, 60%, 40%) 50%, hsl(45, 80%, 50%) 100%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
      />

      {/* Floating sparkle particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0, x: `${particle.x}%`, y: `${particle.y}%` }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [`${particle.y}%`, `${particle.y - 20}%`],
            }}
            transition={{
              duration: 4 + particle.delay,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
            className="absolute"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
          </motion.div>
        ))}
      </div>

      {/* Rotating divine light rays */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, 
            transparent 0deg, 
            rgba(255, 215, 0, 0.15) 45deg, 
            transparent 90deg,
            rgba(255, 215, 0, 0.15) 135deg,
            transparent 180deg,
            rgba(255, 215, 0, 0.15) 225deg,
            transparent 270deg,
            rgba(255, 215, 0, 0.15) 315deg,
            transparent 360deg
          )`,
        }}
      />

      <div className="relative z-10 text-center space-y-8 px-4 max-w-md">
        {/* Animated Palace Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          className="relative inline-block"
        >
          {/* Dynamic pulsing glow */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-amber-400/40 blur-3xl"
          />
          
          {/* Palace structure with 3D effect */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotateY: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-32 h-32"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Main tower */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-t-lg shadow-2xl">
              {/* Glowing windows with individual animations */}
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 w-3 h-4 bg-purple-300 rounded-sm shadow-lg shadow-purple-400/50"
              />
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 w-4 h-5 bg-blue-300 rounded-sm shadow-lg shadow-blue-400/50"
              />
            </div>
            
            {/* Spire */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-t from-amber-500 to-amber-300">
              <div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0" 
                style={{ 
                  borderLeft: '24px solid transparent',
                  borderRight: '24px solid transparent',
                  borderBottom: '32px solid hsl(45, 90%, 60%)'
                }}
              />
            </div>
            
            {/* Animated cross on top */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-2 left-1/2 -translate-x-1/2"
            >
              <div className="w-1.5 h-8 bg-amber-100 rounded-full shadow-lg" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-amber-100 rounded-full shadow-lg" />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-amber-200 blur-sm"
              />
            </motion.div>

            {/* Open Bible with 3D rotation */}
            <motion.div
              animate={{
                rotateX: [0, 15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-white rounded-sm shadow-2xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 flex">
                <div className="flex-1 border-r border-gray-300 bg-gradient-to-r from-gray-50 to-white" />
                <div className="flex-1 bg-gradient-to-l from-gray-50 to-white" />
              </div>
              {/* Glowing text lines */}
              <div className="absolute inset-2 space-y-1">
                <motion.div
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="h-px bg-gray-400"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* App title with shimmer effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative"
        >
          <motion.h1
            animate={{
              textShadow: [
                '0 0 20px rgba(251, 191, 36, 0.5)',
                '0 0 40px rgba(251, 191, 36, 0.8)',
                '0 0 20px rgba(251, 191, 36, 0.5)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl font-bold text-amber-50 mb-2"
          >
            Phototheology<span className="text-[0.65em] font-semibold tracking-wide px-2 py-0.5 rounded ml-1 align-middle inline-block" style={{ background: "rgba(255, 255, 255, 0.12)", border: "1px solid rgba(255, 255, 255, 0.25)", color: "#e8e8e8", fontFamily: "'Inter', sans-serif", verticalAlign: "middle", position: "relative", top: "-0.1em" }}>OS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-amber-100/80 font-light tracking-widest uppercase"
          >
            The Art of Seeing Christ in All Things.
          </motion.p>
        </motion.div>

        {/* Enhanced progress bar with shimmer */}
        <div className="w-72 mx-auto space-y-4">
          <div className="relative h-3 bg-purple-950/40 rounded-full overflow-hidden backdrop-blur-md border border-amber-400/20">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-full relative overflow-hidden"
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
            </motion.div>
            
            {/* Glow effect */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              style={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-full bg-amber-300/30 blur-xl"
            />
          </div>
          
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-amber-50/90 text-base font-medium"
          >
            Preparing your sanctuary... {Math.round(progress)}%
          </motion.p>
        </div>

        {/* Connection status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-lg border border-white/30 shadow-xl"
        >
          {isOnline ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wifi className="w-5 h-5 text-green-300" />
              </motion.div>
              <span className="text-sm text-green-200 font-semibold">Connected</span>
            </>
          ) : (
            <>
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <WifiOff className="w-5 h-5 text-amber-300" />
              </motion.div>
              <span className="text-sm text-amber-200 font-semibold">Offline Mode</span>
            </>
          )}
        </motion.div>

        {!isOnline && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-amber-100/80 text-sm max-w-xs mx-auto px-4"
          >
            Your saved content remains accessible offline
          </motion.p>
        )}
      </div>

      {/* Corner sparkles */}
      {[
        { top: '10%', left: '15%' },
        { top: '20%', right: '20%' },
        { bottom: '15%', left: '10%' },
        { bottom: '25%', right: '15%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
          className="absolute"
          style={pos}
        >
          <Sparkles className="w-6 h-6 text-amber-200" />
        </motion.div>
      ))}
    </motion.div>
  );
};
