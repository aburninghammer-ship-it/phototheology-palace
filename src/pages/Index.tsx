import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  ChevronRight,
  Check,
  X,
  Building2,
  Shield,
  Sparkles,
  TrendingUp,
  Target,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import heroImage from "@/assets/phototheology-hero.png";
import practiceWithAi from "@/assets/practice-with-ai.png";
import masterDeploy from "@/assets/master-deploy.png";
import { UserCountBadge } from "@/components/UserCountBadge";
import { SocialShareButton } from "@/components/SocialShareButton";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { LiveAIDemoWidget } from "@/components/LiveAIDemoWidget";
import { StreamlinedTestimonials } from "@/components/StreamlinedTestimonials";
import { FinalCTA } from "@/components/FinalCTA";
import { ClearHero } from "@/components/ClearHero";
import { MagicEyeEasterEgg } from "@/components/MagicEyeEasterEgg";
import { ExplainerVideo } from "@/components/ExplainerVideo";
import { WhatPhototheologyDoes } from "@/components/WhatPhototheologyDoes";
import { WhyPeopleSwitching } from "@/components/WhyPeopleSwitching";
import { InsideThePalace } from "@/components/InsideThePalace";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true
      || document.referrer.includes('android-app://');
    
    const bannerDismissed = localStorage.getItem('installBannerDismissed');
    
    if (!isStandalone && !bannerDismissed) {
      setShowInstallBanner(true);
    }
  }, []);

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      
      {/* Install App Banner */}
      {showInstallBanner && (
        <div className="sticky top-16 z-40 bg-gradient-to-r from-primary via-primary/95 to-accent text-primary-foreground shadow-lg border-b border-primary/20">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Download className="w-5 h-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm">📱 Get the App!</p>
                  <p className="text-xs opacity-90">Install for offline access</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PWAInstallButton />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={dismissBanner}
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Hero Section */}
      <ClearHero />

      {/* Explainer Video */}
      <ExplainerVideo />

      {/* What Phototheology Does - 3 Frame Slider */}
      <WhatPhototheologyDoes />

      {/* Why People Are Switching */}
      <WhyPeopleSwitching />

      {/* User Count Badge */}
      <div className="flex justify-center py-8 bg-gradient-to-b from-background to-muted/30">
        <UserCountBadge />
      </div>

      {/* Simplified Pain Point */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-2xl md:text-3xl font-bold">
            Most Christians struggle because we were never taught{" "}
            <span className="text-primary">how the Bible connects</span>.
          </p>
          <p className="text-xl text-muted-foreground">
            Phototheology fixes that.
          </p>
        </div>
      </section>

      {/* Inside the Palace - Features */}
      <InsideThePalace />

      {/* SECTION 4 — Simple Palace Explanation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            We turned the entire Bible into a visual palace
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            A clear structure that finally makes Scripture come alive
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card rounded-lg">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold mb-2">Floors</h3>
              <p className="text-sm text-muted-foreground">The major themes</p>
            </div>
            <div className="p-6 bg-card rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="font-bold mb-2">Rooms</h3>
              <p className="text-sm text-muted-foreground">The stories</p>
            </div>
            <div className="p-6 bg-card rounded-lg">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold mb-2">Paths</h3>
              <p className="text-sm text-muted-foreground">The connections</p>
            </div>
            <div className="p-6 bg-card rounded-lg">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="font-bold mb-2">Jeeves (AI)</h3>
              <p className="text-sm text-muted-foreground">Your personal guide</p>
            </div>
          </div>

          <p className="text-xl font-semibold mt-8">
            No clutter. No confusion.<br />
            Just a clear structure.
          </p>
        </div>
      </section>

      {/* SECTION 5 — How It Works (Three Steps) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Three simple steps to transform your Bible study
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-2xl">Build Your Palace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start on Floor 1 with simple memory rooms. Walk through stories using vivid images and clear patterns.
                </p>
                <img src={heroImage} alt="Palace structure" className="rounded border" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-accent">2</span>
                </div>
                <CardTitle className="text-2xl">Connect the Bible</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  As you progress through the floors, you'll build connections: prophecy, typology, Christ-centered threads, and big-picture patterns.
                </p>
                <img src={practiceWithAi} alt="AI assistance" className="rounded border" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-2xl">Practice with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Jeeves guides you with drills, maps out verses, tests mastery, and helps you build your own Bible studies.
                </p>
                <img src={masterDeploy} alt="Mastery and deployment" className="rounded border" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live AI Demo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <LiveAIDemoWidget />
        </div>
      </section>

      {/* SECTION 6 — Bible Study Creator */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Badge className="mb-4 mx-auto block w-fit">NEW FEATURE</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Create Your Own Bible Studies in Minutes
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Pastors, teachers, small groups, and content creators can now:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <Check className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Generate Bible study series</h3>
                <p className="text-sm text-muted-foreground">Complete series with lesson plans and discussion guides</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Check className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Build lesson plans</h3>
                <p className="text-sm text-muted-foreground">Structured, biblical, and Palace-principle based</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Check className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Create shareable outlines</h3>
                <p className="text-sm text-muted-foreground">Export and share with your group or congregation</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Check className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Use Palace principles in real time</h3>
                <p className="text-sm text-muted-foreground">Jeeves keeps everything biblical and structured</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate("/bible-study-series")}
              className="gradient-palace"
            >
              Try the Study Builder
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Magic Eye Easter Egg */}
      <MagicEyeEasterEgg />

      {/* SECTION 9 — Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Free. Cancel Anytime.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Full access to the entire Palace and Jeeves included.
          </p>

          <Card className="max-w-2xl mx-auto border-2 border-primary/20">
            <CardHeader>
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-2">Free Trial</h3>
                <p className="text-muted-foreground">Experience everything Phototheology offers</p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6 text-left">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>All 8 floors of the Palace</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Unlimited AI assistance with Jeeves</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Bible Study Builder</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Interactive drills and games</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Progress tracking and mastery system</span>
                </li>
              </ul>
              <Button 
                size="lg" 
                onClick={() => navigate("/pricing")}
                className="w-full gradient-palace text-lg"
              >
                View Pricing Details
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                <Shield className="h-4 w-4 inline mr-1" />
                Risk-free. No credit card required to start.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Streamlined Testimonials */}
      <StreamlinedTestimonials />

      {/* Final CTA */}
      <FinalCTA />

      <Footer />
    </div>
  );
};

export default Index;