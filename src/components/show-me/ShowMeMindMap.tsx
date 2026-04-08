import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Network, Loader2 } from "lucide-react";

const MindMapPalace = lazy(() => import("@/components/mind-map/MindMapPalace"));

interface ShowMeMindMapProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUse: () => void;
}

const SUGGESTED_VERSES = ["John 3:16", "Romans 8:28", "Psalm 23:1"];

export function ShowMeMindMap({ open, onOpenChange, onUse }: ShowMeMindMapProps) {
  const [selectedVerse, setSelectedVerse] = useState("");
  const [customVerse, setCustomVerse] = useState("");
  const [started, setStarted] = useState(false);

  const activeVerse = selectedVerse || customVerse;

  const handleGenerate = () => {
    if (!activeVerse.trim()) return;
    onUse();
    setStarted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStarted(false);
      setSelectedVerse("");
      setCustomVerse("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] flex flex-col p-0 bg-card/95 backdrop-blur-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 flex-shrink-0" />

        {!started ? (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <Network className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Mind Map</h2>
                <p className="text-sm text-muted-foreground">See how one verse connects to the entire Bible</p>
              </div>
            </div>

            {/* Suggested verses */}
            <p className="text-sm text-muted-foreground mb-3">Choose a verse:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_VERSES.map((v) => (
                <Button
                  key={v}
                  variant={selectedVerse === v ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedVerse(v);
                    setCustomVerse("");
                  }}
                  className={selectedVerse === v ? "bg-emerald-500 text-white" : ""}
                >
                  {v}
                </Button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Or type your own verse..."
                value={customVerse}
                onChange={(e) => {
                  setCustomVerse(e.target.value);
                  setSelectedVerse("");
                }}
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!activeVerse.trim()}
              className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            >
              <Network className="h-4 w-4" /> Generate Mind Map
            </Button>
          </div>
        ) : (
          <div className="flex-1 h-[70vh] md:h-[70vh] min-h-[60vh]">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                </div>
              }
            >
              <MindMapPalace
                embedded={true}
                initialText={activeVerse}
                initialMode="scholar"
              />
            </Suspense>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
