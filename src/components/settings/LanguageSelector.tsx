import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { supportedLanguages, setLanguage } from '@/i18n';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface LanguageSelectorProps {
  showLabel?: boolean;
  className?: string;
}

export function LanguageSelector({ showLabel = true, className }: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();
  const { updatePreference } = useUserPreferences();
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Sync to database for cross-device persistence
    updatePreference('language', lang);
  };

  return (
    <div className={className}>
      {showLabel && (
        <Label className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4" />
          {t('settings.language')}
        </Label>
      )}
      <Select value={i18n.language?.split('-')[0] || 'en'} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('settings.selectLanguage')} />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.nativeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
