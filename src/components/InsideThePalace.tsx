import { useTranslation } from 'react-i18next';
import { Brain, Building2, Target, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const InsideThePalace = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Building2,
      title: t('insidePalace.visualMemory'),
      description: t('insidePalace.visualMemoryDesc'),
    },
    {
      icon: Target,
      title: t('insidePalace.patternDetection'),
      description: t('insidePalace.patternDetectionDesc'),
    },
    {
      icon: BookOpen,
      title: t('insidePalace.seeJesus'),
      description: t('insidePalace.seeJesusDesc'),
    },
    {
      icon: Sparkles,
      title: t('insidePalace.guidedTraining'),
      description: t('insidePalace.guidedTrainingDesc'),
    },
    {
      icon: Brain,
      title: t('insidePalace.prophecy'),
      description: t('insidePalace.prophecyDesc'),
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          {t('insidePalace.title')}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} variant="glass" className="hover:scale-[1.02] transition-transform">
                <CardContent className="pt-6 relative z-10">
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
