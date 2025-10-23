import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Book, Image } from "lucide-react";
import { SandboxedEmbed } from "@/components/SandboxedEmbed";

const PhototheologyGPT = () => {

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-8">
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
              <SandboxedEmbed
                scriptUrl="https://phototheologygpt.com/api/embed/bundle.js"
                embedId="deployment-f6c8b84b-543b-4920-8ed5-3c8a817956c1"
                minHeight="600px"
                title="PhototheologyGPT Chat Interface"
              />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default PhototheologyGPT;
