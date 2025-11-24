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

const COURSE_PARTS = [
  {
    id: 1,
    title: "Part 1: The War in Heaven",
    level: "Level 1: The Origin of Sin",
    description: "The Fall of Angels and the beginning of the Great Controversy",
    topics: ["Lucifer's rebellion", "War in heaven", "Satan cast to earth"],
    completed: false,
  },
  {
    id: 2,
    title: "Part 2: The War on Earth",
    level: "Level 1: The Origin of Sin",
    description: "The Fall of Man and entrance of sin into our world",
    topics: ["Garden of Eden", "The temptation", "Consequences of sin"],
    completed: false,
  },
  {
    id: 3,
    title: "Part 3: The Plan of Salvation",
    level: "Level 1: The Plan of Redemption",
    description: "God's Blueprint revealed through the sanctuary",
    topics: ["The sanctuary system", "Symbols and types", "God's GPS"],
    completed: false,
  },
  {
    id: 4,
    title: "Part 4: The 70 Weeks Prophecy",
    level: "Level 2: God's Advance",
    description: "Messianic prophecy and Satan's first counterattack",
    topics: ["Daniel 9", "Prophetic timeline", "The Messiah's mission"],
    completed: false,
  },
  {
    id: 5,
    title: "Part 5: The 1,260 Years Prophecy",
    level: "Level 2: Satan's Counter",
    description: "The Dark Ages and Satan's second counterattack",
    topics: ["Papal supremacy", "Persecution period", "Daniel 7"],
    completed: false,
  },
  {
    id: 6,
    title: "Part 6: The 2,300 Days Prophecy",
    level: "Level 2: God's Advance",
    description: "The cleansing of the sanctuary and investigative judgment",
    topics: ["Daniel 8:14", "1844", "Day of Atonement"],
    completed: false,
  },
  {
    id: 7,
    title: "Part 7: The Three Angels' Messages",
    level: "Level 3: Final Warnings",
    description: "God's last call to the world before Christ returns",
    topics: ["Revelation 14", "Judgment hour", "Babylon fallen", "Mark of the beast"],
    completed: false,
  },
  {
    id: 8,
    title: "Part 8: The Time of Trouble",
    level: "Level 3: Final Warnings",
    description: "The seven last plagues and earth's final crisis",
    topics: ["Seven plagues", "Seal of God", "Time of Jacob's trouble"],
    completed: false,
  },
  {
    id: 9,
    title: "Part 9: The Second Coming",
    level: "Level 4: Earth's Final Movie",
    description: "Christ's return and the resurrection of the righteous",
    topics: ["Visible return", "Resurrection", "Righteous gathered"],
    completed: false,
  },
  {
    id: 10,
    title: "Part 10: The Final Judgment & New Earth",
    level: "Level 4: Earth's Final Movie",
    description: "The millennium, final judgment, and God's eternal kingdom",
    topics: ["1000 years in heaven", "Second resurrection", "Lake of fire", "New heaven and earth"],
    completed: false,
  },
];

export default function BlueprintCourse() {
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [ageGroup, setAgeGroup] = useState<'adult' | 'ages-6-8' | 'ages-9-12' | 'ages-13-15'>('adult');

  const currentPart = selectedPart ? COURSE_PARTS.find(p => p.id === selectedPart) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">The Blueprint Course</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            God's GPS: A comprehensive chronological view of the Great Controversy from Heaven to Earth's final days
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            10-Part Biblical Prophecy Study
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
            Adult Course
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
            Ages 6-8
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
            Ages 9-12
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
            Ages 13-15
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
                      <Badge variant="secondary" className="mb-2">{part.level}</Badge>
                      <CardTitle className="text-lg mb-2">{part.title}</CardTitle>
                      <CardDescription>{part.description}</CardDescription>
                    </div>
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {part.topics.map((topic, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {topic}</p>
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
                ← Back to Course Overview
              </Button>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="w-fit">{currentPart?.level}</Badge>
                {ageGroup !== 'adult' && (
                  <Badge className="bg-blue-500">{String(ageGroup).replace('ages-', 'Ages ')}</Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{currentPart?.title}</CardTitle>
              <CardDescription className="text-lg">{currentPart?.description}</CardDescription>
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
                            <h3 className="text-lg font-semibold mb-3">Topics Covered:</h3>
                            <ul className="space-y-2">
                              {currentPart?.topics.map((topic, i) => (
                                <li key={i} className="text-base">{topic}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Focus
                            </h3>
                            <p>{lesson.focus}</p>
                          </div>

                          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            <h3 className="font-semibold text-primary mb-2">Scripture: {lesson.scripture}</h3>
                            <p className="italic">"{lesson.scriptureText}"</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">Key Points</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {lesson.keyPoints.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">Historical Context</h3>
                            <p className="leading-relaxed">{lesson.historicalContext}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">Prophetic Application</h3>
                            <p className="leading-relaxed">{lesson.propheticApplication}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">Practical Application</h3>
                            <p className="leading-relaxed">{lesson.practicalApplication}</p>
                          </div>

                          <div className="bg-secondary/50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Reflection Question</h3>
                            <p className="italic">{lesson.reflectionQuestion}</p>
                          </div>

                          <div className="bg-primary/10 p-4 rounded-lg">
                            <h3 className="font-semibold text-primary mb-2">Prayer</h3>
                            <p className="italic">"{lesson.prayer}"</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-primary mb-2">Cross References</h3>
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
                          <h3 className="text-lg font-semibold mb-3">Topics Covered:</h3>
                          <ul className="space-y-2">
                            {currentPart?.topics.map((topic, i) => (
                              <li key={i} className="text-base">{topic}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Focus
                          </h3>
                          <p>{kidsLesson.focus}</p>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <h3 className="font-semibold text-primary mb-2">Scripture: {kidsLesson.scripture}</h3>
                          <p className="italic">"{kidsLesson.scriptureText}"</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-primary mb-2">Key Points</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {kidsLesson.keyPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary mb-2">Story Time</h3>
                          <p className="leading-relaxed">{kidsLesson.storyTime}</p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary mb-2">🎨 Fun Activity</h3>
                          <p className="leading-relaxed">{kidsLesson.funActivity}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-primary mb-2">Practical Application</h3>
                          <p className="leading-relaxed">{kidsLesson.practicalApplication}</p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary mb-2">Memory Verse</h3>
                          <p className="italic">{kidsLesson.memoryVerse}</p>
                        </div>

                        <div className="bg-secondary/50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Think About This</h3>
                          <p className="italic">{kidsLesson.questionToThink}</p>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary mb-2">Prayer</h3>
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
