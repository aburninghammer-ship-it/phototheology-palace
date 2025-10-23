import { Verse } from "@/types/bible";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface VerseViewProps {
  verse: Verse;
  isSelected: boolean;
  onSelect: () => void;
  showPrinciples?: boolean;
}

export const VerseView = ({ verse, isSelected, onSelect, showPrinciples }: VerseViewProps) => {
  return (
    <div
      className={`group cursor-pointer transition-all duration-300 p-3 rounded-lg ${
        isSelected
          ? "bg-primary/10 border-2 border-primary shadow-lg"
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
              <Badge variant="outline" className="text-xs gradient-palace text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                2D
              </Badge>
              <Badge variant="outline" className="text-xs gradient-ocean text-white">
                @Ab
              </Badge>
              <Badge variant="outline" className="text-xs gradient-sunset text-white">
                Altar
              </Badge>
              <Badge variant="outline" className="text-xs gradient-warmth text-white">
                Passover
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
