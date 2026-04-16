import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { SessionLibrary } from "@/components/session/SessionLibrary";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { SEO } from "@/components/SEO";
import { useTranslation } from "react-i18next";

export default function Sessions() {
  const { t } = useTranslation();
  const { preferences } = useUserPreferences();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t('sessions.seoTitle')}
        description={t('sessions.seoDescription')}
      />
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('sessions.title')}</h1>
          <p className="text-muted-foreground">
            {t('sessions.description')}
          </p>
        </div>

        <SessionLibrary />
      </div>
    </div>
  );
}