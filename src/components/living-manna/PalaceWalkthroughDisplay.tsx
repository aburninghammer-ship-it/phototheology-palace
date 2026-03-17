import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import {
  Sparkles, Eye, BookOpen, Target, Layers, Brain, Gem, Film,
  Flame, Clock, Telescope, Link2, Scale, Crown, Heart, Scroll,
  Image as ImageIcon
} from "lucide-react";

// Room code → visual config
const ROOM_STYLES: Record<string, { icon: any; gradient: string; accent: string; label: string }> = {
  'SR':   { icon: Film,      gradient: 'from-violet-500/20 to-purple-500/10', accent: 'text-violet-400', label: 'Story Room' },
  'IR':   { icon: Eye,       gradient: 'from-purple-500/20 to-fuchsia-500/10', accent: 'text-purple-400', label: 'Imagination Room' },
  '24F':  { icon: Film,      gradient: 'from-indigo-500/20 to-violet-500/10', accent: 'text-indigo-400', label: '24FPS Room' },
  'BR':   { icon: ImageIcon, gradient: 'from-blue-500/20 to-indigo-500/10', accent: 'text-blue-400', label: 'Bible Rendered' },
  'TR':   { icon: Scroll,    gradient: 'from-cyan-500/20 to-blue-500/10', accent: 'text-cyan-400', label: 'Translation Room' },
  'GR':   { icon: Gem,       gradient: 'from-amber-500/20 to-yellow-500/10', accent: 'text-amber-400', label: 'Gems Room' },
  'OR':   { icon: Eye,       gradient: 'from-blue-500/20 to-sky-500/10', accent: 'text-blue-400', label: 'Observation Room' },
  'DC':   { icon: BookOpen,  gradient: 'from-indigo-500/20 to-blue-500/10', accent: 'text-indigo-400', label: 'Def-Com Room' },
  'ST':   { icon: Target,    gradient: 'from-teal-500/20 to-cyan-500/10', accent: 'text-teal-400', label: 'Symbols/Types' },
  'QR':   { icon: Brain,     gradient: 'from-sky-500/20 to-blue-500/10', accent: 'text-sky-400', label: 'Questions Room' },
  'QA':   { icon: Link2,     gradient: 'from-blue-500/20 to-indigo-500/10', accent: 'text-blue-400', label: 'Q&A Room' },
  'CR':   { icon: Crown,     gradient: 'from-green-500/20 to-emerald-500/10', accent: 'text-green-400', label: 'Concentration Room' },
  'DR':   { icon: Layers,    gradient: 'from-emerald-500/20 to-green-500/10', accent: 'text-emerald-400', label: 'Dimensions Room' },
  'C6':   { icon: BookOpen,  gradient: 'from-teal-500/20 to-green-500/10', accent: 'text-teal-400', label: 'Connect 6' },
  'TRm':  { icon: Target,    gradient: 'from-lime-500/20 to-green-500/10', accent: 'text-lime-400', label: 'Theme Room' },
  'TZ':   { icon: Clock,     gradient: 'from-green-500/20 to-teal-500/10', accent: 'text-green-400', label: 'Time Zone Room' },
  'PRm':  { icon: Layers,    gradient: 'from-emerald-500/20 to-teal-500/10', accent: 'text-emerald-400', label: 'Patterns Room' },
  'P||':  { icon: Scale,     gradient: 'from-green-500/20 to-lime-500/10', accent: 'text-green-400', label: 'Parallels Room' },
  'FRt':  { icon: Heart,     gradient: 'from-rose-500/20 to-pink-500/10', accent: 'text-rose-400', label: 'Fruit Room' },
  'BL':   { icon: Telescope, gradient: 'from-orange-500/20 to-amber-500/10', accent: 'text-orange-400', label: 'Blue Room (Sanctuary)' },
  'PR':   { icon: Telescope, gradient: 'from-amber-500/20 to-orange-500/10', accent: 'text-amber-400', label: 'Prophecy Room' },
  '3A':   { icon: Sparkles,  gradient: 'from-yellow-500/20 to-amber-500/10', accent: 'text-yellow-400', label: 'Three Angels' },
  'FE':   { icon: Crown,     gradient: 'from-orange-500/20 to-yellow-500/10', accent: 'text-orange-400', label: 'Feasts Room' },
  'FRm':  { icon: Flame,     gradient: 'from-red-500/20 to-rose-500/10', accent: 'text-red-400', label: 'Fire Room' },
  'MR':   { icon: Brain,     gradient: 'from-pink-500/20 to-fuchsia-500/10', accent: 'text-pink-400', label: 'Meditation Room' },
  'SRm':  { icon: Sparkles,  gradient: 'from-fuchsia-500/20 to-pink-500/10', accent: 'text-fuchsia-400', label: 'Speed Room' },
  'CEC':  { icon: Crown,     gradient: 'from-green-500/20 to-emerald-500/10', accent: 'text-green-400', label: 'Christ Every Chapter' },
  'R66':  { icon: BookOpen,  gradient: 'from-emerald-500/20 to-green-500/10', accent: 'text-emerald-400', label: 'Room 66' },
};

// Try to detect room code from heading text like "1. SR - Story Room" or "### 5. BL - Blue Room"
function detectRoomCode(heading: string): string | null {
  // Match patterns like "SR -", "CR -", "P|| -", "3A -", "24F -", etc.
  const match = heading.match(/\b(SR|IR|24F|BR|TR|GR|OR|DC|ST|QR|QA|CR|DR|C6|TRm|TZ|PRm|P\|\||FRt|BL|PR|3A|FE|FRm|MR|SRm|CEC|R66)\b/);
  return match ? match[1] : null;
}

interface PalaceWalkthroughDisplayProps {
  content: string;
}

export function PalaceWalkthroughDisplay({ content }: PalaceWalkthroughDisplayProps) {
  // Split by ### headings to create sections
  const sections = content.split(/(?=^### )/m).filter(s => s.trim());

  if (sections.length <= 1) {
    // Fallback: no sections detected, render as styled markdown
    return (
      <Card variant="glass" className="border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Full Palace Walkthrough
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StyledMarkdown content={content} />
        </CardContent>
      </Card>
    );
  }

  // Separate intro (non-### content) from room sections
  const introSection = sections[0].startsWith('###') ? null : sections[0];
  const roomSections = sections.filter(s => s.startsWith('###'));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
          <Crown className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Full Palace Walkthrough</h3>
          <p className="text-xs text-muted-foreground">Every room illuminated • Phototheology deep analysis</p>
        </div>
      </div>

      {/* Intro */}
      {introSection && (
        <Card variant="glass" className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-5">
            <StyledMarkdown content={introSection} className="text-sm" />
          </CardContent>
        </Card>
      )}

      {/* Room Sections */}
      <div className="space-y-3">
        {roomSections.map((section, idx) => {
          const lines = section.split('\n');
          const headingLine = lines[0].replace(/^###\s*/, '').trim();
          const bodyContent = lines.slice(1).join('\n').trim();
          const roomCode = detectRoomCode(headingLine);
          const style = roomCode ? ROOM_STYLES[roomCode] : null;
          const Icon = style?.icon || Sparkles;

          return (
            <Card
              key={idx}
              variant="glass"
              className={`overflow-hidden border transition-all hover:border-primary/40 ${
                style ? 'border-primary/20' : 'border-border/50'
              }`}
            >
              {/* Color accent bar */}
              <div className={`h-1 bg-gradient-to-r ${style?.gradient || 'from-primary/30 to-accent/30'}`} />

              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${style?.gradient || 'from-primary/20 to-accent/20'}`}>
                    <Icon className={`h-4 w-4 ${style?.accent || 'text-primary'}`} />
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CardTitle className="text-sm font-bold text-foreground truncate">
                      {headingLine}
                    </CardTitle>
                    {roomCode && (
                      <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                        {roomCode}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <StyledMarkdown content={bodyContent} className="text-sm leading-relaxed" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}