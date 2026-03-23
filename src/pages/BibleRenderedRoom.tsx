import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Home, Info, Brain, Grid3X3, Layers, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import BibleRenderedDrill from "@/components/rooms/BibleRenderedDrill";
import BibleRenderedGlance from "@/components/rooms/BibleRenderedGlance";
import BibleRenderedFlashcards from "@/components/rooms/BibleRenderedFlashcards";
import BibleRenderedSpeedScan from "@/components/rooms/BibleRenderedSpeedScan";

const BibleRenderedRoom = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="container max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate('/palace')}>
                <Home className="h-4 w-4" />
              </Button>
              <h1 className="text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
                Bible Rendered Room
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Memorize 51 symbols — one for every 24-chapter block of Scripture
            </p>
          </div>
          <Badge variant="outline" className="hidden md:flex items-center gap-2">
            <BookOpen className="h-3 w-3" />
            Floor 1 · Furnishing
          </Badge>
        </div>

        {/* Room Explanation */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              The Bible Rendered Room zooms out to the widest possible view. Instead of one image per chapter, 
              there is one master symbol per 24-chapter block — 51 symbols total. Memorize them and you can 
              mentally scan the entire Bible in under a minute, like an architect who carries the whole floorplan in his head.
            </p>
            <p>
              Use the tools below to learn, drill, and test your recall of all 51 symbols.
            </p>
          </CardContent>
        </Card>

        {/* Memory Exercise Tabs */}
        <Tabs defaultValue="glance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="glance" className="flex items-center gap-1 text-xs sm:text-sm">
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">At-a-Glance</span>
              <span className="sm:hidden">Glance</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-1 text-xs sm:text-sm">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Flashcards</span>
              <span className="sm:hidden">Cards</span>
            </TabsTrigger>
            <TabsTrigger value="speed" className="flex items-center gap-1 text-xs sm:text-sm">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Speed Scan</span>
              <span className="sm:hidden">Speed</span>
            </TabsTrigger>
            <TabsTrigger value="drill" className="flex items-center gap-1 text-xs sm:text-sm">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz Drill</span>
              <span className="sm:hidden">Quiz</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="glance">
            <BibleRenderedGlance />
          </TabsContent>
          <TabsContent value="flashcards">
            <BibleRenderedFlashcards />
          </TabsContent>
          <TabsContent value="speed">
            <BibleRenderedSpeedScan />
          </TabsContent>
          <TabsContent value="drill">
            <BibleRenderedDrill />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default BibleRenderedRoom;
