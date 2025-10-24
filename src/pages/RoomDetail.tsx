import { useParams, Link, useNavigate } from "react-router-dom";
import { palaceFloors } from "@/data/palaceData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, HelpCircle, BookOpen, AlertCircle, CheckCircle, Trophy, Lock, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { JeevesAssistant } from "@/components/JeevesAssistant";
import { useRoomProgress } from "@/hooks/useRoomProgress";
import { useAuth } from "@/hooks/useAuth";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { PracticeDrill } from "@/components/practice/PracticeDrill";
import { getDrillsByRoom, getDrillName } from "@/data/drillQuestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RoomDetail() {
  const { floorNumber, roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const floor = palaceFloors.find(f => f.number === Number(floorNumber));
  const room = floor?.rooms.find(r => r.id === roomId);
  const [showDrill, setShowDrill] = useState(false);
  
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

  const drillQuestions = room ? getDrillsByRoom(room.id) : [];
  const drillName = room ? getDrillName(room.id) : "Practice Drill";
  const hasDrills = drillQuestions.length > 0;

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
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <CardTitle>Core Question</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{room.coreQuestion}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Method</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>{room.method}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>Examples</CardTitle>
                </div>
              </CardHeader>
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
            </Card>

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
          </div>

          <div className="lg:col-span-1">
            {isUnlocked ? (
              <div className="space-y-4">
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
                    floorNumber={floor!.number}
                    roomId={room!.id}
                    roomName={room!.name}
                    drillType={drillName}
                    questions={drillQuestions}
                  />
                ) : (
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
