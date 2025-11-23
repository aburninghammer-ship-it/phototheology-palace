import { useParams, Link, useNavigate } from "react-router-dom";
import { palaceFloors } from "@/data/palaceData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, HelpCircle, BookOpen, AlertCircle, CheckCircle, Trophy, Lock, Dumbbell, Brain, ChevronDown, Swords, Crown, FileText, Star, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { JeevesAssistant } from "@/components/JeevesAssistant";
import { useRoomProgress } from "@/hooks/useRoomProgress";
import { useAuth } from "@/hooks/useAuth";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { useMastery } from "@/hooks/useMastery";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { PracticeDrill } from "@/components/practice/PracticeDrill";
import { getDrillsByRoom, getDrillName } from "@/data/drillQuestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { genesisImages } from "@/assets/24fps/genesis";
import { UserGemsList } from "@/components/UserGemsList";
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
import { MasteryOnboarding } from "@/components/mastery/MasteryOnboarding";
import { TrainingDashboard } from "@/components/mastery/TrainingDashboard";
import { ContinueTraining } from "@/components/mastery/ContinueTraining";
import { MilestoneTest } from "@/components/mastery/MilestoneTest";
import { useRoomCurriculum } from "@/hooks/useRoomCurriculum";

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
  const { floorNumber, roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const floor = palaceFloors.find(f => f.number === Number(floorNumber));
  const room = floor?.rooms.find(r => r.id === roomId);
  const [showDrill, setShowDrill] = useState(false);
  const [methodExpanded, setMethodExpanded] = useState(false);
  const [examplesExpanded, setExamplesExpanded] = useState(false);
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(true);
  
  // Check if this is the first room visit after onboarding (Story Room)
  const isFirstRoomVisit = Number(floorNumber) === 1 && roomId === "sr" && 
    !localStorage.getItem("onboarding_guide_sr");
  
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

  // Redirect if room is locked
  useEffect(() => {
    if (!unlockLoading && !isUnlocked && user) {
      navigate(`/palace/floor/${floorNumber}`);
    }
  }, [isUnlocked, unlockLoading, user, navigate, floorNumber]);

  if (!floor || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Room Not Found</h1>
          <Link to="/palace">
            <Button>Return to Palace</Button>
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
      {/* Show onboarding guide for first room visit */}
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
            Back to Floor {floor.number}
          </Button>
        </Link>

        {!isUnlocked && !unlockLoading && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Room Locked:</strong> You must complete these rooms first:
              <ul className="list-disc list-inside mt-2">
                {missingPrerequisites.map((prereq, idx) => (
                  <li key={idx}>{prereq}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className={`${gradient} rounded-lg p-8 mb-8 text-white`}>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="text-white border-white/50">
              {room.tag}
            </Badge>
            <Badge variant="outline" className="text-white border-white/50">
              Floor {floor.number}
            </Badge>
            {isThisFocused && (
              <Badge variant="outline" className="text-white border-amber-500 bg-amber-500/20">
                <Target className="h-3 w-3 mr-1" />
                Focus Room
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">{room.name}</h1>
          <p className="text-lg leading-relaxed">{room.purpose}</p>
          
          {user && progress?.completed_at && (
            <div className="mt-4 flex items-center gap-2 text-white">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Room Completed!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="learn" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="learn">Learn</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="master">
                  <Trophy className="h-4 w-4 mr-2" />
                  Master Room
                </TabsTrigger>
              </TabsList>

              {/* LEARN TAB */}
              <TabsContent value="learn" className="space-y-6 mt-6">
                {showQuickStart && <ValueProposition roomId={room.id} />}
                {showQuickStart && <QuickStartGuide roomId={room.id} roomName={room.name} />}

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        <CardTitle>Core Question</CardTitle>
                      </div>
                      {user && (
                        <Button
                          onClick={handleAddToReview}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Brain className="h-4 w-4" />
                          Add to Review
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium">{room.coreQuestion}</p>
                  </CardContent>
                </Card>

                <Collapsible open={methodExpanded} onOpenChange={setMethodExpanded}>
                  <Card>
                    <CardHeader>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            <CardTitle>Full Methodology</CardTitle>
                          </div>
                          <ChevronDown className={`h-5 w-5 transition-transform ${methodExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </CollapsibleTrigger>
                      {!methodExpanded && (
                        <CardDescription className="text-sm">
                          Detailed step-by-step guide (click to expand when ready)
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent>
                        <p className="text-base leading-relaxed whitespace-pre-line">{room.method}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                <Collapsible open={examplesExpanded} onOpenChange={setExamplesExpanded}>
                  <Card>
                    <CardHeader>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <CardTitle>Additional Examples</CardTitle>
                          </div>
                          <ChevronDown className={`h-5 w-5 transition-transform ${examplesExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </CollapsibleTrigger>
                      {!examplesExpanded && (
                        <CardDescription className="text-sm">
                          More examples to explore (click to expand)
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent>
                        <ul className="space-y-2">
                          {room.examples.map((example, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {room.id === "24fps" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Visual Gallery: Genesis 1-24</CardTitle>
                      <CardDescription>
                        Complete set of 24FPS frames for the first 24 chapters of Genesis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="grid" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="grid">Gallery View</TabsTrigger>
                          <TabsTrigger value="list">Chapter List</TabsTrigger>
                        </TabsList>
                        <TabsContent value="grid" className="mt-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {genesisImages.map((image, index) => {
                              const chapter = index + 1;
                              return (
                                <div key={chapter} className="relative group">
                                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                                    <img
                                      src={image}
                                      alt={`Genesis Chapter ${chapter}`}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">Ch. {chapter}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>
                        <TabsContent value="list" className="mt-4">
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {genesisImages.map((image, index) => {
                              const chapter = index + 1;
                              return (
                                <div key={chapter} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent transition-colors">
                                  <img
                                    src={image}
                                    alt={`Genesis Chapter ${chapter}`}
                                    className="w-16 h-16 object-cover rounded border"
                                    loading="lazy"
                                  />
                                  <span className="font-medium">Genesis Chapter {chapter}</span>
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}

                {room.id === "gr" && (
                  <>
                    <UserGemsList floorNumber={floor.number} roomId={room.id} />
                    <SermonTitlesList />
                  </>
                )}

                {room.id === "cec" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Christ-in-Every-Chapter Findings</CardTitle>
                      <CardDescription>
                        Record Christ's presence in each chapter: His name, His action, and NT crosslinks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChristChapterFindings />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* PRACTICE TAB */}
              <TabsContent value="practice" className="space-y-6 mt-6">
                <RoomPracticeSpace
                  floorNumber={floor.number}
                  roomId={room.id}
                  roomName={room.name}
                  roomPrinciple={room.purpose}
                />
              </TabsContent>

              {/* MASTER THIS ROOM TAB */}
              <TabsContent value="master" className="space-y-6 mt-6">
                {/* Mastery System Explanation */}
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Understanding Room Mastery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Mastery transforms casual Bible study into permanent understanding. By mastering a room, you build neural pathways that make Scripture stick—not just today, but for life.
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">The Five Mastery Levels:</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-500/10 border border-slate-500/20">
                          <Star className="h-4 w-4 text-slate-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">Level 1: Novice <span className="text-slate-500">(Gray Badge)</span></div>
                            <div className="text-xs text-muted-foreground">Starting point. Begin exploring the room's principles.</div>
                            <div className="text-xs font-semibold mt-1">→ Reach 100 XP to advance</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <Award className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">Level 2: Apprentice <span className="text-blue-500">(Blue Badge)</span></div>
                            <div className="text-xs text-muted-foreground">Building familiarity. You're making connections.</div>
                            <div className="text-xs font-semibold mt-1">→ Reach 250 XP to advance</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <Trophy className="h-4 w-4 text-purple-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">Level 3: Practitioner <span className="text-purple-500">(Purple Badge)</span></div>
                            <div className="text-xs text-muted-foreground">Confident application. You can teach this room's principles.</div>
                            <div className="text-xs font-semibold mt-1">→ Reach 500 XP to advance</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                          <Crown className="h-4 w-4 text-amber-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">Level 4: Expert <span className="text-amber-500">(Gold Badge)</span></div>
                            <div className="text-xs text-muted-foreground">Deep understanding. Mentor Mode unlocked for personalized AI guidance.</div>
                            <div className="text-xs font-semibold mt-1">→ Reach 1,000 XP to advance</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-300/20 border border-amber-500/30">
                          <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 animate-pulse" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">Level 5: Master <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">(Golden Badge)</span></div>
                            <div className="text-xs text-muted-foreground">Complete mastery. This room's patterns are permanently encoded in your mind.</div>
                            <div className="text-xs font-semibold mt-1 text-amber-600">✨ Maximum Level Reached</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Mastering Multiple Rooms: Global Master Titles</h4>
                      <p className="text-xs text-muted-foreground">
                        As you master multiple rooms, you gain global ranks that represent your depth of understanding across the Palace.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <div className="h-4 w-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-blue-600">BLUE MASTER — 1–3 Rooms Mastered</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>Requirements:</strong> None beyond room mastery<br />
                              <strong>Reward:</strong> Blue Master title
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="h-4 w-4 rounded-full bg-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-red-600">RED MASTER — 4–9 Rooms Mastered</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>Requirements:</strong> 7-day global streak<br />
                              <strong>Reward:</strong> Red Master title + Red Challenges
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <div className="h-4 w-4 rounded-full bg-yellow-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-yellow-600">GOLD MASTER — 10–18 Rooms Mastered</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>Requirements:</strong> 14-day global streak<br />
                              <strong>Reward:</strong> Gold Master title + advanced chain tools
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <div className="h-4 w-4 rounded-full bg-purple-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-purple-600">PURPLE MASTER — 19–27 Rooms Mastered</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>Requirements:</strong> 21-day global streak<br />
                              <strong>Reward:</strong> Purple Master title + create-your-own drills
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                          <div className="h-4 w-4 rounded-full bg-white border-2 border-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">WHITE MASTER — 28–37 Rooms Mastered</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              <strong>Requirements:</strong> 30-day global streak<br />
                              <strong>Reward:</strong> White Master title + Temple Mode + prophecy maps
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 border-2 border-gray-800">
                          <div className="h-4 w-4 rounded-full bg-black border-2 border-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-white">⚫ BLACK MASTER — 38 ROOMS MASTERED</div>
                            <div className="text-xs text-gray-300 mt-1 italic">The Phototheology equivalent of a spiritual black belt.</div>
                            <div className="text-xs text-gray-200 mt-2 space-y-1">
                              <div><strong>Final Requirements:</strong></div>
                              <ul className="list-disc list-inside space-y-0.5 ml-2">
                                <li>38 rooms mastered at Level 5</li>
                                <li>Final Master Exam</li>
                                <li>12-verse chain creation</li>
                                <li>Teach-the-Palace test</li>
                                <li>3 prophetic integration exercises</li>
                                <li>60-day global streak</li>
                              </ul>
                              <div className="mt-2"><strong>Rewards:</strong></div>
                              <ul className="list-disc list-inside space-y-0.5 ml-2">
                                <li>Black Master Title</li>
                                <li>Black Palace Mode</li>
                                <li>Shadow Chains (advanced mode)</li>
                                <li>Prophetic Lattice Engine</li>
                                <li>Mentor privileges in the app</li>
                                <li>Access to the 8th-floor Revelation Chamber</li>
                              </ul>
                              <div className="mt-2 text-amber-300 font-semibold">
                                Only the most disciplined, consistent, and skilled users will ever reach this tier.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">How to Earn XP:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>Complete drills: <strong>25 XP</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>Finish exercises: <strong>15 XP</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span>Perfect score: <strong>+50 XP</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span>Speed bonus: <strong>+10 XP</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      <strong>Pro tip:</strong> Mastering a room contributes to your Global Palace Title. Master more rooms to unlock higher titles and recognition in the community.
                    </div>
                  </CardContent>
                </Card>

                {/* Show Onboarding for Novices (Level 1 with 0 XP) */}
                {mastery && mastery.mastery_level === 1 && mastery.xp_current === 0 && (
                  <MasteryOnboarding 
                    roomName={room.name}
                    onStartPractice={() => {
                      // Switch to practice tab
                      const practiceTab = document.querySelector('[value="practice"]') as HTMLElement;
                      practiceTab?.click();
                      // Scroll to top
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {/* Mastery Overview - Show for users who have started */}
                {mastery && !(mastery.mastery_level === 1 && mastery.xp_current === 0) && (
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Your Mastery Progress
                      </CardTitle>
                      <CardDescription>
                        Track your journey to mastering this room
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <MasteryBadge level={mastery.mastery_level} size="lg" />
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {mastery.total_drills_completed + mastery.total_exercises_completed}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Activities</div>
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
                          <div className="text-xs text-muted-foreground">Drills</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-accent">
                            {mastery.total_exercises_completed}
                          </div>
                          <div className="text-xs text-muted-foreground">Exercises</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-amber-500">
                            {mastery.perfect_scores_count}
                          </div>
                          <div className="text-xs text-muted-foreground">Perfect</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Continue Training - Show next activity */}
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
                        // Switch to practice tab
                        const practiceTab = document.querySelector('[value="practice"]') as HTMLElement;
                        practiceTab?.click();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  />
                )}

                {/* Milestone Test View */}
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

                {/* Training Dashboard - Full activity list */}
                {mastery && !(mastery.mastery_level === 1 && mastery.xp_current === 0) && !showMilestoneTest && (
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
                        // Switch to practice tab for other activities
                        const practiceTab = document.querySelector('[value="practice"]') as HTMLElement;
                        practiceTab?.click();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  />
                )}

                {/* Focus Room Control */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Focus Room
                    </CardTitle>
                    <CardDescription>
                      {isThisFocused 
                        ? "This is your current focus room. Work on this until you master it!" 
                        : focusedRoom?.focused_room_id 
                        ? "You're currently focused on another room. Want to switch focus here?" 
                        : "Set this as your focus room to track your primary mastery goal"}
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
                      {isThisFocused ? "Clear Focus" : "Set as Focus Room"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Practice Section */}
                {hasDrills && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-accent" />
                        Quick Practice Drill
                      </CardTitle>
                      <CardDescription>
                        Test your mastery with {drillName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => setShowDrill(!showDrill)}
                        variant={showDrill ? "secondary" : "default"}
                        className="w-full mb-4"
                      >
                        {showDrill ? "Hide Drill" : "Start Practice"}
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
                        />
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Mentor Mode - Unlocked at Expert (Level 4+) */}
                {mentorModeUnlocked && mastery && (
                  <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        Mentor Mode Unlocked!
                      </CardTitle>
                      <CardDescription>
                        You've reached Expert level. Get personalized guidance from your AI mentor.
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

                {/* Report Card Link */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Mastery Report Card
                    </CardTitle>
                    <CardDescription>
                      View detailed analysis of your progress
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

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            {isUnlocked ? (
              <div className="space-y-4">
                {room.id === "infinity" && (
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle>Room Code Reference</CardTitle>
                      </div>
                      <CardDescription>
                        Quick reference for all Palace room abbreviations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">Floor 1 - Furnishing</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">SR</Badge>Story Room</div>
                            <div><Badge variant="outline" className="mr-2">IR</Badge>Imagination Room</div>
                            <div><Badge variant="outline" className="mr-2">24</Badge>24FPS Room</div>
                            <div><Badge variant="outline" className="mr-2">BR</Badge>Bible Rendered</div>
                            <div><Badge variant="outline" className="mr-2">TR</Badge>Translation Room</div>
                            <div><Badge variant="outline" className="mr-2">GR</Badge>Gems Room</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">Floor 2 - Investigation</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">OR</Badge>Observation Room</div>
                            <div><Badge variant="outline" className="mr-2">DC</Badge>Def-Com Room</div>
                            <div><Badge variant="outline" className="mr-2">ST</Badge>Symbols/Types Room</div>
                            <div><Badge variant="outline" className="mr-2">QR</Badge>Questions Room</div>
                            <div><Badge variant="outline" className="mr-2">QA</Badge>Q&A Chains</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">Floor 3 - Freestyle</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">NF</Badge>Nature Freestyle</div>
                            <div><Badge variant="outline" className="mr-2">PF</Badge>Personal Freestyle</div>
                            <div><Badge variant="outline" className="mr-2">BF</Badge>Bible Freestyle</div>
                            <div><Badge variant="outline" className="mr-2">HF</Badge>History Freestyle</div>
                            <div><Badge variant="outline" className="mr-2">LR</Badge>Listening Room</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">Floor 4 - Next Level</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">CR</Badge>Concentration Room</div>
                            <div><Badge variant="outline" className="mr-2">DR</Badge>Dimensions Room</div>
                            <div><Badge variant="outline" className="mr-2">C6</Badge>Connect 6</div>
                            <div><Badge variant="outline" className="mr-2">TRm</Badge>Theme Room</div>
                            <div><Badge variant="outline" className="mr-2">TZ</Badge>Time Zone Room</div>
                            <div><Badge variant="outline" className="mr-2">PRm</Badge>Patterns Room</div>
                            <div><Badge variant="outline" className="mr-2">P‖</Badge>Parallels Room</div>
                            <div><Badge variant="outline" className="mr-2">FRt</Badge>Fruit Room</div>
                            <div><Badge variant="outline" className="mr-2">CEC</Badge>Christ in Every Chapter</div>
                            <div><Badge variant="outline" className="mr-2">R66</Badge>Room 66</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">Floor 5 - Vision</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">BL</Badge>Blue Room (Sanctuary)</div>
                            <div><Badge variant="outline" className="mr-2">PR</Badge>Prophecy Room</div>
                            <div><Badge variant="outline" className="mr-2">3A</Badge>Three Angels' Room</div>
                            <div><Badge variant="outline" className="mr-2">FE</Badge>Feasts Room</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">Floor 6 - Three Heavens & Cycles</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">@Ad</Badge>Adamic Cycle</div>
                            <div><Badge variant="outline" className="mr-2">@No</Badge>Noahic Cycle</div>
                            <div><Badge variant="outline" className="mr-2">@Ab</Badge>Abrahamic Cycle</div>
                            <div><Badge variant="outline" className="mr-2">@Mo</Badge>Mosaic Cycle</div>
                            <div><Badge variant="outline" className="mr-2">@Cy</Badge>Cyrusic Cycle</div>
                            <div><Badge variant="outline" className="mr-2">@CyC</Badge>Cyrus-Christ Cycle</div>
                            <div><Badge variant="outline" className="mr-2">@Sp</Badge>Holy Spirit Cycle</div>
                            <div><Badge variant="outline" className="mr-2">@Re</Badge>Remnant Cycle</div>
                            <div><Badge variant="outline" className="mr-2">1H</Badge>First Heaven (DoL¹/NE¹)</div>
                            <div><Badge variant="outline" className="mr-2">2H</Badge>Second Heaven (DoL²/NE²)</div>
                            <div><Badge variant="outline" className="mr-2">3H</Badge>Third Heaven (DoL³/NE³)</div>
                            <div><Badge variant="outline" className="mr-2">JR</Badge>Juice Room</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-primary">Floor 7 - Spiritual & Emotional</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><Badge variant="outline" className="mr-2">FRm</Badge>Fire Room</div>
                            <div><Badge variant="outline" className="mr-2">MR</Badge>Meditation Room</div>
                            <div><Badge variant="outline" className="mr-2">SRm</Badge>Speed Room</div>
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
                      <CardTitle>Pitfalls to Avoid</CardTitle>
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
                      <CardTitle>Deliverable</CardTitle>
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
                        Mark Room Complete
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {user && progress && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exercises Completed:</span>
                        <span className="font-medium">{progress.exercises_completed.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Drill Attempts:</span>
                        <span className="font-medium">{progress.drill_attempts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Best Score:</span>
                        <span className="font-medium">{progress.best_drill_score}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mastery Progress Card Sidebar */}
                {mastery && (
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Room Mastery
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <MasteryBadge level={mastery.mastery_level} />
                        <span className="text-sm text-muted-foreground">
                          {mastery.total_drills_completed + mastery.total_exercises_completed} activities
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

                {/* Mentor Mode - Unlocked at Expert (Level 4+) */}
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
                        Practice Drill
                      </CardTitle>
                      <CardDescription>
                        Test your knowledge with {drillName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => setShowDrill(!showDrill)}
                        variant={showDrill ? "secondary" : "default"}
                        className="w-full"
                      >
                        {showDrill ? "Hide Drill" : "Start Practice"}
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
                    Room Locked
                  </CardTitle>
                  <CardDescription>
                    Complete the prerequisite rooms to unlock this content.
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
