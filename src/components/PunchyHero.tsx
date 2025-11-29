import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const PunchyHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8">
            <Sparkles className="h-4 w-4" />
            Free forever • No credit card required
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]"
        >
          The Bible,{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            but unforgettable.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4"
        >
          Most people read Scripture and forget it by lunch.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-10"
        >
          Phototheology turns the Bible into a{" "}
          <span className="text-primary font-semibold">visual palace</span>
          —so you understand it, connect it, and{" "}
          <span className="text-accent font-semibold">actually remember it</span>.
        </motion.p>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => navigate(user ? "/palace" : "/auth")}
            className="text-xl px-10 py-7 gradient-palace shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
          >
            Start Free — Forever
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Join 1000's of Christians who finally understand what they study
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t border-border/50"
        >
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">5x</div>
            <div className="text-sm text-muted-foreground">Faster Learning</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-accent">8</div>
            <div className="text-sm text-muted-foreground">Palace Floors</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">∞</div>
            <div className="text-sm text-muted-foreground">Connections</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
