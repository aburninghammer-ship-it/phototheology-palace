import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Building2, BookOpen, Gamepad2, Brain, Users, Trophy, 
  Sparkles, Clock, Image, Search, Scale, Telescope, 
  Video, MessageSquare, Target, Zap, Crown, Lightbulb,
  ArrowRight, CheckCircle2, PlayCircle
} from "lucide-react";

const AppTour = () => {
  const sections = [
    {
      icon: Building2,
      title: "The Palace",
      color: "from-palace-blue to-palace-teal",
      description: "Your 8-floor journey through Phototheology",
      steps: [
        "Start on Floor 1 to build your biblical memory palace",
        "Progress through each floor, unlocking rooms sequentially",
        "Complete challenges in each room to advance",
        "Master all 8 floors to think Phototheologically"
      ],
      features: [
        { name: "38 Total Rooms", detail: "Each with unique training" },
        { name: "Progressive Unlocking", detail: "Master one floor to unlock the next" },
        { name: "Jeeves AI Assistant", detail: "Get help in every room" }
      ],
      link: "/palace"
    },
    {
      icon: BookOpen,
      title: "Bible Tools",
      color: "from-palace-green to-palace-teal",
      description: "Interactive Scripture study with AI assistance",
      steps: [
        "Open the Phototheology Bible to read any passage",
        "Click on any verse to see Strong's definitions",
        "Use Jeeves to explain Phototheology principles",
        "Track your reading progress and bookmarks"
      ],
      features: [
        { name: "Strong's Integration", detail: "Hebrew & Greek word studies" },
        { name: "Chain References", detail: "Connect related verses" },
        { name: "Commentary Access", detail: "Historical context & insights" },
        { name: "AI Verse Analysis", detail: "Ask Jeeves anything" }
      ],
      link: "/bible/John/3"
    },
    {
      icon: Gamepad2,
      title: "Palace Games",
      color: "from-palace-purple to-palace-pink",
      description: "Learn through interactive challenges",
      steps: [
        "Browse 20+ biblically-themed games",
        "Play against Jeeves AI for training",
        "Complete daily challenges for bonus points",
        "Compete on the leaderboard"
      ],
      features: [
        { name: "PT Card Games", detail: "Chain War, Christ Lock, Controversy Raid" },
        { name: "Memory Games", detail: "Concentration, Verse Match, Frame Snapshot" },
        { name: "Strategy Games", detail: "Sanctuary Run, Time Zone Invasion" },
        { name: "VS Jeeves Mode", detail: "AI opponent adapts to your skill" }
      ],
      link: "/games"
    },
    {
      icon: Brain,
      title: "Learning Paths",
      color: "from-palace-orange to-palace-yellow",
      description: "Structured courses for deep mastery",
      steps: [
        "Choose a course: Blueprint, Daniel, Phototheology, or Revelation",
        "Watch video lessons from each module",
        "Complete interactive quizzes",
        "Earn certificates upon completion"
      ],
      features: [
        { name: "4 Major Courses", detail: "100+ hours of content" },
        { name: "Kids Versions", detail: "Age-appropriate material" },
        { name: "Quizzes & Drills", detail: "Test your knowledge" },
        { name: "Certificates", detail: "Track your achievements" }
      ],
      link: "/phototheology-course"
    },
    {
      icon: Users,
      title: "Community Features",
      color: "from-palace-teal to-palace-blue",
      description: "Study together, grow together",
      steps: [
        "Join live study sessions with video chat",
        "Participate in daily challenges",
        "Compete in 24-hour treasure hunts",
        "Chat with other learners"
      ],
      features: [
        { name: "Live Study Rooms", detail: "Video chat & screen share" },
        { name: "Daily Challenges", detail: "Fresh content every day" },
        { name: "Leaderboards", detail: "See top performers" },
        { name: "Achievements", detail: "Unlock badges & rewards" }
      ],
      link: "/community"
    },
    {
      icon: Sparkles,
      title: "Advanced AI Tools",
      color: "from-purple-500 to-pink-500",
      description: "Specialized study modes powered by AI",
      steps: [
        "Use Culture & Controversy to analyze current events",
        "Monitor end-times with Prophecy Watch",
        "Research deep topics in Research Mode",
        "Build sermons with the Sermon Builder"
      ],
      features: [
        { name: "6 AI Modes", detail: "Specialized for different needs" },
        { name: "Real-time Analysis", detail: "Current events through Scripture" },
        { name: "Image Generation", detail: "Visual Bible interpretations" },
        { name: "Apologetics GPT", detail: "Defend your faith intelligently" }
      ],
      link: "/culture-controversy"
    }
  ];

  const quickStart = [
    { step: 1, title: "Create Your Account", action: "Sign up with email", icon: Target },
    { step: 2, title: "Complete Onboarding", action: "Learn the basics (5 min)", icon: PlayCircle },
    { step: 3, title: "Enter The Palace", action: "Start Floor 1, Room 1", icon: Building2 },
    { step: 4, title: "Play Your First Game", action: "Try Palace Quiz", icon: Gamepad2 },
    { step: 5, title: "Read With Tools", action: "Open the Phototheology Bible", icon: BookOpen },
    { step: 6, title: "Join Community", action: "Connect with other learners", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-palace-blue/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-palace-blue/10 border border-palace-blue/20 mb-4">
            <Zap className="h-4 w-4 text-palace-blue" />
            <span className="text-sm font-semibold text-palace-blue">App Tour</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent">
            How to Use Phototheology
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your complete guide to mastering biblical typology through our 8-floor Memory Palace system
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-12 border-2 border-palace-blue/20 bg-gradient-to-br from-palace-blue/5 to-palace-teal/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Crown className="h-6 w-6 text-palace-blue" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>Get up and running in 6 simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickStart.map((item) => (
                <div key={item.step} className="flex gap-3 p-4 rounded-lg bg-card border border-border hover:border-palace-blue/40 transition-all group">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full gradient-ocean flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Features Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index} className="border-2 hover:border-palace-blue/40 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{section.title}</CardTitle>
                        <CardDescription className="text-base">{section.description}</CardDescription>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="hover:border-palace-blue">
                      <Link to={section.link}>
                        Explore <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Getting Started Steps */}
                    <div>
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Getting Started</h4>
                      <ol className="space-y-2">
                        {section.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex gap-2 text-sm">
                            <CheckCircle2 className="h-5 w-5 text-palace-teal flex-shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    {/* Key Features */}
                    <div>
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Key Features</h4>
                      <div className="space-y-3">
                        {section.features.map((feature, featIndex) => (
                          <div key={featIndex} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                            <Sparkles className="h-4 w-4 text-palace-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium text-sm">{feature.name}</div>
                              <div className="text-xs text-muted-foreground">{feature.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-palace-yellow" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Phototheology?</AccordionTrigger>
                <AccordionContent>
                  Phototheology is a method of Bible study that uses visual memory techniques, symbolic thinking, and structured progression through an 8-floor "Memory Palace" to help you see Christ in all Scripture and master biblical typology.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Do I need to complete the floors in order?</AccordionTrigger>
                <AccordionContent>
                  Yes, the Palace is designed with progressive unlocking. Each floor builds on the previous one, teaching foundational skills before advancing to more complex prophetic and typological concepts. Complete Floor 1 before moving to Floor 2, and so on.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>What is Jeeves and how do I use it?</AccordionTrigger>
                <AccordionContent>
                  Jeeves is your AI study assistant trained in Phototheology principles. You can ask Jeeves to explain verses, validate your PT applications, help with games, and answer questions about any room in the Palace. Just click the Jeeves icon wherever you see it.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I play games without completing the Palace?</AccordionTrigger>
                <AccordionContent>
                  Yes! All games are available immediately. While Palace Games reinforce concepts from specific floors, you can play any game at any time. However, you'll understand the games better as you progress through the Palace training.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I earn points and level up?</AccordionTrigger>
                <AccordionContent>
                  Earn points by completing rooms in the Palace, winning games, finishing daily challenges, maintaining reading streaks, and participating in community events. Points accumulate toward your level, unlocking new features and badges.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>What's the difference between the Bible tools?</AccordionTrigger>
                <AccordionContent>
                  <strong>Phototheology Bible</strong> - Main reading interface with Strong's, commentary, and Jeeves.<br/>
                  <strong>Bible Rendered</strong> - 24-chapter visual memory system.<br/>
                  <strong>Verse Memory Hall</strong> - Memorization challenges.<br/>
                  <strong>Image Library</strong> - AI-generated biblical art.<br/>
                  <strong>Amplified Quarterly</strong> - Sabbath School lessons with AI enhancement.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-12 text-center p-8 rounded-2xl gradient-ocean">
          <Building2 className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-xl mx-auto">
            Enter the Palace and start transforming how you study Scripture
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/palace">
                <Building2 className="mr-2 h-5 w-5" />
                Enter The Palace
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/games">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Play Games
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTour;
