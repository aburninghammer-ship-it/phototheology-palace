import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';
import { BookOpen, Castle, ChevronRight, AlertTriangle, Heart, Brain, Sword, ArrowLeft, X, Layers, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useGatehouseStatus } from '@/hooks/useGatehouseStatus';
import { useChangeSpine } from '@/hooks/useChangeSpine';
import { useEventTracking } from '@/hooks/useEventTracking';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { UserCountBadge } from '@/components/UserCountBadge';
import { Headphones } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';

type ViewState = 'choice' | 'appeal' | 'exit';

const Gatehouse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { hasEnteredPalace, isLoading } = useGatehouseStatus();
  const { markOrientationComplete, advanceGuidedPath } = useChangeSpine();
  const { trackCheckoutCompleted } = useEventTracking();
  const [selectedPath, setSelectedPath] = useState<'surface' | 'palace' | null>(null);
  const [viewState, setViewState] = useState<ViewState>('choice');
  const { t } = useTranslation();

  // Handle trial success redirect from Stripe checkout
  useEffect(() => {
    const trialStatus = searchParams.get('trial');
    if (trialStatus === 'success') {
      // Track checkout completion - STEP 3 of checkout funnel (SUCCESS!)
      trackCheckoutCompleted('premium', 'monthly', 7);

      // Celebration animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#9b87f5', '#7E69AB', '#FFD700', '#FFA500', '#FF6B6B'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#9b87f5', '#7E69AB', '#FFD700', '#FFA500', '#FF6B6B'],
        });
      }, 250);

      toast.success("🎉 " + t('gatehouse.trialStarted'));

      // Clean up URL
      navigate('/gatehouse', { replace: true });
    }
  }, [searchParams, navigate]);

  // Show loading state while checking user status to prevent flash of wrong content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="text-muted-foreground">{t('gatehouse.loading')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSurfaceChoice = () => {
    setViewState('appeal');
  };

  const handleFinalRefuse = () => {
    setViewState('exit');
  };

  const handlePalaceChoice = async () => {
    // Mark orientation complete in Change Spine when entering palace
    await markOrientationComplete();
    await advanceGuidedPath(); // Advance from step 0 to step 1

    if (user) {
      navigate('/antechamber');
    } else {
      navigate('/auth?redirect=/antechamber');
    }
  };

  // Appeal View - Why Surface Study Falls Short
  if (viewState === 'appeal') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-12 pt-24 md:pt-28 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                {t('gatehouse.beforeYouGo')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('gatehouse.considerCost')}
              </p>
            </div>

            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-center">{t('gatehouse.whySurfaceFallsShort')}</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{t('gatehouse.missArchitecture')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('gatehouse.missArchitectureDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{t('gatehouse.stayDependent')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('gatehouse.stayDependentDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{t('gatehouse.cannotTeach')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('gatehouse.cannotTeachVerse')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{t('gatehouse.missChrist')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('gatehouse.missChristDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 mb-8 border-amber-500/30 bg-amber-500/5">
              <h2 className="text-xl font-semibold mb-4 text-center">{t('gatehouse.oneMoreInvitation')}</h2>
              <p className="text-muted-foreground mb-4 text-center">
                {t('gatehouse.whatIfLearn')}
              </p>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {t('gatehouse.palaceNotSmarter')}
              </p>
              <blockquote className="border-l-2 border-amber-500/50 pl-4 italic text-muted-foreground text-center">
                {t('gatehouse.studyToShew')}
                <footer className="mt-2 text-xs not-italic">{t('gatehouse.timothy')}</footer>
              </blockquote>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleFinalRefuse}
                className="px-6"
              >
                {t('gatehouse.notForMe')}
              </Button>
              <Button
                size="lg"
                onClick={handlePalaceChoice}
                className="px-6 bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <Castle className="mr-2 h-5 w-5" />
                {t('gatehouse.wantDeeperStudy')}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              <button
                onClick={() => setViewState('choice')}
                className="hover:underline"
              >
                {t('gatehouse.returnToChoices')}
              </button>
            </p>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  // Graceful Exit View
  if (viewState === 'exit') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-12 pt-24 md:pt-28 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                {t('gatehouse.thankYou')}
              </h1>
            </div>

            <Card className="p-8 mb-8 text-left">
              <p className="text-lg text-muted-foreground mb-6">
                {t('gatehouse.bibleStudiedLevels')}
              </p>

              <p className="text-muted-foreground mb-6">
                {t('gatehouse.builtForDifferent')}<span className="text-foreground font-medium">{t('gatehouse.trainingWord')}</span>{t('gatehouse.notJustReading')}
              </p>

              <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground mb-6">
                {t('gatehouse.hebrewsQuote')}
                <footer className="mt-2 text-xs not-italic">{t('gatehouse.hebrewsRef')}</footer>
              </blockquote>

              <p className="text-muted-foreground">
                {t('gatehouse.feelThePull')}
              </p>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setViewState('appeal')}
                className="px-6"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t('gatehouse.letMeReconsider')}
              </Button>
              <Button
                size="lg"
                onClick={handlePalaceChoice}
                className="px-6 bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <Castle className="mr-2 h-5 w-5" />
                {t('gatehouse.enterPalaceInstead')}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              {t('gatehouse.blessYourJourney')}
            </p>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  // Returning user view - full cards with "Select to Enter"
  if (hasEnteredPalace) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1 flex flex-col items-center px-4 py-12 pt-24 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-[0.04em] uppercase"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#d4a017",
                textShadow: "0 0 20px rgba(212, 160, 23, 0.3), 0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Phototheology<span className="text-[0.65em] font-semibold tracking-wide px-2 py-0.5 rounded ml-1 align-middle inline-block" style={{ background: "rgba(255, 255, 255, 0.12)", border: "1px solid rgba(255, 255, 255, 0.25)", color: "#e8e8e8", fontFamily: "'Inter', sans-serif", verticalAlign: "middle", position: "relative", top: "-0.1em" }}>OS</span>: <span style={{ color: "rgba(180, 220, 255, 0.85)" }}>Eden</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {t('gatehouse.theChoiceIsYours')}
            </h2>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => navigate("/palace/tour")}
                size="lg"
                className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Headphones className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                🎧 Take the Audio Tour
              </Button>
            </div>
          </motion.div>

          {/* Full Card Layout */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Surface Study Path - Blue Glass */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div
                className="absolute -inset-[2px] rounded-xl pointer-events-none"
                style={{
                  boxShadow: '0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(59,130,246,0.2)',
                  animation: 'glow-pulse 2s ease-in-out infinite',
                }}
              />
              <Card
                className="relative p-8 h-full cursor-pointer transition-all duration-500 overflow-hidden backdrop-blur-sm border border-blue-500/40 hover:border-blue-400/60"
                style={{
                  background: 'linear-gradient(145deg, rgba(30,58,138,0.15) 0%, rgba(30,64,175,0.08) 50%, rgba(59,130,246,0.05) 100%)',
                }}
                onClick={handleSurfaceChoice}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 via-blue-500/5 to-blue-900/20 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-300/10 via-blue-400/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_1px_rgba(147,197,253,0.3)] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <BookOpen className="h-6 w-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-semibold text-blue-100">{t('gatehouse.remainSurface')}</h2>
                  </div>

                  <div className="space-y-4 text-blue-200/80 text-sm leading-relaxed">
                    <p>{t('gatehouse.continueAsYouAre')}</p>
                    <p>
                      {t('gatehouse.stillReadBible')}<br />
                      {t('gatehouse.stillFindComfort')}<br />
                      {t('gatehouse.stillHearTruths')}
                    </p>
                    <p className="text-blue-300/60 italic">
                      {t('gatehouse.stayWhereRemain')}<br />
                      {t('gatehouse.movingVerse')}<br />
                      {t('gatehouse.neverSeeing')}
                    </p>
                    <p className="text-blue-400/70 font-medium mt-4">
                      {t('gatehouse.nothingWillChange')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Palace Path - Red Glass */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div
                className="absolute -inset-[2px] rounded-xl pointer-events-none"
                style={{
                  boxShadow: '0 0 40px rgba(239,68,68,0.6), 0 0 80px rgba(239,68,68,0.3), 0 0 120px rgba(239,68,68,0.15)',
                  animation: 'glow-pulse 2s ease-in-out infinite',
                }}
              />
              <Card
                className="relative p-8 h-full cursor-pointer transition-all duration-500 overflow-hidden backdrop-blur-sm border border-red-500/40 hover:border-red-500/60"
                style={{
                  background: 'linear-gradient(145deg, rgba(127,29,29,0.15) 0%, rgba(153,27,27,0.08) 50%, rgba(239,68,68,0.05) 100%)',
                }}
                onClick={() => navigate('/palace')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/15 via-red-500/5 to-red-900/20 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-300/10 via-red-400/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_1px_rgba(252,165,165,0.3)] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-red-500/20 border border-red-400/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                      <Castle className="h-6 w-6 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-semibold text-red-100">{t('gatehouse.enterPalace')}</h2>
                  </div>

                  <div className="space-y-4 text-red-200/80 text-sm leading-relaxed">
                    <p>{t('gatehouse.stepInside')}</p>
                    <p>
                      {t('gatehouse.bibleNotFlat')}<br />
                      {t('gatehouse.patternsEmerge')}<br />
                      {t('gatehouse.connectionsForm')}<br />
                      {t('gatehouse.speakAcrossTime')}
                    </p>
                    <p className="text-red-300/70 italic">
                      {t('gatehouse.notPassive')}<br />
                      {t('gatehouse.notEntertainment')}<br />
                      {t('gatehouse.notForHurried')}
                    </p>
                    <p className="text-red-400 font-medium mt-4">
                      {t('gatehouse.selectToEnter')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <UserCountBadge />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground mt-6 italic"
          >
            {t('gatehouse.palaceAwaits')}
          </motion.p>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="PhototheologyOS" description="PhototheologyOS — The Art of Seeing Christ in All Things. Biblical Intelligence. Master Scripture through the 8-floor Palace method." />
      <Navigation />

      <main className="container mx-auto px-4 py-12 pt-24 md:pt-28 max-w-4xl">
        {/* The Choice - Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {t('gatehouse.theChoice')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('gatehouse.standingAtThreshold')}
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            {t('gatehouse.whatYouDoNext')}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <UserCountBadge />
          </motion.div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => navigate("/palace/tour")}
              size="lg"
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Headphones className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              🎧 Take the Audio Tour
            </Button>
          </div>
        </motion.div>

        {/* The Two Paths - Glass Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Surface Study Path - Blue Glass */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Pulsating glow overlay */}
            <div
              className="absolute -inset-[2px] rounded-xl pointer-events-none"
              style={{
                boxShadow: '0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(59,130,246,0.2)',
                animation: 'glow-pulse 2s ease-in-out infinite',
              }}
            />
            <Card
              className={`relative p-8 h-full cursor-pointer transition-all duration-500 overflow-hidden backdrop-blur-sm ${
                selectedPath === 'surface'
                  ? 'border-2 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.4),inset_0_0_30px_rgba(59,130,246,0.1)]'
                  : 'border border-blue-500/40 hover:border-blue-400/60'
              }`}
              style={{
                background: 'linear-gradient(145deg, rgba(30,58,138,0.15) 0%, rgba(30,64,175,0.08) 50%, rgba(59,130,246,0.05) 100%)',
              }}
              onClick={() => setSelectedPath('surface')}
            >
              {/* Glass reflection effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 via-blue-500/5 to-blue-900/20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-300/10 via-blue-400/5 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
              {/* Glow edge */}
              <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_1px_rgba(147,197,253,0.3)] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-semibold text-blue-100">{t('gatehouse.remainSurface')}</h2>
                </div>

                <div className="space-y-4 text-blue-200/80 text-sm leading-relaxed">
                  <p>{t('gatehouse.continueAsYouAre')}</p>
                  <p>
                    {t('gatehouse.stillReadBible')}<br />
                    {t('gatehouse.stillFindComfort')}<br />
                    {t('gatehouse.stillHearTruths')}
                  </p>
                  <p className="text-blue-300/60 italic">
                    {t('gatehouse.stayWhereRemain')}<br />
                    {t('gatehouse.movingVerse')}<br />
                    {t('gatehouse.neverSeeing')}
                  </p>
                  <p className="text-blue-400/70 font-medium mt-4">
                    {t('gatehouse.nothingWillChange')}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Palace Path - Red Glass */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            {/* Pulsating glow overlay - stronger for returning users */}
            <div
              className="absolute -inset-[2px] rounded-xl pointer-events-none"
              style={{
                boxShadow: '0 0 30px rgba(239,68,68,0.4), 0 0 60px rgba(239,68,68,0.2)',
                animation: 'glow-pulse 2s ease-in-out infinite',
              }}
            />
            <Card
              className={`relative p-8 h-full cursor-pointer transition-all duration-500 overflow-hidden backdrop-blur-sm ${
                selectedPath === 'palace'
                  ? 'border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4),inset_0_0_30px_rgba(239,68,68,0.1)]'
                  : 'border border-red-500/40 hover:border-red-500/60'
              }`}
              style={{
                background: 'linear-gradient(145deg, rgba(127,29,29,0.15) 0%, rgba(153,27,27,0.08) 50%, rgba(239,68,68,0.05) 100%)',
              }}
              onClick={() => setSelectedPath('palace')}
            >
              {/* Glass reflection effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/15 via-red-500/5 to-red-900/20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-300/10 via-red-400/5 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none" />
              {/* Glow edge */}
              <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_1px_rgba(252,165,165,0.3)] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-red-500/20 border border-red-400/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <Castle className="h-6 w-6 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-semibold text-red-100">{t('gatehouse.enterPalace')}</h2>
                </div>

                <div className="space-y-4 text-red-200/80 text-sm leading-relaxed">
                  <p>{t('gatehouse.stepInside')}</p>
                  <p>
                    {t('gatehouse.bibleNotFlat')}<br />
                    {t('gatehouse.patternsEmerge')}<br />
                    {t('gatehouse.connectionsForm')}<br />
                    {t('gatehouse.speakAcrossTime')}
                  </p>
                  <p className="text-red-300/70 italic">
                    {t('gatehouse.notPassive')}<br />
                    {t('gatehouse.notEntertainment')}<br />
                    {t('gatehouse.notForHurried')}
                  </p>
                  <p className="text-red-400 font-medium mt-4">
                    {t('gatehouse.cannotUnsee')}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Understanding Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <Card className="p-8 border-muted/50 bg-card/50 backdrop-blur-sm">
            <h3 className="text-xl font-serif font-semibold mb-6 text-center">{t('gatehouse.understandClearly')}</h3>
            <div className="space-y-4 text-muted-foreground text-center max-w-2xl mx-auto">
              <p>
                {t('gatehouse.changeHowYouRead')}<br />
                {t('gatehouse.howYouThink')}<br />
                {t('gatehouse.howYouDiscern')}
              </p>
              <p className="text-foreground/80">
                {t('gatehouse.noPressure')}<br />
                {t('gatehouse.noShame')}
              </p>
              <p className="italic text-primary/80">
                {t('gatehouse.doorNotAlways')}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* The Final Choice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-serif font-semibold mb-8">{t('gatehouse.theChoiceIsYours')}</h3>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSurfaceChoice}
              className="px-8 py-6 text-base border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              {t('gatehouse.remainSurfaceStudent')}
            </Button>

            <span className="text-muted-foreground font-serif italic">{t('gatehouse.orWord')}</span>

            <Button
              size="lg"
              onClick={handlePalaceChoice}
              className="px-8 py-6 text-base bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            >
              <Castle className="mr-2 h-5 w-5" />
              {t('gatehouse.enterPalace')}
            </Button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-muted-foreground mt-8 italic"
          >
            {t('gatehouse.thingsWillChange')}
          </motion.p>
        </motion.div>

        {/* Training Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-12 border-t border-border"
        >
          <h3 className="text-xl font-serif font-semibold mb-2 text-center text-muted-foreground">
            {t('gatehouse.preferOffline')}
          </h3>
          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('gatehouse.downloadablePDF')}
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link to="/bible-prophecy-guide" className="group">
              <Card className="p-6 h-full border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">{t('gatehouse.genesisInDays')}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('gatehouse.genesisDesc')}
                </p>
                <p className="text-lg font-bold text-primary">$9</p>
              </Card>
            </Link>

            <Link to="/quick-start" className="group">
              <Card className="p-6 h-full border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">{t('gatehouse.quickStartGuide')}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('gatehouse.quickStartDesc')}
                </p>
                <p className="text-lg font-bold text-primary">$17</p>
              </Card>
            </Link>

            <Link to="/study-suite" className="group">
              <Card className="p-6 h-full border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">{t('gatehouse.studySuite')}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('gatehouse.studySuiteDesc')}
                </p>
                <p className="text-lg font-bold text-primary">$97</p>
              </Card>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Gatehouse;
