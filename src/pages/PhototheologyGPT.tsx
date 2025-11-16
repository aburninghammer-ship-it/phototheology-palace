import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Image } from "lucide-react";
import { useEffect, useState } from "react";

const PhototheologyGPT = () => {
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 md:pt-24 md:pb-8">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold flex items-center justify-center gap-2 text-primary">
                  <Image className="h-8 w-8 md:h-10 md:w-10" />
                  Phototheology GPT
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">AI-Powered Biblical Image Analysis & Study</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>Discover deeper meanings through visual theology</span>
                </div>
              </div>
    
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle className="text-2xl">Chat with Phototheology GPT</CardTitle>
              <CardDescription className="text-base">
                Explore the intersection of photography, art, and theology. Upload images, ask about biblical symbolism, or dive into visual representations of Scripture.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-6">
              {!scriptLoaded && (
                <div className="flex items-center justify-center" style={{ minHeight: '600px' }}>
                  <p className="text-muted-foreground">Loading Phototheology GPT...</p>
                </div>
              )}
              <div 
                id="deployment-b46b8e5c-2531-4030-aff5-ca67db822bc8"
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

export default PhototheologyGPT;
