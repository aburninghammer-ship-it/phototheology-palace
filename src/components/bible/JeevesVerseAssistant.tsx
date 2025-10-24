import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Sparkles, Send, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { palaceFloors } from "@/data/palaceData";
import { JeevesResponseValidator } from "./JeevesResponseValidator";

interface JeevesVerseAssistantProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  onClose: () => void;
}

export const JeevesVerseAssistant = ({ book, chapter, verse, verseText, onClose }: JeevesVerseAssistantProps) => {
  const [question, setQuestion] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Define all individual principles organized by category
  const principles = {
    dimensions: [
      { id: "2D", tag: "2D", name: "Christ in Me", purpose: "Personal application - how Christ lives in me" },
      { id: "3D", tag: "3D", name: "Christ in Church", purpose: "Corporate application - Christ in the community of believers" },
      { id: "4D", tag: "4D", name: "Christ in Prophecy", purpose: "Prophetic application - Christ in redemptive history" },
      { id: "5D", tag: "5D", name: "Christ in Heaven", purpose: "Heavenly application - Christ in the sanctuary above" },
    ],
    cycles: [
      { id: "@Ad", tag: "@Ad", name: "Adam Cycle", purpose: "Creation to Fall covenant pattern" },
      { id: "@No", tag: "@No", name: "Noah Cycle", purpose: "Flood to new beginning covenant pattern" },
      { id: "@Ab", tag: "@Ab", name: "Abraham Cycle", purpose: "Promise to seed covenant pattern" },
      { id: "@Mo", tag: "@Mo", name: "Moses Cycle", purpose: "Exodus to Sinai covenant pattern" },
      { id: "@Cy", tag: "@Cy", name: "Cyrus Cycle", purpose: "Exile to return covenant pattern" },
      { id: "@CyC", tag: "@CyC", name: "Christ Cycle", purpose: "First advent incarnation pattern" },
      { id: "@Sp", tag: "@Sp", name: "Spirit Cycle", purpose: "Pentecost to church age pattern" },
      { id: "@Re", tag: "@Re", name: "Return Cycle", purpose: "Second advent consummation pattern" },
    ],
    sanctuary: [
      { id: "Gate", tag: "Gate", name: "Gate", purpose: "Entrance and access to God" },
      { id: "Altar", tag: "Altar", name: "Altar", purpose: "Sacrifice and atonement" },
      { id: "Laver", tag: "Laver", name: "Laver", purpose: "Cleansing and sanctification" },
      { id: "Lampstand", tag: "Lampstand", name: "Lampstand", purpose: "Light and witness" },
      { id: "Table", tag: "Table", name: "Table of Showbread", purpose: "Provision and communion" },
      { id: "Incense", tag: "Incense", name: "Incense Altar", purpose: "Prayer and intercession" },
      { id: "Veil", tag: "Veil", name: "Veil", purpose: "Separation and access" },
      { id: "Ark", tag: "Ark", name: "Ark of Covenant", purpose: "God's presence and throne" },
    ],
    feasts: [
      { id: "Passover", tag: "Passover", name: "Passover", purpose: "Deliverance and redemption" },
      { id: "UnleavenedBread", tag: "Unleavened", name: "Unleavened Bread", purpose: "Separation from sin" },
      { id: "Firstfruits", tag: "Firstfruits", name: "Firstfruits", purpose: "Resurrection and new life" },
      { id: "Pentecost", tag: "Pentecost", name: "Pentecost", purpose: "Holy Spirit and harvest" },
      { id: "Trumpets", tag: "Trumpets", name: "Trumpets", purpose: "Awakening and announcement" },
      { id: "Atonement", tag: "DOA", name: "Day of Atonement", purpose: "Judgment and cleansing" },
      { id: "Tabernacles", tag: "Tabernacles", name: "Tabernacles", purpose: "Dwelling and consummation" },
    ],
    horizons: [
      { id: "1H", tag: "1H", name: "First Day of Lord", purpose: "Babylon/return (Cyrus, post-exilic era)" },
      { id: "2H", tag: "2H", name: "Second Day of Lord", purpose: "70 AD, 'this generation,' church as temple" },
      { id: "3H", tag: "3H", name: "Third Day of Lord", purpose: "Global, final judgment/new creation" },
    ],
  };

  const handleAskJeeves = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question for Jeeves",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Find selected principle from any category
      let selectedPrinciple = null;
      for (const category of Object.values(principles)) {
        const found = category.find((p: any) => p.id === selectedRoom);
        if (found) {
          selectedPrinciple = found;
          break;
        }
      }
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "verse-assistant",
          book,
          chapter,
          verse,
          verseText,
          question,
          roomTag: selectedPrinciple?.tag || "General",
          roomName: selectedPrinciple?.name || "General Study",
          roomPurpose: selectedPrinciple?.purpose || "",
        },
      });

      if (error) throw error;

      setResponse(data.content);
    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response from Jeeves",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-elegant border-2 border-primary/20">
      <CardHeader className="gradient-palace text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                Ask Jeeves
                <Sparkles className="h-4 w-4 animate-pulse-glow" />
              </CardTitle>
              <CardDescription className="text-white/90 text-sm">
                {book} {chapter}:{verse}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        {/* Verse Display */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-sm italic text-foreground">{verseText}</p>
        </div>

        {/* Principle Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Select a Principle (Optional)
          </label>
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a principle to analyze through..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">General Analysis</SelectItem>
              
              {/* Dimensions */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                Dimensions
              </div>
              {principles.dimensions.map((principle) => (
                <SelectItem key={principle.id} value={principle.id}>
                  <div className="flex items-center gap-2">
                    <Badge className="gradient-palace text-white text-xs">
                      {principle.tag}
                    </Badge>
                    {principle.name}
                  </div>
                </SelectItem>
              ))}
              
              {/* Cycles */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                Covenant Cycles
              </div>
              {principles.cycles.map((principle) => (
                <SelectItem key={principle.id} value={principle.id}>
                  <div className="flex items-center gap-2">
                    <Badge className="gradient-ocean text-white text-xs">
                      {principle.tag}
                    </Badge>
                    {principle.name}
                  </div>
                </SelectItem>
              ))}
              
              {/* Sanctuary */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                Sanctuary Articles
              </div>
              {principles.sanctuary.map((principle) => (
                <SelectItem key={principle.id} value={principle.id}>
                  <div className="flex items-center gap-2">
                    <Badge className="gradient-royal text-white text-xs">
                      {principle.tag}
                    </Badge>
                    {principle.name}
                  </div>
                </SelectItem>
              ))}
              
              {/* Feasts */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                Feasts
              </div>
              {principles.feasts.map((principle) => (
                <SelectItem key={principle.id} value={principle.id}>
                  <div className="flex items-center gap-2">
                    <Badge className="gradient-sunset text-white text-xs">
                      {principle.tag}
                    </Badge>
                    {principle.name}
                  </div>
                </SelectItem>
              ))}
              
              {/* Three Day of Lords */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                Three Day of Lords/NH&E Cycles
              </div>
              {principles.horizons.map((principle) => (
                <SelectItem key={principle.id} value={principle.id}>
                  <div className="flex items-center gap-2">
                    <Badge className="gradient-forest text-white text-xs">
                      {principle.tag}
                    </Badge>
                    {principle.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Your Question
          </label>
          <Textarea
            placeholder="Ask Jeeves about this verse... (e.g., 'What symbols do you see here?' or 'How does this connect to Jesus?')"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Ask Button */}
        <Button
          onClick={handleAskJeeves}
          disabled={loading}
          className="w-full gradient-palace text-white shadow-blue"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Jeeves is thinking...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Ask Jeeves
            </>
          )}
        </Button>

        {/* Response Display */}
        {response && (
          <>
            <JeevesResponseValidator 
              response={response}
              onValidated={(isValid) => {
                if (!isValid) {
                  console.warn("Jeeves hallucinated content:", response);
                }
              }}
            />
            <ScrollArea className="h-[300px]">
              <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/30 animate-fade-in space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Jeeves responds:</span>
                </div>
                <div className="prose prose-sm max-w-none text-foreground">
                  {response.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-3 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
};
