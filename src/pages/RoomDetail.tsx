import { useParams, Link, useNavigate } from "react-router-dom";
import { palaceFloors } from "@/data/palaceData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, HelpCircle, BookOpen, AlertCircle, CheckCircle, Trophy, Lock, Dumbbell, Brain, ChevronDown, Swords, Crown, FileText } from "lucide-react";
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
                {/* Mastery Overview */}
                {mastery && (
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
