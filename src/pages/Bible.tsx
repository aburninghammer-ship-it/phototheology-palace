import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { BibleNavigation } from "@/components/bible/BibleNavigation";
import { Button } from "@/components/ui/button";
import { BookMarked, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { StudyBibleDemoDialog } from "@/components/bible/StudyBibleDemoDialog";

const Bible = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
                Phototheology Study Bible (PSB)
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Scripture through principle lenses
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                className="border-accent/20 whitespace-nowrap"
                onClick={() => setDemoOpen(true)}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">How to Use</span>
                <span className="sm:hidden">Help</span>
              </Button>
              <Button asChild variant="outline" className="gradient-dreamy border-primary/20 whitespace-nowrap">
                <Link to="/memorization-verses">
                  <BookMarked className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">My Memorization Verses</span>
                  <span className="sm:hidden">Memorization</span>
                </Link>
              </Button>
            </div>
          </div>

          <StudyBibleDemoDialog open={demoOpen} onOpenChange={setDemoOpen} />

          {/* Navigation */}
          <div className="mb-6 sm:mb-8">
            <BibleNavigation />
          </div>

          {/* Bible Reader */}
          <BibleReader />
        </div>
      </div>
    </div>
  );
};

export default Bible;
