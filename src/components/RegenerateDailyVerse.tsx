import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export const RegenerateDailyVerse = ({ onRegenerated }: { onRegenerated?: () => void }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const { error } = await supabase.functions.invoke('generate-daily-verse', {
        body: { force: true }
      });

      if (error) throw error;

      toast.success("New daily verse generated!");
      onRegenerated?.();
      
      // Reload page to show new verse
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error regenerating verse:', error);
      toast.error("Failed to generate new verse");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Button
      onClick={handleRegenerate}
      disabled={isRegenerating}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
      {isRegenerating ? 'Generating...' : 'Generate New Verse'}
    </Button>
  );
};
