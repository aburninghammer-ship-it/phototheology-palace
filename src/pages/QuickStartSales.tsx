import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Check,
  CheckCircle,
  X,
  ArrowRight,
  BookOpen,
  Layers,
  Target,
  Compass,
  DoorOpen,
  Sparkles,
  MapPin,
  Eye,
  Brain,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useTrackedPaymentLinks } from "@/hooks/useTrackedPaymentLinks";

export default function QuickStartSales() {
  const paymentLinks = useTrackedPaymentLinks();
  const outcomes = [
    "Understand the architectural logic of the Phototheology Palace",
    "Identify the purpose of each of the 8 Floors",
    "Know which Room to enter for any study goal",
    "See why discipline precedes devotion in serious Bible study",
    "Prepare yourself for deeper method training in PhototheologyOS",
  ];

  const included = [
    {
      title: "Palace Overview Map",
      description: "Visual guide to all 8 Floors and their governing purposes",
      icon: MapPin,
    },
    {
      title: "Floor-by-Floor Orientation",
      description: "What each Floor trains and why the sequence matters",
      icon: Layers,
    },
    {
      title: "Room Entry Guide",
      description: "How to identify which Room serves your current study need",
      icon: DoorOpen,
    },
    {
      title: "Discipline Framework",
      description: "The foundational principle: structure before synthesis",
      icon: Brain,
    },
  ];

  const isFor = [
    "Christians who want a structured approach to Bible study",
    "Those who sense there is order in Scripture but lack a framework",
    "Readers tired of fragmented, commentary-dependent study",
    "Anyone preparing to enter serious method training",
  ];

  const isNotFor = [
    "Those seeking devotional content or daily inspirations",
    "Readers wanting quick tips without foundational understanding",
    "Anyone unwilling to learn a structured system before applying it",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PhotoTheology Quick-Start Guide | Enter the Palace"
        description="Understand the architectural foundation of Phototheology. Orientation to the 8-Floor Palace system before method training begins."
      />
      <Navigation />

      {/* 1. HERO SECTION - Enhanced with gradient and visual elements */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

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
            >
              <Badge variant="outline" className="text-primary border-primary/30 px-4 py-1.5 text-sm">
                <Building2 className="w-4 h-4 mr-2" />
                ENTRY LEVEL - Orientation
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Before You Study Scripture,
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Understand the Structure
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              The PhotoTheology Quick-Start Guide orients you to the Palace framework.
              You will understand the architecture before you begin building within it.
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
                className="text-lg px-8 py-6 h-auto shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <a href={paymentLinks.quickStartGuide} target="_blank" rel="noopener noreferrer">
                  Get the Quick-Start Guide - $17
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Instant PDF download
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 hidden lg:block"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-primary/60" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 hidden lg:block"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm border border-accent/20 flex items-center justify-center">
            <Compass className="w-8 h-8 text-accent/60" />
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
                The Problem: Study Without Structure
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
                      <h3 className="font-semibold text-lg">What Most Bible Readers Experience</h3>
                    </div>
                    <ul className="space-y-4 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Reading Scripture without a governing framework
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Forcing Christ-centered conclusions instead of discovering them
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Jumping between methods with no coherent system
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Depending on commentaries to interpret what they read
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        Feeling that Scripture is fragmented rather than unified
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
                      <h3 className="font-semibold text-lg">What Structure Provides</h3>
                    </div>
                    <ul className="space-y-4 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        A mental architecture for organizing all study
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        Clear entry points for different study objectives
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        Understanding of why Floors are sequenced as they are
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        Confidence that Christ emerges through disciplined observation
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        Foundation for transferable method training
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
                Phototheology Is a Method, Not a Message
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground">
              <p className="leading-relaxed">
                Phototheology is a structured Bible study methodology built around a Palace
                framework. The Palace is composed of <strong className="text-foreground">Floors</strong> and{" "}
                <strong className="text-foreground">Rooms</strong> that govern how Scripture is studied,
                interpreted, and centered on Christ.
              </p>
              <p className="leading-relaxed">
                This system emphasizes <strong className="text-foreground">discipline before devotion</strong> and{" "}
                <strong className="text-foreground">structure before synthesis</strong>. You do not begin
                with conclusions. You arrive at them through governed observation.
              </p>

              <Card className="border-primary/20 bg-primary/5 p-6">
                <p className="text-center italic text-foreground">
                  The Quick-Start Guide does not teach you the full method. It orients you to the
                  architecture so you know what you are entering.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. WHERE THIS PRODUCT FITS IN THE PALACE */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Your Position</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Where This Guide Fits in the Palace
              </h2>
            </div>

            <Card className="border-2 border-primary/30 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-primary/20">
                <p className="text-center font-medium">
                  <span className="text-primary">Level:</span> ENTRY — Orientation & Conceptual Framework
                </p>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Compass className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg">This Guide Covers</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Palace architecture overview
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        All 8 Floors introduced
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Room entry logic explained
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Foundational principles
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Eye className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="font-bold text-lg">Skills Developed</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Conceptual orientation</li>
                      <li>Architectural understanding</li>
                      <li>Framework recognition</li>
                      <li>Preparation for method training</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <DoorOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-lg">Not Covered Yet</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Room-by-room method training</li>
                      <li>Skill development exercises</li>
                      <li>Application drills</li>
                      <li>Advanced interpretive tools</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 5. WHAT THE READER WILL BE ABLE TO DO AFTER */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Outcomes</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                After This Guide, You Will Be Able To:
              </h2>
            </div>

            <div className="space-y-4">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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

      {/* 6. WHAT IS INCLUDED */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Contents</Badge>
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

      {/* 7. WHO THIS IS FOR / WHO IT IS NOT FOR */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Is This Guide Right for You?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    This Guide Is For You If:
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
                    This Guide Is Not For You If:
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
          </motion.div>
        </div>
      </section>

      {/* 8. THE NEXT FLOOR */}
      <section className="py-20 bg-gradient-to-br from-accent/10 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <Badge variant="outline" className="text-accent border-accent/30">
              <Layers className="w-3 h-3 mr-2" />
              NEXT LEVEL
            </Badge>

            <h2 className="text-3xl md:text-4xl font-bold">
              After the Quick-Start: The Study Suite
            </h2>

            <p className="text-lg text-muted-foreground">
              Once you understand the Palace architecture, the{" "}
              <strong className="text-foreground">PhotoTheology Study Suite</strong> provides
              method training for each Room. You will move from conceptual understanding to
              skill development.
            </p>

            <p className="text-muted-foreground">
              The Study Suite teaches you how to actually work within each Room—how to observe,
              how to interpret, how to connect, and how to see Christ emerge through
              disciplined study.
            </p>

            <Card className="border-accent/20 bg-accent/5 p-6 mt-8">
              <p className="text-sm text-muted-foreground italic">
                Progression matters. The Quick-Start prepares you. The Study Suite trains you.
              </p>
            </Card>
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
              <div className="bg-gradient-to-r from-primary to-accent p-1" />
              <CardContent className="p-8 md:p-12 space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <BookOpen className="w-3 h-3 mr-2" />
                  Entry Level Training
                </Badge>

                <h2 className="text-3xl font-bold">PhotoTheology Quick-Start Guide</h2>
                <p className="text-muted-foreground">
                  Entry into disciplined Bible study begins with understanding the structure.
                </p>

                <div className="py-6">
                  <p className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">$17</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    One-time purchase - Instant PDF download
                  </p>
                </div>

                <Button
                  size="lg"
                  asChild
                  className="w-full text-lg py-6 h-auto shadow-lg shadow-primary/25"
                >
                  <a href={paymentLinks.quickStartGuide} target="_blank" rel="noopener noreferrer">
                    <Target className="w-5 h-5 mr-2" />
                    Get the Quick-Start Guide
                  </a>
                </Button>

                <p className="text-xs text-muted-foreground">
                  This is not a subscription. You are purchasing access to training, not content consumption.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* GENESIS IN 6 DAYS */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
                <Sparkles className="w-3 h-3 mr-2" />
                Starter Study
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Genesis in 6 Days
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience Phototheology in action. Walk through the first chapter of Scripture 
                using the Palace method—one creation day at a time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-background">
                <CardContent className="p-8 space-y-6">
                  <h3 className="font-bold text-xl">What You'll Discover</h3>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>How each creation day reveals Christ's redemptive pattern</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Palace Room applications for Genesis 1</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>The typological structure of creation week</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Practical exercises for each day's study</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Cross-references that unlock Genesis across Scripture</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/10 via-background to-primary/5 overflow-hidden">
                <div className="bg-gradient-to-r from-accent to-primary p-1" />
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-accent" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold">Genesis in 6 Days</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      A Phototheology starter study
                    </p>
                  </div>

                  <div className="py-4">
                    <p className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">$9</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Instant PDF download
                    </p>
                  </div>

                  <Button
                    size="lg"
                    asChild
                    className="w-full text-lg py-6 h-auto shadow-lg shadow-accent/25 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
                  >
                    <a href={paymentLinks.genesis6Days} target="_blank" rel="noopener noreferrer">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Get Genesis in 6 Days
                    </a>
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Perfect companion to the Quick-Start Guide
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-primary/5 p-6 mt-8">
              <p className="text-center italic text-muted-foreground">
                "Before you can study the whole Bible, you must learn to see Christ in one chapter. 
                Genesis 1 is where vision begins."
              </p>
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
              Scripture Deserves Structure
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Truth deserves discipline. The Bible is not a collection of inspirational
              fragments—it is an architecturally unified revelation of Christ.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              The Quick-Start Guide is an invitation to see that architecture before you
              begin building within it. There is no pressure here—only an open door for
              those ready to study with discipline.
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
