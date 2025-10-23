import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, Calendar } from "lucide-react";

const LessonQuarterlyGPT = () => {
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
              <Calendar className="h-10 w-10" />
              Lesson Quarterly GPT
            </h1>
            <p className="text-xl text-muted-foreground">AI-Powered Sabbath School Study Guide</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Deepen your weekly Bible study with AI insights</span>
            </div>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
              <CardTitle className="text-2xl">Chat with Lesson Quarterly GPT</CardTitle>
              <CardDescription className="text-base">
                Get deeper insights into your quarterly lessons. Ask questions, explore connections, and discover practical applications for each week's study.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                id="deployment-1d681f37-c416-46d5-b565-d7e9673aeb14"
                className="min-h-[600px] w-full"
              />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Weekly Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore daily lessons with enhanced commentary and insights
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Quarterly Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Understand overarching themes and connections throughout the quarter
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Practical Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Discover how to apply biblical principles to daily life
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonQuarterlyGPT;
