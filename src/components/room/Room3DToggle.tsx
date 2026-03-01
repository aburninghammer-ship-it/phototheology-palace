import { useState, lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, BookOpen, Boxes } from "lucide-react";

// Lazy load 3D viewers for performance
const StoryRoom3DViewer = lazy(() => import("@/components/story-room/StoryRoom3DViewer").then(m => ({ default: m.StoryRoom3DViewer })));
const Imagination3DViewer = lazy(() => import("@/components/imagination/Imagination3DViewer"));
const Gems3DViewer = lazy(() => import("@/components/gems-room/Gems3DViewer").then(m => ({ default: m.Gems3DViewer })));
const Symbols3DViewer = lazy(() => import("@/components/symbol-room/Symbols3DViewer").then(m => ({ default: m.Symbols3DViewer })));
const Prophecy3DViewer = lazy(() => import("@/components/prophecy-room/Prophecy3DViewer").then(m => ({ default: m.Prophecy3DViewer })));
const ThreeHeavens3DViewer = lazy(() => import("@/components/three-heavens-room/ThreeHeavens3DViewer").then(m => ({ default: m.ThreeHeavens3DViewer })));
const Sanctuary3DViewer = lazy(() => import("@/components/sanctuary/Sanctuary3DViewer").then(m => ({ default: m.Sanctuary3DViewer })));

// Map of room IDs to their 3D viewer components
const ROOM_3D_VIEWERS: Record<string, { component: React.LazyExoticComponent<any>; name: string }> = {
  sr: { component: StoryRoom3DViewer, name: "Story Room" },
  ir: { component: Imagination3DViewer, name: "Imagination Room" },
  gr: { component: Gems3DViewer, name: "Gems Room" },
  st: { component: Symbols3DViewer, name: "Symbols/Types Room" },
  pr: { component: Prophecy3DViewer, name: "Prophecy Room" },
  "123h": { component: ThreeHeavens3DViewer, name: "Three Heavens Room" },
  bl: { component: Sanctuary3DViewer, name: "Blue Room (Sanctuary)" },
};

// Check if a room has a 3D viewer available
export function has3DViewer(roomId: string): boolean {
  return roomId in ROOM_3D_VIEWERS;
}

interface Room3DToggleProps {
  roomId: string;
  children: React.ReactNode; // The 2D content (library)
}

function Viewer3DLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading 3D Experience...</p>
    </div>
  );
}

export function Room3DToggle({ roomId, children }: Room3DToggleProps) {
  const [view, setView] = useState<"2d" | "3d">("2d");
  
  const viewer3DConfig = ROOM_3D_VIEWERS[roomId];
  
  // If no 3D viewer exists for this room, just render the children
  if (!viewer3DConfig) {
    return <>{children}</>;
  }

  const Viewer3D = viewer3DConfig.component;

  return (
    <div className="space-y-4">
      <Tabs value={view} onValueChange={(v) => setView(v as "2d" | "3d")} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4">
          <TabsTrigger value="2d" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Library View</span>
          </TabsTrigger>
          <TabsTrigger value="3d" className="flex items-center gap-2">
            <Boxes className="h-4 w-4" />
            <span>3D Experience</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="2d" className="mt-0">
          {children}
        </TabsContent>

        <TabsContent value="3d" className="mt-0">
          <Card className="border-2 border-primary/20 bg-background/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <Suspense fallback={<Viewer3DLoader />}>
                <div 
                  className="min-h-[600px] touch-pan-y"
                  style={{ touchAction: 'pan-y pinch-zoom' }}
                >
                  <Viewer3D />
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
