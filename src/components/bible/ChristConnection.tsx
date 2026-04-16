import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cross, Loader2, Sparkles } from "lucide-react";
import { callJeeves } from "@/lib/jeevesClient";
import { cn } from "@/lib/utils";

interface ChristConnectionProps {
  verseReference: string;
  verseText: string;
}

interface ChristConnectionResponse {
  connection?: string;
}

export const ChristConnection = ({ verseReference, verseText }: ChristConnectionProps) => {
  const [connection, setConnection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const fetchChristConnection = async () => {
    if (connection) {
      setIsVisible(!isVisible);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await callJeeves({
        mode: "christ-connection",
        verseReference,
        verseText,
      }, "bible-reader");

      const response = data as ChristConnectionResponse;
      if (!error && response?.connection) {
        setConnection(response.connection);
        setIsVisible(true);
      }
    } catch (err) {
      console.error("Error fetching Christ connection:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={fetchChristConnection}
        disabled={isLoading}
        className={cn(
          "gap-2 text-xs transition-all",
          isVisible && "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Cross className="h-3 w-3" />
        )}
        Christ Connection
        {connection && <Sparkles className="h-3 w-3" />}
      </Button>

      {isVisible && connection && (
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 animate-fade-in">
          <p className="text-sm text-amber-800 dark:text-amber-200 italic leading-relaxed">
            "{connection}"
          </p>
        </div>
      )}
    </div>
  );
};
