import { Navigation } from "@/components/Navigation";
import { VisualPalace } from "@/components/VisualPalace";
import { ProgressivePalace } from "@/components/palace/ProgressivePalace";

import { PalaceBreadcrumbs } from "@/components/palace/PalaceBreadcrumbs";
import { PalaceTour } from "@/components/onboarding/PalaceTour";
import { PalaceGuidedTour } from "@/components/palace/PalaceGuidedTour";
import { PalaceAudioTour } from "@/components/palace/PalaceAudioTour";
import { PalaceTabTutorial } from "@/components/palace/PalaceTabTutorial";
import { palaceFloors } from "@/data/palaceData";
import { useTranslatedPalaceData } from "@/hooks/useTranslatedPalaceData";
import { Building2, Award, TrendingUp, BookOpen, Target, LayoutGrid, List, Box, Headphones, Share2, PlayCircle } from "lucide-react";
import { EnhancedSocialShare } from "@/components/EnhancedSocialShare";
import { Skeleton } from "@/components/ui/skeleton";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { palaceSteps } from "@/config/howItWorksSteps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { usePalaceProgress } from "@/hooks/usePalaceProgress";
import { usePalaceTour } from "@/hooks/usePalaceTour";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from 'react-i18next';

const Palace = () => {
  const { t } = useTranslation();
  const { translatedFloors } = useTranslatedPalaceData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { completedRooms, completedRoomIds, totalRooms, progressPercentage, loading } = usePalaceProgress();
  const { showTour, loading: tourLoading, completeTour, skipTour } = usePalaceTour();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"explore" | "progress" | "audio-tour">("explore");
  const [viewMode, setViewMode] = useState<"visual" | "list" | "3d">("list");
  const [showTabTutorial, setShowTabTutorial] = useState(false);

  const handleTourComplete = () => {
    completeTour();
    toast.success(t('palace.badgeEarned'), {
      description: t('palace.exploreStoryRoom'),
    });
    navigate("/palace/floor/1/room/sr");
  };

  const handleTourSkip = () => {
    skipTour();
  };

  useEffect(() => {
    const roomParam = searchParams.get('room');
    if (roomParam) {
      const floorNumber = palaceFloors.findIndex(floor =>
        floor.rooms.some(room => room.tag === roomParam)
      ) + 1;

      if (floorNumber > 0) {
        setTimeout(() => {
          const floorElement = document.getElementById(`floor-${floorNumber}`);
          if (floorElement) {
            floorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');

    const sendPurchaseNotification = async () => {
      if (!user) return;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        await supabase.functions.invoke('send-purchase-notification', {
          body: {
            userEmail: user.email || 'Unknown',
            userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown',
            amount: 0,
            currency: 'usd',
            subscriptionTier: profile?.subscription_tier || 'premium',
            isTrialing: false,
            billingInterval: 'month',
          },
        });
        console.log('Purchase notification sent successfully');
      } catch (error) {
        console.error('Failed to send purchase notification:', error);
      }
    };

    if (subscriptionStatus === 'success') {
      toast.success(t('palace.subscriptionSuccess'));
      sendPurchaseNotification();
      navigate('/palace', { replace: true });
    }
  }, [searchParams, user, navigate, t]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      {showTour && !tourLoading && (
        <PalaceTour onComplete={handleTourComplete} onSkip={handleTourSkip} />
      )}

      <div className="pt-20 md:pt-24 pb-24 md:pb-16 px-3 md:px-4">
        <div className="container mx-auto max-w-6xl">
          <PalaceBreadcrumbs />

          <div className="text-center mb-6 md:mb-8">
            <img
              src="/pwa-192x192.png"
              alt="Phototheology"
              className="h-16 w-16 md:h-20 md:w-20 rounded-2xl shadow-lg shadow-primary/20 mx-auto mb-3 md:mb-4"
            />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full gradient-palace border border-white/20 mb-3 md:mb-4 shadow-lg">
              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
              <span className="text-xs md:text-sm font-semibold text-white">{t('palace.masterSystem')}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-palace bg-clip-text text-transparent leading-tight">
              {t('palace.eightFloorPalace')}
            </h1>

            <p className="text-base md:text-xl text-foreground max-w-2xl mx-auto mb-4 px-2">
              {t('palace.heroDescription')}
            </p>

            <div className="flex justify-center gap-2 mb-4 md:mb-6">
              <HowItWorksDialog title={t('palace.howToUse')} steps={palaceSteps} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTabTutorial(true)}
                className="gap-1.5"
              >
                <PlayCircle className="h-4 w-4" />
                Video Tutorial
              </Button>
              <EnhancedSocialShare
                title="Phototheology Palace"
                content="Explore the Bible through the 8-floor Memory Palace system. 38+ rooms of Bible study methods, AI-powered tools, and community."
                url="https://phototheologybible.com/palace"
                defaultMessage="I'm studying the Bible with Phototheology Palace! 🏛️\n\n8 floors, 38+ rooms, each with a unique method for seeing Christ in every chapter.\n\nCheck it out:"
                buttonText="Share"
                buttonVariant="outline"
              />
            </div>

            {user && loading && (
              <Card variant="glass" className="palace-progress-card max-w-md mx-auto mb-4 md:mb-6">
                <CardContent className="p-4 md:pt-6 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-2.5 w-full mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            )}

            {user && !loading && (
              <Card variant="glass" className="max-w-md mx-auto mb-4 md:mb-6">
                <CardContent className="p-4 md:pt-6 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm md:text-base">{t('palace.yourProgress')}</span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {t('palace.roomCount', { completed: completedRooms, total: totalRooms })}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="mb-2 h-2 md:h-2.5" />
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {t('palace.percentComplete', { percent: progressPercentage })}
                  </p>
                </CardContent>
              </Card>
            )}

            {user && (
              <VoiceChatWidget
                roomType="palace"
                roomId="main"
                className="palace-voice-widget max-w-md mx-auto mb-4 md:mb-6"
              />
            )}

            <div className="palace-action-buttons flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0 flex-wrap">
              <Button asChild size="lg" className="gradient-palace text-white h-12 md:h-11 text-base">
                <Link to={user ? "/games/palace_quiz" : "/auth"}>
                  <Building2 className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                  {user ? t('palace.continueLearning') : t('palace.startYourJourney')}
                </Link>
              </Button>
              {user && <PalaceGuidedTour />}
              {completedRooms === totalRooms && (
                <Button asChild size="lg" variant="outline" className="h-12 md:h-11 text-base">
                  <Link to="/certificates">
                    <Award className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                    {t('palace.viewCertificate')}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <Card variant="glassSubtle" className="palace-floor-overview mb-6 md:mb-8 p-4 md:p-6">
            <h2 className="font-serif text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center">
              {t('palace.palaceMetaphor')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm text-muted-foreground">
              <div className="space-y-1 md:space-y-2">
                <Link to="/palace/floor/1" id="floor-1" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">{t('palace.floor1')}</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">{t('palace.floor1Desc')}</span>
                </Link>
                <Link to="/palace/floor/2" id="floor-2" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">{t('palace.floor2')}</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">{t('palace.floor2Desc')}</span>
                </Link>
                <Link to="/palace/floor/3" id="floor-3" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">{t('palace.floor3')}</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">{t('palace.floor3Desc')}</span>
                </Link>
                <Link to="/palace/floor/4" id="floor-4" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">{t('palace.floor4')}</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">{t('palace.floor4Desc')}</span>
                </Link>
              </div>
              <div className="space-y-1 md:space-y-2">
                <Link to="/palace/floor/5" id="floor-5" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">{t('palace.floor5')}</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">{t('palace.floor5Desc')}</span>
                </Link>
                <Link to="/palace/floor/6" id="floor-6" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">{t('palace.floor6')}</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">{t('palace.floor6Desc')}</span>
                </Link>
                <Link to="/palace/floor/7" id="floor-7" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">{t('palace.floor7')}</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">{t('palace.floor7Desc')}</span>
                </Link>
                <Link to="/palace/floor/8" id="floor-8" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">{t('palace.floor8')}</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">{t('palace.floor8Desc')}</span>
                </Link>
              </div>
            </div>
          </Card>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "explore" | "progress" | "audio-tour")} className="palace-tabs mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="explore">
                <Building2 className="h-4 w-4 mr-2" />
                {t('palace.explorePalace')}
              </TabsTrigger>
              <TabsTrigger value="audio-tour">
                <Headphones className="h-4 w-4 mr-2" />
                Audio Tour
              </TabsTrigger>
              <TabsTrigger value="progress">
                <Target className="h-4 w-4 mr-2" />
                {t('palace.yourProgress')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-6">
              <div className="palace-view-toggle flex justify-end gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-2" />
                  {t('palace.guided')}
                </Button>
                <Button
                  variant={viewMode === "visual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("visual")}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  {t('palace.full')}
                </Button>
              </div>

              <div className="mb-12">
                {viewMode === "list" ? (
                  <ProgressivePalace showStartHere={progressPercentage < 20} />
                ) : (
                  <VisualPalace />
                )}
              </div>
            </TabsContent>

            <TabsContent value="audio-tour" className="space-y-4">
              <PalaceAudioTour />
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card variant="glass">
                <CardContent className="pt-6 space-y-6 relative z-10">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{t('palace.journeyTitle')}</h3>
                    <p className="text-muted-foreground">{t('palace.journeyDesc')}</p>
                  </div>

                  {user ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span className="font-medium text-lg">{t('palace.overallProgress')}</span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          {t('palace.roomCount', { completed: completedRooms, total: totalRooms })}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3 mb-2" />
                      <p className="text-center text-2xl font-bold text-primary">
                        {t('palace.percentComplete', { percent: progressPercentage })}
                      </p>

                      <div className="mt-8 space-y-4">
                        <h4 className="font-semibold text-lg mb-4">{t('palace.progressByFloor')}</h4>
                        {translatedFloors.map((floor, index) => {
                          const floorRoomsTotal = floor.rooms.length;
                          const floorRoomsCompleted = floor.rooms.filter(room =>
                            completedRoomIds.includes(room.id)
                          ).length;
                          const floorProgress = floorRoomsTotal > 0 ? (floorRoomsCompleted / floorRoomsTotal) * 100 : 0;

                          return (
                            <div key={floor.number} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{floor.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {t('palace.roomCount', { completed: floorRoomsCompleted, total: floorRoomsTotal })}
                                </span>
                              </div>
                              <Progress value={floorProgress} className="h-2" />
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                        <Button asChild size="lg" variant="secondary">
                          <Link to="/mastery?tab=map">
                            <Target className="mr-2 h-4 w-4" />
                            {t('palace.chooseRoom')}
                          </Link>
                        </Button>
                        <Button asChild size="lg" className="gradient-palace text-white">
                          <Link to="/games/palace_quiz">
                            <BookOpen className="mr-2 h-4 w-4" />
                            {t('palace.continueTraining')}
                          </Link>
                        </Button>
                        {completedRooms === totalRooms && (
                          <Button asChild size="lg" variant="outline">
                            <Link to="/certificates">
                              <Award className="mr-2 h-4 w-4" />
                              {t('palace.viewCertificate')}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg mb-4">{t('palace.signInToTrack')}</p>
                      <Button asChild size="lg" className="gradient-palace text-white">
                        <Link to="/auth">
                          {t('palace.getStarted')}
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />

      {showTabTutorial && (
        <PalaceTabTutorial
          onClose={() => setShowTabTutorial(false)}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      )}
    </div>
  );
};

export default Palace;
