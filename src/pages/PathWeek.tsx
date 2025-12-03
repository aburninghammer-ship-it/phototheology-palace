import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Navigation } from "@/components/Navigation";
import { PathWeekOutline } from "@/components/path/PathWeekOutline";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PathWeek() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <SimplifiedNav />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <PathWeekOutline />
      </main>
      
      <Navigation />
    </div>
  );
}
