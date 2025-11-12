import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle2, Link2 } from "lucide-react";

interface SubjectConnectionChallengeProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

export const SubjectConnectionChallenge = ({ 
  challenge, 
  onSubmit, 
  hasSubmitted 
}: SubjectConnectionChallengeProps) => {
  const [connections, setConnections] = useState("");
  const [showHints, setShowHints] = useState(false);

  const subjects = challenge.ui_config?.subjects || [];
  const prompts = challenge.ui_config?.connection_prompts || [];
  const hints = challenge.ui_config?.hints || [];

  const handleSubmit = () => {
    onSubmit({
      type: "subject-connection",
      subjects,
      connections,
      principle_applied: challenge.principle_used,
    });
  };

  if (hasSubmitted) {
    return (
      <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="py-8 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <h3 className="font-semibold text-lg mb-2">Challenge Complete!</h3>
          <p className="text-muted-foreground">
            Your connections have been saved to your Growth Journal.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            {challenge.title}
          </CardTitle>
          <Badge variant="outline">{challenge.difficulty}</Badge>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Subjects to Connect */}
        <div>
          <h4 className="font-semibold mb-3">📚 Subjects to Connect:</h4>
          <div className="grid gap-3">
            {subjects.map((subject: string, idx: number) => (
              <div 
                key={idx}
                className="p-3 bg-primary/5 border border-primary/20 rounded-lg"
              >
                <p className="font-medium">{subject}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Prompts */}
        <div>
          <h4 className="font-semibold mb-3">🔍 Guiding Questions:</h4>
          <ul className="space-y-2">
            {prompts.map((prompt: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">{prompt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Answer Input */}
        <div>
          <label className="block font-semibold mb-2">
            Your Connections & Insights:
          </label>
          <Textarea
            value={connections}
            onChange={(e) => setConnections(e.target.value)}
            placeholder="Describe the connections you discovered between these subjects. Include:&#10;• Shared symbols or patterns&#10;• Christ-centered connections&#10;• Prophetic or typological links&#10;• Palace principles that reveal the connection&#10;• Specific verses that tie them together"
            className="min-h-[200px]"
          />
        </div>

        {/* Hints */}
        {hints.length > 0 && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(!showHints)}
              className="gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              {showHints ? "Hide" : "Show"} Hints
            </Button>
            
            {showHints && (
              <div className="mt-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="font-semibold text-sm mb-2">💡 Hints:</p>
                <ul className="space-y-2">
                  {hints.map((hint: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      {idx + 1}. {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={!connections.trim()}
          className="w-full"
          size="lg"
        >
          Submit Connections
        </Button>
      </CardContent>
    </Card>
  );
};