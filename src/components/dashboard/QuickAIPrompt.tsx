import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VoiceInput } from "@/components/analyze/VoiceInput";

const quickPrompts = [
  "Explain sanctuary typology",
  "How does Genesis connect to Revelation?",
  "What are the 8 floors of the Palace?",
  "Help me memorize Romans 8",
];

export function QuickAIPrompt() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to Jeeves with the query
      navigate(`/jeeves?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    navigate(`/jeeves?q=${encodeURIComponent(prompt)}`);
  };

  const handleVoiceTranscript = (text: string) => {
    setQuery(prev => prev + (prev ? " " : "") + text);
  };

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-1.5">
              Ask Jeeves AI
              <Sparkles className="h-4 w-4 text-primary" />
            </h3>
            <p className="text-xs text-muted-foreground">
              Get instant Bible insights
            </p>
          </div>
        </div>

        {/* Input with Voice */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about the Bible..."
            className="flex-1 bg-background/50 border-primary/20 focus:border-primary"
          />
          <VoiceInput 
            onTranscript={handleVoiceTranscript} 
            disabled={false}
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            disabled={!query.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Quick Prompts */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Try these:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-background/50 hover:bg-primary/10 hover:border-primary/30"
                onClick={() => handleQuickPrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button 
          variant="ghost" 
          className="w-full text-primary hover:bg-primary/10"
          onClick={() => navigate("/jeeves")}
        >
          Open Full Jeeves Chat
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
