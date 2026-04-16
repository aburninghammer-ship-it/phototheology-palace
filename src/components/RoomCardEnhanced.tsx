import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Room } from "@/data/palaceData";
import {
  Sparkles, BookOpen, Target, Lightbulb, Clock, Zap,
  ChevronDown, ChevronUp, Play, CheckCircle2, AlertTriangle, Lock as LockIcon
} from "lucide-react";
import * as Icons from "lucide-react";
import { JeevesAssistant } from "@/components/JeevesAssistant";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface RoomCardEnhancedProps {
  room: Room;
  floorNumber: number;
}

const roomGradients = [
  ["gradient-palace", "gradient-royal", "gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-forest"],
  ["gradient-royal", "gradient-ocean", "gradient-forest", "gradient-sunset", "gradient-warmth"],
  ["gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-forest", "gradient-dreamy"],
  ["gradient-sunset", "gradient-warmth", "gradient-palace", "gradient-royal", "gradient-ocean", "gradient-forest", "gradient-dreamy", "gradient-sunset"],
  ["gradient-warmth", "gradient-palace", "gradient-royal", "gradient-ocean", "gradient-sunset", "gradient-forest"],
  ["gradient-forest", "gradient-ocean", "gradient-dreamy"],
  ["gradient-dreamy", "gradient-palace", "gradient-sunset"],
  ["gradient-palace"]
];

const timeEstimates = {
  quick: { label: "Quick", time: "5 min", icon: Zap, color: "text-green-600" },
  standard: { label: "Standard", time: "15 min", icon: Clock, color: "text-blue-600" },
  deep: { label: "Deep Dive", time: "30+ min", icon: BookOpen, color: "text-purple-600" }
};

export const RoomCardEnhanced = ({ room, floorNumber }: RoomCardEnhancedProps) => {
  const gradients = roomGradients[floorNumber - 1] || ["gradient-palace"];
  const roomIndex = room.id.charCodeAt(0) % gradients.length;
  const gradient = gradients[roomIndex];

  // Rooms are never locked
  const isUnlocked = true;

  const [methodExpanded, setMethodExpanded] = useState(false);
  const [pitfallsExpanded, setPitfallsExpanded] = useState(false);

  const timeInfo = room.estimatedTime ? timeEstimates[room.estimatedTime] : timeEstimates.standard;
  const TimeIcon = timeInfo.icon;

  // Get the icon component
  const RoomIcon = room.icon && Icons[room.icon as keyof typeof Icons]
    ? (Icons[room.icon as keyof typeof Icons] as any)
    : BookOpen;

  return (
    <div className="grid lg:grid-cols-3 gap-8 p-1">
      {/* Room Details */}
      <div className="lg:col-span-2">
        <Card className={`group relative overflow-hidden border-2 transition-all duration-500 animate-scale-in
          hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1
          bg-gradient-to-br from-card via-card/95 to-muted/30 backdrop-blur-sm`}>
          
          {/* Animated gradient border */}
          <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          <div className={`h-1.5 ${gradient} shadow-glow`} />
          
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className={`p-3 rounded-xl ${gradient} shadow-elegant transform group-hover:scale-110 transition-transform duration-300`}>
                    <RoomIcon className="h-5 w-5 text-white" />
                  </div>
                  <Badge className={`${gradient} text-white font-mono text-sm px-3 py-1.5 shadow-elegant transform group-hover:scale-105 transition-transform duration-300`}>
                    {room.tag}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1.5 border-2 px-3 py-1.5 bg-background/50 backdrop-blur-sm">
                    <TimeIcon className={`h-4 w-4 ${timeInfo.color}`} />
                    <span className="text-sm font-medium">{timeInfo.time}</span>
                  </Badge>
                </div>
                <CardTitle className="font-serif text-3xl lg:text-4xl group-hover:text-primary transition-all duration-300 flex items-center gap-3 leading-tight">
                  {!isUnlocked && <LockIcon className="h-6 w-6 text-destructive animate-pulse" />}
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{room.name}</span>
                  {isUnlocked && <Sparkles className="h-6 w-6 text-accent opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-relaxed border-l-4 border-primary/30 pl-4 py-2">
              {room.coreQuestion}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 3-Line Header: Purpose → Action → Output */}
            <div className="grid gap-4">
              {/* Purpose */}
              <div className="group/card p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 rounded-2xl border-2 border-primary/30 shadow-elegant hover:shadow-glow hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/20 rounded-lg group-hover/card:scale-110 transition-transform duration-300">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-bold text-base text-foreground tracking-wide">Purpose</h4>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed pl-11">{room.purpose}</p>
              </div>
              
              {/* Action */}
              {room.action && (
                <div className="group/card p-5 bg-gradient-to-br from-accent/10 via-accent/5 to-blue-500/5 rounded-2xl border-2 border-accent/30 shadow-elegant hover:shadow-glow hover:border-accent/50 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-accent/20 rounded-lg group-hover/card:scale-110 transition-transform duration-300">
                      <Play className="h-5 w-5 text-accent" />
                    </div>
                    <h4 className="font-bold text-base text-foreground tracking-wide">Action</h4>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed pl-11">{room.action}</p>
                </div>
              )}
              
              {/* Output */}
              {room.output && (
                <div className="group/card p-5 bg-gradient-to-br from-green-500/10 via-green-500/5 to-emerald-500/5 rounded-2xl border-2 border-green-500/30 shadow-elegant hover:shadow-glow hover:border-green-500/50 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg group-hover/card:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-bold text-base text-foreground tracking-wide">Output</h4>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed pl-11">{room.output}</p>
                </div>
              )}
            </div>

            {/* Quick Mode (if available) */}
            {room.quickMode && (
              <div className="group/quick p-6 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-orange-500/5 rounded-2xl border-2 border-yellow-500/30 shadow-elegant hover:shadow-glow hover:border-yellow-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-yellow-500/20 rounded-lg group-hover/quick:scale-110 group-hover/quick:rotate-12 transition-all duration-300">
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h4 className="font-bold text-base text-foreground tracking-wide">Quick Mode <span className="text-yellow-600">(30 seconds)</span></h4>
                </div>
                <ol className="space-y-3 ml-2">
                  {room.quickMode.map((step, idx) => (
                    <li key={idx} className="text-sm text-foreground/80 flex gap-3 items-start group/step">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white font-bold flex items-center justify-center text-xs shadow-md group-hover/step:scale-110 transition-transform duration-200">
                        {idx + 1}
                      </span>
                      <span className="flex-1 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            
            {/* Examples Section */}
            {room.examples.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-base text-foreground flex items-center gap-2.5">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <span className="tracking-wide">Examples</span>
                </h4>
                <div className="space-y-3">
                  {room.examples.slice(0, 2).map((example, idx) => (
                    <div
                      key={idx}
                      className="group/example p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-border/50 hover:border-primary/30 hover:bg-muted/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <p className="text-sm text-foreground/80 flex gap-3 leading-relaxed">
                        <span className="text-primary font-bold text-lg flex-shrink-0 group-hover/example:scale-125 transition-transform duration-200">→</span>
                        <span className="flex-1">{example}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Progressive Disclosure: Method */}
            <Collapsible open={methodExpanded} onOpenChange={setMethodExpanded}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-auto py-4 px-5 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:shadow-md group/method"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover/method:scale-110 transition-transform duration-300">
                      <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-base">Full Method & Steps</span>
                  </div>
                  {methodExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 animate-accordion-down">
                <div className="p-6 bg-gradient-to-br from-muted/60 to-muted/40 rounded-2xl border-2 border-border/50 shadow-inner">
                  <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">
                    {room.method}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Progressive Disclosure: Pitfalls */}
            {room.pitfalls.length > 0 && (
              <Collapsible open={pitfallsExpanded} onOpenChange={setPitfallsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-auto py-4 px-5 border-2 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 hover:shadow-md group/pitfall"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg group-hover/pitfall:scale-110 transition-transform duration-300">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="font-semibold text-base">Common Mistakes to Avoid</span>
                    </div>
                    {pitfallsExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 animate-accordion-down">
                  <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-2xl border-2 border-orange-500/30 shadow-inner">
                    <ul className="space-y-3">
                      {room.pitfalls.map((pitfall, idx) => (
                        <li key={idx} className="text-sm text-foreground/80 flex gap-3 items-start group/pitfallitem">
                          <span className="text-orange-600 text-xl flex-shrink-0 group-hover/pitfallitem:scale-125 transition-transform duration-200">⚠</span>
                          <span className="flex-1 leading-relaxed pt-0.5">{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Jeeves Assistant for this room */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          {isUnlocked ? (
            <div className="animate-fade-in">
              <JeevesAssistant
                roomTag={room.tag}
                roomName={room.name}
                principle={room.purpose.split('.')[0]}
                floorNumber={floorNumber}
                roomId={room.id}
              />
            </div>
          ) : (
            <Card className="relative overflow-hidden border-2 border-border/50 bg-gradient-to-br from-muted/40 to-muted/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/60 to-muted/30 opacity-50" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-muted rounded-lg">
                    <LockIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="font-serif">Locked</span>
                </CardTitle>
                <CardDescription className="text-base leading-relaxed pt-2">
                  Complete prerequisite rooms to unlock Jeeves for this room and access personalized AI guidance.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
