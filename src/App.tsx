import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Palace from "./pages/Palace";
import FloorDetail from "./pages/FloorDetail";
import Bible from "./pages/Bible";
import BibleChapter from "./pages/BibleChapter";
import DailyChallenges from "./pages/DailyChallenges";
import Games from "./pages/Games";
import ChainChess from "./pages/ChainChess";
import KidsGames from "./pages/KidsGames";
import LiveStudy from "./pages/LiveStudy";
import LiveStudyRoom from "./pages/LiveStudyRoom";
import KidsGamePlay from "./pages/KidsGamePlay";
import GamePlay from "./pages/GamePlay";
import Community from "./pages/Community";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Feedback from "./pages/Feedback";
import CultureControversy from "./pages/CultureControversy";
import ProphecyWatch from "./pages/ProphecyWatch";
import ResearchMode from "./pages/ResearchMode";
import BibleImageLibrary from "./pages/BibleImageLibrary";
import SermonBuilder from "./pages/SermonBuilder";
import Flashcards from "./pages/Flashcards";
import PowerOfTheLamb from "./pages/PowerOfTheLamb";
import SpiritualTraining from "./pages/SpiritualTraining";
import BlueprintCourse from "./pages/BlueprintCourse";
import PhototheologyCourse from "./pages/PhototheologyCourse";
import DanielCourse from "./pages/DanielCourse";
import RevelationCourse from "./pages/RevelationCourse";
import RevelationCourseKids from "./pages/RevelationCourseKids";
import KidGPT from "./pages/KidGPT";
import PhototheologyGPT from "./pages/PhototheologyGPT";
import DanielRevelationGPT from "./pages/DanielRevelationGPT";
import ApologeticsGPT from "./pages/ApologeticsGPT";
import LessonQuarterlyGPT from "./pages/LessonQuarterlyGPT";
import TreasureHunt from "./pages/TreasureHunt";
import TreasureHuntPlay from "./pages/TreasureHuntPlay";
import TrainingDrills from "./pages/TrainingDrills";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import CriticsAnalysis from "./pages/CriticsAnalysis";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/palace" element={<ProtectedRoute><Palace /></ProtectedRoute>} />
            <Route path="/floor/:floorNumber" element={<ProtectedRoute><FloorDetail /></ProtectedRoute>} />
            <Route path="/bible" element={<ProtectedRoute><Bible /></ProtectedRoute>} />
            <Route path="/bible/:book/:chapter" element={<ProtectedRoute><BibleChapter /></ProtectedRoute>} />
            <Route path="/daily-challenges" element={<ProtectedRoute><DailyChallenges /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/games/chain-chess/:gameId/:mode?" element={<ProtectedRoute><ChainChess /></ProtectedRoute>} />
            <Route path="/games/:gameId/:mode?" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
            <Route path="/kids-games" element={<ProtectedRoute><KidsGames /></ProtectedRoute>} />
            <Route path="/kids-games/:gameId" element={<ProtectedRoute><KidsGamePlay /></ProtectedRoute>} />
            <Route path="/treasure-hunt" element={<ProtectedRoute><TreasureHunt /></ProtectedRoute>} />
            <Route path="/treasure-hunt/:huntId" element={<ProtectedRoute><TreasureHuntPlay /></ProtectedRoute>} />
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
          <Route path="/lesson-quarterly-gpt" element={<ProtectedRoute><LessonQuarterlyGPT /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/critics-analysis" element={<ProtectedRoute><CriticsAnalysis /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
