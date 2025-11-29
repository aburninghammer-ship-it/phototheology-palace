import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlassBubbles } from "@/components/ui/glass-bubbles";
import { BookOpen, Users, Calendar, GraduationCap, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: "phototheology",
      title: "50-Day Phototheology Course",
      description: "Master the complete Palace Method in 50 days through guided daily lessons",
      path: "/phototheology-course",
      duration: "50 days",
      level: "Beginner to Advanced",
      ageGroups: ["Adults", "Ages 5-8", "Ages 9-12", "Ages 13-16"],
      features: [
        "Daily structured lessons",
        "Progressive skill building",
        "All 8 floors covered",
        "Age-appropriate versions"
      ],
      icon: GraduationCap,
      color: "from-primary/20 to-accent/20"
    },
    {
      id: "blueprint",
      title: "Blueprint Prophecy Course",
      description: "10-part biblical prophecy study covering Daniel, Revelation, and the sanctuary",
      path: "/blueprint-course",
      duration: "10 lessons",
      level: "Intermediate",
      ageGroups: ["Adults", "Kids (6-12)"],
      features: [
        "Prophecy foundations",
        "Sanctuary symbolism",
        "End-time events",
        "Kid-friendly version"
      ],
      icon: BookOpen,
      color: "from-accent/20 to-primary/20"
    },
    {
      id: "daniel",
      title: "Daniel Deep Dive",
      description: "Comprehensive study of the Book of Daniel with prophecy focus",
      path: "/daniel-course",
      duration: "12 chapters",
      level: "Intermediate",
      ageGroups: ["Adults", "Kids"],
      features: [
        "Chapter-by-chapter study",
        "Prophecy interpretation",
        "Historical context",
        "Visual memory aids"
      ],
      icon: BookOpen,
      color: "from-primary/10 to-accent/10"
    },
    {
      id: "revelation",
      title: "Revelation Unlocked",
      description: "Journey through Revelation with Phototheology principles",
      path: "/revelation-course",
      duration: "22 chapters",
      level: "Advanced",
      ageGroups: ["Adults", "Kids"],
      features: [
        "Symbol interpretation",
        "Three Angels' Messages",
        "Sanctuary connections",
        "Engaging kids version"
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
              📚 Guided Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Phototheology Courses
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Structured courses for every age and level. Choose your path to mastering Scripture through the Palace Method.
            </p>
          </div>

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
                        {course.ageGroups.length} age groups
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">Age Groups Available:</p>
                      <div className="flex flex-wrap gap-2">
                        {course.ageGroups.map((age) => (
                          <Badge key={age} variant="outline" className="text-xs">
                            {age}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">What You'll Learn:</p>
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
                      Start Course
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
              <CardTitle className="text-2xl">Course FAQs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div>
                <h3 className="font-semibold mb-2">Which course should I start with?</h3>
                <p className="text-muted-foreground">
                  Start with the <strong>50-Day Phototheology Course</strong> if you're new to the Palace Method. 
                  It builds your foundation step-by-step. If you already know the basics, jump into the 
                  <strong> Blueprint</strong>, <strong>Daniel</strong>, or <strong>Revelation</strong> courses.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Are the kids versions different?</h3>
                <p className="text-muted-foreground">
                  Yes! Kids versions use simpler language, shorter activities, interactive stories, 
                  and age-appropriate illustrations. The core principles remain the same, just adapted for younger minds.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I switch between age groups?</h3>
                <p className="text-muted-foreground">
                  Absolutely! Each course page lets you select the age group. You can switch at any time 
                  to preview content or teach different age groups.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do I need to complete courses in order?</h3>
                <p className="text-muted-foreground">
                  No, but we recommend the 50-Day Course first if you're new. After that, take Daniel, 
                  Revelation, or Blueprint in any order based on your interests.
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
