import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronDown, Globe, Check } from "lucide-react";
import { 
  BIBLE_TRANSLATIONS, 
  BibleTranslation, 
  getAllLanguages 
} from "@/data/bibleTranslations";

interface TranslationSelectorProps {
  selectedTranslation: string;
  onSelect: (translationId: string) => void;
  showLanguageGroups?: boolean;
}

export function TranslationSelector({ 
  selectedTranslation, 
  onSelect,
  showLanguageGroups = true 
}: TranslationSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  
  const currentTranslation = BIBLE_TRANSLATIONS.find(t => t.id === selectedTranslation);
  const languages = getAllLanguages();
  
  const filteredTranslations = selectedLanguage
    ? BIBLE_TRANSLATIONS.filter(t => t.languageCode === selectedLanguage)
    : BIBLE_TRANSLATIONS;

  const getStyleColor = (style: BibleTranslation["style"]) => {
    switch (style) {
      case "word-for-word": return "bg-blue-500/20 text-blue-600";
      case "thought-for-thought": return "bg-green-500/20 text-green-600";
      case "paraphrase": return "bg-purple-500/20 text-purple-600";
    }
  };

  const getReadingLevelColor = (level: BibleTranslation["readingLevel"]) => {
    switch (level) {
      case "easy": return "bg-emerald-500/20 text-emerald-600";
      case "moderate": return "bg-amber-500/20 text-amber-600";
      case "scholarly": return "bg-rose-500/20 text-rose-600";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookOpen className="h-4 w-4" />
          {currentTranslation?.abbreviation || "KJV"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-[400px] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Select Translation
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Language filters */}
        {showLanguageGroups && (
          <>
            <div className="px-2 py-1 flex flex-wrap gap-1">
              <Badge
                variant={selectedLanguage === null ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedLanguage(null)}
              >
                All
              </Badge>
              {languages.map(lang => (
                <Badge
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setSelectedLanguage(lang.code)}
                >
                  {lang.name}
                </Badge>
              ))}
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {filteredTranslations.map((translation) => (
          <DropdownMenuItem
            key={translation.id}
            onClick={() => onSelect(translation.id)}
            className="flex flex-col items-start p-3 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-bold">{translation.abbreviation}</span>
                <span className="text-sm text-muted-foreground">{translation.name}</span>
                {selectedTranslation === translation.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {translation.language}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{translation.description}</p>
            <div className="flex gap-1 mt-2">
              <Badge className={`text-xs ${getStyleColor(translation.style)}`}>
                {translation.style}
              </Badge>
              <Badge className={`text-xs ${getReadingLevelColor(translation.readingLevel)}`}>
                {translation.readingLevel}
              </Badge>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
