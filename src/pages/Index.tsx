import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Building2, BookOpen, Lightbulb, Crown, Sparkles, Layers, Zap, Scale, Telescope, Search, Image, Film, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(262,83%,58%,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(340,82%,62%,0.15),transparent_50%)]" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-sunset border-2 border-white/20 mb-8 shadow-pink animate-fade-in hover:scale-105 transition-transform">
            <Building2 className="h-4 w-4 text-white animate-float" />
            <span className="text-sm font-semibold text-white">The Palace of Biblical Wisdom</span>
            <Sparkles className="h-4 w-4 text-white animate-pulse-glow" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-palace bg-clip-text text-transparent animate-slide-up drop-shadow-2xl">
            Phototheology
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground mb-10 leading-relaxed max-w-2xl mx-auto font-medium animate-fade-in">
            Transform Bible study into a <span className="text-primary font-bold">palace of meaning</span>. 
            Store Scripture as <span className="text-secondary font-bold">vivid images</span>, patterns, 
            and structures through an <span className="text-accent font-bold">8-floor, 38-room</span> method.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button asChild size="lg" className="gradient-palace text-white shadow-purple hover:shadow-glow hover:scale-105 transition-all">
              <Link to="/palace">
                <Building2 className="mr-2 h-5 w-5" />
                Explore the Palace
              </Link>
            </Button>
            <Button asChild size="lg" className="gradient-ocean text-white shadow-blue hover:shadow-hover hover:scale-105 transition-all">
              <Link to="/bible/John/3">
                <BookOpen className="mr-2 h-5 w-5" />
                Read the Bible
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-block p-3 gradient-royal rounded-2xl shadow-blue mb-4">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 bg-gradient-royal bg-clip-text text-transparent">
              The Vision
            </h2>
          </div>
          
          <div className="space-y-6 text-lg leading-relaxed">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 hover-lift">
              <p className="text-foreground">
                Phototheology exists because the Bible is not only a book of words; it is a book of{" "}
                <span className="font-bold text-primary">images, symbols, and living stories</span>. 
                God has always taught visually and narratively—Adam clothed in skins, 
                Noah's rainbow, Abraham's stars, Moses' sanctuary, Jesus' parables, John's Revelation movie.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-r from-secondary/10 to-accent/10 border-2 border-secondary/20 hover-lift">
              <p className="text-foreground">
                Phototheology restores that method. It teaches you to store Scripture as{" "}
                <span className="font-bold text-secondary">images, patterns, and structures</span>. 
                Instead of random notes scattered across a page, your mind becomes a{" "}
                <em className="text-primary font-semibold">palace of meaning</em>, 
                with every story, verse, and prophecy stored in its proper chamber.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl gradient-sunset text-white text-center shadow-pink hover:shadow-glow transition-all">
              <Sparkles className="h-10 w-10 mx-auto mb-4 animate-float" />
              <p className="font-semibold text-xl">
                The vision is not just information—it is <strong className="text-2xl">formation</strong>.
              </p>
              <p className="mt-3">
                Think Phototheologically: reflexively seeing Christ in all Scripture, 
                instinctively mapping verses into cycles, instantly recalling patterns and prophecies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 gradient-dreamy">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block p-3 gradient-warmth rounded-2xl shadow-pink mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 bg-gradient-sunset bg-clip-text text-transparent">
              The Eight-Floor Method
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each floor builds upon the last, creating a complete system for biblical mastery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-card border-2 border-primary/30 hover-lift hover:border-primary shadow-purple group">
              <div className="w-14 h-14 rounded-2xl gradient-palace flex items-center justify-center mb-4 shadow-purple group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-primary">Floors 1-2</h3>
              <p className="text-sm text-foreground leading-relaxed">
                <strong className="text-primary">Furnishing & Investigation</strong> — Fill your shelves with stories 
                and become a detective of the Word.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border-2 border-secondary/30 hover-lift hover:border-secondary shadow-pink group">
              <div className="w-14 h-14 rounded-2xl gradient-sunset flex items-center justify-center mb-4 shadow-pink group-hover:scale-110 transition-transform">
                <Lightbulb className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-secondary">Floors 3-4</h3>
              <p className="text-sm text-foreground leading-relaxed">
                <strong className="text-secondary">Freestyle & Next Level</strong> — Connect Scripture to daily life 
                and expand through Christ-centered dimensions.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border-2 border-palace-blue/30 hover-lift hover:border-palace-blue shadow-blue group">
              <div className="w-14 h-14 rounded-2xl gradient-ocean flex items-center justify-center mb-4 shadow-blue group-hover:scale-110 transition-transform">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-palace-blue">Floors 5-6</h3>
              <p className="text-sm text-foreground leading-relaxed">
                <strong className="text-palace-blue">Vision & Horizons</strong> — Open the prophetic telescope; 
                see sanctuary, feasts, cycles, and cosmic dimensions.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border-2 border-accent/30 hover-lift hover:border-accent shadow-pink group">
              <div className="w-14 h-14 rounded-2xl gradient-warmth flex items-center justify-center mb-4 shadow-pink group-hover:scale-110 transition-transform">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-accent">Floors 7-8</h3>
              <p className="text-sm text-foreground leading-relaxed">
                <strong className="text-accent">Spiritual & Master</strong> — Bring heart into fire, 
                then let the palace become reflexive thought.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Modes Section */}
      <section className="py-20 px-4 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border-2 border-accent/20 mb-4">
              <Sparkles className="h-4 w-4 text-accent animate-pulse-glow" />
              <span className="text-sm font-semibold text-accent">Floor 0 - Advanced Modes</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 bg-gradient-royal bg-clip-text text-transparent">
              AI-Powered Study Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized tools for deep analysis and real-world application
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/culture-controversy" className="group">
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-2 border-red-200 dark:border-red-800 hover-lift hover:border-red-500 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Scale className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Culture & Controversy</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Analyze current events, cultural movements, and political topics through the clear lens of Jesus' teachings.
                </p>
              </div>
            </Link>
            
            <Link to="/prophecy-watch" className="group">
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800 hover-lift hover:border-blue-500 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Telescope className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Prophecy Watch</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Monitoring signals of end-time events. Watching for the fulfillment of Daniel and Revelation.
                </p>
              </div>
            </Link>
            
            <Link to="/research-mode" className="group">
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-indigo-900 border-2 border-blue-200 dark:border-blue-800 hover-lift hover:border-blue-500 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Research Mode</h3>
                <p className="text-foreground/80 leading-relaxed">
                  An AI-powered assistant for deep biblical study with comprehensive, scholarly research.
                </p>
              </div>
            </Link>
            
            <Link to="/bible-image-library" className="group">
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-200 dark:border-purple-800 hover-lift hover:border-purple-500 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Image className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Bible Image Library</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Create and manage AI-generated visual interpretations of Scripture for Translation and 24FPS rooms.
                </p>
              </div>
            </Link>
            
            <Link to="/sermon-builder" className="group">
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-2 border-orange-200 dark:border-orange-800 hover-lift hover:border-orange-500 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Film className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Sermon Builder</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Build powerful sermons using the Movie-Model Approach with 5 Smooth Stones methodology.
                </p>
              </div>
            </Link>
            
            <Link to="/flashcards" className="group">
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-2 border-green-200 dark:border-green-800 hover-lift hover:border-green-500 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Flashcards</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Master Bible knowledge through AI-generated and custom interactive study cards.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-card/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(262,83%,58%,0.1),transparent_70%)]" />
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="inline-block p-4 gradient-palace rounded-3xl shadow-glow mb-6 animate-float">
            <Building2 className="h-12 w-12 text-white" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 bg-gradient-palace bg-clip-text text-transparent">
            Enter the Palace
          </h2>
          
          <p className="text-lg md:text-xl text-foreground mb-10 leading-relaxed font-medium">
            Each floor has its own discipline. Together they form a <span className="text-primary font-bold">complete method</span> of Bible study 
            that combines <span className="text-secondary font-bold">memory</span>, <span className="text-palace-blue font-bold">imagination</span>, 
            <span className="text-accent font-bold">theology</span>, <span className="text-palace-teal font-bold">prophecy</span>, 
            and <span className="text-palace-orange font-bold">devotion</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-palace text-white shadow-purple hover:shadow-glow hover:scale-105 transition-all">
              <Link to="/palace">
                <Building2 className="mr-2 h-5 w-5" />
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
