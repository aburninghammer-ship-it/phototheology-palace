import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { Sparkles, Scroll, Crown, MessageSquare, BookOpen, Search } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const DanielRevelationGPT = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load Daniel & Revelation GPT embed script');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Crown className="h-10 w-10 text-primary" />
              <h1 className="text-5xl font-bold text-primary">
                {t('gpt.danielRevelation.title')}
              </h1>
              <HowItWorksDialog
                title={t('gpt.danielRevelation.howToUseTitle')}
                steps={[
                  {
                    title: t('gpt.danielRevelation.steps.aiAssistant.title'),
                    description: t('gpt.danielRevelation.steps.aiAssistant.description'),
                    highlights: [
                      t('gpt.danielRevelation.steps.aiAssistant.highlights.0'),
                      t('gpt.danielRevelation.steps.aiAssistant.highlights.1'),
                      t('gpt.danielRevelation.steps.aiAssistant.highlights.2')
                    ],
                    icon: Sparkles,
                  },
                  {
                    title: t('gpt.danielRevelation.steps.askQuestions.title'),
                    description: t('gpt.danielRevelation.steps.askQuestions.description'),
                    highlights: [
                      t('gpt.danielRevelation.steps.askQuestions.highlights.0'),
                      t('gpt.danielRevelation.steps.askQuestions.highlights.1'),
                      t('gpt.danielRevelation.steps.askQuestions.highlights.2')
                    ],
                    icon: MessageSquare,
                  },
                  {
                    title: t('gpt.danielRevelation.steps.exploreTopics.title'),
                    description: t('gpt.danielRevelation.steps.exploreTopics.description'),
                    highlights: [
                      t('gpt.danielRevelation.steps.exploreTopics.highlights.0'),
                      t('gpt.danielRevelation.steps.exploreTopics.highlights.1'),
                      t('gpt.danielRevelation.steps.exploreTopics.highlights.2')
                    ],
                    icon: BookOpen,
                  },
                  {
                    title: t('gpt.danielRevelation.steps.deepDive.title'),
                    description: t('gpt.danielRevelation.steps.deepDive.description'),
                    highlights: [
                      t('gpt.danielRevelation.steps.deepDive.highlights.0'),
                      t('gpt.danielRevelation.steps.deepDive.highlights.1'),
                      t('gpt.danielRevelation.steps.deepDive.highlights.2')
                    ],
                    icon: Search,
                  },
                ]}
              />
            </div>
            <p className="text-xl text-muted-foreground">{t('gpt.danielRevelation.subtitle')}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>{t('gpt.danielRevelation.tagline')}</span>
            </div>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
              <CardTitle className="text-2xl">{t('gpt.danielRevelation.chatTitle')}</CardTitle>
              <CardDescription className="text-base">
                {t('gpt.danielRevelation.chatDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                id="deployment-23a98e87-a2d5-400a-9cac-60b098de90b7"
                style={{ minHeight: '600px' }}
              />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default DanielRevelationGPT;
