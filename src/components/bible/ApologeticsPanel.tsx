import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, Save, AlertTriangle, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApologeticsPanelProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

const COMMON_OBJECTIONS = [
  "Anti-Trinitarian Arguments",
  "Christ's Eternality Questioned",
  "Begotten vs Created Debate",
  "First Cause Theology",
  "Self-Existence Claims",
  "Sanctuary Typology Challenges",
  "Prophetic Timeline Disputes",
  "SDA Historical Objections",
];

export const ApologeticsPanel = ({ book, chapter, verse, verseText }: ApologeticsPanelProps) => {
  const [objections, setObjections] = useState<string[]>([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const verseRef = `${book} ${chapter}:${verse}`;

  useEffect(() => {
    loadApologeticsData();
  }, [book, chapter, verse]);

  const loadApologeticsData = async () => {
    setLoading(true);
    try {
      // Check if there's existing apologetics data for this verse
      // This would need a new table or field in an existing table
      // For now, we'll just load it from local state
      setSaved(false);
    } catch (error: any) {
      console.error("Error loading apologetics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleObjection = (objection: string) => {
    setObjections(prev =>
      prev.includes(objection)
        ? prev.filter(o => o !== objection)
        : [...prev, objection]
    );
  };

  const saveApologeticsNotes = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Save to user_gems table with proper structure
      const { error } = await supabase.from("user_gems").insert({
        user_id: userData.user.id,
        gem_name: `Apologetics: ${verseRef}`,
        gem_content: response,
        room_id: "apologetics",
        floor_number: 4, // Next Level floor for apologetics
        category: objections.join(", "),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Apologetics notes saved",
      });
      setSaved(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateApologeticResponse = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "apologetics-assistant",
          book,
          chapter,
          verseText: { verse, text: verseText },
          objections,
        },
      });

      if (error) throw error;
      setResponse(data.response);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate apologetic response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-pink-500/5 border-2 border-orange-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold text-foreground">Apologetics Spotlight</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Defense Ready
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        Tag common objections and prepare theological defenses for {verseRef}
      </p>

      {/* Common Objections */}
      <div>
        <p className="text-xs font-semibold mb-2 text-foreground">Common Objections:</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_OBJECTIONS.map((objection) => (
            <Badge
              key={objection}
              variant={objections.includes(objection) ? "default" : "outline"}
              className={`cursor-pointer transition-all hover-lift text-xs ${
                objections.includes(objection) ? "bg-orange-600 hover:bg-orange-700" : ""
              }`}
              onClick={() => toggleObjection(objection)}
            >
              {objection}
            </Badge>
          ))}
        </div>
      </div>

      {objections.length > 0 && (
        <Button
          onClick={generateApologeticResponse}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          size="sm"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {loading ? "Generating..." : "Generate PT Defense"}
        </Button>
      )}

      {/* Response Area */}
      <div>
        <p className="text-xs font-semibold mb-2 text-foreground">Your Defense Notes:</p>
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write your apologetic response, citing PT principles, sanctuary typology, and cross-references..."
          className="min-h-[150px] text-xs"
        />
      </div>

      {/* Save Button */}
      <div className="flex gap-2">
        <Button
          onClick={saveApologeticsNotes}
          disabled={loading || !response.trim()}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Save className="h-4 w-4 mr-2" />
          {saved ? "Saved!" : "Save Notes"}
        </Button>
      </div>

      {/* Quick Tips */}
      <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
        <p className="text-xs font-semibold mb-2 text-foreground">Quick Tips:</p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>• Reference PT rooms (e.g., CR for Christ-center, BL for Sanctuary)</li>
          <li>• Use Five Dimensions to build multi-layered defense</li>
          <li>• Cross-reference with typology from @T room</li>
          <li>• Apply cycles (@Ad, @CyC, etc.) to show fulfillment</li>
        </ul>
      </div>
    </Card>
  );
};
