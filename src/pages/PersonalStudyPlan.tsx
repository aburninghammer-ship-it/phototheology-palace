import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function PersonalStudyPlan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generatePlan = async () => {
    if (!user) return;
    setLoading(true);
    setPlan("");
    abortRef.current = new AbortController();

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-study-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({}),
        signal: abortRef.current.signal,
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to generate plan");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setPlan(accumulated);
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setPlan("Error generating plan. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Calendar className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-4">Personalized Study Plans</h1>
          <p className="text-muted-foreground mb-6">Sign in to get AI-powered study plans tailored to your Palace progress.</p>
          <Button onClick={() => navigate("/auth")} className="gradient-palace">Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="AI Study Plan" description="Get a personalized weekly Bible study plan based on your Palace progress" />
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Your Weekly Study Plan</h1>
            <p className="text-sm text-muted-foreground">AI-crafted based on your Palace progress and study history</p>
          </div>
        </div>

        {!plan && !loading ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <Sparkles className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-xl font-bold">Ready to plan your week?</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                AI will analyze your current Palace floor, completed rooms, recent study, and streak to create a personalized 7-day plan.
              </p>
              <Button onClick={generatePlan} size="lg" className="gradient-palace">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate My Study Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                This Week's Plan
              </CardTitle>
              <Button variant="outline" size="sm" onClick={generatePlan} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{plan || "Generating your personalized plan..."}</ReactMarkdown>
              </div>
              {loading && (
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing your progress and creating your plan...
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
