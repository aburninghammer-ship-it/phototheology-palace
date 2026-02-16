import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, HelpCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { getRoomByCode } from "@/data/canonicalRooms";

interface StudyBuddyPromptsProps {
  prompts: string[];
  primaryRoom: string;
  secondaryRooms: string[];
}

export const StudyBuddyPrompts = ({
  prompts,
  primaryRoom,
  secondaryRooms,
}: StudyBuddyPromptsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!prompts || prompts.length === 0) return null;

  const primaryRoomData = getRoomByCode(primaryRoom);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      toast.success("Question copied");
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Determine which room a prompt belongs to (heuristic: first N are primary, rest are secondary)
  const getRoomForPrompt = (index: number): string | null => {
    const primaryCount = Math.min(3, prompts.length - secondaryRooms.length);
    if (index < primaryCount) return primaryRoom;
    const secIdx = index - primaryCount;
    return secondaryRooms[secIdx] || null;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between px-3 py-2 h-auto"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-violet-500" />
            <span className="font-medium text-sm">Study Buddy Prompts</span>
            <Badge variant="outline" className="text-xs">
              {prompts.length}
            </Badge>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-2">
        <p className="text-xs text-muted-foreground mb-2">
          Lens-aware questions to guide deeper study through{" "}
          {primaryRoomData?.name || primaryRoom.toUpperCase()}
        </p>
        {prompts.map((prompt, index) => {
          const roomCode = getRoomForPrompt(index);
          const room = roomCode ? getRoomByCode(roomCode) : null;

          return (
            <div
              key={index}
              className="group flex items-start gap-2 rounded-md border p-2.5 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <span className="text-violet-500/70 font-mono text-xs mt-0.5 shrink-0">
                {index + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">{prompt}</p>
                {room && (
                  <Badge
                    variant="outline"
                    className="mt-1 text-[10px] h-4 px-1.5"
                  >
                    {room.code.toUpperCase()}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={() => handleCopy(prompt, index)}
              >
                {copiedIndex === index ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};
