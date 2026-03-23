import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Home, Info, Brain, Search, Grid3X3, Layers, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import BibleRenderedDrill from "@/components/rooms/BibleRenderedDrill";
import BibleRenderedBrowser from "@/components/rooms/BibleRenderedBrowser";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
              Compress the entire Bible into 51 symbolic glyphs — one per 24-chapter block
            </p>
          </div>
          <Badge variant="outline" className="hidden md:flex items-center gap-2">
            <BookOpen className="h-3 w-3" />
            Floor 1 · Furnishing
          </Badge>
        </div>

        {/* Core Concept Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              The Bible in 51 Symbols
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The Bible Rendered system compresses all 1,189 chapters into ~51 symbolic glyphs. 
              Each glyph represents a 24-chapter block, capturing its central movement in a single memorable image. 
              Master these symbols to carry the entire Bible in your mind.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-2xl mb-1">÷</div>
                <p className="text-xs font-medium">Gen 1–24</p>
                <p className="text-xs text-muted-foreground">Division</p>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-2xl mb-1">×</div>
                <p className="text-xs font-medium">Gen 25–50</p>
                <p className="text-xs text-muted-foreground">Multiplication</p>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-2xl mb-1">🩸</div>
                <p className="text-xs font-medium">Ex 1–24</p>
                <p className="text-xs text-muted-foreground">Deliverance</p>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-2xl mb-1">✝</div>
                <p className="text-xs font-medium">Luke–John</p>
                <p className="text-xs text-muted-foreground">The Cross</p>
              </div>
              <div className="p-3 rounded-lg bg-background border bg-blue-50/50 dark:bg-blue-950/20">
                <div className="text-2xl mb-1">🏙✨</div>
                <p className="text-xs font-medium">Rev 17–22</p>
                <p className="text-xs text-muted-foreground">Heaven</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Master all 51 symbols to scan the entire Bible in under a minute
            </p>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="glance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="browse" className="flex items-center gap-1 text-xs sm:text-sm">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Browse</span>
              <span className="sm:hidden">Browse</span>
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
          <TabsContent value="browse">
            <BibleRenderedBrowser />
          </TabsContent>
        </Tabs>

        {/* Room Info Accordion */}
        <Accordion type="single" collapsible className="bg-muted/30 rounded-lg">
          <AccordionItem value="about" className="border-none">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Info className="h-4 w-4" />
                About the Bible Rendered Room
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  The Bible Rendered Room zooms out even further than 24FPS. Instead of one image per chapter, 
                  you create one master image per 24-chapter block. This allows you to map the entire Bible with 
                  just 51 images — like watching a 40-second trailer of Scripture.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Core Question</h4>
                    <p>What single symbol captures this 24-chapter block's essence?</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Purpose</h4>
                    <p>
                      Carry the entire sweep of Genesis to Revelation as a panoramic mental movie 
                      you can replay anytime. Like an architect carrying a floorplan in his head.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">How to Use</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li><strong>Learn Mode:</strong> Study each set's symbol, range, and description</li>
                    <li><strong>Symbol → Range:</strong> See a symbol and recall its chapter range</li>
                    <li><strong>Range → Symbol:</strong> See a chapter range and recall its symbol</li>
                    <li><strong>Name → Symbol:</strong> See the set name and recall everything</li>
                    <li><strong>Full Quiz:</strong> Test yourself on all 51 sets at once</li>
                  </ol>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Footer />
    </div>
  );
};

export default BibleRenderedRoom;
