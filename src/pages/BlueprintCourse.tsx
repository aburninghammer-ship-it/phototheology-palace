import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, Users } from "lucide-react";
import { blueprintLessons } from "@/data/blueprintCourseData";
import { blueprintLessonsKids } from "@/data/blueprintCourseDataKids";
import { BlueprintJeevesChat } from "@/components/blueprint/BlueprintJeevesChat";
import { useTranslation } from "react-i18next";

const COURSE_PARTS = [
  {
    id: 1,
    titleKey: "blueprint.course.part1.title",
    levelKey: "blueprint.course.part1.level",
    descriptionKey: "blueprint.course.part1.description",
    topicKeys: ["blueprint.course.part1.topics.0", "blueprint.course.part1.topics.1", "blueprint.course.part1.topics.2"],
    completed: false,
  },
  {
    id: 2,
    titleKey: "blueprint.course.part2.title",
    levelKey: "blueprint.course.part2.level",
    descriptionKey: "blueprint.course.part2.description",
    topicKeys: ["blueprint.course.part2.topics.0", "blueprint.course.part2.topics.1", "blueprint.course.part2.topics.2"],
    completed: false,
  },
  {
    id: 3,
    titleKey: "blueprint.course.part3.title",
    levelKey: "blueprint.course.part3.level",
    descriptionKey: "blueprint.course.part3.description",
    topicKeys: ["blueprint.course.part3.topics.0", "blueprint.course.part3.topics.1", "blueprint.course.part3.topics.2"],
    completed: false,
  },
  {
    id: 4,
    titleKey: "blueprint.course.part4.title",
    levelKey: "blueprint.course.part4.level",
    descriptionKey: "blueprint.course.part4.description",
    topicKeys: ["blueprint.course.part4.topics.0", "blueprint.course.part4.topics.1", "blueprint.course.part4.topics.2"],
    completed: false,
  },
  {
    id: 5,
    titleKey: "blueprint.course.part5.title",
    levelKey: "blueprint.course.part5.level",
    descriptionKey: "blueprint.course.part5.description",
    topicKeys: ["blueprint.course.part5.topics.0", "blueprint.course.part5.topics.1", "blueprint.course.part5.topics.2"],
    completed: false,
  },
  {
    id: 6,
    titleKey: "blueprint.course.part6.title",
    levelKey: "blueprint.course.part6.level",
    descriptionKey: "blueprint.course.part6.description",
    topicKeys: ["blueprint.course.part6.topics.0", "blueprint.course.part6.topics.1", "blueprint.course.part6.topics.2"],
    completed: false,
  },
  {
    id: 7,
    titleKey: "blueprint.course.part7.title",
    levelKey: "blueprint.course.part7.level",
    descriptionKey: "blueprint.course.part7.description",
    topicKeys: ["blueprint.course.part7.topics.0", "blueprint.course.part7.topics.1", "blueprint.course.part7.topics.2", "blueprint.course.part7.topics.3"],
    completed: false,
  },
  {
    id: 8,
    titleKey: "blueprint.course.part8.title",
    levelKey: "blueprint.course.part8.level",
    descriptionKey: "blueprint.course.part8.description",
    topicKeys: ["blueprint.course.part8.topics.0", "blueprint.course.part8.topics.1", "blueprint.course.part8.topics.2"],
    completed: false,
  },
  {
    id: 9,
    titleKey: "blueprint.course.part9.title",
    levelKey: "blueprint.course.part9.level",
    descriptionKey: "blueprint.course.part9.description",
    topicKeys: ["blueprint.course.part9.topics.0", "blueprint.course.part9.topics.1", "blueprint.course.part9.topics.2"],
    completed: false,
  },
  {
    id: 10,
    titleKey: "blueprint.course.part10.title",
    levelKey: "blueprint.course.part10.level",
    descriptionKey: "blueprint.course.part10.description",
    topicKeys: ["blueprint.course.part10.topics.0", "blueprint.course.part10.topics.1", "blueprint.course.part10.topics.2", "blueprint.course.part10.topics.3"],
    completed: false,
  },
];

export default function BlueprintCourse() {
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [ageGroup, setAgeGroup] = useState<'adult' | 'ages-6-8' | 'ages-9-12' | 'ages-13-15'>('adult');
  const { t } = useTranslation();

  const currentPart = selectedPart ? COURSE_PARTS.find(p => p.id === selectedPart) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">{t('blueprint.course.pageTitle')}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('blueprint.course.pageDescription')}
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {t('blueprint.course.badge')}
          </Badge>
        </section>

        {/* Age Group Selector */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <Button
            variant={ageGroup === 'adult' ? 'default' : 'outline'}
            onClick={() => {
              setAgeGroup('adult');
              setSelectedPart(null);
            }}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            {t('common.adultCourse')}
          </Button>
          <Button
            variant={ageGroup === 'ages-6-8' ? 'default' : 'outline'}
            onClick={() => {
              setAgeGroup('ages-6-8');
              setSelectedPart(null);
            }}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            {t('common.ages6to8')}
          </Button>
          <Button
            variant={ageGroup === 'ages-9-12' ? 'default' : 'outline'}
            onClick={() => {
              setAgeGroup('ages-9-12');
              setSelectedPart(null);
            }}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            {t('common.ages9to12')}
          </Button>
          <Button
            variant={ageGroup === 'ages-13-15' ? 'default' : 'outline'}
            onClick={() => {
              setAgeGroup('ages-13-15');
              setSelectedPart(null);
            }}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            {t('common.ages13to15')}
          </Button>
        </div>

        {!selectedPart ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {COURSE_PARTS.map((part) => (
              <Card
                key={part.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedPart(part.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">{t(part.levelKey)}</Badge>
                      <CardTitle className="text-lg mb-2">{t(part.titleKey)}</CardTitle>
                      <CardDescription>{t(part.descriptionKey)}</CardDescription>
                    </div>
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {part.topicKeys.map((topicKey, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {t(topicKey)}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <Button variant="ghost" onClick={() => setSelectedPart(null)} className="w-fit mb-4">
                {t('common.backToCourseOverview')}
              </Button>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="w-fit">{currentPart ? t(currentPart.levelKey) : ''}</Badge>
                {ageGroup !== 'adult' && (
                  <Badge className="bg-blue-500">{String(ageGroup).replace('ages-', 'Ages ')}</Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{currentPart ? t(currentPart.titleKey) : ''}</CardTitle>
              <CardDescription className="text-lg">{currentPart ? t(currentPart.descriptionKey) : ''}</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                if (ageGroup === 'adult') {
                  const lesson = blueprintLessons.find(l => l.id === selectedPart);
                  if (!lesson) return null;

                  const lessonContent = `
                    Title: ${lesson.title}
                    Focus: ${lesson.focus}
                    Scripture: ${lesson.scripture} - ${lesson.scriptureText}
                    Key Points: ${lesson.keyPoints.join('; ')}
                    Historical Context: ${lesson.historicalContext}
                    Prophetic Application: ${lesson.propheticApplication}
                    Practical Application: ${lesson.practicalApplication}
                    Cross References: ${lesson.crossReferences.join('; ')}
                  `;

                  return (
                    <>
                      <BlueprintJeevesChat
                        lessonId={selectedPart}
                        lessonTitle={lesson.title}
                        lessonContent={lessonContent}
                      />

                      <ScrollArea className="h-[600px]">
                        <div className="prose prose-sm max-w-none space-y-6">
                          <div className="bg-muted p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">{t('blueprint.course.topicsCovered')}</h3>
                            <ul className="space-y-2">
                              {currentPart?.topicKeys.map((topicKey, i) => (
                                <li key={i} className="text-base">{t(topicKey)}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              {t('common.focus')}
                            </h3>
                            <p>{lesson.focus}</p>
                          </div>

                          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            <h3 className="font-semibold text-primary mb-2">{t('common.scriptureLabel', { reference: lesson.scripture })}</h3>
                            <p className="italic">"{lesson.scriptureText}"</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">{t('common.keyPoints')}</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {lesson.keyPoints.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">{t('common.historicalContext')}</h3>
                            <p className="leading-relaxed">{lesson.historicalContext}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">{t('common.propheticApplication')}</h3>
                            <p className="leading-relaxed">{lesson.propheticApplication}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">{t('common.practicalApplication')}</h3>
                            <p className="leading-relaxed">{lesson.practicalApplication}</p>
                          </div>

                          <div className="bg-secondary/50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">{t('common.reflectionQuestion')}</h3>
                            <p className="italic">{lesson.reflectionQuestion}</p>
                          </div>

                          <div className="bg-primary/10 p-4 rounded-lg">
                            <h3 className="font-semibold text-primary mb-2">{t('common.prayer')}</h3>
                            <p className="italic">"{lesson.prayer}"</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">{t('common.crossReferences')}</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {lesson.crossReferences.map((ref, i) => (
                                <li key={i}>{ref}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </ScrollArea>
                    </>
                  );
                } else {
                  const kidsLesson = blueprintLessonsKids.find(l => l.id === selectedPart && l.ageGroup === ageGroup);
                  if (!kidsLesson) return null;

                  return (
                    <ScrollArea className="h-[600px]">
                      <div className="prose prose-sm max-w-none space-y-6">
                        <div className="bg-muted p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-3">{t('blueprint.course.topicsCovered')}</h3>
                          <ul className="space-y-2">
                            {currentPart?.topicKeys.map((topicKey, i) => (
                              <li key={i} className="text-base">{t(topicKey)}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            {t('common.focus')}
                          </h3>
                          <p>{kidsLesson.focus}</p>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <h3 className="font-semibold text-primary mb-2">{t('common.scriptureLabel', { reference: kidsLesson.scripture })}</h3>
                          <p className="italic">"{kidsLesson.scriptureText}"</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-primary mb-2">{t('common.keyPoints')}</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {kidsLesson.keyPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary mb-2">{t('common.storyTime')}</h3>
                          <p className="leading-relaxed">{kidsLesson.storyTime}</p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary mb-2">{t('common.funActivity')}</h3>
                          <p className="leading-relaxed">{kidsLesson.funActivity}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-primary mb-2">{t('common.practicalApplication')}</h3>
                          <p className="leading-relaxed">{kidsLesson.practicalApplication}</p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary mb-2">{t('common.memoryVerse')}</h3>
                          <p className="italic">{kidsLesson.memoryVerse}</p>
                        </div>

                        <div className="bg-secondary/50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">{t('common.thinkAboutThis')}</h3>
                          <p className="italic">{kidsLesson.questionToThink}</p>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary mb-2">{t('common.prayer')}</h3>
                          <p className="italic">"{kidsLesson.prayer}"</p>
                        </div>
                      </div>
                    </ScrollArea>
                  );
                }
              })()}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
