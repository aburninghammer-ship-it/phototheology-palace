import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const SAMPLE_QUESTIONS = [
  "What does Genesis 22 teach about faith?",
  "How does the sanctuary point to Jesus?",
  "What's the connection between Daniel 7 and Revelation?",
];

export const LiveAIDemoWidget = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAsk = async (questionText?: string) => {
    const q = questionText || question;
    if (!q.trim()) return;

    setIsLoading(true);
    setResponse("");

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { 
          message: q,
          context: "demo"
        }
      });

      if (error) throw error;

      setResponse(data.content || data.response || "No response received");
    } catch (error) {
      console.error('Error asking Jeeves:', error);
      const errorMessage = user 
        ? "Unable to process your question. Please try again."
        : "This is a preview. Sign up to chat with Jeeves, your AI study assistant who knows the Phototheology Palace method inside and out!";
      
      toast({
        title: user ? "Error" : "Demo unavailable",
        description: user ? "Please try again" : "Please sign up to access the full AI assistant",
        variant: "destructive",
      });
      setResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <Badge className="bg-primary/20 text-primary border-primary/30">Live AI Demo</Badge>
        </div>
        <CardTitle className="text-2xl">Try Jeeves, Your AI Study Assistant</CardTitle>
        <CardDescription>
          Ask any Bible question and see how Jeeves responds using Phototheology principles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sample Questions */}
        <div>
          <p className="text-sm font-medium mb-2">Try these questions:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuestion(q);
                  handleAsk(q);
                }}
                disabled={isLoading}
                className="text-xs"
              >
                {q}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask your Bible question..."
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleAsk()} 
            disabled={isLoading || !question.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Response */}
        {response && (
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <p className="text-sm font-medium mb-2 text-primary">Jeeves responds:</p>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {response}
            </p>
          </div>
        )}

        {isLoading && !response && (
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Jeeves is thinking...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
