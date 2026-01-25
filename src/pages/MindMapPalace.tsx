import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { MindMapPalace as MindMapPalaceComponent } from '@/components/mind-map';
import { Sparkles, Network, Brain } from 'lucide-react';

export default function MindMapPalacePage() {
  const [searchParams] = useSearchParams();
  const initialText = searchParams.get('text') || '';
  const initialMode = (searchParams.get('mode') as any) || 'scholar';

  return (
    <>
      <Helmet>
        <title>Mind Map Palace - Phototheology</title>
        <meta
          name="description"
          content="Map any text to the 8-floor Phototheology Palace framework. Discover Christ-centered patterns, sanctuary connections, and deeper insights."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-palace-purple/5 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gradient-to-br from-palace-purple/20 to-palace-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-palace-blue/15 to-palace-teal/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/40 rounded-full animate-float" />
          <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-accent/40 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 right-1/4 w-5 h-5 bg-palace-purple/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Header */}
        <div className="relative border-b border-white/10 bg-card/30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-50" />
                <div className="relative p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-white/20 backdrop-blur-sm">
                  <Network className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-cinzel text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Mind Map Palace
                  </h1>
                  <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Brain className="w-4 h-4" />
                  Map any text to the Phototheology framework
                </p>
              </div>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['8 Palace Floors', 'Sanctuary Mapping', 'AI-Powered', 'Christ-Centered'].map((badge, i) => (
                <span
                  key={badge}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-muted-foreground backdrop-blur-sm"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative h-[calc(100vh-140px)]">
          <MindMapPalaceComponent
            initialText={initialText}
            initialMode={initialMode}
          />
        </div>
      </div>
    </>
  );
}
