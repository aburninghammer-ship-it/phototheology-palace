import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Languages } from "lucide-react";
import type { LanguageTerm } from "@/types/preacherMentor";

interface LanguageInsightPanelProps {
  terms: LanguageTerm[];
  scholarlyView: boolean;
}

export const LanguageInsightPanel = ({
  terms,
  scholarlyView,
}: LanguageInsightPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!terms || terms.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between px-3 py-2 h-auto"
        >
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-sm">Language Insight</span>
            <Badge variant="outline" className="text-xs">
              {terms.length} {terms.length === 1 ? "term" : "terms"}
            </Badge>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-3">
        {terms.slice(0, 2).map((term, index) => (
          <div
            key={index}
            className="rounded-lg border p-3 space-y-2 bg-muted/30"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-semibold">{term.original}</span>
              <Badge
                variant="outline"
                className={
                  term.language === "Hebrew"
                    ? "border-amber-500/50 text-amber-600"
                    : "border-blue-500/50 text-blue-600"
                }
              >
                {term.language}
              </Badge>
              {scholarlyView && term.strongsNumber && (
                <Badge variant="secondary" className="text-xs">
                  {term.strongsNumber}
                </Badge>
              )}
            </div>

            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Transliteration:</span>{" "}
                <span className="italic">{term.transliteration}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Pronunciation:</span>{" "}
                <span className="font-mono text-xs">{term.pronunciation}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Definition:</span>{" "}
                {term.definition}
              </p>
              <p className="text-primary/90 font-medium">
                {term.interpretiveImpact}
              </p>

              {scholarlyView && (
                <>
                  {term.semanticRange && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Semantic range:</span>{" "}
                      {term.semanticRange}
                    </p>
                  )}
                  {term.lexicalNotes && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Lexical notes:</span>{" "}
                      {term.lexicalNotes}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
