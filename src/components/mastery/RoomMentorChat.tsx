import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRoomMentor } from "@/hooks/useRoomMentor";
import { Swords, Send, Trash2 } from "lucide-react";
import { MasteryBadge } from "./MasteryBadge";

interface RoomMentorChatProps {
  roomId: string;
  roomName: string;
  masteryLevel: number;
}

export const RoomMentorChat: React.FC<RoomMentorChatProps> = ({
  roomId,
  roomName,
  masteryLevel,
}) => {
  const [input, setInput] = useState("");
  const { messages, isStreaming, sendMessage, clearMessages } = useRoomMentor(
    roomId,
    roomName,
    masteryLevel
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    
    await sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Swords className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Mentor Mode</CardTitle>
              <CardDescription>Sparring with Jeeves in {roomName}</CardDescription>
            </div>
          </div>
          <MasteryBadge level={masteryLevel} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Swords className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium mb-2">Ready to Spar?</p>
            <p className="text-sm">
              Jeeves will challenge your understanding and test your reasoning.
              <br />
              Defend your interpretations and strengthen your faith!
            </p>
          </div>
        )}

        {messages.length > 0 && (
          <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Defend your interpretation..."
            disabled={isStreaming}
          />
          <Button onClick={handleSend} disabled={isStreaming || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
          {messages.length > 0 && (
            <Button variant="outline" onClick={clearMessages} disabled={isStreaming}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
