import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GideonPlayerStrip } from "./GideonPlayerStrip";
import { useGameChat } from "@/hooks/useGameChat";
import { BookOpen, Eye, Tent, MessageCircle, Send } from "lucide-react";
import type { GideonTournament, GideonTournamentPlayer, GideonQuestion } from "@/types/gideon";

interface GideonCampModeProps {
  tournament: GideonTournament;
  myPlayer: GideonTournamentPlayer;
  tournamentPlayers: GideonTournamentPlayer[];
  roomId?: string;
}

export function GideonCampMode({
  tournament,
  myPlayer,
  tournamentPlayers,
  roomId,
}: GideonCampModeProps) {
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useGameChat(roomId);

  const questions = tournament.questions_data as GideonQuestion[];

  // Get the questions the player got wrong
  const wrongAnswers = (myPlayer.answers || []).filter((a: any) => !a.correct);
  const teachingQuestions = wrongAnswers.map((a: any) => questions[a.question_index]).filter(Boolean);

  const activePlayers = tournamentPlayers.filter((p) => !p.is_eliminated);
  const campPlayers = tournamentPlayers.filter((p) => p.is_eliminated);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    sendMessage(chatInput.trim());
    setChatInput("");
  };

  return (
    <div className="space-y-4">
      {/* Camp Mode Header */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Tent className="w-8 h-8 text-amber-500" />
            <div>
              <h2 className="text-xl font-bold">Camp Mode</h2>
              <p className="text-sm text-muted-foreground">
                Your water rations are depleted. Learn from the battle while watching others continue.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching: Missed Questions Review */}
      {teachingQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Learning from Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teachingQuestions.map((q, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="font-medium">{q.prompt}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-400">
                    Correct: {q.correct_answer}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {q.pt_room_tag}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{q.explanation}</p>
                {q.cross_references?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {q.cross_references.map((ref: string, j: number) => (
                      <Badge key={j} variant="outline" className="text-xs">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Live Spectator View */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" /> Live Battle ({activePlayers.length} remaining)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline">Round {tournament.current_round}</Badge>
            <Badge variant="secondary">
              {tournament.round_phase === "question" ? "In Progress" : "Reveal"}
            </Badge>
          </div>
          <GideonPlayerStrip
            players={tournamentPlayers}
            currentQuestionIndex={tournament.current_question_index}
            myUserId={myPlayer.user_id}
          />
        </CardContent>
      </Card>

      {/* Camp Chat */}
      {roomId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Camp Chat
              {campPlayers.length > 1 && (
                <Badge variant="outline" className="text-xs ml-1">
                  {campPlayers.length} in camp
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 overflow-y-auto space-y-2 mb-3 p-2 rounded-lg bg-muted/30">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No messages yet. Chat with fellow camp members!
                </p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <span className="font-medium text-amber-500">{msg.display_name}: </span>
                  <span className="text-foreground">{msg.message}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendChat} disabled={!chatInput.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
