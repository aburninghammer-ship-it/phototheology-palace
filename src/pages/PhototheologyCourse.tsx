import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Book, CheckCircle2, Circle, BookOpen, Sparkles, ExternalLink, ChevronDown, ChevronRight, Flame, Trophy, GraduationCap, Lock, Calendar } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { phototheologyCourse, FLOOR_META } from "@/data/phototheologyCourseData";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PhototheologyCourse() {
  const { completedDays, reflections, loading, toggleDay, saveReflection, courseStartDate, isDayUnlocked, isDayCompletable, getUnlockedDay } = useCourseProgress("phototheology");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [reflectionDraft, setReflectionDraft] = useState("");

  const currentCourse = phototheologyCourse;

  const selectedDayData = useMemo(() => {
    if (!selectedDay) return null;
    return phototheologyCourse.find(d => d.day === selectedDay);
  }, [selectedDay]);

  const weeks = useMemo(() => Array.from(new Set(currentCourse.map(d => d.week))), [currentCourse]);
  const completionPct = currentCourse.length > 0 ? Math.round((completedDays.filter(d => currentCourse.some(c => c.day === d)).length / currentCourse.length) * 100) : 0;
  const completedCount = completedDays.filter(d => currentCourse.some(c => c.day === d)).length;

  const currentStreak = useMemo(() => {
    const sorted = [...completedDays].sort((a, b) => b - a);
    let streak = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0 || sorted[i] === sorted[i - 1] - 1) streak++;
      else break;
    }
    return streak;
  }, [completedDays]);

  const toggleWeek = (w: number) => setExpandedWeeks(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    const data = phototheologyCourse.find(d => d.day === day);
    if (data) setReflectionDraft(reflections[day] || "");
  };

  const getFloorForWeek = (weekNum: number) => {
    const day = currentCourse.find(d => d.week === weekNum);
    return day ? FLOOR_META.find(f => f.number === day.floorNumber) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
              The Phototheology Course
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              90 days through all 8 floors of the Palace — from memory to mastery
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{completedCount}</div>
                <div className="text-xs text-muted-foreground">Days Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{completionPct}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500 flex items-center gap-1 justify-center">
                  <Flame className="h-5 w-5" />{currentStreak}
                </div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentCourse.length}</div>
                <div className="text-xs text-muted-foreground">Total Days</div>
              </div>
            </div>

            {/* Time-Lock Info */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>
                {courseStartDate
                  ? `Day ${getUnlockedDay()} of 90 unlocked · Started ${courseStartDate.toLocaleDateString()}`
                  : "Complete Day 1 to begin your 90-day journey"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 max-w-md mx-auto">
              <Progress value={completionPct} className="h-3" />
            </div>
          </div>


          {/* Floor Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
            {FLOOR_META.map(floor => {
              const floorDays = currentCourse.filter(d => d.floorNumber === floor.number);
              const floorCompleted = floorDays.filter(d => completedDays.includes(d.day)).length;
              const floorPct = floorDays.length > 0 ? Math.round((floorCompleted / floorDays.length) * 100) : 0;
              return (
                <div key={floor.number} className={cn("rounded-lg p-2 text-center bg-gradient-to-br border border-border/50", floor.color)}>
                  <div className="text-xl">{floor.icon}</div>
                  <div className="text-[10px] font-semibold truncate">{floor.name}</div>
                  <div className="text-[9px] text-muted-foreground">Wk {floor.weeks}</div>
                  <Progress value={floorPct} className="h-1.5 mt-1" />
                  <div className="text-[9px] text-muted-foreground mt-0.5">{floorPct}%</div>
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Days List */}
            <div className="lg:col-span-1">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Course Days</CardTitle>
                  <CardDescription className="text-xs">
                    90-day journey through the Palace
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="px-4 pb-4 space-y-1">
                      {weeks.map(weekNum => {
                        const floorMeta = getFloorForWeek(weekNum);
                        const weekDays = currentCourse.filter(d => d.week === weekNum);
                        const weekCompleted = weekDays.filter(d => completedDays.includes(d.day)).length;
                        const isExpanded = expandedWeeks.includes(weekNum);

                        return (
                          <div key={weekNum}>
                            <button
                              onClick={() => toggleWeek(weekNum)}
                              className="w-full flex items-center gap-2 py-2 px-2 rounded-md hover:bg-muted/50 transition-colors text-left"
                            >
                              {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                              <span className="text-sm font-semibold flex-1">
                                {floorMeta?.icon} Week {weekNum}
                              </span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {weekCompleted}/{weekDays.length}
                              </Badge>
                            </button>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="ml-5 space-y-0.5 pb-2">
                                    {weekDays.map(day => {
                                      const unlocked = isDayUnlocked(day.day);
                                      const completable = isDayCompletable(day.day);
                                      return (
                                      <button
                                        key={day.day}
                                        onClick={() => handleSelectDay(day.day)}
                                        className={cn(
                                          "w-full flex items-center gap-2 py-1.5 px-2 rounded-md text-left transition-colors text-sm",
                                          selectedDay === day.day ? "bg-primary/10 text-primary" : "hover:bg-muted/50",
                                          !unlocked && "opacity-50"
                                        )}
                                      >
                                        <button
                                          onClick={(e) => { e.stopPropagation(); toggleDay(day.day); }}
                                          className="shrink-0"
                                          disabled={!unlocked}
                                        >
                                          {completedDays.includes(day.day) ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                          ) : !unlocked ? (
                                            <Lock className="h-4 w-4 text-muted-foreground/30" />
                                          ) : (
                                            <Circle className="h-4 w-4 text-muted-foreground/40" />
                                          )}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-xs font-medium truncate">
                                            Day {day.day}: {unlocked ? day.title : "🔒 Locked"}
                                          </div>
                                        </div>
                                      </button>
                                      );
                                    })}
                                    
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Day Detail */}
            <div className="lg:col-span-2">
              {selectedDayData ? (
                (() => {
                  const dayUnlocked = isDayUnlocked(selectedDayData.day);
                  const dayCompletable = isDayCompletable(selectedDayData.day);
                  return (
                <motion.div
                  key={selectedDay}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-border/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">Day {selectedDayData.day}</Badge>
                            <Badge className="bg-primary/10 text-primary text-xs border-0">
                              {FLOOR_META.find(f => f.number === selectedDayData.floorNumber)?.icon} Floor {selectedDayData.floorNumber}
                            </Badge>
                            {selectedDayData.roomCode && (
                              <Badge variant="secondary" className="text-xs">{selectedDayData.roomCode}</Badge>
                            )}
                            {!dayUnlocked && (
                              <Badge variant="destructive" className="text-xs gap-1">
                                <Lock className="h-3 w-3" /> Locked
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-2xl leading-tight">{selectedDayData.title}</CardTitle>
                          <CardDescription className="mt-1">{selectedDayData.floor}</CardDescription>
                        </div>
                        {dayUnlocked ? (
                          <Button
                            variant={completedDays.includes(selectedDayData.day) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleDay(selectedDayData.day)}
                            disabled={!dayCompletable && !completedDays.includes(selectedDayData.day)}
                            className={cn("shrink-0", completedDays.includes(selectedDayData.day) && "bg-green-600 hover:bg-green-700")}
                          >
                            {completedDays.includes(selectedDayData.day) ? (
                              <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Done</>
                            ) : !dayCompletable ? (
                              <><Lock className="h-4 w-4 mr-1.5" /> Complete Previous</>
                            ) : (
                              <><Circle className="h-4 w-4 mr-1.5" /> Complete</>
                            )}
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-xs py-2 px-3 gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Unlocks in {selectedDayData.day - getUnlockedDay()} day{selectedDayData.day - getUnlockedDay() !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!dayUnlocked ? (
                        <div className="text-center py-16 space-y-4">
                          <div className="p-4 rounded-full bg-muted w-fit mx-auto">
                            <Lock className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold">This Day is Locked</h3>
                          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Day {selectedDayData.day} unlocks in {selectedDayData.day - getUnlockedDay()} day{selectedDayData.day - getUnlockedDay() !== 1 ? 's' : ''}.
                            The Phototheology Course is designed to be completed over 90 real days — one day at a time, building depth through patience.
                          </p>
                          <p className="text-xs text-muted-foreground italic">"Line upon line, precept upon precept" — Isaiah 28:10</p>
                        </div>
                      ) : (
                      <ScrollArea className="h-[550px] pr-4">
                        <div className="space-y-5">
                          {/* Focus */}
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5" /> Focus
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedDayData.focus}</p>
                          </div>

                          {/* Scripture */}
                          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            <h3 className="text-sm font-semibold text-primary mb-1.5">
                              📖 {selectedDayData.scripture}
                            </h3>
                            <p className="italic text-sm leading-relaxed">"{selectedDayData.scriptureText}"</p>
                          </div>

                          {/* Activity */}
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-1.5">📝 Today's Activity</h3>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{selectedDayData.activity}</p>

                            {'simplifiedActivity' in selectedDayData && selectedDayData.simplifiedActivity && (
                              <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">Simplified Version</h4>
                                <p className="text-xs">{String(selectedDayData.simplifiedActivity)}</p>
                              </div>
                            )}
                            {'funElement' in selectedDayData && selectedDayData.funElement && (
                              <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <h4 className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">🎮 Fun Element</h4>
                                <p className="text-xs">{String(selectedDayData.funElement)}</p>
                              </div>
                            )}
                          </div>

                          {/* Practice Link */}
                          {selectedDayData.practiceLink && (
                            <Link to={selectedDayData.practiceLink}>
                              <Button variant="outline" size="sm" className="gap-2 w-full">
                                <ExternalLink className="h-3.5 w-3.5" />
                                {selectedDayData.practiceLinkLabel || "Open Practice Tool"}
                              </Button>
                            </Link>
                          )}

                          {/* Reflection */}
                          <div className="bg-secondary/50 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold mb-1.5">💭 Reflection Question</h3>
                            <p className="text-sm text-muted-foreground italic mb-3">{selectedDayData.reflection}</p>
                            <Textarea
                              placeholder="Write your reflection here... (saved automatically when you mark complete)"
                              value={reflectionDraft}
                              onChange={(e) => {
                                setReflectionDraft(e.target.value);
                                saveReflection(selectedDayData.day, e.target.value);
                              }}
                              className="min-h-[80px] text-sm bg-background/50"
                            />
                          </div>

                          {/* Prayer */}
                          <div className="bg-gradient-to-br from-primary/10 to-transparent p-4 rounded-lg border border-primary/20">
                            <h3 className="text-sm font-semibold text-primary mb-1.5">🙏 Prayer</h3>
                            <p className="italic text-sm leading-relaxed">"{selectedDayData.prayer}"</p>
                          </div>

                          {/* Navigation */}
                          <div className="flex justify-between pt-2">
                            <Button
                              variant="ghost" size="sm"
                              disabled={selectedDayData.day <= 1}
                              onClick={() => handleSelectDay(selectedDayData.day - 1)}
                            >
                              ← Previous Day
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              disabled={selectedDayData.day >= currentCourse.length}
                              onClick={() => handleSelectDay(selectedDayData.day + 1)}
                            >
                              Next Day →
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
                  );
                })()
              ) : (
                <Card className="h-full flex items-center justify-center border-border/50">
                  <CardContent className="text-center py-16">
                    <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                      <Book className="h-12 w-12 text-primary/60" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Select a Day to Begin</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      Choose a day from the course outline to view the lesson, activity, and reflection.
                    </p>
                    <Button className="mt-6" onClick={() => handleSelectDay(1)}>
                      Start Day 1 →
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Completion Celebration */}
          {completionPct === 100 && (
            <Card className="mt-8 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
              <CardContent className="text-center py-8">
                <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">🎉 Palace Complete!</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  You've completed all 90 days of the Phototheology Course. The palace is now inside you.
                  Continue using the tools and rooms to deepen your mastery every day.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
