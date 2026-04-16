import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Church, Scroll, Music, Skull, Clock } from "lucide-react";

interface TimelineEvent {
  name: string;
  period: string;
  startYear: number;
  endYear: number;
  description: string;
  color: string;
  icon?: string;
}

const SEVEN_CHURCHES: TimelineEvent[] = [
  { name: "Ephesus", period: "31-100 AD", startYear: 31, endYear: 100, description: "Apostolic church - lost first love", color: "bg-blue-500", icon: "1" },
  { name: "Smyrna", period: "100-313 AD", startYear: 100, endYear: 313, description: "Persecuted church - faithful unto death", color: "bg-red-500", icon: "2" },
  { name: "Pergamos", period: "313-538 AD", startYear: 313, endYear: 538, description: "Compromising church - Satan's seat", color: "bg-orange-500", icon: "3" },
  { name: "Thyatira", period: "538-1517 AD", startYear: 538, endYear: 1517, description: "Papal dominance - Jezebel's corruption", color: "bg-purple-500", icon: "4" },
  { name: "Sardis", period: "1517-1798 AD", startYear: 1517, endYear: 1798, description: "Reformation church - spiritually dead", color: "bg-gray-500", icon: "5" },
  { name: "Philadelphia", period: "1798-1844 AD", startYear: 1798, endYear: 1844, description: "Revival church - open door", color: "bg-green-500", icon: "6" },
  { name: "Laodicea", period: "1844-End", startYear: 1844, endYear: 2030, description: "End-time church - lukewarm", color: "bg-amber-500", icon: "7" },
];

const SEVEN_SEALS: TimelineEvent[] = [
  { name: "White Horse", period: "31-100 AD", startYear: 31, endYear: 100, description: "Gospel conquering in purity", color: "bg-white border-2 border-gray-300", icon: "1" },
  { name: "Red Horse", period: "100-313 AD", startYear: 100, endYear: 313, description: "Persecution and martyrdom", color: "bg-red-600", icon: "2" },
  { name: "Black Horse", period: "313-538 AD", startYear: 313, endYear: 538, description: "Compromise and spiritual famine", color: "bg-gray-800", icon: "3" },
  { name: "Pale Horse", period: "538-1517 AD", startYear: 538, endYear: 1517, description: "Death and papal darkness", color: "bg-emerald-300", icon: "4" },
  { name: "Martyrs Cry", period: "1517-1798 AD", startYear: 1517, endYear: 1798, description: "Reformation martyrs await justice", color: "bg-rose-400", icon: "5" },
  { name: "Signs", period: "1755-1833 AD", startYear: 1755, endYear: 1833, description: "Earthquake, Dark Day, Falling Stars", color: "bg-indigo-500", icon: "6" },
  { name: "Silence", period: "1844-End", startYear: 1844, endYear: 2030, description: "Judgment and close of probation", color: "bg-slate-400", icon: "7" },
];

const SEVEN_TRUMPETS: TimelineEvent[] = [
  { name: "Jerusalem Falls", period: "70 AD", startYear: 70, endYear: 100, description: "Roman destruction of Jerusalem", color: "bg-orange-600", icon: "1" },
  { name: "Rome Falls", period: "476 AD", startYear: 400, endYear: 500, description: "Western Roman Empire collapses", color: "bg-red-700", icon: "2" },
  { name: "Wormwood", period: "Dark Ages", startYear: 500, endYear: 800, description: "Apostate Christianity poisons truth", color: "bg-green-700", icon: "3" },
  { name: "Darkness", period: "Dark Ages", startYear: 800, endYear: 1100, description: "Gospel light obscured", color: "bg-gray-700", icon: "4" },
  { name: "Locusts (Islam)", period: "1299-1449", startYear: 1299, endYear: 1449, description: "Rise of Islam - 150 years", color: "bg-yellow-600", icon: "5" },
  { name: "Euphrates", period: "1449-1840", startYear: 1449, endYear: 1840, description: "Ottoman Turks - 391 years", color: "bg-teal-600", icon: "6" },
  { name: "Kingdom", period: "1844-End", startYear: 1844, endYear: 2030, description: "Judgment hour begins", color: "bg-gold-500 bg-amber-400", icon: "7" },
];

const KEY_DATES = [
  { year: 31, label: "Christ's Death", description: "Beginning of Christian era" },
  { year: 70, label: "Jerusalem Falls", description: "Temple destroyed" },
  { year: 313, label: "Constantine", description: "Christianity legalized" },
  { year: 476, label: "Rome Falls", description: "Western Empire ends" },
  { year: 538, label: "Papal Supremacy", description: "1260 years begin" },
  { year: 1517, label: "Reformation", description: "Luther's 95 Theses" },
  { year: 1755, label: "Lisbon Earthquake", description: "First sign" },
  { year: 1780, label: "Dark Day", description: "Second sign" },
  { year: 1798, label: "Deadly Wound", description: "Pope captured" },
  { year: 1833, label: "Falling Stars", description: "Third sign" },
  { year: 1844, label: "Judgment", description: "Investigative judgment begins" },
];

export const ProphecyTimeline = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);

  const minYear = 0;
  const maxYear = 2030;
  const totalYears = maxYear - minYear;

  const getPosition = (year: number) => {
    return ((year - minYear) / totalYears) * 100;
  };

  const getWidth = (start: number, end: number) => {
    return ((end - start) / totalYears) * 100;
  };

  const renderTimelineRow = (events: TimelineEvent[], label: string, icon: React.ReactNode) => (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-24 flex-shrink-0 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="flex-1 relative h-10 bg-muted/30 rounded-lg overflow-hidden">
        {events.map((event, idx) => (
          <div
            key={idx}
            className={`absolute h-full ${event.color} rounded cursor-pointer transition-all hover:opacity-80 hover:z-10 hover:scale-y-110 flex items-center justify-center`}
            style={{
              left: `${getPosition(event.startYear)}%`,
              width: `${Math.max(getWidth(event.startYear, event.endYear), 2)}%`,
            }}
            onMouseEnter={() => setHoveredEvent(event)}
            onMouseLeave={() => setHoveredEvent(null)}
          >
            <span className="text-xs font-bold text-white drop-shadow-md truncate px-1">
              {event.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderKeyDates = () => (
    <div className="relative h-8 mb-4">
      {KEY_DATES.map((date, idx) => (
        <div
          key={idx}
          className="absolute transform -translate-x-1/2"
          style={{ left: `${getPosition(date.year)}%` }}
        >
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-3 bg-primary/50" />
            <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap transform -rotate-45 origin-top-left mt-1">
              {date.year}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Prophecy Timeline
        </CardTitle>
        <CardDescription>
          Visual overview of the Seven Churches, Seals, and Trumpets through history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="churches">Churches</TabsTrigger>
            <TabsTrigger value="seals">Seals</TabsTrigger>
            <TabsTrigger value="trumpets">Trumpets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <ScrollArea className="w-full">
              <div className="min-w-[800px] p-4">
                {renderKeyDates()}
                {renderTimelineRow(SEVEN_CHURCHES, "Churches", <Church className="h-4 w-4" />)}
                {renderTimelineRow(SEVEN_SEALS, "Seals", <Scroll className="h-4 w-4" />)}
                {renderTimelineRow(SEVEN_TRUMPETS, "Trumpets", <Music className="h-4 w-4" />)}

                {/* Hover tooltip */}
                {hoveredEvent && (
                  <div className="mt-4 p-4 bg-accent/50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-4 h-4 rounded ${hoveredEvent.color}`} />
                      <span className="font-semibold">{hoveredEvent.name}</span>
                      <Badge variant="outline">{hoveredEvent.period}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{hoveredEvent.description}</p>
                  </div>
                )}

                {/* Legend */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3">Parallel Structure</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Notice how the Churches, Seals, and Trumpets align chronologically, revealing God's consistent work through history.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="font-medium">1st Period:</span> Apostolic purity
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="font-medium">2nd-4th:</span> Persecution & Compromise
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="font-medium">5th-6th:</span> Reformation & Signs
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="font-medium">7th:</span> Judgment Era (1844+)
                    </div>
                  </div>
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="churches" className="mt-6">
            <div className="grid gap-3">
              {SEVEN_CHURCHES.map((church, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${church.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {church.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{church.name}</span>
                      <Badge variant="outline" className="text-xs">{church.period}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{church.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="seals" className="mt-6">
            <div className="grid gap-3">
              {SEVEN_SEALS.map((seal, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${seal.color} flex items-center justify-center font-bold text-sm flex-shrink-0 ${seal.name === "White Horse" ? "text-gray-800" : "text-white"}`}>
                    {seal.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{seal.name}</span>
                      <Badge variant="outline" className="text-xs">{seal.period}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{seal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trumpets" className="mt-6">
            <div className="grid gap-3">
              {SEVEN_TRUMPETS.map((trumpet, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${trumpet.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {trumpet.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{trumpet.name}</span>
                      <Badge variant="outline" className="text-xs">{trumpet.period}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{trumpet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProphecyTimeline;
