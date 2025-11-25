import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Brain,
  Users,
  ChevronRight,
  Check,
  Church,
  Heart,
  Sparkles,
  TrendingUp,
  Target,
  HelpCircle,
  X,
  Building2,
  Play,
  Shield,
  Quote
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
import { Download } from "lucide-react";
import { Testimonials } from "@/components/Testimonials";
import { MagicEyeHero } from "@/components/MagicEyeHero";

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

      {/* Magic Eye Hero Section */}
      <MagicEyeHero />

      {/* User Count Badge */}
      <div className="flex justify-center py-8 bg-gradient-to-b from-background to-muted/30">
        <UserCountBadge />
      </div>

      {/* SECTION 2 — The Pain Point */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ever felt like your Bible study is:
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-card rounded-lg border-2 border-destructive/20">
              <HelpCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
              <p className="font-semibold mb-2">A list of disconnected verses?</p>
            </div>
            <div className="p-6 bg-card rounded-lg border-2 border-destructive/20">
              <Brain className="h-12 w-12 mx-auto mb-3 text-destructive" />
              <p className="font-semibold mb-2">Hard to understand?</p>
            </div>
            <div className="p-6 bg-card rounded-lg border-2 border-destructive/20">
              <Target className="h-12 w-12 mx-auto mb-3 text-destructive" />
              <p className="font-semibold mb-2">Easy to forget?</p>
            </div>
          </div>

          <p className="text-xl text-muted-foreground mb-4">
            You're not alone.
          </p>
          <p className="text-xl font-semibold mb-2">
            Most Christians struggle because we were never taught <span className="text-primary">how the Bible connects</span>.
          </p>
          <p className="text-2xl font-bold text-primary mt-6">
            Phototheology fixes that.
          </p>
        </div>
      </section>

      {/* SECTION 3 — The Promise */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            With Phototheology, you will:
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">See how everything interlocks</h3>
                    <p className="text-muted-foreground">Stories, prophecies, and themes finally connect in your mind.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Understand each book visually</h3>
                    <p className="text-muted-foreground">Not abstractly — with clear, memorable mental images.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Build a mental map you'll never lose</h3>
                    <p className="text-muted-foreground">Scripture becomes permanently stored, instantly accessible.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Learn faster, retain more</h3>
                    <p className="text-muted-foreground">Study with confidence using proven memory techniques.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-xl text-center mt-12 text-muted-foreground">
            It's the first Bible study system designed for <span className="font-semibold text-foreground">the way your mind actually works</span> — visually.
          </p>
        </div>
      </section>

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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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

      {/* SECTION 7 — Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            What Users Are Saying
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Real results from real people
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="text-muted-foreground italic mb-4">
                  "Phototheology changed the way I read Scripture forever. I finally see how everything connects."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah M.</p>
                    <p className="text-sm text-muted-foreground">Bible Study Leader</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="text-muted-foreground italic mb-4">
                  "My Bible study group has never been more engaged. Jeeves is a game-changer."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Church className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Pastor James R.</p>
                    <p className="text-sm text-muted-foreground">Senior Pastor</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="text-muted-foreground italic mb-4">
                  "For the first time, I remember what I study. No more random verses — the whole Bible makes sense."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">David T.</p>
                    <p className="text-sm text-muted-foreground">Seminary Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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

      {/* SECTION 9.5 — Testimonials */}
      <Testimonials />

      {/* SECTION 10 — Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Finally Understand the Bible?
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Open the Palace.
          </p>
          <p className="text-xl text-muted-foreground mb-4">
            Connect the patterns.
          </p>
          <p className="text-xl text-muted-foreground mb-8">
            See Scripture the way it was meant to be seen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate(user ? "/palace" : "/auth")}
              className="text-xl px-10 py-7 shadow-xl gradient-palace"
            >
              Get Started Free
              <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/interactive-demo")}
              className="text-xl px-10 py-7"
            >
              <Play className="mr-2 h-6 w-6" />
              Watch the Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;