import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Church } from "lucide-react";

interface SanctuaryMapProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

const FURNITURE = [
  { id: "altar-sacrifice", label: "Altar of Sacrifice", meaning: "Cross, blood, confession" },
  { id: "laver", label: "Laver", meaning: "Cleansing, baptism, Word washing" },
  { id: "lampstand", label: "Lampstand", meaning: "Holy Spirit, Light of the world" },
  { id: "table", label: "Table of Shewbread", meaning: "Word of God, Bread of Life" },
  { id: "incense", label: "Altar of Incense", meaning: "Prayer, intercession" },
  { id: "ark", label: "Ark of the Covenant", meaning: "Law, mercy seat, God's throne" }
];

export const SanctuaryMapChallenge = ({ challenge, onSubmit, hasSubmitted }: SanctuaryMapProps) => {
  const [selectedFurniture, setSelectedFurniture] = useState<string>("");
  const [explanation, setExplanation] = useState("");

  const handleSubmit = () => {
    if (!selectedFurniture || !explanation.trim()) return;
    
    const furniture = FURNITURE.find(f => f.id === selectedFurniture);
    onSubmit({
      verse: challenge.verses?.[0],
      furniture: furniture?.label,
      explanation: explanation.trim(),
      principle_applied: "Sanctuary/Blueprint Room (BL)"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Church className="h-5 w-5 text-primary" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <Badge variant="secondary">Core • 10-15 min</Badge>
        </div>
        <CardDescription className="mt-2">
          Principle: Sanctuary Room (BL) - Map Scripture to the Blueprint of redemption
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold mb-2">Today's Verse:</p>
          {challenge.passage_reference && (
            <p className="text-sm text-muted-foreground mb-1">{challenge.passage_reference}</p>
          )}
          <p className="text-lg italic">{challenge.verses?.[0] || challenge.ui_config?.verse_text || "Verse text not available"}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Which sanctuary furniture matches this verse?</p>
          <div className="grid grid-cols-2 gap-2">
            {FURNITURE.map((item) => (
              <Button
                key={item.id}
                variant={selectedFurniture === item.id ? "default" : "outline"}
                className="h-auto py-3 px-4 flex flex-col items-start text-left"
                onClick={() => setSelectedFurniture(item.id)}
              >
                <span className="font-semibold text-sm">{item.label}</span>
                <span className="text-xs opacity-70 mt-1">{item.meaning}</span>
              </Button>
            ))}
          </div>
        </div>

        {!hasSubmitted ? (
          <>
            {selectedFurniture && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Explain Your Choice (1-2 sentences):</label>
                <Textarea
                  placeholder="Why did you choose this piece of furniture? How does it connect to the verse?"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={!selectedFurniture || !explanation.trim()}
            >
              Submit Sanctuary Mapping
            </Button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✓ Sanctuary map complete! You're building Blueprint literacy for end-time messaging.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
