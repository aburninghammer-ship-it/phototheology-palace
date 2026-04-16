import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Layout, Clock, BookOpen, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface SanctuaryMapping {
  article: string;
  connection: string;
  verses: number[];
  significance: string;
}

interface TimelineEvent {
  period: string;
  horizon: string;
  description: string;
  verses: number[];
}

interface ExegesisData {
  sanctuary: SanctuaryMapping[];
  timeline: TimelineEvent[];
  cycles: { cycle: string; description: string; verses: number[] }[];
}

interface VisualExegesisLayerProps {
  book: string;
  chapter: number;
  chapterText: string;
  onHighlightVerses?: (verses: number[]) => void;
}

const SANCTUARY_COLORS: Record<string, string> = {
  "Gate": "bg-amber-500/20 border-amber-500/50 text-amber-700 dark:text-amber-300",
  "Altar": "bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300",
  "Laver": "bg-blue-500/20 border-blue-500/50 text-blue-700 dark:text-blue-300",
  "Lampstand": "bg-yellow-500/20 border-yellow-500/50 text-yellow-700 dark:text-yellow-300",
  "Table": "bg-orange-500/20 border-orange-500/50 text-orange-700 dark:text-orange-300",
  "Incense": "bg-purple-500/20 border-purple-500/50 text-purple-700 dark:text-purple-300",
  "Veil": "bg-indigo-500/20 border-indigo-500/50 text-indigo-700 dark:text-indigo-300",
  "Ark": "bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-300",
};

const HORIZON_ICONS: Record<string, string> = {
  "1H": "🏛️",
  "2H": "⛪",
  "3H": "✨",
};

export const VisualExegesisLayer = ({ book, chapter, chapterText, onHighlightVerses }: VisualExegesisLayerProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExegesisData | null>(null);
  const [activeTab, setActiveTab] = useState("sanctuary");
  const { toast } = useToast();

  const analyzeChapter = async () => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "visual-exegesis",
          book,
          chapter,
          chapterText,
        },
      });

      if (error) throw error;

      const content = response?.content || "";
      let cleanedContent = content
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '');
      
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setData(JSON.parse(jsonMatch[0]));
        toast({ title: "Visual Exegesis Complete", description: "Sanctuary and timeline layers mapped" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleHighlight = (verses: number[]) => {
    onHighlightVerses?.(verses);
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Visual Exegesis Layer
        </CardTitle>
        <CardDescription className="text-white/90">
          Sanctuary diagrams & prophetic timelines overlaid on text
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <Button
          onClick={analyzeChapter}
          disabled={loading}
          className="w-full gradient-royal text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Mapping Visual Layers...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze {book} {chapter}
            </>
          )}
        </Button>

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="sanctuary" className="flex-1">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Sanctuary
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex-1">
                    <Clock className="h-4 w-4 mr-1" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="cycles" className="flex-1">
                    🔄 Cycles
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[300px] mt-4">
                  <TabsContent value="sanctuary" className="space-y-3 m-0">
                    {data.sanctuary?.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${SANCTUARY_COLORS[item.article] || 'bg-muted'}`}
                        onClick={() => handleHighlight(item.verses)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="font-bold">
                            {item.article}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            v{item.verses.join(", ")}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{item.connection}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.significance}</p>
                      </div>
                    ))}
                    {(!data.sanctuary || data.sanctuary.length === 0) && (
                      <p className="text-center text-muted-foreground py-4">No sanctuary connections found</p>
                    )}
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-3 m-0">
                    {data.timeline?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border bg-card cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleHighlight(item.verses)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{HORIZON_ICONS[item.horizon] || "📅"}</span>
                          <Badge>{item.horizon}</Badge>
                          <span className="text-sm font-medium">{item.period}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-primary mt-1">Verses: {item.verses.join(", ")}</p>
                      </div>
                    ))}
                    {(!data.timeline || data.timeline.length === 0) && (
                      <p className="text-center text-muted-foreground py-4">No timeline events found</p>
                    )}
                  </TabsContent>

                  <TabsContent value="cycles" className="space-y-3 m-0">
                    {data.cycles?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border bg-gradient-to-r from-primary/5 to-secondary/5 cursor-pointer hover:from-primary/10 hover:to-secondary/10 transition-colors"
                        onClick={() => handleHighlight(item.verses)}
                      >
                        <Badge className="mb-2">{item.cycle}</Badge>
                        <p className="text-sm">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Verses: {item.verses.join(", ")}</p>
                      </div>
                    ))}
                    {(!data.cycles || data.cycles.length === 0) && (
                      <p className="text-center text-muted-foreground py-4">No cycle connections found</p>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
