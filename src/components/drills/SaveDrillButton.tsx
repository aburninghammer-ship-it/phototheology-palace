import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Check } from "lucide-react";
import { useSaveDrill, DrillSessionData } from "@/hooks/useSaveDrill";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface SaveDrillButtonProps {
  drillData: DrillSessionData;
  defaultName?: string;
  isCompleted?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onSaved?: (sessionId: string) => void;
}

export const SaveDrillButton = ({
  drillData,
  defaultName,
  isCompleted = false,
  variant = "outline",
  size = "default",
  className,
  onSaved,
}: SaveDrillButtonProps) => {
  const { user } = useAuth();
  const { saving, saveDrillSession } = useSaveDrill();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName || "");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const sessionId = await saveDrillSession(
      drillData,
      name || undefined,
      isCompleted
    );

    if (sessionId) {
      setSaved(true);
      setOpen(false);
      onSaved?.(sessionId);
      
      // Reset saved state after 2 seconds
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={saved ? "default" : variant}
          size={size}
          className={cn(
            saved && "bg-green-600 hover:bg-green-700",
            className
          )}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : saved ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saved ? "Saved!" : "Save Drill"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Drill</DialogTitle>
          <DialogDescription>
            Save this drill session to review later or continue practicing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              placeholder={`${drillData.mode} - ${drillData.verse_reference}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Mode:</strong> {drillData.mode}</p>
            <p><strong>Reference:</strong> {drillData.verse_reference}</p>
            {drillData.room_id && (
              <p><strong>Room:</strong> {drillData.room_id}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
