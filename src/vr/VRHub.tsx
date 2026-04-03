import React, { useState } from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import type { VRExperience } from './VRLobby';

const VRCanvas = React.lazy(() => import('./VRCanvas'));

class VRErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <h2 className="text-xl font-bold text-foreground">WebGL Not Available</h2>
          <p className="text-muted-foreground max-w-md">
            The VR experience requires WebGL which isn't available in this preview.
            Open this page on a Meta Quest 3 browser or a WebGL-capable desktop browser.
          </p>
          <p className="text-xs text-muted-foreground/60 font-mono">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ExperienceCard {
  id: VRExperience;
  name: string;
  icon: string;
  description: string;
  color: string;
}

const EXPERIENCES: ExperienceCard[] = [
  { id: 'sanctuary', name: 'The Sanctuary', icon: '🕯️', description: 'Walk through the Tabernacle in 3D — from the outer court to the Most Holy Place', color: 'from-amber-500/20 to-amber-900/20 border-amber-500/30' },
  { id: 'gallery', name: '24FPS Gallery', icon: '🎬', description: 'A spatial cinema corridor for sacred visual media', color: 'from-blue-500/20 to-blue-900/20 border-blue-500/30' },
  { id: 'audio', name: 'Audio Theater', icon: '🎧', description: 'Immersive spatial audio for commentaries, devotionals, and music', color: 'from-purple-500/20 to-purple-900/20 border-purple-500/30' },
  { id: 'heavensDiary', name: "Heaven's Diary", icon: '📖', description: 'A sacred journaling space surrounded by scripture', color: 'from-cyan-500/20 to-cyan-900/20 border-cyan-500/30' },
  { id: 'arcade', name: 'Game Arcade', icon: '🎮', description: 'Scripture memory games and Bible trivia in VR', color: 'from-green-500/20 to-green-900/20 border-green-500/30' },
  { id: 'palace', name: 'Palace Tour', icon: '🏛️', description: 'Guided tour through the Phototheology memory palace', color: 'from-orange-500/20 to-orange-900/20 border-orange-500/30' },
  { id: 'nightWatch', name: 'Night Watch', icon: '🌙', description: 'Meditative starfield environment for Night Watch audio sessions', color: 'from-indigo-500/20 to-indigo-900/20 border-indigo-500/30' },
  { id: 'morningWatch', name: 'Morning Watch', icon: '🌅', description: 'Sunrise activation space for Morning Watch sessions', color: 'from-amber-400/20 to-rose-900/20 border-amber-400/30' },
  { id: 'swordOfTheSpirit', name: 'Sword of the Spirit', icon: '⚔️', description: 'Slash lies, catch truth — collect the Armor of God', color: 'from-red-500/20 to-red-900/20 border-red-500/30' },
];

export default function VRHub() {
  const [selectedExperience, setSelectedExperience] = useState<VRExperience | null>(null);

  if (selectedExperience) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: '#000',
        }}
      >
        {/* Back button overlay */}
        <button
          onClick={() => setSelectedExperience(null)}
          className="absolute top-4 left-4 z-[10000] flex items-center gap-2 px-4 py-2 rounded-lg bg-black/70 border border-white/20 text-white/80 hover:text-white hover:bg-black/90 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hub
        </button>
        <VRErrorBoundary>
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
              </div>
            }
          >
            <VRCanvas initialExperience={selectedExperience} onBackToHub={() => setSelectedExperience(null)} />
          </React.Suspense>
        </VRErrorBoundary>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060818] text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            PhototheologyOS VR
          </h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Sacred spaces reimagined in three dimensions. Select an experience to enter.
          </p>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {EXPERIENCES.map((exp) => (
            <button
              key={exp.id}
              onClick={() => setSelectedExperience(exp.id)}
              className={`group text-left p-5 rounded-xl bg-gradient-to-br ${exp.color} border backdrop-blur-sm hover:scale-[1.02] transition-all duration-200`}
            >
              <span className="text-3xl block mb-3">{exp.icon}</span>
              <h3 className="font-semibold text-white mb-1">{exp.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{exp.description}</p>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="text-center text-white/30 text-xs">
          <p>Open on Meta Quest 3 for full VR immersion. Desktop users can explore with mouse controls.</p>
        </div>
      </div>
    </div>
  );
}
