import { FiveAscensionsStudy } from "@/components/five-ascensions/FiveAscensionsStudy";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FiveAscensions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Five Ascensions Study | Phototheology"
        description="Climb the staircase of Phototheology: from Text to Chapter to Book to Cycle to Heaven. Static anchored study or Dynamic creative exploration."
      />

      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Five Ascensions</h1>
            <p className="text-muted-foreground text-sm">
              Text → Chapter → Book → Cycle → Heaven
            </p>
          </div>
        </div>

        <FiveAscensionsStudy />
      </div>
    </div>
  );
};

export default FiveAscensions;
