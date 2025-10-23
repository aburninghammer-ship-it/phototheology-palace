import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, CheckCircle2, Circle, BookOpen, Sparkles, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { phototheologyCourse, kidsPhototheologyCourse } from "@/data/phototheologyCourseData";

export default function PhototheologyCourse() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [ageGroup, setAgeGroup] = useState<'adult' | 'ages-5-8' | 'ages-9-12' | 'ages-13-16'>('adult');

  const toggleDayCompletion = (day: number) => {
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const currentCourse = ageGroup === 'adult' 
    ? phototheologyCourse 
    : kidsPhototheologyCourse.filter(day => day.ageGroup === ageGroup);

  const selectedDayData = selectedDay
    ? (ageGroup === 'adult' 
        ? phototheologyCourse.find(d => d.day === selectedDay)
        : kidsPhototheologyCourse.find(d => d.day === selectedDay && d.ageGroup === ageGroup))
    : null;

  const weeks = Array.from(new Set(currentCourse.map(day => day.week)));
  const completionPercentage = Math.round((completedDays.length / currentCourse.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Book className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                50-Day Phototheology Course
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Build your Memory Palace: An 8-floor journey to master Christ-centered visual Bible study
            </p>
            
            {/* Progress Bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-primary">{completionPercentage}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {completedDays.length} of {currentCourse.length} days completed
              </p>
            </div>
          </div>

          {/* Age Group Selector */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <Button
              variant={ageGroup === 'adult' ? 'default' : 'outline'}
              onClick={() => {
                setAgeGroup('adult');
                setSelectedDay(null);
                setCompletedDays([]);
              }}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Adult Course
            </Button>
            <Button
              variant={ageGroup === 'ages-5-8' ? 'default' : 'outline'}
              onClick={() => {
                setAgeGroup('ages-5-8');
                setSelectedDay(null);
                setCompletedDays([]);
              }}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Ages 5-8
            </Button>
            <Button
              variant={ageGroup === 'ages-9-12' ? 'default' : 'outline'}
              onClick={() => {
                setAgeGroup('ages-9-12');
                setSelectedDay(null);
                setCompletedDays([]);
              }}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Ages 9-12
            </Button>
            <Button
              variant={ageGroup === 'ages-13-16' ? 'default' : 'outline'}
              onClick={() => {
                setAgeGroup('ages-13-16');
                setSelectedDay(null);
                setCompletedDays([]);
              }}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Ages 13-16
            </Button>
          </div>

          {/* Course Structure Info */}
          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Memory Palace Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-semibold text-primary">Floor 1 (Days 1-7)</div>
                  <div className="text-muted-foreground">Foundations & Furnishing</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">Floor 2 (Days 8-14)</div>
                  <div className="text-muted-foreground">Detective Skills</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">Floor 3 (Days 15-21)</div>
                  <div className="text-muted-foreground">Freestyle Connections</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">Floor 4 (Days 22-28)</div>
                  <div className="text-muted-foreground">Christ-Centered Depth</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">Floors 5-6 (Days 29-35)</div>
                  <div className="text-muted-foreground">Vision & Cycles</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">Floors 7-8 (Days 36-42)</div>
                  <div className="text-muted-foreground">Synthesis & Ascension</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">Week 7 (Days 43-49)</div>
                  <div className="text-muted-foreground">Advanced Application</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">Day 50</div>
                  <div className="text-muted-foreground">Mastery & Legacy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Days List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Course Days</CardTitle>
                  <CardDescription>
                    {ageGroup === 'adult' 
                      ? 'Select a day to view details'
                      : `Kids version for ${String(ageGroup).replace('ages-', 'ages ')}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    {weeks.map(weekNum => (
                      <div key={weekNum} className="mb-6">
                        <h3 className="font-semibold text-sm text-muted-foreground mb-3 sticky top-0 bg-card py-2">
                          Week {weekNum}
                        </h3>
                        <div className="space-y-2">
                          {currentCourse
                            .filter(day => day.week === weekNum)
                            .map(day => (
                              <Button
                                key={day.day}
                                variant={selectedDay === day.day ? 'default' : 'ghost'}
                                className="w-full justify-start gap-3 h-auto py-3"
                                onClick={() => setSelectedDay(day.day)}
                              >
                                <div
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDayCompletion(day.day);
                                  }}
                                >
                                  {completedDays.includes(day.day) ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="font-semibold">Day {day.day}</div>
                                  <div className="text-xs text-muted-foreground line-clamp-1">
                                    {day.title}
                                  </div>
                                </div>
                              </Button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Day Details */}
            <div className="lg:col-span-2">
              {selectedDayData ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Day {selectedDayData.day}</Badge>
                          {selectedDayData.room && (
                            <Badge variant="secondary">{selectedDayData.room}</Badge>
                          )}
                          {ageGroup !== 'adult' && (
                            <Badge className="bg-purple-500">{String(ageGroup).replace('ages-', 'Ages ')}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl mb-2">{selectedDayData.title}</CardTitle>
                        <CardDescription className="text-base">{selectedDayData.floor}</CardDescription>
                      </div>
                      <Button
                        variant={completedDays.includes(selectedDayData.day) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleDayCompletion(selectedDayData.day)}
                        className="ml-4"
                      >
                        {completedDays.includes(selectedDayData.day) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Circle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-6">
                        {/* Focus */}
                        <div>
                          <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Focus
                          </h3>
                          <p className="text-muted-foreground">{selectedDayData.focus}</p>
                        </div>

                        {/* Scripture */}
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <h3 className="font-semibold text-primary mb-2">
                            Scripture: {selectedDayData.scripture}
                          </h3>
                          <p className="italic text-foreground">"{selectedDayData.scriptureText}"</p>
                        </div>

                        {/* Activity */}
                        <div>
                          <h3 className="font-semibold text-primary mb-2">Activity (10-20 min)</h3>
                          <p className="text-foreground whitespace-pre-line">{selectedDayData.activity}</p>
                          
                          {'simplifiedActivity' in selectedDayData && selectedDayData.simplifiedActivity && (
                            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                                Simplified Activity
                              </h4>
                              <p className="text-sm">{String(selectedDayData.simplifiedActivity)}</p>
                            </div>
                          )}
                          
                          {'funElement' in selectedDayData && selectedDayData.funElement && (
                            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                              <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                                🎉 Fun Element
                              </h4>
                              <p className="text-sm">{String(selectedDayData.funElement)}</p>
                            </div>
                          )}
                        </div>

                        {/* Reflection */}
                        <div className="bg-secondary/50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Reflection Question</h3>
                          <p className="text-muted-foreground italic">{selectedDayData.reflection}</p>
                        </div>

                        {/* Prayer */}
                        <div className="bg-gradient-to-br from-primary/10 to-transparent p-4 rounded-lg border border-primary/20">
                          <h3 className="font-semibold text-primary mb-2">Prayer</h3>
                          <p className="italic text-foreground">"{selectedDayData.prayer}"</p>
                        </div>

                        {/* Tips for this stage */}
                        <div className="border-t pt-4 mt-6">
                          <h3 className="font-semibold mb-2">Daily Tips</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Use KJV Bible for all references</li>
                            <li>Keep a dedicated notebook for your palace journey</li>
                            <li>Visualize adding this lesson to your mental palace</li>
                            <li>Track cross-references and historicist insights where noted</li>
                            {selectedDayData.day === 50 && (
                              <li className="text-primary font-semibold">
                                🎉 Congratulations on completing the 50-day journey! Your palace is built. Now continue daily.
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Select a Day to Begin</h3>
                    <p className="text-muted-foreground">
                      Choose a day from the list to view the lesson details and start building your memory palace
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Course Goals */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Course Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-primary">By the End of This Course You Will:</h3>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Build a complete mental palace with 8 floors and 38 rooms</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Master the 5 dimensions, 8 cycles, and key patterns of Scripture</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Develop skills in observation, symbolism, prophecy, and application</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Achieve reflexive mastery where Christ shines through all study</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-primary">Daily Structure:</h3>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">Focus:</span>
                      <span className="text-muted-foreground">Key concept or room for the day</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">Scripture:</span>
                      <span className="text-muted-foreground">KJV anchor verses</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">Activity:</span>
                      <span className="text-muted-foreground">Practical exercise (10-20 minutes)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">Reflection:</span>
                      <span className="text-muted-foreground">Journal prompt to internalize</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">Prayer:</span>
                      <span className="text-muted-foreground">Christ-centered close</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
