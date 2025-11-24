import { useFloorProgress } from "@/hooks/useFloorProgress";
import { FloorProgressTower } from "@/components/mastery/FloorProgressTower";
import { FloorRequirementsCard } from "@/components/mastery/FloorRequirementsCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";

const FLOOR_REQUIREMENTS = {
  1: { roomsRequired: 3, xpPerRoom: 100, streakDays: 3, curriculumPercent: 50, assessmentRequired: true },
  2: { roomsRequired: 3, xpPerRoom: 200, streakDays: 5, curriculumPercent: 80, assessmentRequired: true },
  3: { roomsRequired: 3, xpPerRoom: 300, streakDays: 7, curriculumPercent: 80, assessmentRequired: true },
  4: { roomsRequired: 4, xpPerRoom: 500, streakDays: 7, curriculumPercent: 80, assessmentRequired: true },
  5: {
    roomsRequired: 3,
    xpPerRoom: 750,
    streakDays: 14,
    curriculumPercent: 100,
    assessmentRequired: true,
    teachingDemo: true,
  },
  6: {
    roomsRequired: 2,
    xpPerRoom: 1000,
    streakDays: 14,
    curriculumPercent: 100,
    assessmentRequired: true,
    retentionTests: ["7-day"],
  },
  7: {
    roomsRequired: 3,
    xpPerRoom: 1500,
    streakDays: 21,
    curriculumPercent: 100,
    assessmentRequired: true,
    retentionTests: ["14-day"],
  },
  8: {
    roomsRequired: 1,
    xpPerRoom: 2000,
    streakDays: 30,
    curriculumPercent: 100,
    assessmentRequired: true,
    retentionTests: ["30-day", "teaching verification"],
  },
};

export default function FloorMastery() {
  const { floorProgress, globalTitle, isLoading } = useFloorProgress();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Floor-Based Mastery</h1>
          <p className="text-muted-foreground">
            Climb the Palace floor by floor. Each level builds on the previous. Only the worthy
            reach the 8th Floor.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Tower Visualization */}
          <div>
            <FloorProgressTower floors={floorProgress || []} globalTitle={globalTitle} />
          </div>

          {/* Right: Requirements Breakdown */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Floor Requirements</h2>
            {Object.entries(FLOOR_REQUIREMENTS).map(([floor, reqs]) => {
              const floorNum = parseInt(floor);
              const floorData = floorProgress?.find((f: any) => f.floor_number === floorNum);
              return (
                <FloorRequirementsCard
                  key={floor}
                  floorNumber={floorNum}
                  isUnlocked={floorData?.is_unlocked || false}
                  requirements={reqs}
                />
              );
            })}
          </div>
        </div>

        {/* Black Master Hall of Fame */}
        {globalTitle?.master_title === "black" && (
          <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-black via-gray-900 to-black border-2 border-yellow-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">⚫ BLACK MASTER ⚫</h2>
              <p className="text-yellow-500 font-medium">
                You have conquered all 8 floors. You are a Phototheology Grandmaster.
              </p>
              <Badge className="bg-yellow-500 text-black text-lg px-4 py-2">
                Palace Completed
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
