import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Scale, Link2, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StyledMarkdownSections } from "@/components/ui/styled-markdown";
import { motion } from "framer-motion";
import { QuickAudioButton } from "@/components/audio";

const CultureControversy = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const quickTopics = [
    "Black Lives Matter",
    "LGBTQ+",
    "Abortion",
    "Artificial Intelligence",
    "Christian Nationalism",
    "Climate Change",
    "Immigration",
    "Social Justice",
    "Transgender Issues",
    "Political Polarization",
    "MAGA",
  ];

  const analyzeTopic = async (topicText: string) => {
    if (!topicText.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Enter a cultural topic or paste a link to analyze",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setTopic(topicText);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "culture-controversy",
          topic: topicText,
        },
      });

      if (error) throw error;

      setAnalysis(data.content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl"
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-full blur-3xl"
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
          className="bg-gradient-to-br from-red-500/90 via-orange-500/90 to-pink-500/90 backdrop-blur-sm text-white py-16 px-4"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-start gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30"
              >
                <Scale className="h-12 w-12 text-white" />
              </motion.div>
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    C&C
                  </Badge>
                  <span className="text-white/90">Floor 0 - Advanced Modes</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl font-bold mb-4"
                >
                  Culture & Controversy
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl text-white/90 max-w-4xl"
                >
                  Analyze current events, cultural movements, and political topics through the clear
                  lens of Jesus' teachings.
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analysis Section */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card variant="glass" className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  Analyze a Cultural Topic or Link
                </h2>
                <p className="text-muted-foreground mb-6">
                  Enter any cultural topic, or paste a link to a news article, social media post, or
                  YouTube video.
                </p>

                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="e.g., Black Lives Matter, or paste a link..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && analyzeTopic(topic)}
                      className="pl-10 h-14 text-lg bg-background/50 backdrop-blur-sm border-white/20"
                    />
                  </div>
                  <Button
                    onClick={() => analyzeTopic(topic)}
                    disabled={analyzing}
                    className="h-14 px-8 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                  >
                    {analyzing ? (
                      <>
                        <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Or try:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickTopics.map((quickTopic, index) => (
                      <motion.div
                        key={quickTopic}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => analyzeTopic(quickTopic)}
                          disabled={analyzing}
                          className="bg-background/30 backdrop-blur-sm border-white/20 hover:bg-background/50 hover:border-primary/50 transition-all duration-300"
                        >
                          {quickTopic}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card variant="glass" className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl backdrop-blur-sm">
                        <Scale className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                          Biblical Analysis
                        </h3>
                        <p className="text-sm text-muted-foreground">Jesus-centered perspective on this topic</p>
                      </div>
                    </div>
                    <QuickAudioButton 
                      text={analysis} 
                      variant="outline"
                      size="default"
                      className="flex-shrink-0"
                    />
                  </div>
                  <ScrollArea className="h-[700px] pr-4">
                    <StyledMarkdownSections content={analysis} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CultureControversy;
