import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const QUICK_SITUATIONS = [
  { label: "😔 Grief & Loss", value: "I'm grieving the loss of a loved one" },
  { label: "😰 Anxiety", value: "I'm feeling anxious and overwhelmed" },
  { label: "🙏 Doubt", value: "I'm struggling with doubt in my faith" },
  { label: "😊 Gratitude", value: "I want to express gratitude to God" },
  { label: "💪 Strength", value: "I need strength for a difficult situation" },
  { label: "🕊️ Peace", value: "I'm looking for peace in chaos" },
  { label: "❤️ Forgiveness", value: "I need to forgive someone" },
  { label: "🌅 New Start", value: "I'm starting something new and need guidance" },
];

export default function SituationalVerseFinder() {
  const navigate = useNavigate();
  const [situation, setSituation] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const findVerses = async (input?: string) => {
    const query = input || situation;
    if (!query.trim()) return;
    setLoading(true);
    setResult("");
    abortRef.current = new AbortController();

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/situational-verses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ situation: query }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to find verses");

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
              setResult(accumulated);
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setResult("Error finding verses. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Verse Finder" description="Find Bible verses for your life situation" />
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Scripture for Your Situation</h1>
            <p className="text-sm text-muted-foreground">Tell us what you're going through — we'll find the right verses</p>
          </div>
        </div>

        {/* Quick situation buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_SITUATIONS.map((s) => (
            <Badge
              key={s.label}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3"
              onClick={() => {
                setSituation(s.value);
                findVerses(s.value);
              }}
            >
              {s.label}
            </Badge>
          ))}
        </div>

        {/* Custom input */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-3">
            <Textarea
              placeholder="What are you going through? (e.g., 'I'm feeling lonely and far from God')"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{situation.length}/500</span>
              <Button onClick={() => findVerses()} disabled={!situation.trim() || loading} className="gradient-palace">
                <Search className="mr-2 h-4 w-4" />
                {loading ? "Finding..." : "Find Verses"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {(result || loading) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Your Verses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{result || "Searching Scripture for your situation..."}</ReactMarkdown>
              </div>
              {loading && (
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Finding the most relevant passages...
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
