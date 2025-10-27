import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MessagingSidebar } from "@/components/MessagingSidebar";

// Critical pages - load immediately
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";

// Lazy load all other pages
const Palace = lazy(() => import("./pages/Palace"));
const FloorDetail = lazy(() => import("./pages/FloorDetail"));
const RoomDetail = lazy(() => import("./pages/RoomDetail"));
const Bible = lazy(() => import("./pages/Bible"));
const BibleChapter = lazy(() => import("./pages/BibleChapter"));
const BibleSearch = lazy(() => import("./pages/BibleSearch"));
const DailyChallenges = lazy(() => import("./pages/DailyChallenges"));
const GrowthJournal = lazy(() => import("./pages/GrowthJournal"));
const EquationsChallenge = lazy(() => import("./pages/EquationsChallenge"));
const Games = lazy(() => import("./pages/Games"));
const ChainChess = lazy(() => import("./pages/ChainChess"));
const ConcentrationGame = lazy(() => import("./pages/ConcentrationGame"));
const PalaceCardGame = lazy(() => import("./pages/PalaceCardGame"));
const KidsGames = lazy(() => import("./pages/KidsGames"));
const LiveStudy = lazy(() => import("./pages/LiveStudy"));
const LiveStudyRoom = lazy(() => import("./pages/LiveStudyRoom"));
const KidsGamePlay = lazy(() => import("./pages/KidsGamePlay"));
const GamePlay = lazy(() => import("./pages/GamePlay"));
const PalaceQuiz = lazy(() => import("./pages/PalaceQuiz"));
const VerseMatch = lazy(() => import("./pages/VerseMatch"));
const PrinciplePuzzle = lazy(() => import("./pages/PrinciplePuzzle"));
const Community = lazy(() => import("./pages/Community"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Feedback = lazy(() => import("./pages/Feedback"));
const CultureControversy = lazy(() => import("./pages/CultureControversy"));
const ProphecyWatch = lazy(() => import("./pages/ProphecyWatch"));
const ResearchMode = lazy(() => import("./pages/ResearchMode"));
const BibleImageLibrary = lazy(() => import("./pages/BibleImageLibrary"));
const SermonBuilder = lazy(() => import("./pages/SermonBuilder"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const PowerOfTheLamb = lazy(() => import("./pages/PowerOfTheLamb"));
const SpiritualTraining = lazy(() => import("./pages/SpiritualTraining"));
const AppTour = lazy(() => import("./pages/AppTour"));
const BlueprintCourse = lazy(() => import("./pages/BlueprintCourse"));
const PhototheologyCourse = lazy(() => import("./pages/PhototheologyCourse"));
const DanielCourse = lazy(() => import("./pages/DanielCourse"));
const RevelationCourse = lazy(() => import("./pages/RevelationCourse"));
const RevelationCourseKids = lazy(() => import("./pages/RevelationCourseKids"));
const KidGPT = lazy(() => import("./pages/KidGPT"));
const PhototheologyGPT = lazy(() => import("./pages/PhototheologyGPT"));
const DanielRevelationGPT = lazy(() => import("./pages/DanielRevelationGPT"));
const ApologeticsGPT = lazy(() => import("./pages/ApologeticsGPT"));
const QuarterlyStudy = lazy(() => import("./pages/QuarterlyStudy"));
const TreasureHunt = lazy(() => import("./pages/TreasureHunt"));
const TreasureHuntPlay = lazy(() => import("./pages/TreasureHuntPlay"));
const TrainingDrills = lazy(() => import("./pages/TrainingDrills"));
const EscapeRoom = lazy(() => import("./pages/EscapeRoom"));
const EscapeRoomPlay = lazy(() => import("./pages/EscapeRoomPlay"));
const Profile = lazy(() => import("./pages/Profile"));
const CriticsAnalysis = lazy(() => import("./pages/CriticsAnalysis"));
const Referrals = lazy(() => import("./pages/Referrals"));
const StudentVerification = lazy(() => import("./pages/StudentVerification"));
const AccessCode = lazy(() => import("./pages/AccessCode"));
const AdminAccessCodes = lazy(() => import("./pages/AdminAccessCodes"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const BibleRenderedRoom = lazy(() => import("./pages/BibleRenderedRoom"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Certificates = lazy(() => import("./pages/Certificates"));
const StudyPartners = lazy(() => import("./pages/StudyPartners"));
const MemorizationVerses = lazy(() => import("./pages/MemorizationVerses"));
const VerseMemoryHall = lazy(() => import("./pages/VerseMemoryHall"));
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
const FrameSnapshot = lazy(() => import("./pages/games/FrameSnapshot"));
const StoryRoomGame = lazy(() => import("./pages/games/StoryRoomGame"));
const ObservationGame = lazy(() => import("./pages/games/ObservationGame"));
const ConcentrationRoom = lazy(() => import("./pages/games/ConcentrationRoom"));
const DimensionsRoom = lazy(() => import("./pages/games/DimensionsRoom"));
const BlueRoomGame = lazy(() => import("./pages/games/BlueRoomGame"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineIndicator />
          <BrowserRouter>
            <SidebarProvider defaultOpen={false}>
              <div className="min-h-screen flex w-full relative">
                <MessagingSidebar />
                <main className="flex-1 min-w-0 overflow-x-hidden">
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
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
            <Route path="/palace/floor/:floorNumber" element={<ProtectedRoute><FloorDetail /></ProtectedRoute>} />
            <Route path="/palace/floor/:floorNumber/room/:roomId" element={<ProtectedRoute><RoomDetail /></ProtectedRoute>} />
            
            <Route path="/bible" element={<ProtectedRoute><Bible /></ProtectedRoute>} />
            <Route path="/bible/search" element={<ProtectedRoute><BibleSearch /></ProtectedRoute>} />
            <Route path="/bible/:book/:chapter" element={<ProtectedRoute><BibleChapter /></ProtectedRoute>} />
            <Route path="/memorization-verses" element={<ProtectedRoute><MemorizationVerses /></ProtectedRoute>} />
            <Route path="/verse-memory-hall" element={<ProtectedRoute><VerseMemoryHall /></ProtectedRoute>} />
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
            <Route path="/games/frame-snapshot" element={<ProtectedRoute><FrameSnapshot /></ProtectedRoute>} />
            <Route path="/games/story-room" element={<ProtectedRoute><StoryRoomGame /></ProtectedRoute>} />
            <Route path="/games/observation-room" element={<ProtectedRoute><ObservationGame /></ProtectedRoute>} />
            <Route path="/games/concentration-room" element={<ProtectedRoute><ConcentrationRoom /></ProtectedRoute>} />
            <Route path="/games/dimensions-room" element={<ProtectedRoute><DimensionsRoom /></ProtectedRoute>} />
            <Route path="/games/blue-room" element={<ProtectedRoute><BlueRoomGame /></ProtectedRoute>} />
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
            <Route path="/live-study" element={<ProtectedRoute><LiveStudy /></ProtectedRoute>} />
            <Route path="/live-study/:roomId" element={<ProtectedRoute><LiveStudyRoom /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="/culture-controversy" element={<ProtectedRoute><CultureControversy /></ProtectedRoute>} />
          <Route path="/prophecy-watch" element={<ProtectedRoute><ProphecyWatch /></ProtectedRoute>} />
          <Route path="/research-mode" element={<ProtectedRoute><ResearchMode /></ProtectedRoute>} />
          <Route path="/bible-image-library" element={<ProtectedRoute><BibleImageLibrary /></ProtectedRoute>} />
          <Route path="/sermon-builder" element={<ProtectedRoute><SermonBuilder /></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
          <Route path="/bible-rendered-room" element={<ProtectedRoute><BibleRenderedRoom /></ProtectedRoute>} />
          <Route path="/power-of-the-lamb" element={<ProtectedRoute><PowerOfTheLamb /></ProtectedRoute>} />
          <Route path="/spiritual-training" element={<ProtectedRoute><SpiritualTraining /></ProtectedRoute>} />
          <Route path="/blueprint-course" element={<ProtectedRoute><BlueprintCourse /></ProtectedRoute>} />
          <Route path="/phototheology-course" element={<ProtectedRoute><PhototheologyCourse /></ProtectedRoute>} />
          <Route path="/daniel-course" element={<ProtectedRoute><DanielCourse /></ProtectedRoute>} />
          <Route path="/revelation-course" element={<ProtectedRoute><RevelationCourse /></ProtectedRoute>} />
          <Route path="/revelation-course/kids" element={<ProtectedRoute><RevelationCourseKids /></ProtectedRoute>} />
          <Route path="/kidgpt" element={<ProtectedRoute><KidGPT /></ProtectedRoute>} />
          <Route path="/phototheologygpt" element={<ProtectedRoute><PhototheologyGPT /></ProtectedRoute>} />
          <Route path="/daniel-revelation-gpt" element={<ProtectedRoute><DanielRevelationGPT /></ProtectedRoute>} />
          <Route path="/apologetics-gpt" element={<ProtectedRoute><ApologeticsGPT /></ProtectedRoute>} />
          <Route path="/quarterly-study" element={<ProtectedRoute><QuarterlyStudy /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/critics-analysis" element={<ProtectedRoute><CriticsAnalysis /></ProtectedRoute>} />
            <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
            <Route path="/student-verify" element={<ProtectedRoute><StudentVerification /></ProtectedRoute>} />
            <Route path="/admin/access-codes" element={<ProtectedRoute><AdminAccessCodes /></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
            <Route path="/study-partners" element={<ProtectedRoute><StudyPartners /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
