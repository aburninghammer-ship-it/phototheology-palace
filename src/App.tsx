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
import NotFound from "./pages/NotFound";

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
            <Route path="/palace" element={<Palace />} />
            <Route path="/floor/:floorNumber" element={<FloorDetail />} />
            <Route path="/bible" element={<Bible />} />
            <Route path="/bible/:book/:chapter" element={<BibleChapter />} />
            <Route path="/daily-challenges" element={<DailyChallenges />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/chain-chess/:gameId/:mode?" element={<ChainChess />} />
            <Route path="/kids-games" element={<KidsGames />} />
            <Route path="/live-study" element={<LiveStudy />} />
            <Route path="/community" element={<Community />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/feedback" element={<Feedback />} />
          <Route path="/culture-controversy" element={<CultureControversy />} />
          <Route path="/prophecy-watch" element={<ProphecyWatch />} />
          <Route path="/research-mode" element={<ResearchMode />} />
          <Route path="/bible-image-library" element={<BibleImageLibrary />} />
          <Route path="/sermon-builder" element={<SermonBuilder />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/power-of-the-lamb" element={<PowerOfTheLamb />} />
          <Route path="/spiritual-training" element={<SpiritualTraining />} />
          <Route path="/blueprint-course" element={<BlueprintCourse />} />
          <Route path="/phototheology-course" element={<PhototheologyCourse />} />
          <Route path="/daniel-course" element={<DanielCourse />} />
          <Route path="/revelation-course" element={<RevelationCourse />} />
          <Route path="/revelation-course/kids" element={<RevelationCourseKids />} />
          <Route path="/kidgpt" element={<KidGPT />} />
          <Route path="/phototheologygpt" element={<PhototheologyGPT />} />
          <Route path="/daniel-revelation-gpt" element={<DanielRevelationGPT />} />
          <Route path="/apologetics-gpt" element={<ApologeticsGPT />} />
          <Route path="/lesson-quarterly-gpt" element={<LessonQuarterlyGPT />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
