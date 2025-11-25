import { useState } from "react";
import { PalaceMap } from "@/components/bible/PalaceMap";
import { ThemeCrossReference } from "@/components/bible/ThemeCrossReference";
import { PTCodeSearch } from "@/components/bible/PTCodeSearch";
import { Card } from "@/components/ui/card";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { Building2, Info, Map, Search, Tag, BookOpen } from "lucide-react";

export default function PalaceExplorer() {
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
              Palace Explorer
            </h1>
          </div>
          <HowItWorksDialog
            title="How to Use Palace Explorer"
            steps={[
              {
                title: "Interactive Palace Map",
                description: "Click on any floor or room in the visual palace map to explore its details and associated principles.",
                highlights: [
                  "8 floors representing PT levels",
                  "Click rooms to see details",
                  "Visual navigation system"
                ],
                icon: Map,
              },
              {
                title: "PT Code Search",
                description: "Search for any Phototheology code (like @Mo, CR, TRm) to instantly find its meaning, floor location, and related principles.",
                highlights: [
                  "Search by code or name",
                  "Find floors and rooms",
                  "Learn principle meanings"
                ],
                icon: Search,
              },
              {
                title: "Selected Room Details",
                description: "When you click a room on the map, its name and code appear in the left panel for quick reference.",
                highlights: [
                  "Shows room code",
                  "Displays full name",
                  "Quick identification"
                ],
                icon: Tag,
              },
              {
                title: "Theme Cross-Reference",
                description: "Use the theme selector to see how different biblical themes connect across the palace structure.",
                highlights: [
                  "Browse by theme",
                  "See cross-connections",
                  "Understand relationships"
                ],
                icon: BookOpen,
              },
            ]}
          />
        </div>
        <p className="text-muted-foreground">
          Navigate the Phototheology Palace, search rooms, and discover theme connections
        </p>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-2 border-blue-500/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-foreground">Welcome to the Palace</p>
            <p className="text-xs text-muted-foreground">
              This tool helps you visualize the 8-floor Phototheology structure, search by PT codes, 
              and explore thematic connections across Scripture. Use the map to navigate rooms, 
              search for PT codes (CR, @CyC, 1H), and find verses tagged with the same themes.
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
              <h4 className="font-semibold text-sm mb-2 text-foreground">Selected Room</h4>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-purple-600 text-white px-3 py-1 rounded">
                  {selectedRoom.code}
                </code>
                <span className="text-sm text-foreground">{selectedRoom.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Search below to find verses using this principle
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
