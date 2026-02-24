import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Type, BookOpen, Languages } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { BIBLE_TRANSLATIONS, Translation } from "@/services/bibleApi";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const ReadingControls = () => {
  const { t } = useTranslation();
  const { preferences, updatePreference } = useUserPreferences();
  const { book = "John", chapter: chapterParam = "3" } = useParams();
  const navigate = useNavigate();
  const [translation, setTranslation] = useState<Translation>(preferences.bible_translation as Translation);

  useEffect(() => {
    setTranslation(preferences.bible_translation as Translation);
  }, [preferences.bible_translation]);

  const handleTranslationChange = async (value: Translation) => {
    console.log('[ReadingControls] Translation changing to:', value);
    setTranslation(value);

    try {
      await updatePreference("bible_translation", value);
      console.log('[ReadingControls] Preference updated, navigating...');

      // Force page reload with new translation to ensure it applies
      const newUrl = `/bible/${book}/${chapterParam}?t=${value}`;
      window.location.href = newUrl;
    } catch (error) {
      console.error('[ReadingControls] Error updating translation:', error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          {t('bible.readingSettings')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t('bible.translationLabel')}
            </h4>
            <Select value={translation} onValueChange={handleTranslationChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('bible.selectTranslation')} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] z-[100]" position="popper">
                {BIBLE_TRANSLATIONS.map((trans) => (
                  <SelectItem key={trans.value} value={trans.value}>
                    {trans.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Type className="h-4 w-4" />
              {t('bible.fontSize')}
            </h4>
            <RadioGroup
              value={preferences.bible_font_size}
              onValueChange={(value: any) =>
                updatePreference("bible_font_size", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small">{t('bible.small')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">{t('bible.medium')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large">{t('bible.large')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t('bible.readingModeLabel')}
            </h4>
            <RadioGroup
              value={preferences.reading_mode}
              onValueChange={(value: any) =>
                updatePreference("reading_mode", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default">{t('bible.default')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="focus" id="focus" />
                <Label htmlFor="focus">{t('bible.focus')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="study" id="study" />
                <Label htmlFor="study">{t('bible.studyWithNotes')}</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
