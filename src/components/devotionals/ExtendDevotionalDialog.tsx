import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DevotionalPlan, useDevotionals } from "@/hooks/useDevotionals";

const EXTENSION_OPTIONS = [
  { days: 7, label: "7 Days", description: "One more week" },
  { days: 14, label: "14 Days", description: "Two more weeks" },
  { days: 21, label: "21 Days", description: "Three weeks" },
  { days: 30, label: "30 Days", description: "One month" },
  { days: 40, label: "40 Days", description: "Biblical journey" },
];

interface ExtendDevotionalDialogProps {
  plan: DevotionalPlan;
  trigger?: React.ReactNode;
}

export const ExtendDevotionalDialog = ({ plan, trigger }: ExtendDevotionalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const { extendPlan, isExtending } = useDevotionals();
  const { toast } = useToast();

  const handleExtend = async () => {
    if (!selectedDays) {
      toast({
        title: "Select Duration",
        description: "Please select how many days to add",
        variant: "destructive",
      });
      return;
    }

    try {
      await extendPlan.mutateAsync({
        planId: plan.id,
        additionalDays: selectedDays,
        theme: plan.theme,
        format: plan.format,
        studyStyle: plan.study_style,
        existingDuration: plan.duration,
      });
      setOpen(false);
      setSelectedDays(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950"
          >
            <Plus className="w-4 h-4" />
            Extend
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-background via-background to-emerald-50/50 dark:to-emerald-950/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
              <Plus className="w-4 h-4 text-white" />
            </div>
            Extend Your Journey
          </DialogTitle>
          <DialogDescription>
            Continue "{plan.title}" with more days of devotional content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Plan Info */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  {plan.title}
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  {plan.theme}
                </p>
              </div>
              <Badge variant="secondary" className="bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200">
                {plan.duration} days completed
              </Badge>
            </div>
          </div>

          {/* Extension Options */}
          <div>
            <label className="text-sm font-medium mb-3 block">How many more days?</label>
            <div className="grid grid-cols-2 gap-2">
              {EXTENSION_OPTIONS.map((option) => (
                <Button
                  key={option.days}
                  variant={selectedDays === option.days ? "default" : "outline"}
                  className={`h-auto py-3 flex flex-col items-center gap-1 ${
                    selectedDays === option.days
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0"
                      : "border-emerald-200 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-950"
                  }`}
                  onClick={() => setSelectedDays(option.days)}
                  disabled={isExtending}
                >
                  <span className="font-bold text-lg">{option.label}</span>
                  <span className="text-xs opacity-80">{option.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* New Total */}
          {selectedDays && (
            <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">New total duration:</span>
              <Badge variant="outline" className="text-lg font-bold">
                {plan.duration + selectedDays} days
              </Badge>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleExtend}
            disabled={!selectedDays || isExtending}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            {isExtending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating {selectedDays} New Days...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Extend by {selectedDays || "..."} Days
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Generation may take a few minutes for longer extensions
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
