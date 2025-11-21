import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";

interface Connect6Props {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

const GENRES = [
  { code: "Pr", label: "Prophecy", example: "Daniel, Revelation, Isaiah" },
  { code: "Go", label: "Gospels", example: "Matthew, Mark, Luke, John" },
  { code: "Ep", label: "Epistles", example: "Romans, Corinthians, Hebrews" },
  { code: "Hi", label: "History", example: "Genesis, Exodus, Acts" },
  { code: "Po", label: "Poetry", example: "Psalms, Proverbs, Job" },
  { code: "Pa", label: "Parable", example: "Jesus' parables" }
];

export const Connect6Challenge = ({ challenge, onSubmit, hasSubmitted }: Connect6Props) => {
  const [connectedVerse, setConnectedVerse] = useState("");
  const [explanation, setExplanation] = useState("");

  const handleSubmit = () => {
    if (!connectedVerse.trim() || !explanation.trim()) return;
    
    onSubmit({
      starting_verse: challenge.verses?.[0],
      target_genre: challenge.ui_config?.targetGenre,
      connected_verse: connectedVerse.trim(),
      explanation: explanation.trim(),
      principle_applied: "Connect-6 (C6): Cross-Genre Synthesis"
    });
  };

  const targetGenre = GENRES.find(g => g.code === challenge.ui_config?.targetGenre);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <Badge variant="secondary">Core • 10-15 min</Badge>
        </div>
        <CardDescription className="mt-2">
          Principle: Connect-6 (C6) - Connect this text across multiple genres OR synthesize verses from all genres
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold mb-2">Starting Verse:</p>
          {challenge.passage_reference && (
            <p className="text-sm text-muted-foreground mb-1">{challenge.passage_reference}</p>
          )}
          <p className="text-lg italic mb-3">{challenge.verses?.[0] || challenge.ui_config?.verse_text || "Verse text not available"}</p>
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
        </div>

        {targetGenre && (
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <p className="font-semibold text-sm mb-1">Find a verse from:</p>
            <p className="text-lg font-bold text-primary">{targetGenre.label} ({targetGenre.code})</p>
            <p className="text-xs text-muted-foreground mt-1">Examples: {targetGenre.example}</p>
          </div>
        )}

        {!hasSubmitted ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Connected Verse:</label>
              <Input
                placeholder="e.g., John 1:3 'All things were made by him...'"
                value={connectedVerse}
                onChange={(e) => setConnectedVerse(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Explain the Connection (2-3 sentences):</label>
              <Textarea
                placeholder="How do these verses connect? What truth do they reveal together?"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={5}
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={!connectedVerse.trim() || !explanation.trim()}
            >
              Submit Chain Link
            </Button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✓ Chain link created! This trains you for biblical apologetics and evangelism.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
