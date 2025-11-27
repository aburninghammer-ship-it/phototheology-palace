import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Castle, Gem, Layers, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface PTIntegrationPanelProps {
  onInsert: (text: string) => void;
  themePassage?: string;
}

// PT Room definitions
const PT_ROOMS = [
  { code: "SR", name: "Story Room", floor: 1, description: "Biblical narratives as mental movies" },
  { code: "IR", name: "Imagination Room", floor: 1, description: "Immersive story experience" },
  { code: "TR", name: "Translation Room", floor: 1, description: "Words become images" },
  { code: "GR", name: "Gems Room", floor: 1, description: "Treasure chest of insights" },
  { code: "OR", name: "Observation Room", floor: 2, description: "Detective's notebook" },
  { code: "DC", name: "Def-Com Room", floor: 2, description: "Forensic word study" },
  { code: "ST", name: "Symbols/Types Room", floor: 2, description: "God's universal language" },
  { code: "QR", name: "Questions Room", floor: 2, description: "Interrogation of the text" },
  { code: "CR", name: "Concentration Room", floor: 4, description: "Christ-centered focus" },
  { code: "DR", name: "Dimensions Room", floor: 4, description: "5 layers of meaning" },
  { code: "PRm", name: "Patterns Room", floor: 4, description: "God's fingerprints" },
  { code: "BL", name: "Blue Room (Sanctuary)", floor: 5, description: "Architectural blueprint" },
  { code: "PR", name: "Prophecy Room", floor: 5, description: "Telescope of timelines" },
  { code: "3A", name: "Three Angels Room", floor: 5, description: "Final gospel messages" },
];

// Common biblical symbols
const SYMBOLS = [
  { symbol: "Lamb", meaning: "Christ (John 1:29)", verses: ["John 1:29", "Rev 5:6"] },
  { symbol: "Rock", meaning: "Christ (1 Cor 10:4)", verses: ["1 Cor 10:4", "Matt 16:18"] },
  { symbol: "Light", meaning: "Truth/Christ (John 8:12)", verses: ["John 8:12", "1 John 1:5"] },
  { symbol: "Water", meaning: "Spirit/Word (John 7:38)", verses: ["John 7:38", "Eph 5:26"] },
  { symbol: "Bread", meaning: "Word/Christ (John 6:35)", verses: ["John 6:35", "Matt 4:4"] },
  { symbol: "Vine", meaning: "Christ (John 15:5)", verses: ["John 15:5", "Isa 5:7"] },
  { symbol: "Door", meaning: "Christ (John 10:9)", verses: ["John 10:9", "Rev 3:20"] },
  { symbol: "Shepherd", meaning: "Christ (John 10:11)", verses: ["John 10:11", "Ps 23:1"] },
  { symbol: "Fire", meaning: "Spirit/Judgment", verses: ["Acts 2:3", "Heb 12:29"] },
  { symbol: "Oil", meaning: "Holy Spirit", verses: ["1 Sam 16:13", "Matt 25:4"] },
];

export function PTIntegrationPanel({ onInsert, themePassage }: PTIntegrationPanelProps) {
  const [open, setOpen] = useState(false);
  const [userGems, setUserGems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadUserGems();
    }
  }, [open]);

  const loadUserGems = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("gems")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setUserGems(data || []);
    } catch (error) {
      console.error("Error loading gems:", error);
    } finally {
      setLoading(false);
    }
  };

  const insertRoom = (room: typeof PT_ROOMS[0]) => {
    const text = `[PT: ${room.code} - ${room.name}]\n${room.description}`;
    onInsert(text);
    setOpen(false);
  };

  const insertSymbol = (symbol: typeof SYMBOLS[0]) => {
    const text = `[Symbol: ${symbol.symbol}]\nMeaning: ${symbol.meaning}\nKey verses: ${symbol.verses.join(", ")}`;
    onInsert(text);
    setOpen(false);
  };

  const insertGem = (gem: any) => {
    const text = `[Gem: ${gem.title}]\nVerses: ${gem.verse1}, ${gem.verse2}, ${gem.verse3}\nConnection: ${gem.connection_explanation}`;
    onInsert(text);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Castle className="w-4 h-4" />
          PT Tools
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Castle className="w-5 h-5" />
            Phototheology Integration
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rooms" className="gap-1">
              <Layers className="w-4 h-4" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="symbols" className="gap-1">
              <BookOpen className="w-4 h-4" />
              Symbols
            </TabsTrigger>
            <TabsTrigger value="gems" className="gap-1">
              <Gem className="w-4 h-4" />
              My Gems
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {PT_ROOMS.map((room) => (
                  <Card
                    key={room.code}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => insertRoom(room)}
                  >
                    <CardContent className="py-3 px-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Floor {room.floor}
                          </Badge>
                          <span className="font-medium">{room.code}</span>
                          <span className="text-muted-foreground">—</span>
                          <span>{room.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="symbols">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {SYMBOLS.map((symbol) => (
                  <Card
                    key={symbol.symbol}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => insertSymbol(symbol)}
                  >
                    <CardContent className="py-3 px-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">{symbol.symbol}</span>
                          <span className="text-muted-foreground">→</span>
                          <span>{symbol.meaning}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {symbol.verses.join(", ")}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="gems">
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : userGems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Gem className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No gems saved yet</p>
                  <p className="text-sm">Create gems in the Study tab to use them here</p>
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {userGems.map((gem) => (
                    <Card
                      key={gem.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => insertGem(gem)}
                    >
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{gem.title}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {gem.connection_explanation}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
