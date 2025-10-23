import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";

const KidGPT = () => {
  useEffect(() => {
    // Load the Pickaxe embed script
    const script = document.createElement("script");
    script.src = "https://studio.pickaxe.co/api/embed/bundle.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-2 text-primary">
              <Bot className="h-10 w-10" />
              KidGPT 🤖
            </h1>
            <p className="text-xl text-muted-foreground">Your AI Bible Study Friend!</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Powered by AI to help you learn about Jesus</span>
            </div>
          </div>

          <Card className="border-4 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="text-2xl">Chat with KidGPT</CardTitle>
              <CardDescription className="text-base">
                Ask me anything about the Bible, Jesus, or your faith! I'm here to help you learn in a fun way.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                id="deployment-ac7e1d1e-1b82-4f73-812e-5d1d59b50f34"
                className="min-h-[600px] w-full"
              />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📖 Ask Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ask me about Bible stories, verses, or characters
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎨 Learn & Create</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get fun activities and creative ways to remember
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🌟 Grow in Faith</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Understand how to follow Jesus every day
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KidGPT;
