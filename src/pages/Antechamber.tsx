import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Castle, CheckCircle, ChevronRight, Shield, BookOpen, Eye, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useGatehouseStatus } from '@/hooks/useGatehouseStatus';
import { Navigation } from '@/components/Navigation';

const Antechamber = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { markPalaceEntered } = useGatehouseStatus();
  const [covenantAccepted, setCovenantAccepted] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const handleEnterPalace = async () => {
    if (!user) {
      navigate('/auth?redirect=/antechamber');
      return;
    }

    if (!covenantAccepted) return;

    setIsEntering(true);
    const success = await markPalaceEntered();
    
    if (success) {
      // Navigate to goals survey before the palace
      navigate('/goals-survey');
    } else {
      setIsEntering(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <Castle className="h-16 w-16 mx-auto text-amber-500 mb-6" />
          <h1 className="text-3xl font-serif font-bold mb-4">{t('palace.antechamber.createYourKey')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('palace.antechamber.toEnterPalace')}
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth?redirect=/antechamber')}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {t('palace.antechamber.secureYourEntry')}
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex p-4 rounded-full bg-amber-500/20 mb-6">
            <Castle className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
            {t('palace.antechamber.theAntechamber')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('palace.antechamber.beforeYouEnter')}
          </p>
        </motion.div>

        {/* What the Palace Is */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {t('palace.antechamber.whatPalaceIs')}
            </h2>
            <ul className="space-y-3">
              {[
                t('palace.antechamber.palaceIs1'),
                t('palace.antechamber.palaceIs2'),
                t('palace.antechamber.palaceIs3'),
                t('palace.antechamber.palaceIs4'),
                t('palace.antechamber.palaceIs5'),
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* What the Palace Requires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6 border-amber-500/30">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-amber-500" />
              {t('palace.antechamber.whatPalaceRequires')}
            </h2>
            <ul className="space-y-3">
              {[
                t('palace.antechamber.requires1'),
                t('palace.antechamber.requires2'),
                t('palace.antechamber.requires3'),
                t('palace.antechamber.requires4'),
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <ChevronRight className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* What the Palace Is Not */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6 bg-muted/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              {t('palace.antechamber.whatPalaceIsNot')}
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• {t('palace.antechamber.isNot1')}</li>
              <li>• {t('palace.antechamber.isNot2')}</li>
              <li>• {t('palace.antechamber.isNot3')}</li>
              <li>• {t('palace.antechamber.isNot4')}</li>
            </ul>
            <p className="mt-4 text-sm italic">
              "Unto whomsoever much is given, of him shall be much required" — Luke 12:48
            </p>
          </Card>
        </motion.div>

        {/* The Covenant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="p-6 border-2 border-primary/30 bg-primary/5">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t('palace.antechamber.theCovenant')}
            </h2>
            <div className="prose prose-sm dark:prose-invert mb-6">
              <p className="text-foreground">
                {t('palace.antechamber.covenantLine1')}<br />
                {t('palace.antechamber.covenantLine2')}<br />
                {t('palace.antechamber.covenantLine3')}
              </p>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <Checkbox
                id="covenant"
                checked={covenantAccepted}
                onCheckedChange={(checked) => setCovenantAccepted(checked as boolean)}
                className="mt-0.5"
              />
              <label 
                htmlFor="covenant" 
                className="text-sm cursor-pointer leading-relaxed"
              >
                {t('palace.antechamber.covenantCheckbox')}
              </label>
            </div>
          </Card>
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleEnterPalace}
            disabled={!covenantAccepted || isEntering}
            className="px-12 py-6 text-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
          >
            {isEntering ? (
              t('palace.antechamber.openingGates')
            ) : (
              <>
                <Castle className="mr-2 h-5 w-5" />
                {t('palace.antechamber.enterThePalace')}
              </>
            )}
          </Button>
          
          <p className="mt-4 text-xs text-muted-foreground">
            "I am the door: by me if any man enter in, he shall be saved" — John 10:9
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Antechamber;
