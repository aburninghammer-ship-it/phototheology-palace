import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, CheckCircle2, Circle, BookOpen, Sparkles, Users, Scroll } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { danielCourse, kidsDanielCourse } from "@/data/danielCourseData";
import { Footer } from "@/components/Footer";
import { ProphecyCourseEnhancements } from "@/components/prophecy/ProphecyCourseEnhancements";
import { ProphecyTimeline } from "@/components/prophecy/ProphecyTimeline";
import { useTranslation } from "react-i18next";

export default function DanielCourse() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [ageGroup, setAgeGroup] = useState<'adult' | 'ages-5-8' | 'ages-9-12' | 'ages-13-16'>('adult');
  const { t } = useTranslation();

  const toggleDayCompletion = (day: number) => {
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const currentCourse = ageGroup === 'adult'
    ? danielCourse
    : kidsDanielCourse.filter(day => day.ageGroup === ageGroup);

  const selectedDayData = selectedDay
    ? (ageGroup === 'adult'
        ? danielCourse.find(d => d.day === selectedDay)
        : kidsDanielCourse.find(d => d.day === selectedDay && d.ageGroup === ageGroup))
    : null;

  const weeks = Array.from(new Set(currentCourse.map(day => day.week)));
  const completionPercentage = Math.round((completedDays.length / currentCourse.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <Navigation />

      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scroll className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {t('courses.danielCourse.pageTitle')}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('courses.danielCourse.pageDescription')}
            </p>

            {/* Progress Bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{t('common.progress')}</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{completionPercentage}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('common.daysCompleted', { completed: completedDays.length, total: currentCourse.length })}
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
              {t('common.adultCourse')}
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
              {t('common.ages5to8')}
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
              {t('common.ages9to12')}
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
              {t('common.ages13to16')}
            </Button>
          </div>

          {/* Course Structure Info */}
          <Card className="mb-8 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t('courses.danielCourse.courseStructureTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">{t('courses.danielCourse.week1Label')}</div>
                  <div className="text-muted-foreground">{t('courses.danielCourse.week1Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">{t('courses.danielCourse.week2Label')}</div>
                  <div className="text-muted-foreground">{t('courses.danielCourse.week2Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">{t('courses.danielCourse.week3Label')}</div>
                  <div className="text-muted-foreground">{t('courses.danielCourse.week3Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">{t('courses.danielCourse.week4Label')}</div>
                  <div className="text-muted-foreground">{t('courses.danielCourse.week4Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">{t('courses.danielCourse.week5Label')}</div>
                  <div className="text-muted-foreground">{t('courses.danielCourse.week5Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">{t('courses.danielCourse.week6Label')}</div>
                  <div className="text-muted-foreground">{t('courses.danielCourse.week6Description')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Days List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{t('common.courseDays')}</CardTitle>
                  <CardDescription>
                    {ageGroup === 'adult'
                      ? t('common.selectDayToView')
                      : t('common.kidsVersionFor', { ageGroup: String(ageGroup).replace('ages-', 'ages ') })
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    {weeks.map(weekNum => (
                      <div key={weekNum} className="mb-6">
                        <h3 className="font-semibold text-sm text-muted-foreground mb-3 sticky top-0 bg-card py-2">
                          {t('common.weekLabel', { week: weekNum })}
                        </h3>
                        <div className="space-y-2">
                          {currentCourse
                            .filter(day => day.week === weekNum)
                            .map(day => (
                              <div
                                key={day.day}
                                className="flex items-start gap-3 p-3 rounded-lg border-2 transition-all hover:border-primary/50 cursor-pointer bg-card"
                                onClick={() => setSelectedDay(selectedDay === day.day ? day.day : day.day)}
                              >
                                <div
                                  className="cursor-pointer flex-shrink-0"
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
                                  <div className="font-semibold">{t('common.dayLabel', { day: day.day })}</div>
                                  <div className="text-xs text-muted-foreground line-clamp-1">
                                    {day.title}
                                  </div>
                                </div>
                              </div>
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
                          <Badge variant="outline">{t('common.dayLabel', { day: selectedDayData.day })}</Badge>
                          {selectedDayData.room && (
                            <Badge variant="secondary">{selectedDayData.room}</Badge>
                          )}
                          {ageGroup !== 'adult' && (
                            <Badge className="bg-blue-500">{String(ageGroup).replace('ages-', 'Ages ')}</Badge>
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
                            {t('common.completed')}
                          </>
                        ) : (
                          <>
                            <Circle className="h-4 w-4 mr-2" />
                            {t('common.markComplete')}
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
                          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            {t('common.focus')}
                          </h3>
                          <p className="text-muted-foreground">{selectedDayData.focus}</p>
                        </div>

                        {/* Scripture */}
                        <div className="bg-blue-500/10 dark:bg-blue-500/20 p-4 rounded-lg border border-blue-500/20">
                          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                            {t('common.scriptureLabel', { reference: selectedDayData.scripture })}
                          </h3>
                          <p className="italic text-foreground">"{selectedDayData.scriptureText}"</p>
                        </div>

                        {/* Activity */}
                        <div>
                          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('courses.phototheologyCourse.activityLabel')}</h3>
                          <p className="text-foreground whitespace-pre-line">{selectedDayData.activity}</p>

                          {'simplifiedActivity' in selectedDayData && selectedDayData.simplifiedActivity && (
                            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                                {t('common.simplifiedActivity')}
                              </h4>
                              <p className="text-sm">{String(selectedDayData.simplifiedActivity)}</p>
                            </div>
                          )}

                          {'funElement' in selectedDayData && selectedDayData.funElement && (
                            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                              <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                                {t('common.funElement')}
                              </h4>
                              <p className="text-sm">{String(selectedDayData.funElement)}</p>
                            </div>
                          )}
                        </div>

                        {/* Reflection */}
                        <div className="bg-secondary/50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">{t('common.reflectionQuestion')}</h3>
                          <p className="text-muted-foreground italic">{selectedDayData.reflection}</p>
                        </div>

                        {/* Prayer */}
                        <div className="bg-gradient-to-br from-blue-500/10 to-transparent p-4 rounded-lg border border-blue-500/20">
                          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('common.prayer')}</h3>
                          <p className="italic text-foreground">"{selectedDayData.prayer}"</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Scroll className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t('common.selectDayToBegin')}</h3>
                    <p className="text-muted-foreground">
                      {t('courses.danielCourse.selectDayDescription')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Course Goals */}
          <Card className="mt-8 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle>{t('common.courseGoals')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">{t('courses.danielCourse.goalsHeading')}</h3>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t('courses.danielCourse.goal1')}</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t('courses.danielCourse.goal2')}</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t('courses.danielCourse.goal3')}</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t('courses.danielCourse.goal4')}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">{t('courses.danielCourse.dailyStructureHeading')}</h3>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0">{t('common.focus')}:</span>
                      <span className="text-muted-foreground">{t('courses.danielCourse.structureFocus')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0">{t('common.scripture')}:</span>
                      <span className="text-muted-foreground">{t('courses.danielCourse.structureScripture')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0">{t('common.activity')}:</span>
                      <span className="text-muted-foreground">{t('courses.danielCourse.structureActivity')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0">{t('common.reflection')}:</span>
                      <span className="text-muted-foreground">{t('courses.danielCourse.structureReflection')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0">{t('common.prayer')}:</span>
                      <span className="text-muted-foreground">{t('courses.danielCourse.structurePrayer')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prophecy Timeline Visualization */}
        <ProphecyTimeline />

        {/* Enhanced Study Tools */}
        <ProphecyCourseEnhancements
          courseType="daniel"
          currentDayId={selectedDay || undefined}
          currentDayTitle={selectedDayData?.title}
          currentDayContent={selectedDayData?.activity}
        />
      </main>
      <Footer />
    </div>
  );
}
