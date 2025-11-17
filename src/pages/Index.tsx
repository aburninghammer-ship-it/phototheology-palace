import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  BookOpen, 
  Brain,
  Users,
  ChevronRight,
  Check,
  Church,
  GraduationCap,
  Heart,
  Sparkles,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  Target,
  Search,
  Layers,
  HelpCircle,
  Share2,
  Download,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/phototheology-hero.png";
import practiceWithAi from "@/assets/practice-with-ai.png";
import masterDeploy from "@/assets/master-deploy.png";
import { UserCountBadge } from "@/components/UserCountBadge";
import { SocialShareButton } from "@/components/SocialShareButton";
import { PWAInstallButton } from "@/components/PWAInstallButton";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Check if app should show install banner
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true
      || document.referrer.includes('android-app://');
    
    const bannerDismissed = localStorage.getItem('installBannerDismissed');
    
    if (!isStandalone && !bannerDismissed) {
      setShowInstallBanner(true);
    }
  }, []);

  // Redirect authenticated users to onboarding if they haven't completed it
  useEffect(() => {
    const checkOnboarding = async () => {
      if (user) {
        const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
        
        if (!hasCompletedOnboarding) {
          // Check database for onboarding status
          const { data } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", user.id)
            .maybeSingle();
          
          if (!data?.onboarding_completed) {
            navigate("/onboarding");
          }
        }
      }
    };

    checkOnboarding();
  }, [user, navigate]);

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Install App Banner */}
      {showInstallBanner && (
        <div className="sticky top-16 z-40 bg-gradient-to-r from-primary via-primary/95 to-accent text-primary-foreground shadow-lg border-b border-primary/20 animate-slide-down">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs sm:text-sm truncate">📱 Get the App!</p>
                  <p className="text-[10px] sm:text-xs opacity-90 truncate">Install for offline access & better experience</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <PWAInstallButton />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={dismissBanner}
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20 flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Access Banner for Authenticated Users */}
      {user && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-primary to-accent border-b border-border/50 backdrop-blur-sm shadow-lg">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 hidden xs:block">
                  <p className="text-white font-semibold text-xs sm:text-sm truncate">Welcome back!</p>
                  <p className="text-white/80 text-[10px] sm:text-xs truncate">Continue your journey</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/palace")}
                className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold flex-shrink-0 text-sm sm:text-base"
                size="sm"
              >
                <span className="hidden xs:inline">Enter Palace</span>
                <span className="xs:hidden">Enter</span>
                <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section - Pain First */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center gap-4 mb-8">
            <UserCountBadge />
            <SocialShareButton
              title="Phototheology - Master Bible Study with Memory Palace"
              description="Transform your Bible study with the revolutionary Phototheology method. Build your memory palace and master Scripture through visualization, games, and AI assistance."
              url={window.location.origin}
              variant="dialog"
              size="lg"
              buttonText="Share this app"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Mind Was Designed to<br />
            <span className="text-primary">Understand and Remember the Bible Visually</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop closing your Bible confused. The Palace Method shows you how to study step-by-step and turns Scripture into a visual map—
            <span className="font-semibold text-foreground">so every story, verse, and prophecy finally makes sense and sticks.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate(user ? "/palace" : "/auth")}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Free Trial <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/interactive-demo")}
              className="text-lg px-8 py-6"
            >
              Try Interactive Demo
            </Button>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <img 
              src={heroImage} 
              alt="Phototheology Palace Interface" 
              className="rounded-lg shadow-2xl border-2 border-border"
            />
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How Phototheology Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform how you remember and apply Scripture
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-2xl">Build Your Palace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start on Floor 1—learn to turn Bible stories into vivid mental images. Each floor adds a new skill: detective observation, freestyle connections, Christ-centered depth.
                </p>
                <img src={heroImage} alt="Palace floors" className="rounded border border-border" />
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full" />
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-accent">2</span>
                </div>
                <CardTitle className="text-2xl">Practice with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Jeeves, your AI study partner, guides you through drills, answers questions, and validates your insights using the Palace framework—like having a seminary professor 24/7.
                </p>
                <img src={practiceWithAi} alt="AI study assistant" className="rounded border border-border" />
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-2xl">Master & Deploy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  By Floor 8, the Palace becomes reflexive—you think Phototheologically without trying. Then deploy: build sermons, teach classes, lead ministries with confidence.
                </p>
                <img src={masterDeploy} alt="Ministry leadership and deployment" className="rounded border border-border" />
              </CardContent>
            </Card>
          </div>

          {/* CTA to try interactive demo */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold mb-3">Want to try it yourself?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Experience Floor 1 basics in our 5-minute interactive demo—no sign-up required
                </p>
                <Button 
                  size="lg"
                  onClick={() => navigate("/interactive-demo")}
                  className="gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Try Interactive Demo
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Who It's For</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're leading a church or studying alone, Phototheology meets you where you are
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Church className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Pastors & Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Turn your congregation into a unified discipleship force. Get ready-to-use curriculum, track engagement, and identify emerging leaders.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Serious Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Go beyond surface reading. Master prophecy, sanctuary, and typology with a proven system that builds deep, lasting comprehension.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Parents & Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Age-appropriate content for kids and teens. Finally, tools that match your theology without requiring you to be a Bible scholar.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Young Adults</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build confidence in what you believe. Engage with prophecy, apologetics, and real-world application through interactive challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Signals - Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Users Are Saying</h2>
            <p className="text-xl text-muted-foreground">Real results from pastors, students, and families</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Pastor John R.</p>
                    <p className="text-sm text-muted-foreground">Senior Pastor</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "Finally, a system our entire church can use together. We launched a Daniel study campaign and saw 70% engagement across all age groups. Game changer."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                    <Brain className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah M.</p>
                    <p className="text-sm text-muted-foreground">Bible Study Leader</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "I've studied the Bible for 20 years, but Phototheology gave me a structure I never had. Now I can recall passages instantly and teach with confidence."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">David & Lisa K.</p>
                    <p className="text-sm text-muted-foreground">Homeschool Parents</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "Our kids actually remember what they study now! The visual memory approach works perfectly for their learning style. Worth every penny."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Vision</h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-lg leading-relaxed mb-6">
              Phototheology exists because the Bible is not only a book of words; it is a book of images, symbols, and living stories. God has always taught visually and narratively—Adam clothed in skins, Noah's rainbow, Abraham's stars, Moses' sanctuary, Jesus' parables, John's Revelation movie.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Phototheology restores that method. It teaches you to store Scripture as images, patterns, and structures. Instead of random notes scattered across a page, your mind becomes a palace of meaning, with every story, verse, and prophecy stored in its proper chamber.
            </p>
            
            <p className="text-lg leading-relaxed font-semibold">
              The vision is not just information—it is formation. Think Phototheologically: reflexively seeing Christ in all Scripture, instinctively mapping verses into cycles, instantly recalling patterns and prophecies.
            </p>
          </div>
        </div>
      </section>

      {/* The Eight-Floor Method */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Eight-Floor Method</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each floor builds upon the last, creating a complete system for biblical mastery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Floors 1-2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Furnishing & Investigation</span> — Fill your shelves with stories and become a detective of the Word.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Floors 3-4</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Freestyle & Next Level</span> — Connect Scripture to daily life and expand through Christ-centered dimensions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Floors 5-6</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Vision & Horizons</span> — Open the prophetic telescope; see sanctuary, feasts, cycles, and cosmic dimensions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Floors 7-8</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Spiritual & Master</span> — Bring heart into fire, then let the palace become reflexive thought.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Modes - Floor 0 */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">Floor 0</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">AI-Powered Study Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized tools for deep analysis and real-world application
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/culture-controversy")}>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Culture & Controversy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analyze current events through Jesus' teachings.</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/prophecy-watch")}>
              <CardHeader>
                <Sparkles className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Prophecy Watch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Monitor end-time events and fulfillment of prophecy.</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/bible-image-library")}>
              <CardHeader>
                <ImageIcon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Bible Image Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">AI-generated visual interpretations of Scripture.</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/sermon-builder")}>
              <CardHeader>
                <FileText className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Sermon Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Build sermons with 5 Smooth Stones methodology.</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/research-mode")}>
              <CardHeader>
                <Search className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Research Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Deep biblical study with comprehensive research.</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/flashcards")}>
              <CardHeader>
                <Brain className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Master Bible knowledge with interactive study cards.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview + CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-xl text-muted-foreground">For individuals or churches—start free, upgrade when ready</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Free Trial</CardTitle>
                <p className="text-3xl font-bold mt-2">$0</p>
                <p className="text-sm text-muted-foreground">7 days, then $9/month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">All 8 Palace Floors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">AI Study Assistant (Jeeves)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Interactive Challenges</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" onClick={() => navigate("/auth")}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
            
            <Card className="relative border-2 border-primary">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Individual</CardTitle>
                <p className="text-3xl font-bold mt-2">$9</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Everything in Free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Advanced AI Tools (Research, Culture Analysis)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Sermon Builder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Progress Tracking</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" onClick={() => navigate("/pricing")}>
                  View Plans
                </Button>
              </CardContent>
            </Card>
            
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Church License</CardTitle>
                <p className="text-3xl font-bold mt-2">Custom</p>
                <p className="text-sm text-muted-foreground">Based on congregation size</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Everything in Individual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Church Admin Dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Ready-to-Use Curriculum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Ministry Launch Academy</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" onClick={() => navigate("/church-signup")}>
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about the Palace Method
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">What is the Palace Method?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The Palace Method is a visual memory system for Bible study based on the ancient "memory palace" technique. 
                Instead of trying to remember isolated verses or facts, you build a mental structure with 8 floors and multiple rooms—each 
                teaching a specific skill like observation, Christ-centered interpretation, prophecy, and more. As you progress through 
                the floors, the system becomes reflexive, allowing you to recall Scripture instantly and understand how everything connects.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">How is this different from traditional Bible study?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Traditional Bible study often involves reading, note-taking, and commentary without a unified system for retention or application. 
                Phototheology provides a structured framework that combines memory techniques, visual learning, Christ-centered interpretation, 
                and AI-guided practice. Instead of forgetting what you study by next week, you build a permanent mental library that grows 
                stronger with use. Plus, our AI assistant (Jeeves) helps validate your insights and guide you through the method step-by-step.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">Do I need to memorize the entire Bible?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No! The goal isn't rote memorization of every verse. Instead, you learn to store key stories, patterns, and principles 
                as visual anchors. Think of it like knowing your way around a familiar building—you don't memorize every brick, but you 
                know where everything is and can find what you need instantly. The system helps you remember the structure and flow of 
                Scripture, making deeper study and teaching much easier.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">What's included in the free version?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The free version includes full access to all 8 floors of the Palace Method, guided courses (Daniel, Revelation, Blueprint), 
                basic AI assistance with Jeeves for study questions, interactive games and drills, and community features. You can learn 
                the entire method and start building your palace without paying anything. Paid plans unlock advanced AI tools, sermon building, 
                church admin features, and ministry resources.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">Can I cancel my subscription anytime?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! There are no long-term contracts or cancellation fees. You can downgrade to the free plan or cancel your subscription 
                at any time from your account settings. Even if you cancel, you'll retain access to your progress and the core Palace Method 
                training—you'll just lose access to premium features like advanced AI tools and sermon builder.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">Is this suitable for beginners?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! The Palace Method is designed to meet you where you are. Floor 1 starts with the basics—turning Bible stories 
                into mental images. The AI assistant provides explanations at your level, and there's age-appropriate content for kids and teens. 
                Whether you've never studied the Bible systematically or you're a seminary graduate, the structured approach helps you build 
                from foundation to mastery at your own pace.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">How long does it take to see results?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Most users notice improved recall within the first week of practicing the Floor 1 techniques (Story Room, Imagination Room). 
                By the time you reach Floor 4, many report being able to teach Scripture with new confidence. Full mastery (Floor 8, where 
                the method becomes reflexive) typically takes 6-12 months of consistent practice—but you'll experience benefits at every stage. 
                Think of it like learning an instrument: you can play simple songs early on, but true fluency comes with dedicated practice.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">Can churches use this for group studies?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Churches love Phototheology for group studies. The Church License includes admin dashboards to track member progress, 
                ready-to-use curriculum for small groups and Sabbath School, campaign tools (like our Daniel or Revelation studies), and 
                ministry launch resources. Pastors can assign content, monitor engagement, and identify emerging leaders. Many churches run 
                church-wide campaigns where everyone progresses through the Palace together, creating a unified discipleship culture.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button variant="outline" size="lg" onClick={() => navigate("/feedback")}>
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-primary text-primary-foreground border-0 p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Bible Study?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands who are building a palace of Scripture memory that lasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate(user ? "/palace" : "/auth")}
                className="text-lg px-8 py-6"
              >
                Enter the Palace <ChevronRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/interactive-demo")}
                className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Try Demo First
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;