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
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { UserCountBadge } from '@/components/UserCountBadge';
import { GiveGemButton } from '@/components/GiveGemButton';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

type ViewState = 'choice' | 'appeal' | 'exit';

const Gatehouse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { hasEnteredPalace, isLoading } = useGatehouseStatus();
  const { markOrientationComplete, advanceGuidedPath } = useChangeSpine();
  const [selectedPath, setSelectedPath] = useState<'surface' | 'palace' | null>(null);
  const [viewState, setViewState] = useState<ViewState>('choice');

  // Handle trial success redirect from Stripe checkout
  useEffect(() => {
    const trialStatus = searchParams.get('trial');
    if (trialStatus === 'success') {
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

      toast.success("🎉 Your 7-day free trial has started! Welcome to the Palace.");
      
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
            <p className="text-muted-foreground">Loading...</p>
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
                Before You Go...
              </h1>
              <p className="text-lg text-muted-foreground">
                Consider what surface study actually costs.
              </p>
            </div>

            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-center">Why Surface Study Falls Short</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">You miss the architecture</h3>
                    <p className="text-sm text-muted-foreground">
                      Scripture is not random stories—it is a unified structure. Surface reading sees trees but never the forest.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">You stay dependent</h3>
                    <p className="text-sm text-muted-foreground">
                      Without tools for interpretation, you remain reliant on others to explain what God's Word means.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">You cannot teach</h3>
                    <p className="text-sm text-muted-foreground">
                      "For when for the time ye ought to be teachers, ye have need that one teach you again" (Hebrews 5:12).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">You miss Christ</h3>
                    <p className="text-sm text-muted-foreground">
                      Every chapter points to Him—but surface reading often sees only moral lessons, missing the Lamb in every shadow.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 mb-8 border-amber-500/30 bg-amber-500/5">
              <h2 className="text-xl font-semibold mb-4 text-center">One More Invitation</h2>
              <p className="text-muted-foreground mb-4 text-center">
                What if you could learn to see what you have been missing?
              </p>
              <p className="text-sm text-muted-foreground text-center mb-6">
                The Palace is not about being smarter. It is about being trained. 
                About learning to ask the right questions. About building Scripture into your mind 
                so deeply that you can recall, connect, and teach.
              </p>
              <blockquote className="border-l-2 border-amber-500/50 pl-4 italic text-muted-foreground text-center">
                "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, 
                rightly dividing the word of truth."
                <footer className="mt-2 text-xs not-italic">— 2 Timothy 2:15</footer>
              </blockquote>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleFinalRefuse}
                className="px-6"
              >
                I understand, but this is not for me
              </Button>
              <Button
                size="lg"
                onClick={handlePalaceChoice}
                className="px-6 bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <Castle className="mr-2 h-5 w-5" />
                I want to learn deeper study
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              <button 
                onClick={() => setViewState('choice')}
                className="hover:underline"
              >
                ← Return to choices
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
                Thank You for Considering Phototheology
              </h1>
            </div>

            <Card className="p-8 mb-8 text-left">
              <p className="text-lg text-muted-foreground mb-6">
                The Bible can be studied at many levels. There is no shame in reading devotionally—
                millions do, and God meets people where they are.
              </p>
              
              <p className="text-muted-foreground mb-6">
                But Phototheology was built for something different: <span className="text-foreground font-medium">training</span>, 
                not just reading. Pattern-building, not just reflection. Architecture, not just inspiration.
              </p>

              <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground mb-6">
                "For every one that useth milk is unskilful in the word of righteousness: for he is a babe. 
                But strong meat belongeth to them that are of full age."
                <footer className="mt-2 text-xs not-italic">— Hebrews 5:13-14</footer>
              </blockquote>

              <p className="text-muted-foreground">
                If you ever feel the pull to go deeper—to truly <em>study</em> rather than just read—
                the Gate remains open.
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
                Wait, let me reconsider
              </Button>
              <Button
                size="lg"
                onClick={handlePalaceChoice}
                className="px-6 bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <Castle className="mr-2 h-5 w-5" />
                Enter the Palace Instead
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              May the Lord bless your journey, wherever it leads.
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
            <p className="text-sm text-primary/80 mb-4 tracking-wide uppercase">
              Welcome back
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              The Choice Is Yours
            </h1>

            <div className="mt-8 flex justify-center">
              <GiveGemButton />
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
                    <h2 className="text-2xl font-serif font-semibold text-blue-100">Remain at the Surface</h2>
                  </div>

                  <div className="space-y-4 text-blue-200/80 text-sm leading-relaxed">
                    <p>You may continue as you are.</p>
                    <p>
                      You will still read the Bible.<br />
                      You will still find comfort.<br />
                      You will still hear familiar truths.
                    </p>
                    <p className="text-blue-300/60 italic">
                      You will stay where most remain—<br />
                      moving verse to verse, devotion to devotion,<br />
                      never quite seeing how it all fits together.
                    </p>
                    <p className="text-blue-400/70 font-medium mt-4">
                      Nothing will change.
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
                    <h2 className="text-2xl font-serif font-semibold text-red-100">Enter the Palace</h2>
                  </div>

                  <div className="space-y-4 text-red-200/80 text-sm leading-relaxed">
                    <p>Or—you may step inside.</p>
                    <p>
                      Beyond this point, the Bible will no longer appear flat.<br />
                      Patterns will emerge.<br />
                      Connections will form.<br />
                      What once seemed distant will begin to speak across time.
                    </p>
                    <p className="text-red-300/70 italic">
                      This is not passive study.<br />
                      This is not entertainment.<br />
                      This is not for the hurried or the casual.
                    </p>
                    <p className="text-red-400 font-medium mt-4">
                      Select to Enter →
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
            The Palace awaits your return.
          </motion.p>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Phototheology Bible Learning Suite" description="Enter the Phototheology Palace. Master Scripture through the 8-floor Palace method — store God's Word as images, patterns, and structures with Christ-centered interpretation." />
      <Navigation />

      <main className="container mx-auto px-4 py-12 pt-24 md:pt-28 max-w-4xl">
        {/* The Choice - Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            The Choice
          </h1>
          <p className="text-xl text-muted-foreground">
            You are standing at a threshold.
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            What you do next will determine how you study Scripture from this point forward.
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
            <GiveGemButton />
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
                  <h2 className="text-2xl font-serif font-semibold text-blue-100">Remain at the Surface</h2>
                </div>

                <div className="space-y-4 text-blue-200/80 text-sm leading-relaxed">
                  <p>You may continue as you are.</p>
                  <p>
                    You will still read the Bible.<br />
                    You will still find comfort.<br />
                    You will still hear familiar truths.
                  </p>
                  <p className="text-blue-300/60 italic">
                    You will stay where most remain—<br />
                    moving verse to verse, devotion to devotion,<br />
                    never quite seeing how it all fits together.
                  </p>
                  <p className="text-blue-400/70 font-medium mt-4">
                    Nothing will change.
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
                  <h2 className="text-2xl font-serif font-semibold text-red-100">Enter the Palace</h2>
                </div>

                <div className="space-y-4 text-red-200/80 text-sm leading-relaxed">
                  <p>Or—you may step inside.</p>
                  <p>
                    Beyond this point, the Bible will no longer appear flat.<br />
                    Patterns will emerge.<br />
                    Connections will form.<br />
                    What once seemed distant will begin to speak across time.
                  </p>
                  <p className="text-red-300/70 italic">
                    This is not passive study.<br />
                    This is not entertainment.<br />
                    This is not for the hurried or the casual.
                  </p>
                  <p className="text-red-400 font-medium mt-4">
                    Once you enter, you cannot unsee what you will see.
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
            <h3 className="text-xl font-serif font-semibold mb-6 text-center">Understand This Clearly</h3>
            <div className="space-y-4 text-muted-foreground text-center max-w-2xl mx-auto">
              <p>
                Entering the Palace will change how you read.<br />
                How you think.<br />
                How you discern truth from error.
              </p>
              <p className="text-foreground/80">
                There is no pressure to proceed.<br />
                There is no shame in remaining where you are.
              </p>
              <p className="italic text-primary/80">
                But the door will not always feel this close.
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
          <h3 className="text-2xl font-serif font-semibold mb-8">The Choice Is Yours</h3>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSurfaceChoice}
              className="px-8 py-6 text-base border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Remain a surface student
            </Button>
            
            <span className="text-muted-foreground font-serif italic">—or—</span>
            
            <Button
              size="lg"
              onClick={handlePalaceChoice}
              className="px-8 py-6 text-base bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            >
              <Castle className="mr-2 h-5 w-5" />
              Enter the Palace
            </Button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-muted-foreground mt-8 italic"
          >
            Once you do, things will change from here on out.
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
            Prefer to Study Offline?
          </h3>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Get the Phototheology method in downloadable PDF format
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link to="/bible-prophecy-guide" className="group">
              <Card className="p-6 h-full border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">Genesis in 6 Days</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Walk through Genesis with Phototheology. See Christ from the very first verse.
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
                  <h4 className="font-semibold group-hover:text-primary transition-colors">Quick-Start Guide</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Orientation to the Palace framework. Understand the structure before you begin.
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
                  <h4 className="font-semibold group-hover:text-primary transition-colors">Study Suite</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete method training for all 8 Floors. Master the Phototheology system.
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
