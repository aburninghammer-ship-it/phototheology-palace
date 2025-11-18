import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardsProps {
  options: Array<{ label: string; content: string }>;
  onSelect: (label: string) => void;
  type: "verse" | "principle";
}

const cardColors = [
  "from-blue-500/30 to-blue-600/20 border-blue-500/60 hover:border-blue-400 hover:from-blue-500/40 hover:to-blue-600/30",
  "from-purple-500/30 to-purple-600/20 border-purple-500/60 hover:border-purple-400 hover:from-purple-500/40 hover:to-purple-600/30",
  "from-green-500/30 to-green-600/20 border-green-500/60 hover:border-green-400 hover:from-green-500/40 hover:to-green-600/30",
  "from-orange-500/30 to-orange-600/20 border-orange-500/60 hover:border-orange-400 hover:from-orange-500/40 hover:to-orange-600/30",
  "from-pink-500/30 to-pink-600/20 border-pink-500/60 hover:border-pink-400 hover:from-pink-500/40 hover:to-pink-600/30",
];

export function OptionCards({ options, onSelect, type }: OptionCardsProps) {
  const cols = options.length === 2 ? "md:grid-cols-2" : "md:grid-cols-5";
  
  return (
    <div className={cn("grid grid-cols-1 gap-6 my-8", cols)}>
      {options.map((option, idx) => {
        const colorClass = cardColors[idx % cardColors.length];
        
        return (
          <Card
            key={option.label}
            className={cn(
              "group cursor-pointer transition-all duration-300",
              "hover:scale-105 hover:shadow-2xl",
              "border-2 bg-gradient-to-br",
              colorClass,
              "animate-in fade-in slide-in-from-bottom-4"
            )}
            style={{
              animationDelay: `${idx * 100}ms`,
            }}
            onClick={() => onSelect(option.label)}
          >
            <CardContent className="p-6 flex flex-col items-start min-h-[180px] space-y-3">
              <div className="w-full flex items-center justify-between mb-2">
                <div className="text-3xl font-bold">{option.label}</div>
                <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center">
                  {type === "verse" ? (
                    <BookOpen className="h-5 w-5" />
                  ) : (
                    <Compass className="h-5 w-5" />
                  )}
                </div>
              </div>
              <div className="text-sm leading-relaxed text-left">{option.content}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
