import { useState } from "react";
import { Headphones, Play, Mic2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VOICE_SUITE = [
  { id: "epic", label: "Epic Narrator", emoji: "🎬", description: "Cinematic, sweeping narration", color: "hsl(38 65% 55%)" },
  { id: "urban", label: "Modern Preacher", emoji: "🎤", description: "Raw, real-talk energy", color: "hsl(200 70% 55%)" },
  { id: "counselor", label: "Counselor", emoji: "💬", description: "Warm, empathetic guidance", color: "hsl(160 55% 50%)" },
  { id: "ancient", label: "Ancient Voice", emoji: "📜", description: "Authoritative, solemn tone", color: "hsl(30 50% 50%)" },
  { id: "preacher", label: "Preacher", emoji: "🔥", description: "Pulpit-ready conviction", color: "hsl(0 65% 55%)" },
  { id: "scholar", label: "Scholar", emoji: "🎓", description: "Analytical, scholarly depth", color: "hsl(220 55% 55%)" },
  { id: "kids", label: "Kids Adventure", emoji: "🧒", description: "Wonder-filled for ages 8–12", color: "hsl(280 55% 55%)" },
  { id: "mirror", label: "Mirror", emoji: "🪞", description: "Personal application — the 'Me' dimension", color: "hsl(300 45% 55%)" },
];

export default function BasicAudioTab() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2"
            style={{ background: "hsl(220 10% 15%)" }}>
            <Headphones className="h-7 w-7" style={{ color: "hsl(38 65% 60%)" }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "hsl(220 10% 92%)" }}>Audio Commentary Suite</h2>
          <p className="text-sm" style={{ color: "hsl(220 10% 50%)" }}>
            8 unique voices, each illuminating Scripture from a different angle.
          </p>
        </div>

        {/* Voice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VOICE_SUITE.map((voice) => (
            <button
              key={voice.id}
              onClick={() => navigate("/audio-library")}
              className="flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all hover:brightness-110"
              style={{
                background: "hsl(220 13% 10%)",
                borderColor: "hsl(220 10% 18%)",
              }}
            >
              <div className="text-2xl shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
                style={{ background: `${voice.color}18` }}>
                {voice.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: "hsl(220 10% 88%)" }}>
                  {voice.label}
                </div>
                <div className="text-xs" style={{ color: "hsl(220 10% 50%)" }}>
                  {voice.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/audio-library")}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "hsl(38 65% 55% / 0.15)",
              color: "hsl(38 65% 65%)",
              border: "1px solid hsl(38 65% 55% / 0.25)",
            }}
          >
            <BookOpen className="h-4 w-4" />
            Open Full Audio Library
          </button>
        </div>
      </div>
    </div>
  );
}
