import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslatedPalaceData } from "@/hooks/useTranslatedPalaceData";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, HelpCircle, BookOpen, AlertCircle, CheckCircle, Trophy, Lock, Dumbbell, Brain, ChevronDown, Swords, Crown, FileText, Star, Award, Sparkles, Info } from "lucide-react";
import { SequentialMasteryNotice } from "@/components/palace/SequentialMasteryNotice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { JeevesAssistant } from "@/components/JeevesAssistant";
import { useRoomProgress } from "@/hooks/useRoomProgress";
import { useAuth } from "@/hooks/useAuth";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { useMastery } from "@/hooks/useMastery";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PracticeDrill } from "@/components/practice/PracticeDrill";
import { getDrillsByRoom, getDrillName } from "@/data/drillQuestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { genesisImages } from "@/assets/24fps/genesis";
import { Exodus24FPSDrill } from "@/components/rooms/Exodus24FPSDrill";
import { Bible24FPSBrowser } from "@/components/rooms/Bible24FPSBrowser";
import { UserGemsList } from "@/components/UserGemsList";
import { GemGenerator } from "@/components/gems/GemGenerator";
import { FreestyleGame } from "@/components/freestyle/FreestyleGame";
import { BibleFreestyleGame } from "@/components/freestyle/BibleFreestyleGame";
import { VerseGeneticsArena } from "@/components/freestyle/VerseGeneticsArena";
import { RoomGames } from "@/components/rooms/RoomGames";
import { SpeedRoomDrill } from "@/components/rooms/SpeedRoomDrill";
import { MathematicsRoomDrill } from "@/components/rooms/MathematicsRoomDrill";
import { JuiceRoomDrill } from "@/components/rooms/JuiceRoomDrill";
import { CyclesRoomDrill } from "@/components/rooms/CyclesRoomDrill";
import { ThreeHeavensRoomDrill } from "@/components/rooms/ThreeHeavensRoomDrill";
import DefComRoomDrill from "@/components/rooms/DefComRoomDrill";
import { ConcentrationRoomDrill } from "@/components/rooms/ConcentrationRoomDrill";
import { PatternExplorer } from "@/components/palace/PatternExplorer";
import { RoomPracticeSpace } from "@/components/RoomPracticeSpace";
import { QuickStartGuide } from "@/components/palace/QuickStartGuide";
import { ValueProposition } from "@/components/palace/ValueProposition";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChristChapterFindings } from "@/components/ChristChapterFindings";
import { OnboardingGuide } from "@/components/palace/OnboardingGuide";
import { SermonTitlesList } from "@/components/SermonTitlesList";
import { MasteryBadge } from "@/components/mastery/MasteryBadge";
import { XpProgressBar } from "@/components/mastery/XpProgressBar";
import { RoomMentorChat } from "@/components/mastery/RoomMentorChat";
import { ReportCardDisplay } from "@/components/mastery/ReportCardDisplay";
import { useFocusedRoom } from "@/hooks/useFocusedRoom";
import { TrainingDashboard } from "@/components/mastery/TrainingDashboard";
import { ContinueTraining } from "@/components/mastery/ContinueTraining";
import { MilestoneTest } from "@/components/mastery/MilestoneTest";
import { useRoomCurriculum } from "@/hooks/useRoomCurriculum";
import { MasteryProgramEnrollment } from "@/components/mastery/MasteryProgramEnrollment";
import { JeevesMasterProgram } from "@/components/mastery/JeevesMasterProgram";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { RoomTour } from "@/components/onboarding/RoomTour";
import { useRoomTour } from "@/hooks/useRoomTour";
import { PathRoomExercises, ReturnToPathBanner } from "@/components/path";
import { RoomCard } from "@/components/palace/RoomCard";
import { getCardImage } from "@/data/cardImages";
import { GenesisGalleryTour } from "@/components/onboarding/GenesisGalleryTour";
import { use24FPSTour } from "@/hooks/use24FPSTour";
import { StoryLibrary } from "@/components/story-room/StoryLibrary";
import { SymbolLibrary } from "@/components/symbol-room/SymbolLibrary";
import { ParallelsLibrary } from "@/components/parallels-room/ParallelsLibrary";
import { NatureFreestyleLibrary } from "@/components/nature-freestyle/NatureFreestyleLibrary";
import { HistoricalFreestyleLibrary } from "@/components/historical-freestyle/HistoricalFreestyleLibrary";
import { GemsLibrary } from "@/components/gems-room/GemsLibrary";
import { QALibrary } from "@/components/qa-room/QALibrary";
import { FeastsLibrary } from "@/components/feasts-room/FeastsLibrary";
import { MathematicsLibrary } from "@/components/mathematics-room/MathematicsLibrary";
import { SanctuaryLibrary } from "@/components/sanctuary-room/SanctuaryLibrary";
import { ProphecyLibrary } from "@/components/prophecy-room/ProphecyLibrary";
import { ThemesLibrary } from "@/components/themes-room/ThemesLibrary";
import { PatternsLibrary } from "@/components/patterns-room/PatternsLibrary";
import { ThreeHeavensLibrary } from "@/components/three-heavens-room/ThreeHeavensLibrary";
import { Room66Library } from "@/components/room66/Room66Library";
import { RoomLibrary, LibraryBanner, hasLibrary } from "@/components/room/RoomLibrary";
import { RoomPracticeTools } from "@/components/palace/RoomPracticeTools";
import { ImageBibleBrowser } from "@/components/rooms/ImageBibleBrowser";

import { RoomGraphicsDisplay, hasRoomGraphics } from "@/components/room/RoomGraphicsDisplay";
import { WordPictureTranslator } from "@/components/rooms/WordPictureTranslator";
import { MobileOrientationTip } from "@/components/MobileOrientationTip";
import { useTranslation } from 'react-i18next';
import { roomDescriptions } from "@/data/roomDescriptions";

// Room IDs that have quick start guides
const QUICK_START_ROOMS = new Set([
  // Floor 1
  'sr', 'ir', '24fps', 'br', 'tr', 'gr',
  // Floor 2
  'or', 'dc', 'st', 'qr', 'qa',
  // Floor 3
  'nf', 'pf', 'bf', 'hf', 'lr',
  // Floor 4
  'cr', 'dr', 'c6', 'trm', 'tz', 'prm', 'p||', 'frt', 'cec', 'r66',
  // Floor 5
  'bl', 'pr', '3a', 'fe',
  // Floor 6
  '123h', 'cycles', 'jr', 'math',
  // Floor 7
  'frm', 'mr', 'srm'
]);

export default function RoomDetail() {
  const { t } = useTranslation();
  const { translatedFloors } = useTranslatedPalaceData();
  const { floorNumber, roomId } = useParams();
  const [searchParams] = useSearchParams();
  const pathActivityId = searchParams.get('pathActivityId') || undefined;
  const navigate = useNavigate();
  const { user } = useAuth();
  const floor = translatedFloors.find(f => f.number === Number(floorNumber));
  const room = floor?.rooms.find(r => r.id === roomId);
  const [showDrill, setShowDrill] = useState(false);
  const [methodExpanded, setMethodExpanded] = useState(false);
  const [examplesExpanded, setExamplesExpanded] = useState(false);
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(true);
  const [activeTab, setActiveTab] = useState("learn");

  // Scroll to top when room changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [floorNumber, roomId]);

  // Check if this is the first room visit after onboarding (now 24FPS Room)
  const isFirstRoomVisit = Number(floorNumber) === 1 && roomId === "24fps" &&
    !localStorage.getItem("onboarding_guide_24fps");

  // 24FPS Gallery Tour for onboarding
  const { showTour: show24FPSTour, completeTour: complete24FPSTour, skipTour: skip24FPSTour } = use24FPSTour();

  // Show Quick Start by default for ALL rooms that have quick starts defined
  const showQuickStart = room && QUICK_START_ROOMS.has(room.id);

  const {
    progress,
    loading: progressLoading,
    markExerciseComplete,
    markRoomComplete
  } = useRoomProgress(Number(floorNumber), roomId || "");

  const { isUnlocked, loading: unlockLoading, missingPrerequisites } = useRoomUnlock(
    Number(floorNumber),
    roomId || ""
  );

  const { mastery, isLoading: masteryLoading, awardXp, isAwarding } = useMastery(roomId || "", Number(floorNumber));
  const { addItem } = useSpacedRepetition();
  const { focusedRoom, isFocused, setFocusedRoom, clearFocusedRoom, isSettingFocus } = useFocusedRoom();

  // Room tour for first-time visitors
  const { showTour: showRoomTour, completeTour: completeRoomTour, skipTour: skipRoomTour, resetTour: resetRoomTour } = useRoomTour(roomId || "", Number(floorNumber));

  // Training curriculum system
  const {
    curriculum,
    progress: curriculumProgress,
    nextActivity,
    availableActivities,
    completionPercentage: curriculumCompletion,
    completeActivity,
    passMilestoneTest,
  } = useRoomCurriculum(roomId || "", room?.name || "", Number(floorNumber));

  // Training UI state
  const [showMilestoneTest, setShowMilestoneTest] = useState(false);
  const [currentTestLevel, setCurrentTestLevel] = useState<number | null>(null);

  const drillQuestions = room ? getDrillsByRoom(room.id) : [];
  const drillName = room ? getDrillName(room.id) : "Practice Drill";
  const hasDrills = drillQuestions.length > 0;

  // Check if mentor mode is unlocked (Expert or Master level)
  const mentorModeUnlocked = mastery && mastery.mastery_level >= 4;

  // Check if this room is the focused room
  const isThisFocused = isFocused(roomId || "", Number(floorNumber));

  const handleAddToReview = () => {
    if (!room) return;
    addItem(
      "room_content",
      `${floorNumber}-${roomId}`,
      {
        question: room.coreQuestion,
        answer: room.method,
        room_name: room.name,
        floor: floorNumber,
      }
    );
  };

  const handleSetFocus = () => {
    if (isThisFocused) {
      clearFocusedRoom();
    } else {
      setFocusedRoom({ roomId: room!.id, floorNumber: floor!.number });
    }
  };

  // Don't redirect - let users see why room is locked

  if (!floor || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('roomDetail.notFound')}</h1>
          <Link to="/palace">
            <Button>{t('roomDetail.returnToPalace')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const gradient = [
    "gradient-palace",
    "gradient-royal",
    "gradient-ocean",
    "gradient-forest",
    "gradient-sunset",
    "gradient-warmth",
    "gradient-dreamy",
    "gradient-palace"
  ][floor.number - 1];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      {show24FPSTour && roomId === "24fps" && (
        <GenesisGalleryTour
          onComplete={complete24FPSTour}
          onSkip={skip24FPSTour}
        />
      )}

      {showRoomTour && room && floor && !show24FPSTour && (
        <RoomTour
          room={room}
          floorNumber={floor.number}
          floorName={floor.name}
          onComplete={completeRoomTour}
          onSkip={skipRoomTour}
        />
      )}

      {isFirstRoomVisit && showOnboardingGuide && room && (
        <OnboardingGuide
          roomId={room.id}
          roomName={room.name}
          onComplete={() => setShowOnboardingGuide(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <Link to={`/palace/floor/${floor.number}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('roomDetail.backToFloor', { floorNumber: floor.number })}
          </Button>
        </Link>

        <div className="mb-4">
          <SequentialMasteryNotice floorNumber={floor.number} variant="compact" />
        </div>

        {!isUnlocked && !unlockLoading && user && (
          <Alert className="mb-6 border-destructive bg-destructive/20">
            <Lock className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-base">
              <strong className="text-lg block mb-2">{t('roomDetail.locked')}</strong>
              {missingPrerequisites.length > 0 ? (
                <>
                  <p className="mb-2">{t('roomDetail.lockMessage')}</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                    {missingPrerequisites.map((prereq, idx) => (
                      <li key={idx} className="font-medium">{prereq}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>{t('roomDetail.completePreviousFloor')}</p>
              )}
              <div className="mt-4">
                <Link to={`/palace/floor/${floorNumber}`}>
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('roomDetail.backToFloor', { floorNumber })}
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className={`${gradient} rounded-2xl p-10 mb-8 text-white relative overflow-hidden shadow-2xl`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-20 w-2 h-2 bg-white rounded-full animate-pulse" />
            <div className="absolute top-32 right-40 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-20 left-32 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
            <div className="absolute bottom-32 right-60 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
          </div>

          <div className="absolute -right-10 -top-10 text-[200px] opacity-10 select-none">
            {
              {sr: "📖", ir: "👁️", "24fps": "🎬", br: "🗺️", tr: "🎨", gr: "💎",
               or: "🔍", dc: "🧪", st: "🔗", qr: "❓", qa: "💬",
               nf: "🌿", pf: "🪞", bf: "🧬", hf: "📜", lr: "👂",
               cr: "✝️", dr: "💠", c6: "📚", trm: "🏛️", tz: "⏰", prm: "🎵", "p||": "🪞", frt: "🍇", cec: "👑", r66: "📿",
               bl: "⛪", pr: "🔮", "3a": "👼", fe: "🎊",
               "123h": "☁️", cycles: "🔄", jr: "🍊", math: "🔢",
               frm: "🔥", mr: "🙏", srm: "⚡"}[room.id] || "⭐"
            }
          </div>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="outline" className="text-white border-white/70 backdrop-blur-sm bg-white/10 px-4 py-1.5 text-lg font-bold shadow-lg">
                {room.tag}
              </Badge>
              {user && progress?.completed_at && (
                <Badge variant="outline" className="text-white border-green-300 bg-green-500/30 backdrop-blur-sm px-4 py-1.5 shadow-lg">
                  <Trophy className="h-4 w-4 mr-1" />
                  {t('roomDetail.completedBadge')}
                </Badge>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
              {getCardImage(room.id) ? (
                <div className="flex-shrink-0">
                  <RoomCard
                    roomId={room.id}
                    roomName={room.name}
                    floor={floor.number}
                    size="sm"
                  />
                </div>
              ) : (
                <span className="text-6xl drop-shadow-2xl flex-shrink-0">
                  {
                    {sr: "📖", ir: "👁️", "24fps": "🎬", br: "🗺️", tr: "🎨", gr: "💎",
                     or: "🔍", dc: "🧪", st: "🔗", qr: "❓", qa: "💬",
                     nf: "🌿", pf: "🪞", bf: "🧬", hf: "📜", lr: "👂",
                     cr: "✝️", dr: "💠", c6: "📚", trm: "🏛️", tz: "⏰", prm: "🎵", "p||": "🪞", frt: "🍇", cec: "👑", r66: "📿",
                     bl: "⛪", pr: "🔮", "3a": "👼", fe: "🎊",
                     "123h": "☁️", cycles: "🔄", jr: "🍊", math: "🔢",
                     frm: "🔥", mr: "🙏", srm: "⚡"}[room.id] || "⭐"
                  }
                </span>
              )}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black drop-shadow-2xl tracking-tight">{room.name}</h1>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-95 drop-shadow-lg mt-2">{room.purpose}</p>
              </div>
            </div>

            {roomDescriptions[room.id] && (
              <div className="mt-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 space-y-3">
                {roomDescriptions[room.id].map((paragraph, idx) => (
                  <p key={idx} className="text-white/90 leading-relaxed text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {user && (
          <VoiceChatWidget
            roomType="palace"
            roomId={`floor/${floorNumber}/room/${roomId}`}
            roomName={`${room.name} (Floor ${floorNumber})`}
            className="mb-6"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MobileOrientationTip className="mb-4" />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger value="learn" className="data-[state=active]:shadow-glow transition-all duration-300">
                  {t('roomDetail.learnTab')}
                </TabsTrigger>
                <TabsTrigger value="games" className="data-[state=active]:shadow-glow transition-all duration-300">
                  {t('roomDetail.gamesTab')}
                </TabsTrigger>
                <TabsTrigger value="practice" className="data-[state=active]:shadow-glow transition-all duration-300">
                  {t('roomDetail.practiceTab')}
                </TabsTrigger>
                <TabsTrigger value="master" className="data-[state=active]:shadow-glow transition-all duration-300">
                  {t('roomDetail.masterTab')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="learn" className="space-y-6 mt-6">
                {user && (
                  <PathRoomExercises
                    roomId={room.id}
                    roomName={room.name}
                    floorNumber={floor.number}
                  />
                )}

                {showQuickStart && <ValueProposition roomId={room.id} />}
                {showQuickStart && <QuickStartGuide roomId={room.id} roomName={room.name} />}

                {hasRoomGraphics(room.id) && (
                  <RoomGraphicsDisplay roomId={room.id} roomName={room.name} />
                )}

                {hasLibrary(room.id) && !["sr", "st", "qa", "24fps", "gr", "cycles", "123h", "math", "jr", "dc", "cr", "bl", "pr", "trm", "fe"].includes(room.id) && (
                  <LibraryBanner
                    roomId={room.id}
                    onExplore={() => {
                      const librarySection = document.querySelector('[data-library-section]');
                      if (librarySection) {
                        librarySection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  />
                )}

                <Card variant="glass" className="relative">
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-palace rounded-xl shadow-lg">
                          <HelpCircle className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">{t('roomDetail.coreQuestion')}</CardTitle>
                      </div>
                      {user && (
                        <Button
                          onClick={handleAddToReview}
                          variant="outline"
                          size="sm"
                          className="gap-2 hover:shadow-glow transition-all"
                        >
                          <Brain className="h-4 w-4" />
                          {t('roomDetail.addToReview')}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-xl border-2 border-primary/20">
                      <p className="text-xl font-bold text-foreground leading-relaxed">{room.coreQuestion}</p>
                    </div>
                  </CardContent>
                </Card>

                <Collapsible open={methodExpanded} onOpenChange={setMethodExpanded}>
                  <Card variant="glass" className="relative">
                    <CardHeader className="relative z-10">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-warmth rounded-xl shadow-lg">
                              <Target className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold group-hover:text-accent transition-colors">{t('roomDetail.fullMethodology')}</CardTitle>
                          </div>
                          <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${methodExpanded ? 'rotate-180 text-accent' : 'text-muted-foreground'}`} />
                        </div>
                      </CollapsibleTrigger>
                      {!methodExpanded && (
                        <CardDescription className="text-sm ml-16">
                          {t('roomDetail.detailedGuide')}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="relative z-10">
                        <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border">
                          <p className="text-base leading-relaxed whitespace-pre-line">{room.method}</p>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                <Collapsible open={examplesExpanded} onOpenChange={setExamplesExpanded}>
                  <Card variant="glass" className="relative">
                    <CardHeader className="relative z-10">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-ocean rounded-xl shadow-lg">
                              <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold group-hover:text-secondary transition-colors">{t('roomDetail.examples')}</CardTitle>
                          </div>
                          <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${examplesExpanded ? 'rotate-180 text-secondary' : 'text-muted-foreground'}`} />
                        </div>
                      </CollapsibleTrigger>
                      {!examplesExpanded && (
                        <CardDescription className="text-sm ml-16">
                          {t('roomDetail.examplesDesc')}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="relative z-10">
                        <ul className="space-y-3">
                          {room.examples.map((example, index) => (
                            <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-md">
                              <span className="text-secondary text-2xl font-bold shrink-0">→</span>
                              <span className="text-sm leading-relaxed">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {room.id === "sr" && (
                  <RoomLibrary roomId="sr">
                    <StoryLibrary />
                  </RoomLibrary>
                )}

                {room.id === "tr" && (
                  <WordPictureTranslator />
                )}


                {room.id === "st" && (
                  <RoomLibrary roomId="st">
                    <SymbolLibrary />
                  </RoomLibrary>
                )}

                {room.id === "qa" && (
                  <RoomLibrary roomId="qa">
                    <QALibrary />
                  </RoomLibrary>
                )}

                {room.id === "24fps" && (
                  <>
                    <RoomLibrary roomId="24fps">
                      <Bible24FPSBrowser />
                    </RoomLibrary>

                    <ImageBibleBrowser />

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">📖</span>
                          {t('roomDetail.exodusTitle')}
                        </CardTitle>
                        <CardDescription>
                          {t('roomDetail.exodusDesc')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Exodus24FPSDrill />
                      </CardContent>
                    </Card>
                  </>
                )}

                {room.id === "gr" && (
                  <RoomLibrary roomId="gr">
                    <div className="space-y-6">
                      <GemsLibrary />
                      <GemGenerator
                        floorNumber={floor.number}
                        roomId={room.id}
                        onGemSaved={() => {
                          const event = new CustomEvent('gems-updated');
                          window.dispatchEvent(event);
                        }}
                      />
                      <UserGemsList floorNumber={floor.number} roomId={room.id} />
                      <SermonTitlesList />
                    </div>
                  </RoomLibrary>
                )}

                {room.id === "nf" && (
                  <RoomLibrary roomId="nf">
                    <NatureFreestyleLibrary />
                  </RoomLibrary>
                )}

                {room.id === "hf" && (
                  <RoomLibrary roomId="hf">
                    <HistoricalFreestyleLibrary />
                  </RoomLibrary>
                )}

                {["nf", "pf", "hf", "lr"].includes(room.id) && (
                  <FreestyleGame roomId={room.id} roomName={room.name} />
                )}

                {room.id === "bf" && (
                  <BibleFreestyleGame roomId={room.id} roomName={room.name} />
                )}

                {room.id === "cec" && (
                  <RoomLibrary roomId="cec">
                    <ChristChapterFindings />
                  </RoomLibrary>
                )}

                {room.id === "srm" && (
                  <SpeedRoomDrill onComplete={(score) => {
                    toast.success(`Speed Drill complete! Average: ${score}/100`);
                  }} />
                )}

                {room.id === "math" && (
                  <RoomLibrary roomId="math">
                    <MathematicsRoomDrill onComplete={(score) => {
                      toast.success(`Mathematics Drill complete! Average: ${score}/100`);
                    }} />
                  </RoomLibrary>
                )}

                {room.id === "jr" && (
                  <JuiceRoomDrill />
                )}

                {room.id === "cycles" && (
                  <RoomLibrary roomId="cycles">
                    <CyclesRoomDrill />
                  </RoomLibrary>
                )}

                {room.id === "123h" && (
                  <RoomLibrary roomId="123h">
                    <ThreeHeavensLibrary />
                  </RoomLibrary>
                )}

                {room.id === "p||" && (
                  <RoomLibrary roomId="p||">
                    <ParallelsLibrary />
                  </RoomLibrary>
                )}

                {room.id === "fe" && (
                  <RoomLibrary roomId="fe">
                    <FeastsLibrary />
                  </RoomLibrary>
                )}

                {room.id === "bl" && (
                  <RoomLibrary roomId="bl">
                    <SanctuaryLibrary />
                  </RoomLibrary>
                )}

                {room.id === "pr" && (
                  <RoomLibrary roomId="pr">
                    <ProphecyLibrary />
                  </RoomLibrary>
                )}

                {room.id === "trm" && (
                  <RoomLibrary roomId="trm">
                    <ThemesLibrary />
                  </RoomLibrary>
                )}

                {room.id === "prm" && (
                  <RoomLibrary roomId="prm">
                    <PatternsLibrary />
                  </RoomLibrary>
                )}

                {room.id === "r66" && (
                  <RoomLibrary roomId="r66">
                    <Room66Library />
                  </RoomLibrary>
                )}

                {room.id === "math" && (
                  <RoomLibrary roomId="math">
                    <MathematicsLibrary />
                  </RoomLibrary>
                )}

                {room.id === "dc" && (
                  <DefComRoomDrill />
                )}

                {room.id === "cr" && (
                  <ConcentrationRoomDrill />
                )}

                {/* Practice Tools - linked platform features */}
                <Separator className="my-6" />
                <RoomPracticeTools roomId={room.id} />
              </TabsContent>

              <TabsContent value="games" className="space-y-6 mt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">{t('roomDetail.roomGames', { roomName: room.name })}</h2>
                  <p className="text-muted-foreground">
                    {t('roomDetail.roomGamesDesc', { roomName: room.name })}
                  </p>
                </div>

                <RoomGames roomId={room.id} roomName={room.name} />

                {["nf", "pf", "hf", "lr"].includes(room.id) && (
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {t('roomDetail.freestyleChallenge')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.freestyleDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FreestyleGame roomId={room.id} roomName={room.name} />
                    </CardContent>
                  </Card>
                )}

                {room.id === "bf" && (
                  <VerseGeneticsArena roomId={room.id} roomName={room.name} />
                )}

                {room.id === "srm" && (
                  <Card className="border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {t('roomDetail.speedDrill')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.speedDrillDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SpeedRoomDrill />
                    </CardContent>
                  </Card>
                )}

                {room.id === "math" && (
                  <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-indigo-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {t('roomDetail.timeProphecy')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.timeProphecyDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MathematicsRoomDrill />
                    </CardContent>
                  </Card>
                )}

                {room.id === "jr" && (
                  <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {t('roomDetail.juiceExtraction')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.juiceExtractionDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <JuiceRoomDrill />
                    </CardContent>
                  </Card>
                )}

                {room.id === "cycles" && (
                  <Card className="border-2 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {t('roomDetail.covenantCycle')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.covenantCycleDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CyclesRoomDrill />
                    </CardContent>
                  </Card>
                )}

                {room.id === "cr" && (
                  <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {t('roomDetail.findChrist')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.findChristDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ConcentrationRoomDrill />
                    </CardContent>
                  </Card>
                )}

                {room.id === "123h" && (
                  <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {t('roomDetail.propheticHorizon')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.propheticHorizonDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ThreeHeavensRoomDrill />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="practice" className="space-y-6 mt-6">
                <div className="text-center mb-6 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-2">{t('roomDetail.personalPractice')}</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('roomDetail.personalPracticeDesc', { roomName: room.name })}
                  </p>
                </div>

                <RoomPracticeSpace
                  floorNumber={floor.number}
                  roomId={room.id}
                  roomName={room.name}
                  roomPrinciple={room.purpose}
                />
              </TabsContent>

              <TabsContent value="master" className="space-y-6 mt-6">
                {mastery && (mastery.xp_current > 0 || mastery.mastery_level > 1) && (
                  <MasteryProgramEnrollment
                    roomName={room.name}
                    roomTag={room.tag}
                    floorNumber={floor.number}
                    totalActivities={curriculum?.activities?.length || 0}
                    completedActivities={((curriculumProgress?.completed_activities as string[]) || []).length}
                    masteryLevel={mastery?.mastery_level || 1}
                    onBeginMastery={() => {
                      const trainingSection = document.getElementById('training-dashboard');
                      trainingSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    isEnrolled={true}
                  />
                )}

                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      {t('roomDetail.understandingMastery')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {t('roomDetail.masteryTransforms')}
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">{t('roomDetail.fiveLevels')}</h4>

                      <div className="space-y-2">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-500/10 border-2 border-slate-500/30 hover:border-slate-500/50 transition-all hover:shadow-lg">
                          <div className="text-2xl">⚪</div>
                          <div className="flex-1">
                            <div className="font-bold text-base">{t('roomDetail.level1Title')}</div>
                            <div className="text-sm text-muted-foreground">{t('roomDetail.level1Desc')}</div>
                            <div className="text-sm font-bold mt-2 text-slate-600">{t('roomDetail.level1XP')}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all hover:shadow-lg">
                          <div className="text-2xl">🔵</div>
                          <div className="flex-1">
                            <div className="font-bold text-base">{t('roomDetail.level2Title')}</div>
                            <div className="text-sm text-muted-foreground">{t('roomDetail.level2Desc')}</div>
                            <div className="text-sm font-bold mt-2 text-blue-600">{t('roomDetail.level2XP')}</div>
                          </div>
                        </div>


                        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all hover:shadow-lg">
                          <div className="text-2xl">🟣</div>
                          <div className="flex-1">
                            <div className="font-bold text-base">{t('roomDetail.level3Title')}</div>
                            <div className="text-sm text-muted-foreground">{t('roomDetail.level3Desc')}</div>
                            <div className="text-sm font-bold mt-2 text-purple-600">{t('roomDetail.level3XP')}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 hover:border-amber-500/60 transition-all hover:shadow-glow">
                          <div className="text-2xl">🟡</div>
                          <div className="flex-1">
                            <div className="font-bold text-base">{t('roomDetail.level4Title')}</div>
                            <div className="text-sm text-muted-foreground">{t('roomDetail.level4Desc')}</div>
                            <div className="text-sm font-bold mt-2 text-amber-600">{t('roomDetail.level4XP')}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-300/20 to-amber-500/20 border-2 border-amber-400/50 hover:border-amber-400/70 transition-all hover:shadow-mega-glow animate-pulse-glow">
                          <div className="text-3xl animate-pulse">✨</div>
                          <div className="flex-1">
                            <div className="font-black text-lg bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">{t('roomDetail.level5Title')}</div>
                            <div className="text-sm text-muted-foreground font-medium">{t('roomDetail.level5Desc')}</div>
                            <div className="text-sm font-black mt-2 bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">{t('roomDetail.maxLevel')}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">{t('roomDetail.globalTitles')}</h4>
                      <p className="text-xs text-muted-foreground">
                        {t('roomDetail.globalTitlesDesc')}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border-2 border-blue-500/30 hover:shadow-glow transition-all">
                          <div className="text-2xl">🔵</div>
                          <div className="flex-1">
                            <div className="font-bold text-base text-blue-600">{t('roomDetail.blueMaster')}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>{t('roomDetail.blueMasterReq')}</strong><br />
                              <strong>{t('roomDetail.blueMasterReward')}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border-2 border-red-500/30 hover:shadow-glow transition-all">
                          <div className="text-2xl">🔴</div>
                          <div className="flex-1">
                            <div className="font-bold text-base text-red-600">{t('roomDetail.redMaster')}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>{t('roomDetail.redMasterReq')}</strong><br />
                              <strong>{t('roomDetail.redMasterReward')}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/30 hover:shadow-glow transition-all">
                          <div className="text-2xl">🟡</div>
                          <div className="flex-1">
                            <div className="font-bold text-base text-yellow-600">{t('roomDetail.goldMaster')}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>{t('roomDetail.goldMasterReq')}</strong><br />
                              <strong>{t('roomDetail.goldMasterReward')}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border-2 border-purple-500/30 hover:shadow-glow transition-all">
                          <div className="text-2xl">🟣</div>
                          <div className="flex-1">
                            <div className="font-bold text-base text-purple-600">{t('roomDetail.purpleMaster')}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>{t('roomDetail.purpleMasterReq')}</strong><br />
                              <strong>{t('roomDetail.purpleMasterReward')}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:shadow-glow transition-all">
                          <div className="text-2xl">⚪</div>
                          <div className="flex-1">
                            <div className="font-bold text-base">{t('roomDetail.whiteMaster')}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>{t('roomDetail.whiteMasterReq')}</strong><br />
                              <strong>{t('roomDetail.whiteMasterReward')}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-700 hover:shadow-mega-glow transition-all">
                          <div className="text-3xl animate-pulse">⚫</div>
                          <div className="flex-1">
                            <div className="font-black text-lg text-white">{t('roomDetail.blackMasterFull')}</div>
                            <div className="text-xs text-gray-300 mt-1 italic">{t('roomDetail.blackMasterDesc')}</div>
                            <div className="text-xs text-gray-200 mt-2 space-y-1">
                              <div><strong>{t('roomDetail.finalRequirements')}</strong></div>
                              <ul className="list-disc list-inside space-y-0.5 ml-2">
                                <li>{t('roomDetail.blackReq1')}</li>
                                <li>{t('roomDetail.blackReq2')}</li>
                                <li>{t('roomDetail.blackReq3')}</li>
                                <li>{t('roomDetail.blackReq4')}</li>
                                <li>{t('roomDetail.blackReq5')}</li>
                                <li>{t('roomDetail.blackReq6')}</li>
                              </ul>
                              <div className="mt-2"><strong>{t('roomDetail.rewards')}</strong></div>
                              <ul className="list-disc list-inside space-y-0.5 ml-2">
                                <li>{t('roomDetail.blackReward1')}</li>
                                <li>{t('roomDetail.blackReward2')}</li>
                                <li>{t('roomDetail.blackReward3')}</li>
                                <li>{t('roomDetail.blackReward4')}</li>
                                <li>{t('roomDetail.blackReward5')}</li>
                                <li>{t('roomDetail.blackReward6')}</li>
                              </ul>
                              <div className="mt-2 text-amber-300 font-semibold">
                                {t('roomDetail.blackMasterElite')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">{t('roomDetail.howToEarnXP')}</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{t('roomDetail.drillXP')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{t('roomDetail.exerciseXP')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span>{t('roomDetail.perfectXP')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span>{t('roomDetail.speedXP')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      {t('roomDetail.proTip')}
                    </div>
                  </CardContent>
                </Card>

                {(!mastery || (mastery.mastery_level === 1 && mastery.xp_current === 0)) && (
                  <JeevesMasterProgram
                    roomName={room.name}
                    roomPrinciple={room.purpose}
                    onStartProgram={() => {
                      setActiveTab("practice");
                      setTimeout(() => {
                        const trainingSection = document.getElementById('training-dashboard');
                        trainingSection?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  />
                )}

                {mastery && (mastery.mastery_level > 1 || mastery.xp_current > 0) && (
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        {t('roomDetail.masteryProgress')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.trackJourney')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <MasteryBadge level={mastery.mastery_level} size="lg" />
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {mastery.total_drills_completed + mastery.total_exercises_completed}
                          </div>
                          <div className="text-sm text-muted-foreground">{t('roomDetail.totalActivities')}</div>
                        </div>
                      </div>

                      <XpProgressBar
                        currentXp={mastery.xp_current}
                        xpRequired={mastery.xp_required}
                        level={mastery.mastery_level}
                        className="mt-4"
                      />

                      <Separator />

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {mastery.total_drills_completed}
                          </div>
                          <div className="text-xs text-muted-foreground">{t('roomDetail.drills')}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-accent">
                            {mastery.total_exercises_completed}
                          </div>
                          <div className="text-xs text-muted-foreground">{t('roomDetail.exercises')}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-amber-500">
                            {mastery.perfect_scores_count}
                          </div>
                          <div className="text-xs text-muted-foreground">{t('roomDetail.perfect')}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {mastery && !(mastery.mastery_level === 1 && mastery.xp_current === 0) && !showMilestoneTest && (
                  <ContinueTraining
                    nextActivity={nextActivity}
                    roomName={room.name}
                    onContinue={() => {
                      if (nextActivity?.type === "milestone_test") {
                        const testLevel = curriculum.milestoneTests.find(
                          (t) => t.activityId === nextActivity.id
                        )?.level;
                        if (testLevel) {
                          setCurrentTestLevel(testLevel);
                          setShowMilestoneTest(true);
                        }
                      } else {
                        const practiceTab = document.querySelector('[value="practice"]') as HTMLElement;
                        practiceTab?.click();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  />
                )}

                {showMilestoneTest && currentTestLevel && (
                  <MilestoneTest
                    level={currentTestLevel}
                    activityId={nextActivity?.id || ""}
                    roomName={room.name}
                    onPass={(activityId) => {
                      passMilestoneTest({ testLevel: currentTestLevel, activityId });
                      setShowMilestoneTest(false);
                      setCurrentTestLevel(null);
                    }}
                    onCancel={() => {
                      setShowMilestoneTest(false);
                      setCurrentTestLevel(null);
                    }}
                  />
                )}

                {mastery && !(mastery.mastery_level === 1 && mastery.xp_current === 0) && !showMilestoneTest && (
                  <div id="training-dashboard">
                    <TrainingDashboard
                      roomName={room.name}
                      curriculum={curriculum}
                      completedActivities={(curriculumProgress?.completed_activities as string[]) || []}
                      currentLevel={mastery.mastery_level}
                      onActivityClick={(activity) => {
                        if (activity.type === "milestone_test") {
                          const testLevel = curriculum.milestoneTests.find(
                            (t) => t.activityId === activity.id
                          )?.level;
                          if (testLevel) {
                            setCurrentTestLevel(testLevel);
                            setShowMilestoneTest(true);
                          }
                        } else {
                          const practiceTab = document.querySelector('[value="practice"]') as HTMLElement;
                          practiceTab?.click();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                    />
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      {t('roomDetail.focusRoom')}
                    </CardTitle>
                    <CardDescription>
                      {isThisFocused
                        ? t('roomDetail.focusRoomDesc')
                        : focusedRoom?.focused_room_id
                        ? t('roomDetail.currentFocusOther')
                        : t('roomDetail.setFocusDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleSetFocus}
                      disabled={isSettingFocus}
                      variant={isThisFocused ? "outline" : "default"}
                      className="w-full"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      {isThisFocused ? t('roomDetail.clearFocus') : t('roomDetail.setAsFocus')}
                    </Button>
                  </CardContent>
                </Card>

                {hasDrills && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-accent" />
                        {t('roomDetail.quickPracticeDrill')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.testMastery', { drillName })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => setShowDrill(!showDrill)}
                        variant={showDrill ? "secondary" : "default"}
                        className="w-full mb-4"
                      >
                        {showDrill ? t('roomDetail.hideDrill') : t('roomDetail.startPractice')}
                      </Button>

                      {showDrill && (
                        <PracticeDrill
                          floorNumber={floor.number}
                          roomId={room.id}
                          roomName={room.name}
                          drillType={drillName}
                          questions={drillQuestions}
                          curriculumActivityId={nextActivity?.id}
                          onCurriculumComplete={(activityId, xpEarned) =>
                            completeActivity({ activityId, xpEarned })
                          }
                          pathActivityId={pathActivityId}
                        />
                      )}
                    </CardContent>
                  </Card>
                )}

                {mentorModeUnlocked && mastery && (
                  <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        {t('roomDetail.mentorUnlocked')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.mentorDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RoomMentorChat
                        roomId={room.id}
                        roomName={room.name}
                        masteryLevel={mastery.mastery_level}
                      />
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {t('roomDetail.masteryReportCard')}
                    </CardTitle>
                    <CardDescription>
                      {t('roomDetail.reportCardDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReportCardDisplay
                      roomId={room.id}
                      roomName={room.name}
                      currentLevel={mastery?.mastery_level || 1}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            {isUnlocked ? (
              <div className="space-y-4">
                {room.id === "infinity" && (
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle>{t('roomDetail.roomCodeReference')}</CardTitle>
                      </div>
                      <CardDescription>
                        {t('roomDetail.quickReference')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">{t('roomDetail.floor1Name')}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">SR</Badge>{t('roomDetail.storyRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">IR</Badge>{t('roomDetail.imaginationRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">24</Badge>{t('roomDetail.twentyFourFPSRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">BR</Badge>{t('roomDetail.bibleRendered')}</div>
                            <div><Badge variant="outline" className="mr-2">TR</Badge>{t('roomDetail.translationRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">GR</Badge>{t('roomDetail.gemsRoom')}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">{t('roomDetail.floor2Name')}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">OR</Badge>{t('roomDetail.observationRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">DC</Badge>{t('roomDetail.defComRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">ST</Badge>{t('roomDetail.symbolsTypesRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">QR</Badge>{t('roomDetail.questionsRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">QA</Badge>{t('roomDetail.qaChains')}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">{t('roomDetail.floor3Name')}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">NF</Badge>{t('roomDetail.natureFreestyle')}</div>
                            <div><Badge variant="outline" className="mr-2">PF</Badge>{t('roomDetail.personalFreestyle')}</div>
                            <div><Badge variant="outline" className="mr-2">BF</Badge>{t('roomDetail.bibleFreestyle')}</div>
                            <div><Badge variant="outline" className="mr-2">HF</Badge>{t('roomDetail.historyFreestyle')}</div>
                            <div><Badge variant="outline" className="mr-2">LR</Badge>{t('roomDetail.listeningRoom')}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">{t('roomDetail.floor4Name')}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">CR</Badge>{t('roomDetail.concentrationRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">DR</Badge>{t('roomDetail.dimensionsRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">C6</Badge>{t('roomDetail.connect6')}</div>
                            <div><Badge variant="outline" className="mr-2">TRm</Badge>{t('roomDetail.themeRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">TZ</Badge>{t('roomDetail.timeZoneRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">PRm</Badge>{t('roomDetail.patternsRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">P‖</Badge>{t('roomDetail.parallelsRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">FRt</Badge>{t('roomDetail.fruitRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">CEC</Badge>{t('roomDetail.christInEveryChapter')}</div>
                            <div><Badge variant="outline" className="mr-2">R66</Badge>{t('roomDetail.room66')}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">{t('roomDetail.floor5Name')}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">BL</Badge>{t('roomDetail.blueRoomSanctuary')}</div>
                            <div><Badge variant="outline" className="mr-2">PR</Badge>{t('roomDetail.prophecyRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">3A</Badge>{t('roomDetail.threeAngelsRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">FE</Badge>{t('roomDetail.feastsRoom')}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">{t('roomDetail.floor6Name')}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">@Ad</Badge>{t('roomDetail.adamicCycle')}</div>
                            <div><Badge variant="outline" className="mr-2">@No</Badge>{t('roomDetail.noahicCycle')}</div>
                            <div><Badge variant="outline" className="mr-2">@Ab</Badge>{t('roomDetail.abrahamicCycle')}</div>
                            <div><Badge variant="outline" className="mr-2">@Mo</Badge>{t('roomDetail.mosaicCycle')}</div>
                            <div><Badge variant="outline" className="mr-2">@Cy</Badge>{t('roomDetail.cyrusickCycle')}</div>
                            <div><Badge variant="outline" className="mr-2">@CyC</Badge>{t('roomDetail.cyrusChristCycle')}</div>
                            <div><Badge variant="outline" className="mr-2">@Sp</Badge>{t('roomDetail.holySpiritCycle')}</div>
                            <div><Badge variant="outline" className="mr-2">@Re</Badge>{t('roomDetail.remnantCycle')}</div>
                            <div><Badge variant="outline" className="mr-2">1H</Badge>{t('roomDetail.firstHeaven')}</div>
                            <div><Badge variant="outline" className="mr-2">2H</Badge>{t('roomDetail.secondHeaven')}</div>
                            <div><Badge variant="outline" className="mr-2">3H</Badge>{t('roomDetail.thirdHeaven')}</div>
                            <div><Badge variant="outline" className="mr-2">JR</Badge>{t('roomDetail.juiceRoom')}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">{t('roomDetail.floor7Name')}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">FRm</Badge>{t('roomDetail.fireRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">MR</Badge>{t('roomDetail.meditationRoom')}</div>
                            <div><Badge variant="outline" className="mr-2">SRm</Badge>{t('roomDetail.speedRoom')}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <CardTitle>{t('roomDetail.pitfalls')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {room.pitfalls.map((pitfall, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <CardTitle>{t('roomDetail.deliverable')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium mb-4">{room.deliverable}</p>
                    {user && !progress?.completed_at && (
                      <Button
                        onClick={markRoomComplete}
                        disabled={progressLoading}
                        className="w-full"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t('roomDetail.markComplete')}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {user && progress && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('roomDetail.yourProgress')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('roomDetail.exercisesCompleted')}</span>
                        <span className="font-medium">{progress.exercises_completed.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('roomDetail.drillAttempts')}</span>
                        <span className="font-medium">{progress.drill_attempts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('roomDetail.bestScore')}</span>
                        <span className="font-medium">{progress.best_drill_score}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {mastery && (
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        {t('roomDetail.roomMastery')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <MasteryBadge level={mastery.mastery_level} />
                        <span className="text-sm text-muted-foreground">
                          {t('roomDetail.activitiesCount', { count: mastery.total_drills_completed + mastery.total_exercises_completed })}
                        </span>
                      </div>
                      <XpProgressBar
                        currentXp={mastery.xp_current}
                        xpRequired={mastery.xp_required}
                        level={mastery.mastery_level}
                      />
                    </CardContent>
                  </Card>
                )}

                {mentorModeUnlocked && mastery && (
                  <RoomMentorChat
                    roomId={room.id}
                    roomName={room.name}
                    masteryLevel={mastery.mastery_level}
                  />
                )}

                {hasDrills && (
                  <Card className="border-2 border-accent/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-accent" />
                        {t('roomDetail.practiceDrill')}
                      </CardTitle>
                      <CardDescription>
                        {t('roomDetail.testKnowledge', { drillName })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => setShowDrill(!showDrill)}
                        variant={showDrill ? "secondary" : "default"}
                        className="w-full"
                      >
                        {showDrill ? t('roomDetail.hideDrill') : t('roomDetail.startPractice')}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {showDrill && hasDrills ? (
                  <PracticeDrill
                    floorNumber={floor.number}
                    roomId={room.id}
                    roomName={room.name}
                    drillType={drillName}
                    questions={drillQuestions}
                  />
                ) : !mentorModeUnlocked && (
                  <JeevesAssistant
                    roomTag={room.tag}
                    roomName={room.name}
                    principle={room.purpose}
                    floorNumber={floor.number}
                    roomId={room.id}
                    onExerciseComplete={markExerciseComplete}
                  />
                )}
              </div>
            ) : (
              <Card className="opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    {t('roomDetail.roomLocked')}
                  </CardTitle>
                  <CardDescription>
                    {t('roomDetail.completePrerequisite')}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
