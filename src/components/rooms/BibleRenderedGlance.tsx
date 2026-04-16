import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Grid3X3, X } from "lucide-react";
import { bibleRenderedSets, BibleRenderedSet } from "@/data/bibleRenderedSets";
import { getBibleRenderedImage } from "@/assets/bible-rendered";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const BibleRenderedGlance = () => {
  const [selectedSet, setSelectedSet] = useState<BibleRenderedSet | null>(null);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-primary" />
            At-a-Glance — All 51 Images
          </CardTitle>
          <CardDescription>
            The entire Bible compressed into 51 symbolic images. Tap any image to see details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 gap-1.5">
            {bibleRenderedSets.map((set, i) => {
              const img = getBibleRenderedImage(set.number);
              return (
                <motion.button
                  key={set.number}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/60 transition-all cursor-pointer group",
                    set.testament === "new" ? "ring-1 ring-blue-300/30" : ""
                  )}
                  onClick={() => setSelectedSet(set)}
                  title={`#${set.number}: ${set.name} — ${set.range}`}
                >
                  {img ? (
                    <img src={img} alt={set.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-lg">
                      {set.symbol}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {set.number}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {bibleRenderedSets.length} images · OT sets are neutral, <span className="text-blue-500">NT sets</span> have a blue ring
          </p>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSet} onOpenChange={() => setSelectedSet(null)}>
        <DialogContent className="max-w-md">
          {selectedSet && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Badge>#{selectedSet.number}</Badge>
                  {selectedSet.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {getBibleRenderedImage(selectedSet.number) && (
                  <img
                    src={getBibleRenderedImage(selectedSet.number)!}
                    alt={selectedSet.name}
                    className="w-full rounded-xl object-contain max-h-56"
                  />
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{selectedSet.range}</Badge>
                  <Badge variant={selectedSet.testament === "new" ? "default" : "secondary"}>
                    {selectedSet.testament === "new" ? "NT" : "OT"}
                  </Badge>
                  <Badge variant="outline">{selectedSet.chapters} ch</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedSet.description}</p>
                {selectedSet.symbols.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedSet.symbols.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BibleRenderedGlance;
