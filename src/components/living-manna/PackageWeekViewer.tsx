import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft, BookOpen, ChevronRight, ChevronLeft, MessageSquare,
  Target, Flame, Lightbulb, CheckCircle, Star, Brain
} from "lucide-react";
import type { DiscipleshipPackage, PackageWeek } from "@/data/discipleshipPackages/types";

interface PackageWeekViewerProps {
  pkg: DiscipleshipPackage;
  currentWeek: number;
  completedWeeks: number[];
  onCompleteWeek: (weekNumber: number) => void;
  onBack: () => void;
}

const SANCTUARY_COLORS: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  "Altar of Incense": { bg: "from-purple-500/10 to-violet-500/10", border: "border-purple-500/30", text: "text-purple-400", accent: "bg-purple-500" },
  "Table of Showbread": { bg: "from-amber-500/10 to-orange-500/10", border: "border-amber-500/30", text: "text-amber-400", accent: "bg-amber-500" },
  "Candlestick": { bg: "from-yellow-500/10 to-amber-500/10", border: "border-yellow-500/30", text: "text-yellow-400", accent: "bg-yellow-500" },
};

export function PackageWeekViewer({ pkg, currentWeek, completedWeeks, onCompleteWeek, onBack }: PackageWeekViewerProps) {
  const [viewingWeek, setViewingWeek] = useState<number>(currentWeek);
  const week = pkg.weeks.find(w => w.weekNumber === viewingWeek);
  const colors = SANCTUARY_COLORS[pkg.sanctuaryFurniture] || SANCTUARY_COLORS["Altar of Incense"];
  const isCompleted = completedWeeks.includes(viewingWeek);
  const canComplete = viewingWeek === currentWeek && !isCompleted;

  if (!week) return null;

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-foreground">{line.replace('### ', '')}</h3>;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, '')}</p>;
      } else if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-foreground/80">{line.replace('- ', '')}</li>;
      } else if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={i} className="italic text-foreground/70">{line.replace(/\*/g, '')}</p>;
      } else if (line.trim() === '') {
        return <br key={i} />;
      } else {
        return <p key={i} className="text-foreground/80 mb-2">{line}</p>;
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {pkg.title}
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={viewingWeek <= 1}
            onClick={() => setViewingWeek(v => v - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[100px] text-center">
            Week {viewingWeek} of 12
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={viewingWeek >= 12}
            onClick={() => setViewingWeek(v => v + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Content */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-6 pr-4">
          {/* Week Header Card */}
          <Card variant="glass" className={`${colors.border} bg-gradient-to-br ${colors.bg}`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Badge variant="outline" className="font-bold">Week {week.weekNumber}</Badge>
                <Badge className={`${colors.accent} text-white`}>
                  {week.sanctuaryElement}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{week.title}</CardTitle>
            </CardHeader>
          </Card>

          {/* Scripture Focus */}
          <Card variant="glass">
            <CardContent className="pt-6">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <BookOpen className={`h-4 w-4 ${colors.text}`} />
                Scripture Focus
              </h4>
              <div className="flex flex-wrap gap-2">
                {week.scriptureFocus.map((ref, i) => (
                  <Badge key={i} variant="outline" className={colors.border}>
                    {ref}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Memory Verse */}
          <Card variant="glass" className={`${colors.border} bg-gradient-to-br ${colors.bg}`}>
            <CardContent className="pt-6">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Brain className={`h-4 w-4 ${colors.text}`} />
                Memory Verse
              </h4>
              <blockquote className="italic text-foreground/90 border-l-4 border-primary/50 pl-4 py-2">
                {week.memoryVerse}
              </blockquote>
            </CardContent>
          </Card>

          {/* Teaching Content */}
          <Card variant="glass">
            <CardContent className="pt-6">
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <Lightbulb className={`h-4 w-4 ${colors.text}`} />
                Teaching
              </h4>
              <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed">
                {renderContent(week.teachingContent)}
              </div>
            </CardContent>
          </Card>

          {/* Discussion Questions */}
          <Card variant="glass">
            <CardContent className="pt-6">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <MessageSquare className={`h-4 w-4 ${colors.text}`} />
                Discussion Questions
              </h4>
              <ol className="space-y-3">
                {week.discussionQuestions.map((question, idx) => (
                  <li key={idx} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                    <span className={`font-bold shrink-0 ${colors.text}`}>{idx + 1}.</span>
                    <span className="text-sm text-foreground/80">{question}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Palace Room Connections */}
          {week.palaceRoomConnections.length > 0 && (
            <Card variant="glass">
              <CardContent className="pt-6">
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Star className={`h-4 w-4 ${colors.text}`} />
                  Palace Room Connections
                </h4>
                <div className="flex flex-wrap gap-2">
                  {week.palaceRoomConnections.map((room) => (
                    <Badge key={room} variant="secondary" className="text-xs">
                      {room}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Practical Exercise */}
          <Card variant="glass" className={`${colors.border}`}>
            <CardContent className="pt-6">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Target className={`h-4 w-4 ${colors.text}`} />
                Practical Exercise
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{week.practicalExercise}</p>
            </CardContent>
          </Card>

          {/* Weekly Challenge */}
          <Card variant="glass" className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <CardContent className="pt-6">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Flame className="h-4 w-4 text-green-400" />
                Weekly Challenge
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{week.weeklyChallenge}</p>
            </CardContent>
          </Card>

          {/* Complete Week Button */}
          <div className="flex justify-end pt-4 pb-8 border-t border-border/50">
            {canComplete ? (
              <Button onClick={() => onCompleteWeek(viewingWeek)} className="min-w-[200px]">
                Complete Week {viewingWeek}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : isCompleted ? (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Week {viewingWeek} completed</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete Week {currentWeek} first to unlock this week.
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
