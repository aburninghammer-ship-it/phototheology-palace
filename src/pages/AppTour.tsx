import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { 
  Building2, BookOpen, Gamepad2, Brain, Users, 
  Sparkles, 
  Zap, Crown, Lightbulb,
  ArrowRight, CheckCircle2, PlayCircle
} from "lucide-react";

const SECTION_GRADIENTS = [
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-emerald-500 via-green-500 to-teal-500",
  "from-fuchsia-500 via-pink-500 to-rose-500",
  "from-amber-500 via-orange-500 to-red-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-indigo-500 via-purple-500 to-violet-500",
];

const AppTour = () => {
  const sections = [
    {
      icon: Building2,
      title: "The Palace",
      gradient: SECTION_GRADIENTS[0],
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
      gradient: SECTION_GRADIENTS[1],
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
      gradient: SECTION_GRADIENTS[2],
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
      gradient: SECTION_GRADIENTS[3],
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
      gradient: SECTION_GRADIENTS[4],
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
      gradient: SECTION_GRADIENTS[5],
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
    { step: 1, title: "Create Your Account", action: "Sign up with email", icon: Sparkles, id: "create-account", gradient: SECTION_GRADIENTS[0] },
    { step: 2, title: "Complete Onboarding", action: "Learn the basics (5 min)", icon: PlayCircle, id: "onboarding", gradient: SECTION_GRADIENTS[1] },
    { step: 3, title: "Enter The Palace", action: "Start Floor 1, Room 1", icon: Building2, id: "palace", gradient: SECTION_GRADIENTS[2] },
    { step: 4, title: "Start Your First Game", action: "Try Palace Quiz", icon: Gamepad2, id: "first-game", gradient: SECTION_GRADIENTS[3] },
    { step: 5, title: "Explore Bible Tools", action: "Open the Phototheology Bible", icon: BookOpen, id: "bible-tools", gradient: SECTION_GRADIENTS[4] },
    { step: 6, title: "Join Community", action: "Connect with other learners", icon: Users, id: "community", gradient: SECTION_GRADIENTS[5] }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header with glass effect */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-white/20 mb-4">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">App Tour</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
            How to Use Phototheology
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your complete guide to mastering biblical typology through our 8-floor Memory Palace system
          </p>
        </motion.div>

        {/* Quick Start Guide with glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" className="mb-12">
            {/* Gradient top border */}
            <div className="h-1.5 bg-gradient-to-r from-violet-500 via-amber-500 to-emerald-500" />
            
            <CardHeader className="relative">
              {/* Corner glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              
              <CardTitle className="flex items-center gap-2 text-2xl relative z-10">
                <motion.div 
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"
                >
                  <Crown className="h-5 w-5 text-white" />
                </motion.div>
                Quick Start Guide
              </CardTitle>
              <CardDescription>Get up and running in 6 simple steps</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickStart.map((item, index) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.a
                      key={item.step}
                      href={`#${item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10 hover:border-white/30 transition-all group cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                          {item.step}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.action}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Features Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            const sectionId = quickStart[index]?.id || `section-${index}`;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card 
                  id={sectionId} 
                  className="border-2 border-white/20 bg-card/90 backdrop-blur-xl shadow-[0_0_40px_-15px] shadow-current hover:shadow-[0_0_60px_-10px] transition-all scroll-mt-20 overflow-hidden"
                >
                  {/* Gradient top border */}
                  <div className={`h-1.5 bg-gradient-to-r ${section.gradient}`} />
                  
                  <CardHeader className="relative">
                    {/* Corner glow */}
                    <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${section.gradient} opacity-10 rounded-full blur-3xl pointer-events-none`} />
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", bounce: 0.5, delay: 0.3 + index * 0.1 }}
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg`}
                        >
                          <IconComponent className="h-7 w-7 text-white" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-2xl">{section.title}</CardTitle>
                          <CardDescription className="text-base">{section.description}</CardDescription>
                        </div>
                      </div>
                      <Button asChild size="sm" className={`bg-gradient-to-r ${section.gradient} hover:opacity-90 text-white border-0`}>
                        <Link to={section.link}>
                          Explore <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Getting Started Steps */}
                      <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Getting Started</h4>
                        <ol className="space-y-2">
                          {section.steps.map((step, stepIndex) => (
                            <motion.li 
                              key={stepIndex} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + stepIndex * 0.1 }}
                              className="flex gap-2 text-sm"
                            >
                              <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 text-transparent bg-gradient-to-r ${section.gradient} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                              <span>{step}</span>
                            </motion.li>
                          ))}
                        </ol>
                      </div>
                      
                      {/* Key Features */}
                      <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Key Features</h4>
                        <div className="space-y-3">
                          {section.features.map((feature, featIndex) => (
                            <motion.div 
                              key={featIndex} 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + featIndex * 0.1 }}
                              className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10"
                            >
                              <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${section.gradient} mt-1.5 flex-shrink-0`} />
                              <div>
                                <div className="font-medium text-sm">{feature.name}</div>
                                <div className="text-xs text-muted-foreground">{feature.detail}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section with glass effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card variant="glass" className="mt-12">
            {/* Gradient top border */}
            <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            
            <CardHeader className="relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full blur-3xl pointer-events-none" />
              
              <CardTitle className="text-2xl flex items-center gap-2 relative z-10">
                <motion.div 
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"
                >
                  <Lightbulb className="h-5 w-5 text-white" />
                </motion.div>
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-white/10">
                  <AccordionTrigger className="hover:no-underline">What is Phototheology?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Phototheology is a method of Bible study that uses visual memory techniques, symbolic thinking, and structured progression through an 8-floor "Memory Palace" to help you see Christ in all Scripture and master biblical typology.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-white/10">
                  <AccordionTrigger className="hover:no-underline">Do I need to complete the floors in order?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, the Palace is designed with progressive unlocking. Each floor builds on the previous one, teaching foundational skills before advancing to more complex prophetic and typological concepts. Complete Floor 1 before moving to Floor 2, and so on.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-white/10">
                  <AccordionTrigger className="hover:no-underline">What is Jeeves and how do I use it?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Jeeves is your AI study assistant trained in Phototheology principles. You can ask Jeeves to explain verses, validate your PT applications, help with games, and answer questions about any room in the Palace. Just click the Jeeves icon wherever you see it.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-white/10">
                  <AccordionTrigger className="hover:no-underline">Can I play games without completing the Palace?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes! All games are available immediately. While Palace Games reinforce concepts from specific floors, you can play any game at any time. However, you'll understand the games better as you progress through the Palace training.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-white/10">
                  <AccordionTrigger className="hover:no-underline">How do I earn points and level up?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Earn points by completing rooms in the Palace, winning games, finishing daily challenges, maintaining reading streaks, and participating in community events. Points accumulate toward your level, unlocking new features and badges.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border-white/10">
                  <AccordionTrigger className="hover:no-underline">What's the difference between the Bible tools?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
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
        </motion.div>

        {/* CTA Section with glass effect */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 relative overflow-hidden rounded-2xl border-2 border-white/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
          
          {/* Animated orbs */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/20 blur-3xl pointer-events-none"
          />
          
          <div className="relative z-10 p-8 text-center">
            <Building2 className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-xl mx-auto">
              Enter the Palace and start transforming how you study Scripture
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="secondary" className="shadow-lg">
                <Link to="/palace">
                  <Building2 className="mr-2 h-5 w-5" />
                  Enter The Palace
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Link to="/games">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Play Games
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppTour;
