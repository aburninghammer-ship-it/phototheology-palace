import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Crown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface FloorProgressTowerProps {
  floors: any[];
  globalTitle: any;
}

export const FloorProgressTower: React.FC<FloorProgressTowerProps> = ({
  floors,
  globalTitle,
}) => {
  const { t } = useTranslation();
  const [openSections, setOpenSections] = useState<number[]>([]);
  const navigate = useNavigate();

  const MASTER_TITLE_GROUPS = [
    {
      title: t('floorTower.blueMaster'),
      floors: [1],
      floorLabel: t('floorTower.floor1'),
      color: "blue",
      bg: "bg-blue-500",
      text: "text-blue-500",
      requirements: t('floorTower.floor1Req'),
      rewards: t('floorTower.floor1Reward')
    },
    {
      title: t('floorTower.redMaster'),
      floors: [2],
      floorLabel: t('floorTower.floor2'),
      color: "red",
      bg: "bg-red-500",
      text: "text-red-500",
      requirements: t('floorTower.floor2Req'),
      rewards: t('floorTower.floor2Reward')
    },
    {
      title: t('floorTower.goldMaster'),
      floors: [3],
      floorLabel: t('floorTower.floor3'),
      color: "yellow",
      bg: "bg-yellow-500",
      text: "text-yellow-500",
      requirements: t('floorTower.floor3Req'),
      rewards: t('floorTower.floor3Reward')
    },
    {
      title: t('floorTower.purpleMaster'),
      floors: [4],
      floorLabel: t('floorTower.floor4'),
      color: "purple",
      bg: "bg-purple-500",
      text: "text-purple-500",
      requirements: t('floorTower.floor4Req'),
      rewards: t('floorTower.floor4Reward')
    },
    {
      title: t('floorTower.whiteMaster'),
      floors: [5, 6],
      floorLabel: t('floorTower.floors56'),
      color: "white",
      bg: "bg-white border border-border",
      text: "text-white",
      requirements: t('floorTower.floors56Req'),
      rewards: t('floorTower.floors56Reward')
    },
    {
      title: t('floorTower.blackCandidate'),
      floors: [7],
      floorLabel: t('floorTower.floor7'),
      color: "gray",
      bg: "bg-gray-800",
      text: "text-gray-300",
      requirements: t('floorTower.floor7Req'),
      rewards: t('floorTower.floor7Reward')
    },
    {
      title: t('floorTower.blackMaster'),
      floors: [8],
      floorLabel: t('floorTower.floor8'),
      color: "black",
      bg: "bg-black",
      text: "text-white",
      requirements: t('floorTower.floor8Req'),
      rewards: t('floorTower.floor8Reward')
    }
  ];

  const toggleSection = (index: number) => {
    setOpenSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getGroupStatus = (group: typeof MASTER_TITLE_GROUPS[0]) => {
    const groupFloors = group.floors.map(fn => floors.find(f => f.floor_number === fn)).filter(Boolean);
    const allComplete = groupFloors.every(f => f?.floor_completed_at);
    const isActive = group.floors.includes(globalTitle?.current_floor);
    const anyUnlocked = groupFloors.some(f => f?.is_unlocked);

    return { allComplete, isActive, anyUnlocked, groupFloors };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-6 w-6" />
          {t('floorTower.globalMasterTitles')}
        </CardTitle>
        <CardDescription>
          {t('floorTower.masterRoomsDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MASTER_TITLE_GROUPS.map((group, index) => {
            const status = getGroupStatus(group);

            return (
              <Collapsible
                key={index}
                open={openSections.includes(index)}
                onOpenChange={() => toggleSection(index)}
              >
                <div className={`rounded-lg border-2 ${status.isActive ? 'border-primary/50' : 'border-border'} bg-card transition-all`}>
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${group.bg} ${group.color === 'white' ? 'text-black' : 'text-white'} flex items-center justify-center font-bold text-sm`}>
                        {group.color === 'blue' ? '1' : group.color === 'red' ? '2' : group.color === 'yellow' ? '3' : group.color === 'purple' ? '4' : group.color === 'white' ? '5-6' : group.color === 'gray' ? '7' : '8'}
                      </div>
                      <h3 className={`font-bold text-lg uppercase ${group.text}`}>
                        {group.title} — {group.floorLabel}
                      </h3>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${openSections.includes(index) ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>

                  <CollapsibleContent className="animate-accordion-down">
                    <div className="px-4 pb-4 space-y-2">
                      <div>
                        <span className="font-bold">{t('floorTower.requirements')}: </span>
                        <span className="text-muted-foreground">{group.requirements}</span>
                      </div>
                      <div>
                        <span className="font-bold">{t('floorTower.reward')}: </span>
                        <span className="text-muted-foreground">{group.rewards}</span>
                      </div>

                      <div className="mt-3 space-y-1">
                        {group.floors.map(floorNum => {
                          const floor = floors.find(f => f.floor_number === floorNum);
                          if (!floor) return null;

                          return (
                            <button
                              key={floorNum}
                              onClick={() => navigate(`/palace?floor=${floorNum}`)}
                              className="w-full text-left p-2 rounded hover:bg-accent/50 transition-colors flex items-center justify-between group"
                            >
                              <span className="text-sm">
                                {t('floorTower.floorRooms', { floor: floorNum, completed: floor.rooms_completed, required: floor.rooms_required })}
                              </span>
                              {floor.floor_completed_at && (
                                <Badge variant="default" className="bg-green-500 text-xs">✓</Badge>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {!status.allComplete && status.anyUnlocked && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {t('floorTower.progress', { completed: status.groupFloors.filter(f => f?.floor_completed_at).length, total: status.groupFloors.length })}
                        </p>
                      )}
                      {!status.anyUnlocked && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {t('floorTower.completePreviousFloors')}
                        </p>
                      )}

                      {status.isActive && !status.allComplete && (
                        <Badge variant="default" className="mt-2">
                          {t('floorTower.currentLevel')}
                        </Badge>
                      )}
                      {status.allComplete && (
                        <Badge variant="default" className="mt-2 bg-green-500">
                          {t('floorTower.completed')}
                        </Badge>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
