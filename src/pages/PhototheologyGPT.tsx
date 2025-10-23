import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Book, Image } from "lucide-react";

const PhototheologyGPT = () => {
  useEffect(() => {
    // Load the Phototheology embed script
    const script = document.createElement("script");
    script.src = "https://phototheologygpt.com/api/embed/bundle.js";
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-2 text-primary">
              <Image className="h-10 w-10" />
              PhototheologyGPT
            </h1>
            <p className="text-xl text-muted-foreground">AI-Powered Biblical Image Analysis & Study</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Discover deeper meanings through visual theology</span>
            </div>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="text-2xl">Chat with PhototheologyGPT</CardTitle>
              <CardDescription className="text-base">
                Explore the intersection of photography, art, and theology. Upload images, ask about biblical symbolism, or dive into visual representations of Scripture.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                id="deployment-f6c8b84b-543b-4920-8ed5-3c8a817956c1"
                className="min-h-[600px] w-full"
              />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Image className="h-5 w-5" />
                  Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload images and discover biblical themes and theological insights
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Book className="h-5 w-5" />
                  Scripture Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect visual elements to biblical passages and principles
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Memory Palace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create visual memory anchors for biblical concepts
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PhototheologyGPT;
