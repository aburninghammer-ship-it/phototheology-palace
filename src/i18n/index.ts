import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ko from './locales/ko.json';
import hr from './locales/hr.json';
import sr from './locales/sr.json';

export const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  ko: { translation: ko },
  hr: { translation: hr },
  sr: { translation: sr },
} as const;

export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'pt-language',
    },

    interpolation: {
      escapeValue: false,
    },
  });

export const getCurrentLanguage = () => i18n.language || 'en';

export const setLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('pt-language', lang);
};

/**
 * Sync language from database preferences (called after preferences load)
 * Only applies if no local override exists
 */
export const syncLanguageFromDB = (dbLanguage: string) => {
  if (dbLanguage && dbLanguage !== 'en') {
    const currentLocal = localStorage.getItem('pt-language');
    if (!currentLocal || currentLocal === 'en') {
      setLanguage(dbLanguage);
    }
  }
};

export default i18n;
