import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { BibleNavigation } from "@/components/bible/BibleNavigation";
import { Button } from "@/components/ui/button";
import { BookMarked } from "lucide-react";
import { Link } from "react-router-dom";

const Bible = () => {
  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
                Phototheology Study Bible (PSB)
              </h1>
              <p className="text-lg text-muted-foreground">
                Scripture through principle lenses
              </p>
            </div>
            <Button asChild variant="outline" className="gradient-dreamy border-primary/20">
              <Link to="/memorization-verses">
                <BookMarked className="h-4 w-4 mr-2" />
                My Memorization Verses
              </Link>
            </Button>
          </div>

          {/* Navigation */}
          <div className="mb-8">
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
