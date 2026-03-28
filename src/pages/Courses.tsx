import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { COURSES_TOUR } from "@/data/guidedTours";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlassBubbles } from "@/components/ui/glass-bubbles";
import { BookOpen, Users, Calendar, GraduationCap, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Courses = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tourOpen, setTourOpen] = useState(false);

  const courses = [
    {
      id: "phototheology",
      title: t('courses.phototheology.title'),
      description: t('courses.phototheology.description'),
      path: "/phototheology-course",
      duration: t('courses.phototheology.duration'),
      level: t('courses.phototheology.level'),
      ageGroups: [
        t('courses.ageGroups.adults'),
        t('courses.ageGroups.ages5to8'),
        t('courses.ageGroups.ages9to12'),
        t('courses.ageGroups.ages13to16')
      ],
      features: [
        t('courses.phototheology.features.dailyLessons'),
        t('courses.phototheology.features.progressiveSkills'),
        t('courses.phototheology.features.allFloors'),
        t('courses.phototheology.features.ageAppropriate')
      ],
      icon: GraduationCap,
      color: "from-primary/20 to-accent/20"
    },
    {
      id: "blueprint",
      title: t('courses.blueprint.title'),
      description: t('courses.blueprint.description'),
      path: "/blueprint-course",
      duration: t('courses.blueprint.duration'),
      level: t('courses.blueprint.level'),
      ageGroups: [
        t('courses.ageGroups.adults'),
        t('courses.ageGroups.kids6to12')
      ],
      features: [
        t('courses.blueprint.features.prophecyFoundations'),
        t('courses.blueprint.features.sanctuarySymbolism'),
        t('courses.blueprint.features.endTimeEvents'),
        t('courses.blueprint.features.kidFriendly')
      ],
      icon: BookOpen,
      color: "from-accent/20 to-primary/20"
    },
    {
      id: "daniel",
      title: t('courses.daniel.title'),
      description: t('courses.daniel.description'),
      path: "/daniel-course",
      duration: t('courses.daniel.duration'),
      level: t('courses.daniel.level'),
      ageGroups: [
        t('courses.ageGroups.adults'),
        t('courses.ageGroups.kids')
      ],
      features: [
        t('courses.daniel.features.chapterByChapter'),
        t('courses.daniel.features.prophecyInterpretation'),
        t('courses.daniel.features.historicalContext'),
        t('courses.daniel.features.visualMemoryAids')
      ],
      icon: BookOpen,
      color: "from-primary/10 to-accent/10"
    },
    {
      id: "revelation",
      title: t('courses.revelation.title'),
      description: t('courses.revelation.description'),
      path: "/revelation-course",
      duration: t('courses.revelation.duration'),
      level: t('courses.revelation.level'),
      ageGroups: [
        t('courses.ageGroups.adults'),
        t('courses.ageGroups.kids')
      ],
      features: [
        t('courses.revelation.features.symbolInterpretation'),
        t('courses.revelation.features.threeAngelsMessages'),
        t('courses.revelation.features.sanctuaryConnections'),
        t('courses.revelation.features.engagingKidsVersion')
      ],
      icon: BookOpen,
      color: "from-accent/10 to-primary/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              {t('courses.guidedLearningBadge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('courses.pageTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('courses.pageDescription')}
            </p>
            <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="mt-4 gap-1">
              <GraduationCap className="h-4 w-4" /> Guided Tour
            </Button>
          </div>
          {tourOpen && <GuidedTourOverlay steps={COURSES_TOUR} onClose={() => setTourOpen(false)} />}

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <Card
                  key={course.id}
                  variant="glass"
                >
                  <GlassBubbles />
                  <div className={`h-2 bg-gradient-to-r ${course.color} relative z-10`} />
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {course.duration}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {t('courses.ageGroupCount', { count: course.ageGroups.length })}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">{t('courses.ageGroupsAvailable')}</p>
                      <div className="flex flex-wrap gap-2">
                        {course.ageGroups.map((age) => (
                          <Badge key={age} variant="outline" className="text-xs">
                            {age}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">{t('courses.whatYoullLearn')}</p>
                      <ul className="space-y-1">
                        {course.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <ChevronRight className="h-3 w-3 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => navigate(course.path)}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {t('courses.startCourse')}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <Card variant="glass">
            <GlassBubbles />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl">{t('courses.faq.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div>
                <h3 className="font-semibold mb-2">{t('courses.faq.whichCourseQuestion')}</h3>
                <p className="text-muted-foreground">
                  {t('courses.faq.whichCourseAnswer')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('courses.faq.kidsVersionQuestion')}</h3>
                <p className="text-muted-foreground">
                  {t('courses.faq.kidsVersionAnswer')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('courses.faq.switchAgeGroupQuestion')}</h3>
                <p className="text-muted-foreground">
                  {t('courses.faq.switchAgeGroupAnswer')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('courses.faq.courseOrderQuestion')}</h3>
                <p className="text-muted-foreground">
                  {t('courses.faq.courseOrderAnswer')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
