import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BibleChapter = () => {
  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/bible">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bible
            </Link>
          </Button>

          <BibleReader />
        </div>
      </div>
    </div>
  );
};

export default BibleChapter;
