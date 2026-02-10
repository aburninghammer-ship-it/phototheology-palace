import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Home, Info, Brain, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import BibleRenderedDrill from "@/components/rooms/BibleRenderedDrill";
import BibleRenderedBrowser from "@/components/rooms/BibleRenderedBrowser";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BibleRenderedRoom = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="container max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate('/palace')}>
                <Home className="h-4 w-4" />
              </Button>
              <h1 className="text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
                {t('bibleRendered.title')}
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {t('bibleRendered.subtitle')}
            </p>
          </div>
          <Badge variant="outline" className="hidden md:flex items-center gap-2">
            <BookOpen className="h-3 w-3" />
            {t('bibleRendered.floor1Furnishing')}
          </Badge>
        </div>

        {/* Core Concept Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              {t('bibleRendered.bibleIn50Symbols')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('bibleRendered.systemDescription')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-2xl mb-1">÷</div>
                <p className="text-xs font-medium">Gen 1–24</p>
                <p className="text-xs text-muted-foreground">{t('bibleRendered.division')}</p>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-2xl mb-1">×</div>
                <p className="text-xs font-medium">Gen 25–50</p>
                <p className="text-xs text-muted-foreground">{t('bibleRendered.multiplication')}</p>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-2xl mb-1">🩸</div>
                <p className="text-xs font-medium">Ex 1–24</p>
                <p className="text-xs text-muted-foreground">{t('bibleRendered.deliverance')}</p>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-2xl mb-1">✝</div>
                <p className="text-xs font-medium">Luke–John</p>
                <p className="text-xs text-muted-foreground">{t('bibleRendered.theCross')}</p>
              </div>
              <div className="p-3 rounded-lg bg-background border bg-blue-50/50 dark:bg-blue-950/20">
                <div className="text-2xl mb-1">🏙✨</div>
                <p className="text-xs font-medium">Rev 17–22</p>
                <p className="text-xs text-muted-foreground">{t('bibleRendered.heaven')}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              {t('bibleRendered.masterAllSymbols')}
            </p>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="drill" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="drill" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              {t('bibleRendered.memorizationDrill')}
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t('bibleRendered.browseSets')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="drill">
            <BibleRenderedDrill />
          </TabsContent>
          <TabsContent value="browse">
            <BibleRenderedBrowser />
          </TabsContent>
        </Tabs>

        {/* Room Info Accordion */}
        <Accordion type="single" collapsible className="bg-muted/30 rounded-lg">
          <AccordionItem value="about" className="border-none">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Info className="h-4 w-4" />
                {t('bibleRendered.aboutTitle')}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  {t('bibleRendered.aboutDescription')}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">{t('bibleRendered.coreQuestion')}</h4>
                    <p>{t('bibleRendered.coreQuestionText')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">{t('bibleRendered.purpose')}</h4>
                    <p>
                      {t('bibleRendered.purposeText')}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{t('bibleRendered.howToUse')}</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li><strong>{t('bibleRendered.learnMode')}</strong> {t('bibleRendered.learnModeDesc')}</li>
                    <li><strong>{t('bibleRendered.symbolToRange')}</strong> {t('bibleRendered.symbolToRangeDesc')}</li>
                    <li><strong>{t('bibleRendered.rangeToSymbol')}</strong> {t('bibleRendered.rangeToSymbolDesc')}</li>
                    <li><strong>{t('bibleRendered.nameToSymbol')}</strong> {t('bibleRendered.nameToSymbolDesc')}</li>
                    <li><strong>{t('bibleRendered.fullQuiz')}</strong> {t('bibleRendered.fullQuizDesc')}</li>
                  </ol>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Footer />
    </div>
  );
};

export default BibleRenderedRoom;
