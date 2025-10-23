import { Verse } from "@/types/bible";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface VerseViewProps {
  verse: Verse;
  isSelected: boolean;
  onSelect: () => void;
  showPrinciples?: boolean;
  isHighlighted?: boolean;
  principles?: string[];
}

export const VerseView = ({ verse, isSelected, onSelect, showPrinciples, isHighlighted, principles }: VerseViewProps) => {
  const displayPrinciples = principles || ["2D", "@Ab", "Altar", "Passover"];
  const colors = ["gradient-palace", "gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-royal"];
  return (
    <div
      className={`group cursor-pointer transition-all duration-300 p-3 rounded-lg ${
        isSelected
          ? "bg-primary/10 border-2 border-primary shadow-lg"
          : isHighlighted
          ? "bg-accent/20 border-2 border-accent shadow-md animate-pulse-glow"
          : "hover:bg-muted/50 border-2 border-transparent"
      }`}
      onClick={onSelect}
    >
      <div className="flex gap-3">
        <span
          className={`font-serif font-bold text-sm flex-shrink-0 ${
            isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          } transition-colors`}
        >
          {verse.verse}
        </span>
        
        <div className="flex-1">
          <p className="text-foreground leading-relaxed">
            {verse.text}
          </p>
          
          {showPrinciples && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {displayPrinciples.map((principle, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className={`text-xs ${colors[idx % colors.length]} text-white`}
                >
                  {idx === 0 && <Sparkles className="h-3 w-3 mr-1" />}
                  {principle}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
