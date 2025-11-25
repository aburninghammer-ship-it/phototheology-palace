import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { Sparkles, Scroll, Crown, MessageSquare, BookOpen, Search } from "lucide-react";
import { useEffect } from "react";

const DanielRevelationGPT = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load Daniel & Revelation GPT embed script');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Crown className="h-10 w-10 text-primary" />
              <h1 className="text-5xl font-bold text-primary">
                Daniel & Revelation GPT
              </h1>
              <HowItWorksDialog
                title="How to Use Daniel & Revelation GPT"
                steps={[
                  {
                    title: "AI-Powered Prophecy Assistant",
                    description: "This specialized AI assistant is trained specifically on the books of Daniel and Revelation to help you understand prophecy, symbolism, and timelines.",
                    highlights: [
                      "Prophecy-focused AI",
                      "Understands symbolism",
                      "Explains timelines"
                    ],
                    icon: Sparkles,
                  },
                  {
                    title: "Ask Questions",
                    description: "Type any question about Daniel or Revelation in the chat interface. Ask about beasts, numbers, prophecies, or connections between the two books.",
                    highlights: [
                      "Ask anything about prophecy",
                      "Explore symbols and beasts",
                      "Understand time prophecies"
                    ],
                    icon: MessageSquare,
                  },
                  {
                    title: "Explore Topics",
                    description: "Ask about specific topics like '70 weeks prophecy', 'four beasts', 'seals and trumpets', or 'the three angels messages'.",
                    highlights: [
                      "Prophecy timelines",
                      "Symbol interpretations",
                      "Historical fulfillment"
                    ],
                    icon: BookOpen,
                  },
                  {
                    title: "Deep Dive",
                    description: "Follow up with detailed questions to explore connections, parallel passages, and Phototheology applications.",
                    highlights: [
                      "Ask follow-up questions",
                      "Connect Daniel & Revelation",
                      "Apply PT principles"
                    ],
                    icon: Search,
                  },
                ]}
              />
            </div>
            <p className="text-xl text-muted-foreground">AI-Powered Prophecy Study Assistant</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Unlock the mysteries of biblical prophecy with AI guidance</span>
            </div>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
              <CardTitle className="text-2xl">Chat with Daniel & Revelation GPT</CardTitle>
              <CardDescription className="text-base">
                Explore the prophetic books of Daniel and Revelation. Ask questions about prophecy, symbolism, historical fulfillment, and end-time events from a historicist perspective.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                id="deployment-23a98e87-a2d5-400a-9cac-60b098de90b7"
                style={{ minHeight: '600px' }}
              />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default DanielRevelationGPT;
