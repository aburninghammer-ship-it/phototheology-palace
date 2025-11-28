import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Telescope, Sparkles, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProphecySignal {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  source_url?: string;
}

const ProphecyWatch = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signals, setSignals] = useState<ProphecySignal[]>([]);
  const [filter, setFilter] = useState("all");
  const [scope, setScope] = useState("america");
  const [timePeriod, setTimePeriod] = useState("1month");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadSignals();
    }
  }, [user]);

  const loadSignals = async () => {
    const { data } = await supabase
      .from("challenges")
      .select("*")
      .eq("challenge_type", "prophecy")
      .order("created_at", { ascending: false });

    if (data) {
      setSignals(
        data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          category: item.difficulty || "general",
          created_at: item.created_at,
          source_url: item.source_url,
        }))
      );
    }
  };

  const generateSignal = async () => {
    setGenerating(true);
    try {
      console.log("Calling jeeves with scope:", scope);
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "prophecy-signal",
          scope,
          timePeriod,
        },
      });

      console.log("Jeeves response:", { data, error });

      if (error) throw error;
      if (!data) throw new Error("No data returned from AI");

      const { error: insertError } = await supabase.from("challenges").insert({
        title: data.title,
        description: data.description,
        challenge_type: "prophecy",
        difficulty: data.category,
        verses: data.verses || [],
        source_url: data.source_url,
        search_timestamp: new Date().toISOString(),
      });

      console.log("Insert result:", insertError);

      if (insertError) throw insertError;

      toast({
        title: "Signal Generated",
        description: "New prophetic signal added to your watch list",
      });

      await loadSignals();
    } catch (error: any) {
      console.error("Generate signal error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate signal",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (!user) return null;

  const filteredSignals = filter === "all" ? signals : signals.filter((s) => s.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-block bg-white rounded-2xl p-6 shadow-lg mb-6">
              <Telescope className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Prophecy Watch</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Tracking real-world fulfillment of Matthew 24 and Revelation 13:11. Monitoring Christian Nationalism, 
              church-state erosion, and the dragon-like voice of apostate Christianity.
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-slate-800 text-white py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex gap-4 items-center flex-wrap">
              <div className="w-48">
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger className="h-16 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america">🇺🇸 America</SelectItem>
                    <SelectItem value="global">🌍 Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="h-16 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                    <SelectItem value="2years">Last 2 Years</SelectItem>
                    <SelectItem value="5years">Last 5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={generateSignal}
                disabled={generating}
                className="flex-1 h-16 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {generating ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating Signal...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Signal
                  </>
                )}
              </Button>
              <div className="w-64">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="h-16 bg-slate-700 border-slate-600 text-white">
                    <Filter className="mr-2 h-5 w-5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Signals</SelectItem>
                    <SelectItem value="church-state">Church-State Issues</SelectItem>
                    <SelectItem value="christian-nationalism">Christian Nationalism</SelectItem>
                    <SelectItem value="natural">Natural Disasters</SelectItem>
                    <SelectItem value="religious-liberty">Religious Liberty</SelectItem>
                    <SelectItem value="authoritarianism">Authoritarianism</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Signals List */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="text-2xl">What is Prophecy Watch?</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Prophecy Watch monitors real-world events through a historicist lens, tracking the fulfillment of Matthew 24 and Revelation 13:11. 
                We focus on observable trends: the rise of Christian Nationalism, erosion of church-state separation, increasing authoritarianism 
                within Christianity, racism in white evangelicalism, natural disasters, papal influence, Sunday law movements, and Ten Commandments 
                enforcement. Each signal examines how these developments fulfill prophecy about America (the lamb-like beast) speaking with the 
                dragon's voice. No sensationalism—just documented patterns of prophetic fulfillment.
              </CardDescription>
            </CardHeader>
          </Card>

          {filteredSignals.length === 0 ? (
            <div className="text-center py-20">
              <Telescope className="h-24 w-24 text-muted-foreground mx-auto mb-6 opacity-30" />
              <h2 className="text-2xl font-bold mb-2 text-muted-foreground">No Signals Yet</h2>
              <p className="text-muted-foreground mb-6">
                Generate your first prophetic signal to start watching. AI will analyze current events through a biblical lens.
              </p>
              <div className="max-w-2xl mx-auto mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <h3 className="font-semibold mb-3">Example Signal Categories:</h3>
                <div className="grid md:grid-cols-2 gap-3 text-left">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded">
                    <strong className="text-blue-600">Church-State:</strong> Religious symbols in government, faith-based policy initiatives
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded">
                    <strong className="text-red-600">Christian Nationalism:</strong> Christian supremacy movements, religious extremism
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded">
                    <strong className="text-green-600">Natural Disasters:</strong> Increasing climate events as signs of the times
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded">
                    <strong className="text-purple-600">Religious Liberty:</strong> Sunday law proposals, religious freedom restrictions
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded">
                    <strong className="text-orange-600">Authoritarianism:</strong> Hate speech by Christian leaders, NSPM-7 type policies
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded">
                    <strong className="text-yellow-600">Papal Influence:</strong> Vatican diplomatic moves, ecumenical developments
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSignals.map((signal) => (
                <Card key={signal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-xl mb-3">
                          <Telescope className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          {signal.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed whitespace-pre-line">
                          {signal.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">{signal.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 border-t">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-muted-foreground">
                        Detected: {new Date(signal.created_at).toLocaleDateString()}
                      </p>
                      {signal.source_url && (
                        <div className="flex items-center gap-2">
                          <a 
                            href={signal.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                          >
                            📰 Read Source Article →
                          </a>
                          <span className="text-xs text-muted-foreground italic" title="AI-generated links may become outdated or unavailable">
                            (link may expire)
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProphecyWatch;
