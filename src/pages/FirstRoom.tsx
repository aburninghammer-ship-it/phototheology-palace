import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Castle, Eye, Lightbulb, ArrowRight, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const FIRST_ROOM_STEPS_STATIC = [
  {
    id: 'welcome',
    titleKey: 'palace.firstRoom.welcomeTitle',
    contentKey: 'palace.firstRoom.welcomeContent',
  },
  {
    id: 'verse',
    titleKey: 'palace.firstRoom.verseTitle',
    subtitleKey: 'palace.firstRoom.verseSubtitle',
    verse: 'Genesis 22:8',
    verseTextKey: 'palace.firstRoom.verseText',
    instructionKey: 'palace.firstRoom.verseInstruction',
  },
  {
    id: 'observe',
    titleKey: 'palace.firstRoom.observeTitle',
    instructionKey: 'palace.firstRoom.observeInstruction',
    exampleKeys: ['palace.firstRoom.observeExample1', 'palace.firstRoom.observeExample2', 'palace.firstRoom.observeExample3'],
  },
  {
    id: 'connection',
    titleKey: 'palace.firstRoom.connectionTitle',
    revelationKey: 'palace.firstRoom.connectionRevelation',
    questionKey: 'palace.firstRoom.connectionQuestion',
  },
  {
    id: 'insight',
    titleKey: 'palace.firstRoom.insightTitle',
    contentKey: 'palace.firstRoom.insightContent',
    reflectionKey: 'palace.firstRoom.insightReflection',
  },
  {
    id: 'complete',
    titleKey: 'palace.firstRoom.completeTitle',
    contentKey: 'palace.firstRoom.completeContent',
    ctaKey: 'palace.firstRoom.completeCta',
  },
];

const FirstRoom = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [observations, setObservations] = useState(['', '', '']);
  const [userConnection, setUserConnection] = useState('');

  const stepData = FIRST_ROOM_STEPS_STATIC[currentStep];
  const step = {
    id: stepData.id,
    title: t(stepData.titleKey),
    content: stepData.contentKey ? t(stepData.contentKey) : undefined,
    subtitle: stepData.subtitleKey ? t(stepData.subtitleKey) : undefined,
    verse: stepData.verse,
    verseText: stepData.verseTextKey ? t(stepData.verseTextKey) : undefined,
    instruction: stepData.instructionKey ? t(stepData.instructionKey) : undefined,
    examples: stepData.exampleKeys ? stepData.exampleKeys.map((k: string) => t(k)) : undefined,
    revelation: stepData.revelationKey ? t(stepData.revelationKey) : undefined,
    question: stepData.questionKey ? t(stepData.questionKey) : undefined,
    reflection: stepData.reflectionKey ? t(stepData.reflectionKey) : undefined,
    cta: stepData.ctaKey ? t(stepData.ctaKey) : undefined,
  };

  const handleNext = () => {
    if (currentStep < FIRST_ROOM_STEPS_STATIC.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/palace');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (step.id === 'observe') {
      return observations.some(o => o.trim().length > 0);
    }
    if (step.id === 'connection') {
      return userConnection.trim().length > 0 || true; // Allow skipping
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {FIRST_ROOM_STEPS_STATIC.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i <= currentStep ? 'bg-amber-500' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 md:p-12">
              {/* Step: Welcome */}
              {step.id === 'welcome' && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="inline-flex p-4 rounded-full bg-amber-500/20 mb-6"
                  >
                    <Castle className="h-12 w-12 text-amber-500" />
                  </motion.div>
                  <h1 className="text-3xl font-serif font-bold mb-4">{step.title}</h1>
                  <p className="text-lg text-muted-foreground">{step.content}</p>
                </div>
              )}

              {/* Step: Verse */}
              {step.id === 'verse' && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-amber-500 mb-2">
                    <Eye className="h-4 w-4" />
                    <span>{step.subtitle}</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-6">{step.title}</h2>
                  
                  <Card className="p-6 bg-muted/50 mb-6">
                    <p className="text-sm font-medium text-primary mb-2">{step.verse}</p>
                    <p className="text-xl font-serif italic leading-relaxed">
                      {step.verseText}
                    </p>
                  </Card>
                  
                  <p className="text-muted-foreground">{step.instruction}</p>
                </div>
              )}

              {/* Step: Observe */}
              {step.id === 'observe' && (
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-2">{step.title}</h2>
                  <p className="text-muted-foreground mb-6">{step.instruction}</p>
                  
                  <div className="space-y-4 mb-6">
                    {observations.map((obs, i) => (
                      <div key={i}>
                        <label className="text-sm text-muted-foreground mb-1 block">
                          {t('palace.firstRoom.observationLabel', { number: i + 1 })}
                        </label>
                        <Input
                          value={obs}
                          onChange={(e) => {
                            const newObs = [...observations];
                            newObs[i] = e.target.value;
                            setObservations(newObs);
                          }}
                          placeholder={step.examples?.[i]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step: Connection */}
              {step.id === 'connection' && (
                <div>
                  <div className="flex items-center gap-2 text-amber-500 mb-4">
                    <Lightbulb className="h-5 w-5" />
                    <h2 className="text-2xl font-serif font-bold">{step.title}</h2>
                  </div>
                  
                  <Card className="p-6 bg-amber-500/10 border-amber-500/30 mb-6">
                    <p className="text-lg leading-relaxed">{step.revelation}</p>
                  </Card>
                  
                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {step.question}
                    </label>
                    <Textarea
                      value={userConnection}
                      onChange={(e) => setUserConnection(e.target.value)}
                      placeholder={t('palace.firstRoom.connectionPlaceholder')}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step: Insight */}
              {step.id === 'insight' && (
                <div>
                  <div className="flex items-center gap-2 text-amber-500 mb-4">
                    <Sparkles className="h-5 w-5" />
                    <h2 className="text-2xl font-serif font-bold">{step.title}</h2>
                  </div>
                  
                  <Card className="p-6 bg-primary/10 border-primary/30 mb-6">
                    <p className="text-sm font-medium text-primary mb-2">John 1:29</p>
                    <p className="text-xl font-serif italic">
                      "Behold the Lamb of God, which taketh away the sin of the world."
                    </p>
                  </Card>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.reflection}
                  </p>
                </div>
              )}

              {/* Step: Complete */}
              {step.id === 'complete' && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="inline-flex p-4 rounded-full bg-green-500/20 mb-6"
                  >
                    <BookOpen className="h-12 w-12 text-green-500" />
                  </motion.div>
                  <h1 className="text-3xl font-serif font-bold mb-4">{step.title}</h1>
                  <p className="text-lg text-muted-foreground mb-2">{step.content}</p>
                  <p className="text-sm text-muted-foreground italic">
                    "You do not run free in the sanctuary without instruction."
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex justify-between items-center">
                {currentStep > 0 ? (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    {t('common.back')}
                  </Button>
                ) : (
                  <div />
                )}
                
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  size="lg"
                  className={step.id === 'complete' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                >
                  {step.id === 'complete' ? (
                    <>
                      {step.cta}
                      <Castle className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      {t('common.continue')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FirstRoom;
