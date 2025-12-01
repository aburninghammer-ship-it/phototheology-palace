import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Send, Loader2, Check, ChevronRight, Save, SkipForward, BookOpen, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DrillSession, DrillResponse } from "@/pages/DrillDrill";
import ReactMarkdown from "react-markdown";

interface DrillChatProps {
  session: DrillSession;
  setSession: React.Dispatch<React.SetStateAction<DrillSession | null>>;
  allRooms: any[];
  onSave: (name: string) => void;
}

export const DrillChat = ({ session, setSession, allRooms, onSave }: DrillChatProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expounding, setExpounding] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [drillName, setDrillName] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentRoom = session.responses[currentIndex];
  const completedCount = session.responses.filter(r => r.completed).length;
  const progress = (completedCount / session.responses.length) * 100;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentIndex, session.responses]);

  const submitAnswer = async () => {
    if (!userInput.trim() && session.mode === "self") {
      toast.error("Please enter your answer");
      return;
    }

    setLoading(true);
    try {
      // Get all completed responses before current index for context
      const previousResponses = session.responses
        .slice(0, currentIndex)
        .filter(r => r.completed && r.jeevesResponse);

      const { data, error } = await supabase.functions.invoke("drill-drill", {
        body: {
          mode: session.mode,
          verse: session.verse,
          verseText: session.verseText,
          difficulty: session.difficulty,
          previousResponses,
          room: {
            id: currentRoom.roomId,
            tag: currentRoom.roomTag,
            name: currentRoom.roomName,
            floorNumber: currentRoom.floorNumber,
            coreQuestion: currentRoom.question
          },
          userAnswer: session.mode === "self" ? userInput : undefined,
          action: session.mode === "guided" ? "teach" : "grade"
        }
      });

      if (error) throw error;

      // Update the response
      const updatedResponses = [...session.responses];
      updatedResponses[currentIndex] = {
        ...currentRoom,
        userAnswer: session.mode === "self" ? userInput : undefined,
        jeevesResponse: data.response,
        completed: true
      };

      setSession(prev => prev ? { ...prev, responses: updatedResponses } : null);
      setUserInput("");

      // Auto-advance after a short delay
      if (currentIndex < session.responses.length - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 500);
      } else {
        setSession(prev => prev ? { ...prev, completedAt: new Date() } : null);
        toast.success("Drill complete! You've covered all rooms.");
      }
    } catch (error) {
      console.error("Drill error:", error);
      toast.error("Failed to process response");
    } finally {
      setLoading(false);
    }
  };

  const skipRoom = () => {
    const updatedResponses = [...session.responses];
    updatedResponses[currentIndex] = {
      ...currentRoom,
      jeevesResponse: "Skipped",
      completed: true
    };
    setSession(prev => prev ? { ...prev, responses: updatedResponses } : null);
    
    if (currentIndex < session.responses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const jumpToRoom = (index: number) => {
    setCurrentIndex(index);
  };

  const handleExpound = async () => {
    setExpounding(true);
    try {
      const { data, error } = await supabase.functions.invoke("drill-drill", {
        body: {
          action: "expound",
          verse: session.verse,
          verseText: session.verseText,
          difficulty: session.difficulty,
          room: {
            id: currentRoom.roomId,
            tag: currentRoom.roomTag,
            name: currentRoom.roomName,
            floorNumber: currentRoom.floorNumber,
            previousResponse: currentRoom.jeevesResponse
          }
        }
      });

      if (error) throw error;

      const updatedResponses = [...session.responses];
      updatedResponses[currentIndex] = {
        ...currentRoom,
        jeevesResponse: data.response,
        expounded: true
      };

      setSession(prev => prev ? { ...prev, responses: updatedResponses } : null);
      toast.success("Response expounded!");
    } catch (error) {
      console.error("Expound error:", error);
      toast.error("Failed to expound");
    } finally {
      setExpounding(false);
    }
  };

  const refreshRoom = async () => {
    const updatedResponses = [...session.responses];
    updatedResponses[currentIndex] = {
      ...currentRoom,
      jeevesResponse: undefined,
      userAnswer: undefined,
      completed: false,
      expounded: false
    };
    setSession(prev => prev ? { ...prev, responses: updatedResponses } : null);
    toast.info("Room reset. Try a different approach!");
  };

  const handleSave = () => {
    if (!drillName.trim()) {
      toast.error("Please enter a name for your drill");
      return;
    }
    onSave(drillName);
    setSaveDialogOpen(false);
    setDrillName("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Room Navigator */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Room Progress</span>
            <Badge variant="outline">{completedCount}/{session.responses.length}</Badge>
          </CardTitle>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-1">
              {session.responses.map((resp, idx) => (
                <button
                  key={resp.roomId}
                  onClick={() => jumpToRoom(idx)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    idx === currentIndex 
                      ? "bg-primary text-primary-foreground" 
                      : resp.completed 
                        ? "bg-muted/50 text-muted-foreground"
                        : "hover:bg-muted"
                  }`}
                >
                  {resp.completed ? (
                    <Check className="h-3 w-3 flex-shrink-0" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border flex-shrink-0" />
                  )}
                  <Badge variant="outline" className="text-[10px] px-1">
                    {resp.roomTag}
                  </Badge>
                  <span className="truncate">{resp.roomName}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge>Floor {currentRoom.floorNumber}</Badge>
              <Badge variant="secondary">{currentRoom.roomTag}</Badge>
              <CardTitle>{currentRoom.roomName}</CardTitle>
            </div>
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Drill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Your Drill</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder={`${session.verse} - My Drill`}
                    value={drillName}
                    onChange={(e) => setDrillName(e.target.value)}
                  />
                  <Button onClick={handleSave} className="w-full">
                    Save Drill
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Core Question */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-1">
                  {session.mode === "guided" ? "Jeeves teaches:" : "Jeeves asks:"}
                </p>
                <p className="text-foreground">{currentRoom.question}</p>
              </div>
            </div>
          </div>

          {/* Previous Response (if completed) */}
          {currentRoom.completed && currentRoom.jeevesResponse && (
            <div className="space-y-3">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{currentRoom.jeevesResponse}</ReactMarkdown>
                </div>
              </div>
              
              {/* Expound & Refresh Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExpound}
                  disabled={expounding}
                  className="flex-1"
                >
                  {expounding ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Expounding...
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-3 w-3" />
                      Expound {currentRoom.expounded ? "More" : ""}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshRoom}
                  title="Try different approach"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  New Combination
                </Button>
              </div>
            </div>
          )}

          {/* User Input (if not completed) */}
          {!currentRoom.completed && (
            <div className="space-y-4">
              {session.mode === "self" && (
                <Textarea
                  placeholder="Type your answer here..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={4}
                />
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={submitAnswer}
                  disabled={loading || (session.mode === "self" && !userInput.trim())}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : session.mode === "guided" ? (
                    <>
                      <ChevronRight className="mr-2 h-4 w-4" />
                      Show Me
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={skipRoom}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {currentRoom.completed && currentIndex < session.responses.length - 1 && (
            <Button 
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="w-full"
            >
              Next Room
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          <div ref={scrollRef} />
        </CardContent>
      </Card>
    </div>
  );
};
