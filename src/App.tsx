import React, { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MessagingSidebar } from "@/components/MessagingSidebar";
import { LiveNotificationsProvider } from "@/components/LiveNotificationsProvider";
import { AchievementProvider } from "@/components/AchievementProvider";
import { DirectMessagesProvider } from "@/contexts/DirectMessagesContext";
import { SplashScreen } from "@/components/SplashScreen";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { UserPreferencesProvider } from "@/hooks/useUserPreferences";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { VoiceChatInviteNotification } from "@/components/voice/VoiceChatInviteNotification";
import { PageTracker } from "@/components/PageTracker";
import { DailyVerseNotification } from "@/components/notifications/DailyVerseNotification";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ExitIntentPopup } from "@/components/conversion/ExitIntentPopup";
import { AmbientMusicPlayer } from "@/components/audio/AmbientMusicPlayer";

// Critical pages - load immediately (landing + auth only)
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy load pricing and demo
const Pricing = lazy(() => import("./pages/Pricing"));
const InteractiveDemo = lazy(() => import("./pages/InteractiveDemo"));

// Lazy load all other pages
const Palace = lazy(() => import("./pages/Palace"));
const FloorDetail = lazy(() => import("./pages/FloorDetail"));
const RoomDetail = lazy(() => import("./pages/RoomDetail"));
const GenesisHighRise = lazy(() => import("./pages/GenesisHighRise"));
const Bible = lazy(() => import("./pages/Bible"));
const BibleChapter = lazy(() => import("./pages/BibleChapter"));
const BibleSearch = lazy(() => import("./pages/BibleSearch"));
const DailyChallenges = lazy(() => import("./pages/DailyChallenges"));
const DailyVerse = lazy(() => import("./pages/DailyVerse"));
const GrowthJournal = lazy(() => import("./pages/GrowthJournal"));
const EquationsChallenge = lazy(() => import("./pages/EquationsChallenge"));
const Games = lazy(() => import("./pages/Games"));
const ChainChess = lazy(() => import("./pages/ChainChess"));
const ConcentrationGame = lazy(() => import("./pages/ConcentrationGame"));
const PalaceCardGame = lazy(() => import("./pages/PalaceCardGame"));
const KidsGames = lazy(() => import("./pages/KidsGames"));
const LiveStudy = lazy(() => import("./pages/LiveStudy"));
const LiveStudyRoom = lazy(() => import("./pages/LiveStudyRoom"));
const StudyGroups = lazy(() => import("./pages/StudyGroups"));
const ContentLibrary = lazy(() => import("./pages/ContentLibrary"));
const UserAnalytics = lazy(() => import("./pages/UserAnalytics"));
const KidsGamePlay = lazy(() => import("./pages/KidsGamePlay"));
const GamePlay = lazy(() => import("./pages/GamePlay"));
const PalaceQuiz = lazy(() => import("./pages/PalaceQuiz"));
const VerseMatch = lazy(() => import("./pages/VerseMatch"));
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
const BibleImageLibrary = lazy(() => import("./pages/BibleImageLibrary"));
const SermonBuilder = lazy(() => import("./pages/SermonBuilder"));
const SermonArchive = lazy(() => import("./pages/SermonArchive"));
const SeriesPresentationMode = lazy(() => import("./pages/SeriesPresentationMode"));
const PublicSeriesBrowser = lazy(() => import("./pages/PublicSeriesBrowser"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const PowerOfTheLamb = lazy(() => import("./pages/PowerOfTheLamb"));
const SpiritualTraining = lazy(() => import("./pages/SpiritualTraining"));
const AppTour = lazy(() => import("./pages/AppTour"));
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
const DanielRevelationGPT = lazy(() => import("./pages/DanielRevelationGPT"));
const ApologeticsGPT = lazy(() => import("./pages/ApologeticsGPT"));
const QuarterlyStudy = lazy(() => import("./pages/QuarterlyStudy"));
const ReadingPlans = lazy(() => import("./pages/ReadingPlans"));
const ReadMeTheBible = lazy(() => import("./pages/ReadMeTheBible"));
const BibleReference = lazy(() => import("./pages/BibleReference"));
const AscensionsExpansions = lazy(() => import("./pages/AscensionsExpansions"));
const BibleEncyclopedia = lazy(() => import("./pages/BibleEncyclopedia"));
const EncyclopediaArticle = lazy(() => import("./pages/EncyclopediaArticle"));
const DailyReading = lazy(() => import("./pages/DailyReading"));
const TreasureHunt = lazy(() => import("./pages/TreasureHunt"));
const TreasureHuntPlay = lazy(() => import("./pages/TreasureHuntPlay"));
const TrainingDrills = lazy(() => import("./pages/TrainingDrills"));
const DrillDrill = lazy(() => import("./pages/DrillDrill"));
const EscapeRoom = lazy(() => import("./pages/EscapeRoom"));
const EscapeRoomPlay = lazy(() => import("./pages/EscapeRoomPlay"));
const Profile = lazy(() => import("./pages/Profile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
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
const BibleRenderedRoom = lazy(() => import("./pages/BibleRenderedRoom"));
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
const ChainWar = lazy(() => import("./pages/games/ChainWar"));
const SanctuaryRun = lazy(() => import("./pages/games/SanctuaryRun"));
const TimeZoneInvasion = lazy(() => import("./pages/games/TimeZoneInvasion"));
const Connect6Draft = lazy(() => import("./pages/games/Connect6Draft"));
const ChristLock = lazy(() => import("./pages/games/ChristLock"));
const ControversyRaid = lazy(() => import("./pages/games/ControversyRaid"));
const EscapeTheDragon = lazy(() => import("./pages/games/EscapeTheDragon"));
const EquationBuilder = lazy(() => import("./pages/games/EquationBuilder"));
const WitnessTrial = lazy(() => import("./pages/games/WitnessTrial"));
const PrincipleSprint = lazy(() => import("./pages/games/PrincipleSprint"));
const ConnectionDash = lazy(() => import("./pages/games/ConnectionDash"));
const BranchStudy = lazy(() => import("./pages/BranchStudy"));
const FrameSnapshot = lazy(() => import("./pages/games/FrameSnapshot"));
const StoryRoomGame = lazy(() => import("./pages/games/StoryRoomGame"));
const ObservationGame = lazy(() => import("./pages/games/ObservationGame"));
const ConcentrationRoom = lazy(() => import("./pages/games/ConcentrationRoom"));
const DimensionsRoom = lazy(() => import("./pages/games/DimensionsRoom"));
const BlueRoomGame = lazy(() => import("./pages/games/BlueRoomGame"));
const PublicImageLibrary = lazy(() => import("./pages/PublicImageLibrary"));
const BibleStudyLeader = lazy(() => import("./pages/BibleStudyLeader"));
const BibleStudySeriesBuilder = lazy(() => import("./pages/BibleStudySeriesBuilder"));
const SeriesLessonEditor = lazy(() => import("./pages/SeriesLessonEditor"));
const SeriesPresenter = lazy(() => import("./pages/SeriesPresenter"));
const AppUpdateIdeas = lazy(() => import("./pages/AppUpdateIdeas"));
const ChurchAdmin = lazy(() => import("./pages/ChurchAdmin"));
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
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const PalaceExplorer = lazy(() => import("./pages/PalaceExplorer"));
const CardDeck = lazy(() => import("./pages/CardDeck"));
const PTMultiplayerLobby = lazy(() => import("./pages/PTMultiplayerLobby"));
const PTMultiplayerGame = lazy(() => import("./pages/PTMultiplayerGame"));
const AnalyzeThoughts = lazy(() => import("./pages/AnalyzeThoughts"));
const Devotionals = lazy(() => import("./pages/Devotionals"));
const DevotionalView = lazy(() => import("./pages/DevotionalView"));
const DevotionalProfileDetail = lazy(() => import("./pages/DevotionalProfileDetail"));
const PublicDevotionalView = lazy(() => import("./pages/PublicDevotionalView"));
const WhyPhototheology = lazy(() => import("./pages/WhyPhototheology"));
const MusicCategories = lazy(() => import("./pages/MusicCategories"));

const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);

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
              <SplashScreen onComplete={() => setShowSplash(false)} />
            )}
          </AnimatePresence>
          {!showSplash && (
            <BrowserRouter>
              <PageTracker />
              <LiveNotificationsProvider>
                <AchievementProvider>
                  <DirectMessagesProvider>
                    <UserPreferencesProvider>
                    <SidebarProvider defaultOpen={false}>
                      <div className="min-h-screen flex flex-col w-full">
                        <AnnouncementBanner />
                        <VoiceChatInviteNotification />
                        <DailyVerseNotification />
                        <InstallPrompt />
                        <ExitIntentPopup />
                        {/* Floating Ambient Music Player - higher on mobile to avoid nav */}
                        <div className="fixed bottom-24 sm:bottom-20 right-4 z-40">
                          <AmbientMusicPlayer minimal />
                        </div>
                        <div className="flex flex-1 w-full">
                          <MessagingSidebar />
                          <main className="flex-1 w-full overflow-x-hidden">
                          <Suspense fallback={<LoadingScreen />}>
                            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/genesis-challenge" element={<GenesisHighRise />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/interactive-demo" element={<InteractiveDemo />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/why-phototheology" element={<WhyPhototheology />} />
            <Route path="/app-tour" element={<AppTour />} />
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
            <Route path="/pt-multiplayer" element={<ProtectedRoute><PTMultiplayerLobby /></ProtectedRoute>} />
            <Route path="/pt-multiplayer/:gameId" element={<ProtectedRoute><PTMultiplayerGame /></ProtectedRoute>} />
            <Route path="/analyze-thoughts" element={<ProtectedRoute><AnalyzeThoughts /></ProtectedRoute>} />
            
            <Route path="/bible" element={<ProtectedRoute><Bible /></ProtectedRoute>} />
            <Route path="/bible/search" element={<ProtectedRoute><BibleSearch /></ProtectedRoute>} />
            <Route path="/bible/:book/:chapter" element={<ProtectedRoute><BibleChapter /></ProtectedRoute>} />
            <Route path="/daily-verse" element={<ProtectedRoute><DailyVerse /></ProtectedRoute>} />
            <Route path="/reading-plans" element={<ProtectedRoute><ReadingPlans /></ProtectedRoute>} />
            <Route path="/read-me-the-bible" element={<ProtectedRoute><ReadMeTheBible /></ProtectedRoute>} />
            <Route path="/bible-reference" element={<ProtectedRoute><BibleReference /></ProtectedRoute>} />
            <Route path="/ascensions-expansions" element={<ProtectedRoute><AscensionsExpansions /></ProtectedRoute>} />
            <Route path="/encyclopedia" element={<ProtectedRoute><BibleEncyclopedia /></ProtectedRoute>} />
            <Route path="/encyclopedia/:slug" element={<ProtectedRoute><EncyclopediaArticle /></ProtectedRoute>} />
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
            <Route path="/growth-journal" element={<ProtectedRoute><GrowthJournal /></ProtectedRoute>} />
            <Route path="/equations-challenge" element={<ProtectedRoute><EquationsChallenge /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/games/chef-challenge" element={<ProtectedRoute><ChefChallenge /></ProtectedRoute>} />
            <Route path="/games/chain-war" element={<ProtectedRoute><ChainWar /></ProtectedRoute>} />
            <Route path="/games/sanctuary-run" element={<ProtectedRoute><SanctuaryRun /></ProtectedRoute>} />
            <Route path="/games/time-zone-invasion" element={<ProtectedRoute><TimeZoneInvasion /></ProtectedRoute>} />
            <Route path="/games/connect6-draft" element={<ProtectedRoute><Connect6Draft /></ProtectedRoute>} />
            <Route path="/games/christ-lock" element={<ProtectedRoute><ChristLock /></ProtectedRoute>} />
            <Route path="/games/controversy-raid" element={<ProtectedRoute><ControversyRaid /></ProtectedRoute>} />
            <Route path="/games/escape-dragon" element={<ProtectedRoute><EscapeTheDragon /></ProtectedRoute>} />
            <Route path="/games/equation-builder" element={<ProtectedRoute><EquationBuilder /></ProtectedRoute>} />
            <Route path="/games/witness-trial" element={<ProtectedRoute><WitnessTrial /></ProtectedRoute>} />
            <Route path="/games/principle-sprint" element={<ProtectedRoute><PrincipleSprint /></ProtectedRoute>} />
            <Route path="/games/connection-dash" element={<ProtectedRoute><ConnectionDash /></ProtectedRoute>} />
            <Route path="/games/frame-snapshot" element={<ProtectedRoute><FrameSnapshot /></ProtectedRoute>} />
            <Route path="/games/story-room" element={<ProtectedRoute><StoryRoomGame /></ProtectedRoute>} />
            <Route path="/games/observation-room" element={<ProtectedRoute><ObservationGame /></ProtectedRoute>} />
            <Route path="/games/concentration-room" element={<ProtectedRoute><ConcentrationRoom /></ProtectedRoute>} />
            <Route path="/games/dimensions-room" element={<ProtectedRoute><DimensionsRoom /></ProtectedRoute>} />
            <Route path="/games/blue-room" element={<ProtectedRoute><BlueRoomGame /></ProtectedRoute>} />
            <Route path="/games/principle-cards" element={<ProtectedRoute><PrincipleCards /></ProtectedRoute>} />
            <Route path="/games/principle-cards/game/:gameId" element={<ProtectedRoute><PrincipleCardsGame /></ProtectedRoute>} />
            <Route path="/games/principle-cards/tournaments" element={<ProtectedRoute><PrincipleTournaments /></ProtectedRoute>} />
            <Route path="/games/principle-cards/tournament/:tournamentId" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
            {/* Redirect routes for easier access */}
            <Route path="/chain-chess" element={<ProtectedRoute><ChainChess /></ProtectedRoute>} />
            <Route path="/games/chain-chess/:gameId/:mode?" element={<ProtectedRoute><ChainChess /></ProtectedRoute>} />
            <Route path="/games/concentration" element={<ProtectedRoute><ConcentrationGame /></ProtectedRoute>} />
            <Route path="/games/palace-cards" element={<ProtectedRoute><PalaceCardGame /></ProtectedRoute>} />
            <Route path="/games/palace_quiz/:mode?" element={<ProtectedRoute><PalaceQuiz /></ProtectedRoute>} />
            <Route path="/games/verse_match/:mode?" element={<ProtectedRoute><VerseMatch /></ProtectedRoute>} />
            <Route path="/games/principle_puzzle/:mode?" element={<ProtectedRoute><PrinciplePuzzle /></ProtectedRoute>} />
            <Route path="/games/:gameId/:mode?" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
            <Route path="/kids-games" element={<ProtectedRoute><KidsGames /></ProtectedRoute>} />
            <Route path="/kids-games/:gameId" element={<ProtectedRoute><KidsGamePlay /></ProtectedRoute>} />
            <Route path="/treasure-hunt" element={<ProtectedRoute><TreasureHunt /></ProtectedRoute>} />
            <Route path="/treasure-hunt/:huntId" element={<ProtectedRoute><TreasureHuntPlay /></ProtectedRoute>} />
            <Route path="/escape-room" element={<ProtectedRoute><EscapeRoom /></ProtectedRoute>} />
            <Route path="/escape-room/play/:roomId" element={<ProtectedRoute><EscapeRoomPlay /></ProtectedRoute>} />
            <Route path="/training-drills" element={<ProtectedRoute><TrainingDrills /></ProtectedRoute>} />
            <Route path="/drill-drill" element={<ProtectedRoute><DrillDrill /></ProtectedRoute>} />
            <Route path="/live-study" element={<ProtectedRoute><LiveStudy /></ProtectedRoute>} />
            <Route path="/live-study/:roomId" element={<ProtectedRoute><LiveStudyRoom /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/community-optimized" element={<ProtectedRoute><CommunityOptimized /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="/culture-controversy" element={<ProtectedRoute><CultureControversy /></ProtectedRoute>} />
          <Route path="/prophecy-watch" element={<ProtectedRoute><ProphecyWatch /></ProtectedRoute>} />
          <Route path="/research-mode" element={<ProtectedRoute><ResearchMode /></ProtectedRoute>} />
            <Route path="/bible-image-library" element={<ProtectedRoute><BibleImageLibrary /></ProtectedRoute>} />
          <Route path="/sermon-builder" element={<ProtectedRoute><SermonBuilder /></ProtectedRoute>} />
          <Route path="/sermon-archive" element={<ProtectedRoute><SermonArchive /></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
          <Route path="/bible-rendered-room" element={<ProtectedRoute><BibleRenderedRoom /></ProtectedRoute>} />
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
          <Route path="/kidgpt" element={<ProtectedRoute><KidGPT /></ProtectedRoute>} />
          <Route path="/kid-gpt" element={<ProtectedRoute><KidGPT /></ProtectedRoute>} />
          <Route path="/pt-kids-games" element={<ProtectedRoute><PTKidsGames /></ProtectedRoute>} />
          <Route path="/pt-kids-game/:gameId" element={<ProtectedRoute><PTKidsGamePlay /></ProtectedRoute>} />
          <Route path="/phototheologygpt" element={<ProtectedRoute><PhototheologyGPT /></ProtectedRoute>} />
          <Route path="/daniel-revelation-gpt" element={<ProtectedRoute><DanielRevelationGPT /></ProtectedRoute>} />
          <Route path="/apologetics-gpt" element={<ProtectedRoute><ApologeticsGPT /></ProtectedRoute>} />
          <Route path="/quarterly-study" element={<ProtectedRoute><QuarterlyStudy /></ProtectedRoute>} />
            <Route path="/bible-study-leader" element={<ProtectedRoute><BibleStudyLeader /></ProtectedRoute>} />
           <Route path="/bible-study-series" element={<ProtectedRoute><BibleStudySeriesBuilder /></ProtectedRoute>} />
           <Route path="/devotionals" element={<ProtectedRoute><Devotionals /></ProtectedRoute>} />
           <Route path="/devotionals/:planId" element={<ProtectedRoute><DevotionalView /></ProtectedRoute>} />
           <Route path="/devotionals/profile/:profileId" element={<ProtectedRoute><DevotionalProfileDetail /></ProtectedRoute>} />
           <Route path="/shared-devotional/:shareToken" element={<PublicDevotionalView />} />
           <Route path="/bible-study-series/discover" element={<ProtectedRoute><PublicSeriesBrowser /></ProtectedRoute>} />
           <Route path="/series/:seriesId" element={<ProtectedRoute><BibleStudySeriesBuilder /></ProtectedRoute>} />
           <Route path="/series/:seriesId/lesson/:lessonNumber" element={<ProtectedRoute><SeriesLessonEditor /></ProtectedRoute>} />
           <Route path="/series/:seriesId/present" element={<ProtectedRoute><SeriesPresentationMode /></ProtectedRoute>} />
            <Route path="/public-image-library" element={<ProtectedRoute><PublicImageLibrary /></ProtectedRoute>} />
            <Route path="/app-update-ideas" element={<ProtectedRoute><AppUpdateIdeas /></ProtectedRoute>} />
            <Route path="/offline-content" element={<ProtectedRoute><OfflineContent /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/user/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
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
            <Route path="/join-church" element={<ProtectedRoute><JoinChurch /></ProtectedRoute>} />
            <Route path="/church-signup" element={<ChurchSignup />} />
            <Route path="/church-signup/success" element={<ChurchSignupSuccess />} />
            <Route path="/church-signup/cancelled" element={<ChurchSignupCancelled />} />
            <Route path="/manage-subscription" element={<ManageSubscription />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
                    </Routes>
                    </Suspense>
                  </main>
                  </div>
                </div>
              </SidebarProvider>
              </UserPreferencesProvider>
            </DirectMessagesProvider>
          </AchievementProvider>
        </LiveNotificationsProvider>
      </BrowserRouter>
          )}
        </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
