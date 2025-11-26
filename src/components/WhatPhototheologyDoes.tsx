import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Network, Brain } from "lucide-react";

const frames = [
  {
    icon: Building2,
    title: "Transform Your Study",
    description: "Turn books, chapters, and stories into visual rooms you can instantly recall.",
  },
  {
    icon: Network,
    title: "Reveal the Patterns",
    description: "See how prophecy, symbols, stories, and doctrines connect across Scripture.",
  },
  {
    icon: Brain,
    title: "Make It Memorable",
    description: "Never lose track of what you read—the Palace locks Scripture into long-term memory.",
  },
];

export const WhatPhototheologyDoes = () => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Phototheology Does
        </h2>
        
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-card border rounded-lg p-8 md:p-12 shadow-lg"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                {(() => {
                  const Icon = frames[currentFrame].icon;
                  return <Icon className="w-16 h-16 text-primary" />;
                })()}
                <h3 className="text-2xl md:text-3xl font-bold">
                  {frames[currentFrame].title}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {frames[currentFrame].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {frames.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFrame(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFrame
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to frame ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
