import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const KidGPT = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8 md:py-8">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold flex items-center justify-center gap-2 text-primary">
                  <Bot className="h-8 w-8 md:h-10 md:w-10" />
                  Kid GPT 🤖
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">Your AI Bible Study Friend!</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>Powered by AI to help you learn about Jesus</span>
                </div>
              </div>
    
              <Card className="border-4 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle className="text-2xl">Chat with Kid GPT</CardTitle>
              <CardDescription className="text-base">
                Ask me anything about the Bible, Jesus, or your faith! I'm here to help you learn in a fun way.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-6">
              {!scriptLoaded && (
                <div className="flex items-center justify-center" style={{ minHeight: '600px' }}>
                  <p className="text-muted-foreground">Loading Kid GPT...</p>
                </div>
              )}
              <div 
                id="deployment-ac7e1d1e-1b82-4f73-812e-5d1d59b50f34"
                style={{ minHeight: '500px', width: '100%' }}
                className={!scriptLoaded ? 'hidden' : ''}
              />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default KidGPT;
