import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, CheckCircle2, Circle, BookOpen, Sparkles, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { phototheologyCourse, kidsPhototheologyCourse } from "@/data/phototheologyCourseData";
import { useTranslation } from "react-i18next";

export default function PhototheologyCourse() {
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
                {t('courses.phototheologyCourse.pageTitle')}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('courses.phototheologyCourse.pageDescription')}
            </p>

            {/* Progress Bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{t('common.progress')}</span>
                <span className="font-semibold text-primary">{completionPercentage}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
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
          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t('courses.phototheologyCourse.palaceStructureTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-semibold text-primary">{t('courses.phototheologyCourse.floor1Label')}</div>
                  <div className="text-muted-foreground">{t('courses.phototheologyCourse.floor1Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">{t('courses.phototheologyCourse.floor2Label')}</div>
                  <div className="text-muted-foreground">{t('courses.phototheologyCourse.floor2Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">{t('courses.phototheologyCourse.floor3Label')}</div>
                  <div className="text-muted-foreground">{t('courses.phototheologyCourse.floor3Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">{t('courses.phototheologyCourse.floor4Label')}</div>
                  <div className="text-muted-foreground">{t('courses.phototheologyCourse.floor4Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">{t('courses.phototheologyCourse.floors5to6Label')}</div>
                  <div className="text-muted-foreground">{t('courses.phototheologyCourse.floors5to6Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">{t('courses.phototheologyCourse.floors7to8Label')}</div>
                  <div className="text-muted-foreground">{t('courses.phototheologyCourse.floors7to8Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">{t('courses.phototheologyCourse.week7Label')}</div>
                  <div className="text-muted-foreground">{t('courses.phototheologyCourse.week7Description')}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-primary">{t('courses.phototheologyCourse.day50Label')}</div>
                  <div className="text-muted-foreground">{t('courses.phototheologyCourse.day50Description')}</div>
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
                                  <div className="font-semibold">{t('common.dayLabel', { day: day.day })}</div>
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
                          <Badge variant="outline">{t('common.dayLabel', { day: selectedDayData.day })}</Badge>
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
                          <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            {t('common.focus')}
                          </h3>
                          <p className="text-muted-foreground">{selectedDayData.focus}</p>
                        </div>

                        {/* Scripture */}
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <h3 className="font-semibold text-primary mb-2">
                            {t('common.scriptureLabel', { reference: selectedDayData.scripture })}
                          </h3>
                          <p className="italic text-foreground">"{selectedDayData.scriptureText}"</p>
                        </div>

                        {/* Activity */}
                        <div>
                          <h3 className="font-semibold text-primary mb-2">{t('courses.phototheologyCourse.activityLabel')}</h3>
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
                        <div className="bg-gradient-to-br from-primary/10 to-transparent p-4 rounded-lg border border-primary/20">
                          <h3 className="font-semibold text-primary mb-2">{t('common.prayer')}</h3>
                          <p className="italic text-foreground">"{selectedDayData.prayer}"</p>
                        </div>

                        {/* Tips for this stage */}
                        <div className="border-t pt-4 mt-6">
                          <h3 className="font-semibold mb-2">{t('courses.phototheologyCourse.dailyTipsTitle')}</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>{t('courses.phototheologyCourse.tip1')}</li>
                            <li>{t('courses.phototheologyCourse.tip2')}</li>
                            <li>{t('courses.phototheologyCourse.tip3')}</li>
                            <li>{t('courses.phototheologyCourse.tip4')}</li>
                            {selectedDayData.day === 50 && (
                              <li className="text-primary font-semibold">
                                {t('courses.phototheologyCourse.congratulationsDay50')}
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
                    <h3 className="text-xl font-semibold mb-2">{t('common.selectDayToBegin')}</h3>
                    <p className="text-muted-foreground">
                      {t('courses.phototheologyCourse.selectDayDescription')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Course Goals */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t('common.courseGoals')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-primary">{t('courses.phototheologyCourse.goalsHeading')}</h3>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t('courses.phototheologyCourse.goal1')}</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t('courses.phototheologyCourse.goal2')}</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t('courses.phototheologyCourse.goal3')}</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{t('courses.phototheologyCourse.goal4')}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-primary">{t('courses.phototheologyCourse.dailyStructureHeading')}</h3>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">{t('common.focus')}:</span>
                      <span className="text-muted-foreground">{t('courses.phototheologyCourse.structureFocus')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">{t('common.scripture')}:</span>
                      <span className="text-muted-foreground">{t('courses.phototheologyCourse.structureScripture')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">{t('common.activity')}:</span>
                      <span className="text-muted-foreground">{t('courses.phototheologyCourse.structureActivity')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">{t('common.reflection')}:</span>
                      <span className="text-muted-foreground">{t('courses.phototheologyCourse.structureReflection')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0">{t('common.prayer')}:</span>
                      <span className="text-muted-foreground">{t('courses.phototheologyCourse.structurePrayer')}</span>
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
