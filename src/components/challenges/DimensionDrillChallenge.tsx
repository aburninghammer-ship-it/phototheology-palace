import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

interface DimensionDrillProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

const DIMENSIONS = [
  { value: "1d", label: "1D - Literal", description: "What does the text say plainly? Historical/grammatical meaning" },
  { value: "2d", label: "2D - Christ", description: "How does this verse point to Jesus personally?" },
  { value: "3d", label: "3D - Me", description: "How does this apply to my personal life and walk with God?" },
  { value: "4d", label: "4D - Church", description: "How does this apply to the Church body, mission, or remnant?" },
  { value: "5d", label: "5D - Heaven", description: "How does this relate to heaven, final conflict, or eternal perspective?" }
];

export const DimensionDrillChallenge = ({ challenge, onSubmit, hasSubmitted }: DimensionDrillProps) => {
  const [selectedDimension, setSelectedDimension] = useState<string>("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!selectedDimension || !answer.trim()) return;
    
    onSubmit({
      dimension: selectedDimension,
      answer: answer.trim(),
      principle_applied: "Dimensions Room (DR)"
    });
  };

  const selectedDim = DIMENSIONS.find(d => d.value === selectedDimension);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <Badge>Quick • 3-5 min</Badge>
        </div>
        <CardDescription className="mt-2">
          Principle: Dimensions Room (DR) - See Scripture in multiple layers
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

        {!hasSubmitted ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Your Dimension:</label>
              <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a dimension to explore..." />
                </SelectTrigger>
                <SelectContent>
                  {DIMENSIONS.map((dim) => (
                    <SelectItem key={dim.value} value={dim.value}>
                      {dim.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDim && (
                <p className="text-sm text-muted-foreground">{selectedDim.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Answer (1-2 sentences):</label>
              <Textarea
                placeholder="Write your reflection here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={!selectedDimension || !answer.trim()}
            >
              Submit to Growth Journal
            </Button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✓ Completed! Your reflection has been added to your Growth Journal.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
