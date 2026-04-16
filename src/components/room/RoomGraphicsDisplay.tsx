import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, LayoutGrid, BookOpen, Lightbulb } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Floor 1 Graphics
import { StoryRoomFlowchart, StoryRoomConcept, StoryRoomExample } from '@/components/room-graphics/floor1/StoryRoomGraphics';
import { ImaginationRoomFlowchart, ImaginationRoomConcept, ImaginationRoomExample } from '@/components/room-graphics/floor1/ImaginationRoomGraphics';
import { TwentyFourFPSFlowchart, TwentyFourFPSConcept, TwentyFourFPSExample } from '@/components/room-graphics/floor1/TwentyFourFPSGraphics';
import { BibleRenderedFlowchart, BibleRenderedConcept, BibleRenderedExample } from '@/components/room-graphics/floor1/BibleRenderedGraphics';
import { TranslationRoomFlowchart, TranslationRoomConcept, TranslationRoomExample } from '@/components/room-graphics/floor1/TranslationRoomGraphics';
import { GemsRoomFlowchart, GemsRoomConcept, GemsRoomExample } from '@/components/room-graphics/floor1/GemsRoomGraphics';

// Floor 2 Graphics
import { ObservationRoomFlowchart, ObservationRoomConcept, ObservationRoomExample } from '@/components/room-graphics/floor2/ObservationRoomGraphics';
import { DefComRoomFlowchart, DefComRoomConcept, DefComRoomExample } from '@/components/room-graphics/floor2/DefComRoomGraphics';
import { SymbolsTypesFlowchart, SymbolsTypesConcept, SymbolsTypesExample } from '@/components/room-graphics/floor2/SymbolsTypesRoomGraphics';
import { QuestionsRoomFlowchart, QuestionsRoomConcept, QuestionsRoomExample } from '@/components/room-graphics/floor2/QuestionsRoomGraphics';
import { QAChainsFlowchart, QAChainsConcept, QAChainsExample } from '@/components/room-graphics/floor2/QAChainsRoomGraphics';

// Floor 3 Graphics
import { NatureFreestyleFlowchart, NatureFreestyleConcept, NatureFreestyleExample } from '@/components/room-graphics/floor3/NatureFreestyleGraphics';
import { PersonalFreestyleFlowchart, PersonalFreestyleConcept, PersonalFreestyleExample } from '@/components/room-graphics/floor3/PersonalFreestyleGraphics';
import { BibleFreestyleFlowchart, BibleFreestyleConcept, BibleFreestyleExample } from '@/components/room-graphics/floor3/BibleFreestyleGraphics';
import { HistoryFreestyleFlowchart, HistoryFreestyleConcept, HistoryFreestyleExample } from '@/components/room-graphics/floor3/HistoryFreestyleGraphics';
import { ListeningRoomFlowchart, ListeningRoomConcept, ListeningRoomExample } from '@/components/room-graphics/floor3/ListeningRoomGraphics';

// Floor 4 Graphics
import { ConcentrationRoomFlowchart, ConcentrationRoomConcept, ConcentrationRoomExample } from '@/components/room-graphics/floor4/ConcentrationRoomGraphics';
import { DimensionsRoomFlowchart, DimensionsRoomConcept, DimensionsRoomExample } from '@/components/room-graphics/floor4/DimensionsRoomGraphics';
import { Connect6Flowchart, Connect6Concept, Connect6Example } from '@/components/room-graphics/floor4/Connect6RoomGraphics';
import { ThemeRoomFlowchart, ThemeRoomConcept, ThemeRoomExample } from '@/components/room-graphics/floor4/ThemeRoomGraphics';
import { TimeZoneFlowchart, TimeZoneConcept, TimeZoneExample } from '@/components/room-graphics/floor4/TimeZoneRoomGraphics';
import { PatternsRoomFlowchart, PatternsRoomConcept, PatternsRoomExample } from '@/components/room-graphics/floor4/PatternsRoomGraphics';
import { ParallelsRoomFlowchart, ParallelsRoomConcept, ParallelsRoomExample } from '@/components/room-graphics/floor4/ParallelsRoomGraphics';
import { FruitRoomFlowchart, FruitRoomConcept, FruitRoomExample } from '@/components/room-graphics/floor4/FruitRoomGraphics';

// Floor 5 Graphics
import { SanctuaryRoomFlowchart, SanctuaryRoomConcept, SanctuaryRoomExample } from '@/components/room-graphics/floor5/SanctuaryRoomGraphics';
import { ProphecyRoomFlowchart, ProphecyRoomConcept, ProphecyRoomExample } from '@/components/room-graphics/floor5/ProphecyRoomGraphics';
import { ThreeAngelsFlowchart, ThreeAngelsConcept, ThreeAngelsExample } from '@/components/room-graphics/floor5/ThreeAngelsRoomGraphics';
import { FeastsRoomFlowchart, FeastsRoomConcept, FeastsRoomExample } from '@/components/room-graphics/floor5/FeastsRoomGraphics';
import { ChristEveryChapterFlowchart, ChristEveryChapterConcept, ChristEveryChapterExample } from '@/components/room-graphics/floor5/ChristEveryChapterGraphics';
import { Room66Flowchart, Room66Concept, Room66Example } from '@/components/room-graphics/floor5/Room66Graphics';

// Floor 6 Graphics
import { ThreeHeavensFlowchart, ThreeHeavensConcept, ThreeHeavensExample } from '@/components/room-graphics/floor6/ThreeHeavensRoomGraphics';
import { EightCyclesFlowchart, EightCyclesConcept, EightCyclesExample } from '@/components/room-graphics/floor6/EightCyclesRoomGraphics';
import { JuiceRoomFlowchart, JuiceRoomConcept, JuiceRoomExample } from '@/components/room-graphics/floor6/JuiceRoomGraphics';
import { MathematicsRoomFlowchart, MathematicsRoomConcept, MathematicsRoomExample } from '@/components/room-graphics/floor6/MathematicsRoomGraphics';

// Floor 7 Graphics
import { FireRoomFlowchart, FireRoomConcept, FireRoomExample } from '@/components/room-graphics/floor7/FireRoomGraphics';
import { MeditationRoomFlowchart, MeditationRoomConcept, MeditationRoomExample } from '@/components/room-graphics/floor7/MeditationRoomGraphics';
import { SpeedRoomFlowchart, SpeedRoomConcept, SpeedRoomExample } from '@/components/room-graphics/floor7/SpeedRoomGraphics';

// Graphics registry - maps roomId to components
const GRAPHICS_REGISTRY: Record<string, {
  flowchart: React.FC;
  concept: React.FC;
  example: React.FC;
}> = {
  // Floor 1
  sr: { flowchart: StoryRoomFlowchart, concept: StoryRoomConcept, example: StoryRoomExample },
  ir: { flowchart: ImaginationRoomFlowchart, concept: ImaginationRoomConcept, example: ImaginationRoomExample },
  '24fps': { flowchart: TwentyFourFPSFlowchart, concept: TwentyFourFPSConcept, example: TwentyFourFPSExample },
  br: { flowchart: BibleRenderedFlowchart, concept: BibleRenderedConcept, example: BibleRenderedExample },
  tr: { flowchart: TranslationRoomFlowchart, concept: TranslationRoomConcept, example: TranslationRoomExample },
  gr: { flowchart: GemsRoomFlowchart, concept: GemsRoomConcept, example: GemsRoomExample },
  // Floor 2
  or: { flowchart: ObservationRoomFlowchart, concept: ObservationRoomConcept, example: ObservationRoomExample },
  dc: { flowchart: DefComRoomFlowchart, concept: DefComRoomConcept, example: DefComRoomExample },
  st: { flowchart: SymbolsTypesFlowchart, concept: SymbolsTypesConcept, example: SymbolsTypesExample },
  qr: { flowchart: QuestionsRoomFlowchart, concept: QuestionsRoomConcept, example: QuestionsRoomExample },
  qa: { flowchart: QAChainsFlowchart, concept: QAChainsConcept, example: QAChainsExample },
  // Floor 3
  nf: { flowchart: NatureFreestyleFlowchart, concept: NatureFreestyleConcept, example: NatureFreestyleExample },
  pf: { flowchart: PersonalFreestyleFlowchart, concept: PersonalFreestyleConcept, example: PersonalFreestyleExample },
  bf: { flowchart: BibleFreestyleFlowchart, concept: BibleFreestyleConcept, example: BibleFreestyleExample },
  hf: { flowchart: HistoryFreestyleFlowchart, concept: HistoryFreestyleConcept, example: HistoryFreestyleExample },
  lr: { flowchart: ListeningRoomFlowchart, concept: ListeningRoomConcept, example: ListeningRoomExample },
  // Floor 4
  cr: { flowchart: ConcentrationRoomFlowchart, concept: ConcentrationRoomConcept, example: ConcentrationRoomExample },
  dr: { flowchart: DimensionsRoomFlowchart, concept: DimensionsRoomConcept, example: DimensionsRoomExample },
  c6: { flowchart: Connect6Flowchart, concept: Connect6Concept, example: Connect6Example },
  trm: { flowchart: ThemeRoomFlowchart, concept: ThemeRoomConcept, example: ThemeRoomExample },
  tz: { flowchart: TimeZoneFlowchart, concept: TimeZoneConcept, example: TimeZoneExample },
  prm: { flowchart: PatternsRoomFlowchart, concept: PatternsRoomConcept, example: PatternsRoomExample },
  'p||': { flowchart: ParallelsRoomFlowchart, concept: ParallelsRoomConcept, example: ParallelsRoomExample },
  frt: { flowchart: FruitRoomFlowchart, concept: FruitRoomConcept, example: FruitRoomExample },
  // Floor 5
  bl: { flowchart: SanctuaryRoomFlowchart, concept: SanctuaryRoomConcept, example: SanctuaryRoomExample },
  pr: { flowchart: ProphecyRoomFlowchart, concept: ProphecyRoomConcept, example: ProphecyRoomExample },
  '3a': { flowchart: ThreeAngelsFlowchart, concept: ThreeAngelsConcept, example: ThreeAngelsExample },
  fe: { flowchart: FeastsRoomFlowchart, concept: FeastsRoomConcept, example: FeastsRoomExample },
  cec: { flowchart: ChristEveryChapterFlowchart, concept: ChristEveryChapterConcept, example: ChristEveryChapterExample },
  r66: { flowchart: Room66Flowchart, concept: Room66Concept, example: Room66Example },
  // Floor 6
  '123h': { flowchart: ThreeHeavensFlowchart, concept: ThreeHeavensConcept, example: ThreeHeavensExample },
  cycles: { flowchart: EightCyclesFlowchart, concept: EightCyclesConcept, example: EightCyclesExample },
  jr: { flowchart: JuiceRoomFlowchart, concept: JuiceRoomConcept, example: JuiceRoomExample },
  math: { flowchart: MathematicsRoomFlowchart, concept: MathematicsRoomConcept, example: MathematicsRoomExample },
  // Floor 7
  frm: { flowchart: FireRoomFlowchart, concept: FireRoomConcept, example: FireRoomExample },
  mr: { flowchart: MeditationRoomFlowchart, concept: MeditationRoomConcept, example: MeditationRoomExample },
  srm: { flowchart: SpeedRoomFlowchart, concept: SpeedRoomConcept, example: SpeedRoomExample },
};

interface RoomGraphicsDisplayProps {
  roomId: string;
  roomName?: string;
  defaultExpanded?: boolean;
  variant?: 'full' | 'compact';
}

export function RoomGraphicsDisplay({ 
  roomId, 
  roomName,
  defaultExpanded = false,
  variant = 'full'
}: RoomGraphicsDisplayProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const graphics = GRAPHICS_REGISTRY[roomId];
  
  if (!graphics) {
    return null;
  }

  const { flowchart: Flowchart, concept: Concept, example: Example } = graphics;

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border">
          <Flowchart />
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <Card className="border-secondary/30 bg-gradient-to-br from-secondary/5 to-primary/5 overflow-hidden">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-secondary to-primary rounded-xl shadow-lg">
                  <LayoutGrid className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-xl font-bold">📊 At-a-Glance Graphics</CardTitle>
                  <CardDescription className="text-sm">
                    Visual guides: flowcharts, concepts & examples
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">3 diagrams</Badge>
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Tabs defaultValue="flowchart" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="flowchart" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Method</span>
                </TabsTrigger>
                <TabsTrigger value="concept" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Concept</span>
                </TabsTrigger>
                <TabsTrigger value="example" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Example</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="flowchart" className="mt-0">
                <div className="p-4 bg-background rounded-xl border overflow-x-auto">
                  <Flowchart />
                </div>
              </TabsContent>
              
              <TabsContent value="concept" className="mt-0">
                <div className="p-4 bg-background rounded-xl border overflow-x-auto">
                  <Concept />
                </div>
              </TabsContent>
              
              <TabsContent value="example" className="mt-0">
                <div className="p-4 bg-background rounded-xl border overflow-x-auto">
                  <Example />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// Helper to check if a room has graphics
export function hasRoomGraphics(roomId: string): boolean {
  return roomId in GRAPHICS_REGISTRY;
}

// Export the registry for the gallery page
export { GRAPHICS_REGISTRY };
