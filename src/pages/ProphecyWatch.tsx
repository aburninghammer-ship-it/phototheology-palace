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
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <Navigation />
      <main className="pt-16 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-sm text-white py-16 px-4"
        >
          <div className="container mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-6 border border-white/30"
            >
              <Telescope className="h-16 w-16 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold mb-4"
            >
              Prophecy Watch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 max-w-3xl mx-auto"
            >
              Tracking real-world fulfillment of Matthew 24 and Revelation 13:11. Monitoring Christian Nationalism, 
              church-state erosion, and the dragon-like voice of apostate Christianity.
            </motion.p>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/80 backdrop-blur-md text-white py-8 px-4 border-y border-white/10"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex gap-4 items-center flex-wrap">
              <div className="w-48">
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger className="h-16 bg-slate-700/50 backdrop-blur-sm border-slate-600/50 text-white">
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
                  <SelectTrigger className="h-16 bg-slate-700/50 backdrop-blur-sm border-slate-600/50 text-white">
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
                className="flex-1 h-16 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
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
                  <SelectTrigger className="h-16 bg-slate-700/50 backdrop-blur-sm border-slate-600/50 text-white">
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
        </motion.div>

        {/* Signals List */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card variant="glass" className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  What is Prophecy Watch?
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Prophecy Watch monitors real-world events through a historicist lens, tracking the fulfillment of Matthew 24 and Revelation 13:11. 
                  We focus on observable trends: the rise of Christian Nationalism, erosion of church-state separation, increasing authoritarianism 
                  within Christianity, racism in white evangelicalism, natural disasters, papal influence, Sunday law movements, and Ten Commandments 
                  enforcement. Each signal examines how these developments fulfill prophecy about America (the lamb-like beast) speaking with the 
                  dragon's voice. No sensationalism—just documented patterns of prophetic fulfillment.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          {filteredSignals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center py-20"
            >
              <Telescope className="h-24 w-24 text-muted-foreground mx-auto mb-6 opacity-30" />
              <h2 className="text-2xl font-bold mb-2 text-muted-foreground">No Signals Yet</h2>
              <p className="text-muted-foreground mb-6">
                Generate your first prophetic signal to start watching. AI will analyze current events through a biblical lens.
              </p>
              <Card variant="glass" className="max-w-2xl mx-auto mt-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Example Signal Categories:
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-left">
                    {[
                      { color: "text-blue-500", label: "Church-State:", desc: "Religious symbols in government, faith-based policy initiatives" },
                      { color: "text-red-500", label: "Christian Nationalism:", desc: "Christian supremacy movements, religious extremism" },
                      { color: "text-green-500", label: "Natural Disasters:", desc: "Increasing climate events as signs of the times" },
                      { color: "text-purple-500", label: "Religious Liberty:", desc: "Sunday law proposals, religious freedom restrictions" },
                      { color: "text-orange-500", label: "Authoritarianism:", desc: "Hate speech by Christian leaders, NSPM-7 type policies" },
                      { color: "text-yellow-500", label: "Papal Influence:", desc: "Vatican diplomatic moves, ecumenical developments" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10"
                      >
                        <strong className={item.color}>{item.label}</strong> {item.desc}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {filteredSignals.map((signal, index) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Card variant="glass" className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-xl mb-3">
                            <Telescope className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                              {signal.title}
                            </span>
                          </CardTitle>
                          <CardDescription className="text-base leading-relaxed whitespace-pre-line">
                            {signal.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0 bg-primary/10 backdrop-blur-sm">
                          {signal.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 border-t border-white/10">
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
                              className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 hover:underline font-medium transition-colors"
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
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProphecyWatch;
