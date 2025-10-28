import { Link } from "react-router-dom";
import { Building2, Sparkles, Users, BookOpen, Lightbulb, Crown, Layers, Zap, Scale, Telescope, Search, Image, Film, Brain, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { EmpowerYourMembers } from "@/components/churches/EmpowerYourMembers";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { activeCount } = useActiveUsers();

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
    <div className="min-h-screen bg-gradient-to-br from-palace-blue/20 via-palace-teal/15 to-palace-purple/20" style={{ background: 'linear-gradient(135deg, hsl(210 75% 65%) 0%, hsl(190 60% 65%) 50%, hsl(180 70% 60%) 100%)' }}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(20,184,166,0.08),transparent_60%)]" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full gradient-ocean border border-white/10 shadow-sm animate-fade-in">
              <Building2 className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">The Phototheology Palace</span>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-sm animate-fade-in">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{activeCount} online now</span>
            </div>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-5 bg-gradient-ocean bg-clip-text text-transparent animate-slide-up">
            Transform Your Bible Study Forever
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground mb-4 leading-relaxed max-w-2xl mx-auto animate-fade-in font-normal">
            The only app that teaches you to <strong className="font-bold">see Christ everywhere in Scripture</strong> through interactive games, memory techniques, and prophetic connections.
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands learning Biblical typology through the <strong>8-floor Memory Palace method</strong>
          </p>
          
          {/* Prominent Tour CTA */}
          <div className="mb-6 animate-fade-in">
            <Button asChild size="lg" variant="outline" className="border-2 border-palace-blue text-palace-blue hover:bg-palace-blue hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all">
              <Link to="/app-tour">
                <BookOpen className="mr-2 h-5 w-5" />
                Take a Tour First →
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              See how everything works in 5 minutes
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up">
            <Button asChild size="lg" className="gradient-ocean text-white hover:opacity-90 transition-all">
              <Link to="/auth">
                <Building2 className="mr-2 h-4 w-4" />
                Get Started Free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-palace-blue hover:bg-palace-blue/10">
              <Link to="/pricing">
                <Sparkles className="mr-2 h-4 w-4" />
                View Pricing
              </Link>
            </Button>
            <Button size="lg" variant="ghost" onClick={handleShare} className="gap-2 hover:bg-palace-teal/10">
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
            <div className="inline-flex items-center justify-center w-12 h-12 gradient-ocean rounded-xl mb-3">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-ocean bg-clip-text text-transparent">
              The Vision
            </h2>
          </div>
          
          <div className="space-y-5 text-lg leading-relaxed">
            <div className="p-6 rounded-xl bg-gradient-to-r from-palace-blue/5 to-palace-teal/5 border border-palace-blue/10 transition-all hover:border-palace-blue/20">
              <p className="text-foreground/85">
                Phototheology exists because the Bible is not only a book of words; it is a book of{" "}
                <span className="font-bold text-foreground">images, symbols, and living stories</span>. 
                God has always taught visually and narratively—Adam clothed in skins, 
                Noah's rainbow, Abraham's stars, Moses' sanctuary, Jesus' parables, John's Revelation movie.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-r from-palace-teal/5 to-palace-green/5 border border-palace-teal/10 transition-all hover:border-palace-teal/20">
              <p className="text-foreground/85">
                Phototheology restores that method. It teaches you to store Scripture as{" "}
                <span className="font-bold text-foreground">images, patterns, and structures</span>. 
                Instead of random notes scattered across a page, your mind becomes a{" "}
                <em className="text-foreground font-semibold">palace of meaning</em>, 
                with every story, verse, and prophecy stored in its proper chamber.
              </p>
            </div>
            
            <div className="p-7 rounded-xl gradient-ocean text-white text-center">
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
            <div className="inline-flex items-center justify-center w-12 h-12 gradient-forest rounded-xl mb-3">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-forest bg-clip-text text-transparent">
              The Eight-Floor Method
            </h2>
            <p className="text-lg text-foreground/75 max-w-2xl mx-auto font-medium">
              Each floor builds upon the last, creating a complete system for biblical mastery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-card border border-palace-blue/20 hover:border-palace-blue/40 transition-all group">
              <div className="w-11 h-11 rounded-lg gradient-ocean flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-palace-blue">Floors 1-2</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                <strong className="text-foreground font-semibold">Furnishing & Investigation</strong> — Fill your shelves with stories 
                and become a detective of the Word.
              </p>
            </div>
            
            <div className="p-5 rounded-xl bg-card border border-palace-teal/20 hover:border-palace-teal/40 transition-all group">
              <div className="w-11 h-11 rounded-lg gradient-forest flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-palace-teal">Floors 3-4</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                <strong className="text-foreground font-semibold">Freestyle & Next Level</strong> — Connect Scripture to daily life 
                and expand through Christ-centered dimensions.
              </p>
            </div>
            
            <div className="p-5 rounded-xl bg-card border border-palace-green/20 hover:border-palace-green/40 transition-all group">
              <div className="w-11 h-11 rounded-lg gradient-forest flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-palace-green">Floors 5-6</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                <strong className="text-foreground font-semibold">Vision & Horizons</strong> — Open the prophetic telescope; 
                see sanctuary, feasts, cycles, and cosmic dimensions.
              </p>
            </div>
            
            <div className="p-5 rounded-xl bg-card border border-palace-orange/20 hover:border-palace-orange/40 transition-all group">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-palace-orange to-palace-yellow flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-palace-orange">Floors 7-8</h3>
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-palace-teal/5 border border-palace-teal/10 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-palace-teal" />
              <span className="text-xs font-medium text-palace-teal">Floor 0 - Advanced Modes</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3 bg-gradient-ocean bg-clip-text text-transparent">
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

      {/* Empower Your Members Section */}
      <EmpowerYourMembers />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/40 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(210,100%,56%,0.05),transparent_70%)]" />
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 gradient-ocean rounded-2xl mb-5">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-5 bg-gradient-ocean bg-clip-text text-transparent">
            Enter the Palace
          </h2>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed font-medium">
            Each floor has its own discipline. Together they form a <span className="text-foreground font-bold">complete method</span> of Bible study 
            that combines <span className="text-foreground font-bold">memory</span>, <span className="text-foreground font-bold">imagination</span>, 
            <span className="text-foreground font-bold">theology</span>, <span className="text-foreground font-bold">prophecy</span>, 
            and <span className="text-foreground font-bold">devotion</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gradient-ocean text-white hover:opacity-90 transition-all">
              <Link to="/palace">
                <Building2 className="mr-2 h-4 w-4" />
                Begin Your Journey
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-palace-blue hover:bg-palace-blue hover:text-white">
              <Link to="/palace">
                Start Learning
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
