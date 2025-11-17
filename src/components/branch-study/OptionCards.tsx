import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardsProps {
  options: Array<{ label: string; content: string }>;
  onSelect: (label: string) => void;
  type: "verse" | "principle";
}

export function OptionCards({ options, onSelect, type }: OptionCardsProps) {
  const cols = options.length === 2 ? "md:grid-cols-2" : "md:grid-cols-5";
  
  return (
    <div className={cn("grid grid-cols-1 gap-6 my-8", cols)}>
      {options.map((option, idx) => (
        <Card
          key={option.label}
          className={cn(
            "group cursor-pointer transition-all duration-300",
            "hover:scale-105 hover:shadow-2xl",
            "border-2 hover:border-primary",
            "bg-gradient-to-br from-card to-card/50",
            "animate-in fade-in slide-in-from-bottom-4"
          )}
          style={{
            animationDelay: `${idx * 100}ms`,
          }}
          onClick={() => onSelect(option.label)}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[140px] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              {type === "verse" ? (
                <BookOpen className="h-6 w-6 text-primary" />
              ) : (
                <Compass className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="text-2xl font-bold text-primary">{option.label}</div>
            <div className="text-sm font-medium leading-relaxed">{option.content}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
