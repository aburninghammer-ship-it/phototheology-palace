import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface FloorRequirementsCardProps {
  floorNumber: number;
  isUnlocked: boolean;
  requirements: {
    roomsRequired: number;
    xpPerRoom: number;
    streakDays: number;
    curriculumPercent: number;
    assessmentRequired: boolean;
    teachingDemo?: boolean;
    retentionTests?: string[];
  };
}

export const FloorRequirementsCard: React.FC<FloorRequirementsCardProps> = ({
  floorNumber,
  isUnlocked,
  requirements,
}) => {
  const { t } = useTranslation();
  const isFloor8 = floorNumber === 8;

  const FLOOR_NAMES: Record<number, string> = {
    1: t('floorReqs.floorName1'),
    2: t('floorReqs.floorName2'),
    3: t('floorReqs.floorName3'),
    4: t('floorReqs.floorName4'),
    5: t('floorReqs.floorName5'),
    6: t('floorReqs.floorName6'),
    7: t('floorReqs.floorName7'),
    8: t('floorReqs.floorName8'),
  };

  return (
    <Card className={!isUnlocked ? "opacity-60" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {isUnlocked ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
          {FLOOR_NAMES[floorNumber]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Circle className="h-4 w-4 mt-0.5" />
            <span>
              {t('floorReqs.completeRooms', { count: requirements.roomsRequired })}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Circle className="h-4 w-4 mt-0.5" />
            <span>
              {t('floorReqs.xpPerRoom', { xp: requirements.xpPerRoom })}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Circle className="h-4 w-4 mt-0.5" />
            <span>
              {t('floorReqs.streakDays', { days: requirements.streakDays })}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Circle className="h-4 w-4 mt-0.5" />
            <span>
              {t('floorReqs.curriculumCompletion', { percent: requirements.curriculumPercent })}
            </span>
          </div>
          {requirements.assessmentRequired && (
            <div className="flex items-start gap-2">
              <Circle className="h-4 w-4 mt-0.5" />
              <span>
                {t('floorReqs.passAssessment', { score: isFloor8 ? "95%" : "80%" })}
              </span>
            </div>
          )}
          {requirements.teachingDemo && (
            <div className="flex items-start gap-2">
              <Circle className="h-4 w-4 mt-0.5" />
              <span>{t('floorReqs.teachingDemo')}</span>
            </div>
          )}
          {requirements.retentionTests && requirements.retentionTests.length > 0 && (
            <div className="flex items-start gap-2">
              <Circle className="h-4 w-4 mt-0.5" />
              <span>{t('floorReqs.retentionTests', { tests: requirements.retentionTests.join(", ") })}</span>
            </div>
          )}
        </div>

        {isFloor8 && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs font-bold text-destructive mb-1">{t('floorReqs.blackMasterExamTitle')}</p>
            <p className="text-xs text-muted-foreground">
              {t('floorReqs.blackMasterExamDesc')}
            </p>
          </div>
        )}

        {!isUnlocked && (
          <Badge variant="outline" className="w-full justify-center gap-2 py-2">
            <Lock className="h-3 w-3" />
            {t('floorReqs.completeToUnlock', { floor: floorNumber - 1 })}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
