import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  ArrowRight,
  BookOpen,
  Sparkles,
  Eye,
  Target,
  Compass,
  Layers,
  Clock,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useTrackedPaymentLinks } from "@/hooks/useTrackedPaymentLinks";
import { useTranslation } from 'react-i18next';

export default function BibleProphecyGuide() {
  const { t } = useTranslation();
  const paymentLinks = useTrackedPaymentLinks();
  const STRIPE_LINK = paymentLinks.genesis6Days;

  const whatYouGet = [
    {
      title: t('prophecyGuide.sixDayGuidedStudy'),
      description: t('prophecyGuide.sixDayGuidedStudyDesc'),
      icon: Clock,
    },
    {
      title: t('prophecyGuide.christCenteredFramework'),
      description: t('prophecyGuide.christCenteredFrameworkDesc'),
      icon: Target,
    },
    {
      title: t('prophecyGuide.practicalExercises'),
      description: t('prophecyGuide.practicalExercisesDesc'),
      icon: Eye,
    },
    {
      title: t('prophecyGuide.crossReferenceMaps'),
      description: t('prophecyGuide.crossReferenceMapsDesc'),
      icon: Compass,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Genesis in 6 Days | The 24FPS Memory Palace Method - See Every Chapter Clearly"
        description="Learn Genesis as one continuous story. Turn Genesis into unforgettable images with the 24FPS Memory Palace Method. A structured Genesis study system with visual frames for every chapter."
      />
      <Navigation />

      {/* HERO - Keyword-focused, single product */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <Badge variant="outline" className="text-accent border-accent/30 px-4 py-1.5">
              <BookOpen className="w-4 h-4 mr-2" />
              {t('prophecyGuide.badgeMethod')}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                {t('prophecyGuide.heroTitle')}
              </span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl text-foreground/90">
                {t('prophecyGuide.heroSubtitle')}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <strong className="text-foreground">{t('prophecyGuide.heroBoldText')}</strong> {t('prophecyGuide.heroDescription')}
            </p>

            <div className="pt-6 flex flex-col items-center gap-4">
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-6 h-auto shadow-lg shadow-accent/25 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
              >
                <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer">
                  {t('prophecyGuide.getTheGuide')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('prophecyGuide.instantPdfNoSub')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('prophecyGuide.problemTitle')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <X className="w-5 h-5 text-destructive" />
                    {t('prophecyGuide.whatMostReadersExperience')}
                  </h3>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      {t('prophecyGuide.problemIsolatedHistory')}
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      {t('prophecyGuide.problemMissingTypology')}
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      {t('prophecyGuide.problemNoFramework')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    {t('prophecyGuide.whatThisGuideProvides')}
                  </h3>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {t('prophecyGuide.provideContinuousStory')}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {t('prophecyGuide.provideUnforgettableImages')}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {t('prophecyGuide.provideStructuredSystem')}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">{t('prophecyGuide.whatsInside')}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('prophecyGuide.yourSixDayJourney')}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {whatYouGet.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-accent/10 hover:border-accent/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-accent/10">
                          <item.icon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE INSIGHT */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="w-3 h-3 mr-2" />
              {t('prophecyGuide.sampleInsight')}
            </Badge>

            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5 p-8">
              <h3 className="text-xl font-semibold mb-4">{t('prophecyGuide.day1Title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('prophecyGuide.day1Intro')}
                <br /><br />
                <strong className="text-foreground">{t('prophecyGuide.day1Verse')}</strong>
                <br /><br />
                {t('prophecyGuide.day1Conclusion')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/10 via-background to-primary/10 overflow-hidden">
              <div className="bg-gradient-to-r from-accent to-primary p-1" />
              <CardContent className="p-8 md:p-10 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8 text-accent" />
                </div>
                
                <h2 className="text-2xl font-bold">{t('prophecyGuide.heroTitle')}</h2>
                <p className="text-muted-foreground">
                  {t('prophecyGuide.ctaDescription')}
                </p>

                <div className="py-4">
                  <p className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{t('prophecyGuide.price')}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('prophecyGuide.instantPdf')}
                  </p>
                </div>

                <Button
                  size="lg"
                  asChild
                  className="w-full text-lg py-6 h-auto shadow-lg shadow-accent/25 bg-gradient-to-r from-accent to-primary"
                >
                  <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-5 h-5 mr-2" />
                    {t('prophecyGuide.getTheGuideNow')}
                  </a>
                </Button>

                <p className="text-xs text-muted-foreground">
                  {t('prophecyGuide.oneTimePurchase')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S NEXT TEASER */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <Badge variant="outline" className="text-muted-foreground">
              <Layers className="w-3 h-3 mr-2" />
              {t('prophecyGuide.afterGenesis')}
            </Badge>
            <h3 className="text-xl font-semibold">
              {t('prophecyGuide.oneChapterTitle')}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t('prophecyGuide.oneChapterDescription')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
