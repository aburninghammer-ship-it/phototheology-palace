import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Building2, BookOpen, Sparkles, Lightbulb, Crown, Layers, Zap, Scale, Telescope, Search, Image, Film, Brain, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleShare = () => {
    const shareData = {
      title: 'Phototheology - The Palace of Biblical Wisdom',
      text: 'Transform Bible study into a palace of meaning through an 8-floor, 38-room method.',
      url: window.location.origin
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(262,83%,58%,0.08),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(340,82%,62%,0.08),transparent_60%)]" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full gradient-sunset border border-white/10 mb-6 shadow-sm animate-fade-in">
            <Building2 className="h-4 w-4 text-white" />
            <span className="text-sm font-semibold text-white">The Palace of Biblical Wisdom</span>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-5 bg-gradient-palace bg-clip-text text-transparent animate-slide-up">
            Phototheology
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed max-w-2xl mx-auto animate-fade-in font-medium">
            Transform Bible study into a <span className="text-primary font-bold">palace of meaning</span>. 
            Store Scripture as <span className="text-secondary font-bold">vivid images</span>, patterns, 
            and structures through an <span className="text-accent font-bold">8-floor, 38-room</span> method.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up">
            <Button asChild size="lg" className="gradient-palace text-white hover:opacity-90 transition-all">
              <Link to="/auth">
                <Building2 className="mr-2 h-4 w-4" />
                Get Started Free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border hover:bg-accent/5">
              <Link to="/pricing">
                <Sparkles className="mr-2 h-4 w-4" />
                View Pricing
              </Link>
            </Button>
            <Button size="lg" variant="ghost" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4 bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 gradient-royal rounded-xl mb-3">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-royal bg-clip-text text-transparent">
              The Vision
            </h2>
          </div>
          
          <div className="space-y-5 text-lg leading-relaxed">
            <div className="p-6 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 transition-all hover:border-primary/20">
              <p className="text-foreground/85">
                Phototheology exists because the Bible is not only a book of words; it is a book of{" "}
                <span className="font-bold text-foreground">images, symbols, and living stories</span>. 
                God has always taught visually and narratively—Adam clothed in skins, 
                Noah's rainbow, Abraham's stars, Moses' sanctuary, Jesus' parables, John's Revelation movie.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-r from-secondary/5 to-accent/5 border border-secondary/10 transition-all hover:border-secondary/20">
              <p className="text-foreground/85">
                Phototheology restores that method. It teaches you to store Scripture as{" "}
                <span className="font-bold text-foreground">images, patterns, and structures</span>. 
                Instead of random notes scattered across a page, your mind becomes a{" "}
                <em className="text-foreground font-semibold">palace of meaning</em>, 
                with every story, verse, and prophecy stored in its proper chamber.
              </p>
            </div>
            
            <div className="p-7 rounded-xl gradient-sunset text-white text-center">
              <Sparkles className="h-10 w-10 mx-auto mb-4" />
              <p className="font-semibold text-xl mb-3">
                The vision is not just information—it is <strong>formation</strong>.
              </p>
              <p className="text-base text-white/95 leading-relaxed">
                Think Phototheologically: reflexively seeing Christ in all Scripture, 
                instinctively mapping verses into cycles, instantly recalling patterns and prophecies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 gradient-dreamy">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 gradient-warmth rounded-xl mb-3">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-sunset bg-clip-text text-transparent">
              The Eight-Floor Method
            </h2>
            <p className="text-lg text-foreground/75 max-w-2xl mx-auto font-medium">
              Each floor builds upon the last, creating a complete system for biblical mastery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-card border border-primary/20 hover:border-primary/40 transition-all group">
              <div className="w-11 h-11 rounded-lg gradient-palace flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-primary">Floors 1-2</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                <strong className="text-foreground font-semibold">Furnishing & Investigation</strong> — Fill your shelves with stories 
                and become a detective of the Word.
              </p>
            </div>
            
            <div className="p-5 rounded-xl bg-card border border-secondary/20 hover:border-secondary/40 transition-all group">
              <div className="w-11 h-11 rounded-lg gradient-sunset flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-secondary">Floors 3-4</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                <strong className="text-foreground font-semibold">Freestyle & Next Level</strong> — Connect Scripture to daily life 
                and expand through Christ-centered dimensions.
              </p>
            </div>
            
            <div className="p-5 rounded-xl bg-card border border-palace-blue/20 hover:border-palace-blue/40 transition-all group">
              <div className="w-11 h-11 rounded-lg gradient-ocean flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-palace-blue">Floors 5-6</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                <strong className="text-foreground font-semibold">Vision & Horizons</strong> — Open the prophetic telescope; 
                see sanctuary, feasts, cycles, and cosmic dimensions.
              </p>
            </div>
            
            <div className="p-5 rounded-xl bg-card border border-accent/20 hover:border-accent/40 transition-all group">
              <div className="w-11 h-11 rounded-lg gradient-warmth flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-accent">Floors 7-8</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                <strong className="text-foreground font-semibold">Spiritual & Master</strong> — Bring heart into fire, 
                then let the palace become reflexive thought.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Modes Section */}
      <section className="py-16 px-4 bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/10 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">Floor 0 - Advanced Modes</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-royal bg-clip-text text-transparent">
              AI-Powered Study Tools
            </h2>
            <p className="text-lg text-foreground/75 max-w-2xl mx-auto font-medium">
              Specialized tools for deep analysis and real-world application
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/culture-controversy" className="group">
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 border border-red-200/50 dark:border-red-800/50 hover:border-red-400 dark:hover:border-red-700 transition-all">
                <div className="w-12 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Scale className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 text-foreground">Culture & Controversy</h3>
                <p className="text-base text-foreground/75 leading-relaxed">
                  Analyze current events through Jesus' teachings.
                </p>
              </div>
            </Link>
            
            <Link to="/prophecy-watch" className="group">
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all">
                <div className="w-12 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Telescope className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 text-foreground">Prophecy Watch</h3>
                <p className="text-base text-foreground/75 leading-relaxed">
                  Monitor end-time events and fulfillment of prophecy.
                </p>
              </div>
            </Link>
            
            <Link to="/research-mode" className="group">
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-indigo-900/50 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all">
                <div className="w-12 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 text-foreground">Research Mode</h3>
                <p className="text-base text-foreground/75 leading-relaxed">
                  Deep biblical study with comprehensive research.
                </p>
              </div>
            </Link>
            
            <Link to="/bible-image-library" className="group">
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200/50 dark:border-purple-800/50 hover:border-purple-400 dark:hover:border-purple-700 transition-all">
                <div className="w-12 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Image className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 text-foreground">Bible Image Library</h3>
                <p className="text-base text-foreground/75 leading-relaxed">
                  AI-generated visual interpretations of Scripture.
                </p>
              </div>
            </Link>
            
            <Link to="/sermon-builder" className="group">
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border border-orange-200/50 dark:border-orange-800/50 hover:border-orange-400 dark:hover:border-orange-700 transition-all">
                <div className="w-12 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Film className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 text-foreground">Sermon Builder</h3>
                <p className="text-base text-foreground/75 leading-relaxed">
                  Build sermons with 5 Smooth Stones methodology.
                </p>
              </div>
            </Link>
            
            <Link to="/flashcards" className="group">
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/50 dark:to-teal-950/50 border border-green-200/50 dark:border-green-800/50 hover:border-green-400 dark:hover:border-green-700 transition-all">
                <div className="w-12 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 text-foreground">Flashcards</h3>
                <p className="text-base text-foreground/75 leading-relaxed">
                  Master Bible knowledge with interactive study cards.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/40 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(262,83%,58%,0.05),transparent_70%)]" />
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 gradient-palace rounded-2xl mb-5">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-5 bg-gradient-palace bg-clip-text text-transparent">
            Enter the Palace
          </h2>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed font-medium">
            Each floor has its own discipline. Together they form a <span className="text-foreground font-bold">complete method</span> of Bible study 
            that combines <span className="text-foreground font-bold">memory</span>, <span className="text-foreground font-bold">imagination</span>, 
            <span className="text-foreground font-bold">theology</span>, <span className="text-foreground font-bold">prophecy</span>, 
            and <span className="text-foreground font-bold">devotion</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gradient-palace text-white hover:opacity-90 transition-all">
              <Link to="/palace">
                <Building2 className="mr-2 h-4 w-4" />
                Begin Your Journey
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-primary hover:bg-primary hover:text-white">
              <Link to="/floor/1">
                Start Learning
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Phototheology — The Magnum Opus of Visual Biblical Formation</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
