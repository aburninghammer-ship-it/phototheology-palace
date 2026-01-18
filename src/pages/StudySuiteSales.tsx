import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Check,
  X,
  ArrowRight,
  BookOpen,
  Layers,
  Target,
  Eye,
  Hammer,
  Sparkles,
  Brain,
  Network,
  Crown,
  Flame,
  Telescope,
  GraduationCap,
  FileText,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useTrackedPaymentLinks } from "@/hooks/useTrackedPaymentLinks";

export default function StudySuiteSales() {
  const paymentLinks = useTrackedPaymentLinks();
  const floors = [
    {
      number: 1,
      name: "Story Room Floor",
      skill: "Narrative observation and recall",
      icon: BookOpen,
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      number: 2,
      name: "Observation Floor",
      skill: "Disciplined textual attention",
      icon: Eye,
      color: "from-green-500/20 to-green-500/5",
    },
    {
      number: 3,
      name: "Interpretation Floor",
      skill: "Meaning extraction through structure",
      icon: Brain,
      color: "from-purple-500/20 to-purple-500/5",
    },
    {
      number: 4,
      name: "Concentration Floor",
      skill: "Christ-centered reading",
      icon: Target,
      color: "from-red-500/20 to-red-500/5",
    },
    {
      number: 5,
      name: "Application Floor",
      skill: "Truth to life transfer",
      icon: Hammer,
      color: "from-orange-500/20 to-orange-500/5",
    },
    {
      number: 6,
      name: "Pattern Floor",
      skill: "Cross-textual connections",
      icon: Network,
      color: "from-cyan-500/20 to-cyan-500/5",
    },
    {
      number: 7,
      name: "Fire Floor",
      skill: "Emotional and spiritual weight",
      icon: Flame,
      color: "from-amber-500/20 to-amber-500/5",
    },
    {
      number: 8,
      name: "Vision Floor",
      skill: "Prophetic interpretation",
      icon: Telescope,
      color: "from-indigo-500/20 to-indigo-500/5",
    },
  ];

  const outcomes = [
    "Work within each Room using its specific method and discipline",
    "Move through the Palace with intention rather than wandering",
    "Apply observation before interpretation, structure before conclusion",
    "See Christ emerge through governed study rather than imposed assertion",
    "Teach others using a transferable, repeatable system",
    "Interpret prophecy through the sanctuary lens with confidence",
    "Connect patterns across all 66 books systematically",
    "Build sermons, studies, and teachings on solid method",
  ];

  const included = [
    {
      title: "Complete Floor Training",
      description: "Method instruction for all 8 Floors with Room-by-Room guidance",
      icon: Layers,
    },
    {
      title: "Skill Development Exercises",
      description: "Practical drills that build competency in each discipline",
      icon: GraduationCap,
    },
    {
      title: "Interpretive Framework",
      description: "Tools for moving from observation to conclusion with integrity",
      icon: Brain,
    },
    {
      title: "Christ-Centered Method",
      description: "How the Concentration Room governs all study without forcing",
      icon: Target,
    },
    {
      title: "Pattern Recognition Training",
      description: "Systematic approach to types, symbols, and cross-references",
      icon: Network,
    },
    {
      title: "Prophetic Study Tools",
      description: "Vision Floor method for Daniel, Revelation, and sanctuary prophecy",
      icon: Telescope,
    },
  ];

  const isFor = [
    "Those who have completed the Quick-Start Guide or understand the Palace framework",
    "Bible students ready to move from reading to disciplined study",
    "Teachers, pastors, and leaders who want a transferable method",
    "Christians who want to see Christ throughout Scripture without forcing conclusions",
    "Anyone committed to structure before synthesis in interpretation",
  ];

  const isNotFor = [
    "Those seeking devotional content without method training",
    "Readers who have not oriented to the Palace architecture",
    "Anyone wanting quick tips rather than systematic skill building",
    "Those unwilling to practice discipline before application",
  ];

  const suiteContents = [
    {
      title: "Study Suite Part 1",
      subtitle: "Floors 1-3: Foundation",
      description: "Story Room, Observation, and Interpretation - the foundational skills of biblical study",
      floors: "Floors 1-3",
    },
    {
      title: "Study Suite Part 2",
      subtitle: "Floors 4-5: Application",
      description: "Concentration and Application - Christ-centered reading and life transformation",
      floors: "Floors 4-5",
    },
    {
      title: "Study Suite Part 3",
      subtitle: "Floors 6-8: Mastery",
      description: "Pattern, Fire, and Vision - advanced connections and prophetic interpretation",
      floors: "Floors 6-8",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PhotoTheology Study Suite | Master the Method"
        description="Complete method training for all 8 Floors of the Phototheology Palace. Move from orientation to mastery with Room-by-Room skill development."
      />
      <Navigation />

      {/* 1. HERO SECTION */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(var(--primary), 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(var(--primary), 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center gap-2"
            >
              <Badge variant="outline" className="text-primary border-primary/30 px-4 py-1.5 text-sm">
                <Crown className="w-4 h-4 mr-2" />
                CORE LEVEL - Complete Training
              </Badge>
              <Badge className="bg-accent/20 text-accent border-accent/30 px-3 py-1.5 text-sm">
                3 PDFs Included
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Now That You Know the Structure,
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Master the Method
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              The PhotoTheology Study Suite provides complete method training for every
              Floor and Room. You will develop the skills to study Scripture with
              discipline, confidence, and Christ-centered clarity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-6 h-auto shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <a href={paymentLinks.studySuite} target="_blank" rel="noopener noreferrer">
                  Get the Complete Study Suite - $97
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Instant access to all 3 PDFs
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 hidden lg:block"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
            <Layers className="w-10 h-10 text-primary/60" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 hidden lg:block"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm border border-accent/20 flex items-center justify-center">
            <Crown className="w-8 h-8 text-accent/60" />
          </div>
        </motion.div>
      </section>

      {/* 2. THE PROBLEM THIS LEVEL SOLVES */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">The Challenge</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                The Problem: Knowing the Map Without Walking the Rooms
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-destructive/10">
                        <X className="w-5 h-5 text-destructive" />
                      </div>
                      <h3 className="font-semibold text-lg">Understanding Without Competency</h3>
                    </div>
                    <ul className="space-y-4 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Knowing what each Floor is for but not how to work within it
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Recognizing Rooms but lacking the skill to use them
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Reading about method without practicing it
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Still depending on others for interpretation
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Unable to transfer the system to teaching or preaching
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">Method Training Provides</h3>
                    </div>
                    <ul className="space-y-4 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        Practical skill for each Room's specific discipline
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        Exercises that build competency through practice
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        Confidence to interpret without commentary dependence
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        A transferable system you can teach to others
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        Christ-centered conclusions that emerge, not force
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. WHAT PHOTOTHEOLOGY IS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Method Training, Not More Content
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground">
              <p className="leading-relaxed">
                The Study Suite is not a collection of Bible studies for you to consume.
                It is <strong className="text-foreground">method training</strong> that develops
                your ability to conduct your own studies with confidence and integrity.
              </p>
              <p className="leading-relaxed">
                Each Floor has specific Rooms. Each Room has a specific discipline. The Study
                Suite teaches you <strong className="text-foreground">how to work within each Room</strong>—what
                questions to ask, what to observe, how to interpret, and when to move to the next level.
              </p>

              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6">
                <p className="text-center italic text-foreground">
                  When you complete the Study Suite, you will not merely know more about the Bible.
                  You will know <strong>how to study</strong> the Bible with a method that serves you for life.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S INCLUDED - 3 PDFs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <FileText className="w-3 h-3 mr-2" />
                3 Comprehensive PDFs
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                The Complete Study Suite Package
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Your purchase includes three comprehensive training manuals, each building on the last
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {suiteContents.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 border-b border-primary/10">
                      <Badge variant="outline" className="text-xs">
                        {item.floors}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-primary mb-2">{item.subtitle}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. THE 8 FLOORS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Complete Training</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The 8 Floors You Will Master
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The Study Suite provides method training for each Floor, teaching you the specific
                skill that Floor develops and how to apply it in your own study.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {floors.map((floor, index) => (
                <motion.div
                  key={floor.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`h-full border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg group bg-gradient-to-br ${floor.color}`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                          <span className="font-bold text-primary">{floor.number}</span>
                        </div>
                        <floor.icon className="w-5 h-5 text-primary/70" />
                      </div>
                      <h3 className="font-semibold mb-1">{floor.name}</h3>
                      <p className="text-sm text-muted-foreground">{floor.skill}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    <strong className="text-foreground">Level:</strong> CORE — Method Training & Skill Development
                    <br />
                    <span className="text-sm">
                      This Suite covers all 8 Floors with Room-by-Room instruction. Advanced mastery training
                      builds upon this foundation.
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. WHAT YOU WILL BE ABLE TO DO */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Transformation</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                After Completing the Study Suite, You Will Be Able To:
              </h2>
            </div>

            <div className="space-y-4">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <p className="text-lg pt-1.5">{outcome}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. WHAT IS INCLUDED - DETAILED */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Training Components</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                What Is Included
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {included.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-primary/10 hover:border-primary/20 transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. WHO THIS IS FOR */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Is the Study Suite Right for You?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    The Study Suite Is For You If:
                  </h3>
                  <ul className="space-y-4">
                    {isFor.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-muted bg-gradient-to-br from-muted/50 to-transparent">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <X className="w-6 h-6 text-muted-foreground" />
                    </div>
                    The Study Suite Is Not For You If:
                  </h3>
                  <ul className="space-y-4">
                    {isNotFor.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Not sure if you're ready?{" "}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link to="/quick-start">
                    Start with the Quick-Start Guide ($17)
                  </Link>
                </Button>{" "}
                to orient yourself first.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. PRICE & CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
              <div className="bg-gradient-to-r from-primary via-accent to-primary p-1" />
              <CardContent className="p-8 md:p-12 space-y-6">
                <div className="flex justify-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Crown className="w-3 h-3 mr-2" />
                    Complete Method Training
                  </Badge>
                  <Badge variant="outline">
                    3 PDFs
                  </Badge>
                </div>

                <h2 className="text-3xl font-bold">PhotoTheology Study Suite</h2>
                <p className="text-muted-foreground">
                  All 8 Floors. All Rooms. Complete skill development for disciplined Bible study.
                </p>

                <div className="py-6">
                  <p className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">$97</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    One-time purchase - Lifetime access to all 3 PDFs
                  </p>
                </div>

                <Button
                  size="lg"
                  asChild
                  className="w-full text-lg py-6 h-auto shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <a href={paymentLinks.studySuite} target="_blank" rel="noopener noreferrer">
                    <Building2 className="w-5 h-5 mr-2" />
                    Get the Complete Study Suite
                  </a>
                </Button>

                <p className="text-xs text-muted-foreground">
                  You are purchasing access to method training—a system you will use for the rest of your
                  Bible study life. This is not content to consume but skill to develop.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 10. FINAL AUTHORITY STATEMENT */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <Building2 className="w-16 h-16 text-primary mx-auto opacity-80" />

            <h2 className="text-2xl md:text-3xl font-bold font-serif">
              Truth Deserves Discipline
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Scripture is not a book to be skimmed. It is a revelation to be studied with
              the same discipline its Author used in composing it. The Palace method honors
              Scripture by meeting it with structure.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              The Study Suite is an invitation to move from casual reading to confident study.
              When you complete this training, you will not be the same kind of Bible reader
              you were before. You will be a student who knows the method.
            </p>

            <p className="text-sm text-muted-foreground italic pt-4">
              — Pastor Ivor Myers
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
