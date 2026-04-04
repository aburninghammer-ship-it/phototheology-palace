import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Sparkles, CheckCircle2, LogIn, Castle, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroCardsDisplay from "@/assets/branding/hero-cards-display.png";
import { UserCountBadge } from "@/components/UserCountBadge";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";
import { getVariant, trackABEvent, HERO_CTA_EXPERIMENT } from "@/utils/abTesting";
const socialProof = [
  "Thousands taught over 20 years",
  "Discover Christ in every chapter", 
  "Loved by pastors & teachers",
];

export const PunchyHero = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const ctaVariant = useMemo(() => getVariant(HERO_CTA_EXPERIMENT), []);

  const ctaIcon = ctaVariant.props?.icon === "sparkles" ? <Sparkles className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> 
    : ctaVariant.props?.icon === "castle" ? <Castle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
    : ctaVariant.props?.icon === "compass" ? <Compass className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
    : <LogIn className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />;

  const handleCtaClick = () => {
    trackABEvent(HERO_CTA_EXPERIMENT.name, ctaVariant.id, "click");
    navigate("/auth");
  };

  const scrollToDemo = () => {
    const demoSection = document.getElementById("interactive-demo");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[75vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-safe">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 text-center py-4 sm:py-0">
        {/* Main Title - Glass Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 sm:mb-4"
        >
          {/* Glass container with gradient border glow */}
          <div className="relative inline-block p-[2px] rounded-xl bg-gradient-to-r from-cyan-400 via-primary to-accent">
            <div className="relative px-6 sm:px-8 py-3 sm:py-4 rounded-[10px] bg-background/90 backdrop-blur-md">
              {/* Inner glow overlay */}
              <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
              {/* Floating orbs */}
              <div className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
              <div className="absolute bottom-2 left-4 w-1 h-1 rounded-full bg-yellow-400/50 animate-pulse delay-500" />
                <h2 className="relative font-display text-lg sm:text-xl md:text-2xl font-bold tracking-widest text-primary uppercase drop-shadow-[0_0_15px_hsl(var(--primary)/0.6)]">
                  Phototheology<span className="text-[0.65em] font-semibold tracking-wide px-1.5 py-0.5 rounded ml-1 align-middle inline-block" style={{ background: "rgba(255, 255, 255, 0.12)", border: "1px solid rgba(255, 255, 255, 0.25)", color: "#e8e8e8", fontFamily: "'Inter', sans-serif", verticalAlign: "middle", position: "relative", top: "-0.1em" }}>OS</span>
                </h2>
            </div>
          </div>
        </motion.div>

        {/* Badge - Glass Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-4 sm:mb-6"
        >
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-background/20 backdrop-blur-md border border-primary/30 text-xs sm:text-sm font-medium text-primary shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="whitespace-normal sm:whitespace-nowrap">Not another devotional • A complete Bible learning suite</span>
          </span>
        </motion.div>

        {/* Main Headline - Mobile-first, clearer */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-5 leading-tight sm:leading-[1.1] px-2"
        >
          {/* Mobile: Shorter, punchier headline */}
          <span className="sm:hidden">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Master
            </span>{" "}
            the Bible
          </span>
          {/* Desktop: Full headline */}
          <span className="hidden sm:inline">
            Finally{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              understand
            </span>{" "}
            the Bible
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              — and{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                remember it
              </span>
            </span>
          </span>
        </motion.h1>

        {/* Clear Subheadline - Mobile optimized */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6 px-4"
        >
          {/* Mobile: Ultra-short */}
          <span className="sm:hidden">
            A visual system to <span className="font-medium text-foreground">understand & remember</span> Scripture.
          </span>
          {/* Desktop: Full message */}
          <span className="hidden sm:block">
            A visual memory system that transforms how you study Scripture.
            <br />
            <span className="font-medium text-foreground">
              See connections. Build understanding. Never forget what you learned.
            </span>
          </span>
        </motion.p>

        {/* Social Proof Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4"
        >
          {socialProof.map((item, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className={`bg-background/80 backdrop-blur-sm border-border/50 px-3 py-1 ${i === 2 ? 'hidden sm:flex' : ''}`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
              {item}
            </Badge>
          ))}
        </motion.div>

        {/* User Count Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-4 sm:mb-6"
        >
          <UserCountBadge />
        </motion.div>

        {/* Hero Card Deck Image - Glass container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mb-6 sm:mb-8 px-2 sm:px-4"
        >
          {/* Gradient border glow wrapper */}
          <div className="relative p-[2px] sm:p-[3px] rounded-2xl bg-gradient-to-r from-green-400 via-cyan-400 to-primary max-w-[280px] sm:max-w-2xl md:max-w-4xl mx-auto shadow-[0_0_30px_rgba(34,211,238,0.3),0_0_60px_rgba(34,211,238,0.1)]">
            <div className="relative p-2 sm:p-5 md:p-6 rounded-[14px] bg-background/95 backdrop-blur-md overflow-hidden">
              {/* Inner gradient glow */}
              <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
              {/* Animated floating orbs */}
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-cyan-400/60 animate-pulse" />
              <div className="absolute bottom-6 right-8 w-1.5 h-1.5 rounded-full bg-yellow-400/60 animate-pulse delay-300" />
              <div className="absolute top-1/2 right-4 w-1 h-1 rounded-full bg-primary/60 animate-pulse delay-700" />
              <img 
                src={heroCardsDisplay} 
                alt="Phototheology Card Deck - 8 floors of Bible study principles" 
                className="relative w-full drop-shadow-2xl"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-3 sm:gap-4 px-3 sm:px-4"
        >
          {!loading && !user ? (
            <>
              {/* Signed-out: Sign In + Try Demo */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={handleCtaClick}
                  className="text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-7 gradient-palace shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-sm"
                >
                  {ctaIcon}
                  {ctaVariant.label}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToDemo}
                  className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-sm"
                >
                  Try a 5-Minute Study
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No signup required to try • Sign in to save progress
              </p>
            </>
          ) : (
            <>
              {/* Signed-in or loading: original CTA */}
              <Button
                size="lg"
                onClick={scrollToDemo}
                className="text-lg sm:text-xl md:text-2xl px-8 sm:px-12 md:px-14 py-6 sm:py-7 md:py-8 gradient-palace shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-sm"
              >
                Try a 5-Minute Study
                <ChevronRight className="ml-2 h-6 w-6 sm:h-7 sm:w-7" />
              </Button>
              <p className="text-sm text-muted-foreground">
                No signup required • See how it works instantly
              </p>
            </>
          )}
        </motion.div>

        {/* Secondary link - less prominent */}
        {!loading && !user && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="text-sm text-center mt-6 px-2"
          >
            <span 
              onClick={() => navigate("/auth?patreon=true")} 
              className="text-muted-foreground hover:text-primary cursor-pointer underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-primary transition-all"
            >
              Already a Patron? Connect here
            </span>
          </motion.p>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border/50 px-4"
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">8</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Palace Floors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">100+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Study Principles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">AI</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Powered Guide</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};