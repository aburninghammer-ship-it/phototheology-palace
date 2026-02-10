import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PalaceMap } from "@/components/bible/PalaceMap";
import { ThemeCrossReference } from "@/components/bible/ThemeCrossReference";
import { PTCodeSearch } from "@/components/bible/PTCodeSearch";
import { Card } from "@/components/ui/card";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { Building2, Info, Map, Search, Tag, BookOpen } from "lucide-react";

export default function PalaceExplorer() {
  const { t } = useTranslation();
  const [selectedRoom, setSelectedRoom] = useState<{code: string; name: string} | null>(null);

  const handleRoomClick = (code: string, name: string) => {
    setSelectedRoom({ code, name });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
              {t('palaceExplorer.title')}
            </h1>
          </div>
          <HowItWorksDialog
            title={t('palaceExplorer.howToUseTitle')}
            steps={[
              {
                title: t('palaceExplorer.steps.interactiveMap.title'),
                description: t('palaceExplorer.steps.interactiveMap.description'),
                highlights: [
                  t('palaceExplorer.steps.interactiveMap.highlights.0'),
                  t('palaceExplorer.steps.interactiveMap.highlights.1'),
                  t('palaceExplorer.steps.interactiveMap.highlights.2')
                ],
                icon: Map,
              },
              {
                title: t('palaceExplorer.steps.ptCodeSearch.title'),
                description: t('palaceExplorer.steps.ptCodeSearch.description'),
                highlights: [
                  t('palaceExplorer.steps.ptCodeSearch.highlights.0'),
                  t('palaceExplorer.steps.ptCodeSearch.highlights.1'),
                  t('palaceExplorer.steps.ptCodeSearch.highlights.2')
                ],
                icon: Search,
              },
              {
                title: t('palaceExplorer.steps.selectedRoom.title'),
                description: t('palaceExplorer.steps.selectedRoom.description'),
                highlights: [
                  t('palaceExplorer.steps.selectedRoom.highlights.0'),
                  t('palaceExplorer.steps.selectedRoom.highlights.1'),
                  t('palaceExplorer.steps.selectedRoom.highlights.2')
                ],
                icon: Tag,
              },
              {
                title: t('palaceExplorer.steps.themeCrossRef.title'),
                description: t('palaceExplorer.steps.themeCrossRef.description'),
                highlights: [
                  t('palaceExplorer.steps.themeCrossRef.highlights.0'),
                  t('palaceExplorer.steps.themeCrossRef.highlights.1'),
                  t('palaceExplorer.steps.themeCrossRef.highlights.2')
                ],
                icon: BookOpen,
              },
            ]}
          />
        </div>
        <p className="text-muted-foreground">
          {t('palaceExplorer.description')}
        </p>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-2 border-blue-500/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-foreground">{t('palaceExplorer.welcomeTitle')}</p>
            <p className="text-xs text-muted-foreground">
              {t('palaceExplorer.welcomeDescription')}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <PalaceMap onRoomClick={handleRoomClick} />
          
          {selectedRoom && (
            <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-2 border-purple-500/20">
              <h4 className="font-semibold text-sm mb-2 text-foreground">{t('palaceExplorer.selectedRoom')}</h4>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-purple-600 text-white px-3 py-1 rounded">
                  {selectedRoom.code}
                </code>
                <span className="text-sm text-foreground">{selectedRoom.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('palaceExplorer.searchBelow')}
              </p>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PTCodeSearch />
          <ThemeCrossReference initialTheme={selectedRoom?.name} />
        </div>
      </div>
    </div>
  );
}
