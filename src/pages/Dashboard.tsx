import { useEffect, useState } from "react";
import { LockInMissionTracker } from "@/components/LockInMissionTracker";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { DASHBOARD_TOUR } from "@/data/guidedTours";
import { LockInConversionBanner } from "@/components/LockInConversionBanner";
import { LockInPassAllowanceWidget } from "@/components/LockInPassAllowanceWidget";
import { useTranslation } from "react-i18next";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { SpacedRepetitionReview } from "@/components/SpacedRepetitionReview";
import { DashboardSkeleton } from "@/components/SkeletonLoader";
import { PalaceProgressDashboard } from "@/components/PalaceProgressDashboard";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { ExperienceModeIndicator } from "@/components/experience-mode/ExperienceModeIndicator";
import { JeevesWelcomeModal } from "@/components/retention/JeevesWelcomeModal";
import { PathBanner, PathDashboardWidget } from "@/components/path";
import { QuickNotes } from "@/components/notes/QuickNotes";
import { CommunityHighlight } from "@/components/dashboard/CommunityHighlight";
import { QuickAIPrompt } from "@/components/dashboard/QuickAIPrompt";
import { DailyAudioDevotional } from "@/components/DailyAudioDevotional";
import { Brain, Building2, Headphones, Calendar, Volume2, GraduationCap } from "lucide-react";
import {
  BookOpen,
  Flame,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Award,
  Play,
  History,
  Users,
  Star,
  Sparkles,
  ChevronRight,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { XPSystem, BadgeSystem, WeeklyLeaderboard } from "@/components/gamification";
import { IdentityLoopWidget } from "@/components/IdentityLoopWidget";
import { StudyToolsQuickAccess } from "@/components/StudyToolsQuickAccess";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { SermonForgeWidget } from "@/components/dashboard/SermonForgeWidget";
import { ResearchAssistantWidget } from "@/components/dashboard/ResearchAssistantWidget";
import { WeeklyChallengeWidget, WinnerBanner } from "@/components/weekly-challenge";
import { GoalsSurveyBanner } from "@/components/goals-survey/GoalsSurveyBanner";
import { TodaysChallengeCard } from "@/components/dashboard/TodaysChallengeCard";

interface DashboardStats {
  dailyStreak: number;
  totalPoints: number;
  level: number;
  chesStreak: number;
  gemStreak: number;
  studyStreak: number;
  recentActivity: string[];
}

const featuredContent = [
  {
    day: 1,
    titleKey: "dashboard.chainChess",
    descriptionKey: "dashboard.chainChessDesc",
    path: "/chain-chess",
    icon: Target,
    gradient: "gradient-ocean",
    reasonKey: "dashboard.chainChessReason"
  },
  {
    day: 2,
    titleKey: "dashboard.treasureHunt",
    descriptionKey: "dashboard.treasureHuntDesc",
    path: "/treasure-hunt",
    icon: Sparkles,
    gradient: "gradient-palace",
    reasonKey: "dashboard.treasureHuntReason"
  },
  {
    day: 3,
    titleKey: "dashboard.danielRevGpt",
    descriptionKey: "dashboard.danielRevGptDesc",
    path: "/daniel-revelation-gpt",
    icon: Brain,
    gradient: "gradient-dreamy",
    reasonKey: "dashboard.danielRevGptReason"
  },
  {
    day: 4,
    titleKey: "dashboard.memoryPalace",
    descriptionKey: "dashboard.memoryPalaceDesc",
    path: "/palace",
    icon: Building2,
    gradient: "gradient-ocean",
    reasonKey: "dashboard.memoryPalaceReason"
  },
  {
    day: 5,
    titleKey: "dashboard.escapeRooms",
    descriptionKey: "dashboard.escapeRoomsDesc",
    path: "/escape-room",
    icon: Clock,
    gradient: "gradient-palace",
    reasonKey: "dashboard.escapeRoomsReason"
  },
  {
    day: 6,
    titleKey: "dashboard.communityPartners",
    descriptionKey: "dashboard.communityPartnersDesc",
    path: "/community",
    icon: Users,
    gradient: "gradient-dreamy",
    reasonKey: "dashboard.communityPartnersReason"
  },
  {
    day: 0,
    titleKey: "dashboard.revelationCourse",
    descriptionKey: "dashboard.revelationCourseDesc",
    path: "/revelation-course",
    icon: BookOpen,
    gradient: "gradient-ocean",
    reasonKey: "dashboard.revelationCourseReason"
  },
];

const getFeaturedToday = () => {
  const today = new Date().getDay();
  return featuredContent.find(item => item.day === today) || featuredContent[0];
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getRecentReading } = useReadingHistory();
  const { preferences } = useUserPreferences();
  const { meetsMinMode } = useExperienceMode();
  const showGuidedWidgets = meetsMinMode("explorer"); // explorer + immersion
  const [stats, setStats] = useState<DashboardStats>({
    dailyStreak: 0,
    totalPoints: 0,
    level: 1,
    chesStreak: 0,
    gemStreak: 0,
    studyStreak: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [recentReading, setRecentReading] = useState<any[]>([]);
  const [tourOpen, setTourOpen] = useState(false);
  const featured = getFeaturedToday();
  const FeaturedIcon = featured.icon;

  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadRecentReading();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadRecentReading = async () => {
    const history = await getRecentReading(3);
    setRecentReading(history);
  };

  const loadDashboardData = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (profile) {
        setStats({
          dailyStreak: profile.daily_study_streak || 0,
          totalPoints: profile.points || 0,
          level: profile.level || 1,
          chesStreak: profile.chain_chess_streak || 0,
          gemStreak: profile.gem_creation_streak || 0,
          studyStreak: profile.daily_study_streak || 0,
          recentActivity: [],
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const pointsToNextLevel = Math.ceil((stats.level * 1000) - (stats.totalPoints % (stats.level * 1000)));
  const levelProgress = ((stats.totalPoints % (stats.level * 1000)) / (stats.level * 1000)) * 100;

  return (
    <div className="min-h-screen gradient-dreamy">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      <JeevesWelcomeModal />
      {tourOpen && <GuidedTourOverlay steps={DASHBOARD_TOUR} onClose={() => setTourOpen(false)} />}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 pb-32 md:pb-8 max-w-7xl">
        <div className="flex justify-end mb-2">
          <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
            <GraduationCap className="h-4 w-4" /> Guided Tour
          </Button>
        </div>
        <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
          <img
            src="/pwa-192x192.png"
            alt="Phototheology"
            className="h-12 w-12 md:h-14 md:w-14 rounded-xl shadow-lg shadow-primary/20"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">{t('dashboard.welcomeBack')}</h1>
            <p className="text-sm md:text-base text-foreground/80">{t('dashboard.learningProgress')}</p>
          </div>
        </div>

        <GoalsSurveyBanner />

        <div className="mb-8">
          <IdentityLoopWidget />
        </div>

        <div className="mb-8">
          <DailyAudioDevotional />
        </div>

        <LockInConversionBanner />

        <div className="mb-4">
          <LockInPassAllowanceWidget />
        </div>

        <div className="mb-8 mt-4">
          <LockInMissionTracker />
        </div>
        <PathBanner />

        <div className="mb-8">
          <PathDashboardWidget />
        </div>

        {showGuidedWidgets && (
          <div className="mb-8">
            <FeatureHighlights />
          </div>
        )}

        {showGuidedWidgets && (
          <div className="mb-8">
            <StudyToolsQuickAccess />
          </div>
        )}

        {showGuidedWidgets && (
          <div className="mb-8">
            <ResearchAssistantWidget />
          </div>
        )}

        <Card className={`mb-8 ${featured.gradient} border-0 text-white overflow-hidden relative`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white mb-1">{t('dashboard.featuredToday')}</CardTitle>
                  <CardDescription className="text-white/80">{t(featured.reasonKey)}</CardDescription>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <FeaturedIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">{t(featured.titleKey)}</h3>
            <p className="text-white/90 mb-4">{t(featured.descriptionKey)}</p>
            <Button
              onClick={() => navigate(featured.path)}
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              {t('dashboard.tryItNow')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        <div className="mb-6">
          <WinnerBanner />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">{t('dashboard.dailyStreak')}</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent className="pt-0 p-3 md:p-6 md:pt-0">
              <div className="text-2xl md:text-3xl font-bold">{stats.dailyStreak}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{t('dashboard.daysInARow')}</p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">{t('dashboard.totalPoints')}</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="pt-0 p-3 md:p-6 md:pt-0">
              <div className="text-2xl md:text-3xl font-bold">{stats.totalPoints}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{pointsToNextLevel} {t('dashboard.toLevel')} {stats.level + 1}</p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">{t('dashboard.level')}</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent className="pt-0 p-3 md:p-6 md:pt-0">
              <div className="text-2xl md:text-3xl font-bold">{stats.level}</div>
              <Progress value={levelProgress} className="mt-2 h-1.5 md:h-2" />
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">{t('dashboard.chessStreak')}</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-0 p-3 md:p-6 md:pt-0">
              <div className="text-2xl md:text-3xl font-bold">{stats.chesStreak}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{t('dashboard.winsInARow')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {showGuidedWidgets && <PalaceProgressDashboard />}

          <div className="space-y-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  {t('dashboard.continueLearning')}
                </CardTitle>
                <CardDescription>{t('dashboard.pickUpWhereLeftOff')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {showGuidedWidgets && (
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30 hover:from-yellow-500/20 hover:to-amber-500/20 md:hidden"
                    onClick={() => navigate("/analyze-thoughts")}
                  >
                    <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-yellow-700 dark:text-yellow-400">{t('dashboard.analyzeMyThoughts')}</span>
                  </Button>
                )}
                {showGuidedWidgets && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/palace")}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t('dashboard.explorePalace')}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/bible")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t('dashboard.readBible')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-primary/10 border-primary/30 hover:bg-primary/20"
                  onClick={() => navigate("/audio-bible")}
                >
                  <Volume2 className="mr-2 h-4 w-4 text-primary" />
                  {t('dashboard.audioBible')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-primary/10 border-primary/30 hover:bg-primary/20"
                  onClick={() => navigate("/quarterly-study")}
                >
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  {t('dashboard.lessonStudy')}
                </Button>
                {showGuidedWidgets && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/revelation-course")}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t('dashboard.continueRevelation')}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/certificates")}
                >
                  <Award className="mr-2 h-4 w-4" />
                  {t('dashboard.myCertificates')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/study-partners")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {t('dashboard.studyPartners')}
                </Button>
              </CardContent>
            </Card>

            <TodaysChallengeCard />

            <QuickAIPrompt />

            {showGuidedWidgets && <WeeklyChallengeWidget />}

            {showGuidedWidgets && <SermonForgeWidget />}

            <CommunityHighlight />

            <QuickNotes compact />

            {showGuidedWidgets && <SpacedRepetitionReview />}
          </div>
        </div>

        {showGuidedWidgets && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <XPSystem />
            <BadgeSystem />
            <WeeklyLeaderboard />
          </div>
        )}

        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                {t('dashboard.recentReading')}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/my-progress")}>
                <BarChart3 className="h-4 w-4 mr-1" />
                {t('dashboard.viewAnalytics')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentReading.length > 0 ? (
              <div className="space-y-2">
                {recentReading.map((reading) => (
                  <Button
                    key={reading.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/bible/${reading.book}/${reading.chapter}`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {reading.book} {reading.chapter}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                {t('dashboard.startReadingHistory')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
