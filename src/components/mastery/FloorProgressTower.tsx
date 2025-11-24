import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Crown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FloorProgressTowerProps {
  floors: any[];
  globalTitle: any;
}

const MASTER_TITLE_GROUPS = [
  {
    title: "BLUE MASTER",
    floors: [1],
    roomRange: "1-3 Rooms Mastered",
    color: "blue",
    bg: "bg-blue-500",
    text: "text-blue-500",
    requirements: "None beyond room mastery",
    rewards: "Blue Master title"
  },
  {
    title: "RED MASTER",
    floors: [2],
    roomRange: "4-9 Rooms Mastered",
    color: "red",
    bg: "bg-red-500",
    text: "text-red-500",
    requirements: "7-day global streak",
    rewards: "Red Master title + Red Challenges"
  },
  {
    title: "GOLD MASTER",
    floors: [3],
    roomRange: "10-18 Rooms Mastered",
    color: "yellow",
    bg: "bg-yellow-500",
    text: "text-yellow-500",
    requirements: "14-day global streak",
    rewards: "Gold Master title + advanced chain tools"
  },
  {
    title: "PURPLE MASTER",
    floors: [4],
    roomRange: "19-27 Rooms Mastered",
    color: "purple",
    bg: "bg-purple-500",
    text: "text-purple-500",
    requirements: "21-day global streak",
    rewards: "Purple Master title + create-your-own drills"
  },
  {
    title: "WHITE MASTER",
    floors: [5, 6],
    roomRange: "28-37 Rooms Mastered",
    color: "white",
    bg: "bg-white border border-border",
    text: "text-white",
    requirements: "30-day global streak",
    rewards: "White Master title + Temple Mode + prophecy maps"
  },
  {
    title: "BLACK CANDIDATE",
    floors: [7],
    roomRange: "38-40 Rooms Mastered",
    color: "gray",
    bg: "bg-gray-800",
    text: "text-gray-300",
    requirements: "45-day global streak + Floor 7 assessment",
    rewards: "Black Candidate title + Shadow Chains"
  },
  {
    title: "BLACK MASTER",
    floors: [8],
    roomRange: "41+ Rooms Mastered",
    color: "black",
    bg: "bg-black",
    text: "text-white",
    requirements: "60-day global streak + Floor 8 exam (95% required)",
    rewards: "Black Master title + Black Palace Mode + Prophetic Lattice Engine + Mentor privileges + 8th-floor Revelation Chamber"
  }
];

export const FloorProgressTower: React.FC<FloorProgressTowerProps> = ({
  floors,
  globalTitle,
}) => {
  const [openSections, setOpenSections] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Calculate total rooms mastered and which group is active
  const totalRoomsMastered = floors.reduce((sum, f) => sum + f.rooms_completed, 0);

  const getGroupStatus = (group: typeof MASTER_TITLE_GROUPS[0]) => {
    const groupFloors = group.floors.map(fn => floors.find(f => f.floor_number === fn));
    const completedRooms = groupFloors.reduce((sum, f) => sum + (f?.rooms_completed || 0), 0);
    const totalRooms = groupFloors.reduce((sum, f) => sum + (f?.rooms_required || 0), 0);
    const roomsRemaining = totalRooms - completedRooms;
    const allComplete = groupFloors.every(f => f?.floor_completed_at);
    const isActive = group.floors.includes(globalTitle?.current_floor);

    return { completedRooms, totalRooms, roomsRemaining, allComplete, isActive };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-6 w-6" />
          Global Master Titles
        </CardTitle>
        <CardDescription>
          Master rooms to unlock prestigious titles across the Palace
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
                        {group.title} — {group.roomRange}
                      </h3>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${openSections.includes(index) ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>

                  <CollapsibleContent className="animate-accordion-down">
                    <div className="px-4 pb-4 space-y-2">
                      <div>
                        <span className="font-bold">Requirements: </span>
                        <span className="text-muted-foreground">{group.requirements}</span>
                      </div>
                      <div>
                        <span className="font-bold">Reward: </span>
                        <span className="text-muted-foreground">{group.rewards}</span>
                      </div>
                      
                      {/* Floor links */}
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
                                Floor {floorNum}: {floor.rooms_completed}/{floor.rooms_required} rooms
                              </span>
                              {floor.floor_completed_at && (
                                <Badge variant="default" className="bg-green-500 text-xs">✓</Badge>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {status.roomsRemaining > 0 && (
                        <p className="text-sm text-primary mt-2">
                          {status.roomsRemaining} more {status.roomsRemaining === 1 ? 'room' : 'rooms'} to unlock
                        </p>
                      )}
                      
                      {status.isActive && !status.allComplete && (
                        <Badge variant="default" className="mt-2">
                          Current Level
                        </Badge>
                      )}
                      {status.allComplete && (
                        <Badge variant="default" className="mt-2 bg-green-500">
                          ✓ Completed
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
