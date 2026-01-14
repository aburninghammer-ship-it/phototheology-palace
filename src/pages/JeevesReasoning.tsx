import { JeevesReasoningChat } from "@/components/jeeves/JeevesReasoningChat";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JeevesReasoning = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Jeeves Reasoning Engine | Phototheology"
        description="Explore Scripture with Jeeves: Explorer mode for discovery, Auditor mode for validation, and Architect mode for building theological frameworks."
      />
      
      <div className="container max-w-6xl mx-auto px-4 py-6">
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
            <h1 className="text-2xl font-bold">Jeeves Reasoning Engine</h1>
            <p className="text-muted-foreground text-sm">
              Explorer • Auditor • Architect
            </p>
          </div>
        </div>

        <JeevesReasoningChat />
      </div>
    </div>
  );
};

export default JeevesReasoning;
