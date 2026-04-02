import React, { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { KeepAliveRoutes } from "@/components/KeepAliveRoutes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MessagingSidebar } from "@/components/MessagingSidebar";
import { LiveNotificationsProvider } from "@/components/LiveNotificationsProvider";
import { AchievementProvider } from "@/components/AchievementProvider";
import { DirectMessagesProvider } from "@/contexts/DirectMessagesContext";
import { PageStateProvider } from "@/contexts/PageStateContext";
import { StudySessionProvider } from "@/contexts/StudySessionContext";
import { SessionModeProvider } from "@/contexts/SessionModeContext";
import { SplashScreen } from "@/components/SplashScreen";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { UserPreferencesProvider } from "@/hooks/useUserPreferences";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { GlobalStudyBanner } from "@/components/GlobalStudyBanner";
import { TrialUpgradePrompt } from "@/components/TrialUpgradePrompt";
import { IncompleteSignupPrompt } from "@/components/IncompleteSignupPrompt";
import { TrialUrgencyMessage } from "@/components/TrialUrgencyMessage";
import { VoiceChatInviteNotification } from "@/components/voice/VoiceChatInviteNotification";
import { PageTracker } from "@/components/PageTracker";
import { LiveDemoNotification } from "@/components/live/LiveDemoNotification";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ExitIntentPopup } from "@/components/conversion/ExitIntentPopup";
import { AmbientMusicPlayer } from "@/components/audio/AmbientMusicPlayer";
import { PlaylistPanel } from "@/components/audio/PlaylistPanel";
import { JeevesWidget } from "@/components/JeevesWidget";
import { ReginaldButler } from "@/components/ReginaldButler";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { DraggableWidgetStack } from "@/components/DraggableWidgetStack";
import { LiveChatProvider } from "@/contexts/LiveChatContext";
import { LiveChatSidebar } from "@/components/LiveChatSidebar";
import { LiveChatToggle } from "@/components/LiveChatToggle";
import { SessionPromptDialog } from "@/components/session/SessionPromptDialog";
import { FontSizeControl } from "@/components/FontSizeControl";
import { usePresenceTracker } from "@/hooks/usePresenceTracker";
import { PresenceTracker } from "@/components/PresenceTracker";
import { PickaxeAccountLinker } from "@/components/PickaxeAccountLinker";
import { ChangeManagerProvider, GuidedPathChecklist, ChangeSpineUpgradePrompt, IdentityMessage } from "@/components/change-manager";
import { GuidedPathTracker } from "@/hooks/useGuidedPathTracker";
import { useUTMCapture } from "@/hooks/useUTMCapture";
import { OSDock } from "@/components/os/OSDock";
import { CommandPalette } from "@/components/os/CommandPalette";
import { OSTitleBar } from "@/components/os/OSTitleBar";

// Critical pages - load immediately (landing + auth only)
import Gatehouse from "./pages/Gatehouse";
import Auth from "./pages/Auth";
const VRHub = lazy(() => import("./vr/VRHub"));

// Legacy landing page (lazy loaded)
const Index = lazy(() => import("./pages/Index"));

// Lazy load pricing, demo, and donation
const Pricing = lazy(() => import("./pages/Pricing"));
const FixBilling = lazy(() => import("./pages/FixBilling"));
const InteractiveDemo = lazy(() => import("./pages/InteractiveDemo"));
const AudioLibrary = lazy(() => import("./pages/AudioLibrary"));
const Comparison = lazy(() => import("./pages/Comparison"));
const DonationPage = lazy(() => import("./pages/DonationPage"));
const GiftAndShare = lazy(() => import("./pages/GiftAndShare"));
const GiftSuccess = lazy(() => import("./pages/GiftSuccess"));
const GiftRedeem = lazy(() => import("./pages/GiftRedeem"));
const DayPassRedeem = lazy(() => import("./pages/DayPassRedeem"));
const LockInRedeem = lazy(() => import("./pages/LockInRedeem"));
const GuestPassTracker = lazy(() => import("./pages/GuestPassTracker"));
const PublicChallenge = lazy(() => import("./pages/PublicChallenge"));
const GoalsSurveyPage = lazy(() => import("./pages/GoalsSurveyPage"));

// Lazy load all other pages
const Palace = lazy(() => import("./pages/Palace"));
const FloorDetail = lazy(() => import("./pages/FloorDetail"));
const RoomDetail = lazy(() => import("./pages/RoomDetail"));
const GenesisHighRise = lazy(() => import("./pages/GenesisHighRise"));
const Bible = lazy(() => import("./pages/Bible"));
const AudioBible = lazy(() => import("./pages/AudioBible"));
const BibleChapter = lazy(() => import("./pages/BibleChapter"));
const BibleSearch = lazy(() => import("./pages/BibleSearch"));
const ThematicSearch = lazy(() => import("./pages/ThematicSearch"));
const DailyChallenges = lazy(() => import("./pages/DailyChallenges"));
const CommunityChallengeFeedPage = lazy(() => import("./pages/CommunityChallengeFeed"));
const ChallengeBoard = lazy(() => import("./pages/ChallengeBoard"));
const DailyVerse = lazy(() => import("./pages/DailyVerse"));
const GrowthJournal = lazy(() => import("./pages/GrowthJournal"));
const EquationsChallenge = lazy(() => import("./pages/EquationsChallenge"));
const EquationBattle = lazy(() => import("./pages/EquationBattle"));
const Games = lazy(() => import("./pages/Games"));
const GameNightGuest = lazy(() => import("./pages/GameNightGuest"));
const PTScrabble = lazy(() => import("./pages/PTScrabble"));
const GroupStudySession = lazy(() => import("./pages/GroupStudySession"));
const ChainChess = lazy(() => import("./pages/ChainChess"));
const ConcentrationGame = lazy(() => import("./pages/ConcentrationGame"));
const PalaceCardGame = lazy(() => import("./pages/PalaceCardGame"));
const MemoryBattle = lazy(() => import("./pages/games/MemoryBattle"));
const BibleTrivia = lazy(() => import("./pages/games/BibleTrivia"));
const KidsGames = lazy(() => import("./pages/KidsGames"));
const PersonalStudyPlan = lazy(() => import("./pages/PersonalStudyPlan"));
const Photo31 = lazy(() => import("./pages/Photo31"));
const SituationalVerseFinder = lazy(() => import("./pages/SituationalVerseFinder"));
const LiveStudy = lazy(() => import("./pages/LiveStudy"));
const LiveStudyRoom = lazy(() => import("./pages/LiveStudyRoom"));
const StudyGroups = lazy(() => import("./pages/StudyGroups"));
const ContentLibrary = lazy(() => import("./pages/ContentLibrary"));
const UserAnalytics = lazy(() => import("./pages/UserAnalytics"));
const KidsGamePlay = lazy(() => import("./pages/KidsGamePlay"));
const GamePlay = lazy(() => import("./pages/GamePlay"));
const PalaceQuiz = lazy(() => import("./pages/PalaceQuiz"));
const PrinciplePuzzle = lazy(() => import("./pages/PrinciplePuzzle"));
const PTKidsGames = lazy(() => import("./pages/PTKidsGames"));
const PTKidsGamePlay = lazy(() => import("./pages/PTKidsGamePlay"));
const Community = lazy(() => import("./pages/Community"));
const CommunityOptimized = lazy(() => import("./pages/CommunityOptimized"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Feedback = lazy(() => import("./pages/Feedback"));
const CultureControversy = lazy(() => import("./pages/CultureControversy"));
const ProphecyWatch = lazy(() => import("./pages/ProphecyWatch"));
const ResearchMode = lazy(() => import("./pages/ResearchMode"));
const InterlinearBible = lazy(() => import("./pages/InterlinearBible"));
const BibleTimeline = lazy(() => import("./pages/BibleTimeline"));
const BibleAtlas = lazy(() => import("./pages/BibleAtlas"));
const BibleLexicon = lazy(() => import("./pages/BibleLexicon"));
const ResearchAssistant = lazy(() => import("./pages/ResearchAssistant"));
const BibleImageLibrary = lazy(() => import("./pages/BibleImageLibrary"));
const SermonBuilder = lazy(() => import("./pages/SermonBuilder"));
const SermonIdeas = lazy(() => import("./pages/SermonIdeas"));
const SermonSimmer = lazy(() => import("./pages/SermonSimmer"));
const SermonWriter = lazy(() => import("./pages/SermonWriter"));
const SermonArchive = lazy(() => import("./pages/SermonArchive"));
const SermonPowerPoint = lazy(() => import("./pages/SermonPowerPoint"));
const SermonTopicsHub = lazy(() => import("./pages/SermonTopicsHub"));
const SermonTopicDetail = lazy(() => import("./pages/SermonTopicDetail"));
const WeeklyChallenge = lazy(() => import("./pages/WeeklyChallenge"));
const SeriesPresentationMode = lazy(() => import("./pages/SeriesPresentationMode"));
const PublicSeriesBrowser = lazy(() => import("./pages/PublicSeriesBrowser"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const PhototheologyImageBible = lazy(() => import("./pages/PhototheologyImageBible"));
const PowerOfTheLamb = lazy(() => import("./pages/PowerOfTheLamb"));
const CharacterProfiles = lazy(() => import("./pages/CharacterProfiles"));
const SpiritualTraining = lazy(() => import("./pages/SpiritualTraining"));
const AppTour = lazy(() => import("./pages/AppTour"));
const DockDemo = lazy(() => import("./pages/DockDemo"));
const OsSpacesDraft = lazy(() => import("./pages/OsSpacesDraft"));
const Courses = lazy(() => import("./pages/Courses"));
const BlueprintCourse = lazy(() => import("./pages/BlueprintCourse"));
const BlueprintWeightLoss = lazy(() => import("./pages/BlueprintWeightLoss"));
const BlueprintMentalHealth = lazy(() => import("./pages/BlueprintMentalHealth"));
const BlueprintMarriage = lazy(() => import("./pages/BlueprintMarriage"));
const BlueprintGrief = lazy(() => import("./pages/BlueprintGrief"));
const BlueprintStronghold = lazy(() => import("./pages/BlueprintStronghold"));
const BlueprintFinancial = lazy(() => import("./pages/BlueprintFinancial"));
const BlueprintStress = lazy(() => import("./pages/BlueprintStress"));
const PhototheologyCourse = lazy(() => import("./pages/PhototheologyCourse"));
const DanielCourse = lazy(() => import("./pages/DanielCourse"));
const RevelationCourse = lazy(() => import("./pages/RevelationCourse"));
const RevelationCourseKids = lazy(() => import("./pages/RevelationCourseKids"));
const KidGPT = lazy(() => import("./pages/KidGPT"));
const PhototheologyGPT = lazy(() => import("./pages/PhototheologyGPT"));
const JeevesReasoning = lazy(() => import("./pages/JeevesReasoning"));
const DanielRevelationGPT = lazy(() => import("./pages/DanielRevelationGPT"));
const ApologeticsGPT = lazy(() => import("./pages/ApologeticsGPT"));
const QuarterlyStudy = lazy(() => import("./pages/QuarterlyStudy"));
const ReadingPlans = lazy(() => import("./pages/ReadingPlans"));
const BibleReference = lazy(() => import("./pages/BibleReference"));
const AscensionsExpansions = lazy(() => import("./pages/AscensionsExpansions"));
const BibleEncyclopedia = lazy(() => import("./pages/BibleEncyclopedia"));
const EncyclopediaArticle = lazy(() => import("./pages/EncyclopediaArticle"));
const DailyReading = lazy(() => import("./pages/DailyReading"));
const TreasureHunt = lazy(() => import("./pages/TreasureHunt"));
const TreasureHuntPlay = lazy(() => import("./pages/TreasureHuntPlay"));
const TrainingDrills = lazy(() => import("./pages/TrainingDrills"));
const DrillDrill = lazy(() => import("./pages/DrillDrill"));
const EscapeRoom = lazy(() => import("./pages/EscapeRoomRenovated"));
const EscapeRoomPlay = lazy(() => import("./pages/EscapeRoomPlayRenovated"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const FollowingFeed = lazy(() => import("./pages/FollowingFeed"));
const PrincipleCards = lazy(() => import("./pages/PrincipleCards"));
const PrincipleCardsGame = lazy(() => import("./pages/PrincipleCardsGame"));
const PrincipleTournaments = lazy(() => import("./pages/PrincipleTournaments"));
const TournamentDetail = lazy(() => import("./pages/TournamentDetail"));
const CriticsAnalysis = lazy(() => import("./pages/CriticsAnalysis"));
const Referrals = lazy(() => import("./pages/Referrals"));
const StudentVerification = lazy(() => import("./pages/StudentVerification"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const AccessCode = lazy(() => import("./pages/AccessCode"));
const AdminAccessCodes = lazy(() => import("./pages/AdminAccessCodes"));
const AdminSubscriptions = lazy(() => import("./pages/AdminSubscriptions"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const PTOnboarding = lazy(() => import("./pages/PTOnboarding"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Certificates = lazy(() => import("./pages/Certificates"));
const StudyPartners = lazy(() => import("./pages/StudyPartners"));
const Streaks = lazy(() => import("./pages/Streaks"));
const MemorizationVerses = lazy(() => import("./pages/MemorizationVerses"));
const VerseMemoryHall = lazy(() => import("./pages/VerseMemoryHall"));
const Memory = lazy(() => import("./pages/Memory"));
const MemoryListEditor = lazy(() => import("./pages/MemoryListEditor"));
const MemoryGamePlay = lazy(() => import("./pages/MemoryGamePlay"));
const MemoryGameComplete = lazy(() => import("./pages/MemoryGameComplete"));
const MemoryGameSelect = lazy(() => import("./pages/MemoryGameSelect"));
const MemoryGame = lazy(() => import("./pages/MemoryGame"));
const FirstLetterGame = lazy(() => import("./pages/games/FirstLetterGame"));
const MemoryPalaceBuilder = lazy(() => import("./pages/games/MemoryPalaceBuilder"));
const MemoryPalacePractice = lazy(() => import("./pages/games/MemoryPalacePractice"));

const ChefChallenge = lazy(() => import("./pages/ChefChallenge"));
// ChainWar removed — merged into PT Scrabble as Quick Play
const SanctuaryRun = lazy(() => import("./pages/games/SanctuaryRun"));
const TimeZoneInvasion = lazy(() => import("./pages/games/TimeZoneInvasion"));
const Connect6Draft = lazy(() => import("./pages/games/Connect6Draft"));
const ChristLock = lazy(() => import("./pages/games/ChristLock"));
const ControversyRaid = lazy(() => import("./pages/games/ControversyRaid"));
const EscapeTheDragon = lazy(() => import("./pages/games/EscapeTheDragon"));
const EquationBuilder = lazy(() => import("./pages/games/EquationBuilder"));
const WitnessTrial = lazy(() => import("./pages/games/WitnessTrial"));
const PrincipleSprint = lazy(() => import("./pages/games/PrincipleSprint"));

const PhototheologyUno = lazy(() => import("./pages/PhototheologyUno"));
const BranchStudy = lazy(() => import("./pages/BranchStudy"));
const FrameSnapshot = lazy(() => import("./pages/games/FrameSnapshot"));
const RoomGamePlay = lazy(() => import("./components/games/RoomGamePlay"));
const StoryRoomGame = lazy(() => import("./pages/games/StoryRoomGame"));
const ObservationFlux = lazy(() => import("./pages/games/ObservationFlux"));
const ConcentrationRoom = lazy(() => import("./pages/games/ConcentrationRoom"));
const DimensionsRoom = lazy(() => import("./pages/games/DimensionsRoom"));
const BlueRoomGame = lazy(() => import("./pages/games/BlueRoomGame"));
const PhototheologyJeopardy = lazy(() => import("./pages/games/PhototheologyJeopardy"));
const PhototheologyChess = lazy(() => import("./pages/games/PhototheologyChess"));
const PhototheologyCheckers = lazy(() => import("./pages/games/PhototheologyCheckers"));
const PhototheologyTicTacToe = lazy(() => import("./pages/games/PhototheologyTicTacToe"));
const PhototheologyConnectFour = lazy(() => import("./pages/games/PhototheologyConnectFour"));
const PrinciplesClassification = lazy(() => import("./pages/games/PrinciplesClassification"));
const PTJeopardy = lazy(() => import("./pages/PTJeopardy"));
const PTFamilyFeud = lazy(() => import("./pages/PTFamilyFeud"));
const SymbolDecoder = lazy(() => import("./pages/games/SymbolDecoder"));

const MasterExam = lazy(() => import("./pages/MasterExam"));
const Gideon300 = lazy(() => import("./pages/games/Gideon300"));
const FreestyleZone = lazy(() => import("./pages/games/FreestyleZone"));
const MyProfileRedirect = lazy(() => import("./pages/MyProfileRedirect"));

const PublicImageLibrary = lazy(() => import("./pages/PublicImageLibrary"));
const SharedBaptismAudio = lazy(() => import("./pages/SharedBaptismAudio"));
const SharedDebate = lazy(() => import("./pages/SharedDebate"));
const BibleStudySeriesBuilder = lazy(() => import("./pages/BibleStudySeriesBuilder"));
const SeriesLessonEditor = lazy(() => import("./pages/SeriesLessonEditor"));
const SeriesPresenter = lazy(() => import("./pages/SeriesPresenter"));
const AppUpdateIdeas = lazy(() => import("./pages/AppUpdateIdeas"));
const ChurchAdmin = lazy(() => import("./pages/ChurchAdmin"));
const LivingManna = lazy(() => import("./pages/LivingManna"));
const JoinChurch = lazy(() => import("./pages/JoinChurch"));
const ChurchSignup = lazy(() => import("./pages/ChurchSignup"));
const ChurchSignupSuccess = lazy(() => import("./pages/ChurchSignupSuccess"));
const ChurchSignupCancelled = lazy(() => import("./pages/ChurchSignupCancelled"));
const ManageSubscription = lazy(() => import("./pages/ManageSubscription"));
const AdminStrongsImport = lazy(() => import("./pages/AdminStrongsImport"));
const AdminBibleImport = lazy(() => import("./pages/AdminBibleImport"));
const OfflineContent = lazy(() => import("./pages/OfflineContent"));
const VideoTraining = lazy(() => import("./pages/VideoTraining"));
const MyStudies = lazy(() => import("./pages/MyStudies"));
const StudyEditor = lazy(() => import("./pages/StudyEditor"));
const StudyBuddy = lazy(() => import("./pages/StudyBuddy"));
const StudyIdeaLibrary = lazy(() => import("./pages/StudyIdeaLibrary"));
const GiveMeAGem = lazy(() => import("./pages/GiveMeAGem"));
const SourceLibrary = lazy(() => import("./pages/SourceLibrary"));
const InfographicGenerator = lazy(() => import("./pages/InfographicGenerator"));
const StudySeriesGenerator = lazy(() => import("./pages/StudySeriesGenerator"));
const MasteryDashboard = lazy(() => import("./pages/MasteryDashboard"));
const FloorMastery = lazy(() => import("./pages/FloorMastery"));
const FloorDetailPage = lazy(() => import("./pages/FloorDetail"));
const PalaceAI = lazy(() => import("./pages/PalaceAI"));
const Guilds = lazy(() => import("./pages/Guilds"));
const GuildDetail = lazy(() => import("./pages/GuildDetail"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const COTASeries = lazy(() => import("./pages/COTASeries"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const PatreonCallback = lazy(() => import("./pages/PatreonCallback"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PalaceExplorer = lazy(() => import("./pages/PalaceExplorer"));
const CardDeck = lazy(() => import("./pages/CardDeck"));
const PTMultiplayerLobby = lazy(() => import("./pages/PTMultiplayerLobby"));
const PTMultiplayerGame = lazy(() => import("./pages/PTMultiplayerGame"));
const AnalyzeThoughts = lazy(() => import("./pages/AnalyzeThoughts"));
const Polish = lazy(() => import("./pages/Polish"));
const Remix = lazy(() => import("./pages/Remix"));
const Amplify = lazy(() => import("./pages/Amplify"));
const SparksLibrary = lazy(() => import("./pages/SparksLibrary"));
const Libraries = lazy(() => import("./pages/Libraries"));
const PalaceFreestyle = lazy(() => import("./pages/PalaceFreestyle"));
const PalaceTourPage = lazy(() => import("./pages/PalaceTour"));
const MindMapPalace = lazy(() => import("./pages/MindMapPalace"));
const GraphicsGallery = lazy(() => import("./pages/GraphicsGallery"));
const Devotionals = lazy(() => import("./pages/Devotionals"));
const DevotionalView = lazy(() => import("./pages/DevotionalView"));
const DevotionalProfileDetail = lazy(() => import("./pages/DevotionalProfileDetail"));
const PublicDevotionalView = lazy(() => import("./pages/PublicDevotionalView"));
const SinglesDevotional = lazy(() => import("./pages/SinglesDevotional"));
const WhyPhototheology = lazy(() => import("./pages/WhyPhototheology"));
const QuickStartSales = lazy(() => import("./pages/QuickStartSales"));
const QuickStartSuccess = lazy(() => import("./pages/QuickStartSuccess"));
const StudySuiteSales = lazy(() => import("./pages/StudySuiteSales"));
const StudySuiteSuccess = lazy(() => import("./pages/StudySuiteSuccess"));
const BibleProphecyGuide = lazy(() => import("./pages/BibleProphecyGuide"));
const BibleProphecyGuideSuccess = lazy(() => import("./pages/BibleProphecyGuideSuccess"));
const MusicCategories = lazy(() => import("./pages/MusicCategories"));
const Paths = lazy(() => import("./pages/Paths"));
const PathWeek = lazy(() => import("./pages/PathWeek"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Notes = lazy(() => import("./pages/Notes"));
const DonationSuccess = lazy(() => import("./pages/DonationSuccess"));
const CreditPurchaseSuccess = lazy(() => import("./pages/CreditPurchaseSuccess"));
const LiveDemo = lazy(() => import("./pages/LiveDemo"));
const PublicChat = lazy(() => import("./pages/PublicChat"));
const Schedule = lazy(() => import("./pages/Schedule"));
const DiscoverPeople = lazy(() => import("./pages/DiscoverPeople"));
const Workspace = lazy(() => import("./pages/Workspace"));
const TestimonialWall = lazy(() => import("./pages/TestimonialWall"));

// Gatehouse flow pages (Gatehouse is now imported at top as critical page)
const Welcome = lazy(() => import("./pages/Welcome"));
const Antechamber = lazy(() => import("./pages/Antechamber"));



// Simple redirect component for /devotional -> /devotionals
const DevotionalRedirect = () => {
  const planId = window.location.pathname.split('/devotional/')[1];
  return <Navigate to={`/devotionals/${planId}`} replace />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 5 minutes - reduces unnecessary refetches
      staleTime: 5 * 60 * 1000,
      // Cache persists for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Don't refetch on window focus for better UX
      refetchOnWindowFocus: false,
      // Retry failed requests 2 times
      retry: 2,
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Detect workspace iframe panes — computed once at module load
const isWorkspacePane = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('workspace');

function App() {
  // Capture UTM parameters on app load for ad attribution
  useUTMCapture();

  // Skip splash for returning users (localStorage check) or workspace panes
  const isReturningUser = typeof window !== 'undefined' && localStorage.getItem('hasVisited') === 'true';
  const [showSplash, setShowSplash] = useState(!isReturningUser && !isWorkspacePane);
  
  // Mark user as visited after first splash
  const handleSplashComplete = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowSplash(false);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineIndicator />
          <PWAUpdatePrompt />
          <AnimatePresence mode="wait">
            {showSplash && (
              <SplashScreen onComplete={handleSplashComplete} />
            )}
          </AnimatePresence>
          {!showSplash && (
            <BrowserRouter>
              <PageStateProvider>
              <StudySessionProvider>
              <SessionModeProvider>
              <PageTracker />
              <PresenceTracker />
              <PickaxeAccountLinker />
              <GuidedPathTracker />
              <LiveNotificationsProvider>
                <AchievementProvider>
                  <DirectMessagesProvider>
                    <LiveChatProvider>
                    <UserPreferencesProvider>
                    <SidebarProvider defaultOpen={false}>
                    <ChangeManagerProvider>
                      <div className="min-h-screen flex flex-col w-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
                        {!isWorkspacePane && <>
                        <FontSizeControl />
                        {/* Session Mode Prompt Dialog */}
                        <SessionPromptDialog />
                        </>}
                        <CommandPalette />
                        {!isWorkspacePane && <OSTitleBar />}
                        {!isWorkspacePane && <GlobalStudyBanner />}
                        {!isWorkspacePane && (
                          <div className="zen-hideable">
                            <AnnouncementBanner />
                            <TrialUpgradePrompt variant="banner" />
                            <ChangeSpineUpgradePrompt />
                            <TrialUrgencyMessage />
                            <VoiceChatInviteNotification />
                            <LiveDemoNotification />
                            <InstallPrompt />
                            <ExitIntentPopup />
                            <IncompleteSignupPrompt />
                            <GuidedPathChecklist />
                          </div>
                        )}
                        <div className="flex flex-1 w-full">
                          {!isWorkspacePane && <OSDock />}
                          <MessagingSidebar />
                          <main className="flex-1 w-full overflow-x-hidden pb-mobile-nav min-w-0">
                          <Suspense fallback={<LoadingScreen />}>
                            <KeepAliveRoutes maxCached={20} excludePaths={["/auth", "/auth/callback", "/guesthouse", "/vr"]}>
                            <Routes>
            <Route path="/" element={<Gatehouse />} />
            <Route path="/landing" element={<Index />} />
            <Route path="/genesis-challenge" element={<GenesisHighRise />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/patreon-callback" element={<PatreonCallback />} />
            <Route path="/interactive-demo" element={<InteractiveDemo />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/pt-onboarding" element={
              <ProtectedRoute>
                <PTOnboarding />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/audio-library" element={<ProtectedRoute><AudioLibrary /></ProtectedRoute>} />
            <Route path="/fix-billing" element={<ProtectedRoute><FixBilling /></ProtectedRoute>} />
            <Route path="/gift" element={<GiftAndShare />} />
            <Route path="/gift-and-share" element={<GiftAndShare />} />
            <Route path="/gift/success" element={<GiftSuccess />} />
            <Route path="/gift/redeem/:token" element={<GiftRedeem />} />
            <Route path="/day-pass/:token" element={<DayPassRedeem />} />
            <Route path="/lock-in/:token" element={<LockInRedeem />} />
            <Route path="/guest-pass-tracker" element={<ProtectedRoute><GuestPassTracker /></ProtectedRoute>} />
            <Route path="/shared/baptism-audio/:token" element={<SharedBaptismAudio />} />
            <Route path="/shared/debate/:token" element={<SharedDebate />} />
            <Route path="/challenge/:shareCode" element={<PublicChallenge />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/donation-success" element={<DonationSuccess />} />
            <Route path="/credit-purchase-success" element={<ProtectedRoute><CreditPurchaseSuccess /></ProtectedRoute>} />
            <Route path="/paths" element={<Paths />} />
            <Route path="/path/week" element={<ProtectedRoute><PathWeek /></ProtectedRoute>} />
            <Route path="/why-phototheology" element={<WhyPhototheology />} />
            <Route path="/quick-start" element={<QuickStartSales />} />
            <Route path="/quick-start/success" element={<QuickStartSuccess />} />
            <Route path="/study-suite" element={<StudySuiteSales />} />
            <Route path="/study-suite/success" element={<StudySuiteSuccess />} />
            <Route path="/bible-prophecy-guide" element={<BibleProphecyGuide />} />
            <Route path="/bible-prophecy-guide/success" element={<BibleProphecyGuideSuccess />} />
            <Route path="/app-tour" element={<AppTour />} />
            <Route path="/dock-demo" element={<DockDemo />} />
            <Route path="/os-spaces-draft" element={<OsSpacesDraft />} />
            
{/* Gatehouse Flow - Public (/ is the main gatehouse, /gatehouse kept for legacy links) */}
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/gatehouse" element={<Gatehouse />} />
            <Route path="/antechamber" element={<ProtectedRoute><Antechamber /></ProtectedRoute>} />
            <Route path="/goals-survey" element={<ProtectedRoute><GoalsSurveyPage /></ProtectedRoute>} />
            <Route path="/access" element={
              <ProtectedRoute>
                <AccessCode />
              </ProtectedRoute>
            } />
            <Route path="/student-verification" element={
              <ProtectedRoute>
                <StudentVerification />
              </ProtectedRoute>
            } />
            <Route path="/palace" element={<ProtectedRoute><Palace /></ProtectedRoute>} />
            <Route path="/palace/explorer" element={<ProtectedRoute><PalaceExplorer /></ProtectedRoute>} />
            <Route path="/palace/floor/:floorNumber" element={<ProtectedRoute><FloorDetail /></ProtectedRoute>} />
            <Route path="/palace/floor/:floorNumber/room/:roomId" element={<ProtectedRoute><RoomDetail /></ProtectedRoute>} />
            <Route path="/card-deck" element={<ProtectedRoute><CardDeck /></ProtectedRoute>} />
            <Route path="/jeeves" element={<ProtectedRoute><CardDeck /></ProtectedRoute>} />
            <Route path="/gems-room" element={<Navigate to="/give-me-a-gem" replace />} />
            <Route path="/gems" element={<Navigate to="/give-me-a-gem" replace />} />
            <Route path="/pt-multiplayer" element={<ProtectedRoute><PTMultiplayerLobby /></ProtectedRoute>} />
            <Route path="/pt-multiplayer/:gameId" element={<ProtectedRoute><PTMultiplayerGame /></ProtectedRoute>} />
            <Route path="/analyze-thoughts" element={<ProtectedRoute><AnalyzeThoughts /></ProtectedRoute>} />
            <Route path="/polish" element={<ProtectedRoute><Polish /></ProtectedRoute>} />
            <Route path="/remix" element={<ProtectedRoute><Remix /></ProtectedRoute>} />
            <Route path="/amplify" element={<ProtectedRoute><Amplify /></ProtectedRoute>} />
            <Route path="/sparks" element={<ProtectedRoute><SparksLibrary /></ProtectedRoute>} />
            <Route path="/libraries" element={<ProtectedRoute><Libraries /></ProtectedRoute>} />
            <Route path="/palace/freestyle" element={<ProtectedRoute><PalaceFreestyle /></ProtectedRoute>} />
            <Route path="/palace/tour" element={<ProtectedRoute><PalaceTourPage /></ProtectedRoute>} />
            <Route path="/palace/graphics" element={<ProtectedRoute><GraphicsGallery /></ProtectedRoute>} />
            <Route path="/mind-map" element={<ProtectedRoute><MindMapPalace /></ProtectedRoute>} />
            
            <Route path="/bible" element={<ProtectedRoute><Bible /></ProtectedRoute>} />
            <Route path="/audio-bible" element={<ProtectedRoute><AudioBible /></ProtectedRoute>} />
            <Route path="/image-bible" element={<ProtectedRoute><PhototheologyImageBible /></ProtectedRoute>} />
            <Route path="/bible/search" element={<ProtectedRoute><BibleSearch /></ProtectedRoute>} />
            <Route path="/bible/thematic-search" element={<ProtectedRoute><ThematicSearch /></ProtectedRoute>} />
            <Route path="/bible/:book/:chapter" element={<ProtectedRoute><BibleChapter /></ProtectedRoute>} />
            <Route path="/daily-verse" element={<ProtectedRoute><DailyVerse /></ProtectedRoute>} />
            <Route path="/reading-plans" element={<ProtectedRoute><ReadingPlans /></ProtectedRoute>} />
            <Route path="/bible-reference" element={<ProtectedRoute><BibleReference /></ProtectedRoute>} />
            <Route path="/ascensions-expansions" element={<ProtectedRoute><AscensionsExpansions /></ProtectedRoute>} />
            <Route path="/encyclopedia" element={<ProtectedRoute><BibleEncyclopedia /></ProtectedRoute>} />
            <Route path="/encyclopedia/:slug" element={<ProtectedRoute><EncyclopediaArticle /></ProtectedRoute>} />
            <Route path="/character-profiles" element={<ProtectedRoute><CharacterProfiles /></ProtectedRoute>} />
            <Route path="/video-training" element={<ProtectedRoute><VideoTraining /></ProtectedRoute>} />
            <Route path="/video_admin" element={<ProtectedRoute><VideoTraining /></ProtectedRoute>} />
            <Route path="/music" element={<ProtectedRoute><MusicCategories /></ProtectedRoute>} />
            <Route path="/daily-reading" element={<ProtectedRoute><DailyReading /></ProtectedRoute>} />
            <Route path="/memorization-verses" element={<ProtectedRoute><MemorizationVerses /></ProtectedRoute>} />
            <Route path="/verse-memory-hall" element={<ProtectedRoute><VerseMemoryHall /></ProtectedRoute>} />
            <Route path="/memory" element={<ProtectedRoute><Memory /></ProtectedRoute>} />
            <Route path="/memory/games" element={<ProtectedRoute><MemoryGameSelect /></ProtectedRoute>} />
            <Route path="/memory/game/:gameId" element={<ProtectedRoute><MemoryGame /></ProtectedRoute>} />
            <Route path="/memory/list/:listId" element={<ProtectedRoute><MemoryListEditor /></ProtectedRoute>} />
            <Route path="/memory/play/:listId" element={<ProtectedRoute><MemoryGamePlay /></ProtectedRoute>} />
            <Route path="/memory/complete/:listId" element={<ProtectedRoute><MemoryGameComplete /></ProtectedRoute>} />
            <Route path="/memory/game/:listId/first-letter" element={<ProtectedRoute><FirstLetterGame /></ProtectedRoute>} />
            <Route path="/memory/palace-builder/:listId" element={<ProtectedRoute><MemoryPalaceBuilder /></ProtectedRoute>} />
            <Route path="/memory/palace-practice/:listId" element={<ProtectedRoute><MemoryPalacePractice /></ProtectedRoute>} />
            
            <Route path="/daily-challenges" element={<ProtectedRoute><DailyChallenges /></ProtectedRoute>} />
            <Route path="/community-challenges" element={<ProtectedRoute><CommunityChallengeFeedPage /></ProtectedRoute>} />
            <Route path="/challenge-board" element={<ProtectedRoute><ChallengeBoard /></ProtectedRoute>} />
            <Route path="/growth-journal" element={<ProtectedRoute><GrowthJournal /></ProtectedRoute>} />
            <Route path="/equations-challenge" element={<ProtectedRoute><EquationsChallenge /></ProtectedRoute>} />
            <Route path="/equations-battle" element={<ProtectedRoute><EquationBattle /></ProtectedRoute>} />
            <Route path="/equations-battle/:gameId" element={<ProtectedRoute><EquationBattle /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/game-night" element={<GameNightGuest />} />
            <Route path="/pt-scrabble" element={<ProtectedRoute><PTScrabble /></ProtectedRoute>} />
            <Route path="/group-study" element={<ProtectedRoute><GroupStudySession /></ProtectedRoute>} />
            <Route path="/games/chef-challenge" element={<ProtectedRoute><ChefChallenge /></ProtectedRoute>} />
            {/* Chain War removed — merged into PT Scrabble Quick Play */}
            <Route path="/games/sanctuary-run" element={<ProtectedRoute><SanctuaryRun /></ProtectedRoute>} />
            <Route path="/games/time-zone-invasion" element={<ProtectedRoute><TimeZoneInvasion /></ProtectedRoute>} />
            <Route path="/games/connect6-draft" element={<ProtectedRoute><Connect6Draft /></ProtectedRoute>} />
            <Route path="/games/christ-lock" element={<ProtectedRoute><ChristLock /></ProtectedRoute>} />
            <Route path="/games/controversy-raid" element={<ProtectedRoute><ControversyRaid /></ProtectedRoute>} />
            <Route path="/games/escape-dragon" element={<ProtectedRoute><EscapeTheDragon /></ProtectedRoute>} />
            <Route path="/games/equation-builder" element={<ProtectedRoute><EquationBuilder /></ProtectedRoute>} />
            <Route path="/games/witness-trial" element={<ProtectedRoute><WitnessTrial /></ProtectedRoute>} />
            <Route path="/games/principle-sprint" element={<ProtectedRoute><PrincipleSprint /></ProtectedRoute>} />
            
            <Route path="/games/phototheology-uno" element={<ProtectedRoute><PhototheologyUno /></ProtectedRoute>} />
            <Route path="/games/frame-snapshot" element={<ProtectedRoute><FrameSnapshot /></ProtectedRoute>} />
            <Route path="/games/story-room" element={<ProtectedRoute><StoryRoomGame /></ProtectedRoute>} />
            
            
            
            <Route path="/games/observation-room" element={<ProtectedRoute><ObservationFlux /></ProtectedRoute>} />
            <Route path="/games/concentration-room" element={<ProtectedRoute><ConcentrationRoom /></ProtectedRoute>} />
            <Route path="/games/dimensions-room" element={<ProtectedRoute><DimensionsRoom /></ProtectedRoute>} />
            <Route path="/games/blue-room" element={<ProtectedRoute><BlueRoomGame /></ProtectedRoute>} />
            <Route path="/games/jeopardy" element={<ProtectedRoute><PhototheologyJeopardy /></ProtectedRoute>} />
            <Route path="/games/chess" element={<ProtectedRoute><PhototheologyChess /></ProtectedRoute>} />
            <Route path="/games/checkers" element={<ProtectedRoute><PhototheologyCheckers /></ProtectedRoute>} />
            <Route path="/games/tic-tac-toe" element={<ProtectedRoute><PhototheologyTicTacToe /></ProtectedRoute>} />
            <Route path="/games/connect-four" element={<ProtectedRoute><PhototheologyConnectFour /></ProtectedRoute>} />
            <Route path="/games/symbol-decoder" element={<ProtectedRoute><SymbolDecoder /></ProtectedRoute>} />
            <Route path="/games/pt-jeopardy" element={<ProtectedRoute><PTJeopardy /></ProtectedRoute>} />
            <Route path="/games/pt-family-feud" element={<ProtectedRoute><PTFamilyFeud /></ProtectedRoute>} />

            <Route path="/games/principles-classification" element={<ProtectedRoute><PrinciplesClassification /></ProtectedRoute>} />
            <Route path="/games/principle-cards" element={<ProtectedRoute><PrincipleCards /></ProtectedRoute>} />
            <Route path="/games/principle-cards/game/:gameId" element={<ProtectedRoute><PrincipleCardsGame /></ProtectedRoute>} />
            <Route path="/games/principle-cards/tournaments" element={<ProtectedRoute><PrincipleTournaments /></ProtectedRoute>} />
            <Route path="/games/principle-cards/tournament/:tournamentId" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
            {/* Redirect routes for easier access */}
            <Route path="/chain-chess" element={<ProtectedRoute><ChainChess /></ProtectedRoute>} />
            <Route path="/games/chain-chess/:gameId/:mode?" element={<ProtectedRoute><ChainChess /></ProtectedRoute>} />
            <Route path="/games/concentration" element={<ProtectedRoute><ConcentrationGame /></ProtectedRoute>} />
            <Route path="/games/palace-cards" element={<ProtectedRoute><PalaceCardGame /></ProtectedRoute>} />
            <Route path="/games/memory-battle" element={<ProtectedRoute><MemoryBattle /></ProtectedRoute>} />
            <Route path="/games/bible-trivia" element={<ProtectedRoute><BibleTrivia /></ProtectedRoute>} />
            <Route path="/study-plan" element={<ProtectedRoute><PersonalStudyPlan /></ProtectedRoute>} />
            <Route path="/verse-finder" element={<SituationalVerseFinder />} />
            <Route path="/games/palace_quiz/:mode?" element={<ProtectedRoute><PalaceQuiz /></ProtectedRoute>} />
            <Route path="/games/principle_puzzle/:mode?" element={<ProtectedRoute><PrinciplePuzzle /></ProtectedRoute>} />
            <Route path="/games/master-exam" element={<ProtectedRoute><MasterExam /></ProtectedRoute>} />
            <Route path="/test-me" element={<ProtectedRoute><MasterExam /></ProtectedRoute>} />
            <Route path="/games/gideon-300" element={<ProtectedRoute><Gideon300 /></ProtectedRoute>} />
            <Route path="/games/freestyle-zone" element={<ProtectedRoute><FreestyleZone /></ProtectedRoute>} />
            <Route path="/games/room-game/:gameId" element={<ProtectedRoute><RoomGamePlay /></ProtectedRoute>} />
            <Route path="/games/:gameId/:mode?" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
            <Route path="/kids-games" element={<ProtectedRoute><KidsGames /></ProtectedRoute>} />
            <Route path="/kids-games/:gameId" element={<ProtectedRoute><KidsGamePlay /></ProtectedRoute>} />
            <Route path="/treasure-hunt" element={<ProtectedRoute><TreasureHunt /></ProtectedRoute>} />
            <Route path="/treasure-hunt/:huntId" element={<ProtectedRoute><TreasureHuntPlay /></ProtectedRoute>} />
            <Route path="/escape-room" element={<ProtectedRoute><EscapeRoom /></ProtectedRoute>} />
            <Route path="/escape-room/play/:roomId" element={<ProtectedRoute><EscapeRoomPlay /></ProtectedRoute>} />
            
            <Route path="/photo31" element={<ProtectedRoute><Photo31 /></ProtectedRoute>} />
            <Route path="/training-drills" element={<ProtectedRoute><TrainingDrills /></ProtectedRoute>} />
            <Route path="/drill-drill" element={<ProtectedRoute><DrillDrill /></ProtectedRoute>} />
            <Route path="/live-study" element={<ProtectedRoute><LiveStudy /></ProtectedRoute>} />
            <Route path="/live-study/:roomId" element={<ProtectedRoute><LiveStudyRoom /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><DiscoverPeople /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/community-optimized" element={<ProtectedRoute><CommunityOptimized /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
            <Route path="/testimonials" element={<ProtectedRoute><TestimonialWall /></ProtectedRoute>} />
          <Route path="/culture-controversy" element={<ProtectedRoute><CultureControversy /></ProtectedRoute>} />
          <Route path="/prophecy-watch" element={<ProtectedRoute><ProphecyWatch /></ProtectedRoute>} />
          <Route path="/research-mode" element={<ProtectedRoute><ResearchMode /></ProtectedRoute>} />
          <Route path="/interlinear" element={<ProtectedRoute><InterlinearBible /></ProtectedRoute>} />
          <Route path="/interlinear/:book/:chapter" element={<ProtectedRoute><InterlinearBible /></ProtectedRoute>} />
          <Route path="/bible-timeline" element={<ProtectedRoute><BibleTimeline /></ProtectedRoute>} />
          <Route path="/bible-atlas" element={<ProtectedRoute><BibleAtlas /></ProtectedRoute>} />
          <Route path="/bible-lexicon" element={<ProtectedRoute><BibleLexicon /></ProtectedRoute>} />
          <Route path="/research-assistant" element={<ProtectedRoute><ResearchAssistant /></ProtectedRoute>} />
            <Route path="/bible-image-library" element={<ProtectedRoute><BibleImageLibrary /></ProtectedRoute>} />
          <Route path="/sermon-builder" element={<ProtectedRoute><SermonBuilder /></ProtectedRoute>} />
          <Route path="/sermon-ideas" element={<ProtectedRoute><SermonIdeas /></ProtectedRoute>} />
          <Route path="/sermon-simmer" element={<ProtectedRoute><SermonSimmer /></ProtectedRoute>} />
          <Route path="/sermon-writer" element={<ProtectedRoute><SermonWriter /></ProtectedRoute>} />
          <Route path="/sermon-archive" element={<ProtectedRoute><SermonArchive /></ProtectedRoute>} />
          <Route path="/sermon-topics" element={<ProtectedRoute><SermonTopicsHub /></ProtectedRoute>} />
          <Route path="/sermon-topics/:slug" element={<ProtectedRoute><SermonTopicDetail /></ProtectedRoute>} />
          <Route path="/weekly-challenge" element={<WeeklyChallenge />} />
          <Route path="/sermon-powerpoint" element={<ProtectedRoute><SermonPowerPoint /></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
          
          <Route path="/my-studies" element={<ProtectedRoute><MyStudies /></ProtectedRoute>} />
          <Route path="/my-studies/:id" element={<ProtectedRoute><StudyEditor /></ProtectedRoute>} />
          <Route path="/power-of-the-lamb" element={<ProtectedRoute><PowerOfTheLamb /></ProtectedRoute>} />
          <Route path="/spiritual-training" element={<ProtectedRoute><SpiritualTraining /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/blueprint-course" element={<ProtectedRoute><BlueprintCourse /></ProtectedRoute>} />
          <Route path="/blueprint-weight-loss" element={<ProtectedRoute><BlueprintWeightLoss /></ProtectedRoute>} />
          <Route path="/blueprint-mental-health" element={<ProtectedRoute><BlueprintMentalHealth /></ProtectedRoute>} />
          <Route path="/blueprint-marriage" element={<ProtectedRoute><BlueprintMarriage /></ProtectedRoute>} />
          <Route path="/blueprint-grief" element={<ProtectedRoute><BlueprintGrief /></ProtectedRoute>} />
          <Route path="/blueprint-stronghold" element={<ProtectedRoute><BlueprintStronghold /></ProtectedRoute>} />
          <Route path="/blueprint-financial" element={<ProtectedRoute><BlueprintFinancial /></ProtectedRoute>} />
          <Route path="/blueprint-stress" element={<ProtectedRoute><BlueprintStress /></ProtectedRoute>} />
          <Route path="/phototheology-course" element={<ProtectedRoute><PhototheologyCourse /></ProtectedRoute>} />
          <Route path="/daniel-course" element={<ProtectedRoute><DanielCourse /></ProtectedRoute>} />
          <Route path="/revelation-course" element={<ProtectedRoute><RevelationCourse /></ProtectedRoute>} />
           <Route path="/revelation-course/kids" element={<ProtectedRoute><RevelationCourseKids /></ProtectedRoute>} />
           <Route path="/cota-series" element={<ProtectedRoute><COTASeries /></ProtectedRoute>} />
           <Route path="/defense-mode" element={<Navigate to="/cota-series?tab=defense" replace />} />
          <Route path="/kidgpt" element={<ProtectedRoute><KidGPT /></ProtectedRoute>} />
          <Route path="/kid-gpt" element={<ProtectedRoute><KidGPT /></ProtectedRoute>} />
          <Route path="/pt-kids-games" element={<ProtectedRoute><PTKidsGames /></ProtectedRoute>} />
          <Route path="/pt-kids-game/:gameId" element={<ProtectedRoute><PTKidsGamePlay /></ProtectedRoute>} />
          <Route path="/phototheologygpt" element={<ProtectedRoute><PhototheologyGPT /></ProtectedRoute>} />
          <Route path="/jeeves" element={<ProtectedRoute><PhototheologyGPT /></ProtectedRoute>} />
          <Route path="/jeeves-reasoning" element={<ProtectedRoute><JeevesReasoning /></ProtectedRoute>} />
          <Route path="/daniel-revelation-gpt" element={<ProtectedRoute><DanielRevelationGPT /></ProtectedRoute>} />
          <Route path="/daniel-revelation-gpt" element={<ProtectedRoute><DanielRevelationGPT /></ProtectedRoute>} />
          <Route path="/apologetics-gpt" element={<ProtectedRoute><ApologeticsGPT /></ProtectedRoute>} />
          <Route path="/quarterly-study" element={<ProtectedRoute><QuarterlyStudy /></ProtectedRoute>} />
          <Route path="/study-buddy" element={<ProtectedRoute><StudyBuddy /></ProtectedRoute>} />
          <Route path="/study-ideas" element={<ProtectedRoute><StudyIdeaLibrary /></ProtectedRoute>} />
          <Route path="/give-me-a-gem" element={<ProtectedRoute><GiveMeAGem /></ProtectedRoute>} />
          <Route path="/sources" element={<ProtectedRoute><SourceLibrary /></ProtectedRoute>} />
          <Route path="/infographics" element={<ProtectedRoute><InfographicGenerator /></ProtectedRoute>} />
          <Route path="/study-series" element={<ProtectedRoute><StudySeriesGenerator /></ProtectedRoute>} />
           <Route path="/bible-study-series" element={<ProtectedRoute><BibleStudySeriesBuilder /></ProtectedRoute>} />
           <Route path="/character-profiles" element={<ProtectedRoute><CharacterProfiles /></ProtectedRoute>} />
           <Route path="/devotionals" element={<ProtectedRoute><Devotionals /></ProtectedRoute>} />
           <Route path="/devotionals/:planId" element={<ProtectedRoute><DevotionalView /></ProtectedRoute>} />
           <Route path="/devotionals/profile/:profileId" element={<ProtectedRoute><DevotionalProfileDetail /></ProtectedRoute>} />
           <Route path="/shared-devotional/:shareToken" element={<PublicDevotionalView />} />
           <Route path="/singles-devotional" element={<ProtectedRoute><SinglesDevotional /></ProtectedRoute>} />
           <Route path="/singles-devotional/series/:seriesId" element={<ProtectedRoute><SinglesDevotional /></ProtectedRoute>} />
           {/* Redirect singular /devotional to plural /devotionals for notification links */}
           <Route path="/devotional/:planId" element={<DevotionalRedirect />} />
           <Route path="/bible-study-series/discover" element={<ProtectedRoute><PublicSeriesBrowser /></ProtectedRoute>} />
           <Route path="/series/:seriesId" element={<ProtectedRoute><BibleStudySeriesBuilder /></ProtectedRoute>} />
           <Route path="/series/:seriesId/lesson/:lessonNumber" element={<ProtectedRoute><SeriesLessonEditor /></ProtectedRoute>} />
           <Route path="/series/:seriesId/present" element={<ProtectedRoute><SeriesPresentationMode /></ProtectedRoute>} />
            <Route path="/public-image-library" element={<ProtectedRoute><PublicImageLibrary /></ProtectedRoute>} />
            <Route path="/app-update-ideas" element={<ProtectedRoute><AppUpdateIdeas /></ProtectedRoute>} />
            <Route path="/offline-content" element={<ProtectedRoute><OfflineContent /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/my-profile" element={<ProtectedRoute><MyProfileRedirect /></ProtectedRoute>} />
            <Route path="/user/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/following-feed" element={<ProtectedRoute><FollowingFeed /></ProtectedRoute>} />
            <Route path="/critics-analysis" element={<ProtectedRoute><CriticsAnalysis /></ProtectedRoute>} />
            <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
            <Route path="/student-verify" element={<ProtectedRoute><StudentVerification /></ProtectedRoute>} />
            <Route path="/admin/access-codes" element={<ProtectedRoute><AdminAccessCodes /></ProtectedRoute>} />
            <Route path="/admin-access-codes" element={<ProtectedRoute><AdminAccessCodes /></ProtectedRoute>} />
            <Route path="/admin/subscriptions" element={<ProtectedRoute><AdminSubscriptions /></ProtectedRoute>} />
            <Route path="/admin/strongs-import" element={<ProtectedRoute><AdminStrongsImport /></ProtectedRoute>} />
            <Route path="/admin/bible-import" element={<ProtectedRoute><AdminBibleImport /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
            <Route path="/study-partners" element={<ProtectedRoute><StudyPartners /></ProtectedRoute>} />
            <Route path="/study-groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
            <Route path="/content-library" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
            <Route path="/my-progress" element={<ProtectedRoute><UserAnalytics /></ProtectedRoute>} />
            <Route path="/streaks" element={<ProtectedRoute><Streaks /></ProtectedRoute>} />
            <Route path="/church-admin" element={<ProtectedRoute><ChurchAdmin /></ProtectedRoute>} />
            <Route path="/living-manna" element={<ProtectedRoute><LivingManna /></ProtectedRoute>} />
            <Route path="/join-church" element={<JoinChurch />} />
            <Route path="/church-signup" element={<ChurchSignup />} />
            <Route path="/church-signup/success" element={<ChurchSignupSuccess />} />
            <Route path="/church-signup/cancelled" element={<ChurchSignupCancelled />} />
            <Route path="/manage-subscription" element={<ManageSubscription />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/branch-study" element={
              <Suspense fallback={<LoadingScreen />}>
                <BranchStudy />
              </Suspense>
            } />
            <Route path="/mastery" element={
              <ProtectedRoute>
                <FloorMastery />
              </ProtectedRoute>
            } />
            <Route path="/mastery/floor/:floorNumber" element={
              <ProtectedRoute>
                <FloorDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/mastery-dashboard" element={
              <ProtectedRoute>
                <MasteryDashboard />
              </ProtectedRoute>
            } />
            <Route path="/palace-ai" element={
              <ProtectedRoute>
                <PalaceAI />
              </ProtectedRoute>
            } />
            <Route path="/guilds" element={
              <ProtectedRoute>
                <Guilds />
              </ProtectedRoute>
            } />
            <Route path="/guild/:guildId" element={
              <ProtectedRoute>
                <GuildDetail />
              </ProtectedRoute>
            } />
            <Route path="/sessions" element={
              <ProtectedRoute>
                <Sessions />
              </ProtectedRoute>
            } />
            <Route path="/live-demo" element={
              <ProtectedRoute>
                <LiveDemo />
              </ProtectedRoute>
            } />
            <Route path="/public-chat" element={
              <ProtectedRoute>
                <PublicChat />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            } />
            <Route path="/workspace" element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            } />


            <Route path="/vr" element={<VRHub />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
                    </Routes>
                    </KeepAliveRoutes>
                    </Suspense>
                  </main>
                  </div>
                  {!isWorkspacePane && <MobileBottomNav />}
                  {!isWorkspacePane && (
                    <div className="zen-hideable">
                      <DraggableWidgetStack>
                        <PlaylistPanel />
                        <AmbientMusicPlayer minimal />
                        <JeevesWidget />
                        <ReginaldButler />
                      </DraggableWidgetStack>
                    </div>
                  )}
                  {!isWorkspacePane && <LiveChatSidebar />}
                  {!isWorkspacePane && <div className="zen-hideable"><LiveChatToggle /></div>}
                </div>
              </ChangeManagerProvider>
              </SidebarProvider>
              </UserPreferencesProvider>
              </LiveChatProvider>
            </DirectMessagesProvider>
          </AchievementProvider>
        </LiveNotificationsProvider>
        </SessionModeProvider>
        </StudySessionProvider>
        </PageStateProvider>
      </BrowserRouter>
          )}
        </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
