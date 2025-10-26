import { ArrowRight, BookOpen, Brain, Sparkles, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ModernDesignShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section with Glass Morphism */}
      <section className="relative overflow-hidden px-4 py-20">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Modern UI Design</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Beyond Block Colors
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience depth, motion, and sophistication with modern design patterns
            </p>

            <div className="flex gap-4 justify-center">
              <Button size="lg" className="group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-background/80">
                Learn More
              </Button>
            </div>
          </div>

          {/* Glass Morphism Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "Deep Learning", desc: "Master the palace method with AI" },
              { icon: Target, title: "Focused Study", desc: "Track progress across 8 floors" },
              { icon: Zap, title: "Quick Recall", desc: "Instant access to 51 rendered sets" }
            ].map((item, idx) => (
              <Card 
                key={idx}
                className="group relative overflow-hidden border-primary/10 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                  
                  <Button variant="ghost" size="sm" className="group/btn">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Modern Layout Patterns
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Large feature card */}
          <Card className="md:col-span-2 md:row-span-2 p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 hover:border-primary/40 transition-all group">
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold">Interactive Palace</h3>
                <p className="text-muted-foreground text-lg">
                  Navigate through 8 floors of biblical wisdom with smooth transitions and delightful micro-interactions
                </p>
              </div>
              <Button className="mt-6 w-full group-hover:shadow-lg group-hover:shadow-primary/25 transition-all">
                Enter Palace
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          {/* Stat cards */}
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-green-600 mb-2">1,200+</div>
            <div className="text-sm text-muted-foreground">Bible Chapters Rendered</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-blue-600 mb-2">66</div>
            <div className="text-sm text-muted-foreground">Books Visualized</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-purple-600 mb-2">8</div>
            <div className="text-sm text-muted-foreground">Palace Floors</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20 hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-orange-600 mb-2">51</div>
            <div className="text-sm text-muted-foreground">Rendered Sets</div>
          </Card>
        </div>
      </section>

      {/* Floating Action Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-2xl shadow-primary/25 mb-4">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <h2 className="text-4xl font-bold">
              Ready to Experience Modern Design?
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These patterns use gradients, glass morphism, smooth shadows, and micro-interactions to create depth and engagement
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" className="shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all">
                Apply to App
              </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-sm">
                View Code
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}