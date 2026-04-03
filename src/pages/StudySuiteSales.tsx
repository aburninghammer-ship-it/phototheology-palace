import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const paymentLinks = useTrackedPaymentLinks();
  const floors = [
    {
      number: 1,
      name: t('studySuite.floor1Name'),
      skill: t('studySuite.floor1Skill'),
      icon: BookOpen,
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      number: 2,
      name: t('studySuite.floor2Name'),
      skill: t('studySuite.floor2Skill'),
      icon: Eye,
      color: "from-green-500/20 to-green-500/5",
    },
    {
      number: 3,
      name: t('studySuite.floor3Name'),
      skill: t('studySuite.floor3Skill'),
      icon: Brain,
      color: "from-purple-500/20 to-purple-500/5",
    },
    {
      number: 4,
      name: t('studySuite.floor4Name'),
      skill: t('studySuite.floor4Skill'),
      icon: Target,
      color: "from-red-500/20 to-red-500/5",
    },
    {
      number: 5,
      name: t('studySuite.floor5Name'),
      skill: t('studySuite.floor5Skill'),
      icon: Hammer,
      color: "from-orange-500/20 to-orange-500/5",
    },
    {
      number: 6,
      name: t('studySuite.floor6Name'),
      skill: t('studySuite.floor6Skill'),
      icon: Network,
      color: "from-cyan-500/20 to-cyan-500/5",
    },
    {
      number: 7,
      name: t('studySuite.floor7Name'),
      skill: t('studySuite.floor7Skill'),
      icon: Flame,
      color: "from-amber-500/20 to-amber-500/5",
    },
    {
      number: 8,
      name: t('studySuite.floor8Name'),
      skill: t('studySuite.floor8Skill'),
      icon: Telescope,
      color: "from-indigo-500/20 to-indigo-500/5",
    },
  ];

  const outcomes = [
    t('studySuite.outcome1'),
    t('studySuite.outcome2'),
    t('studySuite.outcome3'),
    t('studySuite.outcome4'),
    t('studySuite.outcome5'),
    t('studySuite.outcome6'),
    t('studySuite.outcome7'),
    t('studySuite.outcome8'),
  ];

  const included = [
    {
      title: t('studySuite.includedTitle1'),
      description: t('studySuite.includedDesc1'),
      icon: Layers,
    },
    {
      title: t('studySuite.includedTitle2'),
      description: t('studySuite.includedDesc2'),
      icon: GraduationCap,
    },
    {
      title: t('studySuite.includedTitle3'),
      description: t('studySuite.includedDesc3'),
      icon: Brain,
    },
    {
      title: t('studySuite.includedTitle4'),
      description: t('studySuite.includedDesc4'),
      icon: Target,
    },
    {
      title: t('studySuite.includedTitle5'),
      description: t('studySuite.includedDesc5'),
      icon: Network,
    },
    {
      title: t('studySuite.includedTitle6'),
      description: t('studySuite.includedDesc6'),
      icon: Telescope,
    },
  ];

  const isFor = [
    t('studySuite.isFor1'),
    t('studySuite.isFor2'),
    t('studySuite.isFor3'),
    t('studySuite.isFor4'),
    t('studySuite.isFor5'),
  ];

  const isNotFor = [
    t('studySuite.isNotFor1'),
    t('studySuite.isNotFor2'),
    t('studySuite.isNotFor3'),
    t('studySuite.isNotFor4'),
  ];

  const suiteContents = [
    {
      title: t('studySuite.part1Title'),
      subtitle: t('studySuite.part1Subtitle'),
      description: t('studySuite.part1Description'),
      floors: t('studySuite.part1Floors'),
    },
    {
      title: t('studySuite.part2Title'),
      subtitle: t('studySuite.part2Subtitle'),
      description: t('studySuite.part2Description'),
      floors: t('studySuite.part2Floors'),
    },
    {
      title: t('studySuite.part3Title'),
      subtitle: t('studySuite.part3Subtitle'),
      description: t('studySuite.part3Description'),
      floors: t('studySuite.part3Floors'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t('studySuite.seoTitle')}
        description={t('studySuite.seoDescription')}
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
                {t('studySuite.coreLevelBadge')}
              </Badge>
              <Badge className="bg-accent/20 text-accent border-accent/30 px-3 py-1.5 text-sm">
                {t('studySuite.pdfsIncluded')}
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              {t('studySuite.heroTitle1')}
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {t('studySuite.heroTitle2')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              {t('studySuite.heroDescription')}
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
                <a href="/pricing" rel="noopener noreferrer">
                  {t('studySuite.getCompleteStudySuitePrice')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('studySuite.instantAccess')}
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
              <Badge variant="secondary" className="mb-4">{t('studySuite.theChallenge')}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('studySuite.problemTitle')}
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
                      <h3 className="font-semibold text-lg">{t('studySuite.understandingWithoutCompetency')}</h3>
                    </div>
                    <ul className="space-y-4 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        {t('studySuite.problem1')}
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        {t('studySuite.problem2')}
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        {t('studySuite.problem3')}
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        {t('studySuite.problem4')}
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        {t('studySuite.problem5')}
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
                      <h3 className="font-semibold text-lg">{t('studySuite.methodTrainingProvides')}</h3>
                    </div>
                    <ul className="space-y-4 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {t('studySuite.solution1')}
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {t('studySuite.solution2')}
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {t('studySuite.solution3')}
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {t('studySuite.solution4')}
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {t('studySuite.solution5')}
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
                {t('studySuite.methodTrainingTitle')}
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground">
              <p className="leading-relaxed">
                {t('studySuite.methodTrainingPara1')}
              </p>
              <p className="leading-relaxed">
                {t('studySuite.methodTrainingPara2')}
              </p>

              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6">
                <p className="text-center italic text-foreground">
                  {t('studySuite.methodTrainingQuote')}
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
                {t('studySuite.comprehensivePdfs')}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('studySuite.completePackageTitle')}
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                {t('studySuite.completePackageDescription')}
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
              <Badge variant="secondary" className="mb-4">{t('studySuite.completeTraining')}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('studySuite.eightFloorsTitle')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('studySuite.eightFloorsDescription')}
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
                    <strong className="text-foreground">{t('studySuite.levelLabel')}</strong> {t('studySuite.levelDescription')}
                    <br />
                    <span className="text-sm">
                      {t('studySuite.levelDetails')}
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
              <Badge variant="secondary" className="mb-4">{t('studySuite.transformation')}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('studySuite.outcomesTitle')}
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
              <Badge variant="secondary" className="mb-4">{t('studySuite.trainingComponents')}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('studySuite.whatIsIncluded')}
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
                {t('studySuite.rightForYouTitle')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    {t('studySuite.isForYouTitle')}
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
                    {t('studySuite.isNotForYouTitle')}
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
                {t('studySuite.notSureReady')}{" "}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link to="/quick-start">
                    {t('studySuite.quickStartLink')}
                  </Link>
                </Button>{" "}
                {t('studySuite.toOrientFirst')}
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
                    {t('studySuite.completeMethodTrainingBadge')}
                  </Badge>
                  <Badge variant="outline">
                    {t('studySuite.threePdfs')}
                  </Badge>
                </div>

                <h2 className="text-3xl font-bold">{t('studySuite.ctaTitle')}</h2>
                <p className="text-muted-foreground">
                  {t('studySuite.ctaDescription')}
                </p>

                <div className="py-6">
                  <p className="text-2xl font-bold text-primary">Now included with PhototheologyOS subscription</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Access all training materials with your membership
                  </p>
                </div>

                <Button
                  size="lg"
                  asChild
                  className="w-full text-lg py-6 h-auto shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <a href="/pricing" rel="noopener noreferrer">
                    <Building2 className="w-5 h-5 mr-2" />
                    {t('studySuite.getCompleteStudySuite')}
                  </a>
                </Button>

                <p className="text-xs text-muted-foreground">
                  {t('studySuite.ctaDisclaimer')}
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
              {t('studySuite.finalStatementTitle')}
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('studySuite.finalStatementPara1')}
            </p>

            <p className="text-muted-foreground leading-relaxed">
              {t('studySuite.finalStatementPara2')}
            </p>

            <p className="text-sm text-muted-foreground italic pt-4">
              {t('studySuite.authorAttribution')}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
